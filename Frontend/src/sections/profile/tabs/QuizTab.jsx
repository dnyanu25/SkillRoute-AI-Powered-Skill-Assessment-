import { BookOpen } from 'lucide-react';

export default function QuizTab({ quizHistory }) {

    const getScoreColor = (score) => {
        if (score >= 80) return 'bg-green-500/20 text-green-400';
        if (score >= 60) return 'bg-yellow-500/20 text-yellow-400';
        return 'bg-red-500/20 text-red-400';
    };

    const getDifficultyLabel = (level) => {
        const labels = { 1: 'Beginner', 2: 'Easy', 3: 'Medium', 4: 'Hard', 5: 'Expert' };
        return labels[level] || 'Medium';
    };

    return (
        <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Quiz History</h3>

            {quizHistory.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                    <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No quizzes taken yet.</p>
                    <p className="text-sm mt-1">Take a quiz to see your history here!</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {quizHistory.map((quiz) => (
                        <div key={quiz.id} className="flex items-center gap-4 bg-white/5 rounded-xl p-4 border border-white/10">

                            {/* Icon */}
                            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                <BookOpen className="w-5 h-5 text-blue-400" />
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                                <p className="font-semibold">{quiz.skill}</p>
                                <div className="flex gap-3 mt-1">
                                    <span className="text-xs text-gray-400">
                                        {quiz.totalQuestions} questions
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        Difficulty: {getDifficultyLabel(quiz.difficulty)}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {quiz.date}
                                    </span>
                                </div>
                            </div>

                            {/* Score */}
                            <span className={`text-sm font-bold px-3 py-1 rounded-full ${getScoreColor(quiz.score)}`}>
                                {quiz.score}%
                            </span>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}