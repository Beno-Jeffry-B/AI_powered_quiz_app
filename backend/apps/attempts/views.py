from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from apps.attempts.serializers import SubmitQuizAttemptSerializer
from apps.attempts.services import AttemptService


class SubmitQuizAttemptView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = SubmitQuizAttemptSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        attempt, result = AttemptService.submit_quiz_attempt(
            user=request.user,
            quiz_id=serializer.validated_data["quiz_id"],
            answers=serializer.validated_data["answers"]
        )

        return Response({
            "message": "Quiz attempt submitted",
            "attempt_id": attempt.id,
            "score": result["score"],
            "total_questions": result["total_questions"],
            "percentage": attempt.percentage
        })


class AttemptHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from apps.attempts.models import QuizAttempt

        attempts = QuizAttempt.objects.filter(user=request.user).order_by("-attempted_at")

        history = []
        for att in attempts:
            history.append({
                "id": str(att.id),
                "quiz_id": str(att.quiz.id),
                "topic": att.quiz.title,
                "difficulty": att.quiz.difficulty,
                "score": att.score,
                "total_questions": att.total_questions,
                "percentage": att.percentage,
                "created_at": att.attempted_at.isoformat()
            })

        return Response({"attempts": history})