"""
Users Services — DFD 1.0 User Authentication
"""
from rest_framework.exceptions import AuthenticationFailed
from apps.users.models import User

# DFD 1.0 — Business logic layer for user authentication
class UserService:
    """
    Service class for all user-related operations.
    Delegates from views; keeps views thin.
    """

    @staticmethod
    def register_user(validated_data: dict):
        """
        DFD 1.0 — Process 1.1: Register User
        TODO: Hash password, create User record, return tokens.
        """
        raise NotImplementedError("Implement in DFD 1.0 Authentication module.")

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
            raise AuthenticationFailed("Invalid email or password")
            
        if not user.check_password(password):
            raise AuthenticationFailed("Invalid email or password")
            
        return user

    @staticmethod
    def get_user_profile(user_id: str):
        """
        DFD 1.0 — Process 1.3: Retrieve User Profile
        TODO: Fetch and return user data by ID.
        """
        raise NotImplementedError("Implement in DFD 1.0 Authentication module.")
