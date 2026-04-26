import { BookOpen, Mic, Layers } from 'lucide-react';

export default function OverviewTab({ recentActivity }) {

    const getIcon = (type) => {
        if (type === 'quiz') return <BookOpen className="w-5 h-5 text-blue-400" />;
        if (type === 'interview') return <Mic className="w-5 h-5 text-purple-400" />;
        return <Layers className="w-5 h-5 text-green-400" />;
    };

    const getLabel = (item) => {
        if (item.type === 'quiz') return `Scored ${item.score}%`;
        if (item.type === 'interview') return `Scored ${item.score}%`;
        return `${item.progress}% complete`;
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-400';
        if (score >= 60) return 'text-yellow-400';
        return 'text-red-400';
    };

    return (
        <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
                {recentActivity.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 bg-white/5 rounded-xl p-4 border border-white/10">
                        {/* Icon */}
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                            {getIcon(item.type)}
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <p className="font-semibold capitalize">
                                {item.type} — <span className="text-blue-400">{item.skill}</span>
                            </p>
                            <p className="text-xs text-gray-400">{item.date}</p>
                        </div>

                        {/* Score */}
                        <span className={`text-sm font-bold ${getScoreColor(item.score || item.progress)}`}>
                            {getLabel(item)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}