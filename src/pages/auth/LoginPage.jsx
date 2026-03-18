import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { setCredentials } from '../../features/auth/store/authSlice';
import { Lock, Mail, FastForward } from 'lucide-react';

export function LoginPage() {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoading, error } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            // Error is handled by Redux
        }
    };

    const handleSkip = (e) => {
        e.preventDefault();
        dispatch(setCredentials({
            user: { id: 'dev_user', name: 'Dev User', email: email || 'dev@test.com' },
            accessToken: 'dev_mock_token_123'
        }));
        navigate('/dashboard');
    };

    return (
        <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-bg relative overflow-hidden p-6">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
            
            <div className="w-full max-w-md bg-surface border border-border/60 rounded-3xl p-8 relative z-10 shadow-2xl backdrop-blur-xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-heading font-black text-text mb-2">Welcome Back</h1>
                    <p className="text-text-muted font-body">Sign in to access the Pro Terminal</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-negative/10 border border-negative/20 text-negative rounded-xl text-sm font-body">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                            />
                        </div>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input type="checkbox" className="w-4 h-4 rounded appearance-none border border-border/60 checked:bg-primary checked:border-primary transition-all relative before:absolute before:inset-0 before:flex before:items-center before:justify-center before:text-bg checked:before:content-['✓'] before:text-xs font-bold" />
                            <span className="text-sm text-text-muted group-hover:text-text transition-colors">Remember me</span>
                        </label>
                        <a href="#" className="text-sm text-primary hover:text-primary-light transition-colors font-bold">Forgot password?</a>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="mt-4 w-full bg-primary hover:bg-primary-light text-bg font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(122,248,106,0.2)] hover:shadow-[0_0_30px_rgba(122,248,106,0.4)]"
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>

                    <button
                        type="button"
                        onClick={handleSkip}
                        className="mt-2 w-full flex items-center justify-center gap-2 bg-surface hover:bg-surface-elevated border border-border/60 text-text font-bold py-3 rounded-xl transition-all bg-opacity-50"
                    >
                        <FastForward size={16} className="text-primary" />
                        Quick Login / Skip
                    </button>
                    
                    <p className="text-center text-text-muted mt-6 text-sm">
                        Don't have an account? <Link to="/register" className="text-primary hover:text-primary-light font-bold">Register now</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
