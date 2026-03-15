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
        time_limit = validated_data.get("time_limit", 5)

        return {
            "title": topic,
            "difficulty": difficulty,
            "question_count": number_of_questions,
            "time_limit": time_limit,
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
            time_limit=metadata["time_limit"],
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
- Each question must contain exactly 4 options.
- The 'answer' field MUST be the single character key ('A', 'B', 'C', or 'D') corresponding to the correct option.
- Return ONLY valid JSON.

Format:
[
  {{
    "question": "Exactly what is asked?",
    "options": ["Option 1 content", "Option 2 content", "Option 3 content", "Option 4 content"],
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
            questions = []

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
            
            raw_answer = str(q.get("answer", "")).strip()
            
            # Robust Mapping: If AI returned the full text instead of A/B/C/D, find the key
            correct_key = raw_answer
            if len(raw_answer) > 1 or raw_answer not in ["A", "B", "C", "D"]:
                # Try to find which option matches the raw text
                for i, opt in enumerate(options):
                    if str(opt).strip() == raw_answer:
                        correct_key = chr(65 + i) # 0->A, 1->B...
                        break
                # Default to A if still not matched/valid
                if len(correct_key) != 1 or correct_key not in ["A", "B", "C", "D"]:
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

    @staticmethod
    def generate_quiz(user, topic, difficulty, num_questions):
        raise NotImplementedError("DFD 2.0 not implemented yet.")

    @staticmethod
    def get_quiz_by_id(quiz_id):
        raise NotImplementedError("DFD 2.0 not implemented yet.")