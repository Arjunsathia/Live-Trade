import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Monitor, ListOrdered, Clock, History,
    TrendingUp, TrendingDown, X, ArrowUpRight, ArrowDownRight,
    BarChart2, Globe, ExternalLink,
} from 'lucide-react';

/* ── Static Data ─────────────────────────────────────────── */
const POSITIONS = [
    { symbol: 'BTC / USDT', entry: '42,500.00', current: '43,892.12', pnl: '+$1,392.12', up: true  },
    { symbol: 'ETH / USDT', entry:  '2,450.00', current:  '2,410.50', pnl:   '-$39.50', up: false },
    { symbol: 'SOL / USDT', entry:     '98.20',  current:   '104.45', pnl:  '+$625.00', up: true  },
];

const ORDERS = [
    { pair: 'AVAX / USDT', amount: '45.0',  side: 'SELL', type: 'LIMIT', price: '42.50' },
    { pair: 'LINK / USDT', amount: '200.0', side: 'BUY',  type: 'LIMIT', price: '18.15' },
];

/* ── Stat Card ───────────────────────────────────────────── */
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

/* ── Quick Action Button ─────────────────────────────────── */
function ActionBtn({ label, sublabel, icon: Icon, onClick, primary }) {
    return (
        <button
            onClick={onClick}
            className={`group flex items-center justify-between p-5 rounded-[8px] border transition-all duration-200 w-full cursor-pointer text-left active:scale-[0.98] ${
                primary
                    ? 'bg-primary/10 border-primary/30 hover:bg-primary hover:border-primary'
                    : 'bg-surface-elevated border-border hover:bg-surface-bright/60 hover:border-border'
            }`}
        >
            <div className="flex flex-col gap-0.5">
                <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${
                    primary ? 'text-primary/70 group-hover:text-bg/70' : 'text-text-muted'
                }`}>
                    {sublabel}
                </span>
                <span className={`font-bold text-sm font-heading tracking-tight transition-colors ${
                    primary ? 'text-primary group-hover:text-bg' : 'text-text group-hover:text-primary'
                }`}>
                    {label}
                </span>
            </div>
            <Icon
                size={20}
                strokeWidth={1.5}
                className={`transition-colors shrink-0 ${
                    primary ? 'text-primary group-hover:text-bg' : 'text-text-muted/60 group-hover:text-primary'
                }`}
            />
        </button>
    );
}

/* ── Main Page ───────────────────────────────────────────── */
export function TradeOverviewPage() {
    const navigate = useNavigate();
    const [perfFilter, setPerfFilter] = useState('7D');

    const openTerminal = () => {
        const base = window.location.href.split('#')[0];
        window.open(`${base}#/terminal`, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="w-full flex justify-center pb-8 animate-fade-up">
          <div className="max-w-[1600px] w-full">

            {/* Bento Grid */}
            <div className="grid grid-cols-12 gap-5 w-full">

            {/* ── Stat Cards ───────────────────────────────── */}
            <div className="col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Open Positions"
                    value="12"
                    sub="+2 since session open"
                    subUp={true}
                    icon={BarChart2}
                />
                <StatCard
                    label="Active Orders"
                    value="08"
                    sub="Limit / Stop"
                    icon={Clock}
                />
                <StatCard
                    label="Daily PnL"
                    value="+$1,240.42"
                    sub="4.2% today"
                    subUp={true}
                    accent="text-positive"
                    icon={TrendingUp}
                />
                <StatCard
                    label="Total Equity PnL"
                    value="+$42,891.10"
                    sub="22.8% all-time"
                    subUp={true}
                    accent="text-primary"
                    icon={ArrowUpRight}
                />
            </div>

            {/* ── Quick Actions ─────────────────────────────── */}
            <div className="col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <ActionBtn
                    sublabel="Execution"
                    label="Open Terminal"
                    icon={Monitor}
                    onClick={openTerminal}
                    primary
                />
                <ActionBtn
                    sublabel="Portfolio"
                    label="View Positions"
                    icon={ListOrdered}
                    onClick={() => navigate('/trade/positions')}
                />
                <ActionBtn
                    sublabel="Queue"
                    label="Open Orders"
                    icon={Clock}
                    onClick={() => navigate('/trade/orders')}
                />
                <ActionBtn
                    sublabel="Logs"
                    label="Trade History"
                    icon={History}
                    onClick={() => navigate('/trade/history')}
                />
            </div>

            {/* ── Tables Row ───────────────────────────────── */}
            <div className="col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-5">

                {/* Current Positions */}
                <div className="lg:col-span-7 bg-surface-elevated border border-border rounded-[8px] overflow-hidden flex flex-col">
                    <div className="px-6 py-4 flex justify-between items-center border-b border-border/40">
                        <h2 className="text-[11px] font-black uppercase tracking-[0.15em] text-text">Current Positions</h2>
                        <button
                            onClick={() => navigate('/trade/positions')}
                            className="text-[10px] font-bold text-primary hover:text-primary/70 uppercase tracking-widest transition-colors flex items-center gap-1 cursor-pointer"
                        >
                            View All <ExternalLink size={10} />
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-bg/30">
                                    <th className="px-6 py-3.5 text-[9px] font-black uppercase tracking-[0.18em] text-text-muted/50">Symbol</th>
                                    <th className="px-6 py-3.5 text-[9px] font-black uppercase tracking-[0.18em] text-text-muted/50">Entry</th>
                                    <th className="px-6 py-3.5 text-[9px] font-black uppercase tracking-[0.18em] text-text-muted/50">Current</th>
                                    <th className="px-6 py-3.5 text-[9px] font-black uppercase tracking-[0.18em] text-text-muted/50 text-right">PnL (Unrealized)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/10">
                                {POSITIONS.map((p) => (
                                    <tr key={p.symbol} className="hover:bg-surface-bright/20 transition-colors cursor-pointer group">
                                        <td className="px-6 py-4 font-black text-[13px] text-text group-hover:text-primary transition-colors">{p.symbol}</td>
                                        <td className="px-6 py-4 font-mono text-[12px] text-text-muted/70">{p.entry}</td>
                                        <td className="px-6 py-4 font-mono text-[12px] text-text font-semibold">{p.current}</td>
                                        <td className={`px-6 py-4 font-mono text-[13px] font-black text-right ${p.up ? 'text-positive' : 'text-negative'}`}>
                                            {p.pnl}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Active Orders */}
                <div className="lg:col-span-5 bg-surface-elevated border border-border rounded-[8px] overflow-hidden flex flex-col">
                    <div className="px-6 py-4 flex justify-between items-center border-b border-border/40">
                        <h2 className="text-[11px] font-black uppercase tracking-[0.15em] text-text">Active Orders</h2>
                        <button
                            onClick={() => navigate('/trade/orders')}
                            className="text-[10px] font-bold text-primary hover:text-primary/70 uppercase tracking-widest transition-colors flex items-center gap-1 cursor-pointer"
                        >
                            View All <ExternalLink size={10} />
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-bg/30">
                                    <th className="px-6 py-3.5 text-[9px] font-black uppercase tracking-[0.18em] text-text-muted/50">Pair</th>
                                    <th className="px-6 py-3.5 text-[9px] font-black uppercase tracking-[0.18em] text-text-muted/50">Type</th>
                                    <th className="px-6 py-3.5 text-[9px] font-black uppercase tracking-[0.18em] text-text-muted/50">Price</th>
                                    <th className="px-6 py-3.5 text-[9px] font-black uppercase tracking-[0.18em] text-text-muted/50 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/10">
                                {ORDERS.map((o) => (
                                    <tr key={o.pair} className="hover:bg-surface-bright/20 transition-colors cursor-pointer group">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="font-black text-[13px] text-text group-hover:text-primary transition-colors">{o.pair}</span>
                                                <span className="text-[10px] text-text-muted/50 font-mono">Amt: {o.amount}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                                                o.side === 'SELL'
                                                    ? 'bg-negative/10 text-negative'
                                                    : 'bg-positive/10 text-positive'
                                            }`}>
                                                {o.side} {o.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-[12px] text-text font-semibold">{o.price}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-1.5 rounded-md text-text-muted/40 hover:bg-negative/10 hover:text-negative transition-all cursor-pointer">
                                                <X size={15} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ── Bottom Row: Performance + Market Snapshot ── */}
            <div className="col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-5">

                {/* Equity Performance */}
                <div className="bg-surface-elevated border border-border rounded-[8px] p-6 flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                        <div className="flex flex-col gap-0.5">
                            <h2 className="text-[11px] font-black uppercase tracking-[0.15em] text-text">Equity Performance</h2>
                            <span className="text-[10px] font-bold text-positive uppercase tracking-widest flex items-center gap-1">
                                <ArrowUpRight size={11} strokeWidth={3} />
                                7D Growth: +12.4%
                            </span>
                        </div>
                        <div className="flex gap-1.5">
                            {['7D', '30D', 'ALL'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setPerfFilter(f)}
                                    className={`px-2.5 py-1 text-[9px] font-black rounded transition-all cursor-pointer ${
                                        perfFilter === f
                                            ? 'bg-surface-bright text-text'
                                            : 'text-text-muted/50 hover:bg-surface-bright/50 hover:text-text'
                                    }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Simulated chart area */}
                    <div className="flex-1 min-h-[180px] relative rounded-lg overflow-hidden bg-bg/50 border border-border/20">
                        <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 400 180" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="var(--positive)" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="var(--positive)" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            {/* Area fill */}
                            <path
                                d="M0,160 C40,150 60,140 90,120 C120,100 140,80 180,60 C220,40 250,50 280,40 C310,30 340,20 400,10 L400,180 L0,180 Z"
                                fill="url(#chartGrad)"
                            />
                            {/* Line */}
                            <path
                                d="M0,160 C40,150 60,140 90,120 C120,100 140,80 180,60 C220,40 250,50 280,40 C310,30 340,20 400,10"
                                fill="none"
                                stroke="var(--positive)"
                                strokeWidth="2"
                            />
                            {/* Candle sticks (very subtle) */}
                            {[30, 70, 110, 150, 200, 240, 280, 320, 360].map((x, i) => (
                                <rect
                                    key={i}
                                    x={x - 4}
                                    y={100 + Math.sin(i * 0.9) * 30}
                                    width="8"
                                    height={Math.abs(Math.cos(i * 0.7) * 25) + 5}
                                    rx="1"
                                    fill={i % 2 === 0 ? 'var(--positive)' : 'var(--negative)'}
                                    opacity="0.5"
                                />
                            ))}
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-surface-elevated/60 via-transparent to-transparent pointer-events-none">
                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-text-muted/30">Market Trend Overlay</span>
                        </div>
                    </div>
                </div>

                {/* Market Snapshot — glassmorphism card */}
                <div className="glass-order-panel border border-border rounded-[8px] p-8 flex flex-col justify-between">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                                    <Globe size={14} className="text-primary" />
                                </div>
                                <h3 className="font-black text-[18px] tracking-tight text-text">EUR / USD</h3>
                            </div>
                            <span className="text-[9px] font-bold text-text-muted/50 uppercase tracking-[0.2em] pl-9">Global Spot Market</span>
                        </div>
                        <div className="text-right flex flex-col items-end gap-1">
                            <span className="text-[32px] font-black tracking-tight text-text leading-none font-heading">1.0942</span>
                            <div className="flex items-center gap-1 text-negative">
                                <ArrowDownRight size={13} strokeWidth={2.5} />
                                <span className="text-[12px] font-black">-0.14%</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/20 mt-6">
                        {[
                            { label: '24H High', value: '1.1012' },
                            { label: '24H Low',  value: '1.0895' },
                            { label: '24H Vol',  value: '1.2B' },
                        ].map(s => (
                            <div key={s.label} className="flex flex-col gap-1">
                                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-text-muted/40">{s.label}</span>
                                <span className="font-mono text-[13px] font-bold text-text">{s.value}</span>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <button
                        onClick={() => navigate('/trade/spot')}
                        className="mt-6 w-full py-3 bg-surface-bright/60 hover:bg-primary hover:text-bg text-primary border border-border/30 hover:border-primary font-black text-[10px] uppercase tracking-[0.2em] rounded-[8px] transition-all duration-200 active:scale-[0.98] cursor-pointer"
                    >
                        Analyze Full Pair Data
                    </button>
                </div>
            </div>
            </div>
          </div>
        </div>
    );
}
