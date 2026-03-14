"""
Attempts URL Configuration — DFD 4.0 Submit Quiz Attempt
Mounted at: /api/v1/attempts/
"""

from django.urls import path
from apps.attempts.views import SubmitAttemptView, AttemptHistoryView

urlpatterns = [
    path("submit/",  SubmitAttemptView.as_view(),  name="attempt-submit"),   # DFD 4.1
    path("history/", AttemptHistoryView.as_view(), name="attempt-history"),  # DFD 4.2
]
