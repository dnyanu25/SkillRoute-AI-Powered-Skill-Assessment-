import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import ProfileHeader from './ProfileHeader';
import StatsRow from './StatsRow';
import OverviewTab from './tabs/OverviewTab';
import QuizTab from './tabs/QuizTab';
import InterviewTab from './tabs/InterviewTab';
import RoadmapTab from './tabs/RoadmapTab';
import {
    mockStats,
    mockQuizHistory,
    mockInterviewHistory,
    mockRoadmaps,
    mockRecentActivity
} from './data/mockData';

const TABS = ['Overview', 'Quizzes', 'Interviews', 'Roadmaps'];

export default function ProfilePage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('Overview');

    // Use real user from auth, mock data for history
    // Later: replace mock data with API calls
    const profileUser = {
        name: user?.name || 'User',
        email: user?.email || '',
        createdAt: user?.createdAt || new Date().toISOString()
    };

    return (
        <div className="min-h-screen px-4 py-8">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <ProfileHeader user={profileUser} />

                {/* Stats */}
                <StatsRow stats={mockStats} />

                {/* Tabs */}
                <div className="flex gap-2 mb-6 glass rounded-xl p-1">
                    {TABS.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                                activeTab === tab
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
                    <OverviewTab recentActivity={mockRecentActivity} />
                )}
                {activeTab === 'Quizzes' && (
                    <QuizTab quizHistory={mockQuizHistory} />
                )}
                {activeTab === 'Interviews' && (
                    <InterviewTab interviewHistory={mockInterviewHistory} />
                )}
                {activeTab === 'Roadmaps' && (
                    <RoadmapTab roadmaps={mockRoadmaps} />
                )}

            </div>
        </div>
    );
}