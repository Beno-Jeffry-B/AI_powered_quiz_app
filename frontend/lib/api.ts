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
    // fetch() itself threw — network down, CORS preflight failure, wrong port, etc.
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
      // body isn't JSON — ignore
    }
    console.error("[api] Server error:", res.status, data);
    const message =
      (data?.detail as string) ||
      (data?.email as string[])?.[0] ||
      (data?.password as string[])?.[0] ||
      `Request failed (${res.status}).`;
    throw new Error(message);
  }

  return res.json();
}

export async function signup(email: string, password: string) {
  return apiFetch(`${API_BASE}/api/v1/auth/register/`, { email, password });
}

export async function login(email: string, password: string) {
  return apiFetch(`${API_BASE}/api/v1/auth/login/`, { email, password });
}
