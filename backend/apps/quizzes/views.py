"""
DFD 2.0 — Quiz Generation
Views will be implemented in this module.
"""

from rest_framework.views import APIView
from rest_framework.response import Response
from apps.quizzes.serializers import GenerateQuizRequestSerializer
from apps.quizzes.services import QuizService
from apps.questions.serializers import QuestionSerializer
from apps.quizzes.models import Quiz


class GenerateQuizView(APIView):
    """
    POST /api/v1/quizzes/generate/
    """
    def post(self, request):
        serializer = GenerateQuizRequestSerializer(data=request.data)
        if serializer.is_valid():
            metadata  = QuizService.generate_quiz_metadata(serializer.validated_data)
            quiz      = QuizService.store_quiz_metadata(request.user, metadata)
            questions = QuizService.generate_question_set(metadata)
            stored_qs = QuizService.store_generated_questions(quiz, questions)

            return Response({
                "message":  "Quiz generated successfully",
                "quiz_id":  quiz.id,
                "title":    quiz.title,
                "questions": QuestionSerializer(stored_qs, many=True).data,
            })
        return Response(serializer.errors, status=400)


class QuizHistoryView(APIView):
    """
    GET /api/v1/quizzes/history/
    """
    def get(self, request):
        quizzes = Quiz.objects.filter(created_by=request.user).order_by("-created_at")
        history = []
        
        for quiz in quizzes:
            # For this MVP, we take the most recent attempt per quiz
            attempt = quiz.attempts.filter(user=request.user).order_by("-attempted_at").first()
            history.append({
                "quiz_id": str(quiz.id),
                "topic": quiz.title,
                "difficulty": quiz.difficulty,
                "score": attempt.score if attempt else 0,
                "total_questions": quiz.question_count,
                "created_at": quiz.created_at.isoformat()
            })
            
        return Response({"quizzes": history})


class QuizDetailView(APIView):
    """
    GET /api/v1/quizzes/<quiz_id>/
    """
    def get(self, request, quiz_id):
        try:
            quiz = Quiz.objects.get(id=quiz_id, created_by=request.user)
            questions = quiz.questions.all()
            
            # Fetch the latest attempt for this user and quiz
            attempt = quiz.attempts.filter(user=request.user).order_by("-attempted_at").first()
            user_answers = {}
            if attempt:
                user_answers = {
                    str(ans.question_id): ans.selected_option 
                    for ans in attempt.answers.all()
                }

            # Serialize questions and attach user_selection
            serialized_qs = QuestionSerializer(questions, many=True).data
            for q_data in serialized_qs:
                q_data["user_selection"] = user_answers.get(str(q_data["id"]))

            return Response({
                "quiz_id": quiz.id,
                "title": quiz.title,
                "difficulty": quiz.difficulty,
                "questions": serialized_qs
            })
        except Quiz.DoesNotExist:
            return Response({"error": "Quiz not found"}, status=404)
