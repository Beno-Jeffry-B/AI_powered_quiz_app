"""
Quizzes URL Configuration — DFD 2.0 Generate Quiz
Mounted at: /api/v1/quizzes/
"""

from django.urls import path
from apps.quizzes.views import QuizGenerateView, QuizListView, QuizDetailView

urlpatterns = [
    path("generate/",         QuizGenerateView.as_view(), name="quiz-generate"),   # DFD 2.1
    path("",                  QuizListView.as_view(),     name="quiz-list"),        # DFD 2.2
    path("<uuid:quiz_id>/",   QuizDetailView.as_view(),  name="quiz-detail"),      # DFD 2.3
]
