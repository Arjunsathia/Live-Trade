import { useState } from 'react';
import { Settings, Info, ChevronUp, ChevronDown } from 'lucide-react';

const ORDER_TABS = ['limit', 'market', 'stop'];

export function OrderPanel({ type = 'spot' }) {
    const [tab, setTab]         = useState('limit');
    const [action, setAction]   = useState('buy');
    const [price, setPrice]     = useState('1.0845');
    const [lots, setLots]       = useState('');
    const [sl, setSl]           = useState('');
    const [tp, setTp]           = useState('');
    const [leverage, setLeverage] = useState(100);

    const setLev = (fn) => setLeverage(fn);

    const isMargin  = type === 'margin';
    const isFutures = type === 'futures';

    const adjustLots = (delta) => {
        const next = Math.max(0.01, parseFloat(lots || 0) + delta);
        setLots(next.toFixed(2));
    };

    const total = lots
        ? (parseFloat(lots || 0) * 100_000 * 1.0845).toLocaleString('en-US', { maximumFractionDigits: 2 })
        : '0.00';

    return (
        <div className="h-full flex flex-col overflow-hidden rounded-[8px] bg-surface-elevated border border-border/50 shadow-sm font-heading">
            {/* ── Order Type Tabs ──────────────── */}
            <div className="shrink-0 flex items-center justify-between px-4 border-b border-border/30 bg-bg/20 h-[48px]">
                <div className="flex gap-1.5 items-center">
                    {ORDER_TABS.map(t => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`px-3 py-1.5 rounded-[6px] text-[10px] font-black uppercase tracking-[0.18em] transition-all duration-200 cursor-pointer ${
                                tab === t
                                    ? 'bg-primary/20 text-primary shadow-[0_0_12px_rgba(var(--primary-rgb),0.1)]'
                                    : 'text-text-muted/50 hover:text-text hover:bg-surface-bright/30'
                            }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
                <Settings size={13} className="text-text-muted/30 cursor-pointer hover:text-primary transition-colors" />
            </div>

            {/* ── Buy / Sell Toggle ─────────────── */}
            <div className="px-4 py-3 shrink-0 bg-bg/10 border-b border-border/20">
                <div className="flex p-[2px] rounded-[8px] border border-border/30 bg-bg shadow-inner">
                    <button
                        onClick={() => setAction('buy')}
                        className={`flex-1 py-2.5 rounded-[6px] transition-all duration-300 cursor-pointer font-black text-[11px] uppercase tracking-[0.15em] flex items-center justify-center gap-1.5 ${
                            action === 'buy'
                                ? 'bg-positive text-bg shadow-[0_4px_15px_rgba(34,197,94,0.3)]'
                                : 'text-text-muted/50 hover:text-positive hover:bg-positive/5'
                        }`}
                    >
                        Buy
                    </button>
                    <button
                        onClick={() => setAction('sell')}
                        className={`flex-1 py-2.5 rounded-[6px] transition-all duration-300 cursor-pointer font-black text-[11px] uppercase tracking-[0.15em] flex items-center justify-center gap-1.5 ${
                            action === 'sell'
                                ? 'bg-negative text-bg shadow-[0_4px_15px_rgba(239,68,68,0.3)]'
                                : 'text-text-muted/50 hover:text-negative hover:bg-negative/5'
                        }`}
                    >
                        Sell
                    </button>
                </div>
            </div>

            {/* ── Form Fields ─────────────────── */}
            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-4 pt-3 space-y-3.5 pb-4">
                
                {/* Available Balance */}
                <div className="flex justify-between items-center py-1 opacity-80 decoration-primary/20 underline underline-offset-4 decoration-dotted">
                    <span className="text-[9px] font-black uppercase tracking-widest text-text-muted/60">Available</span>
                    <span className="font-mono text-[11px] font-black text-text">
                        15,420.50 <span className="text-primary text-[9px] font-black">USD</span>
                    </span>
                </div>

                {/* Price input */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-text-muted/40 pl-0.5">Price</label>
                    <div className="relative flex items-center rounded-[8px] border border-border/30 focus-within:border-primary/50 transition-all overflow-hidden bg-bg shadow-sm">
                        <input
                            type="text"
                            value={tab === 'market' ? 'Market Price' : price}
                            disabled={tab === 'market'}
                            onChange={e => setPrice(e.target.value)}
                            className={`flex-1 bg-transparent border-none outline-none px-3.5 py-2.5 font-mono font-black text-[13px] text-text min-w-0 ${tab === 'market' ? 'opacity-40 select-none' : ''}`}
                        />
                        <span className="px-3.5 text-[10px] font-black text-text-muted/30 uppercase shrink-0 border-l border-border/15 bg-bg/50">USD</span>
                    </div>
                </div>

                {/* Lots input with Stepper */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-text-muted/40 pl-0.5">Amount (Lots)</label>
                    <div className="flex items-center gap-0.5 rounded-[8px] border border-border/30 focus-within:border-primary/50 transition-all overflow-hidden bg-bg shadow-sm">
                        <button 
                            onClick={() => adjustLots(-0.01)}
                            className="w-10 h-10 flex items-center justify-center text-text-muted/40 hover:text-text hover:bg-surface-bright/20 border-r border-border/10 transition-all cursor-pointer font-black text-lg"
                        >−</button>
                        <input
                            type="text"
                            value={lots}
                            onChange={e => setLots(e.target.value)}
                            placeholder="0.10"
                            className="flex-1 bg-transparent border-none outline-none text-center font-mono font-black text-text text-[14px] min-w-0 placeholder:text-text-muted/20"
                        />
                        <button 
                            onClick={() => adjustLots(0.01)}
                            className="w-10 h-10 flex items-center justify-center text-text-muted/40 hover:text-text hover:bg-surface-bright/20 border-l border-border/10 transition-all cursor-pointer font-black text-lg"
                        >+</button>
                    </div>
                </div>

                {/* Lot preset buttons */}
                <div className="grid grid-cols-5 gap-1.5">
                    {['0.01', '0.10', '0.50', '1.00', '5.00'].map(v => (
                        <button
                            key={v}
                            onClick={() => setLots(v)}
                            className={`py-2 rounded-[6px] text-[9px] font-black transition-all cursor-pointer border ${
                                lots === v
                                    ? 'bg-primary/20 text-primary border-primary/40'
                                    : 'bg-bg text-text-muted/40 border-border/20 hover:border-border/40 hover:text-text-muted'
                            }`}
                        >
                            {v}
                        </button>
                    ))}
                </div>

                {/* Leverage (margin / futures only) */}
                {(isMargin || isFutures) && (
                    <div className="flex items-center justify-between py-2 border-y border-border/10">
                        <span className="flex items-center gap-1.5 text-[9px] font-black text-text-muted/40 uppercase tracking-widest">
                            Leverage <Info size={11} className="opacity-30" />
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setLev(l => Math.max(1, l - 100))}
                                className="w-6 h-6 flex items-center justify-center rounded-md text-text-muted/40 hover:text-text hover:bg-surface-bright/30 transition-all cursor-pointer border border-border/30"
                            >
                                <ChevronDown size={12} />
                            </button>
                            <span className="font-mono text-[12px] font-black text-primary px-2.5 py-1 rounded bg-primary/10 border border-primary/20 min-w-[60px] text-center shadow-[inset_0_0_8px_rgba(var(--primary-rgb),0.05)]">
                                1:{leverage}
                            </span>
                            <button
                                onClick={() => setLev(l => Math.min(2000, l + 100))}
                                className="w-6 h-6 flex items-center justify-center rounded-md text-text-muted/40 hover:text-text hover:bg-surface-bright/30 transition-all cursor-pointer border border-border/30"
                            >
                                <ChevronUp size={12} />
                            </button>
                        </div>
                    </div>
                )}

                {/* SL / TP Grid */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-negative/60 pl-0.5">Stop Loss</label>
                        <div className="flex items-center rounded-[8px] border border-border/30 focus-within:border-negative/40 transition-all overflow-hidden bg-bg shadow-sm">
                            <input
                                type="text"
                                value={sl}
                                onChange={e => setSl(e.target.value)}
                                placeholder="0.0000"
                                className="w-full bg-transparent border-none outline-none px-3.5 py-2.5 font-mono font-black text-[12px] text-text placeholder:text-text-muted/15"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-positive/60 pl-0.5">Take Profit</label>
                        <div className="flex items-center rounded-[8px] border border-border/30 focus-within:border-positive/40 transition-all overflow-hidden bg-bg shadow-sm">
                            <input
                                type="text"
                                value={tp}
                                onChange={e => setTp(e.target.value)}
                                placeholder="0.0000"
                                className="w-full bg-transparent border-none outline-none px-3.5 py-2.5 font-mono font-black text-[12px] text-text placeholder:text-text-muted/15"
                            />
                        </div>
                    </div>
                </div>

                {/* Total (computed) */}
                <div className="flex items-center justify-between rounded-[8px] border border-border/20 px-4 py-2.5 bg-bg/40">
                    <span className="text-[9px] font-black uppercase tracking-widest text-text-muted/30">Total Value</span>
                    <span className="font-mono text-[13px] font-black text-text/80">
                        {total} <span className="text-text-muted/40 text-[9px] font-black ml-1">USD</span>
                    </span>
                </div>
            </div>

            {/* ── Submit Button ────────────────── */}
            <div className="px-4 pb-4 pt-2 shrink-0 bg-bg/20 border-t border-border/20">
                <button
                    className={`w-full py-3.5 rounded-[10px] font-black text-[13px] uppercase tracking-[0.2em] transition-all duration-300 active:scale-[0.97] cursor-pointer text-bg shadow-lg ${
                        action === 'buy'
                            ? 'bg-positive hover:shadow-[0_6px_25px_rgba(34,197,94,0.4)]'
                            : 'bg-negative hover:shadow-[0_6px_25px_rgba(239,68,68,0.4)]'
                    }`}
                >
                    {action === 'buy' ? 'Execute Buy' : 'Execute Sell'}
                </button>
            </div>
        </div>
    );
}
