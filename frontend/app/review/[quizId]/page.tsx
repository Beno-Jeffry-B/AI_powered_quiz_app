"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuiz } from "@/context/QuizContext";
import DashboardLayout from "@/components/DashboardLayout";
import { getQuizDetail } from "@/lib/api";

export default function ReviewPage() {
  const { quizId } = useParams();
  const router = useRouter();
  const { selectedAnswers, resetProgress, startQuiz } = useQuiz();
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await getQuizDetail(quizId as string);
        setQuiz(data);
      } catch (err: any) {
        setError(err.message || "Failed to load quiz for review.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full mb-4"></div>
          <p className="text-gray-400 font-bold">Loading Review...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !quiz) {
    return (
      <DashboardLayout>
        <div className="max-w-xl mx-auto py-20 text-center">
          <div className="bg-red-50 text-red-600 p-8 rounded-3xl border border-red-100 mb-6 font-bold">{error}</div>
          <button onClick={() => router.push('/dashboard')} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold">Back to Dashboard</button>
        </div>
      </DashboardLayout>
    );
  }

  const handleRetake = () => {
    resetProgress();
    startQuiz(quiz);
    router.push(`/exam/${quizId}`);
  };

  const handleExit = () => {
    resetProgress();
    router.push('/history');
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto py-10 px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-black text-gray-900 leading-tight">Exam Review</h1>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">{quiz.title}</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={handleRetake}
              className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-100"
            >
              Retake Quiz
            </button>
            <button 
              onClick={handleExit}
              className="px-6 py-3 bg-white border border-gray-200 text-gray-600 rounded-2xl font-bold hover:bg-gray-50 transition-all"
            >
              Back to History
            </button>
          </div>
        </div>

        <div className="space-y-10">
          {quiz.questions.map((q: any, index: number) => {
            // Prioritize user_selection from API (for history) over selectedAnswers from context (for immediate review)
            const userAnswer = q.user_selection || selectedAnswers[q.id];
            const isCorrect = userAnswer === q.correct_answer;

            return (
              <div key={q.id} className="bg-white rounded-[40px] shadow-xl shadow-indigo-100/30 border border-gray-100 p-8 md:p-12 relative overflow-hidden">
                {/* Status Indicator Bar */}
                <div className={`absolute top-0 left-0 bottom-0 w-2 ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`} />
                
                <div className="flex items-start gap-6 mb-8">
                  <span className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-sm
                    ${isCorrect ? 'bg-green-600' : 'bg-red-600'}`}>
                    {index + 1}
                  </span>
                  <h3 className="text-xl font-bold text-gray-800 leading-relaxed pt-1">{q.question_text}</h3>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {['A', 'B', 'C', 'D'].map((label) => {
                    const optionValue = q[`option_${label.toLowerCase()}`];
                    const isUserSelection = userAnswer === label;
                    const isCorrectAnswer = q.correct_answer === label;

                    let bgColor = 'bg-white';
                    let borderColor = 'border-gray-100';
                    let textColor = 'text-gray-700';

                    if (isCorrectAnswer) {
                      bgColor = 'bg-green-50';
                      borderColor = 'border-green-300';
                      textColor = 'text-green-800';
                    } else if (isUserSelection && !isCorrect) {
                      bgColor = 'bg-red-50';
                      borderColor = 'border-red-300';
                      textColor = 'text-red-800';
                    }

                    return (
                      <div 
                        key={label}
                        className={`flex items-center gap-4 p-5 rounded-3xl border-2 transition-all ${bgColor} ${borderColor}`}
                      >
                         <span className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs
                          ${isCorrectAnswer ? 'bg-green-600 text-white' : 
                            isUserSelection ? 'bg-red-600 text-white' : 'bg-gray-50 text-gray-400'}`}>
                          {label}
                        </span>
                        
                        <span className={`font-bold ${textColor}`}>{optionValue}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
