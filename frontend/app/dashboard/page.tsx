"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";

export default function DashboardPage() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [numQuestions, setNumQuestions] = useState("5");
  const [difficulty, setDifficulty] = useState("medium");

  // Auth guard — redirect to /login if no token
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Generate Quiz:", {
      topic,
      number_of_questions: Number(numQuestions),
      difficulty,
    });
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Generate a new AI-powered quiz in seconds.
        </p>
      </div>

      {/* Quiz Generation Card */}
      <div className="max-w-xl">
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
            <button type="submit" className="btn-primary mt-2">
              Generate Quiz
            </button>

          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
