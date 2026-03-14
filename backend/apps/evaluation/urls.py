"""
Evaluation URL Configuration — DFD 5.0 Evaluate Answers
Mounted at: /api/v1/evaluation/
"""

from django.urls import path
from apps.evaluation.views import EvaluationResultView

urlpatterns = [
    path("result/<uuid:attempt_id>/", EvaluationResultView.as_view(), name="evaluation-result"),  # DFD 5.2
]
