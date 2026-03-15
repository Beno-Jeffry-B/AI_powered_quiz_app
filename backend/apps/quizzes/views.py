"""
DFD 2.0 — Quiz Generation
Views will be implemented in this module.
"""

from rest_framework.views import APIView
from rest_framework.response import Response
from apps.quizzes.serializers import GenerateQuizRequestSerializer
from apps.quizzes.services import QuizService
from apps.questions.serializers import QuestionSerializer


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


class QuizListView(APIView):
    """
    GET /api/v1/quizzes/
    Will be implemented in DFD 2.0 — Quiz Generation.
    """
    pass


class QuizDetailView(APIView):
    """
    GET /api/v1/quizzes/<quiz_id>/
    Will be implemented in DFD 2.0 — Quiz Generation.
    """
    pass
