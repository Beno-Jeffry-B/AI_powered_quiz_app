"""
Attempts URL Configuration — DFD 4.0 Submit Quiz Attempt
Mounted at: /api/v1/attempts/
"""

from django.urls import path
from apps.attempts.views import SubmitQuizAttemptView, AttemptHistoryView

urlpatterns = [
    path("",         SubmitQuizAttemptView.as_view(), name="submit-attempt"), # DFD 4.1
    path("history/", AttemptHistoryView.as_view(),    name="attempt-history"), # DFD 4.2
]
