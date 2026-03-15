"""
DFD 2.0 — Quiz Generation
Services will be implemented in this module.
"""
from apps.quizzes.models import Quiz


class QuizService:
    """
    Business logic for quiz generation and retrieval.
    Will be implemented in DFD 2.0 — Quiz Generation.
    """
    @staticmethod
    def generate_quiz_metadata(validated_data):
        topic = validated_data.get("topic")
        difficulty = validated_data.get("difficulty")
        number_of_questions = validated_data.get("number_of_questions")

        return {
            "title": topic,
            "difficulty": difficulty,
            "question_count": number_of_questions,
            "status": "pending"
        }

    @staticmethod
    def store_quiz_metadata(user, metadata):
        quiz = Quiz.objects.create(
            created_by=user,
            title=metadata["title"],
            difficulty=metadata["difficulty"],
            question_count=metadata["question_count"],
            status=metadata["status"]
        )
        return quiz

    @staticmethod
    def generate_quiz(user, topic, difficulty, num_questions):
        raise NotImplementedError("DFD 2.0 not implemented yet.")

    @staticmethod
    def get_quiz_by_id(quiz_id):
        raise NotImplementedError("DFD 2.0 not implemented yet.")
