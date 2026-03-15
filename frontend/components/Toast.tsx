"use client";

import React, { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type, onClose, duration = 4000 }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgColor = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-indigo-600",
  }[type];

  return (
    <div
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 transform ${
        isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-4 opacity-0 scale-95"
      }`}
    >
      <div className={`${bgColor} text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold min-w-[320px] justify-between`}>
        <div className="flex items-center gap-3">
          {type === "error" && <span>⚠️</span>}
          {type === "success" && <span>✅</span>}
          {type === "info" && <span>ℹ️</span>}
          <p>{message}</p>
        </div>
        <button onClick={() => setIsVisible(false)} className="text-white/60 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// Simple Toast Manager Hook logic (optional if we want to expose it)
export function useToast() {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = (message: string, type: ToastType = "info") => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  return { toast, showToast, hideToast };
}
