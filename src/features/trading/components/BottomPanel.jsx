import { useState } from 'react';
import { DownloadCloud, PlayCircle, Settings2, TrendingUp, TrendingDown, X, Clock, CheckCircle2 } from 'lucide-react';

/* ── Mock data per tab ──────────────────────────────────────────── */
const OPEN_ORDERS = [
    { id: 1, symbol: 'EUR/USD', type: 'Limit',      side: 'buy',  price: '1.0845', amount: '125k', filled: '0.00%', total: '135,562.50', time: '09:42:11' },
    { id: 2, symbol: 'GBP/USD', type: 'Stop Limit', side: 'sell', price: '1.2642', amount: '80k',  filled: '0.00%', total: '101,136.00', time: '10:15:34' },
];

const POSITIONS = [
    { id: 1, symbol: 'EUR/USD', side: 'buy',  lots: '1.00', openPrice: '1.0821', current: '1.0845', pnl: '+$2,400.00', pnlPct: '+2.22%', up: true,  sl: '1.0780', tp: '1.0900', swap: '-$1.20' },
    { id: 2, symbol: 'BTC/USD', side: 'sell', lots: '0.50', openPrice: '68,450', current: '68,210', pnl: '+$120.00',   pnlPct: '+0.35%', up: true,  sl: '69,000', tp: '66,000', swap: '-$0.50' },
];

const HISTORY = [
    { id: 1, symbol: 'USD/JPY', side: 'buy',  type: 'Market', lots: '0.50', openPrice: '150.80', closePrice: '151.24', pnl: '+$220.00', date: '2026-03-25 08:30' },
    { id: 2, symbol: 'GBP/USD', side: 'sell', type: 'Limit',  lots: '1.00', openPrice: '1.2680', closePrice: '1.2642', pnl: '+$380.00', date: '2026-03-24 14:55' },
    { id: 3, symbol: 'EUR/USD', side: 'buy',  type: 'Market', lots: '2.00', openPrice: '1.0800', closePrice: '1.0775', pnl: '-$500.00', date: '2026-03-24 11:12' },
];

const TRADE_HISTORY = [
    { id: 1, symbol: 'EUR/USD', side: 'buy',  type: 'Limit',  price: '1.0845', qty: '125k', fee: '$0.80', time: '09:42:15', status: 'filled' },
    { id: 2, symbol: 'GBP/USD', side: 'sell', type: 'Market', price: '1.2642', qty: '80k',  fee: '$0.52', time: '10:15:40', status: 'filled' },
    { id: 3, symbol: 'USD/JPY', side: 'buy',  type: 'Stop',   price: '151.00', qty: '50k',  fee: '$0.32', time: '08:30:02', status: 'cancelled' },
];

const SideBadge = ({ side }) => (
    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded tracking-widest uppercase ${
        side === 'buy' ? 'text-positive bg-positive/10' : 'text-negative bg-negative/10'
    }`}>
        {side === 'buy' ? 'Buy' : 'Sell'}
    </span>
);

const EmptyState = ({ icon: Icon, label, sub }) => (
    <div className="flex flex-col items-center justify-center text-text-muted/30 py-10">
        <div className="w-12 h-12 rounded-full bg-surface border border-border/40 flex items-center justify-center mb-3">
            <Icon size={22} strokeWidth={1} />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-1">{label}</p>
        <p className="text-[9px] font-bold">{sub}</p>
    </div>
);

/* ── Column header helper ─── */
const TH = ({ children, right }) => (
    <th className={`px-4 py-2.5 text-[9px] font-black uppercase tracking-[0.18em] text-text-muted/50 ${right ? 'text-right' : ''}`}>
        {children}
    </th>
);

export function BottomPanel() {
    const [tab, setTab] = useState('open_orders');

    const TABS = [
        { id: 'open_orders',   label: 'Open Orders',   count: OPEN_ORDERS.length },
        { id: 'positions',     label: 'Positions',     count: POSITIONS.length },
        { id: 'history',       label: 'Order History', count: null },
        { id: 'trade_history', label: 'Trade History', count: null },
    ];

    return (
        <div className="h-full bg-surface-elevated rounded-[8px] flex flex-col overflow-hidden border border-border/50 shadow-sm font-heading">

            {/* ── Tab Bar ──────────────────────────────────────────── */}
            <div className="flex items-center px-4 border-b border-border/30 justify-between shrink-0 h-[48px] bg-bg/20">
                <div className="flex gap-1.5 items-center">
                    {TABS.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-[6px] text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-200 cursor-pointer ${
                                tab === t.id
                                    ? 'bg-primary/20 text-primary shadow-sm'
                                    : 'text-text-muted/40 hover:text-text-muted hover:bg-surface-bright/30'
                            }`}
                        >
                            {t.label}
                            {t.count !== null && (
                                <span className={`text-[9px] font-black px-1.5 rounded-[4px] min-w-[18px] text-center ${
                                    tab === t.id ? 'bg-primary/20 text-primary' : 'bg-bg text-text-muted/20'
                                }`}>
                                    {t.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
                <div className="flex gap-4 text-text-muted/30">
                    <button className="hover:text-primary transition-colors cursor-pointer" title="Settings"><Settings2 size={14} /></button>
                    <button className="hover:text-primary transition-colors cursor-pointer" title="Auto-refresh"><PlayCircle size={14} /></button>
                    <button className="hover:text-primary transition-colors cursor-pointer" title="Export"><DownloadCloud size={14} /></button>
                </div>
            </div>

            {/* ── Content ──────────────────────────────────────────── */}
            <div className="flex-1 overflow-auto custom-scrollbar min-h-0 bg-bg/5">

                {/* ──── Open Orders ──── */}
                {tab === 'open_orders' && (
                    OPEN_ORDERS.length === 0
                        ? <EmptyState icon={Clock} label="No Open Orders" sub="Place an order to get started." />
                        : <table className="w-full text-left whitespace-nowrap">
                            <thead className="sticky top-0 bg-surface-elevated/95 backdrop-blur z-10 border-b border-border/20">
                                <tr>
                                    <TH>Symbol</TH>
                                    <TH>Type</TH>
                                    <TH>Side</TH>
                                    <TH right>Price</TH>
                                    <TH right>Amount</TH>
                                    <TH right>Filled</TH>
                                    <TH right>Total (USD)</TH>
                                    <TH>Time</TH>
                                    <TH>Action</TH>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/5">
                                {OPEN_ORDERS.map(o => (
                                    <tr key={o.id} className="hover:bg-surface-bright/20 transition-all group cursor-pointer items-center">
                                        <td className="px-4 py-3 font-black text-[12px] text-text group-hover:text-primary transition-colors">{o.symbol}</td>
                                        <td className="px-4 py-3 text-text-muted/50 text-[10px] font-black uppercase tracking-widest">{o.type}</td>
                                        <td className="px-4 py-3"><SideBadge side={o.side} /></td>
                                        <td className="px-4 py-3 text-right text-[12px] font-black font-mono text-text">{o.price}</td>
                                        <td className="px-4 py-3 text-right text-[12px] font-mono text-text/80">{o.amount}</td>
                                        <td className="px-4 py-3 text-right text-[11px] font-mono text-text-muted/30 font-black">{o.filled}</td>
                                        <td className="px-4 py-3 text-right text-[12px] font-mono text-text-muted/50 font-black">{o.total}</td>
                                        <td className="px-4 py-3 text-[10px] text-text-muted/20 font-mono italic">{o.time}</td>
                                        <td className="px-4 py-3">
                                            <button className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-[6px] border border-border/20 text-text-muted/40 hover:bg-negative/10 hover:text-negative hover:border-negative/20 transition-all active:scale-95">
                                                <X size={11} /> Cancel
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                )}

                {/* ──── Positions ──── */}
                {tab === 'positions' && (
                    POSITIONS.length === 0
                        ? <EmptyState icon={TrendingUp} label="No Open Positions" sub="No live trades running." />
                        : <table className="w-full text-left whitespace-nowrap">
                            <thead className="sticky top-0 bg-surface-elevated/95 backdrop-blur z-10 border-b border-border/20">
                                <tr>
                                    <TH>Symbol</TH>
                                    <TH>Side</TH>
                                    <TH right>Lots</TH>
                                    <TH right>Open Price</TH>
                                    <TH right>Current</TH>
                                    <TH right>P&amp;L</TH>
                                    <TH right>S/L</TH>
                                    <TH right>T/P</TH>
                                    <TH right>Swap</TH>
                                    <TH>Action</TH>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/5">
                                {POSITIONS.map(p => (
                                    <tr key={p.id} className="hover:bg-surface-bright/20 transition-all group cursor-pointer items-center">
                                        <td className="px-4 py-3 font-black text-[12px] text-text group-hover:text-primary transition-colors">{p.symbol}</td>
                                        <td className="px-4 py-3"><SideBadge side={p.side} /></td>
                                        <td className="px-4 py-3 text-right text-[12px] font-mono font-black text-text">{p.lots}</td>
                                        <td className="px-4 py-3 text-right text-[12px] font-mono text-text-muted/50">{p.openPrice}</td>
                                        <td className="px-4 py-3 text-right text-[12px] font-mono font-black text-text">{p.current}</td>
                                        <td className="px-4 py-3 text-right">
                                            <span className={`flex items-center justify-end gap-1.5 text-[12px] font-black font-mono ${p.up ? 'text-positive' : 'text-negative'}`}>
                                                {p.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                                {p.pnl}
                                            </span>
                                            <span className={`block text-right text-[9px] font-black tracking-widest ${p.up ? 'text-positive/40' : 'text-negative/40'}`}>{p.pnlPct}</span>
                                        </td>
                                        <td className="px-4 py-3 text-right text-[11px] font-mono text-negative/60 font-black">{p.sl}</td>
                                        <td className="px-4 py-3 text-right text-[11px] font-mono text-positive/60 font-black">{p.tp}</td>
                                        <td className="px-4 py-3 text-right text-[10px] font-mono text-text-muted/20">{p.swap}</td>
                                        <td className="px-4 py-3">
                                            <button className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-[6px] border border-border/20 text-text-muted/40 hover:bg-negative/10 hover:text-negative hover:border-negative/20 transition-all active:scale-95">
                                                <X size={11} /> Close
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                )}

                {/* ──── Order History ──── */}
                {tab === 'history' && (
                    HISTORY.length === 0
                        ? <EmptyState icon={Clock} label="No Order History" sub="Completed orders will appear here." />
                        : <table className="w-full text-left whitespace-nowrap">
                            <thead className="sticky top-0 bg-surface-elevated/95 backdrop-blur z-10 border-b border-border/20">
                                <tr>
                                    <TH>Symbol</TH>
                                    <TH>Side</TH>
                                    <TH>Type</TH>
                                    <TH right>Lots</TH>
                                    <TH right>Open Price</TH>
                                    <TH right>Close Price</TH>
                                    <TH right>P&amp;L</TH>
                                    <TH>Date</TH>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/5">
                                {HISTORY.map(h => {
                                    const isProfit = h.pnl.startsWith('+');
                                    return (
                                        <tr key={h.id} className="hover:bg-surface-bright/20 transition-all group cursor-pointer items-center">
                                            <td className="px-4 py-3 font-black text-[12px] text-text group-hover:text-primary transition-colors">{h.symbol}</td>
                                            <td className="px-4 py-3"><SideBadge side={h.side} /></td>
                                            <td className="px-4 py-3 text-text-muted/50 text-[10px] font-black uppercase tracking-widest">{h.type}</td>
                                            <td className="px-4 py-3 text-right text-[12px] font-mono font-black text-text">{h.lots}</td>
                                            <td className="px-4 py-3 text-right text-[12px] font-mono text-text-muted/50">{h.openPrice}</td>
                                            <td className="px-4 py-3 text-right text-[12px] font-mono font-black text-text">{h.closePrice}</td>
                                            <td className={`px-4 py-3 text-right text-[12px] font-black font-mono ${isProfit ? 'text-positive' : 'text-negative'}`}>{h.pnl}</td>
                                            <td className="px-4 py-3 text-[10px] text-text-muted/30 font-mono">{h.date}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                )}

                {/* ──── Trade History ──── */}
                {tab === 'trade_history' && (
                    TRADE_HISTORY.length === 0
                        ? <EmptyState icon={CheckCircle2} label="No Trade History" sub="Executed fills will appear here." />
                        : <table className="w-full text-left whitespace-nowrap">
                            <thead className="sticky top-0 bg-surface-elevated/95 backdrop-blur z-10 border-b border-border/20">
                                <tr>
                                    <TH>Symbol</TH>
                                    <TH>Side</TH>
                                    <TH>Type</TH>
                                    <TH right>Price</TH>
                                    <TH right>Qty</TH>
                                    <TH right>Fee</TH>
                                    <TH>Time</TH>
                                    <TH>Status</TH>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/5">
                                {TRADE_HISTORY.map(t => (
                                    <tr key={t.id} className="hover:bg-surface-bright/20 transition-all group cursor-pointer items-center">
                                        <td className="px-4 py-3 font-black text-[12px] text-text group-hover:text-primary transition-colors">{t.symbol}</td>
                                        <td className="px-4 py-3"><SideBadge side={t.side} /></td>
                                        <td className="px-4 py-3 text-text-muted/50 text-[10px] font-black uppercase tracking-widest">{t.type}</td>
                                        <td className="px-4 py-3 text-right text-[12px] font-mono font-black text-text">{t.price}</td>
                                        <td className="px-4 py-3 text-right text-[12px] font-mono text-text/80">{t.qty}</td>
                                        <td className="px-4 py-3 text-right text-[11px] font-mono text-text-muted/30">{t.fee}</td>
                                        <td className="px-4 py-3 text-[10px] text-text-muted/30 font-mono">{t.time}</td>
                                        <td className="px-4 py-3 text-right">
                                            <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded-[4px] border ${
                                                t.status === 'filled'
                                                    ? 'bg-positive/10 text-positive border-positive/10'
                                                    : 'bg-text-muted/5 text-text-muted/30 border-border/10'
                                            }`}>
                                                {t.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                )}
            </div>
        </div>
    );
}
