from apps.attempts.models import QuizAttempt, UserAnswer


class EvaluationService:
    """
    Business logic for evaluating quiz attempt answers.
    """

    @staticmethod
    def evaluate_attempt(attempt_id):
        """
        DFD 5.1 – Compare User Answers
        DFD 5.2 – Determine Correctness
        DFD 5.3 – Calculate Score
        DFD 5.4 – Update Attempt Score
        DFD 5.5 – Return Score Result
        """
        # Step 5.1: Retrieve attempt and related answers
        attempt = QuizAttempt.objects.get(id=attempt_id)
        user_answers = UserAnswer.objects.filter(attempt=attempt)

        correct_count = 0

        # Step 5.2: Determine Correctness
        for user_answer in user_answers:
            question = user_answer.question
            selected_key = user_answer.selected_option  # e.g., 'A'
            
            # Get the actual text value of the selected option
            selected_value = getattr(question, f"option_{selected_key.lower()}", "")
            
            # Check if selection matches key OR full text value of correct answer
            is_correct = (
                selected_key == question.correct_answer or 
                str(selected_value).strip() == str(question.correct_answer).strip()
            )
            
            user_answer.is_correct = is_correct
            if is_correct:
                correct_count += 1
            user_answer.save()

        # Step 5.3 & 5.4: Calculate and Update Score
        attempt.score = correct_count
        if attempt.total_questions > 0:
            attempt.percentage = (correct_count / attempt.total_questions) * 100
        else:
            attempt.percentage = 0.0
            
        attempt.save()

        # Step 5.5: Return result
        return {
            "attempt_id": attempt.id,
            "score": attempt.score,
            "total_questions": attempt.total_questions,
            "correct_answers": correct_count
        }

    @staticmethod
    def get_evaluation_result(attempt_id):
        raise NotImplementedError("DFD 5.0 not implemented yet.")

    @staticmethod
    def get_evaluation_result(attempt_id):
        raise NotImplementedError("DFD 5.0 not implemented yet.")
