import { useState } from 'react';
import { AlignCenter, X, DownloadCloud, RefreshCw, Search, Clock, Filter } from 'lucide-react';

const OPEN_ORDERS = [
    { id: 1, symbol: 'EUR/USD', type: 'Limit',      side: 'buy',  price: '1.0845', amount: '125k', filled: '0.00%', total: '135,562.50', time: '2026-03-25 09:42', status: 'pending' },
    { id: 2, symbol: 'GBP/USD', type: 'Stop Limit', side: 'sell', price: '1.2642', amount: '80k',  filled: '0.00%', total: '101,136.00', time: '2026-03-25 10:15', status: 'pending' },
    { id: 3, symbol: 'USD/JPY', type: 'Market',     side: 'buy',  price: '151.00', amount: '50k',  filled: '100%', total: '75,500.00',  time: '2026-03-25 11:01', status: 'filled' },
    { id: 4, symbol: 'BTC/USD', type: 'Limit',      side: 'sell', price: '68,500', amount: '0.10', filled: '40.0%', total: '6,850.00',  time: '2026-03-25 11:44', status: 'partial' },
];

const STATUS_STYLE = {
    pending: 'bg-primary/10 text-primary',
    filled:  'bg-positive/10 text-positive',
    partial: 'bg-warning/10 text-warning',
};

const SideBadge = ({ side }) => (
    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded tracking-widest uppercase ${
        side === 'buy' ? 'text-positive bg-positive/10' : 'text-negative bg-negative/10'
    }`}>{side === 'buy' ? 'Buy' : 'Sell'}</span>
);

const TH = ({ children, right, center }) => (
    <th className={`px-4 py-2.5 text-[9px] font-black uppercase tracking-[0.18em] text-text-muted/50 whitespace-nowrap ${right ? 'text-right' : center ? 'text-center' : ''}`}>
        {children}
    </th>
);

export function OpenOrdersPage() {
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');

    const filtered = OPEN_ORDERS.filter(o => {
        const matchesSide   = filter === 'all' || o.side === filter;
        const matchesSearch = o.symbol.toLowerCase().includes(search.toLowerCase());
        return matchesSide && matchesSearch;
    });

    return (
        <div className="flex flex-col gap-4 w-full h-full">

            {/* ── Page Header ────────────────────────────────────── */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-[8px] bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <AlignCenter size={15} className="text-primary" />
                    </div>
                    <div>
                        <h1 className="font-heading font-black text-[16px] tracking-tight text-text leading-none">Open Orders</h1>
                        <p className="text-[10px] text-text-muted/60 font-medium mt-0.5">Active limit, stop, and conditional orders</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-[0.12em] text-text-muted hover:text-text hover:bg-surface-bright/30 border border-border/30 transition-all cursor-pointer">
                        <RefreshCw size={11} /> Refresh
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-[0.12em] text-text-muted hover:text-negative hover:bg-negative/10 border border-border/30 hover:border-negative/30 transition-all cursor-pointer">
                        <X size={11} /> Cancel All
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-[0.12em] text-text-muted hover:text-primary hover:bg-primary/10 border border-border/30 transition-all cursor-pointer">
                        <DownloadCloud size={11} /> Export
                    </button>
                </div>
            </div>

            {/* ── Toolbar ─────────────────────────────────────────── */}
            <div className="flex items-center gap-3 shrink-0">
                {/* Filter pills */}
                <div className="flex p-[2px] bg-bg border border-border/25 rounded-lg">
                    {[['all','All'], ['buy','Buy'], ['sell','Sell']].map(([id, label]) => (
                        <button
                            key={id}
                            onClick={() => setFilter(id)}
                            className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-[0.12em] transition-all duration-150 cursor-pointer ${
                                filter === id ? 'bg-primary/10 text-primary' : 'text-text-muted hover:text-text hover:bg-surface-bright/30'
                            }`}
                        >{label}</button>
                    ))}
                </div>
                {/* Search */}
                <div className="flex items-center gap-2 bg-bg border border-border/30 focus-within:border-primary/40 rounded-lg px-3 h-8 transition-colors w-52">
                    <Search size={12} className="text-text-muted/50 shrink-0" />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search pair..."
                        className="bg-transparent border-none outline-none text-[11px] text-text placeholder:text-text-muted/30 w-full font-body"
                    />
                </div>
                <span className="ml-auto text-[10px] text-text-muted/40 font-black uppercase tracking-widest">{filtered.length} orders</span>
            </div>

            {/* ── Table ───────────────────────────────────────────── */}
            <div className="flex-1 bg-surface-elevated rounded-[8px] border border-border overflow-hidden flex flex-col min-h-0">
                <div className="flex-1 overflow-auto custom-scrollbar min-h-0">
                    {filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-text-muted/30">
                            <Clock size={32} strokeWidth={1} className="mb-3" />
                            <p className="text-[11px] font-black uppercase tracking-[0.3em] mb-1">No Orders Found</p>
                            <p className="text-[10px] font-bold">Place an order to get started.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left whitespace-nowrap">
                            <thead className="sticky top-0 bg-surface-elevated/95 backdrop-blur z-10 border-b border-border/25">
                                <tr>
                                    <TH>Symbol</TH>
                                    <TH>Type</TH>
                                    <TH>Side</TH>
                                    <TH right>Price</TH>
                                    <TH right>Amount</TH>
                                    <TH right>Filled</TH>
                                    <TH right>Total (USD)</TH>
                                    <TH>Time</TH>
                                    <TH center>Status</TH>
                                    <TH center>Action</TH>
                                </tr>
                            </thead>
                            <tbody className="font-mono divide-y divide-border/10">
                                {filtered.map(o => (
                                    <tr key={o.id} className="hover:bg-surface-bright/15 transition-colors group cursor-pointer">
                                        <td className="px-4 py-2.5 font-black text-[12px] text-text group-hover:text-primary transition-colors">{o.symbol}</td>
                                        <td className="px-4 py-2.5 text-[10px] font-bold text-text-muted/70 uppercase">{o.type}</td>
                                        <td className="px-4 py-2.5"><SideBadge side={o.side} /></td>
                                        <td className="px-4 py-2.5 text-right text-[11px] font-bold text-text">{o.price}</td>
                                        <td className="px-4 py-2.5 text-right text-[11px] text-text/80">{o.amount}</td>
                                        <td className="px-4 py-2.5 text-right text-[11px] text-text-muted/50 font-bold">{o.filled}</td>
                                        <td className="px-4 py-2.5 text-right text-[11px] text-text-muted/70 font-bold">{o.total}</td>
                                        <td className="px-4 py-2.5 text-[10px] text-text-muted/40">{o.time}</td>
                                        <td className="px-4 py-2.5 text-center">
                                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${STATUS_STYLE[o.status]}`}>
                                                {o.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2.5 text-center">
                                            {o.status !== 'filled' && (
                                                <button className="flex items-center gap-1 mx-auto text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border border-border/40 text-text-muted hover:bg-negative/10 hover:text-negative hover:border-negative/30 transition-all active:scale-95 cursor-pointer">
                                                    <X size={10} /> Cancel
                                                </button>
                                            )}
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
