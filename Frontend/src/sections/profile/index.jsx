import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import ProfileHeader from './ProfileHeader';
import StatsRow from './StatsRow';
import OverviewTab from './tabs/OverviewTab';
import QuizTab from './tabs/QuizTab';
import InterviewTab from './tabs/InterviewTab';
import RoadmapTab from './tabs/RoadmapTab';

import { fetchProfileData } from "./data/mockData";

const TABS = ['Overview', 'Quizzes', 'Interviews', 'Roadmaps'];

export default function ProfilePage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('Overview');
    const [loading, setLoading] = useState(true);

    const [stats, setStats] = useState({
        totalQuizzes: 0,
        avgQuizScore: 0,
        totalInterviews: 0,
        avgInterviewScore: 0,
        skillsLearning: 0
    });
    const [quizHistory, setQuizHistory] = useState([]);
    const [interviewHistory, setInterviewHistory] = useState([]);
    const [roadmaps, setRoadmaps] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);

    useEffect(() => {
        if (!user?.id) return;

        const loadProfile = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/profile/${user.id}`);
                const data = await res.json();

                // Safe fallback
                const quizzes = data?.quizzes || [];
                const interviews = data?.interviews || [];
                const roadmapsData = data?.roadmaps || [];

                setStats(data?.stats || {
                    totalQuizzes: 0,
                    avgQuizScore: 0,
                    totalInterviews: 0,
                    avgInterviewScore: 0,
                    skillsLearning: 0
                });

                setQuizHistory(quizzes);
                setInterviewHistory(interviews);
                setRoadmaps(roadmapsData);

                /* Safe recent activity */
                const quizActivity = quizzes.map(q => ({
                    id: `quiz-${q.id}`,
                    type: 'quiz',
                    skill: q.skill,
                    score: q.score,
                    date: q.date
                }));

                const interviewActivity = interviews.map(i => ({
                    id: `interview-${i.id}`,
                    type: 'interview',
                    skill: i.skill,
                    score: i.score,
                    date: i.date
                }));

                const roadmapActivity = roadmapsData.map(r => ({
                    id: `roadmap-${r.id}`,
                    type: 'roadmap',
                    skill: r.skill,
                    progress: r.completedTasks && r.totalTasks
                        ? Math.round((r.completedTasks / r.totalTasks) * 100)
                        : 0,
                    date: r.date
                }));

                const all = [...quizActivity, ...interviewActivity, ...roadmapActivity]
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .slice(0, 5);

                setRecentActivity(all);

            } catch (err) {
                console.error('Failed to load profile:', err);

                // fallback → no crash
                setStats({
                    totalQuizzes: 0,
                    avgQuizScore: 0,
                    totalInterviews: 0,
                    avgInterviewScore: 0,
                    skillsLearning: 0
                });
                setQuizHistory([]);
                setInterviewHistory([]);
                setRoadmaps([]);
                setRecentActivity([]);

            } finally {
                setLoading(false);
            }
        };

        loadProfile();

    }, [user]);

    const profileUser = {
        name: user?.name || 'User',
        email: user?.email || '',
        createdAt: user?.createdAt || new Date().toISOString()
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-400">Loading your profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen px-4 py-8">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <ProfileHeader user={profileUser} />

                {/* Stats */}
                <StatsRow stats={stats} />

                {/* Tabs */}
                <div className="flex gap-2 mb-6 glass rounded-xl p-1">
                    {TABS.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${activeTab === tab
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'Overview' && (
                    <OverviewTab recentActivity={recentActivity} />
                )}
                {activeTab === 'Quizzes' && (
                    <QuizTab quizHistory={quizHistory} />
                )}
                {activeTab === 'Interviews' && (
                    <InterviewTab interviewHistory={interviewHistory} />
                )}
                {activeTab === 'Roadmaps' && (
                    <RoadmapTab roadmaps={roadmaps} />
                )}

            </div>
        </div>
    );
}