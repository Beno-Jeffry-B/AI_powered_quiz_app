import uuid
from django.db import models
from apps.users.models import User
from apps.quizzes.models import Quiz



# ER TABLE: QuizAttempts
# DFD Module: 4.0 Submit Quiz Attempt
class QuizAttempt(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    quiz = models.ForeignKey(
        Quiz,
        on_delete=models.CASCADE,
        related_name="attempts"
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    score = models.IntegerField(null=True, blank=True)

    total_questions = models.IntegerField()

    attempted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Attempt {self.id}"


# ER TABLE: UserAnswers
# DFD Module: 4.0 Submit Quiz Attempt
class UserAnswer(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    attempt = models.ForeignKey(
        QuizAttempt,
        on_delete=models.CASCADE,
        related_name="answers"
    )

    question = models.ForeignKey(
        "questions.Question",
        on_delete=models.CASCADE
    )

    selected_option = models.CharField(max_length=1)

    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return f"Answer {self.id}"