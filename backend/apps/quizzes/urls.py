"""
Quizzes URL Configuration — DFD 2.0 Generate Quiz
Mounted at: /api/v1/quizzes/
"""

from django.urls import path
from apps.quizzes.views import GenerateQuizView, QuizListView, QuizDetailView

urlpatterns = [
    path("generate/",         GenerateQuizView.as_view(), name="generate-quiz"),   # DFD 2.1
    path("",                  QuizListView.as_view(),     name="quiz-list"),        # DFD 2.2
    path("<uuid:quiz_id>/",   QuizDetailView.as_view(),  name="quiz-detail"),      # DFD 2.3
]
