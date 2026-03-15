import os
import sys
import django

# Set up Django
sys.path.append(os.getcwd())
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from apps.users.services import UserService
from apps.users.models import User

# Test email
test_email = "test@example.com"

# Ensure user exists for testing
if not User.objects.filter(email=test_email).exists():
    User.objects.create_user(email=test_email, username="testuser", password="testpassword123")

print(f"Attempting password reset request for {test_email}...")
try:
    UserService.request_password_reset(test_email)
    print("Success!")
except Exception as e:
    import traceback
    print(f"Error occurred: {type(e).__name__}")
    traceback.print_exc()
