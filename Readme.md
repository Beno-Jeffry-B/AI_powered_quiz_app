# AI Quiz Generation & Attempt System

## 1. Project Title & Description
**AI-Powered Quiz App** is a full-stack web application that allows users to generate interactive text-based quizzes on any topic using large language models. The system instantly creates questions using AI, lets the user take the exam in a polished interface, evaluates their answers, and tracks their scores across different attempts.

## 2. Live Demo
*https://ai-powered-quiz-app-rosy.vercel.app/*

## Diagrams

### Data Flow Diagram

> 📌 ![Data Flow Diagram](https://github.com/Beno-Jeffry-B/AI_powered_quiz_app/blob/9ad390fd186cd588b59586339f1a040c0dd63f30/docs/DFD.png)

### ER Diagram

> 📌 ![ER Diagram](https://github.com/Beno-Jeffry-B/AI_powered_quiz_app/blob/9ad390fd186cd588b59586339f1a040c0dd63f30/docs/ER.png)

## 3. System Overview
The system follows a streamlined workflow:
1. **User Authentication:** Users register and log in to the system.
2. **Quiz Generation:** Users request a new quiz by providing a topic, difficulty level, and desired number of questions.
3. **AI Integration:** The backend sends a structured prompt to the Groq API.
4. **Attempt:** Once the AI responds, the quiz metadata and questions are stored, and the user is redirected to the active exam interface.
5. **Evaluation & Score Tracking:** The user submits their chosen answers. The system evaluates them against the correct answers and stores the `QuizAttempt` and corresponding `UserAnswer`s, making past attempts viewable.

## 4. Architecture
- **Frontend:** Built with Next.js (App Router), leveraging React state and context (`QuizContext`) to manage the active exam state and visual timers. The UI is built using TailwindCSS for modern, responsive components.
- **Backend:** A modular Django application strictly divided by domain logic (`users`, `quizzes`, `questions`, `attempts`, `evaluation`), utilizing Django REST Framework (DRF) for API endpoints.
- **Database:** Relational schema using Django ORM. Configured with SQLite natively, but includes dependencies (`psycopg2-binary`) for PostgreSQL readiness.
- **AI Components:** Uses the Groq Python SDK for lightning-fast inference, specifically integrating the `llama-3.3-70b-versatile` model.

## 5. Tech Stack
**Frontend:**
- Next.js 14 (App Router)
- React 18
- TailwindCSS
- TypeScript

**Backend:**
- Django 6.0.3
- Django REST Framework (DRF)
- SimpleJWT (Authentication)

**AI & Third-party Services:**
- Groq API
- Model: `llama-3.3-70b-versatile`

## 6. How to Run the Project Locally

### Prerequisites
- Node.js (v18+)
- Python 3.10+
- A valid Groq API Key

### Database Setup
By default, the application runs on an SQLite database (`db.sqlite3`). If you want to use PostgreSQL, update the `DATABASES` setting in `config/settings.py` and ensure PostgreSQL is running.

### Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\\Scripts\\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure Environment Variables:
   - Copy `.env.example` to `.env`.
   - Add your Groq API key: `GROQ_API_KEY=your_groq_api_key_here`
5. Run database migrations:
   ```bash
   python manage.py migrate
   ```
6. Start the backend server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install node dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## 7. Database Design Decisions
The relational schema uses UUIDs as primary keys to prevent users from guessing the IDs of other quizzes or attempts. Major models:
- **`User`:** Custom model extending `AbstractUser` that uses email as the primary authentication field.
- **`Quiz`:** Stores the overarching generation metadata (topic, difficulty, total questions, status).
- **`Question`:** Belongs to a specific Quiz. Denormalizes the options into four specific fields (`option_a`, `option_b`, `option_c`, `option_d`) with exactly one `correct_answer` to enforce multiple-choice constraints.
- **`QuizAttempt`:** Ties a User to a Quiz, capturing their final computed `score` and the `attempted_at` timestamp.
- **`UserAnswer`:** Tracks individual selections made during an attempt and whether that selection was mathematically correct.

## 8. API Structure
Key RESTful endpoints driving the application:
- **Authentication:** (Pending full implementation in `users/views.py`) `/api/v1/users/register/`, `/api/v1/users/login/`
- **Generations (`app/quizzes/`):**
  - `POST /api/v1/quizzes/generate/`: Accepts topic/difficulty, triggers Groq, and responds with quiz ID and questions.
  - `GET /api/v1/quizzes/<quiz_id>/`: Retrieves quiz metadata and associated questions without revealing correct answers to the client interface.
  - `GET /api/v1/quizzes/history/`: Fetches all quizzes generated by the user.
- **Attempts (`app/attempts/`):**
  - `POST /api/v1/attempts/`: Submits the final answer payload, handles scoring logic on the backend, and saves the attempt.
  - `GET /api/v1/attempts/history/`: Planned module for displaying detailed past test breakdowns.

## 9. AI Quiz Generation
The core brain of the application resides in `QuizService.generate_question_set()`.
- **Model:** `llama-3.3-70b-versatile` via the Groq provider.
- **Integration Mechanism:** A rigid prompt template instructs the AI to generate a specific number of questions varying by user-provided parameters (`title`, `difficulty`).
- **Parsing constraint:** The AI is strictly instructed to return valid JSON with a specific structure: an array of objects, containing `question`, exactly 4 `options`, and an `answer`.

## 10. Development Workflow
The backend architecture follows a strict Domain-Driven Design (DFD) workflow to enforce separation of concerns:
- **DFD 1.0:** User Authentication
- **DFD 2.0:** Quiz Generation (Views, Services, and AI logic)
- **DFD 4.0:** Submit Quiz Attempt
All code routes through DRF Views to a `services.py` containing the business logic, which in turn manipulates the `models.py`.

## 11. Challenges Faced
- **AI Response Formatting:** Ensuring an LLM continuously returns valid, parsable JSON without adding conversational preamble or markdown codeblocks natively.
- **Quiz Evaluation Consistency:** Keeping the client mathematically decoupled from the answer key. If the frontend checked the answers, tech-savvy users could inspect correct answers via the network tab.
- **AI Latency:** Typical AI requests can take 10+ seconds, leaving the user staring at a blank screen.
- **Schema Design:** Tracking multiple disjointed choices securely without allowing a user to submit duplicate attempts trivially.

## 12. Solutions Implemented
- **AI Formatting Recovery:** Implemented a `try-except json.loads(content)` fallback strategy. If the AI model hallucinates or provides invalid data, a basic empty placeholder is created so the backend doesn't crash the UI with a 500 error.
- **Server-Side Scoring:** The client merely POSTs a `<question_id>: <selected_option>` map. The backend compares these against the `Question` model, calculates the score in isolation, creates the `UserAnswer` rows, and returns just the final integer result.
- **Groq LPU Engine + UX Skeletons:** Utilizing Groq specifically for `llama-3.3-70b-versatile` guarantees significantly faster inference times over traditional LLM APIs. The next.js frontend integrates a beautifully animated `QuestionSkeleton` to gracefully hold the user's attention during generation.

## 13. Features Implemented
- User Models & Database schemas mapped out
- Core Quiz generation backend using Groq API
- Fetching quizzes with filtered history
- Next.js frontend exam runner with dynamic UI states and sticky navigation
- Basic backend Attempt tracking and decoupled answer processing

## 14. Features Skipped (and Why)
- **Detailed Attempt History View:** `AttemptHistoryView` remains a placeholder view as of the MVP window to prioritize generation logic.
- **Leaderboards / Social Sharing:** Withheld to maintain scope and get the primary generation and attempt engines stable.
- **Complex Question Typings:** Only 4-option multiple-choice questions are supported. True/False and multi-select formats would require significant schema alterations to `Question`.

## 15. Future Improvements
- Implement frontend charting functionality to visualize scores over time.
- Implement the comprehensive `/api/v1/attempts/history/` logic.
- Build resilient retry logic within the AI parser to re-prompt the LLM automatically if it fails to issue valid JSON.
- Expand support for varied question styles (boolean, fill-in-the-blank).
