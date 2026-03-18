import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { Lock, Mail, User } from 'lucide-react';

export function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [localError, setLocalError] = useState('');
    
    const { register, isLoading, error } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');
        
        if (password !== confirmPassword) {
            setLocalError('Passwords do not match');
            return;
        }

        try {
            await register({ name, email, password });
            navigate('/login');
        } catch (err) {
            // Error handled by Redux
        }
    };

    const displayError = localError || error;

    return (
        <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-bg relative overflow-hidden p-6">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
            
            <div className="w-full max-w-md bg-surface border border-border/60 rounded-3xl p-8 relative z-10 shadow-2xl backdrop-blur-xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-heading font-black text-text mb-2">Create Account</h1>
                    <p className="text-text-muted font-body">Join the Pro Terminal today</p>
                </div>

                {displayError && (
                    <div className="mb-6 p-4 bg-negative/10 border border-negative/20 text-negative rounded-xl text-sm font-body">
                        {displayError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-bold text-text-muted tracking-wider uppercase ml-1">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-surface-elevated border border-border/60 rounded-xl px-12 py-3.5 text-text focus:outline-none focus:border-primary/50 focus:shadow-[0_0_15px_rgba(122,248,106,0.1)] transition-all font-body font-medium"
                                placeholder="John Doe"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-bold text-text-muted tracking-wider uppercase ml-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-surface-elevated border border-border/60 rounded-xl px-12 py-3.5 text-text focus:outline-none focus:border-primary/50 focus:shadow-[0_0_15px_rgba(122,248,106,0.1)] transition-all font-body font-medium"
                                placeholder="name@company.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-bold text-text-muted tracking-wider uppercase ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-surface-elevated border border-border/60 rounded-xl px-12 py-3.5 text-text focus:outline-none focus:border-primary/50 focus:shadow-[0_0_15px_rgba(122,248,106,0.1)] transition-all font-body font-medium"
                                placeholder="••••••••"
                                required
                                minLength={8}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-bold text-text-muted tracking-wider uppercase ml-1">Confirm Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-surface-elevated border border-border/60 rounded-xl px-12 py-3.5 text-text focus:outline-none focus:border-primary/50 focus:shadow-[0_0_15px_rgba(122,248,106,0.1)] transition-all font-body font-medium"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="mt-6 w-full bg-primary hover:bg-primary-light text-bg font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(122,248,106,0.2)] hover:shadow-[0_0_30px_rgba(122,248,106,0.4)]"
                    >
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                    
                    <p className="text-center text-text-muted mt-6 text-sm">
                        Already have an account? <Link to="/login" className="text-primary hover:text-primary-light font-bold">Log in here</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
