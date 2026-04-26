import { User, Mail, Calendar } from 'lucide-react';

export default function ProfileHeader({ user }) {
    const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long', year: 'numeric'
    });

    return (
        <div className="glass rounded-2xl p-8 mb-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">

                {/* Avatar */}
                <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-4xl font-bold flex-shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl font-bold mb-1">{user.name}</h1>

                    <div className="flex flex-col md:flex-row gap-3 mt-3 text-sm text-gray-400 items-center md:items-start">
                        <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Member since {memberSince}</span>
                        </div>
                    </div>
                </div>

                {/* Edit Button */}
                <button className="btn glass px-5 py-2 text-sm flex items-center gap-2">
                    <User className="w-4 h-4" /> Edit Profile
                </button>

            </div>
        </div>
    );
}