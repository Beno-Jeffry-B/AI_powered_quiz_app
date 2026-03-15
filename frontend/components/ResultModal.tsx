"use client";

import { useRouter } from 'next/navigation';
import { useQuiz } from '@/context/QuizContext';

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  score: number;
  total: number;
  onRetake: () => void;
  quizId?: string;
}

export default function ResultModal({ isOpen, onClose, score, total, onRetake, quizId }: ResultModalProps) {
  const router = useRouter();
  const { resetProgress } = useQuiz();
  if (!isOpen) return null;

  const percentage = Math.round((score / total) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-indigo-900/20 backdrop-blur-md" />
      
      <div className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl p-10 text-center animate-in fade-in zoom-in slide-in-from-bottom-10 duration-500">
        
        {/* Success Icon */}
        <div className="w-24 h-24 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-indigo-200 rotate-3">
           <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 className="text-3xl font-black text-gray-900 mb-2">Quiz Finished!</h2>
        <p className="text-gray-400 font-medium mb-10">You've successfully completed the exam.</p>

        <div className="bg-gray-50 rounded-3xl p-8 mb-10">
          <div className="text-6xl font-black text-indigo-600 mb-2">{percentage}%</div>
          <div className="text-gray-400 font-bold uppercase tracking-widest text-xs">
            Score: {score} out of {total}
          </div>
        </div>

        <div className="space-y-4">
          <button 
            onClick={() => {
              onClose();
              if (quizId) router.push(`/review/${quizId}`);
            }}
            className="w-full py-4 bg-indigo-50 text-indigo-600 rounded-2xl font-bold text-lg hover:bg-indigo-100 transition-all active:scale-95"
          >
            Review Questions
          </button>
          <button 
            onClick={onRetake}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 hover:-translate-y-1 transition-all shadow-lg active:scale-95"
          >
            Retake Quiz
          </button>
          <button 
            onClick={() => {
              onClose();
              resetProgress();
              router.push('/dashboard');
            }}
            className="w-full py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold text-lg hover:bg-gray-200 transition-all active:scale-95"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
