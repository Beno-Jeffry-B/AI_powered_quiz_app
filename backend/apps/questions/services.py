from rest_framework.exceptions import NotFound
from apps.questions.models import Question


class QuestionService:
    """
    Business logic for fetching quiz questions.
    """

    @staticmethod
    def get_questions_by_quiz(quiz_id):
        """
        DFD 3.1 — Retrieve questions for a specific quiz.
        """
        return Question.objects.filter(quiz_id=quiz_id)

    @staticmethod
    def get_question_by_id(question_id):
        """
        DFD 3.2 — Retrieve details for a specific question.
        """
        try:
            return Question.objects.get(id=question_id)
        except Question.DoesNotExist:
            raise NotFound("Question not found")
