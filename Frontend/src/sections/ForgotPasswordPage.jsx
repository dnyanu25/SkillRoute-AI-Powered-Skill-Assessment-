import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ForgotPasswordPage() {
    const navigate = useNavigate();

    const [step, setStep] = useState('email'); // 'email' or 'reset'
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleForgot = async () => {
        if (!email) { setError('Please enter your email.'); return; }
        setLoading(true);
        try {
            const res = await fetch('http://localhost:8080/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (data.success) {
                setMessage(data.message); // shows token for now
                setStep('reset');
                setError('');
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async () => {
        if (!token || !newPassword || !confirmPassword) {
            setError('Please fill in all fields.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('http://localhost:8080/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword })
            });
            const data = await res.json();
            if (data.success) {
                setMessage(data.message);
                setError('');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="glass rounded-2xl p-8 w-full max-w-md">

                {/* Step 1 - Enter Email */}
                {step === 'email' && (
                    <>
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold mb-2">Forgot Password</h2>
                            <p className="text-gray-400 text-sm">Enter your email to get a reset token</p>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold mb-2">Email</label>
                                <input
                                    type="email"
                                    placeholder="john@example.com"
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-blue-500 transition"
                                />
                            </div>
                            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                            <button
                                onClick={handleForgot}
                                disabled={loading}
                                className="w-full btn bg-blue-600 hover:bg-blue-700 py-3 font-semibold disabled:opacity-50"
                            >
                                {loading ? 'Sending...' : 'Get Reset Token'}
                            </button>
                            <p className="text-center text-sm text-gray-400">
                                Remember your password?{' '}
                                <span onClick={() => navigate('/login')} className="text-blue-400 cursor-pointer hover:underline">
                                    Login
                                </span>
                            </p>
                        </div>
                    </>
                )}

                {/* Step 2 - Enter Token + New Password */}
                {step === 'reset' && (
                    <>
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold mb-2">Reset Password</h2>
                            <p className="text-gray-400 text-sm">Use the token below to reset your password</p>
                        </div>

                        {message && (
                            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-4">
                                <p className="text-blue-300 text-xs break-all">{message}</p>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold mb-2">Reset Token</label>
                                <input
                                    type="text"
                                    placeholder="Paste your token here"
                                    value={token}
                                    onChange={(e) => { setToken(e.target.value); setError(''); }}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-blue-500 transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2">New Password</label>
                                <input
                                    type="password"
                                    placeholder="Min 6 characters"
                                    value={newPassword}
                                    onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-blue-500 transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2">Confirm Password</label>
                                <input
                                    type="password"
                                    placeholder="Re-enter new password"
                                    value={confirmPassword}
                                    onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-blue-500 transition"
                                />
                            </div>
                            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                            {message && step === 'reset' && newPassword && (
                                <p className="text-green-400 text-sm text-center">{message}</p>
                            )}
                            <button
                                onClick={handleReset}
                                disabled={loading}
                                className="w-full btn bg-blue-600 hover:bg-blue-700 py-3 font-semibold disabled:opacity-50"
                            >
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
}