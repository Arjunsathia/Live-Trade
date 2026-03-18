import { Eye, EyeOff, Wallet, ArrowUpRight, TrendingUp } from 'lucide-react';
import { useState } from 'react';

export function BalanceCard() {
    const [masked, setMasked] = useState(false);

    const toggleMask = (e) => {
        e.stopPropagation();
        setMasked(!masked);
    };

    return (
        <div className="relative overflow-hidden rounded-[28px] p-6 w-full flex flex-col justify-between group transition-all duration-500 hover:border-border/80 aspect-[1.6/1] bg-surface border border-border/60 shadow-[0_4px_30px_-10px_rgba(0,0,0,0.1)]">

            {/* Premium Deep Background */}
            <div className="absolute inset-0 bg-[#0A0D14] z-0 transition-transform duration-700 group-hover:scale-[1.02]"></div>

            {/* Smooth Ambient Glows (Not glossy, matte and diffused) */}
            <div className="absolute top-[0%] right-[0%] w-[120%] h-[120%] bg-gradient-to-bl from-brand/10 via-transparent to-transparent z-0 opacity-40 group-hover:opacity-70 transition-opacity duration-700 pointer-events-none blur-2xl"></div>
            <div className="absolute -bottom-[20px] -left-[20px] w-48 h-48 rounded-full bg-brand/5 blur-[50px] z-0 transition-all duration-700 group-hover:scale-110 group-hover:bg-brand/10" />

            {/* Top Section */}
            <div className="relative z-20 flex justify-between items-start w-full">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <span className="text-text-muted/60 text-[10px] font-bold tracking-[0.15em] uppercase" style={{ fontFamily: 'Space Grotesk' }}>
                            Total Equity
                        </span>
                        <button
                            onClick={toggleMask}
                            className="text-text-muted/40 hover:text-text-muted transition-colors"
                            aria-label="Toggle visibility"
                        >
                            {masked ? <EyeOff size={12} strokeWidth={2.5} /> : <Eye size={12} strokeWidth={2.5} />}
                        </button>
                    </div>
                </div>

                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-surface border border-border/50 text-text-muted/50 group-hover:text-brand/80 group-hover:border-brand/30 transition-all duration-300 shrink-0">
                    <Wallet size={14} strokeWidth={2} />
                </div>
            </div>

            {/* Center / Balance Section */}
            <div className="relative z-20 flex flex-col mt-2">
                <div className="font-mono font-bold text-[36px] tracking-tight text-white leading-none drop-shadow-sm tabular-nums">
                    {masked ? "$**,***.**" : "$84,250.00"}
                </div>

                {/* 24h Change Pill */}
                <div className="flex items-center gap-1.5 mt-3 w-fit px-2 py-1 bg-brand/10 border border-brand/20 rounded-[8px]">
                    <TrendingUp size={11} className="text-brand" strokeWidth={3} />
                    <span className="font-mono text-[11px] font-bold tabular-nums text-brand tracking-tight">+ $1,245.50 (1.4%)</span>
                    <span className="text-[9px] font-bold text-brand/50 uppercase tracking-widest ml-1">Today</span>
                </div>
            </div>

            {/* Bottom Section - Minimal Stats */}
            <div className="relative z-20 flex justify-between items-end w-full mt-auto pt-4 border-t border-border/30">
                <div className="flex flex-col gap-1 pr-4">
                    <span className="text-[9px] font-bold text-text-muted/50 tracking-[0.1em] uppercase">Free Margin</span>
                    <span className="font-mono text-[13px] font-bold text-white/90 tabular-nums">{masked ? "$**,***.**" : "$42,150.00"}</span>
                </div>

                <div className="w-[1px] h-6 bg-border/40"></div>

                <div className="flex flex-col gap-1 px-4">
                    <span className="text-[9px] font-bold text-text-muted/50 tracking-[0.1em] uppercase">Margin Lvl</span>
                    <span className="font-mono text-[13px] font-bold text-brand tabular-nums">{masked ? "***%" : "1250%"}</span>
                </div>

                <div className="w-[1px] h-6 bg-border/40"></div>

                <div className="flex flex-col gap-1 pl-4 items-end">
                    <span className="text-[9px] font-bold text-text-muted/50 tracking-[0.1em] uppercase flex items-center gap-1">
                        Unrealized P&L
                    </span>
                    <span className="font-mono text-[13px] font-bold text-brand tabular-nums">{masked ? "+$**.**" : "+$142.86"}</span>
                </div>
            </div>
        </div>
    );
}
