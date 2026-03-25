"""
DFD 2.0 — Quiz Generation
Views will be implemented in this module.
"""

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from apps.quizzes.serializers import GenerateQuizRequestSerializer
from apps.quizzes.services import QuizService
from apps.questions.serializers import QuestionSerializer
from apps.quizzes.models import Quiz


class GenerateQuizView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = GenerateQuizRequestSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        try:
            quiz, questions = QuizService.generate_quiz(
                request.user,
                serializer.validated_data
            )

            return Response({
                "message": "Quiz generated successfully",
                "quiz_id": quiz.id,
                "title": quiz.title,
                "time_limit": quiz.time_limit,
                "questions": QuestionSerializer(questions, many=True).data,
            })

        except ValueError as e:
            return Response({"error": str(e)}, status=400)


class QuizHistoryView(APIView):
    """
    GET /api/v1/quizzes/history/
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        quizzes = Quiz.objects.filter(created_by=request.user).order_by("-created_at")

        history = []
        for quiz in quizzes:
            attempt = quiz.attempts.filter(user=request.user).order_by("-attempted_at").first()

            history.append({
                "quiz_id": str(quiz.id),
                "topic": quiz.title,
                "difficulty": quiz.difficulty,
                "score": getattr(attempt, "score", 0),
                "total_questions": quiz.question_count,
                "percentage": getattr(attempt, "percentage", 0.0),
                "created_at": quiz.created_at.isoformat()
            })

        return Response({"quizzes": history})


class QuizDetailView(APIView):
    """
    GET /api/v1/quizzes/<quiz_id>/
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, quiz_id):
        try:
            quiz = Quiz.objects.get(id=quiz_id, created_by=request.user)
            questions = quiz.questions.all()

            # Get latest attempt
            attempt = quiz.attempts.filter(user=request.user).order_by("-attempted_at").first()

            # Map user answers {question_id: selected_option}
            user_answers = {
                str(ans.question_id): ans.selected_option
                for ans in attempt.answers.all()
            } if attempt else {}

            # Optimize lookup (IMPORTANT)
            question_map = {str(q.id): q for q in questions}

            # Serialize questions
            serialized_qs = QuestionSerializer(questions, many=True).data

            for q_data in serialized_qs:
                question_id = str(q_data["id"])
                user_selection = user_answers.get(question_id)

                # Add user selection
                q_data["user_selection"] = user_selection

                # Add correctness (robust logic)
                if user_selection:
                    question = question_map.get(question_id)

                    # Get actual option text
                    selected_value = getattr(question, f"option_{user_selection.lower()}", "")

                    # Handle both cases: A/B/C/D OR full text answer
                    q_data["is_correct"] = (
                        user_selection == question.correct_answer or
                        str(selected_value).strip() == str(question.correct_answer).strip()
                    )
                else:
                    q_data["is_correct"] = False

            return Response({
                "quiz_id": quiz.id,
                "title": quiz.title,
                "difficulty": quiz.difficulty,
                "time_limit": quiz.time_limit,
                "questions": serialized_qs
            })

        except Quiz.DoesNotExist:
            return Response({"error": "Quiz not found"}, status=404)