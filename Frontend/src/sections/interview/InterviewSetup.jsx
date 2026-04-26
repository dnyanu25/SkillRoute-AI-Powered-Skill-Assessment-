// src/sections/interview/InterviewSetup.jsx
import { useState } from 'react';
import { ArrowLeft, Award } from 'lucide-react';

export default function InterviewSetup({ onStart, onBack }) {
    const [skill, setSkill] = useState('');
    const [difficulty, setDifficulty] = useState(3);
    const [questionCount, setQuestionCount] = useState(5);

    const handleSubmit = () => {
        if (!skill.trim()) {
            alert('Please enter a skill');
            return;
        }
        onStart({ skill, difficulty, questionCount });
    };

    return (
        <div className="glass rounded-2xl p-8 max-w-2xl mx-auto mt-10">
            <div className="text-center space-y-2 mb-8">
                <div className="flex items-center justify-center">
                    <Award className="w-14 h-14 text-blue-400" />
                </div>
                <h2 className="text-3xl font-bold">Mock Interview</h2>
                <p className="text-gray-400 text-sm">Set up your interview session</p>
            </div>

            <div className="space-y-6">
                {/* Skill Input */}
                <div>
                    <label className="block text-sm font-semibold mb-2">Skill / Topic</label>
                    <input
                        type="text"
                        placeholder="e.g. React, Java, System Design..."
                        value={skill}
                        onChange={(e) => setSkill(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-blue-500 transition"
                    />
                </div>

                {/* Difficulty */}
                <div>
                    <label className="block text-sm font-semibold mb-3">
                        Difficulty — <span className="text-blue-400">{
                            difficulty === 1 ? 'Beginner' :
                                difficulty === 2 ? 'Easy' :
                                    difficulty === 3 ? 'Medium' :
                                        difficulty === 4 ? 'Hard' : 'Expert'
                        }</span>
                    </label>
                    <div className="flex gap-3">
                        {[1, 2, 3, 4, 5].map(level => (
                            <button
                                key={level}
                                onClick={() => setDifficulty(level)}
                                className={`flex-1 py-2 rounded-lg border text-sm font-bold transition ${difficulty === level
                                        ? 'bg-blue-600 border-blue-600 text-white'
                                        : 'bg-white/5 border-white/10 text-gray-400 hover:border-blue-500'
                                    }`}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Number of Questions */}
                <div>
                    <label className="block text-sm font-semibold mb-3">
                        Number of Questions — <span className="text-blue-400">{questionCount}</span>
                    </label>
                    <div className="flex gap-3">
                        {[3, 5, 7, 10].map(count => (
                            <button
                                key={count}
                                onClick={() => setQuestionCount(count)}
                                className={`flex-1 py-2 rounded-lg border text-sm font-bold transition ${questionCount === count
                                        ? 'bg-blue-600 border-blue-600 text-white'
                                        : 'bg-white/5 border-white/10 text-gray-400 hover:border-blue-500'
                                    }`}
                            >
                                {count}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                    <button onClick={onBack} className="btn glass px-6 py-3 flex items-center gap-2">
                        <ArrowLeft className="w-5 h-5" /> Back
                    </button>
                    <button onClick={handleSubmit} className="btn bg-blue-600 hover:bg-blue-700 flex-1 py-3 font-semibold">
                        Start Interview →
                    </button>
                </div>
            </div>
        </div>
    );
}