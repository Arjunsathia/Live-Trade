import { useState, useEffect } from 'react';
import { ListFilter, History } from 'lucide-react';

export function RecentTradesPanel() {
    const [trades, setTrades] = useState([
        { price: '1.0845', amount: '125k', time: new Date().toLocaleTimeString().split(' ')[0], type: 'buy' },
        { price: '1.0844', amount: '400k', time: new Date().toLocaleTimeString().split(' ')[0], type: 'sell' },
        { price: '1.0844', amount: '50k', time: new Date().toLocaleTimeString().split(' ')[0], type: 'sell' },
        { price: '1.0846', amount: '250k', time: new Date().toLocaleTimeString().split(' ')[0], type: 'buy' },
        { price: '1.0843', amount: '340k', time: new Date().toLocaleTimeString().split(' ')[0], type: 'sell' },
        { price: '1.0842', amount: '110k', time: new Date().toLocaleTimeString().split(' ')[0], type: 'sell' },
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            const lastPrice = parseFloat(trades[0].price);
            const fluctuation = (Math.random() - 0.5) * 0.0002;
            const newPrice = (lastPrice + fluctuation).toFixed(4);
            const type = Math.random() > 0.5 ? 'buy' : 'sell';
            const amount = (Math.random() * 2).toFixed(3);
            const time = new Date().toLocaleTimeString().split(' ')[0];

            setTrades(prev => [{ price: newPrice, amount, time, type }, ...prev].slice(0, 30));
        }, 1500);

        return () => clearInterval(interval);
    }, [trades]);

    return (
        <div className="h-full bg-surface-elevated rounded-[8px] border border-border flex flex-col overflow-hidden shadow-lg shrink-0">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-border/40 bg-surface/50 h-12 shrink-0">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-text">
                    <History size={14} className="text-primary" />
                    Market Flow
                </div>
                <ListFilter size={14} className="text-text-muted cursor-pointer hover:text-primary transition-colors" />
            </div>

            {/* Column Headers */}
            <div className="grid grid-cols-3 text-[8px] text-text-muted/50 px-4 py-2 bg-bg/20 border-b border-border/30 font-black uppercase tracking-[0.2em] shrink-0">
                <span className="text-left">Price</span>
                <span className="text-right">Amount</span>
                <span className="text-right">Time</span>
            </div>

            {/* Trades List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar font-mono text-[11px] font-medium min-h-0">
                {trades.map((trade, i) => (
                    <div key={`${trade.time}-${i}`} className="grid grid-cols-3 py-[2px] px-1 hover:bg-surface-bright/40 cursor-pointer animate-fade-up">
                        <span className={`text-left font-bold ${trade.type === 'buy' ? 'text-positive' : 'text-negative'}`}>{trade.price}</span>
                        <span className="text-right text-text/90 tracking-tighter">{trade.amount}</span>
                        <span className="text-right text-text-muted/60 text-[10px]">{trade.time}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
