import { useState } from 'react';
import { 
    X, RefreshCw, DownloadCloud, ChevronDown, ChevronLeft, ChevronRight, 
    Calendar, TrendingUp, BookOpen, Zap, ArrowUpRight, Globe, Filter,
    Activity, Clock
} from 'lucide-react';

/* ── Mock data ─────────────────────────────────────────────────── */
const ORDERS = [
    { id: 1, datetime: '2026-03-25 14:22:01', symbol: 'EUR / USD', type: 'Limit',      side: 'buy',  price: '1.0845',  amount: '0.150000', filled: 25  },
    { id: 2, datetime: '2026-03-25 13:45:12', symbol: 'GBP / USD', type: 'Limit',      side: 'sell', price: '1.2642',  amount: '2.450000', filled: 0   },
    { id: 3, datetime: '2026-03-25 12:10:55', symbol: 'USD / JPY', type: 'Stop Limit', side: 'buy',  price: '151.200', amount: '100.00000',filled: 90  },
    { id: 4, datetime: '2026-03-24 22:05:30', symbol: 'BTC / USD', type: 'Limit',      side: 'sell', price: '68,420',  amount: '0.050000', filled: 0   },
    { id: 5, datetime: '2026-03-24 18:30:11', symbol: 'ETH / USD', type: 'Market',     side: 'buy',  price: '3,521.00',amount: '1.200000', filled: 100 },
    { id: 6, datetime: '2026-03-24 15:44:02', symbol: 'AUD / USD', type: 'Stop',       side: 'sell', price: '0.6542',  amount: '3.000000', filled: 40  },
];

const PAIRS  = ['All Pairs', 'EUR / USD', 'GBP / USD', 'USD / JPY', 'BTC / USD', 'ETH / USD'];
const TYPES  = ['All Types', 'Limit', 'Market', 'Stop', 'Stop Limit'];
const PAGE_SIZE   = 6;

/* ── Helper Components ─────────────────────────────────────────── */
function StatCard({ label, value, sub, subUp, icon: Icon, accent }) {
    return (
        <div className="bg-surface-elevated p-5 rounded-[8px] border border-border relative overflow-hidden group">
            <div className="flex justify-between items-start mb-2">
                <span className="text-[11px] uppercase tracking-widest text-text-muted font-bold">{label}</span>
                {Icon && <Icon size={18} className="text-text-muted/60" />}
            </div>
            <div className={`text-2xl font-bold tracking-tight font-heading ${accent || 'text-text'}`}>
                {value}
            </div>
            {sub && (
                <div className={`mt-2 flex items-center gap-1 text-[10px] font-bold ${
                    subUp === true ? 'text-positive' : subUp === false ? 'text-negative' : 'text-text-muted font-medium'
                }`}>
                    {subUp === true  && <ArrowUpRight size={12} strokeWidth={3} />}
                    {subUp === false && <TrendingDown size={12} strokeWidth={2.5} />}
                    {sub}
                </div>
            )}
        </div>
    );
}

function Dropdown({ value, onChange, options, label, icon: Icon }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="flex flex-col gap-1.5 flex-1 min-w-[140px]">
            {label && <span className="text-[10px] uppercase tracking-widest text-text-muted/50 font-black">{label}</span>}
            <div className="relative">
                <button 
                    onClick={() => setOpen(v => !v)}
                    className="w-full flex items-center gap-2 px-3 h-10 bg-bg border border-border/30 rounded-[8px] text-[12px] font-bold text-text hover:border-primary/40 transition-all cursor-pointer shadow-sm group"
                >
                    {Icon && <Icon size={14} className="text-text-muted/40 group-hover:text-primary transition-colors" />}
                    <span className="flex-1 text-left truncate">{value}</span>
                    <ChevronDown size={12} className={`text-text-muted/30 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                </button>
                {open && (
                    <>
                        <div className="fixed inset-0 z-[60]" onClick={() => setOpen(false)} />
                        <div className="absolute top-full left-0 w-full mt-1.5 bg-surface-elevated border border-border/50 rounded-[10px] shadow-2xl z-[70] py-1.5 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
                            {options.map(o => (
                                <button key={o} onClick={() => { onChange(o); setOpen(false); }}
                                    className={`w-full text-left px-4 py-2 text-[12px] font-bold transition-colors cursor-pointer ${
                                        o === value ? 'text-primary bg-primary/10' : 'text-text-muted hover:text-primary hover:bg-surface-bright/50'
                                    }`}>{o}</button>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

const SidePill = ({ side }) => (
    <span className={`text-[9px] font-black px-2 py-0.5 rounded tracking-[0.1em] uppercase border ${
        side === 'buy' ? 'text-positive bg-positive/10 border-positive/20' : 'text-negative bg-negative/10 border-negative/20'
    }`}>{side === 'buy' ? 'BUY' : 'SELL'}</span>
);

const FilledBar = ({ pct }) => (
    <div className="flex flex-col gap-1 min-w-[100px]">
        <div className="h-1.5 w-full bg-bg border border-border/20 rounded-full overflow-hidden">
            <div 
                className={`h-full rounded-full transition-all duration-500 ${pct === 100 ? 'bg-positive' : pct > 0 ? 'bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]' : 'bg-border/40'}`}
                style={{ width: `${pct}%` }} 
            />
        </div>
        <div className="flex justify-between items-center px-0.5">
            <span className={`text-[10px] font-black font-mono ${pct === 100 ? 'text-positive' : pct > 0 ? 'text-primary' : 'text-text-muted/40'}`}>
                {pct.toFixed(2)}%
            </span>
            <span className="text-[8px] font-bold text-text-muted/30 uppercase tracking-widest leading-none">Filled</span>
        </div>
    </div>
);

/* ── Main Component ────────────────────────────────────────────── */
export function TradingOrdersPage() {
    const [pair,  setPair]  = useState('All Pairs');
    const [type,  setType]  = useState('All Types');
    const [page,  setPage]  = useState(1);

    const filtered   = ORDERS.filter(o =>
        (pair === 'All Pairs' || o.symbol === pair) &&
        (type === 'All Types' || o.type === type)
    );
    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paged      = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <div className="w-full flex flex-col gap-5 pb-8 animate-fade-up">

            {/* ── Stat Cards ──────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
                <StatCard
                    label="Buying Power"
                    value="$42,500.24"
                    sub="65% Available"
                    subUp={true}
                    icon={Zap}
                    accent="text-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.05)]"
                />
                <StatCard
                    label="Active Orders"
                    value={ORDERS.length.toString()}
                    sub="Limit / Stop"
                    icon={Clock}
                />
                <StatCard
                    label="Total Open Value"
                    value="$18,346.47"
                    sub="Aggregated orders"
                    icon={BookOpen}
                />
                <StatCard
                    label="Market Mood"
                    value="Bullish"
                    sub="+2.4% Vol 24h"
                    subUp={true}
                    icon={TrendingUp}
                    accent="text-positive"
                />
            </div>

            {/* ── Filter Bar ──────────────────────────────────────── */}
            <div className="bg-surface-elevated rounded-[8px] border border-border p-5 flex flex-wrap items-end gap-4 shadow-sm">
                <Dropdown 
                    label="Trading Pair" 
                    value={pair} 
                    onChange={v => { setPair(v); setPage(1); }} 
                    options={PAIRS} 
                    icon={Globe}
                />
                <Dropdown 
                    label="Order Type" 
                    value={type} 
                    onChange={v => { setType(v); setPage(1); }} 
                    options={TYPES} 
                    icon={Filter}
                />
                
                <div className="flex flex-col gap-1.5 flex-1 min-w-[160px]">
                    <span className="text-[10px] uppercase tracking-widest text-text-muted/50 font-black">Date Range</span>
                    <button className="flex items-center gap-2 px-3 h-10 bg-bg border border-border/30 rounded-[8px] text-[12px] font-bold text-text hover:border-primary/40 transition-all cursor-pointer">
                        <Calendar size={14} className="text-text-muted/40" />
                        <span className="flex-1 text-left">Select dates</span>
                    </button>
                </div>

                <div className="flex gap-2">
                    <button onClick={() => setPage(1)} className="w-10 h-10 flex items-center justify-center rounded-[8px] bg-bg border border-border/30 text-text-muted hover:text-primary hover:border-primary/40 transition-all cursor-pointer shadow-sm active:scale-95">
                        <RefreshCw size={14} />
                    </button>
                    <button className="h-10 px-4 flex items-center justify-center gap-2 rounded-[8px] bg-surface border border-border/30 text-[11px] font-black uppercase tracking-widest text-negative hover:bg-negative/10 hover:border-negative/30 transition-all cursor-pointer shadow-sm active:scale-95">
                        <X size={14} strokeWidth={3} />
                        Cancel All
                    </button>
                </div>
            </div>

            {/* ── Table Container ─────────────────────────────────── */}
            <div className="bg-surface-elevated rounded-[8px] border border-border overflow-hidden shadow-sm flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead>
                            <tr className="bg-bg/30 border-b border-border/20">
                                {[
                                    { label: 'Time Created', right: false },
                                    { label: 'Asset Pair',   right: false },
                                    { label: 'Type',         right: false },
                                    { label: 'Side',         right: false },
                                    { label: 'Order Price',  right: true  },
                                    { label: 'Quantity',     right: true  },
                                    { label: 'Execution',    right: true  },
                                ].map(h => (
                                    <th key={h.label} className={`px-6 py-4 text-[9px] font-black uppercase tracking-[0.18em] text-text-muted/50 ${h.right ? 'text-right' : ''}`}>
                                        {h.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/10">
                            {paged.map(o => (
                                <tr key={o.id} className="hover:bg-surface-bright/20 transition-colors group cursor-pointer border-l-2 border-l-transparent hover:border-l-primary">
                                    <td className="px-6 py-4 font-mono text-[11px] text-text-muted/70">{o.datetime}</td>
                                    <td className="px-6 py-4 font-black text-[13px] text-text group-hover:text-primary transition-colors">{o.symbol}</td>
                                    <td className="px-6 py-4 text-[11px] font-bold text-text-muted uppercase tracking-wider">{o.type}</td>
                                    <td className="px-6 py-4"><SidePill side={o.side} /></td>
                                    <td className="px-6 py-4 text-right font-mono font-black text-[12px] text-text">{o.price}</td>
                                    <td className="px-6 py-4 text-right font-mono text-[12px] text-text-muted/80">{o.amount}</td>
                                    <td className="px-6 py-4 flex justify-end"><FilledBar pct={o.filled} /></td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-2 opacity-20">
                                            <Activity size={40} strokeWidth={1} />
                                            <span className="text-sm font-black uppercase tracking-widest text-text">No active orders</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-border/10 bg-bg/10">
                    <span className="text-[10px] font-black uppercase tracking-[0.15em] text-text-muted/40 font-heading">
                        Page {page} of {totalPages || 1} <span className="mx-2 opacity-30">|</span> Total {filtered.length} active orders
                    </span>
                    <div className="flex items-center gap-1.5">
                        <button 
                            onClick={() => setPage(p => Math.max(1, p - 1))} 
                            disabled={page === 1}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-bg border border-border/30 text-text-muted hover:text-primary hover:border-primary/40 disabled:opacity-10 transition-all cursor-pointer shadow-sm"
                        >
                            <ChevronLeft size={14} />
                        </button>
                        
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button 
                                key={i} 
                                onClick={() => setPage(i + 1)}
                                className={`w-8 h-8 flex items-center justify-center rounded-lg text-[11px] font-black transition-all cursor-pointer shadow-sm border ${
                                    page === (i + 1) 
                                        ? 'bg-primary text-bg border-primary shadow-primary/20' 
                                        : 'bg-bg text-text-muted border-border/30 hover:text-primary hover:border-primary/30'
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button 
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                            disabled={page === totalPages || totalPages === 0}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-bg border border-border/30 text-text-muted hover:text-primary hover:border-primary/40 disabled:opacity-10 transition-all cursor-pointer shadow-sm"
                        >
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
