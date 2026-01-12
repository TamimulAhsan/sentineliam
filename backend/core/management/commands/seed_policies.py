import random
from django.core.management.base import BaseCommand
from django.utils import timezone
from core.models import User, CloudAccount, IAMEntity, IAMPolicy

class Command(BaseCommand):
    help = 'Populates the database with 30 diverse IAM policies'

    def handle(self, *args, **kwargs):
        # 1. Cleanup existing data (order matters due to ForeignKeys)
        self.stdout.write("Cleaning up old data...")
        IAMPolicy.objects.all().delete()
        IAMEntity.objects.all().delete()
        CloudAccount.objects.all().delete()
        # We'll keep the superuser if it exists, otherwise create a dummy
        user = User.objects.filter(is_superuser=True).first()
        if not user:
            user = User.objects.create_user(
                email="admin@missioncontrol.local",
                password="password123"
            )

        platforms = ['aws', 'azure', 'gcp']
        entity_types = ['user', 'role', 'group']
        base_names = ['Admin', 'Dev', 'Storage', 'Lambda', 'Scanner', 'Billing']
        
        self.stdout.write("Seeding Cloud Accounts...")
        
        # 2. Create one Cloud Account for each platform
        accounts = {}
        for p in platforms:
            acc = CloudAccount.objects.create(
                user=user,
                name=f"Production {p.upper()}",
                platform=p,
                is_active=True,
                last_sync_status=True,
                last_sync_at=timezone.now()
            )
            accounts[p] = acc

        self.stdout.write("Seeding Entities and Policies...")

        # 3. Create 30 Entries
        for i in range(30):
            platform = random.choice(platforms)
            selected_account = accounts[platform]
            e_type = random.choice(entity_types)
            e_name = f"{random.choice(base_names)}_{i}"
            risk_score = random.randint(0, 100)
            
            # 4. Create the Entity
            entity_obj = IAMEntity.objects.create(
                cloud_account=selected_account,
                name=e_name,
                arn_or_id=f"arn:{platform}:iam::id:{e_type}/{e_name}_{i}", # Ensure uniqueness
                entity_type=e_type,
                created_at_in_cloud=timezone.now(),
                last_used=timezone.now()
            )
            
            # 5. Create Mock Document
            doc = {
                "Version": "2012-10-17",
                "Statement": [{
                    "Effect": "Allow" if risk_score < 80 else "Deny",
                    "Action": "*" if risk_score > 90 else "iam:Get*",
                    "Resource": "*"
                }]
            }

            # 6. Create the Policy
            IAMPolicy.objects.create(
                entity=entity_obj,
                name=f"Policy_{e_name}",
                document=doc,
                risk_score=risk_score,
                is_vulnerable=risk_score > 70,
                finding_details={
                    "reason": "Wildcard access detected" if risk_score > 70 else "Baseline check passed",
                    "timestamp": timezone.now().isoformat()
                }
            )

        self.stdout.write(self.style.SUCCESS('Successfully seeded 30 policies across all platforms!'))