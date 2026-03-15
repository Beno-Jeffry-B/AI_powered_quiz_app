"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { getQuizHistory, getQuizDetail } from "@/lib/api";
import { useQuiz } from "@/context/QuizContext";

interface QuizHistoryItem {
  quiz_id: string;
  topic: string;
  difficulty: string;
  score: number;
  total_questions: number;
  created_at: string;
}

export default function HistoryPage() {
  const router = useRouter();
  const { startQuiz } = useQuiz();
  const [history, setHistory] = useState<QuizHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/login");
      return;
    }

    const fetchHistory = async () => {
      try {
        const data = await getQuizHistory();
        setHistory(data.quizzes || []);
      } catch (err: any) {
        setError(err.message || "Failed to load history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [router]);

  const handleRetake = async (quizId: string) => {
    try {
      const data = await getQuizDetail(quizId);
      startQuiz(data);
      router.push(`/exam/${quizId}`);
    } catch (err: any) {
      alert("Failed to load quiz details for retake.");
    }
  };

  const handleReview = (quizId: string) => {
    router.push(`/review/${quizId}`);
  };

  return (
    <DashboardLayout>
      <div className="mb-10">
        <h1 className="text-3xl font-black text-gray-900 leading-tight">Exam History</h1>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">
          Track your learning journey
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center py-24">
          <div className="animate-spin w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full mb-4"></div>
          <p className="text-gray-400 font-bold animate-pulse">Fetching your history...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-8 rounded-3xl border border-red-100 mb-6 text-center">
            <h2 className="text-xl font-bold mb-2">Oops!</h2>
            <p className="font-medium">{error}</p>
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[40px] border-2 border-dashed border-gray-100">
          <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
             <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-black text-gray-900 mb-2">No exams yet</h3>
          <p className="text-gray-400 font-medium mb-8">Ready to take your first AI-generated quiz?</p>
          <a href="/dashboard" className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-lg shadow-lg hover:shadow-indigo-100 transition-all inline-block">Start Now</a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {history.map((item) => (
            <div 
              key={item.quiz_id} 
              onClick={() => handleReview(item.quiz_id)}
              className="bg-white rounded-[32px] shadow-xl shadow-gray-100 border border-gray-50 p-8 hover:shadow-2xl hover:shadow-indigo-50/50 transition-all duration-300 group cursor-pointer active:scale-[0.98]"
            >
              <div className="flex justify-between items-start mb-6">
                 <span className={`px-3 py-1 bg-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest
                  ${item.difficulty === 'hard' ? 'text-red-500' : 
                    item.difficulty === 'medium' ? 'text-orange-500' : 
                    'text-green-500'}`}>
                  {item.difficulty}
                </span>
                <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">
                  {new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
              </div>
              
              <h3 className="font-black text-gray-900 text-xl mb-6 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                {item.topic}
              </h3>
              
              <div className="flex items-center gap-6 mb-8">
                <div className="flex-1">
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Final Score</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-indigo-600">{item.score}</span>
                    <span className="text-sm font-black text-gray-200">/ {item.total_questions}</span>
                  </div>
                </div>

                <div className="w-16 h-16 rounded-full border-[6px] border-gray-50 flex items-center justify-center relative bg-white shadow-inner">
                    <svg className="w-full h-full -rotate-90 absolute top-0 left-0" viewBox="0 0 36 36">
                        <path
                            className="stroke-indigo-600 transition-all duration-1000"
                            strokeDasharray={`${(item.score / (item.total_questions || 1)) * 100}, 100`}
                            strokeWidth="3.5"
                            fill="none"
                            strokeLinecap="round"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                    </svg>
                    <span className="relative z-10 text-[11px] font-black text-indigo-700">
                        {Math.round((item.score / (item.total_questions || 1)) * 100)}%
                    </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRetake(item.quiz_id);
                  }}
                  className="w-full bg-indigo-50 text-indigo-600 py-3.5 rounded-2xl font-black text-sm hover:bg-indigo-600 hover:text-white transition-all active:scale-95"
                >
                  Retake Quiz
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
