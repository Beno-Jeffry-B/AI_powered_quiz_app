"""
DFD 2.0 — Quiz Generation
Views will be implemented in this module.
"""

from rest_framework.views import APIView


class QuizGenerateView(APIView):
    """
    POST /api/v1/quizzes/generate/
    Will be implemented in DFD 2.0 — Quiz Generation.
    """
    pass


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
