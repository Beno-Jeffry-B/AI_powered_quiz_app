from rest_framework import serializers
from apps.questions.models import Question


class QuestionSerializer(serializers.ModelSerializer):
    """
    Serializer for quiz questions (excluding answer).
    """
    class Meta:
        model = Question
        fields = ["id", "question_text", "option_a", "option_b", "option_c", "option_d"]
