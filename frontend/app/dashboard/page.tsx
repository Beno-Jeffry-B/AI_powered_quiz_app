"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import Modal from "@/components/Modal";
import { generateQuiz } from "@/lib/api";
import { useQuiz } from "@/context/QuizContext";
import { Toast, useToast } from "@/components/Toast";

export default function DashboardPage() {
  const router = useRouter();
  const { startQuiz } = useQuiz();
  const { toast, showToast, hideToast } = useToast();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [topic, setTopic] = useState("");
  const [numQuestions, setNumQuestions] = useState("5");
  const [numMinutes, setNumMinutes] = useState("10");
  const [difficulty, setDifficulty] = useState("medium");
  const [loading, setLoading] = useState(false);

  // Auth guard
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) router.replace("/login");
  }, [router]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await generateQuiz(topic, Number(numQuestions), difficulty);
      startQuiz(data);
      router.push(`/exam/${data.quiz_id}`);
    } catch (err: any) {
      showToast(err.message || "Failed to generate quiz. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-12">
        {/* Welcome Section */}
        <div className="bg-indigo-600 rounded-[40px] p-10 md:p-16 text-white mb-10 overflow-hidden relative shadow-2xl shadow-indigo-100">
           {/* Abstract shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl opacity-50" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400 rounded-full -ml-10 -mb-10 blur-2xl opacity-30" />
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <span className="bg-white/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
              Welcome back
            </span>
            <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
              Ready to challenge <br /> your knowledge?
            </h1>
            <p className="text-indigo-100 text-lg max-w-lg mb-10 leading-relaxed font-medium">
              "Tell me and I forget. Teach me and I remember. Involve me and I learn." — Benjamin Franklin
            </p>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-indigo-600 px-10 py-5 rounded-3xl font-black text-lg transition-all 
                         hover:shadow-xl hover:shadow-indigo-900/20 hover:-translate-y-1 active:scale-95"
            >
              Create New Quiz
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
          <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Instant Generation</h3>
            <p className="text-gray-500 font-medium">AI-powered questions on any topic in seconds.</p>
          </div>
          
          <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm">
             <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Track Progress</h3>
            <p className="text-gray-500 font-medium">Review history and retake quizzes to improve.</p>
          </div>
        </div>
      </div>

      {/* Generator Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Quiz Settings"
      >
        <form onSubmit={handleGenerate} className="space-y-6">

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Topic</label>
            <input
              type="text" value={topic} onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. History, Math, Python..." required 
              className="w-full px-6 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Questions</label>
              <select 
                value={numQuestions} onChange={(e) => setNumQuestions(e.target.value)} 
                className="w-full px-6 py-4 bg-gray-50 border-transparent rounded-2xl outline-none appearance-none cursor-pointer"
              >
                <option value="5">5</option><option value="10">10</option><option value="15">15</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Timer (min)</label>
              <select 
                value={numMinutes} onChange={(e) => setNumMinutes(e.target.value)} 
                className="w-full px-6 py-4 bg-gray-50 border-transparent rounded-2xl outline-none appearance-none cursor-pointer"
              >
                <option value="5">5m</option><option value="10">10m</option><option value="15">15m</option><option value="20">20m</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Difficulty</label>
            <select 
              value={difficulty} onChange={(e) => setDifficulty(e.target.value)} 
              className="w-full px-6 py-4 bg-gray-50 border-transparent rounded-2xl outline-none appearance-none cursor-pointer"
            >
              <option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option>
            </select>
          </div>

          <button type="submit" disabled={loading} className="w-full py-5 bg-indigo-600 text-white rounded-[25px] font-black shadow-lg hover:shadow-indigo-100 transition-all flex items-center justify-center gap-3">
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Generate Exam"
            )}
          </button>
        </form>
      </Modal>
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
