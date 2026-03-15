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
    created_by (FK)
    title
    difficulty
    question_count
    status
    created_at
    """

    DIFFICULTY_CHOICES = [
        ("easy", "Easy"),
        ("medium", "Medium"),
        ("hard", "Hard"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="quizzes"
    )

    title = models.CharField(max_length=255)

    difficulty = models.CharField(
        max_length=10,
        choices=DIFFICULTY_CHOICES
    )

    question_count = models.IntegerField(default=5)

    status = models.CharField(
        max_length=20,
        default="pending"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.difficulty}"