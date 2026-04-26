export const mockUser = {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    createdAt: "2024-01-15"
};

export const mockStats = {
    totalQuizzes: 8,
    avgQuizScore: 72,
    totalInterviews: 4,
    avgInterviewScore: 68,
    skillsLearning: 3
};

export const mockQuizHistory = [
    { id: 1, skill: "React", score: 85, totalQuestions: 10, difficulty: 3, date: "2024-04-20" },
    { id: 2, skill: "JavaScript", score: 70, totalQuestions: 15, difficulty: 4, date: "2024-04-18" },
    { id: 3, skill: "Node.js", score: 60, totalQuestions: 10, difficulty: 3, date: "2024-04-15" },
    { id: 4, skill: "Java", score: 75, totalQuestions: 20, difficulty: 2, date: "2024-04-10" },
];

export const mockInterviewHistory = [
    { id: 1, skill: "React", score: 78, totalQuestions: 5, difficulty: 3, date: "2024-04-21" },
    { id: 2, skill: "System Design", score: 65, totalQuestions: 5, difficulty: 4, date: "2024-04-17" },
    { id: 3, skill: "JavaScript", score: 80, totalQuestions: 7, difficulty: 3, date: "2024-04-12" },
];

export const mockRoadmaps = [
    { id: 1, skill: "React", level: "Beginner", duration: "8 weeks", completedTasks: 18, totalTasks: 24, date: "2024-04-01" },
    { id: 2, skill: "Node.js", level: "Intermediate", duration: "6 weeks", completedTasks: 5, totalTasks: 20, date: "2024-04-10" },
    { id: 3, skill: "System Design", level: "Advanced", duration: "4 weeks", completedTasks: 0, totalTasks: 16, date: "2024-04-20" },
];

export const mockRecentActivity = [
    { id: 1, type: "quiz", skill: "React", score: 85, date: "2024-04-20" },
    { id: 2, type: "interview", skill: "React", score: 78, date: "2024-04-21" },
    { id: 3, type: "roadmap", skill: "Node.js", progress: 25, date: "2024-04-19" },
    { id: 4, type: "quiz", skill: "JavaScript", score: 70, date: "2024-04-18" },
];