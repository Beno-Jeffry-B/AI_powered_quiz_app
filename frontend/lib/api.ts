const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

/**
 * Centrailzed Fetch Helper
 * Handles: Auth headers, 401 redirects, Network errors
 */
async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("access_token");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(options.headers || {}),
  };

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (err) {
    console.error(`[API] Connection failed: ${endpoint}`, err);
    throw new Error("Unable to connect to the server. Please check your connection.");
  }

  // Global Auth Handling
  if (res.status === 401) {
    localStorage.removeItem("access_token");
    if (typeof window !== "undefined") {
      window.location.href = "/login?error=Session expired. Please login again.";
    }
    throw new Error("Session expired.");
  }

  if (!res.ok) {
    let errorData: any = {};
    try {
      errorData = await res.json();
    } catch { /* ignore non-json errors */ }
    
    const message = errorData?.detail || errorData?.message || `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return res.json();
}

export async function signup(email: string, password: string) {
  return apiFetch("/api/v1/auth/register/", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function login(email: string, password: string) {
  return apiFetch("/api/v1/auth/login/", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function generateQuiz(topic: string, number_of_questions: number, difficulty: string) {
  return apiFetch("/api/v1/quizzes/generate/", {
    method: "POST",
    body: JSON.stringify({ topic, number_of_questions, difficulty }),
  });
}

export async function submitQuizAttempt(quizId: string, answers: { question_id: string; selected_option: string }[]) {
  return apiFetch("/api/v1/attempts/", {
    method: "POST",
    body: JSON.stringify({ quiz_id: quizId, answers }),
  });
}

export async function getQuizHistory() {
  return apiFetch("/api/v1/quizzes/history/", { method: "GET" });
}

export async function getQuizDetail(quizId: string) {
  return apiFetch(`/api/v1/quizzes/${quizId}/`, { method: "GET" });
}
