import { CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';

export default function QuizAnalysis({ quizData, userAnswers, onBack }) {
    return (
           <div className="min-h-screen pb-8">
        <div className="glass rounded-2xl p-8 max-w-4xl mx-auto">
            <div className="sticky top-0 bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-sm pb-4 mb-6 border-b border-white/10 z-10">
                <h2 className="text-3xl font-bold text-center">
                    Detailed Analysis 📊
                </h2>
                <p className="text-center text-gray-400 mt-2">
                    Review each question and learn from your mistakes
                </p>
            </div>

            <div className="space-y-6">
                {quizData.questions.map((question, qIndex) => {
                    const userAnswer = userAnswers[qIndex];
                    const isCorrect = userAnswer === question.correctAnswer;

                    return (
                        <div
                            key={qIndex}
                            className={`border-2 rounded-lg p-6 ${
                                isCorrect
                                    ? 'border-green-500/50 bg-green-500/10'
                                    : 'border-red-500/50 bg-red-500/10'
                            }`}
                        >
                            {/* Question Header */}
                            <div className="flex items-start gap-3 mb-4">
                                {isCorrect ? (
                                    <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                                ) : (
                                    <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                                )}
                                <div className="flex-1">
                                    <p className="text-sm text-gray-400 mb-1">
                                        Question {qIndex + 1}
                                    </p>
                                    <p className="text-lg font-semibold">{question.question}</p>
                                </div>
                            </div>

                            {/* Options */}
                            <div className="space-y-2 mb-4">
                                {question.options.map((option, oIndex) => {
                                    const isUserAnswer = userAnswer === oIndex;
                                    const isCorrectAnswer = question.correctAnswer === oIndex;

                                    return (
                                        <div
                                            key={oIndex}
                                            className={`p-3 rounded-lg border ${
                                                isCorrectAnswer
                                                    ? 'border-green-500 bg-green-500/20'
                                                    : isUserAnswer
                                                    ? 'border-red-500 bg-red-500/20'
                                                    : 'border-white/20 bg-white/5'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                {isCorrectAnswer && (
                                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                )}
                                                {isUserAnswer && !isCorrectAnswer && (
                                                    <XCircle className="w-5 h-5 text-red-500" />
                                                )}
                                                <span>{option}</span>
                                                {isCorrectAnswer && (
                                                    <span className="ml-auto text-xs font-semibold text-green-500">
                                                        Correct Answer
                                                    </span>
                                                )}
                                                {isUserAnswer && !isCorrectAnswer && (
                                                    <span className="ml-auto text-xs font-semibold text-red-500">
                                                        Your Answer
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Explanation */}
                            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                <p className="text-sm font-semibold text-blue-400 mb-2">
                                    Explanation:
                                </p>
                                <p className="text-gray-300">{question.explanation}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Back Button */}
            <div className="pt-6 mt-6 border-t border-white/10">
                <button
                    onClick={onBack}
                    className="btn glass w-full py-3 flex items-center justify-center gap-2"
                >
                    <ArrowLeft className="w-5 h-5" /> Back to Results
                </button>
            </div>
        </div>
        </div>
    );
}