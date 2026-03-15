"""
DFD 2.0 — Quiz Generation
Views will be implemented in this module.
"""

from rest_framework.views import APIView
from rest_framework.response import Response
from apps.quizzes.serializers import GenerateQuizRequestSerializer
from apps.quizzes.services import QuizService


class GenerateQuizView(APIView):
    """
    POST /api/v1/quizzes/generate/
    Will be implemented in DFD 2.0 — Quiz Generation.
    """
    def post(self, request):
        serializer = GenerateQuizRequestSerializer(data=request.data)
        if serializer.is_valid():
            metadata = QuizService.generate_quiz_metadata(serializer.validated_data)
            quiz = QuizService.store_quiz_metadata(request.user, metadata)
            questions = QuizService.generate_question_set(metadata)
            return Response({
                "message": "Quiz generated",
                "quiz_id": quiz.id,
                "questions": questions
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
