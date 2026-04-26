import { Layers } from 'lucide-react';

export default function RoadmapTab({ roadmaps }) {

    const getProgressColor = (percent) => {
        if (percent >= 80) return 'bg-green-500';
        if (percent >= 40) return 'bg-blue-500';
        return 'bg-yellow-500';
    };

    const getProgressLabel = (percent) => {
        if (percent === 100) return 'Completed 🎉';
        if (percent >= 80) return 'Almost Done!';
        if (percent >= 40) return 'In Progress';
        if (percent > 0) return 'Just Started';
        return 'Not Started';
    };

    return (
        <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Roadmap History</h3>

            {roadmaps.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                    <Layers className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No roadmaps created yet.</p>
                    <p className="text-sm mt-1">Generate a roadmap to track your progress!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {roadmaps.map((roadmap) => {
                        const percent = Math.round((roadmap.completedTasks / roadmap.totalTasks) * 100);
                        return (
                            <div key={roadmap.id} className="bg-white/5 rounded-xl p-5 border border-white/10">

                                {/* Top Row */}
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                            <Layers className="w-5 h-5 text-green-400" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">{roadmap.skill}</p>
                                            <div className="flex gap-3 mt-1">
                                                <span className="text-xs text-gray-400">{roadmap.level}</span>
                                                <span className="text-xs text-gray-400">{roadmap.duration}</span>
                                                <span className="text-xs text-gray-400">{roadmap.date}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Percent */}
                                    <span className="text-2xl font-bold text-blue-400">
                                        {percent}%
                                    </span>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                                    <div
                                        className={`h-2 rounded-full transition-all ${getProgressColor(percent)}`}
                                        style={{ width: `${percent}%` }}
                                    />
                                </div>

                                {/* Bottom Row */}
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-xs text-gray-400">
                                        {roadmap.completedTasks} / {roadmap.totalTasks} tasks completed
                                    </span>
                                    <span className="text-xs font-semibold text-blue-300">
                                        {getProgressLabel(percent)}
                                    </span>
                                </div>

                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}