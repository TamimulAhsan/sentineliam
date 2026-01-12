from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from encrypted_fields.fields import EncryptedCharField, EncryptedJSONField
from django.db import models

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True, blank=True, null=True)
    
    # Dashboard Profile Fields
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    
    # Security Features (2FA)
    is_2fa_enabled = models.BooleanField(default=False)
    otp_secret = models.CharField(max_length=32, blank=True, null=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'  # Use email to log in
    REQUIRED_FIELDS = []      # Email and Password are required by default

    def __str__(self):
        return self.email
    



class CloudAccount(models.Model):
    PLATFORM_CHOICES = [
        ('aws', 'Amazon Web Services'),
        ('azure', 'Microsoft Azure'),
        ('gcp', 'Google Cloud Platform'),
    ]

    user = models.ForeignKey('core.User', on_delete=models.CASCADE, related_name='cloud_accounts')
    name = models.CharField(max_length=100, help_text="e.g. Production AWS")
    platform = models.CharField(max_length=10, choices=PLATFORM_CHOICES)
    
    # Visual Status Indicator (Green/Red light logic)
    is_active = models.BooleanField(default=True)
    last_sync_status = models.BooleanField(default=False) # True = Green, False = Red
    last_sync_at = models.DateTimeField(null=True, blank=True)

    # SECURE CREDENTIALS SECTION
    # These will be encrypted in Postgres
    access_key = EncryptedCharField(max_length=255, blank=True, null=True)
    secret_key = EncryptedCharField(max_length=255, blank=True, null=True)
    
    # For Azure/GCP which use more complex JSON or multiple IDs
    extra_config = EncryptedJSONField(blank=True, null=True, help_text="Store TenantID, ProjectID, etc.")

    def __str__(self):
        return f"{self.name} ({self.platform.upper()})"





class IAMEntity(models.Model):
    ENTITY_TYPES = [
        ('user', 'User'),
        ('role', 'Role'),
        ('group', 'Group'),
    ]

    cloud_account = models.ForeignKey(CloudAccount, on_delete=models.CASCADE, related_name='entities')
    name = models.CharField(max_length=255)
    arn_or_id = models.CharField(max_length=512, unique=True, help_text="The unique cloud identifier (e.g. AWS ARN)")
    entity_type = models.CharField(max_length=10, choices=ENTITY_TYPES)
    
    # Metadata for the frontend
    created_at_in_cloud = models.DateTimeField(null=True, blank=True)
    last_used = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.entity_type.upper()}: {self.name}"

class IAMPolicy(models.Model):
    entity = models.ForeignKey(IAMEntity, on_delete=models.CASCADE, related_name='policies')
    name = models.CharField(max_length=255)
    
    # The actual JSON policy document from AWS/Azure
    document = models.JSONField(help_text="The raw JSON policy structure")
    
    # Security Scoring
    is_vulnerable = models.BooleanField(default=False)
    risk_score = models.IntegerField(default=0) # 0-100
    finding_details = models.JSONField(default=dict, blank=True) # e.g. {"reason": "Wildcard Admin Access"}

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Policy: {self.name} for {self.entity.name}"