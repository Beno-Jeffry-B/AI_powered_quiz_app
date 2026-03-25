// ===============================
// BASE URL
// ===============================
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

async function callAPI(endpoint, method = "GET", data = null) {

  // 1. Get token (if user logged in)
  let token = null;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("access_token");
  }

  // 2. Setup headers
  const headers = {
    "Content-Type": "application/json",
  };

  // 3. Add token if exists
  if (token) {
    headers["Authorization"] = "Bearer " + token;
  }

  try {
    // 4. Make API request
    const response = await fetch(API_BASE + endpoint, {
      method: method,
      headers: headers,
      body: data ? JSON.stringify(data) : null,
    });

    // 5. Handle session expiry (401 error)
    if (response.status === 401 && endpoint !== "/api/v1/auth/login/") {
      localStorage.removeItem("access_token");
      window.location.href = "/login";
      throw new Error("Session expired. Please login again.");
    }

    // 6. Handle other errors
    if (!response.ok) {
      let errorData = {};

      try {
        errorData = await response.json();
      } catch (e) {
        errorData = {};
      }

      throw new Error(
        errorData.detail ||
        errorData.message ||
        errorData.error ||
        "Something went wrong"
      );
    }

    // 7. Return success response
    return await response.json();

  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}


// ===============================
// AUTH APIs
// ===============================

// Register user
export function signup(email, password) {
  return callAPI("/api/v1/auth/register/", "POST", {
    email: email,
    password: password,
    username: email,
  });
}

// Login user
export function login(email, password) {
  return callAPI("/api/v1/auth/login/", "POST", {
    email: email,
    password: password,
  });
}


// ===============================
// QUIZ APIs
// ===============================

// Generate quiz
export function generateQuiz(topic, numberOfQuestions, difficulty, timeLimit) {
  return callAPI("/api/v1/quizzes/generate/", "POST", {
    topic: topic,
    number_of_questions: numberOfQuestions,
    difficulty: difficulty,
    time_limit: timeLimit,
  });
}

// Get all quizzes (history)
export function getQuizHistory() {
  return callAPI("/api/v1/quizzes/history/");
}

// Get single quiz detail
export function getQuizDetail(quizId) {
  return callAPI("/api/v1/quizzes/" + quizId + "/");
}


// ===============================
// ATTEMPT APIs
// ===============================

// Submit quiz answers
export function submitQuizAttempt(quizId, answers) {
  return callAPI("/api/v1/attempts/", "POST", {
    quiz_id: quizId,
    answers: answers,
  });
}