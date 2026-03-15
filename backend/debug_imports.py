import os
import sys

# Set up Django environment
sys.path.append(os.getcwd())
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

import django
django.setup()

try:
    from config.urls import urlpatterns
    print("URL configuration loaded successfully.")
except Exception as e:
    import traceback
    traceback.print_exc()
