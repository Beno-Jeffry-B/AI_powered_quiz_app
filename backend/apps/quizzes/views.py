"""
DFD 2.0 — Quiz Generation
Views will be implemented in this module.
"""

from rest_framework.views import APIView
from rest_framework.response import Response
from apps.quizzes.serializers import GenerateQuizRequestSerializer


class GenerateQuizView(APIView):
    """
    POST /api/v1/quizzes/generate/
    Will be implemented in DFD 2.0 — Quiz Generation.
    """
    def post(self, request):
        serializer = GenerateQuizRequestSerializer(data=request.data)
        if serializer.is_valid():
            return Response({
                "message": "Quiz parameters received",
                "data": serializer.validated_data
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
