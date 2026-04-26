// src/sections/interview/QuestionScreen.jsx
import { Mic, MicOff, Volume2, VolumeX, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function QuestionScreen({
    currentQuestion, currentQuestionIndex, totalQuestions,
    interviewState, isSpeaking, isListening, transcript,
    voiceEnabled, toggleVoice, setTranscript,
    onStartRecording, onStopRecording, onSubmit
}) {
    return (
        <div className="glass rounded-2xl p-8 max-w-3xl mx-auto">
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">
                        Question {currentQuestionIndex + 1} of {totalQuestions}
                    </span>
                    <button onClick={toggleVoice} className="btn glass px-3 py-1 text-sm flex items-center gap-2">
                        {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    </button>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }} />
                </div>
            </div>

            <div className="mb-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/20 mb-4">
                    {isSpeaking ? (
                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                            <Volume2 className="w-8 h-8 text-blue-400" />
                        </motion.div>
                    ) : (
                        <Award className="w-8 h-8 text-blue-400" />
                    )}
                </div>
                <h3 className="text-2xl font-semibold mb-2">{currentQuestion.question}</h3>
                {isSpeaking && <p className="text-sm text-gray-400">AI is speaking...</p>}
            </div>

            <div className="space-y-4">
                {interviewState === 'listening' && (
                    <div className="bg-red-500/20 border-2 border-red-500 rounded-lg p-6 text-center">
                        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="inline-block">
                            <Mic className="w-12 h-12 text-red-500 mx-auto mb-3" />
                        </motion.div>
                        <p className="font-semibold mb-2">Listening...</p>
                        <p className="text-sm text-gray-300">Speak your answer now</p>
                        {transcript && (
                            <div className="mt-4 p-3 bg-white/5 rounded-lg">
                                <p className="text-sm">{transcript}</p>
                            </div>
                        )}
                    </div>
                )}
                <div className="bg-white/5 rounded-lg p-4">
                    <textarea
                        placeholder="Or type your answer here..."
                        value={transcript}
                        onChange={(e) => setTranscript(e.target.value)}
                        disabled={isListening}
                        className="w-full bg-transparent border-none outline-none resize-none h-32 text-white placeholder-gray-400"
                    />
                </div>
                <div className="flex gap-3">
                    {isListening ? (
                        <button onClick={onStopRecording} className="btn bg-red-600 hover:bg-red-700 flex-1 py-3 flex items-center justify-center gap-2">
                            <MicOff className="w-5 h-5" /> Stop Recording
                        </button>
                    ) : (
                        <>
                            <button onClick={onStartRecording} disabled={isSpeaking}
                                className="btn bg-blue-600 hover:bg-blue-700 flex-1 py-3 flex items-center justify-center gap-2 disabled:opacity-50">
                                <Mic className="w-5 h-5" /> Answer with Voice
                            </button>
                            <button onClick={() => onSubmit(transcript)} disabled={!transcript.trim() || isSpeaking}
                                className="btn bg-green-600 hover:bg-green-700 flex-1 py-3 disabled:opacity-50">
                                Submit Answer
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}