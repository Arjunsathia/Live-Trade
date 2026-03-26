import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../../features/auth/hooks/useAuth';
import { setCredentials } from '../../../features/auth/store/authSlice';
import { Eye, EyeOff, FastForward, TrendingUp } from 'lucide-react';

/* ── Google SVG ─────────────────────────────────────── */
function GoogleIcon() {
    return (
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z" fill="#EA4335" />
            <path d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z" fill="#FBBC05" />
            <path d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.313 1.584-1.265 2.745-2.636 3.534L19.834 21Z" fill="#4285F4" />
            <path d="M1.24 17.345 5.28 14.23c-.373-1.13-.591-2.345-.591-3.615 0-1.227.204-2.395.558-3.48L1.24 4.02A11.961 11.961 0 0 0 0 10.615c0 2.443.734 4.714 2 6.615l-.76.115Z" fill="#34A853" />
        </svg>
    );
}

/* ── Apple SVG ──────────────────────────────────────── */
function AppleIcon() {
    return (
        <svg className="w-5 h-5 shrink-0 fill-white" viewBox="0 0 24 24">
            <path d="M17.05 20.28c-.98.95-2.05 1.72-3.21 2.31-1.25.64-2.58.91-3.95.81-1.37-.1-2.69-.53-3.86-1.28-1.17-.75-2.14-1.74-2.86-2.93-1.03-1.72-1.54-3.66-1.5-5.83.04-2.17.61-4.1 1.68-5.8 1.07-1.7 2.47-2.96 4.19-3.79 1.72-.83 3.58-1.2 5.58-1.11 1.48.07 2.87.42 4.15 1.04 1.28.62 2.37 1.48 3.25 2.58l-2.4 2.1c-.6-.73-1.33-1.28-2.19-1.65-.86-.37-1.8-.52-2.81-.45-1.18.08-2.28.45-3.3 1.1-1.02.65-1.84 1.54-2.46 2.67-.62 1.13-.93 2.45-.93 3.96 0 1.51.31 2.83.93 3.96.62 1.13 1.44 2.02 2.46 2.67s2.12 1.02 3.3 1.1c.85.06 1.65-.05 2.4-.33.75-.28 1.42-.69 2.01-1.23l2.7 2.2zM12.03 7.25c.13-1.33.63-2.55 1.5-3.67.87-1.12 1.95-1.93 3.24-2.43.13.13.23.3.31.5.08.2.12.4.12.6 0 .58-.15 1.14-.45 1.68s-.7 1.02-1.2 1.44c-.5.42-1.06.75-1.68.99-.62.24-1.28.4-1.97.48.06-.5.11-.93.13-1.29z" />
        </svg>
    );
}

/* ── Mini Bar chart segment ─────────────────────────── */
function MiniBar({ color, heights }) {
    return (
        <div className="h-24 flex-1 bg-white/5 rounded-lg flex items-end p-2 gap-1">
            {heights.map((h, i) => (
                <div key={i} className={`w-full rounded-sm ${color}`} style={{ height: `${h}%` }} />
            ))}
        </div>
    );
}

/* ── Floating label field ───────────────────────────── */
function FloatingField({ id, label, type = 'text', value, onChange, children }) {
    return (
        <div className="relative group" style={{ paddingTop: '1.5rem' }}>
            <input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                placeholder=" "
                autoComplete="off"
                className="peer w-full bg-transparent border-0 border-b-2 border-[#424754] focus:border-[#adc6ff] focus:ring-0 focus:outline-none text-white pt-1 pb-2 pr-10 transition-all placeholder-transparent text-[15px]"
            />
            <label
                htmlFor={id}
                className="absolute left-0 top-6 text-[#c2c6d6] text-[15px] transition-all origin-left pointer-events-none
                    peer-focus:-translate-y-5 peer-focus:scale-[0.82] peer-focus:text-[#adc6ff]
                    peer-[:not(:placeholder-shown)]:-translate-y-5 peer-[:not(:placeholder-shown)]:scale-[0.82]"
            >
                {label}
            </label>
            {children}
        </div>
    );
}

export function LoginPage() {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const { login, isLoading, error } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) { /* handled by Redux */ }
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
        <main className="flex min-h-screen bg-[#0b1326]">

            {/* ── LEFT: Hero Branding Panel ────────────────────── */}
            <section className="hidden lg:flex w-[58%] relative overflow-hidden bg-[#060e20] items-center justify-center">

                {/* Background chart photo */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80"
                        alt="Trading charts"
                        className="w-full h-full object-cover opacity-30 mix-blend-luminosity"
                    />
                    {/* Gradient fade toward left */}
                    <div className="absolute inset-0" style={{
                        background: 'linear-gradient(to right, #060e20 0%, rgba(6,14,32,0.7) 40%, transparent 100%)'
                    }} />
                </div>

                {/* Content overlay */}
                <div className="relative z-10 w-full max-w-xl px-12 py-16">

                    {/* Security badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#adc6ff]/10 border border-[#adc6ff]/20 text-[#adc6ff] text-[11px] font-bold tracking-[0.15em] uppercase mb-8">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                        </svg>
                        Institutional Grade Security
                    </div>

                    {/* Hero headline */}
                    <h1 className="font-bold text-[44px] leading-tight tracking-tight text-white mb-6" style={{ fontFamily: 'Space Grotesk' }}>
                        Precision Trading for the{' '}
                        <br />
                        <span style={{ color: '#adc6ff' }}>Modern Investor</span>
                    </h1>

                    <p className="text-[#c2c6d6] text-[17px] leading-relaxed max-w-md mb-12">
                        Access real-time global markets with ultra-low latency, advanced charting, and institutional-grade order execution.
                    </p>

                    {/* Glassmorphism Stats Card */}
                    <div className="p-7 rounded-xl border border-white/5 relative overflow-hidden"
                        style={{ background: 'rgba(45, 52, 73, 0.4)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}>

                        {/* Card ambient glow */}
                        <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#adc6ff]/10 rounded-full blur-3xl" />

                        <div className="flex items-end justify-between gap-4 mb-6 relative z-10">
                            <div>
                                <p className="text-[11px] uppercase tracking-[0.15em] text-[#c2c6d6] mb-1 font-medium">Total Market Volume</p>
                                <h2 className="text-[38px] font-bold text-white leading-none" style={{ fontFamily: 'Space Grotesk' }}>$4.28B</h2>
                            </div>
                            <div className="flex items-center gap-1 text-[#4ae176] font-bold text-sm bg-[#4ae176]/10 px-2.5 py-1 rounded-lg">
                                <TrendingUp size={14} strokeWidth={2.5} />
                                +12.4%
                            </div>
                        </div>

                        <div className="flex gap-3 relative z-10">
                            <MiniBar color="bg-[#adc6ff]/60" heights={[50, 75, 65, 100, 80]} />
                            <MiniBar color="bg-[#4ae176]/70" heights={[33, 66, 50, 75, 50]} />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── RIGHT: Form Panel ────────────────────────────── */}
            <section className="w-full lg:w-[42%] flex items-center justify-center p-6 sm:p-12 relative"
                style={{ background: 'radial-gradient(at 0% 0%, rgba(77, 142, 255, 0.12) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(0, 185, 84, 0.07) 0px, transparent 50%), #0b1326' }}>

                <div className="w-full max-w-[420px]">

                    {/* Error banner */}
                    {error && (
                        <div className="mb-6 p-4 bg-[#ffb3ad]/10 border border-[#ffb3ad]/20 text-[#ffb3ad] rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    {/* Brand anchor */}
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-lg"
                            style={{ background: 'linear-gradient(135deg, #adc6ff, #4d8eff)' }}>
                            <svg className="w-5 h-5 text-[#002e6a]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M3.5 18.5L9.5 12.5L13.5 16.5L22 6.92L20.59 5.51L13.5 13.74L9.5 9.74L2 17.24L3.5 18.5Z" />
                            </svg>
                        </div>
                        <span className="text-[22px] font-bold tracking-tight text-[#adc6ff]" style={{ fontFamily: 'Space Grotesk' }}>
                            Live-Trader
                        </span>
                    </div>

                    {/* Page heading */}
                    <div className="mb-8">
                        <h2 className="text-[32px] font-bold text-white mb-1.5 tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>
                            Welcome back
                        </h2>
                        <p className="text-[#c2c6d6] text-[15px]">Enter your credentials to access your trading dashboard.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                        {/* Email */}
                        <FloatingField id="email" label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} />

                        {/* Password */}
                        <FloatingField id="password" label="Password" type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}>
                            <button type="button" onClick={() => setShowPw(p => !p)}
                                className="absolute right-0 bottom-2 text-[#c2c6d6] hover:text-[#adc6ff] transition-colors">
                                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </FloatingField>

                        {/* Options row */}
                        <div className="flex items-center justify-between text-sm -mt-2">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox"
                                    className="w-4 h-4 rounded-sm border border-[#424754] bg-[#222a3d] text-[#adc6ff] focus:ring-[#adc6ff] focus:ring-offset-0 transition-all" />
                                <span className="text-[#c2c6d6] group-hover:text-white transition-colors">Remember me</span>
                            </label>
                            <a href="#" className="text-[#adc6ff] font-bold hover:opacity-80 transition-opacity">Forgot password?</a>
                        </div>

                        {/* Login CTA */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 font-bold text-[#002e6a] rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-[15px] hover:opacity-90 active:scale-[0.98]"
                            style={{ background: 'linear-gradient(90deg, #adc6ff, #4d8eff)' }}>
                            {isLoading ? 'Signing In...' : 'Login'}
                            {!isLoading && (
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                </svg>
                            )}
                        </button>

                        {/* Divider */}
                        <div className="relative flex items-center">
                            <div className="flex-grow border-t border-[#424754]/40" />
                            <span className="flex-shrink mx-4 text-[#8c909f] text-[11px] font-bold uppercase tracking-widest">Or continue with</span>
                            <div className="flex-grow border-t border-[#424754]/40" />
                        </div>

                        {/* OAuth grid */}
                        <div className="grid grid-cols-2 gap-3">
                            <button type="button"
                                className="flex items-center justify-center gap-2.5 py-3 px-4 bg-[#222a3d] hover:bg-[#2d3449] rounded-xl transition-colors text-sm font-semibold text-white">
                                <GoogleIcon />
                                Google
                            </button>
                            <button type="button"
                                className="flex items-center justify-center gap-2.5 py-3 px-4 bg-[#222a3d] hover:bg-[#2d3449] rounded-xl transition-colors text-sm font-semibold text-white">
                                <AppleIcon />
                                Apple
                            </button>
                        </div>

                        {/* Footer link */}
                        <p className="text-center text-[#c2c6d6] text-sm">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-[#adc6ff] font-bold hover:opacity-80 transition-opacity">Register now</Link>
                        </p>

                        {/* Dev skip */}
                        <button
                            type="button"
                            onClick={handleSkip}
                            className="flex items-center justify-center gap-1.5 text-[#8c909f] hover:text-[#c2c6d6] text-[12px] transition-colors mx-auto">
                            <FastForward size={12} />
                            Quick Login (Dev)
                        </button>

                    </form>
                </div>

                {/* Bottom legal row */}
                <div className="absolute bottom-6 flex gap-6 text-[10px] uppercase tracking-[0.2em] text-[#424754]">
                    <span>Privacy Policy</span>
                    <span>Terms of Service</span>
                    <span>Cookie Settings</span>
                </div>
            </section>
        </main>
    );
}
