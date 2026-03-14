import uuid
from django.db import models
from apps.users.models import User


# ER TABLE: Quizzes
# DFD Module: 2.0 Generate Quiz

class Quiz(models.Model):
    """
    Represents a generated quiz.

    ER Fields:
    id (PK)
    user_id (FK)
    topic
    difficulty
    created_at
    """

    DIFFICULTY_CHOICES = [
        ("easy", "Easy"),
        ("medium", "Medium"),
        ("hard", "Hard"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="quizzes"
    )

    topic = models.CharField(max_length=255)

    difficulty = models.CharField(
        max_length=10,
        choices=DIFFICULTY_CHOICES
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.topic} - {self.difficulty}"