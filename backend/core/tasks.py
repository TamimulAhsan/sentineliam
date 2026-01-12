import boto3
from celery import shared_task
from django.utils import timezone
from .models import CloudAccount, IAMEntity, IAMPolicy
from .scanner import SecurityScanner  # We'll put the scanner logic in a separate file next

# --- AZURE & GCP SDK IMPORTS ---
from azure.identity import ClientSecretCredential
from azure.mgmt.authorization import AuthorizationManagementClient
from google.oauth2 import service_account
from google.cloud import iam_v1

@shared_task
def sync_cloud_iam(account_id):
    """The master background task to sync and scan cloud accounts."""
    try:
        account = CloudAccount.objects.get(id=account_id)
        
        # 1. Routing to the correct fetcher
        if account.platform == 'aws':
            fetch_aws_iam_data(account)
        elif account.platform == 'azure':
            fetch_azure_iam_data(account)
        elif account.platform == 'gcp':
            fetch_gcp_iam_data(account)
        
        # 2. Update Status for the "Green Light" dashboard
        account.last_sync_status = True
        account.last_sync_at = timezone.now()
        account.save()
        
        return f"Successfully synced and scanned {account.name}"

    except Exception as e:
        # Mark as "Red Light" if sync fails
        if 'account' in locals():
            account.last_sync_status = False
            account.save()
        return f"Error syncing {account_id}: {str(e)}"

# --- PLATFORM SPECIFIC FETCHERS ---

def fetch_aws_iam_data(account):
    session = boto3.Session(
        aws_access_key_id=account.access_key,
        aws_secret_access_key=account.secret_key,
        region_name='us-east-1'
    )
    iam = session.client('iam')
    paginator = iam.get_paginator('list_users')

    for page in paginator.paginate():
        for user_data in page['Users']:
            entity, _ = IAMEntity.objects.update_or_create(
                arn_or_id=user_data['Arn'],
                defaults={
                    'cloud_account': account,
                    'name': user_data['UserName'],
                    'entity_type': 'user',
                    'created_at_in_cloud': user_data['CreateDate']
                }
            )
            # Fetch Policy & Scan
            policies = iam.list_attached_user_policies(UserName=user_data['UserName'])
            for p in policies['AttachedPolicies']:
                policy_info = iam.get_policy(PolicyArn=p['PolicyArn'])
                doc = iam.get_policy_version(
                    PolicyArn=p['PolicyArn'], 
                    VersionId=policy_info['Policy']['DefaultVersionId']
                )['PolicyVersion']['Document']
                
                # Perform Security Scan
                run_security_scan(entity, p['PolicyName'], doc, 'aws')

def fetch_azure_iam_data(account):
    creds = ClientSecretCredential(
        tenant_id=account.extra_config.get('tenant_id'),
        client_id=account.access_key,
        client_secret=account.secret_key
    )
    auth_client = AuthorizationManagementClient(creds, account.extra_config.get('subscription_id'))
    
    for assign in auth_client.role_assignments.list_for_subscription():
        entity, _ = IAMEntity.objects.update_or_create(
            arn_or_id=assign.principal_id,
            defaults={'cloud_account': account, 'name': f"Azure-Principal-{assign.principal_id[:8]}", 'entity_type': 'user'}
        )
        role_def = auth_client.role_definitions.get_by_id(assign.role_definition_id)
        doc = {'actions': role_def.permissions[0].actions if role_def.permissions else []}
        run_security_scan(entity, role_def.role_name, doc, 'azure')

def fetch_gcp_iam_data(account):
    info = account.extra_config.get('service_account_json')
    creds = service_account.Credentials.from_service_account_info(info)
    client = iam_v1.IAMClient(credentials=creds)
    project_id = info.get('project_id')
    
    for sa in client.list_service_accounts(name=f"projects/{project_id}"):
        entity, _ = IAMEntity.objects.update_or_create(
            arn_or_id=sa.unique_id,
            defaults={'cloud_account': account, 'name': sa.email, 'entity_type': 'user'}
        )
        doc = {'email': sa.email, 'unique_id': sa.unique_id}
        run_security_scan(entity, "GCP Service Account Policy", doc, 'gcp')

# --- THE SCANNER HOOK ---

def run_security_scan(entity, policy_name, document, platform):
    """Helper to run the scanner and save results."""
    scanner = SecurityScanner(document)
    
    if platform == 'aws':
        score, findings = scanner.scan_aws()
    elif platform == 'azure':
        score, findings = scanner.scan_azure()
    else:
        score, findings = 0, []

    IAMPolicy.objects.update_or_create(
        entity=entity,
        name=policy_name,
        defaults={
            'document': document,
            'risk_score': score,
            'finding_details': {"issues": findings},
            'is_vulnerable': score > 50
        }
    )