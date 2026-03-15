interface Question {
  id?: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer?: string;
}

const OPTION_LABELS: Record<string, string> = {
  option_a: "A",
  option_b: "B",
  option_c: "C",
  option_d: "D",
};

export default function QuizCard({
  question,
  index,
}: {
  question: Question;
  index: number;
}) {
  const options = [
    { key: "option_a", label: "A", value: question.option_a },
    { key: "option_b", label: "B", value: question.option_b },
    { key: "option_c", label: "C", value: question.option_c },
    { key: "option_d", label: "D", value: question.option_d },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      {/* Question header */}
      <div className="flex gap-3 mb-4">
        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-100 text-indigo-700
                         text-sm font-semibold flex items-center justify-center">
          {index + 1}
        </span>
        <p className="text-sm font-medium text-gray-900 leading-relaxed">
          {question.question_text}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-2 ml-10">
        {options.map(({ key, label, value }) => {
          const isCorrect =
            question.correct_answer &&
            question.correct_answer.toUpperCase() === label;

          return (
            <div
              key={key}
              className={`flex items-start gap-2.5 px-3 py-2 rounded-lg text-sm
                ${isCorrect
                  ? "bg-green-50 border border-green-200 text-green-800"
                  : "bg-gray-50 border border-gray-100 text-gray-700"
                }`}
            >
              <span
                className={`flex-shrink-0 w-5 h-5 rounded-full text-xs font-semibold
                              flex items-center justify-center mt-0.5
                  ${isCorrect
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-600"
                  }`}
              >
                {label}
              </span>
              <span>{value}</span>
              {isCorrect && (
                <span className="ml-auto text-xs font-semibold text-green-600">
                  ✓ Correct
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
