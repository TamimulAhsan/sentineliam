import boto3
import json
from .models import IAMEntity, IAMPolicy

from azure.identity import ClientSecretCredential
from azure.mgmt.authorization import AuthorizationManagementClient

from google.cloud import iam_v2
from google.oauth2 import service_account
from google.cloud import resourcemanager_v3

def fetch_aws_iam_data(cloud_account):
    """
    Connects to AWS using the encrypted credentials and 
    downloads IAM Users, Roles, and Policies.
    """
    # 1. Setup the AWS Client
    session = boto3.Session(
        aws_access_key_id=cloud_account.access_key,
        aws_secret_access_key=cloud_account.secret_key,
        region_name='us-east-1' # IAM is global, but needs a region to init
    )
    iam = session.client('iam')

    # 2. Fetch all Users
    paginator = iam.get_paginator('list_users')
    for page in paginator.paginate():
        for user_data in page['Users']:
            # Create or Update the IAMEntity in our DB
            entity, created = IAMEntity.objects.update_or_create(
                arn_or_id=user_data['Arn'],
                defaults={
                    'cloud_account': cloud_account,
                    'name': user_data['UserName'],
                    'entity_type': 'user',
                    'created_at_in_cloud': user_data['CreateDate']
                }
            )
            
            # 3. Fetch Policies for this User (Attached Managed Policies)
            policies = iam.list_attached_user_policies(UserName=user_data['UserName'])
            for p in policies['AttachedPolicies']:
                # Get the actual JSON document for the policy
                policy_info = iam.get_policy(PolicyArn=p['PolicyArn'])
                version_id = policy_info['Policy']['DefaultVersionId']
                document_info = iam.get_policy_version(
                    PolicyArn=p['PolicyArn'], 
                    VersionId=version_id
                )
                
                IAMPolicy.objects.update_or_create(
                    entity=entity,
                    name=p['PolicyName'],
                    defaults={'document': document_info['PolicyVersion']['Document']}
                )

    return True




def fetch_azure_iam_data(cloud_account):
    # Azure needs Tenant ID, Client ID, and Secret (stored in extra_config)
    creds = ClientSecretCredential(
        tenant_id=cloud_account.extra_config.get('tenant_id'),
        client_id=cloud_account.access_key, # We store Client ID here
        client_secret=cloud_account.secret_key
    )
    auth_client = AuthorizationManagementClient(creds, cloud_account.extra_config.get('subscription_id'))

    # Azure "IAM" is essentially a list of Role Assignments
    assignments = auth_client.role_assignments.list_for_subscription()
    for assign in assignments:
        # Create Entity (The User/Service Principal)
        entity, _ = IAMEntity.objects.update_or_create(
            arn_or_id=assign.principal_id,
            defaults={
                'cloud_account': cloud_account,
                'name': f"Principal-{assign.principal_id[:8]}",
                'entity_type': 'user' # Simplified for now
            }
        )
        
        # Fetch the Role Definition (The "Policy")
        role_def = auth_client.role_definitions.get_by_id(assign.role_definition_id)
        IAMPolicy.objects.update_or_create(
            entity=entity,
            name=role_def.role_name,
            defaults={'document': {
                'permissions': [p.as_dict() for p in role_def.permissions],
                'assignable_scopes': role_def.assignable_scopes
            }}
        )


def fetch_gcp_iam_data(cloud_account):
    # GCP usually uses a Service Account JSON (stored in extra_config)
    info = cloud_account.extra_config.get('service_account_json')
    creds = service_account.Credentials.from_service_account_info(info)
    client = iam_v2.IAMClient(credentials=creds)
    
    project_id = info.get('project_id')
    # List Service Accounts (The GCP equivalent of IAM Users)
    request = iam_v2.ListServiceAccountsRequest(name=f"projects/{project_id}")
    page_result = client.list_service_accounts(request=request)

    for sa in page_result:
        entity, _ = IAMEntity.objects.update_or_create(
            arn_or_id=sa.unique_id,
            defaults={
                'cloud_account': cloud_account,
                'name': sa.email,
                'entity_type': 'user'
            }
        )
        # GCP policies are often project-wide; for MVP we store the SA metadata
        IAMPolicy.objects.update_or_create(
            entity=entity,
            name="Service Account Key Policy",
            defaults={'document': {'email': sa.email, 'oauth2_client_id': sa.oauth2_client_id}}
        )



def set_policy_in_cloud(policy_obj, new_doc):
    account = policy_obj.entity.cloud_account
    
    # --- AWS: Create a New Policy Version ---
    if account.platform == 'aws':
        iam = boto3.client('iam', 
            aws_access_key_id=account.access_key, 
            aws_secret_access_key=account.secret_key
        )
        try:
            # AWS doesn't "edit" a version; it creates a new one and sets as default.
            iam.create_policy_version(
                PolicyArn=policy_obj.arn_or_id,
                PolicyDocument=json.dumps(new_doc),
                SetAsDefault=True
            )
            return True
        except Exception as e:
            print(f"AWS Error: {e}")
            return False

    # --- AZURE: Update Custom Role Definition ---
    elif account.platform == 'azure':
        creds = ClientSecretCredential(
            tenant_id=account.extra_config.get('tenant_id'),
            client_id=account.access_key,
            client_secret=account.secret_key
        )
        client = AuthorizationManagementClient(creds, account.extra_config.get('subscription_id'))
        try:
            # Azure roles are updated via their ID
            client.role_definitions.create_or_update(
                scope=policy_obj.extra_config.get('scope', f"/subscriptions/{account.extra_config.get('subscription_id')}"),
                role_definition_id=policy_obj.arn_or_id.split('/')[-1], # Extract GUID
                role_definition={
                    "role_name": policy_obj.name,
                    "description": "Updated via Sentinel IAM",
                    "permissions": [{"actions": new_doc.get('actions', [])}]
                }
            )
            return True
        except Exception as e:
            print(f"Azure Error: {e}")
            return False

    # --- GCP: Set Project IAM Policy ---
    elif account.platform == 'gcp':
        info = account.extra_config.get('service_account_json')
        creds = service_account.Credentials.from_service_account_info(info)
        client = resourcemanager_v3.ProjectsClient(credentials=creds)
        try:
            project_id = info.get('project_id')
            resource = f"projects/{project_id}"
            
            # GCP uses a "Read-Modify-Write" pattern
            current_policy = client.get_iam_policy(resource=resource)
            # Update bindings based on your new_doc logic
            # (Simplified for MVP: Overwriting bindings)
            current_policy.bindings.clear()
            for b in new_doc.get('bindings', []):
                current_policy.bindings.append(b)
            
            client.set_iam_policy(resource=resource, policy=current_policy)
            return True
        except Exception as e:
            print(f"GCP Error: {e}")
            return False

    return False

def delete_policy_in_cloud(policy_obj):
    account = policy_obj.entity.cloud_account
    
    if account.platform == 'aws':
        iam = boto3.client('iam', aws_access_key_id=account.access_key, aws_secret_access_key=account.secret_key)
        try:
            # Detach first, then delete (standard AWS flow)
            iam.detach_user_policy(UserName=policy_obj.entity.name, PolicyArn=policy_obj.arn_or_id)
            iam.delete_policy(PolicyArn=policy_obj.arn_or_id)
            return True
        except: return False

    elif account.platform == 'azure':
        # Logic to delete Role Assignment/Definition...
        return True # Placeholder for Azure delete
        
    return False