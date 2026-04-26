  import axios from 'axios';

/* Base URL of your Spring Boot backend */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

/* Create axios instance with default config */
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, /* 30 seconds — AI calls can take time */
});

/* =============================================
   generateRoadmap()
   Mirrors: old generateRoadmap(userInfo)
   Now calls: POST /api/roadmap/generate
   ============================================= */
export const generateRoadmap = async (userInfo) => {
    try {
        const response = await apiClient.post('/api/roadmap/generate', {
            skill: userInfo.skill,
            level: userInfo.level,
            duration: userInfo.duration,
            durationType: userInfo.durationType,
            includePractice: userInfo.includePractice,
            includeProjects: userInfo.includeProjects,
            includeRevision: userInfo.includeRevision,
            goals: userInfo.goals,
        });

        const roadmapData = response.data;

        /* Keep the same days/date logic from original React code
         * since it is UI specific and not AI logic */
        const days = [];
        let dayCounter = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        roadmapData.weeks.forEach((week, weekIdx) => {
            week.tasks.forEach(() => {
                const taskDate = new Date(today);
                taskDate.setDate(today.getDate() + dayCounter);

                days.push({
                    day: dayCounter + 1,
                    date: taskDate,
                    completed: false,
                    weekIndex: weekIdx,
                });
                dayCounter++;
            });
        });

        roadmapData.days = days;
        roadmapData.planDuration = days.length;
        roadmapData.startDate = today;

        return roadmapData;

    } catch (error) {
        /* Extract clean message from Spring Boot error response */
        const message = error.response?.data?.message
            || 'Failed to generate roadmap. Please try again.';
        throw new Error(message);
    }
};

/* =============================================
   generateQuiz()
   Mirrors: old generateQuiz(skill, difficulty, questionCount)
   Now calls: POST /api/quiz/generate
   ============================================= */
export const generateQuiz = async (skill, difficulty, questionCount) => {
    try {
        const response = await apiClient.post('/api/quiz/generate', {
            skill,
            difficulty,
            questionCount,
        });

        return response.data;

    } catch (error) {
        const message = error.response?.data?.message
            || 'Failed to generate quiz. Please try again.';
        throw new Error(message);
    }
};
/* =============================================
   evaluateQuiz()
   Mirrors: old evaluateQuiz(quizData, userAnswers)
   Now calls: POST /api/quiz/evaluate
   ============================================= */
export const evaluateQuiz = async (quizData, userAnswers) => {
    try {
        /* Build questions list with just id and correctAnswer
         * matching EvaluateRequestDTO.QuestionAnswerDTO */
        const questions = quizData.questions.map((q) => ({
            id: q.id,
            correctAnswer: q.correctAnswer,
        }));

        /* Convert userAnswers array to map
         * matching Map<Integer, Integer> in Java */
        const userAnswersMap = {};
        quizData.questions.forEach((question, index) => {
    userAnswersMap[question.id] = userAnswers[index];
});

        const response = await apiClient.post('/api/quiz/evaluate', {
            totalQuestions: quizData.questions.length,
            questions,
            userAnswers: userAnswersMap, 
        });

        return response.data;

    } catch (error) {
        const message = error.response?.data?.message
            || 'Failed to evaluate quiz. Please try again.';
        throw new Error(message);
    }
};