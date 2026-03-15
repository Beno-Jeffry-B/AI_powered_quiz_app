"use client";

import React from "react";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded-2xl ${className}`} />
  );
}

export function QuizCardSkeleton() {
  return (
    <div className="bg-white rounded-[32px] border border-gray-50 p-8 shadow-sm">
      <div className="flex justify-between mb-6">
        <Skeleton className="w-16 h-6" />
        <Skeleton className="w-12 h-4" />
      </div>
      <Skeleton className="w-3/4 h-8 mb-6" />
      <div className="flex items-center gap-6 mb-8">
        <div className="flex-1">
          <Skeleton className="w-20 h-3 mb-2" />
          <Skeleton className="w-32 h-10" />
        </div>
        <Skeleton className="w-16 h-16 rounded-full" />
      </div>
      <Skeleton className="w-full h-12" />
    </div>
  );
}

export function QuestionSkeleton() {
  return (
    <div className="bg-white rounded-[40px] border border-gray-100 p-8 md:p-12">
      <div className="flex items-start gap-6 mb-8">
        <Skeleton className="w-10 h-10 rounded-2xl flex-shrink-0" />
        <div className="flex-1">
          <Skeleton className="w-full h-8 mb-2" />
          <Skeleton className="w-1/2 h-8" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="w-full h-16 rounded-3xl" />
        ))}
      </div>
    </div>
  );
}
