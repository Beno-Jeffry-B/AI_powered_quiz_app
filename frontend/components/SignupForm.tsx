"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signup } from "@/lib/api";
import PasswordInput from "@/components/PasswordInput";

export default function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [matchError, setMatchError] = useState("");
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMatchError("Passwords do not match.");
      return;
    }
    setMatchError("");
    setApiError("");
    setLoading(true);
    try {
      const data = await signup(email, password);
      // Auto-login: Store tokens and redirect
      localStorage.setItem("access_token", data.access_token ?? "");
      // refresh_token could also be stored if needed for rotation
      router.push("/dashboard");
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-xl mb-4">
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">AI Quiz System</h1>
          <p className="text-sm text-gray-500 mt-1">Create your account to get started</p>
        </div>

        {/* API Error */}
        {apiError && (
          <div className="mb-5 text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded-lg">
            {apiError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
              Email address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <PasswordInput
              id="signup-password"
              value={password}
              onChange={setPassword}
              autoComplete="new-password"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1.5">
              Confirm Password
            </label>
            <PasswordInput
              id="confirm-password"
              value={confirmPassword}
              onChange={(val) => {
                setConfirmPassword(val);
                if (matchError) setMatchError("");
              }}
              autoComplete="new-password"
              hasError={!!matchError}
            />
            {matchError && (
              <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd" />
                </svg>
                {matchError}
              </p>
            )}
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading} className="btn-primary mt-2">
            {loading ? "Creating account..." : "Sign Up"}
          </button>

        </form>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}
