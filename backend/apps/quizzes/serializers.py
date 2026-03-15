"""
DFD 2.0 — Quiz Generation
Serializers will be implemented in this module.
"""
from rest_framework import serializers

class GenerateQuizRequestSerializer(serializers.Serializer):
    topic = serializers.CharField()
    difficulty = serializers.ChoiceField(choices=["easy", "medium", "hard"])
    number_of_questions = serializers.IntegerField(min_value=1)
    time_limit = serializers.IntegerField(min_value=1, default=5)
