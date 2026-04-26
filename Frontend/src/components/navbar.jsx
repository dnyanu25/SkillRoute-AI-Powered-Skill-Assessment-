import { MenuIcon, XIcon, LogOut, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { user, logout, isLoggedIn } = useAuth();
    const navigate = useNavigate();

    const links = [
        { name: 'Home', href: '/' },
        { name: 'Use Cases', href: '#use-cases' },
        { name: 'Pricing', href: '#pricing' },
        { name: 'Docs', href: '#docs' }
    ];

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsOpen(false);
    };

    return (
        <>
            <motion.nav className={`sticky top-0 z-50 flex w-full items-center justify-between px-4 py-3.5 md:px-16 lg:px-24 transition-colors ${isScrolled ? 'bg-white/15 backdrop-blur-lg' : ''}`}
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
            >
                {/* Logo */}
                <div className='flex items-center gap-3'>
                    <a href='/'>
                        <img src='/assets/slogo.png' alt='logo' className='h-8.5 w-auto' width={205} height={58} />
                    </a>
                    <p className='text-2xl font-bold text-white-500 tracking-wide'>SkillRoute</p>
                </div>

                {/* Desktop Links */}
                <div className='hidden items-center space-x-10 md:flex'>
                    {links.map((link) => (
                        <a key={link.name} href={link.href} className='transition hover:text-gray-300'>
                            {link.name}
                        </a>
                    ))}

                    {isLoggedIn() ? (
                        /* Logged in — show name + logout */
                        <div className='flex items-center gap-4'>
                            <div className='flex items-center gap-2 text-sm text-gray-300'>
                                <User className='w-4 h-4' />
                                <span>{user.name}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className='btn glass flex items-center gap-2'
                            >
                                <LogOut className='w-4 h-4' />
                                Logout
                            </button>
                        </div>
                    ) : (
                        /* Logged out — show login + signup */
                        <div className='flex items-center gap-3'>
                            <a href='/login' className='transition hover:text-gray-300 text-sm'>
                                Login
                            </a>
                            <a href='/signup' className='btn glass'>
                                Sign Up
                            </a>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button onClick={() => setIsOpen(true)} className='transition active:scale-90 md:hidden'>
                    <MenuIcon className='size-6.5' />
                </button>
            </motion.nav>

            {/* Mobile Menu */}
            <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-black/20 text-lg font-medium backdrop-blur-2xl transition duration-300 md:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {links.map((link) => (
                    <a key={link.name} href={link.href} onClick={() => setIsOpen(false)}>
                        {link.name}
                    </a>
                ))}

                {isLoggedIn() ? (
                    <>
                        <div className='flex items-center gap-2 text-sm text-gray-300'>
                            <User className='w-4 h-4' />
                            <span>{user.name}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className='btn glass flex items-center gap-2'
                        >
                            <LogOut className='w-4 h-4' />
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <a href='/login' onClick={() => setIsOpen(false)}>
                            Login
                        </a>
                        <a href='/signup' className='btn glass' onClick={() => setIsOpen(false)}>
                            Sign Up
                        </a>
                    </>
                )}

                <button onClick={() => setIsOpen(false)} className='rounded-md p-2 glass'>
                    <XIcon />
                </button>
            </div>
        </>
    );
}