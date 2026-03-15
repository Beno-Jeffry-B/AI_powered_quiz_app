from rest_framework.views import APIView
from rest_framework.response import Response
from apps.evaluation.services import EvaluationService


class EvaluateAttemptView(APIView):
    """
    GET /api/v1/evaluation/<attempt_id>/
    """
    def get(self, request, attempt_id):
        result = EvaluationService.evaluate_attempt(attempt_id)
        return Response(result)
