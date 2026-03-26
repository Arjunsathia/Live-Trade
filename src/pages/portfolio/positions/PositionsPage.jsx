import { useState } from 'react';
import { Layers, X, TrendingUp, TrendingDown, DownloadCloud, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const POSITIONS = [
    { id: 1, symbol: 'EUR/USD', side: 'buy',  lots: '1.00', margin: '1x',  openPrice: '1.0821', current: '1.0845', liq: '1.0600', marginRatio: '8.2%',  pnl: '+$2,400.00', pnlPct: '+2.22%', sl: '1.0780', tp: '1.0900', swap: '-$1.20',  up: true  },
    { id: 2, symbol: 'BTC/USD', side: 'sell', lots: '0.50', margin: '10x', openPrice: '68,450', current: '68,210', liq: '72,000', marginRatio: '14.2%', pnl: '+$120.00',   pnlPct: '+0.35%', sl: '69,000', tp: '66,000', swap: '-$0.50',  up: true  },
    { id: 3, symbol: 'GBP/USD', side: 'buy',  lots: '2.00', margin: '5x',  openPrice: '1.2680', current: '1.2610', liq: '1.2400', marginRatio: '5.9%',  pnl: '-$1,400.00', pnlPct: '-5.51%', sl: '1.2550', tp: '1.2800', swap: '-$2.10',  up: false },
];

const SideBadge = ({ side }) => (
    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded tracking-widest uppercase ${
        side === 'buy' ? 'text-positive bg-positive/10' : 'text-negative bg-negative/10'
    }`}>{side === 'buy' ? 'Long' : 'Short'}</span>
);

const TH = ({ children, right }) => (
    <th className={`px-4 py-2.5 text-[9px] font-black uppercase tracking-[0.18em] text-text-muted/50 whitespace-nowrap ${right ? 'text-right' : ''}`}>
        {children}
    </th>
);

export function PositionsPage() {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('all');

    const filtered = POSITIONS.filter(p => filter === 'all' || p.side === filter);

    const totalPnl   = POSITIONS.reduce((acc, p) => acc + parseFloat(p.pnl.replace(/[^0-9.-]/g,'')), 0);
    const isProfit   = totalPnl >= 0;

    return (
        <div className="flex flex-col gap-4 w-full h-full">

            {/* ── Page Header ────────────────────────────────────── */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-[8px] bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <Layers size={15} className="text-primary" />
                    </div>
                    <div>
                        <h1 className="font-heading font-black text-[16px] tracking-tight text-text leading-none">Open Positions</h1>
                        <p className="text-[10px] text-text-muted/60 font-medium mt-0.5">Live margin & futures positions with real-time P&L</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {/* Total PnL card */}
                    <div className="flex flex-col items-end px-4 py-2 bg-surface-elevated border border-border/40 rounded-[8px]">
                        <span className="text-[8px] font-black uppercase tracking-widest text-text-muted/50">Unrealized P&amp;L</span>
                        <span className={`font-mono font-black text-[15px] ${isProfit ? 'text-positive' : 'text-negative'}`}>
                            {isProfit ? '+' : ''}${Math.abs(totalPnl).toLocaleString('en-US', {minimumFractionDigits:2})}
                        </span>
                    </div>
                    <button
                        onClick={() => navigate('/trade/spot')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-[0.12em] bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all cursor-pointer"
                    >
                        New Trade <ArrowRight size={11} />
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-[0.12em] text-text-muted hover:text-primary hover:bg-primary/10 border border-border/30 transition-all cursor-pointer">
                        <DownloadCloud size={11} /> Export
                    </button>
                </div>
            </div>

            {/* ── Filter ──────────────────────────────────────────── */}
            <div className="flex items-center gap-3">
                <div className="flex p-[2px] bg-bg border border-border/25 rounded-lg">
                    {[['all','All'], ['buy','Long'], ['sell','Short']].map(([id, label]) => (
                        <button
                            key={id}
                            onClick={() => setFilter(id)}
                            className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-[0.12em] transition-all duration-150 cursor-pointer ${
                                filter === id ? 'bg-primary/10 text-primary' : 'text-text-muted hover:text-text hover:bg-surface-bright/30'
                            }`}
                        >{label}</button>
                    ))}
                </div>
                <span className="ml-auto text-[10px] text-text-muted/40 font-black uppercase tracking-widest">{filtered.length} positions</span>
            </div>

            {/* ── Table ───────────────────────────────────────────── */}
            <div className="flex-1 bg-surface-elevated rounded-[8px] border border-border overflow-hidden flex flex-col min-h-0">
                <div className="flex-1 overflow-auto custom-scrollbar min-h-0">
                    {filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-text-muted/30">
                            <TrendingUp size={32} strokeWidth={1} className="mb-3" />
                            <p className="text-[11px] font-black uppercase tracking-[0.3em] mb-1">No Open Positions</p>
                            <p className="text-[10px] font-bold">No live trades running.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left whitespace-nowrap">
                            <thead className="sticky top-0 bg-surface-elevated/95 backdrop-blur z-10 border-b border-border/25">
                                <tr>
                                    <TH>Symbol</TH>
                                    <TH>Side</TH>
                                    <TH right>Lots</TH>
                                    <TH right>Open Price</TH>
                                    <TH right>Current</TH>
                                    <TH right>Liq. Price</TH>
                                    <TH right>Margin %</TH>
                                    <TH right>P&amp;L</TH>
                                    <TH right>S/L</TH>
                                    <TH right>T/P</TH>
                                    <TH right>Swap</TH>
                                    <TH>Action</TH>
                                </tr>
                            </thead>
                            <tbody className="font-mono divide-y divide-border/10">
                                {filtered.map(p => (
                                    <tr key={p.id} className="hover:bg-surface-bright/15 transition-colors group cursor-pointer">
                                        <td className="px-4 py-2.5">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-0.5 h-5 rounded-full ${p.side === 'buy' ? 'bg-positive' : 'bg-negative'}`} />
                                                <span className="font-black text-[12px] text-text group-hover:text-primary transition-colors">
                                                    {p.symbol}
                                                </span>
                                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-surface text-text-muted/60 font-black border border-border/30">
                                                    {p.margin}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-2.5"><SideBadge side={p.side} /></td>
                                        <td className="px-4 py-2.5 text-right text-[11px] font-bold text-text">{p.lots}</td>
                                        <td className="px-4 py-2.5 text-right text-[11px] text-text-muted/70">{p.openPrice}</td>
                                        <td className="px-4 py-2.5 text-right text-[11px] font-bold text-text">{p.current}</td>
                                        <td className="px-4 py-2.5 text-right text-[11px] text-warning/80">{p.liq}</td>
                                        <td className="px-4 py-2.5 text-right text-[11px] text-text-muted/50">{p.marginRatio}</td>
                                        <td className="px-4 py-2.5 text-right">
                                            <div className={`flex items-center justify-end gap-1 text-[11px] font-black ${p.up ? 'text-positive' : 'text-negative'}`}>
                                                {p.up ? <TrendingUp size={11}/> : <TrendingDown size={11}/>}
                                                {p.pnl}
                                            </div>
                                            <span className={`block text-[9px] font-bold text-right ${p.up ? 'text-positive/60' : 'text-negative/60'}`}>{p.pnlPct}</span>
                                        </td>
                                        <td className="px-4 py-2.5 text-right text-[11px] text-negative/70 font-bold">{p.sl}</td>
                                        <td className="px-4 py-2.5 text-right text-[11px] text-positive/70 font-bold">{p.tp}</td>
                                        <td className="px-4 py-2.5 text-right text-[10px] text-text-muted/40">{p.swap}</td>
                                        <td className="px-4 py-2.5">
                                            <button className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border border-border/40 text-text-muted hover:bg-negative/10 hover:text-negative hover:border-negative/30 transition-all active:scale-95 cursor-pointer">
                                                <X size={10} /> Close
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
