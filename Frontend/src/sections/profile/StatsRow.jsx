import { BookOpen, Award, Mic, Layers } from 'lucide-react';

export default function StatsRow({ stats }) {
    const cards = [
        {
            icon: <BookOpen className="w-6 h-6 text-blue-400" />,
            label: "Total Quizzes",
            value: stats.totalQuizzes,
            sub: `Avg Score: ${stats.avgQuizScore}%`
        },
        {
            icon: <Mic className="w-6 h-6 text-purple-400" />,
            label: "Interviews",
            value: stats.totalInterviews,
            sub: `Avg Score: ${stats.avgInterviewScore}%`
        },
        {
            icon: <Layers className="w-6 h-6 text-green-400" />,
            label: "Roadmaps",
            value: stats.skillsLearning,
            sub: "Skills in progress"
        },
        {
            icon: <Award className="w-6 h-6 text-yellow-400" />,
            label: "Best Quiz Score",
            value: `${stats.avgQuizScore}%`,
            sub: "Keep it up!"
        }
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {cards.map((card, idx) => (
                <div key={idx} className="glass rounded-2xl p-5 text-center">
                    <div className="flex justify-center mb-3">
                        {card.icon}
                    </div>
                    <p className="text-3xl font-bold mb-1">{card.value}</p>
                    <p className="text-sm font-semibold mb-1">{card.label}</p>
                    <p className="text-xs text-gray-400">{card.sub}</p>
                </div>
            ))}
        </div>
    );
}