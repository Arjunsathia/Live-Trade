import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../features/auth/hooks/useAuth';
import { setCredentials } from '../../../features/auth/store/authSlice';
import { Eye, EyeOff, User, Mail, Lock, Ticket, ShieldCheck, Server } from 'lucide-react';

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

/* ── Password strength calc ─────────────────────────── */
function calcStrength(pw) {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score; // 0–4
}

const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const STRENGTH_COLORS = ['', '#ffb3ad', '#ffb3ad', '#adc6ff', '#4ae176'];

/* ── Input field with icon ──────────────────────────── */
function InputField({ label, optional, icon: Icon, type = 'text', value, onChange, placeholder, children, id, required, minLength }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={id} className="text-[11px] font-bold text-[#c2c6d6] tracking-[0.12em] uppercase">
                {label}
                {optional && <span className="text-[#8c909f] normal-case tracking-normal ml-1 font-normal">(optional)</span>}
            </label>
            <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c909f]">
                    <Icon size={16} strokeWidth={2} />
                </div>
                <input
                    id={id}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    minLength={minLength}
                    className="w-full bg-[#222a3d] border border-[#424754]/60 rounded-xl pl-10 pr-10 py-3 text-white text-[14px] placeholder-[#8c909f] focus:outline-none focus:border-[#adc6ff]/60 transition-all"
                />
                {children}
            </div>
        </div>
    );
}

export function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [referral, setReferral] = useState('');
    const [agreed, setAgreed] = useState(false);
    const [showPw, setShowPw] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [localError, setLocalError] = useState('');

    const { register, isLoading, error } = useAuth();
    const navigate = useNavigate();

    const strength = calcStrength(password);
    const displayError = localError || error;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');
        if (!agreed) { setLocalError('You must agree to the Terms of Service and Privacy Policy.'); return; }
        if (password !== confirmPassword) { setLocalError('Passwords do not match.'); return; }
        try {
            await register({ name, email, password });
            navigate('/login');
        } catch (err) { /* handled by Redux */ }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 relative"
            style={{ background: 'radial-gradient(at 0% 0%, rgba(77,142,255,0.10) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(0,185,84,0.07) 0px, transparent 50%), #0b1326' }}>

            {/* Top brand */}
            <div className="flex flex-col items-center gap-2 mb-8">
                <div className="flex items-center gap-3">
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
                <p className="text-[#c2c6d6] text-[14px]">Enter the next generation of digital exchange.</p>
            </div>

            {/* Card */}
            <div className="w-full max-w-[500px] bg-[#171f33] border border-[#424754]/30 rounded-[16px] p-8">

                <h1 className="text-[26px] font-bold text-white mb-6 tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>
                    Create your account
                </h1>

                {/* Error */}
                {displayError && (
                    <div className="mb-5 p-3.5 bg-[#ffb3ad]/10 border border-[#ffb3ad]/20 text-[#ffb3ad] rounded-xl text-sm">
                        {displayError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    {/* Full Name */}
                    <InputField id="name" label="Full Name" icon={User} value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" required />

                    {/* Email */}
                    <InputField id="email" label="Email Address" icon={Mail} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@company.com" required />

                    {/* Password + Confirm Password side-by-side */}
                    <div>
                        <div className="grid grid-cols-2 gap-3">
                            <InputField id="password" label="Password" icon={Lock} type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={8}>
                                <button type="button" onClick={() => setShowPw(p => !p)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8c909f] hover:text-[#adc6ff] transition-colors">
                                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </InputField>
                            <InputField id="confirmPassword" label="Confirm Password" icon={Lock} type={showConfirm ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" required>
                                <button type="button" onClick={() => setShowConfirm(p => !p)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8c909f] hover:text-[#adc6ff] transition-colors">
                                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </InputField>
                        </div>

                        {/* Strength meter */}
                        {password.length > 0 && (
                            <div className="mt-2">
                                <div className="flex gap-1.5 mb-1">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="flex-1 h-[3px] rounded-full transition-all duration-300"
                                            style={{ background: i <= strength ? STRENGTH_COLORS[strength] : '#424754' }} />
                                    ))}
                                </div>
                                <span className="text-[12px] font-bold" style={{ color: STRENGTH_COLORS[strength] }}>
                                    {STRENGTH_LABELS[strength]} password
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Referral Code */}
                    <InputField id="referral" label="Referral Code" optional icon={Ticket} value={referral} onChange={e => setReferral(e.target.value)} placeholder="LIV-12345" />

                    {/* Terms checkbox */}
                    <label className="flex items-start gap-3 cursor-pointer group mt-1">
                        <input
                            type="checkbox"
                            checked={agreed}
                            onChange={e => setAgreed(e.target.checked)}
                            className="w-4 h-4 mt-0.5 rounded-sm border border-[#424754] bg-[#222a3d] text-[#4ae176] focus:ring-[#4ae176] focus:ring-offset-0 shrink-0 transition-all"
                        />
                        <span className="text-[13px] text-[#c2c6d6] leading-relaxed group-hover:text-white transition-colors">
                            I agree to the{' '}
                            <a href="#" className="text-[#adc6ff] hover:underline">Terms of Service</a>
                            {' '}and{' '}
                            <a href="#" className="text-[#adc6ff] hover:underline">Privacy Policy</a>
                            , and confirm I am over 18 years of age.
                        </span>
                    </label>

                    {/* Create Account CTA */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-[15px] text-[#002109] hover:opacity-90 active:scale-[0.98] mt-2"
                        style={{ background: '#4ae176' }}>
                        {isLoading ? 'Creating Account...' : 'Create Account'}
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
                        Already have an account?{' '}
                        <Link to="/login" className="text-[#adc6ff] font-bold hover:opacity-80 transition-opacity">Log In</Link>
                    </p>

                </form>
            </div>

            {/* Bottom trust badges */}
            <div className="flex items-center gap-6 mt-8 text-[11px] uppercase tracking-[0.15em] text-[#424754]">
                <span className="flex items-center gap-1.5">
                    <ShieldCheck size={12} />
                    Secure Encryption
                </span>
                <span className="flex items-center gap-1.5">
                    <Server size={12} />
                    Tier-4 Data Center
                </span>
            </div>
        </div>
    );
}
function WalletIcon() { return <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="currentColor"><path d="M21 7.28V5c0-1.1-.9-2-2-2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-2.28A2 2 0 0 0 22 15V9a2 2 0 0 0-1-1.72zM20 9v6h-7V9h7zM5 19V5h14v2h-6c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h6v2H5z" /><circle cx="16" cy="12" r="1.5" /></svg>; }
