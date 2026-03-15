"""
Evaluation URL Configuration — DFD 5.0 Evaluate Answers
Mounted at: /api/v1/evaluation/
"""

from django.urls import path
from apps.evaluation.views import EvaluateAttemptView

urlpatterns = [
    path("<uuid:attempt_id>/", EvaluateAttemptView.as_view(), name="evaluate-attempt"),  # DFD 5.0
]
