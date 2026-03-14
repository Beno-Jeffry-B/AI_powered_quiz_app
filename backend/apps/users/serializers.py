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
        # TODO (DFD 1.0): delegate to UserService.register_user()
        raise NotImplementedError("Implement in DFD 1.0 Authentication module.")


# DFD 1.0 — Serialise login input
class LoginSerializer(serializers.Serializer):
    email    = serializers.EmailField()
    password = serializers.CharField(write_only=True)
