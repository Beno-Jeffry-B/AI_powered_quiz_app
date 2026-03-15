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
