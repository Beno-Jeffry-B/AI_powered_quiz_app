"""
Users Serializers — DFD 1.0 User Authentication
"""

from rest_framework import serializers
from apps.users.models import User


# DFD 1.0 — Serialise User data for registration and profile responses
class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ["id", "email", "username", "created_at"]
        read_only_fields = ["id", "created_at"]


# DFD 1.0 — Serialise registration input (includes write-only password)
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ["email", "username", "password"]

    def create(self, validated_data):
        from apps.users.services import UserService

        return UserService.register_user(
            email=validated_data["email"],
            password=validated_data["password"]
        )



class LoginRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(
        error_messages={
            "required": "Email is required",
            "blank": "Email is required",
            "invalid": "Enter a valid email address"
        }
    )
    password = serializers.CharField(
        min_length=6,
        error_messages={
            "required": "Password is required",
            "blank": "Password is required",
            "min_length": "Password must be at least 6 characters long"
        }
    )
