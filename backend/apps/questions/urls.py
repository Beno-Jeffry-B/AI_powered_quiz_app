"""
Questions URL Configuration — DFD 3.0 Retrieve Quiz Questions
Mounted at: /api/v1/questions/
"""

from django.urls import path
from apps.questions.views import QuizQuestionsView

urlpatterns = [
    path("quiz/<uuid:quiz_id>/", QuizQuestionsView.as_view(), name="quiz-questions"),  # DFD 3.1
]
