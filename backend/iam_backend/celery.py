import os
from celery import Celery

# Set default Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'iam_backend.settings')

app = Celery('iam_backend')

# Load config from settings.py using a namespace
app.config_from_object('django.conf:settings', namespace='CELERY')

# Auto-discover tasks in your installed apps
app.autodiscover_tasks()