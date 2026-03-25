"""
DFD 3.0 — Retrieve Quiz Questions
Views will be implemented in this module.
"""

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from apps.questions.services import QuestionService
from apps.questions.serializers import QuestionSerializer


class RetrieveQuizQuestionsView(APIView):
    """
    GET /api/v1/questions/quiz/<quiz_id>/questions/
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, quiz_id):
        questions = QuestionService.get_questions_by_quiz(quiz_id)
        serializer = QuestionSerializer(questions, many=True)

        return Response({
            "quiz_id": quiz_id,
            "questions": serializer.data
        })


class RetrieveQuestionDetailView(APIView):
    """
    GET /api/v1/questions/<question_id>/
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, question_id):
        question = QuestionService.get_question_by_id(question_id)
        serializer = QuestionSerializer(question)

        return Response(serializer.data)