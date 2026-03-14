import uuid
from django.db import models
from apps.quizzes.models import Quiz


# ER TABLE: Questions
# DFD Module: 2.0 Generate Quiz

class Question(models.Model):
    """
    Stores generated questions for a quiz.

    ER Fields:
    id (PK)
    quiz_id (FK)
    question_text
    option_a
    option_b
    option_c
    option_d
    correct_answer
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    quiz = models.ForeignKey(
        Quiz,
        on_delete=models.CASCADE,
        related_name="questions"
    )

    question_text = models.TextField()

    option_a = models.CharField(max_length=255)
    option_b = models.CharField(max_length=255)
    option_c = models.CharField(max_length=255)
    option_d = models.CharField(max_length=255)

    correct_answer = models.CharField(max_length=1)

    def __str__(self):
        return self.question_text[:50]