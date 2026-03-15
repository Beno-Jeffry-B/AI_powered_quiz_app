"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface Question {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
}

interface Quiz {
  quiz_id: string;
  title: string;
  difficulty: string;
  time_limit: number;
  questions: Question[];
}

interface QuizContextType {
  activeQuiz: Quiz | null;
  selectedAnswers: Record<string, string>;
  currentIndex: number;
  timeLeft: number;
  isFinished: boolean;
  startQuiz: (quiz: Quiz) => void;
  setAnswer: (questionId: string, option: string) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  finishQuiz: () => void;
  resetProgress: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('quiz_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setActiveQuiz(parsed.activeQuiz);
        setSelectedAnswers(parsed.selectedAnswers);
        setCurrentIndex(parsed.currentIndex);
        setTimeLeft(parsed.timeLeft);
        setIsFinished(parsed.isFinished);
      } catch (e) {
        console.error("Failed to load quiz session", e);
      }
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (activeQuiz) {
      localStorage.setItem('quiz_session', JSON.stringify({
        activeQuiz,
        selectedAnswers,
        currentIndex,
        timeLeft,
        isFinished
      }));
    } else {
      localStorage.removeItem('quiz_session');
    }
  }, [activeQuiz, selectedAnswers, currentIndex, timeLeft, isFinished]);

  // Timer interval
  useEffect(() => {
    if (activeQuiz && timeLeft > 0 && !isFinished) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [activeQuiz, timeLeft, isFinished]);

  const startQuiz = (quiz: Quiz, durationMinutes?: number) => {
    setActiveQuiz(quiz);
    setSelectedAnswers({});
    setCurrentIndex(0);
    // Use quiz.time_limit if available, otherwise fall back to provided duration or default based on questions
    const minutes = quiz.time_limit || durationMinutes || quiz.questions.length;
    setTimeLeft(minutes * 60);
    setIsFinished(false);
  };

  const setAnswer = (questionId: string, option: string) => {
    if (isFinished) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const nextQuestion = () => {
    if (activeQuiz && currentIndex < activeQuiz.questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const finishQuiz = () => {
    setIsFinished(true);
  };

  const resetProgress = () => {
    setActiveQuiz(null);
    setSelectedAnswers({});
    setCurrentIndex(0);
    setTimeLeft(0);
    setIsFinished(false);
    localStorage.removeItem('quiz_session');
  };

  return (
    <QuizContext.Provider value={{
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
    }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}
