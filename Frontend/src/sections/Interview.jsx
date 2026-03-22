import { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, ArrowLeft, CheckCircle2, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import voiceService from '../services/voiceService';

export default function Interview({ 
    skill = "React",  // Default skill if none provided
    roadmapProgress = 80,  // Default progress
    onBack = () => window.location.href = '/'  // Default back action
}) {    const [interviewState, setInterviewState] = useState('intro'); // 'intro', 'question', 'listening', 'processing', 'complete'
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [voiceEnabled, setVoiceEnabled] = useState(true);
    
    // Mock interview data (will come from backend later)
    const [interview, setInterview] = useState({
        questions: [
            { id: 1, question: "Can you explain what React hooks are and why they're useful?" },
            { id: 2, question: "Tell me about the difference between props and state." },
            { id: 3, question: "How does the virtual DOM work in React?" },
        ],
        answers: []
    });

    const [results, setResults] = useState(null);

    const currentQuestion = interview.questions[currentQuestionIndex];
    const totalQuestions = interview.questions.length;

    // Speak question when it changes
    useEffect(() => {
        if (interviewState === 'question' && voiceEnabled && currentQuestion) {
            setIsSpeaking(true);
            voiceService.speak(currentQuestion.question, () => {
                setIsSpeaking(false);
            });
        }
    }, [currentQuestionIndex, interviewState, voiceEnabled]);

    const handleStartInterview = () => {
        setInterviewState('question');
        if (voiceEnabled) {
            voiceService.speak("Let's begin your interview. I'll ask you a few questions about " + skill, () => {
                setIsSpeaking(false);
            });
        }
    };

    const handleStartRecording = () => {
        if (!voiceService.isSupported()) {
            alert('Voice recognition is not supported in your browser. Please use Chrome or Edge.');
            return;
        }

        setIsListening(true);
        setInterviewState('listening');
        setTranscript('');

        voiceService.startListening(
            (text) => {
                // Voice recognized successfully
                setTranscript(text);
                setIsListening(false);
                handleAnswerSubmit(text);
            },
            (error) => {
                // Error occurred
                console.error('Voice error:', error);
                setIsListening(false);
                setInterviewState('question');
                alert('Could not understand. Please try again or type your answer.');
            }
        );
    };

    const handleStopRecording = () => {
        voiceService.stopListening();
        setIsListening(false);
        setInterviewState('question');
    };

    const handleAnswerSubmit = (answer) => {
        // Save answer
        const updatedAnswers = [...interview.answers];
        updatedAnswers[currentQuestionIndex] = {
            questionId: currentQuestion.id,
            answer: answer,
            timestamp: new Date()
        };
        setInterview({ ...interview, answers: updatedAnswers });

        // Move to next question or finish
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setInterviewState('question');
            setTranscript('');
        } else {
            // Interview complete
            handleInterviewComplete(updatedAnswers);
        }
    };

    const handleInterviewComplete = (answers) => {
        setInterviewState('processing');
        
        // TODO: Send to backend for evaluation
        // For now, mock results
        setTimeout(() => {
            setResults({
                score: 85,
                level: 'Interview Ready',
                feedback: 'Great job! Your answers showed solid understanding of React concepts. You demonstrated clear communication and technical knowledge.',
                strengths: ['Clear explanations', 'Good examples', 'Confident delivery'],
                improvements: ['Go deeper into performance optimization', 'Discuss more real-world scenarios']
            });
            setInterviewState('complete');
        }, 2000);
    };

    const toggleVoice = () => {
        setVoiceEnabled(!voiceEnabled);
        if (voiceEnabled) {
            voiceService.stopSpeaking();
        }
    };

    // Intro Screen
    if (interviewState === 'intro') {
        return (
            <div className="glass rounded-2xl p-8 max-w-2xl mx-auto">
                <div className="text-center space-y-6">
                    <div className="flex items-center justify-center">
                        <Award className="w-16 h-16 text-blue-400" />
                    </div>
                    
                    <h2 className="text-3xl font-bold">
                        Ready for Your Interview? 🎯
                    </h2>
                    
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
                        <button
                            onClick={toggleVoice}
                            className="btn glass px-4 py-2 flex items-center gap-2"
                        >
                            {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                            {voiceEnabled ? 'Voice On' : 'Voice Off'}
                        </button>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onBack}
                            className="btn glass px-6 py-3 flex items-center gap-2"
                        >
                            <ArrowLeft className="w-5 h-5" /> Back
                        </button>
                        <button
                            onClick={handleStartInterview}
                            className="btn bg-blue-600 hover:bg-blue-700 flex-1 py-3"
                        >
                            Start Interview
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Question Screen
    if (interviewState === 'question' || interviewState === 'listening') {
        return (
            <div className="glass rounded-2xl p-8 max-w-3xl mx-auto">
                {/* Progress */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">
                            Question {currentQuestionIndex + 1} of {totalQuestions}
                        </span>
                        <button
                            onClick={toggleVoice}
                            className="btn glass px-3 py-1 text-sm flex items-center gap-2"
                        >
                            {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                        </button>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                            className="bg-blue-500 h-2 rounded-full transition-all" 
                            style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }} 
                        />
                    </div>
                </div>

                {/* Question */}
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/20 mb-4">
                        {isSpeaking ? (
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                            >
                                <Volume2 className="w-8 h-8 text-blue-400" />
                            </motion.div>
                        ) : (
                            <Award className="w-8 h-8 text-blue-400" />
                        )}
                    </div>
                    <h3 className="text-2xl font-semibold mb-2">
                        {currentQuestion.question}
                    </h3>
                    {isSpeaking && (
                        <p className="text-sm text-gray-400">AI is speaking...</p>
                    )}
                </div>

                {/* Voice Input */}
                <div className="space-y-4">
                    {interviewState === 'listening' && (
                        <div className="bg-red-500/20 border-2 border-red-500 rounded-lg p-6 text-center">
                            <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ repeat: Infinity, duration: 1 }}
                                className="inline-block"
                            >
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

                    {/* Answer Input */}
                    <div className="bg-white/5 rounded-lg p-4">
                        <textarea
                            placeholder="Or type your answer here..."
                            value={transcript}
                            onChange={(e) => setTranscript(e.target.value)}
                            disabled={isListening}
                            className="w-full bg-transparent border-none outline-none resize-none h-32 text-white placeholder-gray-400"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        {isListening ? (
                            <button
                                onClick={handleStopRecording}
                                className="btn bg-red-600 hover:bg-red-700 flex-1 py-3 flex items-center justify-center gap-2"
                            >
                                <MicOff className="w-5 h-5" /> Stop Recording
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={handleStartRecording}
                                    disabled={isSpeaking}
                                    className="btn bg-blue-600 hover:bg-blue-700 flex-1 py-3 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    <Mic className="w-5 h-5" /> Answer with Voice
                                </button>
                                <button
                                    onClick={() => handleAnswerSubmit(transcript)}
                                    disabled={!transcript.trim() || isSpeaking}
                                    className="btn bg-green-600 hover:bg-green-700 flex-1 py-3 disabled:opacity-50"
                                >
                                    Submit Answer
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Processing Screen
    if (interviewState === 'processing') {
        return (
            <div className="glass rounded-2xl p-8 max-w-2xl mx-auto">
                <div className="flex flex-col items-center justify-center space-y-4 py-12">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-lg font-medium">Evaluating your interview...</p>
                    <p className="text-sm text-gray-400">Our AI is analyzing your responses</p>
                </div>
            </div>
        );
    }

    // Results Screen
    if (interviewState === 'complete' && results) {
        return (
            <div className="glass rounded-2xl p-8 max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold mb-6 text-center">
                    Interview Complete! 🎉
                </h2>
                
                <div className="space-y-6">
                    {/* Score */}
                    <div className="bg-white/5 rounded-lg p-6 text-center border border-white/10">
                        <p className="text-sm text-gray-400 mb-2">Your Score</p>
                        <p className="text-5xl font-bold text-blue-400 mb-2">
                            {results.score}%
                        </p>
                        <p className="text-xl font-semibold text-green-500">
                            {results.level}
                        </p>
                    </div>

                    {/* Feedback */}
                    <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                        <h3 className="text-lg font-semibold mb-3">Overall Feedback</h3>
                        <p className="text-gray-300">{results.feedback}</p>
                    </div>

                    {/* Strengths */}
                    <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                        <h3 className="text-lg font-semibold mb-3 text-green-400">Strengths</h3>
                        <ul className="space-y-2">
                            {results.strengths.map((strength, idx) => (
                                <li key={idx} className="flex items-center gap-2 text-gray-300">
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                    {strength}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Areas to Improve */}
                    <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                        <h3 className="text-lg font-semibold mb-3 text-yellow-400">Areas to Improve</h3>
                        <ul className="space-y-2 text-gray-300">
                            {results.improvements.map((improvement, idx) => (
                                <li key={idx}>• {improvement}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onBack}
                            className="btn glass px-6 py-3 flex items-center gap-2"
                        >
                            <ArrowLeft className="w-5 h-5" /> Back to Roadmap
                        </button>
                        <button
                            onClick={() => {
                                setInterviewState('intro');
                                setCurrentQuestionIndex(0);
                                setInterview({ ...interview, answers: [] });
                                setResults(null);
                            }}
                            className="btn bg-blue-600 hover:bg-blue-700 flex-1 py-3"
                        >
                            Retake Interview
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}