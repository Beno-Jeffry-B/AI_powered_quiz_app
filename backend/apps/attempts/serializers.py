from rest_framework import serializers


class AnswerSerializer(serializers.Serializer):
    question_id = serializers.UUIDField()
    selected_option = serializers.CharField(max_length=1)


class SubmitQuizAttemptSerializer(serializers.Serializer):
    quiz_id = serializers.UUIDField()
    answers = AnswerSerializer(many=True)
