"use client";

interface Question {
  id?: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer?: string;
}

interface QuizCardProps {
  question: Question;
  index: number;
  selectedOption?: string;
  onSelect?: (option: string) => void;
  showResults?: boolean;
}

export default function QuizCard({
  question,
  index,
  selectedOption,
  onSelect,
  showResults = false,
}: QuizCardProps) {
  const options = [
    { label: "A", value: question.option_a },
    { label: "B", value: question.option_b },
    { label: "C", value: question.option_c },
    { label: "D", value: question.option_d },
  ];

  return (
    <div className={`bg-white rounded-xl border shadow-sm p-6 transition-all duration-200
      ${showResults ? "border-gray-100" : "border-gray-100 hover:border-indigo-200"}`}>
      
      {/* Question header */}
      <div className="flex gap-3 mb-5">
        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-100 text-indigo-700
                         text-sm font-semibold flex items-center justify-center">
          {index + 1}
        </span>
        <p className="text-sm font-medium text-gray-900 leading-relaxed">
          {question.question_text}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-2.5 ml-10">
        {options.map(({ label, value }) => {
          const isSelected = selectedOption === label;
          const isCorrect = question.correct_answer === label;
          
          let statusStyles = "bg-gray-50 border-gray-100 text-gray-700 hover:bg-gray-100 cursor-pointer";
          let badgeStyles = "bg-gray-200 text-gray-600";

          if (showResults) {
            if (isCorrect) {
              statusStyles = "bg-green-50 border-green-200 text-green-800";
              badgeStyles = "bg-green-500 text-white";
            } else if (isSelected) {
              statusStyles = "bg-red-50 border-red-200 text-red-800";
              badgeStyles = "bg-red-500 text-white";
            } else {
              statusStyles = "bg-gray-50 border-gray-100 text-gray-400 opacity-60";
              badgeStyles = "bg-gray-200 text-gray-400";
            }
          } else if (isSelected) {
            statusStyles = "bg-indigo-50 border-indigo-200 text-indigo-800 ring-2 ring-indigo-600 ring-opacity-10";
            badgeStyles = "bg-indigo-600 text-white";
          }

          return (
            <button
              key={label}
              disabled={showResults}
              onClick={() => onSelect?.(label)}
              className={`w-full text-left flex items-start gap-3 px-4 py-3 rounded-xl border text-sm transition-all
                ${statusStyles} ${!showResults && "active:scale-[0.98]"}`}
            >
              <span className={`flex-shrink-0 w-6 h-6 rounded-full text-xs font-bold
                              flex items-center justify-center mt-0.5 transition-colors
                ${badgeStyles}`}
              >
                {label}
              </span>
              <span className="flex-1">{value}</span>
              
              {showResults && isCorrect && (
                <span className="ml-auto flex items-center gap-1 text-xs font-bold text-green-600 uppercase tracking-wider">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  Correct
                </span>
              )}
              {showResults && isSelected && !isCorrect && (
                <span className="ml-auto flex items-center gap-1 text-xs font-bold text-red-600 uppercase tracking-wider">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Incorrect
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
