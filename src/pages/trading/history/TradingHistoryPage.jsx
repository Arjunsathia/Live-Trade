import { useState } from 'react';
import { 
    DownloadCloud, ChevronDown, ChevronLeft, ChevronRight, RefreshCw, 
    Calendar, TrendingUp, TrendingDown, BarChart2, CheckCircle2,
    ArrowUpRight, Globe, Filter
} from 'lucide-react';

/* ── Mock data ─────────────────────────────────────────────────── */
const HISTORY = [
    { id: 1, datetime: '2026-03-25 14:22:10', symbol: 'EUR / USD', type: 'Limit',  side: 'buy',  entry: '1.0800', exit: '1.0845',  amount: '1.250', pnl: '+$562.50',  up: true  },
    { id: 2, datetime: '2026-03-25 12:05:44', symbol: 'GBP / USD', type: 'Market', side: 'sell', entry: '1.2680', exit: '1.2612',  amount: '2.000', pnl: '-$136.00',  up: false },
    { id: 3, datetime: '2026-03-24 09:12:01', symbol: 'USD / JPY', type: 'Limit',  side: 'buy',  entry: '150.80', exit: '151.24',  amount: '0.500', pnl: '+$145.67',  up: true  },
    { id: 4, datetime: '2026-03-23 21:44:19', symbol: 'BTC / USD', type: 'Limit',  side: 'buy',  entry: '67,890', exit: '68,450', amount: '0.100', pnl: '+$56.00',   up: true  },
    { id: 5, datetime: '2026-03-23 18:30:11', symbol: 'ETH / USD', type: 'Limit',  side: 'sell', entry: '3,580',  exit: '3,521',  amount: '1.200', pnl: '-$70.80',   up: false },
    { id: 6, datetime: '2026-03-22 14:20:05', symbol: 'AUD / USD', type: 'Stop',   side: 'sell', entry: '0.6580', exit: '0.6542', amount: '3.000', pnl: '+$114.00',  up: true  },
    { id: 7, datetime: '2026-03-22 10:11:33', symbol: 'EUR / USD', type: 'Market', side: 'buy',  entry: '1.0760', exit: '1.0793', amount: '2.000', pnl: '+$660.00',  up: true  },
    { id: 8, datetime: '2026-03-21 16:45:00', symbol: 'GBP / USD', type: 'Limit',  side: 'buy',  entry: '1.2550', exit: '1.2490', amount: '1.000', pnl: '-$600.00',  up: false },
];

const PAIRS       = ['All Pairs', 'EUR / USD', 'GBP / USD', 'USD / JPY', 'BTC / USD', 'ETH / USD', 'AUD / USD'];
const TRADE_TYPES = ['Limit & Market', 'Limit', 'Market', 'Stop', 'Stop Limit'];
const PAGE_SIZE   = 8;

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

/* ── Main Component ────────────────────────────────────────────── */
export function TradingHistoryPage() {
    const [pair,      setPair]      = useState('All Pairs');
    const [tradeType, setTradeType] = useState('Limit & Market');
    const [page,      setPage]      = useState(1);

    const filtered   = HISTORY.filter(h =>
        (pair === 'All Pairs' || h.symbol === pair) &&
        (tradeType === 'Limit & Market' || h.type === tradeType)
    );
    
    const totalPnl  = HISTORY.reduce((a, h) => a + parseFloat(h.pnl.replace(/[^0-9.-]/g, '')), 0);
    const winCount  = HISTORY.filter(h => h.up).length;
    const winRate   = ((winCount / HISTORY.length) * 100).toFixed(1);
    const isProfit  = totalPnl >= 0;

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paged      = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <div className="w-full flex flex-col gap-5 pb-8 animate-fade-up">

            {/* ── Stat Cards ──────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
                <StatCard
                    label="Win Rate"
                    value={`${winRate}%`}
                    sub="+2.4% from last week"
                    subUp={true}
                    icon={CheckCircle2}
                    accent="text-positive"
                />
                <StatCard
                    label="Total Net PnL"
                    value={`${isProfit ? '+' : ''}$${Math.abs(totalPnl).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                    sub="All-time record high"
                    subUp={isProfit}
                    icon={TrendingUp}
                    accent={isProfit ? 'text-positive shadow-[0_0_15px_rgba(34,197,94,0.1)]' : 'text-negative'}
                />
                <StatCard
                    label="Volume (24h)"
                    value="$1.24M"
                    sub={`Across ${HISTORY.length} trades`}
                    icon={BarChart2}
                />
                <StatCard
                    label="Efficiency"
                    value="94.2%"
                    sub="Optimized entry points"
                    subUp={true}
                    icon={TrendingUp}
                    accent="text-primary"
                />
            </div>

            {/* ── Filter & Search Bar ─────────────────────────────── */}
            <div className="bg-surface-elevated rounded-[8px] border border-border p-5 flex flex-wrap items-end gap-4 shadow-sm">
                <Dropdown 
                    label="Trading Pair" 
                    value={pair} 
                    onChange={v => { setPair(v); setPage(1); }} 
                    options={PAIRS} 
                    icon={Globe}
                />
                <Dropdown 
                    label="Trade Type" 
                    value={tradeType} 
                    onChange={v => { setTradeType(v); setPage(1); }} 
                    options={TRADE_TYPES} 
                    icon={Filter}
                />
                
                <div className="flex flex-col gap-1.5 flex-1 min-w-[160px]">
                    <span className="text-[10px] uppercase tracking-widest text-text-muted/50 font-black">Date Range</span>
                    <button className="flex items-center gap-2 px-3 h-10 bg-bg border border-border/30 rounded-[8px] text-[12px] font-bold text-text hover:border-primary/40 transition-all cursor-pointer">
                        <Calendar size={14} className="text-text-muted/40" />
                        <span className="flex-1 text-left">Last 30 Days</span>
                    </button>
                </div>

                <div className="flex gap-2">
                    <button onClick={() => setPage(1)} className="w-10 h-10 flex items-center justify-center rounded-[8px] bg-bg border border-border/30 text-text-muted hover:text-primary hover:border-primary/40 transition-all cursor-pointer shadow-sm active:scale-95">
                        <RefreshCw size={14} />
                    </button>
                    <button className="h-10 px-4 flex items-center justify-center gap-2 rounded-[8px] bg-bg border border-border/30 text-[12px] font-black uppercase tracking-widest text-text-muted hover:text-primary hover:border-primary/40 transition-all cursor-pointer shadow-sm active:scale-95">
                        <DownloadCloud size={14} />
                        Export
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
                                    { label: 'Date/Time',    right: false },
                                    { label: 'Symbol',       right: false },
                                    { label: 'Type',         right: false },
                                    { label: 'Side',         right: false },
                                    { label: 'Entry Price',  right: true  },
                                    { label: 'Exit Price',   right: true  },
                                    { label: 'Amount',       right: true  },
                                    { label: 'PnL Status',   right: true  },
                                ].map(h => (
                                    <th key={h.label} className={`px-6 py-4 text-[9px] font-black uppercase tracking-[0.18em] text-text-muted/50 ${h.right ? 'text-right' : ''}`}>
                                        {h.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/10">
                            {paged.map(h => (
                                <tr key={h.id} className="hover:bg-surface-bright/20 transition-colors group cursor-pointer border-l-2 border-l-transparent hover:border-l-primary">
                                    <td className="px-6 py-4 font-mono text-[11px] text-text-muted/70">{h.datetime}</td>
                                    <td className="px-6 py-4 font-black text-[13px] text-text group-hover:text-primary transition-colors">{h.symbol}</td>
                                    <td className="px-6 py-4 text-[11px] font-bold text-text-muted uppercase tracking-wider">{h.type}</td>
                                    <td className="px-6 py-4"><SidePill side={h.side} /></td>
                                    <td className="px-6 py-4 text-right font-mono text-[12px] text-text-muted">{h.entry}</td>
                                    <td className="px-6 py-4 text-right font-mono font-bold text-[12px] text-text">{h.exit}</td>
                                    <td className="px-6 py-4 text-right font-mono text-[12px] text-text-muted/80">{h.amount}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className={`flex items-center justify-end gap-1.5 font-mono font-black text-[13px] ${h.up ? 'text-positive' : 'text-negative'}`}>
                                            {h.up ? <TrendingUp size={12} strokeWidth={3} /> : <TrendingDown size={12} strokeWidth={3} />}
                                            {h.pnl}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-2 opacity-20">
                                            <History size={40} strokeWidth={1} />
                                            <span className="text-sm font-black uppercase tracking-widest text-text">No trades found</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Wrapper */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-border/10 bg-bg/10">
                    <span className="text-[10px] font-black uppercase tracking-[0.15em] text-text-muted/40 font-heading">
                        Page {page} of {totalPages || 1} <span className="mx-2 opacity-30">|</span> Showing {filtered.length} entries
                    </span>
                    <div className="flex items-center gap-1.5">
                        <button 
                            onClick={() => setPage(p => Math.max(1, p - 1))} 
                            disabled={page === 1}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-bg border border-border/30 text-text-muted hover:text-primary hover:border-primary/40 disabled:opacity-10 transition-all cursor-pointer shadow-sm"
                        >
                            <ChevronLeft size={14} />
                        </button>
                        
                        {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => (
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
