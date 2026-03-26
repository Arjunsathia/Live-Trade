import { Activity, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function WatchlistPage() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col gap-6 max-w-[1400px] mx-auto w-full">
            <header>
                <h1 className="text-2xl font-heading font-bold flex items-center gap-3 text-text">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-glow-primary">
                        <Activity className="text-primary" size={20} strokeWidth={2.5} />
                    </div>
                    Market Watchlist
                </h1>
                <p className="text-text-muted text-sm mt-2 max-w-xl">Deep analytics and real-time tracking across your entire portfolio spectrum.</p>
            </header>
            
            <div className="bg-surface-2 rounded-[20px] border border-border p-5 glass-panel min-h-[600px] flex flex-col shadow-xl">
                <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                    <div className="flex gap-1 bg-surface-elevated p-1 rounded-xl text-[13px] font-bold shadow-inner">
                        <button className="px-5 py-2 rounded-lg bg-primary text-bg shadow-sm">All Markets</button>
                        <button className="px-5 py-2 rounded-lg text-text-muted hover:text-text hover:bg-surface-bright/50 transition-colors">Crypto</button>
                        <button className="px-5 py-2 rounded-lg text-text-muted hover:text-text hover:bg-surface-bright/50 transition-colors">Forex</button>
                    </div>
                    
                    <div className="flex gap-3">
                        <div className="flex items-center bg-bg rounded-xl px-3 py-2 border border-border focus-within:border-primary/50 transition-all focus-within:shadow-[0_0_12px_rgba(173,198,255,0.1)] w-64">
                            <Search size={16} className="text-text-muted mr-2" />
                            <input className="bg-transparent border-none outline-none text-sm w-full font-body text-text placeholder:text-text-muted/50" placeholder="Search pairs..." />
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface hover:bg-surface-bright border border-border transition-all text-sm font-bold text-text cursor-pointer hover:shadow-md active:scale-95">
                            <Filter size={16} /> Filters
                        </button>
                    </div>
                </div>
                
                <div className="flex-1 overflow-x-auto rounded-xl border border-border/40">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead className="text-xs uppercase tracking-widest text-text-muted bg-surface/50 border-b border-border/50">
                            <tr>
                                <th className="py-4 pl-6 font-semibold">Asset Symbol</th>
                                <th className="py-4 text-right font-semibold">Last Price</th>
                                <th className="py-4 text-right font-semibold">24h Change</th>
                                <th className="py-4 text-right font-semibold">24h Volume</th>
                                <th className="py-4 text-right font-semibold">Market Cap</th>
                                <th className="py-4 pr-6 text-center font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/20 text-sm">
                            {[
                                { sym: 'BTC/USDT', name: 'Bitcoin', price: '67,420.00', vol: '32.5B', cap: '1.32T', chg: '+1.20%', up: true },
                                { sym: 'ETH/USDT', name: 'Ethereum', price: '3,450.88', vol: '15.2B', cap: '415B', chg: '-0.40%', up: false },
                                { sym: 'SOL/USDT', name: 'Solana', price: '142.15', vol: '4.1B', cap: '63.2B', chg: '+4.55%', up: true },
                                { sym: 'EUR/USD', name: 'Euro', price: '1.0845', vol: '120B', cap: '-', chg: '+0.12%', up: true },
                            ].map((row, i) => (
                                <tr key={i} className="hover:bg-surface-bright/30 transition-colors group cursor-pointer" onClick={() => navigate('/trade/spot')}>
                                    <td className="py-4 pl-6 text-text">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-surface-elevated border border-border flex items-center justify-center font-black font-heading text-primary relative overflow-hidden">
                                                {row.sym[0]}
                                                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            </div>
                                            <div>
                                                <div className="font-bold tracking-tight">{row.sym}</div>
                                                <div className="text-[11px] text-text-muted uppercase tracking-widest">{row.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 text-right font-mono font-medium text-text">${row.price}</td>
                                    <td className={`py-4 text-right font-mono font-bold ${row.up ? 'text-positive' : 'text-negative'}`}>
                                        <span className={`px-2 py-1 rounded-md text-xs ${row.up ? 'bg-positive/10' : 'bg-negative/10'}`}>{row.chg}</span>
                                    </td>
                                    <td className="py-4 text-right font-mono text-text-muted">{row.vol}</td>
                                    <td className="py-4 text-right font-mono text-text-muted">{row.cap}</td>
                                    <td className="py-4 pr-6 text-center">
                                        <button className="px-4 py-1.5 bg-surface border border-border text-text font-bold rounded-lg hover:bg-primary hover:text-bg hover:border-primary transition-all active:scale-95 shadow-sm">
                                            Trade
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
