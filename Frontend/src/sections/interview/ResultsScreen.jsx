// src/sections/interview/ResultsScreen.jsx
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ResultsScreen({ results, onBack, onRetake }) {
    return (
        <div className="glass rounded-2xl p-8 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Interview Complete! 🎉</h2>
            <div className="space-y-6">

                <div className="bg-white/5 rounded-lg p-6 text-center border border-white/10">
                    <p className="text-sm text-gray-400 mb-2">Your Score</p>
                    <p className="text-5xl font-bold text-blue-400 mb-2">{results.score}%</p>
                    <p className="text-xl font-semibold text-green-500">{results.level}</p>
                </div>

                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <h3 className="text-lg font-semibold mb-3">Overall Feedback</h3>
                    <p className="text-gray-300">{results.feedback}</p>
                </div>

                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <h3 className="text-lg font-semibold mb-3 text-green-400">Strengths</h3>
                    <ul className="space-y-2">
                        {results.strengths.map((s, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-gray-300">
                                <CheckCircle2 className="w-5 h-5 text-green-500" /> {s}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <h3 className="text-lg font-semibold mb-3 text-yellow-400">Areas to Improve</h3>
                    <ul className="space-y-2 text-gray-300">
                        {results.improvements.map((imp, idx) => (
                            <li key={idx}>• {imp}</li>
                        ))}
                    </ul>
                </div>

                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <h3 className="text-lg font-semibold mb-4">Question Breakdown</h3>
                    <div className="space-y-4">
                        {results.answers.map((ans, idx) => (
                            <div key={idx} className="border border-white/10 rounded-lg p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="font-medium text-sm text-gray-300">Q{idx + 1}: {ans.question}</p>
                                    <span className={`text-sm font-bold px-2 py-1 rounded ${ans.score >= 7 ? 'bg-green-500/20 text-green-400' :
                                            ans.score >= 4 ? 'bg-yellow-500/20 text-yellow-400' :
                                                'bg-red-500/20 text-red-400'
                                        }`}>{ans.score}/10</span>
                                </div>
                                <p className="text-xs text-gray-400 mb-1"><span className="text-white">Your answer:</span> {ans.answer}</p>
                                <p className="text-xs text-blue-300"><span className="text-white">Feedback:</span> {ans.feedback}</p>
                                <p className="text-xs text-green-300 mt-1"><span className="text-white">Ideal:</span> {ans.idealAnswer}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex gap-3">
                    <button onClick={onBack} className="btn glass px-6 py-3 flex items-center gap-2">
                        <ArrowLeft className="w-5 h-5" /> Back to Roadmap
                    </button>
                    <button onClick={onRetake} className="btn bg-blue-600 hover:bg-blue-700 flex-1 py-3">
                        Retake Interview
                    </button>
                </div>

            </div>
        </div>
    );
}