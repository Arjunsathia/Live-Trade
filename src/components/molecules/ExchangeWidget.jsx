import { useState } from 'react';

const LtcMini = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#A0A0A0">
        <circle cx="12" cy="12" r="10" />
        <text x="12" y="17" textAnchor="middle" fontSize="11" fill="#fff" fontWeight="700">Ł</text>
    </svg>
);

const BtcMini = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#F7931A">
        <circle cx="12" cy="12" r="10" />
        <text x="12" y="17" textAnchor="middle" fontSize="11" fill="#fff" fontWeight="700">₿</text>
    </svg>
);

export function ExchangeWidget() {
    const [fromVal, setFromVal] = useState("1.13");
    const [toVal, setToVal] = useState("0.002");

    return (
        <div className="bg-surface-2 rounded-[20px] p-6 border-[0.5px] border-border/50 shadow-soft">
            <h3 className="text-text text-[16px] font-bold tracking-tight m-0 mb-5">Exchange</h3>
            <div className="flex items-center gap-2">
                {/* From */}
                <div className="flex-1 flex items-center gap-2.5 bg-muted-surface rounded-[12px] px-3.5 py-2.5 border-[0.5px] border-transparent focus-within:border-brand-strong/40 focus-within:bg-surface focus-within:shadow-glow transition-all duration-300">
                    <LtcMini />
                    <span className="text-text-muted text-[12px] font-semibold tracking-wide uppercase">LTC/USD</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                    <input
                        value={fromVal}
                        onChange={e => setFromVal(e.target.value)}
                        className="bg-transparent border-none outline-none text-text text-[13px] w-[52px] text-right ml-auto"
                    />
                </div>

                {/* Swap button - Secondary CTA (uses Accent) */}
                <button className="w-9 h-9 rounded-full bg-accent border-none flex items-center justify-center cursor-pointer shrink-0 hover:brightness-110 hover:-translate-y-0.5 transition-all shadow-[0_4px_12px_color-mix(in_srgb,var(--accent)_20%,transparent)] active:translate-y-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0B0E10" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                </button>

                {/* To */}
                <div className="flex-1 flex items-center gap-2.5 bg-muted-surface rounded-[12px] px-3.5 py-2.5 border-[0.5px] border-transparent focus-within:border-brand-strong/40 focus-within:bg-surface focus-within:shadow-glow transition-all duration-300">
                    <BtcMini />
                    <span className="text-text-muted text-[12px] font-semibold tracking-wide uppercase">BTC/USD</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                    <input
                        value={toVal}
                        onChange={e => setToVal(e.target.value)}
                        className="bg-transparent border-none outline-none text-text text-[13px] w-[52px] text-right ml-auto"
                    />
                </div>

                {/* Primary CTA (uses Brand-strong) */}
                <button className="px-7 py-2.5 rounded-[12px] bg-brand-strong border-none text-bg text-[14px] font-bold tracking-tight cursor-pointer hover:brightness-110 hover:-translate-y-0.5 transition-all duration-300 shadow-[0_6px_16px_rgba(83,227,74,0.2)] active:translate-y-0">
                    Swap
                </button>
            </div>
        </div>
    );
}
