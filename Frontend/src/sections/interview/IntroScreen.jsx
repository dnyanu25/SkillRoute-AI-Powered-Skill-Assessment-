// src/sections/interview/IntroScreen.jsx
import { Volume2, VolumeX, ArrowLeft, CheckCircle2, Award } from 'lucide-react';

export default function IntroScreen({ skill, roadmapProgress, totalQuestions, voiceEnabled, toggleVoice, onBack, onStart }) {
    return (
        <div className="glass rounded-2xl p-8 max-w-2xl mx-auto">
            <div className="text-center space-y-6">
                <div className="flex items-center justify-center">
                    <Award className="w-16 h-16 text-blue-400" />
                </div>
                <h2 className="text-3xl font-bold">Ready for Your Interview? 🎯</h2>
                <div className="bg-white/5 rounded-lg p-6 text-left space-y-4">
                    <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <div>
                            <p className="font-semibold">Skill: {skill}</p>
                            <p className="text-sm text-gray-400">Roadmap Progress: {roadmapProgress}%</p>
                        </div>
                    </div>
                    <div className="border-t border-white/10 pt-4">
                        <p className="text-sm font-semibold mb-2">Interview Format:</p>
                        <ul className="text-sm text-gray-300 space-y-1">
                            <li>• {totalQuestions} technical questions</li>
                            <li>• Answer using voice or text</li>
                            <li>• AI evaluates your responses</li>
                            <li>• Get instant feedback and score</li>
                        </ul>
                    </div>
                </div>
                <div className="flex items-center justify-center gap-4">
                    <button onClick={toggleVoice} className="btn glass px-4 py-2 flex items-center gap-2">
                        {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                        {voiceEnabled ? 'Voice On' : 'Voice Off'}
                    </button>
                </div>
                <div className="flex gap-3">
                    <button onClick={onBack} className="btn glass px-6 py-3 flex items-center gap-2">
                        <ArrowLeft className="w-5 h-5" /> Back
                    </button>
                    <button onClick={onStart} className="btn bg-blue-600 hover:bg-blue-700 flex-1 py-3">
                        Start Interview
                    </button>
                </div>
            </div>
        </div>
    );
}