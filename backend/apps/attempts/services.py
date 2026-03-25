from apps.attempts.models import QuizAttempt, UserAnswer
from apps.quizzes.models import Quiz
from apps.questions.models import Question


class AttemptService:

    @classmethod
    def submit_quiz_attempt(cls, user, quiz_id, answers):

        quiz = Quiz.objects.get(id=quiz_id)

        attempt = QuizAttempt.objects.create(
            user=user,
            quiz=quiz,
            total_questions=quiz.question_count,
            status="completed"
        )

        for answer in answers:
            question = Question.objects.get(id=answer["question_id"])

            UserAnswer.objects.create(
                attempt=attempt,
                question=question,
                selected_option=answer["selected_option"]
            )

        from apps.evaluation.services import EvaluationService
        result = EvaluationService.evaluate_attempt(attempt.id)
        attempt.refresh_from_db()
        return attempt, result