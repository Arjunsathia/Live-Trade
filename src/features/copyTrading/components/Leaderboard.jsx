import { useState, useMemo } from 'react';
import { Users, TrendingUp, TrendingDown, Star, ChevronRight, Award, Shield, Zap, Info, CheckCircle2, Copy } from 'lucide-react';

// --- Reusable Mini Components ---
function MiniSparkline({ data, positive }) {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = (max - min) || 1;
    const w = 70, h = 24;
    const pts = data.map((v, i) => {
        const x = (i / (data.length - 1)) * w;
        const y = h - ((v - min) / range) * h;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
            <defs>
                <linearGradient id={`grad-${positive}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={positive ? 'var(--color-positive)' : 'var(--color-negative)'} stopOpacity="0.2" />
                    <stop offset="100%" stopColor={positive ? 'var(--color-positive)' : 'var(--color-negative)'} stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={`M ${pts} V ${h} H 0 Z`} fill={`url(#grad-${positive})`} />
            <polyline points={pts} fill="none" stroke={positive ? 'var(--color-positive)' : 'var(--color-negative)'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function StatCard({ label, value, sub, positive }) {
    return (
        <div className="bg-surface-elevated/40 border border-border/20 rounded-[8px] p-4 flex flex-col gap-1.5 relative overflow-hidden group hover:bg-surface-elevated/60 transition-colors">
            {positive !== undefined && (
                <div className={`absolute top-0 right-0 w-12 h-12 opacity-[0.08] rounded-bl-[16px] transition-opacity group-hover:opacity-[0.15]
                    ${positive ? 'bg-positive' : 'bg-negative'}`} />
            )}
            <span className="text-[10px] text-text-muted/80 uppercase tracking-[0.14em] font-semibold z-10">{label}</span>
            <span className={`text-[17px] font-mono font-bold tabular-nums tracking-tight z-10 leading-none
                ${positive === undefined ? 'text-text' : positive ? 'text-positive' : 'text-negative'}`}>
                {value}
            </span>
            {sub && <span className="text-[9px] text-text-muted/60 font-medium z-10">{sub}</span>}
        </div>
    );
}

function LargeSparkline({ data }) {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const w = 400, h = 80;

    const pts = data.map((v, i) => {
        const x = (i / (data.length - 1)) * w;
        const y = h - ((v - min) / range) * h;
        return `${x},${y}`;
    }).join(' ');

    const fillPts = `0,${h} ${pts} ${w},${h}`;

    return (
        <div className="relative w-full h-[80px] overflow-hidden rounded-[8px] bg-surface-elevated/30 border border-border/40">
            <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="absolute inset-0">
                <defs>
                    <linearGradient id="curveGradientLarge" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-positive)" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="var(--color-positive)" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <polygon points={fillPts} fill="url(#curveGradientLarge)" />
                <polyline points={pts} fill="none" stroke="var(--color-positive)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </div>
    );
}


function ProviderRow({ provider, rank, isSelected, onSelect }) {
    const isTop1 = rank === 1;
    const isPositive = provider.roi30d >= 0;

    return (
        <button
            onClick={onSelect}
            className={`w-full group relative flex items-center justify-between p-4 transition-all duration-300 border-b border-border/30 text-left overflow-hidden last:border-b-0
                ${isSelected
                    ? 'bg-surface-bright border-l-[3px] border-l-primary'
                    : 'bg-transparent border-l-[3px] border-l-transparent hover:bg-surface-bright/50 hover:border-l-border/60'}
            `}
        >
            <div className="flex items-center gap-3 min-w-0 z-10 pl-1">
                <div className={`shrink-0 w-8 h-8 rounded-[8px] flex items-center justify-center font-heading font-black text-[12px] 
                    ${isTop1 ? 'bg-primary/10 text-primary border border-primary/30' : 'bg-surface-elevated text-text-muted border border-border/50'}`}>
                    {rank}
                </div>

                <div className="flex flex-col min-w-0 truncate">
                    <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[13px] text-text tracking-tight truncate" style={{ fontFamily: 'Space Grotesk' }}>
                            {provider.name}
                        </span>
                        {provider.isFollowing && <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 opacity-60">
                        <span className="text-[10px] font-bold text-text-muted flex items-center gap-1 font-mono tabular-nums">
                            <Users size={9} /> {provider.followers > 1000 ? (provider.followers / 1000).toFixed(1) + 'k' : provider.followers}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="hidden 2xl:block opacity-60 group-hover:opacity-100 transition-opacity">
                    <MiniSparkline data={provider.equityCurve} positive={isPositive} />
                </div>
                <div className="flex flex-col items-end min-w-[50px]">
                    <span className={`text-[13px] font-mono font-bold tracking-tight ${isPositive ? 'text-positive' : 'text-negative'}`}>
                        {isPositive ? '+' : ''}{provider.roi30d}%
                    </span>
                    <span className="text-[9px] font-bold text-text-muted/60 uppercase tracking-widest mt-0.5">30d ROI</span>
                </div>
            </div>
        </button>
    );
}

// --- Main Component ---
export function Leaderboard({ providers = [] }) {
    const [selectedId, setSelectedId] = useState(providers[0]?.id || null);
    const selectedProvider = useMemo(() => providers.find(p => p.id === selectedId) || providers[0], [providers, selectedId]);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-1">
                <div className="flex flex-col gap-0.5">
                    <h2 className="text-[16px] font-bold text-text tracking-tight uppercase" style={{ fontFamily: 'Space Grotesk' }}>Copy Leaderboard</h2>
                    <p className="text-[11px] text-text-muted font-bold uppercase tracking-[0.1em]">Top Performing Providers</p>
                </div>
                <button className="px-4 py-2 bg-surface-elevated border border-border/40 rounded-[8px] text-[11px] uppercase tracking-widest font-bold text-text hover:bg-surface-bright transition-colors">
                    Browse All
                </button>
            </div>

            {/* 2-Pane Master Detail Card */}
            <div className="bg-surface-elevated border border-border rounded-[8px] overflow-hidden flex flex-col md:flex-row min-h-[520px] relative transition-all duration-500 group/panel">

                {/* Left Pane: List */}
                <div className="w-full md:w-[35%] lg:w-[320px] bg-surface-elevated/30 border-b md:border-b-0 md:border-r border-border/40 flex flex-col shrink-0">
                    <div className="p-4 border-b border-border/40">
                        <input
                            type="text"
                            placeholder="Search providers..."
                            className="w-full bg-bg border border-border/60 rounded-[8px] px-3.5 py-2.5 text-[12px] font-bold text-text focus:outline-none focus:border-primary/40 transition-colors placeholder-text-muted/40"
                        />
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
                        {providers.map((p, i) => (
                            <ProviderRow
                                key={p.id}
                                provider={p}
                                rank={i + 1}
                                isSelected={selectedId === p.id}
                                onSelect={() => setSelectedId(p.id)}
                            />
                        ))}
                    </div>
                </div>

                {/* Right Pane: Details */}
                {selectedProvider ? (
                    <div className="flex-1 flex flex-col bg-surface-elevated relative overflow-hidden animate-fade-up animate-duration-200">


                        <div className="p-6 flex-1 flex flex-col gap-6 overflow-y-auto custom-scrollbar relative z-10">

                            {/* Header */}
                            <div className="flex justify-between items-start">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-[22px] font-bold text-text tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>
                                            {selectedProvider.name}
                                        </h3>
                                        <CheckCircle2 size={16} className="text-brand" fill="currentColor" opacity={0.2} />
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-surface-elevated rounded-[6px] border border-border/50 text-[10px] font-mono font-bold text-text-muted tabular-nums">
                                            <Users size={10} strokeWidth={2.5} /> {selectedProvider.followers.toLocaleString()}
                                        </div>
                                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-brand/10 rounded-[6px] border border-brand/20 text-[10px] font-mono font-bold text-brand tabular-nums">
                                            <Zap size={10} strokeWidth={2.5} /> {selectedProvider.performanceFee}% Fee
                                        </div>
                                    </div>
                                </div>
                                <div className={`w-12 h-12 rounded-[14px] flex items-center justify-center
                                    ${selectedProvider.maxDrawdown < 10 ? 'bg-brand/10 text-brand' : selectedProvider.maxDrawdown < 20 ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'}`}>
                                    <Shield size={20} strokeWidth={2.5} />
                                </div>
                            </div>

                            {/* Bio & Top Stats */}
                            <p className="text-[13px] text-text-muted/90 font-medium leading-relaxed max-w-2xl">
                                {selectedProvider.bio || `A top-tier quantitative trading strategy focusing on high-probability setups with strict risk management. Copy ${selectedProvider.name} to mirror their exact market execution.`}
                            </p>

                            <div className="grid grid-cols-4 gap-3">
                                <StatCard label="30d Return" value={`+${selectedProvider.roi30d}%`} positive={selectedProvider.roi30d >= 0} />
                                <StatCard label="All-Time" value={`+${selectedProvider.roiAllTime}%`} positive={selectedProvider.roiAllTime >= 0} />
                                <StatCard label="Win Rate" value={`${selectedProvider.winRate}%`} />
                                <StatCard label="Max DD" value={`${selectedProvider.maxDrawdown}%`} positive={false} />
                            </div>

                            {/* Chart Area */}
                            <div className="flex flex-col gap-3 mt-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">Equity Curve</span>
                                    <span className="text-[11px] font-mono font-bold text-brand tabular-nums px-2 py-0.5 bg-brand/10 rounded-[6px]">
                                        ${(10000 * (1 + selectedProvider.roiAllTime / 100)).toLocaleString()} from $10k
                                    </span>
                                </div>
                                <LargeSparkline data={selectedProvider.equityCurve} />
                            </div>

                        </div>

                        {/* Footer Action */}
                        <div className="p-4 border-t border-border/40 bg-surface/50 backdrop-blur-md flex items-center justify-between gap-4 sticky bottom-0 z-20">
                            <div className="flex items-center gap-3">
                                <div className="relative rounded-[12px] border border-border/80 bg-surface-elevated/50 focus-within:border-brand/50 transition-all overflow-hidden flex items-center">
                                    <span className="text-[10px] font-bold text-text-muted px-3 uppercase tracking-wider">Risk Size</span>
                                    <input type="number" defaultValue="1.0" step="0.1" className="w-[80px] bg-transparent py-2.5 font-mono text-[13px] font-bold text-text focus:outline-none tabular-nums" />
                                    <span className="text-[10px] font-bold text-text-muted pr-3 uppercase">x</span>
                                </div>
                            </div>

                            {selectedProvider.isFollowing ? (
                                <button className="px-8 py-3 rounded-[8px] bg-negative/10 border border-negative/20 text-negative font-bold text-[13px] uppercase tracking-widest hover:bg-negative hover:text-white transition-colors">
                                    Stop Copying
                                </button>
                            ) : (
                                <button className="flex-1 py-3 rounded-[8px] bg-primary text-bg font-bold text-[13px] uppercase tracking-[0.1em] flex items-center justify-center gap-2 hover:brightness-110 active:brightness-90 transition-colors">
                                    <Copy size={16} strokeWidth={2.5} />
                                    Copy Strategy
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center bg-surface text-text-muted/50 gap-3">
                        <Users size={32} />
                        <span className="text-[13px] font-medium">Select a provider to view details</span>
                    </div>
                )}
            </div>
        </div>
    );
}
