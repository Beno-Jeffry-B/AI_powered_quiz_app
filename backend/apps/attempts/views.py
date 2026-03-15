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
            
            from apps.evaluation.services import EvaluationService
            result = EvaluationService.evaluate_attempt(attempt.id)
            
            return Response({
                "message": "Quiz attempt submitted",
                "attempt_id": attempt.id,
                "score": result["score"],
                "total_questions": result["total_questions"],
                "percentage": attempt.percentage
            })
        return Response(serializer.errors, status=400)


class AttemptHistoryView(APIView):
    """
    GET /api/v1/attempts/history/
    """
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
