import { useState, useEffect } from 'react';
import voiceService from '../../services/voiceService';
import LoadingScreen from './LoadingScreen';
import ProcessingScreen from './ProcessingScreen';
import IntroScreen from './IntroScreen';
import QuestionScreen from './QuestionScreen';
import ResultsScreen from './ResultsScreen';

export default function Interview({
    skill,
    difficulty,
    questionCount,
    roadmapProgress = 80,
    onBack = () => window.location.href = '/'
}) {
    const [interviewState, setInterviewState] = useState('intro');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [voiceEnabled, setVoiceEnabled] = useState(true);
    const [interview, setInterview] = useState({ questions: [], answers: [] });
    const [results, setResults] = useState(null);

    useEffect(() => {
        if (!skill || !difficulty || !questionCount) return;

        fetch("http://localhost:8080/api/interviews/start", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ skill, difficulty, questionCount })
        })
            .then(res => res.json())
            .then(data => setInterview({
                interviewId: data.interviewId,
                questions: data.questions,
                answers: []
            }))
            .catch(err => console.error('Failed to load interview:', err));
    }, [skill, difficulty, questionCount]);

    const currentQuestion = interview.questions[currentQuestionIndex];
    const totalQuestions = interview.questions.length;

    useEffect(() => {
        if (interviewState === 'question' && voiceEnabled && currentQuestion) {
            setIsSpeaking(true);
            voiceService.speak(currentQuestion.question, () => setIsSpeaking(false));
        }
    }, [currentQuestionIndex, interviewState, voiceEnabled]);

    const toggleVoice = () => {
        setVoiceEnabled(!voiceEnabled);
        if (voiceEnabled) voiceService.stopSpeaking();
    };

    const handleStartInterview = () => {
        setInterviewState('question');
        if (voiceEnabled) {
            voiceService.speak(
                "Let's begin your interview. I'll ask you a few questions about " + skill,
                () => setIsSpeaking(false)
            );
        }
    };

    const handleStartRecording = () => {
        if (!voiceService.isSupported()) {
            alert('Voice recognition is not supported. Please use Chrome or Edge.');
            return;
        }
        setIsListening(true);
        setInterviewState('listening');
        setTranscript('');
        voiceService.startListening(
            (text) => {
                setTranscript(text);
                setIsListening(false);
                handleAnswerSubmit(text);
            },
            (error) => {
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

    const handleAnswerSubmit = async (answer) => {
        if (!answer.trim()) return;
        setInterviewState('processing');
        try {
            const res = await fetch("http://localhost:8080/api/interviews/answer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    interviewId: interview.interviewId,
                    questionNumber: currentQuestion.questionNumber,
                    question: currentQuestion.question,
                    userAnswer: answer,
                    skill: skill
                })
            });
            const evalData = await res.json();
            const updatedAnswers = [...interview.answers];
            updatedAnswers[currentQuestionIndex] = {
                question: currentQuestion.question,
                answer: answer,
                score: evalData.score,
                feedback: evalData.feedback,
                idealAnswer: evalData.idealAnswer
            };
            setInterview({ ...interview, answers: updatedAnswers });
            setTranscript('');
            if (evalData.last) {
                handleInterviewComplete(updatedAnswers);
            } else {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setInterviewState('question');
            }
        } catch (err) {
            console.error(err);
            setInterviewState('question');
            alert('Error evaluating answer. Please try again.');
        }
    };

    const handleInterviewComplete = (answers) => {
        const totalScore = Math.round(
            answers.reduce((sum, a) => sum + (a.score || 0), 0) / answers.length * 10
        );
        setResults({
            score: totalScore,
            level: totalScore >= 80 ? 'Interview Ready 🚀' : totalScore >= 60 ? 'Almost There 💪' : 'Keep Practicing 📚',
            feedback: 'Interview complete! Review your answers below.',
            answers: answers,
            strengths: answers.filter(a => a.score >= 7).map(a => `Q${answers.indexOf(a) + 1}: Strong answer`),
            improvements: answers.filter(a => a.score < 7).map(a => `Q${answers.indexOf(a) + 1}: Needs improvement`)
        });
        setInterviewState('complete');
    };

    const handleRetake = () => {
        setInterviewState('intro');
        setCurrentQuestionIndex(0);
        setInterview({ ...interview, answers: [] });
        setResults(null);
    };

    if (interview.questions.length === 0) return <LoadingScreen />;

    if (interviewState === 'intro') return (
        <IntroScreen
            skill={skill}
            difficulty={difficulty}
            roadmapProgress={roadmapProgress}
            totalQuestions={totalQuestions}
            voiceEnabled={voiceEnabled}
            toggleVoice={toggleVoice}
            onBack={onBack}
            onStart={handleStartInterview}
        />
    );

    if (interviewState === 'question' || interviewState === 'listening') return (
        <QuestionScreen
            currentQuestion={currentQuestion}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={totalQuestions}
            interviewState={interviewState}
            isSpeaking={isSpeaking}
            isListening={isListening}
            transcript={transcript}
            voiceEnabled={voiceEnabled}
            toggleVoice={toggleVoice}
            setTranscript={setTranscript}
            onStartRecording={handleStartRecording}
            onStopRecording={handleStopRecording}
            onSubmit={handleAnswerSubmit}
        />
    );

    if (interviewState === 'processing') return <ProcessingScreen />;

    if (interviewState === 'complete' && results) return (
        <ResultsScreen
            results={results}
            onBack={onBack}
            onRetake={handleRetake}
        />
    );

    return null;
}