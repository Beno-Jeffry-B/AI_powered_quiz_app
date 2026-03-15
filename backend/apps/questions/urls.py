"""
Questions URL Configuration — DFD 3.0 Retrieve Quiz Questions
Mounted at: /api/v1/questions/
"""

from django.urls import path
from apps.questions.views import RetrieveQuizQuestionsView, RetrieveQuestionDetailView

urlpatterns = [
    path("quiz/<uuid:quiz_id>/questions/", RetrieveQuizQuestionsView.as_view(), name="quiz-questions"),  # DFD 3.1
    path("<uuid:question_id>/",            RetrieveQuestionDetailView.as_view(), name="question-detail"), # DFD 3.2
]
