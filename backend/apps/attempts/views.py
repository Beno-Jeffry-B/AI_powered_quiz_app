from rest_framework.views import APIView
from rest_framework.response import Response
from apps.attempts.serializers import SubmitQuizAttemptSerializer
from apps.attempts.services import AttemptService


class SubmitQuizAttemptView(APIView):
    """
    POST /api/v1/attempts/
    """
    def post(self, request):
        serializer = SubmitQuizAttemptSerializer(data=request.data)
        if serializer.is_valid():
            quiz_id = serializer.validated_data["quiz_id"]
            answers = serializer.validated_data["answers"]
            
            attempt = AttemptService.submit_quiz_attempt(
                user=request.user,
                quiz_id=quiz_id,
                answers=answers
            )
            
            return Response({
                "message": "Quiz attempt submitted",
                "attempt_id": attempt.id
            })
        return Response(serializer.errors, status=400)


class AttemptHistoryView(APIView):
    """
    GET /api/v1/attempts/history/
    Will be implemented in DFD 4.0 — Submit Quiz Attempt.
    """
    pass
