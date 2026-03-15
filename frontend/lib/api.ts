const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

async function apiFetch(url: string, body: object) {
  let res: Response;

  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (networkErr) {
    console.error("[api] Network error:", networkErr);
    throw new Error(
      "Cannot reach the server. Make sure the backend is running on port 8000."
    );
  }

  if (!res.ok) {
    let data: Record<string, unknown> = {};
    try {
      data = await res.json();
    } catch {
      // ignore
    }
    console.error("[api] Server error:", res.status, data);
    const message =
      (data?.detail as string) ||
      (data?.email as string[])?.[0] ||
      (data?.password as string[])?.[0] ||
      `Request failed (${res.status}).`;
    throw new Error(message);
  }

  const data = await res.json();
  console.log(`[api] ${url} response:`, data);
  return data;
}

export async function signup(email: string, password: string) {
  return apiFetch(`${API_BASE}/api/v1/auth/register/`, { email, password });
}

export async function login(email: string, password: string) {
  return apiFetch(`${API_BASE}/api/v1/auth/login/`, { email, password });
}

export async function generateQuiz(
  topic: string,
  number_of_questions: number,
  difficulty: string
) {
  const token = localStorage.getItem("access_token") ?? "";

  let res: Response;
  try {
    res = await fetch(`${API_BASE}/api/v1/quizzes/generate/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ topic, number_of_questions, difficulty }),
    });
  } catch (networkErr) {
    console.error("[api] Network error:", networkErr);
    throw new Error("Cannot reach the server. Make sure the backend is running.");
  }

  if (!res.ok) {
    let data: Record<string, unknown> = {};
    try { data = await res.json(); } catch { /* ignore */ }
    console.error("[api] Server error:", res.status, data);
    const message =
      (data?.detail as string) ||
      (data?.message as string) ||
      `Request failed (${res.status}).`;
    throw new Error(message);
  }

  const data = await res.json();
  console.log("[api] generateQuiz response:", data);
  return data;
}
