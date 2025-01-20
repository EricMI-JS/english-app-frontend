import React from 'react';
import { Trophy } from 'lucide-react';

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
}

export function QuizResults({ score, totalQuestions, onRestart }: QuizResultsProps) {
  const percentage = (score / totalQuestions) * 100;

  return (
    <div className="text-center space-y-6">
      <Trophy className="w-16 h-16 text-yellow-500 mx-auto" />
      <h2 className="text-2xl font-bold text-gray-800">Quiz Complete!</h2>
      <p className="text-xl">
        Your score: {score} out of {totalQuestions} ({percentage}%)
      </p>
      <button
        onClick={onRestart}
        className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition"
      >
        Try Again
      </button>
    </div>
  );
}