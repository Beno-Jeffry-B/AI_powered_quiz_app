"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { getQuizHistory, getQuizDetail } from "@/lib/api";
import { useQuiz } from "@/context/QuizContext";
import { QuizCardSkeleton } from "@/components/Skeleton";
import { Toast, useToast } from "@/components/Toast";

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
  const { toast, showToast, hideToast } = useToast();
  const [history, setHistory] = useState<QuizHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'date' | 'score'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterOpen, setFilterOpen] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await getQuizHistory();
      setHistory(data.quizzes || []);
    } catch (err: any) {
      showToast(err.message || "Failed to load history.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/login");
      return;
    }
    fetchHistory();
  }, [router]);

  // Derived sorted history
  const sortedHistory = [...history].sort((a, b) => {
    if (sortBy === 'date') {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    } else {
      const scoreA = (a.score / (a.total_questions || 1));
      const scoreB = (b.score / (b.total_questions || 1));
      return sortOrder === 'desc' ? scoreB - scoreA : scoreA - scoreB;
    }
  });

  const handleRetake = async (quizId: string) => {
    try {
      const data = await getQuizDetail(quizId);
      startQuiz(data);
      router.push(`/exam/${quizId}`);
    } catch (err: any) {
      showToast("Failed to load quiz details for retake.", "error");
    }
  };

  const handleReview = (quizId: string) => {
    router.push(`/review/${quizId}`);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900 leading-tight">Exam History</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">
            Track your learning journey
          </p>
        </div>

        {/* Filter Section */}
        {!loading && history.length > 0 && (
          <div className="relative">
            <button 
              onClick={() => setFilterOpen(!filterOpen)}
              className="w-full md:w-auto flex items-center justify-center gap-3 px-6 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all font-bold text-gray-600 active:scale-95"
            >
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filter & Sort
              <svg className={`w-4 h-4 transition-transform duration-300 ${filterOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {filterOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-white rounded-3xl shadow-2xl border border-gray-50 z-50 p-6 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                <div>
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-4">Sort by Date</p>
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => { setSortBy('date'); setSortOrder('desc'); setFilterOpen(false); }}
                      className={`text-left px-4 py-3 rounded-xl font-bold text-sm transition-all ${sortBy === 'date' && sortOrder === 'desc' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      Newest First
                    </button>
                    <button 
                      onClick={() => { setSortBy('date'); setSortOrder('asc'); setFilterOpen(false); }}
                      className={`text-left px-4 py-3 rounded-xl font-bold text-sm transition-all ${sortBy === 'date' && sortOrder === 'asc' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      Oldest First
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-4">Sort by Score</p>
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => { setSortBy('score'); setSortOrder('desc'); setFilterOpen(false); }}
                      className={`text-left px-4 py-3 rounded-xl font-bold text-sm transition-all ${sortBy === 'score' && sortOrder === 'desc' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      Highest Score
                    </button>
                    <button 
                      onClick={() => { setSortBy('score'); setSortOrder('asc'); setFilterOpen(false); }}
                      className={`text-left px-4 py-3 rounded-xl font-bold text-sm transition-all ${sortBy === 'score' && sortOrder === 'asc' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      Lowest Score
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => <QuizCardSkeleton key={i} />)}
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
          <div className="flex flex-col items-center gap-4">
            <a href="/dashboard" className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-lg shadow-lg hover:shadow-indigo-100 transition-all inline-block hover:scale-105">Start Now</a>
            <button onClick={fetchHistory} className="text-indigo-600 font-bold text-sm hover:underline">Refresh History</button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedHistory.map((item) => (
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
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={hideToast} 
        />
      )}
    </DashboardLayout>
  );
}
