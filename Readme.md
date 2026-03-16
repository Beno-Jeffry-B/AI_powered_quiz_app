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
I didn't just start typing code; I intentionally **spent a good number of hours designing the system first**. I learned the importance of this phase during my **previous internship**, where I worked closely with the founder. He taught me that for complex projects, getting the architecture right on paper saves days of debugging later. During that rough work phase, I sketched out the DFD and ER diagrams to get the logic right. And after I used **Gemini (Nano Banana)** to help me convert those rough designs into a structured database schema and ERD. The **DFD structure basically guided the entire application architecture**, leading to a clean, modular build.

The strategy is simple but effective: I don't touch the UI until the backend is bulletproof.

This approach made development much more meaningful. It ensures that I stay strictly within the **project scope** since the scope is defined in the DFD, I don't drag or spend time on unnecessary requirements.

Here’s how the process flows now:
1. **User Authentication:** Simple signup/login to keep track of your quizzes.
2. **Quiz Generation Request:** You tell the app what you want to learn.
3. **Backend Calling Groq API:** The server hits the Groq API to get high-quality questions.
4. **Quiz Attempt Interface:** A polished UI where you actually take the test.
5. **Evaluation and Score Tracking:** The system grades you and logs the attempt so you can see your progress.

## 4. Architecture
- **Frontend:** Built with Next.js (App Router). I used React state and context (`QuizContext`) to manage the exam flow and those annoying but necessary timers. Styled with TailwindCSS for a premium feel.
- **Backend:** I spent a lot of time planning this to ensure a **clean separation of concerns**. The **DFD modules were translated directly into backend modules and services** (users, quizzes, questions, etc.), making it easy to maintain.
- **Database:** I started with **SQLite for quick testing and development**, but later **migrated to Render PostgreSQL for production readiness**. PostgreSQL is just way better for scalability and reliability in a real-world deployment.
- **AI Components:** Using the Groq SDK with the `llama-3.3-70b-versatile` model. It’s incredibly fast, which is crucial for a smooth user experience.

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

## 7. Database Models
The schema is designed to be secure and scalable. I used UUIDs for primary keys so people can't just guess URLs to find other users' quizzes.

- **`User`:** Custom model using email for login.
- **`Quiz`:** Stores the topic, difficulty, and AI generation status.
- **`Question`:** Each quiz has its own set of questions with four options and one correct answer.
- **`QuizAttempt`:** Logs every time a user takes a quiz, tracking the final score.
- **`UserAnswer`:** Records exactly what the user picked for each question.

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

I followed a focused, backend first strategy that allowed me to maintain a clean architecture and stay strictly within the **project scope**. By defining the scope clearly in the DFD and ERD, I avoided "scope creep" and spent my time only on necessary requirements.

My process followed this strict sequence:
1. **ERD and Model Creation**: I started by designing the database schema and verifying the relationships.
2. **Module-by-Module Backend Implementation**: Once the models were solid, I implemented the DFD endpoints module by module and sub-process by sub-process. This was purely backend work.
3. **Verification and Commits**: After implementing each module, I verified all endpoints and edge cases, committing the work only after I was certain it was robust.
4. **Frontend Connection**: Only after checking every backend endpoint did I dive into the frontend connection and UI work.

Working this way made the UI phase much easier because I could focus entirely on the interface without worrying about the underlying logic. Simultaneous full-stack development can often become tedious and fragmented, whereas this focused approach kept the development meaningful and efficient.

The breakdown looked like this:
- **DFD 1.0 & 1.1:** User Authentication and validations.
- **DFD 2.0:** Quiz Generation logic and services.
- **DFD 3.0:** Question handling.
- **DFD 4.0:** Quiz attempt submission.
- **DFD 5.0:** Evaluation and scoring.

Each of these was translated into actual backend functions. I also stayed disciplined with my **GitHub commit history**, creating a transparent and traceable log. Instead of a separate documentation file, my **commit messages act as the development log**.

The project was developed across multiple branches (`1.0`, `2.0`, `3.0`, `4.0`, `5.0`), with sub-modules like `1.1` or `2.1` handled individually. 


## 11. A Note on Documentation
Due to time constraints, I didn't create a separate Word doc. I figured a clean, meaningful commit history is much more useful for a developer anyway it lets you see exactly how the project evolved. It gives a transparent and traceable development workflow without the overhead of static files.

## 12. Challenges Faced
- **AI Response Formatting:** Ensuring an LLM continuously returns valid, parsable JSON without adding conversational preamble or markdown codeblocks natively.
- **Quiz Evaluation Consistency:** Keeping the client mathematically decoupled from the answer key. If the frontend checked the answers, tech-savvy users could inspect correct answers via the network tab.
- **AI Latency:** Typical AI requests can take 10+ seconds, leaving the user staring at a blank screen.
- **Schema Design:** Tracking multiple disjointed choices securely without allowing a user to submit duplicate attempts trivially.

## 13. Solutions Implemented
- **AI Formatting Recovery:** Implemented a `try-except json.loads(content)` fallback strategy. If the AI model hallucinates or provides invalid data, a basic empty placeholder is created so the backend doesn't crash the UI with a 500 error.
- **Server-Side Scoring:** The client merely POSTs a `<question_id>: <selected_option>` map. The backend compares these against the `Question` model, calculates the score in isolation, creates the `UserAnswer` rows, and returns just the final integer result.
- **Groq LPU Engine + UX Skeletons:** Utilizing Groq specifically for `llama-3.3-70b-versatile` guarantees significantly faster inference times over traditional LLM APIs. The next.js frontend integrates a beautifully animated `QuestionSkeleton` to gracefully hold the user's attention during generation.

## 14. Features Implemented
- User Models & Database schemas mapped out
- Core Quiz generation backend using Groq API
- Fetching quizzes with filtered history
- Next.js frontend exam runner with dynamic UI states and sticky navigation
- Basic backend Attempt tracking and decoupled answer processing

## 15. Features Skipped (and Why)
- **Detailed Attempt History View:** `AttemptHistoryView` is still a placeholder while I prioritized the generation engine.
- **Leaderboards / Social Sharing:** Shelved for now to keep the scope tight.
- **Complex Question Types:** Stuck to 4-option MCQs for the MVP. Adding True/False or Fill-in-the-blanks would require some database refactoring.
- **Forgot Password Feature:** Implementing this properly requires a reliable email service integration for reset links. I considered Google OAuth as an alternative, but didn't have the time to finish it. I know how to implement it, but for this version, it's on the back burner.
