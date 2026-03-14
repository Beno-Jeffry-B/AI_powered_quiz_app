# 🧠 AI Quiz Generation & Attempt System

> An intelligent quiz platform powered by AI — generate, attempt, evaluate, and track quizzes seamlessly.

---

## Overview

This project implements a **Quiz Generation and Attempt System** based on a Data Flow Diagram (DFD) and an Entity Relationship (ER) diagram.

The system allows users to:

- 🔐 Authenticate into the platform
- 🤖 Generate quizzes using AI
- 📄 Retrieve quiz questions
- ✍️ Attempt quizzes
- 📊 Automatically evaluate answers and calculate scores
- 📈 Track quiz performance history and retake the test

The architecture strictly follows the DFD processes to ensure a clear mapping between system design and implementation.

---
## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | [Next.js](https://nextjs.org/) |
| Backend | [Django REST Framework](https://www.django-rest-framework.org/) |
| Database | [PostgreSQL](https://www.postgresql.org/) |
| AI Integration | [OpenAI](https://openai.com/) / [Gemini API](https://ai.google.dev/) |

---

## Diagrams

### Data Flow Diagram

> 📌 

### ER Diagram

> 📌 

---


## Development Workflow

The project is implemented **module-by-module** following the DFD hierarchy:

```
1. Project Structure
2. Database Models
3. Authentication Module       ← DFD 1.0
4. Quiz Generation Module      ← DFD 2.0
5. Quiz Retrieval Module       ← DFD 3.0
6. Quiz Attempt Module         ← DFD 4.0
7. Evaluation & Scoring Module ← DFD 5.0
```

Each module:
- Implements specific DFD processes
- Includes comments referencing DFD process numbers
- Is committed separately with meaningful commit messages

---
