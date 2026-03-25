"""
Users Services — DFD 1.0 User Authentication
"""


from django.utils import timezone
from django.contrib.auth import get_user_model
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class UserService:

    @classmethod
    def register_user(cls, email: str, password: str):
        if User.objects.filter(email=email).exists():
            raise ValueError("A user with this email already exists.")

        return User.objects.create_user(
            email=email,
            username=email,
            password=password
        )

    @classmethod
    def login_user(cls, email: str, password: str):
        user = cls.verify_user(email, password)
        tokens = cls.generate_auth_tokens(user)

        return {
            "user": user,
            "tokens": tokens
        }

    @classmethod
    def verify_user(cls, email: str, password: str):
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise AuthenticationFailed("User not found. Please sign up first.")

        if not user.check_password(password):
            raise AuthenticationFailed("Invalid password. Please try again.")

        user.last_login = timezone.now()
        user.save(update_fields=["last_login"])

        return user

    @classmethod
    def generate_auth_tokens(cls, user):
        refresh = RefreshToken.for_user(user)

        return {
            "access_token": str(refresh.access_token),
            "refresh_token": str(refresh)
        }

    @classmethod
    def get_user_profile(cls, user):
        return user