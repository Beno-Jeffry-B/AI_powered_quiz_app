from apps.attempts.models import QuizAttempt, UserAnswer
from apps.quizzes.models import Quiz


class AttemptService:
    """
    Business logic for quiz attempt submission and history.
    """

    @staticmethod
    def submit_quiz_attempt(user, quiz_id, answers):
        """
        DFD 4.2 – Create Quiz Attempt Record
        DFD 4.3 – Store Attempt Metadata
        DFD 4.4 – Store User Answers
        """
        # Step 4.3: Fetch quiz to get metadata (question_count)
        quiz = Quiz.objects.get(id=quiz_id)

        # Step 4.2 & 4.3: Create attempt record with metadata
        attempt = QuizAttempt.objects.create(
            user=user,
            quiz=quiz,
            total_questions=quiz.question_count,
            status="completed"
        )

        # Step 4.4: Store user answers
        for answer in answers:
            UserAnswer.objects.create(
                attempt=attempt,
                question_id=answer["question_id"],
                selected_option=answer["selected_option"]
            )

        return attempt

    @staticmethod
    def get_attempt_history(user):
        raise NotImplementedError("DFD 4.0 not implemented yet.")
