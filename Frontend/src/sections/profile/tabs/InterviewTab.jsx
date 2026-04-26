import { Mic } from 'lucide-react';

export default function InterviewTab({ interviewHistory }) {

    const getScoreColor = (score) => {
        if (score >= 80) return 'bg-green-500/20 text-green-400';
        if (score >= 60) return 'bg-yellow-500/20 text-yellow-400';
        return 'bg-red-500/20 text-red-400';
    };

    const getDifficultyLabel = (level) => {
        const labels = { 1: 'Beginner', 2: 'Easy', 3: 'Medium', 4: 'Hard', 5: 'Expert' };
        return labels[level] || 'Medium';
    };

    const getLevel = (score) => {
        if (score >= 80) return 'Interview Ready 🚀';
        if (score >= 60) return 'Almost There 💪';
        return 'Keep Practicing 📚';
    };

    return (
        <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Interview History</h3>

            {interviewHistory.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                    <Mic className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No interviews taken yet.</p>
                    <p className="text-sm mt-1">Take a mock interview to see your history here!</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {interviewHistory.map((interview) => (
                        <div key={interview.id} className="flex items-center gap-4 bg-white/5 rounded-xl p-4 border border-white/10">

                            {/* Icon */}
                            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                                <Mic className="w-5 h-5 text-purple-400" />
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                                <p className="font-semibold">{interview.skill}</p>
                                <div className="flex gap-3 mt-1">
                                    <span className="text-xs text-gray-400">
                                        {interview.totalQuestions} questions
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        Difficulty: {getDifficultyLabel(interview.difficulty)}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {interview.date}
                                    </span>
                                </div>
                                <p className="text-xs text-purple-300 mt-1">
                                    {getLevel(interview.score)}
                                </p>
                            </div>

                            {/* Score */}
                            <span className={`text-sm font-bold px-3 py-1 rounded-full ${getScoreColor(interview.score)}`}>
                                {interview.score}%
                            </span>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}