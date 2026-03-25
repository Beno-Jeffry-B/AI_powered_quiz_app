"""
DFD 2.0 — Quiz Generation
"""

import json
from django.conf import settings
from groq import Groq

from apps.quizzes.models import Quiz
from apps.questions.models import Question


class QuizService:
    """
    Handles quiz generation logic.
    """

    @classmethod
    def generate_quiz(cls, user, validated_data):
        metadata = cls.generate_quiz_metadata(validated_data)

        quiz = cls.store_quiz_metadata(user, metadata)

        questions = cls.generate_question_set(metadata)

        if not questions:
            raise ValueError("Failed to generate questions. Please try again.")

        stored_questions = cls.store_generated_questions(quiz, questions)

        return quiz, stored_questions

    @classmethod
    def generate_quiz_metadata(cls, validated_data):
        return {
            "title": validated_data.get("topic"),
            "difficulty": validated_data.get("difficulty"),
            "question_count": validated_data.get("number_of_questions"),
            "time_limit": validated_data.get("time_limit", 5),
            "status": "pending"
        }

    @classmethod
    def store_quiz_metadata(cls, user, metadata):
        return Quiz.objects.create(
            created_by=user,
            title=metadata["title"],
            difficulty=metadata["difficulty"],
            question_count=metadata["question_count"],
            time_limit=metadata["time_limit"],
            status=metadata["status"]
        )

    @classmethod
    def generate_question_set(cls, metadata):
        title = metadata["title"]
        difficulty = metadata["difficulty"]
        question_count = metadata["question_count"]

        prompt = f"""
Generate {question_count} multiple choice quiz questions about {title}.
Difficulty: {difficulty}

Rules:
- Each question must contain exactly 4 options.
- The 'answer' must be one of: A, B, C, D.
- Return ONLY valid JSON.

Format:
[
  {{
    "question": "...",
    "options": ["...", "...", "...", "..."],
    "answer": "A"
  }}
]
"""

        client = Groq(api_key=settings.GROQ_API_KEY)

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7
        )

        content = response.choices[0].message.content.strip()

        try:
            return json.loads(content)
        except Exception:
            return []

    @classmethod
    def store_generated_questions(cls, quiz, questions):
        created_questions = []

        for q in questions:
            options = q.get("options", ["", "", "", ""])
            while len(options) < 4:
                options.append("")

            raw_answer = str(q.get("answer", "")).strip()

            correct_key = raw_answer
            if correct_key not in ["A", "B", "C", "D"]:
                for i, opt in enumerate(options):
                    if str(opt).strip() == raw_answer:
                        correct_key = chr(65 + i)
                        break
                else:
                    correct_key = "A"

            question_obj = Question.objects.create(
                quiz=quiz,
                question_text=q.get("question", ""),
                option_a=options[0],
                option_b=options[1],
                option_c=options[2],
                option_d=options[3],
                correct_answer=correct_key
            )

            created_questions.append(question_obj)

        return created_questions

    @classmethod
    def get_quiz_by_id(cls, quiz_id):
        raise NotImplementedError("DFD 2.0 not implemented yet.")