import { useState } from 'react';
import { History, Search, DownloadCloud, TrendingUp, TrendingDown } from 'lucide-react';

const HISTORY = [
    { id: 1, symbol: 'EUR/USD', side: 'buy',  type: 'Market',     lots: '1.00', openPrice: '1.0800', closePrice: '1.0845', pnl: '+$4,500.00', up: true,  date: '2026-03-25 08:30', duration: '4h 20m' },
    { id: 2, symbol: 'GBP/USD', side: 'sell', type: 'Limit',      lots: '2.00', openPrice: '1.2680', closePrice: '1.2600', pnl: '+$1,600.00', up: true,  date: '2026-03-24 14:55', duration: '1h 05m' },
    { id: 3, symbol: 'USD/JPY', side: 'buy',  type: 'Market',     lots: '0.50', openPrice: '150.80', closePrice: '151.24', pnl: '+$146.67',   up: true,  date: '2026-03-24 11:12', duration: '2h 48m' },
    { id: 4, symbol: 'EUR/USD', side: 'buy',  type: 'Stop Limit', lots: '1.50', openPrice: '1.0820', closePrice: '1.0775', pnl: '-$675.00',   up: false, date: '2026-03-23 16:30', duration: '45m' },
    { id: 5, symbol: 'BTC/USD', side: 'sell', type: 'Market',     lots: '0.20', openPrice: '68,450', closePrice: '68,210', pnl: '+$48.00',    up: true,  date: '2026-03-23 10:00', duration: '30m' },
    { id: 6, symbol: 'AUD/USD', side: 'buy',  type: 'Limit',      lots: '3.00', openPrice: '0.6520', closePrice: '0.6480', pnl: '-$1,200.00', up: false, date: '2026-03-22 09:15', duration: '6h 10m' },
];

const SideBadge = ({ side }) => (
    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded tracking-widest uppercase ${
        side === 'buy' ? 'text-positive bg-positive/10' : 'text-negative bg-negative/10'
    }`}>{side === 'buy' ? 'Buy' : 'Sell'}</span>
);

const TH = ({ children, right }) => (
    <th className={`px-4 py-2.5 text-[9px] font-black uppercase tracking-[0.18em] text-text-muted/50 whitespace-nowrap ${right ? 'text-right' : ''}`}>
        {children}
    </th>
);

export function TradeHistoryPage() {
    const [search, setSearch] = useState('');
    const [sideFilter, setSideFilter] = useState('all');

    const filtered = HISTORY.filter(h => {
        const matchesSide   = sideFilter === 'all' || h.side === sideFilter;
        const matchesSearch = h.symbol.toLowerCase().includes(search.toLowerCase());
        return matchesSide && matchesSearch;
    });

    const totalPnl  = HISTORY.reduce((a, h) => a + parseFloat(h.pnl.replace(/[^0-9.-]/g,'')), 0);
    const isProfit  = totalPnl >= 0;
    const winCount  = HISTORY.filter(h => h.up).length;
    const winRate   = Math.round((winCount / HISTORY.length) * 100);

    return (
        <div className="flex flex-col gap-4 w-full h-full">

            {/* ── Page Header ────────────────────────────────────── */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-[8px] bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <History size={15} className="text-primary" />
                    </div>
                    <div>
                        <h1 className="font-heading font-black text-[16px] tracking-tight text-text leading-none">Trade History</h1>
                        <p className="text-[10px] text-text-muted/60 font-medium mt-0.5">Closed positions and completed orders</p>
                    </div>
                </div>

                {/* Summary stats */}
                <div className="flex items-center gap-2">
                    <div className="flex flex-col items-end px-4 py-2 bg-surface-elevated border border-border/40 rounded-[8px]">
                        <span className="text-[8px] font-black uppercase tracking-widest text-text-muted/50">Total P&amp;L</span>
                        <span className={`font-mono font-black text-[15px] ${isProfit ? 'text-positive' : 'text-negative'}`}>
                            {isProfit ? '+' : ''}${Math.abs(totalPnl).toLocaleString('en-US', {minimumFractionDigits:2})}
                        </span>
                    </div>
                    <div className="flex flex-col items-end px-4 py-2 bg-surface-elevated border border-border/40 rounded-[8px]">
                        <span className="text-[8px] font-black uppercase tracking-widest text-text-muted/50">Win Rate</span>
                        <span className="font-mono font-black text-[15px] text-primary">{winRate}%</span>
                    </div>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-[0.12em] text-text-muted hover:text-primary hover:bg-primary/10 border border-border/30 transition-all cursor-pointer">
                        <DownloadCloud size={11} /> Export CSV
                    </button>
                </div>
            </div>

            {/* ── Toolbar ─────────────────────────────────────────── */}
            <div className="flex items-center gap-3">
                <div className="flex p-[2px] bg-bg border border-border/25 rounded-lg">
                    {[['all','All'], ['buy','Buy'], ['sell','Sell']].map(([id, label]) => (
                        <button
                            key={id}
                            onClick={() => setSideFilter(id)}
                            className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-[0.12em] transition-all duration-150 cursor-pointer ${
                                sideFilter === id ? 'bg-primary/10 text-primary' : 'text-text-muted hover:text-text hover:bg-surface-bright/30'
                            }`}
                        >{label}</button>
                    ))}
                </div>
                <div className="flex items-center gap-2 bg-bg border border-border/30 focus-within:border-primary/40 rounded-lg px-3 h-8 transition-colors w-52">
                    <Search size={12} className="text-text-muted/50 shrink-0" />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search pair..."
                        className="bg-transparent border-none outline-none text-[11px] text-text placeholder:text-text-muted/30 w-full font-body"
                    />
                </div>
                <span className="ml-auto text-[10px] text-text-muted/40 font-black uppercase tracking-widest">{filtered.length} trades</span>
            </div>

            {/* ── Table ───────────────────────────────────────────── */}
            <div className="flex-1 bg-surface-elevated rounded-[8px] border border-border overflow-hidden flex flex-col min-h-0">
                <div className="flex-1 overflow-auto custom-scrollbar min-h-0">
                    {filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-text-muted/30">
                            <History size={32} strokeWidth={1} className="mb-3" />
                            <p className="text-[11px] font-black uppercase tracking-[0.3em] mb-1">No History Found</p>
                            <p className="text-[10px] font-bold">Closed trades will appear here.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left whitespace-nowrap">
                            <thead className="sticky top-0 bg-surface-elevated/95 backdrop-blur z-10 border-b border-border/25">
                                <tr>
                                    <TH>Symbol</TH>
                                    <TH>Side</TH>
                                    <TH>Type</TH>
                                    <TH right>Lots</TH>
                                    <TH right>Open Price</TH>
                                    <TH right>Close Price</TH>
                                    <TH right>P&amp;L</TH>
                                    <TH>Duration</TH>
                                    <TH>Date / Time</TH>
                                </tr>
                            </thead>
                            <tbody className="font-mono divide-y divide-border/10">
                                {filtered.map(h => (
                                    <tr key={h.id} className="hover:bg-surface-bright/15 transition-colors group cursor-pointer">
                                        <td className="px-4 py-2.5 font-black text-[12px] text-text group-hover:text-primary transition-colors">{h.symbol}</td>
                                        <td className="px-4 py-2.5"><SideBadge side={h.side} /></td>
                                        <td className="px-4 py-2.5 text-[10px] font-bold text-text-muted/70 uppercase">{h.type}</td>
                                        <td className="px-4 py-2.5 text-right text-[11px] font-bold text-text">{h.lots}</td>
                                        <td className="px-4 py-2.5 text-right text-[11px] text-text-muted/70">{h.openPrice}</td>
                                        <td className="px-4 py-2.5 text-right text-[11px] font-bold text-text">{h.closePrice}</td>
                                        <td className="px-4 py-2.5 text-right">
                                            <div className={`flex items-center justify-end gap-1 text-[11px] font-black ${h.up ? 'text-positive' : 'text-negative'}`}>
                                                {h.up ? <TrendingUp size={11}/> : <TrendingDown size={11}/>}
                                                {h.pnl}
                                            </div>
                                        </td>
                                        <td className="px-4 py-2.5 text-[10px] text-text-muted/40">{h.duration}</td>
                                        <td className="px-4 py-2.5 text-[10px] text-text-muted/40">{h.date}</td>
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
