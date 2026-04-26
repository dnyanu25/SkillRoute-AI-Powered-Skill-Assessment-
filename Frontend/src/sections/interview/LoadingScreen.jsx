export default function LoadingScreen() {
    return (
        <div className="glass rounded-2xl p-8 max-w-2xl mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 py-12">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-lg font-medium">Loading your interview...</p>
                <p className="text-sm text-gray-400">Generating questions with AI</p>
            </div>
        </div>
    );
}