"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import QuizCard from "@/components/QuizCard";
import { generateQuiz } from "@/lib/api";

interface Question {
  id?: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer?: string;
}

interface QuizResult {
  quiz_id: string;
  title?: string;
  questions: Question[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [numQuestions, setNumQuestions] = useState("5");
  const [difficulty, setDifficulty] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<QuizResult | null>(null);

  // Auth guard
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) router.replace("/login");
  }, [router]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const data = await generateQuiz(topic, Number(numQuestions), difficulty);
      setResult(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      if (msg.includes("401") || msg.includes("403")) {
        localStorage.removeItem("access_token");
        router.replace("/login");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Generate an AI-powered quiz in seconds.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">

        {/* ── Quiz Generation Form ── */}
        <div className="w-full lg:w-[380px] flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900">Generate Quiz</h2>
                <p className="text-xs text-gray-500">Fill in the details below</p>
              </div>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-5 text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleGenerate} className="space-y-5">
              {/* Topic */}
              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Topic
                </label>
                <input
                  id="topic"
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Python Basics, World History..."
                  required
                  className="input-field"
                />
              </div>

              {/* Number of Questions */}
              <div>
                <label htmlFor="numQuestions" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Number of Questions
                </label>
                <select
                  id="numQuestions"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(e.target.value)}
                  className="input-field bg-white cursor-pointer"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                  <option value="20">20</option>
                </select>
              </div>

              {/* Difficulty */}
              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Difficulty
                </label>
                <select
                  id="difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="input-field bg-white cursor-pointer"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              {/* Generate Button */}
              <button type="submit" disabled={loading} className="btn-primary mt-2">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10"
                        stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Generating…
                  </span>
                ) : "Generate Quiz"}
              </button>
            </form>
          </div>
        </div>

        {/* ── Quiz Results ── */}
        {result && (
          <div className="flex-1 min-w-0">
            {/* Result header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {result.title ?? topic}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {result.questions?.length ?? 0} questions · {difficulty} difficulty
                </p>
              </div>
              <span className="text-xs font-medium bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
                Quiz ID: {result.quiz_id?.slice(0, 8)}…
              </span>
            </div>

            {/* Question Cards */}
            <div className="space-y-4">
              {(result.questions ?? []).map((q, i) => (
                <QuizCard key={q.id ?? i} question={q} index={i} />
              ))}
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
