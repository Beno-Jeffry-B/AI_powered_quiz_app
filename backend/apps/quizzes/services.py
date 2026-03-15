"""
DFD 2.0 — Quiz Generation
Services layer for quiz generation logic.
"""

import json
from django.conf import settings
from groq import Groq

from apps.quizzes.models import Quiz
from apps.questions.models import Question


class QuizService:
    """
    Business logic for quiz generation and retrieval.
    """

    @staticmethod
    def generate_quiz_metadata(validated_data):
        """
        DFD 2.2 — Generate Quiz Metadata
        """
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
        """
        DFD 2.3 — Store Quiz Metadata in DB
        """
        quiz = Quiz.objects.create(
            created_by=user,
            title=metadata["title"],
            difficulty=metadata["difficulty"],
            question_count=metadata["question_count"],
            status=metadata["status"]
        )

        return quiz

    @staticmethod
    def generate_question_set(metadata):
        """
        DFD 2.4 — Generate Question Set using Groq AI
        """

        title = metadata["title"]
        difficulty = metadata["difficulty"]
        question_count = metadata["question_count"]

        prompt = f"""
Generate {question_count} multiple choice quiz questions about {title}.
Difficulty: {difficulty}

Rules:
- Each question must contain exactly 4 options
- Provide the correct answer
- Return ONLY valid JSON

Format:
[
  {{
    "question": "text",
    "options": ["A", "B", "C", "D"],
    "answer": "A"
  }}
]
"""

        client = Groq(api_key=settings.GROQ_API_KEY)

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "user", "content": prompt}
            ],
            temperature=0.7
        )

        content = response.choices[0].message.content.strip()

        try:
            questions = json.loads(content)
        except Exception:
            # Fallback if AI response is not valid JSON
            questions = [
                {
                    "question": content,
                    "options": [],
                    "answer": ""
                }
            ]

        return questions

    @staticmethod
    def store_generated_questions(quiz, questions):
        """
        DFD 2.5 — Store Generated Questions in DB
        """
        created_questions = []
        for q in questions:
            # Ensure options exist before indexing
            options = q.get("options", ["", "", "", ""])
            # Pad options if less than 4
            while len(options) < 4:
                options.append("")
            
            question_obj = Question.objects.create(
                quiz=quiz,
                question_text=q.get("question", ""),
                option_a=options[0],
                option_b=options[1],
                option_c=options[2],
                option_d=options[3],
                correct_answer=q.get("answer", "")
            )
            created_questions.append(question_obj)
        
        return created_questions

    @staticmethod
    def generate_quiz(user, topic, difficulty, num_questions):
        raise NotImplementedError("DFD 2.0 not implemented yet.")

    @staticmethod
    def get_quiz_by_id(quiz_id):
        raise NotImplementedError("DFD 2.0 not implemented yet.")