import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser


# ER TABLE: Users
# DFD Module: 1.0 User Authentication

class User(AbstractUser):
    """
    Custom user model based on ER diagram.

    ER Fields:
    id (PK, UUID)
    email
    password_hash
    created_at
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    email = models.EmailField(unique=True)

    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return self.email