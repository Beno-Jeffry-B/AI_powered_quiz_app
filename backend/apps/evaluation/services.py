from apps.attempts.models import QuizAttempt, UserAnswer


class EvaluationService:

    @classmethod
    def evaluate_attempt(cls, attempt_id):

        attempt = QuizAttempt.objects.get(id=attempt_id)
        user_answers = UserAnswer.objects.filter(attempt=attempt)

        # Step 1: Evaluate each answer
        for user_answer in user_answers:
            question = user_answer.question
            selected_key = str(user_answer.selected_option).strip().upper()
            correct_answer = str(question.correct_answer).strip().upper()

            # ✅ Simple and reliable comparison
            is_correct = (selected_key == correct_answer)

            user_answer.is_correct = is_correct
            user_answer.save(update_fields=["is_correct"])

        # Step 2: Count correct answers from DB (source of truth)
        correct_count = UserAnswer.objects.filter(
            attempt=attempt,
            is_correct=True
        ).count()

        # Step 3: Update attempt score
        attempt.score = correct_count

        if attempt.total_questions > 0:
            attempt.percentage = round(
                (correct_count / attempt.total_questions) * 100, 2
            )
        else:
            attempt.percentage = 0.0

        attempt.save(update_fields=["score", "percentage"])

        return {
            "attempt_id": attempt.id,
            "score": attempt.score,
            "total_questions": attempt.total_questions,
            "correct_answers": correct_count
        }