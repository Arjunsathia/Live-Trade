import { X, TrendingUp, TrendingDown, Users, Shield, Zap, Info, CheckCircle2 } from 'lucide-react';

function StatCard({ label, value, sub, positive }) {
    return (
        <div className="bg-surface-elevated border border-border/40 rounded-[16px] p-4 flex flex-col gap-1.5 relative overflow-hidden group">
            {positive !== undefined && (
                <div className={`absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl opacity-10 rounded-bl-[16px] transition-opacity group-hover:opacity-20
                    ${positive ? 'from-brand to-transparent' : 'from-red-500 to-transparent'}`} />
            )}
            <span className="text-[10px] text-text-muted uppercase tracking-[0.14em] font-bold z-10">{label}</span>
            <span className={`text-[20px] font-mono font-bold tabular-nums tracking-tight z-10
                ${positive === undefined ? 'text-text' : positive ? 'text-brand' : 'text-red-400'}`}>
                {value}
            </span>
            {sub && <span className="text-[10px] text-text-muted/70 font-medium z-10">{sub}</span>}
        </div>
    );
}

function MicroSparkline({ data }) {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const w = 240, h = 60;

    const pts = data.map((v, i) => {
        const x = (i / (data.length - 1)) * w;
        const y = h - ((v - min) / range) * h;
        return `${x},${y}`;
    }).join(' ');

    const fillPts = `0,${h} ${pts} ${w},${h}`;

    return (
        <div className="relative w-full h-[60px] overflow-hidden">
            <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
                <defs>
                    <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-brand)" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="var(--color-brand)" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <polygon points={fillPts} fill="url(#curveGradient)" />
                <polyline points={pts} fill="none" stroke="var(--color-brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="absolute inset-0 bg-gradient-to-r from-surface-elevated via-transparent to-surface-elevated opacity-20 pointer-events-none" />
        </div>
    );
}

export function ProviderModal({ provider, onClose }) {
    if (!provider) return null;

    const handleFollow = () => {
        console.log('Follow provider:', provider.id);
        onClose();
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-[#0B0E10]/80 backdrop-blur-md z-[100] transition-all"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Drawer */}
            <div
                className="fixed right-0 top-0 bottom-0 w-full max-w-[480px] bg-surface border-l border-border/60 z-[101] flex flex-col overflow-y-auto shadow-2xl animate-fade-up shadow-[0_0_80px_rgba(34,197,94,0.05)]"
                role="dialog"
                aria-modal="true"
            >
                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-border/40 sticky top-0 bg-surface/90 backdrop-blur-xl z-20">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <h2 className="text-[20px] font-bold text-text tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                                {provider.name}
                            </h2>
                            {provider.isVerified && (
                                <CheckCircle2 size={16} className="text-brand" fill="currentColor" opacity={0.2} />
                            )}
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-surface-elevated rounded-[6px] border border-border/50">
                                <Users size={10} strokeWidth={2.5} className="text-text-muted" />
                                <span className="text-[10px] font-mono font-bold text-text-muted tabular-nums">{provider.followers?.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-brand/10 border border-brand/20 rounded-[6px]">
                                <Zap size={10} strokeWidth={2.5} className="text-brand" />
                                <span className="text-[10px] font-mono font-bold text-brand tabular-nums">{provider.performanceFee}% Fee</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex flex-col items-center justify-center bg-surface-elevated border border-border/50 rounded-[10px] text-text-muted hover:text-text hover:border-border transition-colors group"
                    >
                        <X size={16} strokeWidth={2.5} className="group-hover:scale-95 transition-transform" />
                    </button>
                </div>

                <div className="flex flex-col gap-6 p-6">
                    {/* Bio */}
                    {provider.bio && (
                        <p className="text-[14px] text-text-muted/90 leading-relaxed font-medium">
                            {provider.bio}
                        </p>
                    )}

                    {/* Equity Curve Panel */}
                    {provider.equityCurve && (
                        <div className="bg-surface-elevated border border-border/50 rounded-[20px] overflow-hidden">
                            <div className="p-4 border-b border-border/30 flex justify-between items-center">
                                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">All-Time Performance</span>
                                <span className="text-[10px] font-mono font-bold text-brand tabular-nums px-2 py-0.5 bg-brand/10 rounded-[6px]">
                                    +{provider.roiAllTime}%
                                </span>
                            </div>
                            <div className="pt-4 pb-2">
                                <MicroSparkline data={provider.equityCurve} />
                            </div>
                            <div className="px-5 pb-5 pt-2 flex justify-between items-center">
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted/50">Initial</span>
                                    <span className="font-mono text-[12px] font-bold text-text tabular-nums">$10,000</span>
                                </div>
                                <TrendingUp size={14} className="text-brand/30" strokeWidth={2} />
                                <div className="flex flex-col gap-0.5 text-right">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand/50">Current</span>
                                    <span className="font-mono text-[14px] font-bold text-brand tabular-nums">
                                        ${(10000 * (1 + provider.roiAllTime / 100)).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <StatCard label="30d Return" value={`+${provider.roi30d}%`} positive={true} sub="Past month" />
                        <StatCard label="Win Rate" value={`${provider.winRate}%`} sub="Of total trades" />
                        <StatCard label="Total Pips" value={`+${provider.totalPips || '4,285'}`} positive={true} sub="All time" />
                        <StatCard label="Max Drawdown" value={`${provider.maxDrawdown}%`} positive={false} sub="Historical risk" />
                    </div>

                    {/* Risk Gauge */}
                    <div className={`border rounded-[16px] p-4 flex items-center gap-4 
                        ${provider.maxDrawdown < 10 ? 'bg-brand/5 border-brand/20' : provider.maxDrawdown < 20 ? 'bg-yellow-500/5 border-yellow-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                        <div className={`w-12 h-12 rounded-[12px] flex items-center justify-center shrink-0
                            ${provider.maxDrawdown < 10 ? 'bg-brand/10 text-brand' : provider.maxDrawdown < 20 ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'}`}>
                            <Shield size={20} strokeWidth={2.5} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="text-[14px] font-bold text-text">
                                {provider.maxDrawdown < 10 ? 'Conservative Strategy' : provider.maxDrawdown < 20 ? 'Moderate Growth' : 'High Risk / High Reward'}
                            </div>
                            <div className="text-[12px] text-text-muted/80 font-medium leading-tight">
                                This provider has historically maintained a max drawdown of <strong className="text-text">{provider.maxDrawdown}%</strong>.
                            </div>
                        </div>
                    </div>

                    {/* Copy Config */}
                    <div className="flex flex-col gap-4 mt-2">
                        <div className="flex items-center gap-2">
                            <Zap size={14} className="text-text" strokeWidth={2.5} />
                            <h3 className="text-[15px] font-bold text-text" style={{ fontFamily: 'Space Grotesk' }}>Copy Settings</h3>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">Prop. Multiplier</label>
                            <div className="relative rounded-[12px] border border-border/80 bg-surface-elevated overflow-hidden focus-within:border-brand/60 transition-all">
                                <input
                                    type="number"
                                    defaultValue="1.0"
                                    step="0.1"
                                    min="0.1"
                                    max="5"
                                    className="w-full bg-transparent px-4 py-3 font-mono text-[14px] font-bold text-text focus:outline-none tabular-nums"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-text-muted uppercase">Lots (1x)</span>
                            </div>
                            <p className="text-[11px] text-text-muted/60 font-medium flex items-center gap-1.5 mt-1">
                                <Info size={10} /> 1.0x copies their exact lot size per trade.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-1">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">Hard Stop DD%</label>
                                <div className="rounded-[12px] border border-border/80 bg-surface-elevated focus-within:border-brand/60 transition-all overflow-hidden relative">
                                    <input
                                        type="number"
                                        defaultValue="20"
                                        step="1"
                                        className="w-full bg-transparent px-3 py-2.5 font-mono text-[13px] font-bold text-text focus:outline-none tabular-nums"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-text-muted uppercase">%</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">Allocated Budget</label>
                                <div className="rounded-[12px] border border-border/80 bg-surface-elevated focus-within:border-brand/60 transition-all overflow-hidden relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] font-bold text-text-muted">$</span>
                                    <input
                                        type="number"
                                        defaultValue="1000"
                                        step="100"
                                        className="w-full bg-transparent pl-7 pr-3 py-2.5 font-mono text-[13px] font-bold text-text focus:outline-none tabular-nums"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sticky Footer CTA */}
                <div className="mt-auto sticky bottom-0 bg-surface/90 backdrop-blur-xl border-t border-border/40 p-6 z-20">
                    {provider.isFollowing ? (
                        <button
                            onClick={onClose}
                            className="w-full py-3.5 rounded-[14px] bg-red-500/10 border border-red-500/20 text-red-500 font-bold text-[13px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/40"
                        >
                            Stop Copying
                        </button>
                    ) : (
                        <button
                            onClick={handleFollow}
                            className="w-full py-4 rounded-[14px] bg-brand text-black font-bold text-[14px] uppercase tracking-[0.1em] flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all duration-200 shadow-[0_4px_24px_-6px_var(--color-brand,#22c55e)] focus:outline-none"
                        >
                            <Copy size={16} strokeWidth={2.5} />
                            Copy Strategy
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}
