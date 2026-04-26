import { Routes, Route, Navigate } from 'react-router-dom';
import LenisScroll from "./components/lenis-scroll";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import HeroSection from "./sections/hero-section";
import FaqSection from "./sections/faq-section";
import TrustedCompanies from "./sections/trusted-companies";
import Features from "./sections/features";
import WorkflowSteps from "./sections/workflow-steps";
import Testimonials from "./sections/testimonials";
import PricingPlans from "./sections/pricing-plans";
import CallToAction from "./sections/call-to-action";
import GetStarted from "./sections/GetStarted";
import Interview from './sections/interview/index';
import InterviewSetup from './sections/interview/InterviewSetup';
import SignupPage from './sections/SignupPage';
import LoginPage from './sections/LoginPage';
import ForgotPasswordPage from './sections/ForgotPasswordPage';
import { useAuth } from './context/AuthContext';

/* Protected route — redirects to login if not logged in */
function ProtectedRoute({ children }) {
    const { isLoggedIn } = useAuth();
    return isLoggedIn() ? children : <Navigate to="/login" />;
}

export default function App() {
    return (
        <>
            <LenisScroll />
            <Navbar />
            <div className="fixed inset-0 overflow-hidden -z-20 pointer-events-none">
                <div className="absolute rounded-full top-80 left-2/5 -translate-x-1/2 size-130 bg-[#D10A8A] blur-[100px]" />
                <div className="absolute rounded-full top-80 right-0 -translate-x-1/2 size-130 bg-[#2E08CF] blur-[100px]" />
                <div className="absolute rounded-full top-0 left-1/2 -translate-x-1/2 size-130 bg-[#F26A06] blur-[100px]" />
            </div>
            <Routes>
                {/* Public routes */}
                <Route path="/" element={
                    <main className='px-4'>
                        <HeroSection />
                        <Features />
                        <WorkflowSteps />
                        <Testimonials />
                        <FaqSection />
                        <PricingPlans />
                        <CallToAction />
                    </main>
                } />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                {/* Protected routes */}
                <Route path="/get-started" element={
                    <ProtectedRoute>
                        <GetStarted />
                    </ProtectedRoute>
                } />
                <Route path="/interview" element={
                    <ProtectedRoute>
                        <InterviewSetup
                            onStart={(config) => {
                                sessionStorage.setItem('interviewConfig', JSON.stringify(config));
                                window.location.href = '/interview/start';
                            }}
                            onBack={() => window.location.href = '/get-started'}
                        />
                    </ProtectedRoute>
                } />
                <Route path="/interview/start" element={
                    <ProtectedRoute>
                        {(() => {
                            const config = JSON.parse(sessionStorage.getItem('interviewConfig') || '{}');
                            return <Interview
                                skill={config.skill}
                                difficulty={config.difficulty}
                                questionCount={config.questionCount}
                                roadmapProgress={80}
                                onBack={() => window.location.href = '/interview'}
                            />;
                        })()}
                    </ProtectedRoute>
                } />
            </Routes>
            <Footer />
        </>
    );
}