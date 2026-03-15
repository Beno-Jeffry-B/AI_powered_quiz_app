"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuiz } from "@/context/QuizContext";
import DashboardLayout from "@/components/DashboardLayout";
import ResultModal from "@/components/ResultModal";
import { getQuizDetail } from "@/lib/api";
import { QuestionSkeleton } from "@/components/Skeleton";
import { Toast, useToast } from "@/components/Toast";

export default function ExamPage() {
  const { quizId } = useParams();
  const router = useRouter();
  const { toast, showToast, hideToast } = useToast();
  const { 
    activeQuiz, 
    selectedAnswers, 
    currentIndex, 
    timeLeft, 
    isFinished,
    startQuiz,
    setAnswer,
    nextQuestion,
    prevQuestion,
    finishQuiz,
    resetProgress
  } = useQuiz();

  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // Load quiz if not active or different ID
  useEffect(() => {
    if (!activeQuiz || activeQuiz.quiz_id !== quizId) {
      const loadQuiz = async () => {
        setLoading(true);
        try {
          const data = await getQuizDetail(quizId as string);
          startQuiz(data);
        } catch (err: any) {
          showToast(err.message || "Failed to load quiz.", "error");
        } finally {
          setLoading(false);
        }
      };
      loadQuiz();
    }
  }, [quizId, activeQuiz, startQuiz, showToast]);

  const currentQuestion = activeQuiz?.questions[currentIndex];
  const isLastQuestion = activeQuiz && currentIndex === activeQuiz.questions.length - 1;

  const handleFinish = () => {
    finishQuiz();
    setShowResult(true);
  };

  const calculateScore = () => {
    if (!activeQuiz) return 0;
    return activeQuiz.questions.reduce((acc, q) => {
      return acc + (selectedAnswers[q.id] === q.correct_answer ? 1 : 0);
    }, 0);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto py-8 px-4">
          <div className="flex items-center justify-between mb-10">
             <div className="space-y-2">
               <div className="w-48 h-8 bg-gray-200 animate-pulse rounded-lg" />
               <div className="w-32 h-4 bg-gray-100 animate-pulse rounded-lg" />
             </div>
             <div className="w-32 h-12 bg-gray-100 animate-pulse rounded-2xl" />
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full mb-12" />
          <QuestionSkeleton />
        </div>
      </DashboardLayout>
    );
  }

  // Handle case where quiz failed to load or is missing after loading
  if (!loading && !activeQuiz) {
    return (
      <DashboardLayout>
        <div className="max-w-xl mx-auto py-20 text-center">
          <div className="bg-red-50 text-red-600 p-8 rounded-[40px] border border-red-100 mb-8">
            <h2 className="text-2xl font-black mb-4">Exam Not Found</h2>
            <p className="font-bold opacity-80 mb-6 text-sm uppercase tracking-widest">The quiz could not be loaded or doesn't exist.</p>
            <button 
              onClick={() => router.push('/dashboard')} 
              className="bg-red-600 text-white px-8 py-3 rounded-2xl font-black text-sm hover:bg-red-700 transition-all active:scale-95"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!activeQuiz || !currentQuestion) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto py-8 px-4 pb-32">
        
        {/* Exam Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-black text-gray-900 leading-tight">
              {activeQuiz.title}
            </h1>
            <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">
              {activeQuiz.difficulty} Difficulty
            </p>
          </div>

          <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl border-2 transition-colors
            ${timeLeft < 60 ? 'bg-red-50 border-red-100 text-red-600' : 'bg-indigo-50 border-indigo-100 text-indigo-600'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-lg font-black tabular-nums">{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-gray-100 rounded-full mb-12 overflow-hidden shadow-inner">
          <div 
            className="h-full bg-indigo-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentIndex + 1) / activeQuiz.questions.length) * 100}%` }}
          />
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-[40px] shadow-xl shadow-indigo-100/50 border border-gray-100 p-10 md:p-14 mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 opacity-50" />
          
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 leading-relaxed mb-10 relative z-10">
            {currentQuestion.question_text}
          </h2>

          <div className="space-y-4 relative z-10">
            {['A', 'B', 'C', 'D'].map((opt) => {
              const label = opt as 'A' | 'B' | 'C' | 'D';
              const value = currentQuestion[`option_${label.toLowerCase()}` as keyof typeof currentQuestion];
              const isSelected = selectedAnswers[currentQuestion.id] === label;

              return (
                <button
                  key={label}
                  onClick={() => setAnswer(currentQuestion.id, label)}
                  className={`w-full text-left flex items-center gap-5 p-5 md:p-6 rounded-3xl border-2 transition-all duration-200 group
                    ${isSelected 
                      ? 'bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-200' 
                      : 'bg-white border-gray-100 hover:border-indigo-200 hover:bg-gray-50'}`}
                >
                  <span className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm transition-colors
                    ${isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-indigo-100 group-hover:text-indigo-600'}`}>
                    {label}
                  </span>
                  <span className={`flex-1 font-bold text-lg ${isSelected ? 'text-white' : 'text-gray-700'}`}>
                    {value}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 p-6 z-40">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-6">
          <button
            onClick={prevQuestion}
            disabled={currentIndex === 0}
            className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all
              ${currentIndex === 0 ? 'bg-gray-50 text-gray-200' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Previous</span>
          </button>

          <div className="text-center">
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1">Status</p>
            <p className="text-gray-900 font-black">
              {currentIndex + 1} <span className="text-gray-300 mx-1">/</span> {activeQuiz.questions.length}
            </p>
          </div>

          {isLastQuestion ? (
            <button
              onClick={handleFinish}
              className="px-8 py-4 bg-green-600 text-white rounded-2xl font-black shadow-lg shadow-green-100 hover:bg-green-700 hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-2"
            >
              Finish Exam
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-2"
            >
              <span>Next</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <ResultModal 
        isOpen={showResult || isFinished}
        onClose={() => {
          setShowResult(false);
        }}
        score={calculateScore()}
        total={activeQuiz.questions.length}
        onRetake={() => {
          const quiz = activeQuiz;
          resetProgress();
          startQuiz(quiz);
          setShowResult(false);
        }}
        quizId={activeQuiz.quiz_id}
      />

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
