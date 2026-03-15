"""
Users Services — DFD 1.0 User Authentication
"""
from django.utils import timezone
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken
from apps.users.models import User

# DFD 1.0 — Business logic layer for user authentication
class UserService:
    """
    Service class for all user-related operations.
    Delegates from views; keeps views thin.
    """

    @staticmethod
    def register_user(email: str, password: str):
        """
        DFD 1.0 — Process 1.1: Register User
        Creates the user with a hashed password and returns JWT tokens.
        """
        if User.objects.filter(email=email).exists():
            raise ValueError("A user with this email already exists.")

        user = User.objects.create_user(
            email=email,
            username=email,   # use email as username fallback
            password=password
        )
        return user

    @staticmethod
    def login_user(email: str, password: str):
        """
        DFD 1.0 — Process 1.2: Authenticate User
        TODO: Verify credentials, return JWT access + refresh tokens.
        """
        raise NotImplementedError("Implement in DFD 1.0 Authentication module.")

    @staticmethod
    def verify_user(email: str, password: str):
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise AuthenticationFailed("User not found. Please sign up first.")
            
        if not user.check_password(password):
            raise AuthenticationFailed("Invalid password. Please try again.")
            
        user.last_login = timezone.now()
        user.save(update_fields=["last_login"])
        
        return user

    @staticmethod
    def generate_auth_tokens(user):
        refresh = RefreshToken.for_user(user)
        return {
            "access_token": str(refresh.access_token),
            "refresh_token": str(refresh)
        }

    @staticmethod
    def get_user_profile(user_id: str):
        """
        DFD 1.0 — Process 1.3: Retrieve User Profile
        TODO: Fetch and return user data by ID.
        """
        raise NotImplementedError("Implement in DFD 1.0 Authentication module.")
