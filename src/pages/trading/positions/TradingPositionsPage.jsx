import { useState } from 'react';
import { 
    X, DownloadCloud, TrendingUp, TrendingDown, Layers, Wallet, 
    AlertTriangle, Info, ArrowUpRight, ArrowDownRight, Globe, Filter,
    Activity, Shield
} from 'lucide-react';

/* ── Mock data ─────────────────────────────────────────────────── */
const POSITIONS = [
    { id: 1, symbol: 'EUR / USD', sub: 'Spot',      side: 'long',  entry: '1.0821',  mark: '1.0845',  size: '1.250',  sizeUnit: 'EUR', lev: '1x',  liq: '0.9800',  pnl: '+$931.25',   pnlPct: '+1.77%', up: true  },
    { id: 2, symbol: 'GBP / USD', sub: 'Margin',    side: 'short', entry: '1.2680',  mark: '1.2512',  size: '2.000',  sizeUnit: 'GBP', lev: '5x',  liq: '1.3100',  pnl: '+$416.25',   pnlPct: '+1.09%', up: true  },
    { id: 3, symbol: 'BTC / USD', sub: 'Perpetual', side: 'long',  entry: '68,450',  mark: '68,210',  size: '0.500',  sizeUnit: 'BTC', lev: '10x', liq: '58,200',  pnl: '-$2,165.00', pnlPct: '-3.85%', up: false },
    { id: 4, symbol: 'USD / JPY', sub: 'Futures',   side: 'short', entry: '151.420', mark: '151.240', size: '100.00', sizeUnit: 'USD', lev: '20x', liq: '153.500', pnl: '+$119.20',   pnlPct: '+0.80%', up: true  },
];

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

const SidePill = ({ side }) => {
    const isLong = side === 'long';
    return (
        <span className={`text-[9px] font-black px-2 py-0.5 rounded tracking-[0.1em] uppercase border ${
            isLong ? 'text-positive bg-positive/10 border-positive/20' : 'text-negative bg-negative/10 border-negative/20'
        }`}>{isLong ? 'LONG' : 'SHORT'}</span>
    );
};

/* ── Main Component ────────────────────────────────────────────── */
export function TradingPositionsPage() {
    const [filter, setFilter] = useState('all');

    const filtered = POSITIONS.filter(p => filter === 'all' || p.side === filter);
    const totalPnl = POSITIONS.reduce((a, p) => a + parseFloat(p.pnl.replace(/[^0-9.-]/g, '')), 0);
    const isProfit = totalPnl >= 0;

    return (
        <div className="w-full grid grid-cols-12 gap-5 pb-8 animate-fade-up">

            {/* ── Stat Cards ──────────────────────────────────────── */}
            <div className="col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard
                    label="Unrealized PnL"
                    value={`${isProfit ? '+' : ''}$${Math.abs(totalPnl).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                    sub="+12.4% vs last session"
                    subUp={isProfit}
                    icon={Wallet}
                    accent={isProfit ? 'text-positive shadow-[0_0_15px_rgba(34,197,94,0.05)]' : 'text-negative'}
                />
                <StatCard
                    label="Margin Engaged"
                    value="$28,500.00"
                    sub="Max Leverage: 20x"
                    icon={Layers}
                />
                <StatCard
                    label="Active Contracts"
                    value={POSITIONS.length.toString()}
                    sub="87% Utilization"
                    subUp={true}
                    icon={Activity}
                />
                <StatCard
                    label="Safety Margin"
                    value="42.8%"
                    sub="Low risk level"
                    subUp={true}
                    icon={Shield}
                    accent="text-primary"
                />
            </div>

            {/* ── Active Portfolio Table ───────────────────────────── */}
            <div className="col-span-12 bg-surface-elevated rounded-[8px] border border-border shadow-sm overflow-hidden flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border/20 bg-bg/20">
                    <div className="flex items-center gap-4">
                        <span className="text-[11px] uppercase tracking-[0.2em] text-text-muted/60 font-black">Active Portfolio</span>
                        <div className="flex p-[2px] bg-bg border border-border/30 rounded-[8px]">
                            {[['all','All'],['long','Long'],['short','Short']].map(([id, label]) => (
                                <button key={id} onClick={() => setFilter(id)}
                                    className={`px-3 py-1 rounded-[6px] text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                                        filter === id ? 'bg-primary/20 text-primary shadow-sm' : 'text-text-muted/50 hover:text-primary hover:bg-surface-bright/50'
                                    }`}>{label}</button>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="h-9 px-4 bg-bg border border-border/30 rounded-[8px] text-[11px] font-black uppercase tracking-widest text-text-muted hover:text-primary hover:border-primary/40 transition-all cursor-pointer shadow-sm active:scale-95 flex items-center gap-2">
                            <DownloadCloud size={14} /> Export
                        </button>
                        <button className="h-9 px-4 bg-negative/5 border border-negative/30 rounded-[8px] text-[11px] font-black uppercase tracking-widest text-negative hover:bg-negative/15 transition-all cursor-pointer shadow-sm active:scale-95 flex items-center gap-2">
                            <X size={14} strokeWidth={3} /> Close All
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead>
                            <tr className="border-b border-border/10 bg-bg/10">
                                {[
                                    { label: 'Symbol',       right: false },
                                    { label: 'Side',         right: false },
                                    { label: 'Entry Price',  right: true  },
                                    { label: 'Mark Price',   right: true  },
                                    { label: 'Size',         right: true  },
                                    { label: 'Lev',          right: true  },
                                    { label: 'Liq. Price',   right: true  },
                                    { label: 'Unrealized PnL',right: true },
                                    { label: 'Action',       right: false },
                                ].map((h, i) => (
                                    <th key={h.label} className={`px-6 py-3 text-[9px] font-black uppercase tracking-[0.18em] text-text-muted/40 ${h.right ? 'text-right' : ''}`}>
                                        {h.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/10">
                            {filtered.map(p => (
                                <tr key={p.id} className="hover:bg-surface-bright/20 transition-colors group cursor-pointer">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black border shadow-sm ${
                                                p.side === 'long' ? 'bg-positive/10 border-positive/30 text-positive' : 'bg-negative/10 border-negative/30 text-negative'
                                            }`}>{p.symbol.split(' / ')[0][0]}</div>
                                            <div>
                                                <div className="font-black text-[13px] text-text group-hover:text-primary transition-colors">{p.symbol}</div>
                                                <div className="text-[9px] text-text-muted font-black uppercase tracking-[0.15em] opacity-40">{p.sub}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4"><SidePill side={p.side} /></td>
                                    <td className="px-6 py-4 text-right font-mono text-[12px] text-text-muted/70">{p.entry}</td>
                                    <td className="px-6 py-4 text-right font-mono font-black text-[12px] text-text">{p.mark}</td>
                                    <td className="px-6 py-4 text-right font-mono text-[12px] text-text">
                                        {p.size} <span className="text-text-muted/40 text-[9px] font-black">{p.sizeUnit}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-bg text-text-muted/70 border border-border/30">{p.lev}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono font-black text-[12px] text-negative/70">{p.liq}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className={`font-mono font-black text-[13px] ${p.up ? 'text-positive' : 'text-negative'}`}>{p.pnl}</div>
                                        <div className={`text-[10px] font-black uppercase tracking-widest ${p.up ? 'text-positive/40' : 'text-negative/40'}`}>{p.pnlPct}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="h-8 px-4 bg-bg border border-border/30 text-text font-black rounded-[8px] hover:bg-negative hover:text-bg hover:border-negative transition-all text-[10px] uppercase tracking-widest cursor-pointer active:scale-95 shadow-sm">
                                            Close
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Bottom Row: Margin Analysis + Risk Exposure ──────────── */}
            <div className="col-span-12 lg:col-span-6 bg-surface-elevated p-6 rounded-[8px] border border-border shadow-sm flex flex-col gap-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Activity size={16} className="text-primary" />
                        <span className="text-[11px] uppercase tracking-[0.2em] text-text-muted font-black">Margin Analysis</span>
                    </div>
                    <Info size={14} className="text-text-muted/30" />
                </div>
                <div className="flex flex-col gap-4">
                    {[
                        { label: 'Maintenance Margin', value: '$2,410.00',               cls: 'text-text/70' },
                        { label: 'Unrealized PnL',     value: `${isProfit?'+':'-'}$${Math.abs(totalPnl).toFixed(2)}`, cls: isProfit ? 'text-positive font-black' : 'text-negative font-black' },
                        { label: 'Portfolio Equity',   value: '$42,850.50',              cls: 'text-text font-black text-[14px]' },
                    ].map(r => (
                        <div key={r.label} className="flex items-center justify-between py-1 border-b border-border/10">
                            <span className="text-[12px] text-text-muted/70 font-bold uppercase tracking-tight">{r.label}</span>
                            <span className={`font-mono text-[13px] ${r.cls}`}>{r.value}</span>
                        </div>
                    ))}
                    <div className="flex flex-col gap-2 mt-2">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] text-text-muted/50 font-black uppercase tracking-widest">Margin Ratio</span>
                            <span className="font-mono font-black text-[14px] text-positive">5.6%</span>
                        </div>
                        <div className="h-[4px] bg-bg border border-border/20 rounded-full overflow-hidden shadow-inner">
                            <div className="h-full bg-positive rounded-full shadow-[0_0_8px_rgba(34,197,94,0.4)]" style={{ width: '5.6%' }} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-span-12 lg:col-span-6 bg-surface-elevated p-6 rounded-[8px] border border-border shadow-sm flex flex-col gap-5">
                <div className="flex items-center gap-2">
                    <AlertTriangle size={16} className="text-warning/70" />
                    <span className="text-[11px] uppercase tracking-[0.2em] text-text-muted font-black">Risk Exposure</span>
                </div>
                <p className="text-[12px] text-text-muted/60 font-bold leading-relaxed pr-8">
                    Your portfolio concentration is high in EUR-based pairs.
                    Diversifying into <span className="text-text/80">BTC/ETH</span> could reduce risk during volatility.
                </p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    {[
                        { label: 'EUR / USD', pct: 42, color: 'bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.3)]' },
                        { label: 'GBP / USD', pct: 28, color: 'bg-positive shadow-[0_0_8px_rgba(34,197,94,0.3)]' },
                        { label: 'BTC / USD', pct: 20, color: 'bg-negative shadow-[0_0_8px_rgba(239,68,68,0.3)]' },
                        { label: 'USD / JPY', pct: 10, color: 'bg-warning shadow-[0_0_8px_rgba(245,158,11,0.3)]'  },
                    ].map(r => (
                        <div key={r.label} className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">{r.label}</span>
                                <span className="text-[10px] font-black text-text-muted/40">{r.pct}%</span>
                            </div>
                            <div className="h-[4px] bg-bg border border-border/10 rounded-full overflow-hidden">
                                <div className={`h-full ${r.color} rounded-full transition-all duration-1000`} style={{ width: `${r.pct}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
