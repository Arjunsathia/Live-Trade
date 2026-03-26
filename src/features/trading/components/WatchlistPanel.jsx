import { useState, useEffect } from 'react';
import { Search, Activity, Star } from 'lucide-react';
import { useTicker } from '../hooks/useTicker';

const FILTERS = ['ALL', 'FX', 'CRYPTO'];

export function WatchlistPanel() {
    const ticker = useTicker();
    const [filter, setFilter] = useState('ALL');
    const [search, setSearch] = useState('');
    const [assets, setAssets] = useState([
        { symbol: 'EUR/USD', price: '1.0845', change: '+0.12%', up: true,  favorite: true,  type: 'FX'     },
        { symbol: 'GBP/USD', price: '1.2642', change: '-0.05%', up: false, favorite: true,  type: 'FX'     },
        { symbol: 'USD/JPY', price: '151.24', change: '+0.45%', up: true,  favorite: false, type: 'FX'     },
        { symbol: 'USD/CHF', price: '0.9042', change: '-0.10%', up: false, favorite: false, type: 'FX'     },
        { symbol: 'AUD/USD', price: '0.6542', change: '+0.08%', up: true,  favorite: false, type: 'FX'     },
        { symbol: 'USD/CAD', price: '1.3542', change: '+0.15%', up: true,  favorite: false, type: 'FX'     },
        { symbol: 'BTC/USD', price: '68210.0', change: '+1.45%', up: true,  favorite: false, type: 'CRYPTO' },
        { symbol: 'ETH/USD', price: '3521.0',  change: '-0.88%', up: false, favorite: false, type: 'CRYPTO' },
    ]);

    // Live price update for EUR/USD via ticker hook
    useEffect(() => {
        setAssets(prev => prev.map(a => {
            if (a.symbol === 'EUR/USD') {
                return {
                    ...a,
                    price: ticker.price.toFixed(4),
                    change: (ticker.changePercent >= 0 ? '+' : '') + ticker.changePercent.toFixed(2) + '%',
                    up: ticker.up,
                };
            }
            const fluctuation = (Math.random() - 0.5) * 0.0005;
            const currentPrice = parseFloat(a.price);
            const decimals = a.symbol.includes('JPY') || a.type === 'CRYPTO' ? 2 : 4;
            return { ...a, price: (currentPrice + fluctuation).toFixed(decimals) };
        }));
    }, [ticker.price]);

    const toggleFavorite = (idx) =>
        setAssets(prev => prev.map((a, i) => i === idx ? { ...a, favorite: !a.favorite } : a));

    const filtered = assets.filter(a => {
        const matchesFilter = filter === 'ALL' || a.type === filter;
        const matchesSearch = a.symbol.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="h-full bg-surface-elevated rounded-[8px] flex flex-col overflow-hidden border border-border/50 shadow-sm font-heading">

            {/* Header */}
            <div className="flex items-center justify-between px-4 border-b border-border/30 h-[48px] shrink-0 bg-bg/20">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-text">
                    <Activity size={13} className="text-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.3)]" />
                    Markets
                </div>
                {/* Filter pills */}
                <div className="flex gap-1 bg-bg/40 p-0.5 rounded-[6px] border border-border/20">
                    {FILTERS.map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`text-[9px] font-black px-2.5 py-1 rounded-[4px] cursor-pointer transition-all ${
                                filter === f
                                    ? 'text-primary bg-primary/20 shadow-sm'
                                    : 'text-text-muted/40 hover:text-text-muted'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Search */}
            <div className="px-3 py-2.5 border-b border-border/10 shrink-0 bg-bg/5">
                <div className="flex items-center gap-2 bg-bg rounded-[8px] border border-border/30 focus-within:border-primary/50 transition-all px-3 py-2 shadow-inner">
                    <Search size={13} className="text-text-muted/30 shrink-0" />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search pairs..."
                        className="w-full bg-transparent border-none outline-none text-[12px] text-text placeholder:text-text-muted/20 font-black tracking-tight"
                    />
                </div>
            </div>

            {/* Column headers */}
            <div className="grid grid-cols-[1fr_auto_auto] px-4 py-2 border-b border-border/10 shrink-0 bg-bg/10">
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-text-muted/30">Pair</span>
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-text-muted/30 text-right pr-5">Price</span>
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-text-muted/30 text-right">24h %</span>
            </div>

            {/* Pair list */}
            <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0 divide-y divide-border/5">
                {filtered.map((item, idx) => (
                    <div
                        key={item.symbol}
                        className="grid grid-cols-[1fr_auto_auto] px-4 py-3 hover:bg-surface-bright/20 cursor-pointer transition-all group items-center"
                    >
                        {/* Symbol + star */}
                        <div className="flex items-center gap-2.5 min-w-0">
                            <button
                                onClick={(e) => { e.stopPropagation(); toggleFavorite(idx); }}
                                className="shrink-0 p-1 rounded-full hover:bg-bg/40 transition-colors border-none outline-none bg-transparent cursor-pointer"
                            >
                                <Star
                                    size={10}
                                    className={`transition-all ${item.favorite ? 'text-warning fill-warning' : 'text-text-muted/10 group-hover:text-text-muted/30'}`}
                                />
                            </button>
                            <span className="font-black text-[12px] tracking-tight text-text group-hover:text-primary transition-colors truncate">
                                {item.symbol}
                            </span>
                        </div>
                        {/* Price */}
                        <span className={`font-mono text-[12px] font-black text-right pr-5 transition-colors duration-300 ${item.up ? 'text-positive' : 'text-negative'}`}>
                            {item.price}
                        </span>
                        {/* Change */}
                        <div className="text-right">
                            <span className={`font-mono text-[10px] font-black px-2 py-0.5 rounded-[4px] border ${
                                item.up 
                                    ? 'text-positive bg-positive/10 border-positive/20' 
                                    : 'text-negative bg-negative/10 border-negative/20'
                            }`}>
                                {item.change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
