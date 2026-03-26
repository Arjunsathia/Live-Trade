import { useState, useEffect } from 'react';
import { MoreHorizontal, ArrowUp, ArrowDown, BarChart2 } from 'lucide-react';
import { useTicker } from '../hooks/useTicker';

export function OrderBookPanel() {
    const ticker = useTicker();
    const [asks, setAsks] = useState([]);
    const [bids, setBids] = useState([]);

    useEffect(() => {
        const generateLevel = (base, offset, isAsk) => {
            const levels = [];
            let total = 0;
            for (let i = 0; i < 15; i++) {
                const price = isAsk 
                    ? (base + offset + i * 0.0001).toFixed(4)
                    : (base - offset - i * 0.0001).toFixed(4);
                const amountVal = Math.random() * 500 + 10;
                total += amountVal;
                levels.push({ 
                    price, 
                    amount: amountVal.toFixed(0) + 'k', 
                    total: total.toFixed(0) + 'k' 
                });
            }
            return isAsk ? levels.reverse() : levels;
        };

        setAsks(generateLevel(ticker.price, 0.0001, true));
        setBids(generateLevel(ticker.price, 0.0001, false));
    }, [ticker.price]);

    const spread = (parseFloat(asks[asks.length-1]?.price || 0) - parseFloat(bids[0]?.price || 0)).toFixed(4);

    const generateDepthBar = (isAsk, idx, len) => {
        const percentage = Math.min(((idx + 1) / len) * 100, 100);
        return (
            <div 
                className={`absolute top-0 bottom-0 right-0 opacity-[0.12] pointer-events-none transition-all duration-500 ${isAsk ? 'bg-negative' : 'bg-positive'}`}
                style={{ width: `${percentage}%` }}
            />
        );
    }

    return (
        <div className="h-full bg-surface-elevated rounded-[8px] flex flex-col overflow-hidden border border-border/50 shadow-sm font-heading relative">
            {/* Header */}
            <div className="flex items-center justify-between px-4 border-b border-border/30 h-[48px] shrink-0 bg-bg/20">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-text">
                    <BarChart2 size={13} className="text-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.3)]" />
                    Order Book
                </div>
                <MoreHorizontal size={14} className="text-text-muted/30 cursor-pointer hover:text-primary transition-colors" />
            </div>

            {/* Column Headers */}
            <div className="flex justify-between text-[8px] text-text-muted/30 px-4 py-2 bg-bg/10 border-b border-border/10 font-black uppercase tracking-[0.2em] shrink-0">
                <span className="w-1/3 text-left">Price (USD)</span>
                <span className="w-1/3 text-right">Size</span>
                <span className="w-1/3 text-right">Total</span>
            </div>

            {/* Asks (Sells) */}
            <div className="flex flex-col flex-1 justify-end font-mono text-[11px] overflow-y-auto custom-scrollbar min-h-0 py-1">
                {asks.map((ask, i) => (
                    <div key={`ask-${i}`} className="flex justify-between py-[1.5px] px-4 relative hover:bg-negative/5 cursor-pointer group transition-colors">
                        {generateDepthBar(true, asks.length - 1 - i, asks.length)}
                        <span className="w-1/3 text-left text-negative/80 font-black tracking-tight">{ask.price}</span>
                        <span className="w-1/3 text-right text-text/90 group-hover:font-black transition-all">{ask.amount}</span>
                        <span className="w-1/3 text-right text-text-muted/30 text-[9px] font-bold">{ask.total}</span>
                    </div>
                ))}
            </div>

            {/* Current Price (Center) */}
            <div className="flex justify-between items-center py-2.5 px-4 my-1 bg-bg border-y border-border/20 relative z-10 shadow-sm">
                <div className="flex items-center gap-3">
                    <span className={`text-[17px] font-mono font-black tracking-tighter transition-colors duration-300 ${ticker.up ? 'text-positive' : 'text-negative'} shadow-sm`}>
                        {ticker.price.toFixed(4)}
                    </span>
                    <div className={`p-0.5 rounded-full ${ticker.up ? 'bg-positive/20 text-positive' : 'bg-negative/20 text-negative'}`}>
                        {ticker.up ? <ArrowUp size={12} strokeWidth={3} /> : <ArrowDown size={12} strokeWidth={3} />}
                    </div>
                </div>
                <div className="text-[10px] text-text-muted/40 font-black tracking-widest uppercase text-right leading-none">
                    Spread <span className="text-text/80 font-mono ml-1.5">{spread}</span>
                </div>
            </div>

            {/* Bids (Buys) */}
            <div className="flex flex-col flex-1 justify-start font-mono text-[11px] overflow-y-auto custom-scrollbar min-h-0 py-1">
                {bids.map((bid, i) => (
                    <div key={`bid-${i}`} className="flex justify-between py-[1.5px] px-4 relative hover:bg-positive/5 cursor-pointer group transition-colors">
                        {generateDepthBar(false, i, bids.length)}
                        <span className="w-1/3 text-left text-positive/80 font-black tracking-tight">{bid.price}</span>
                        <span className="w-1/3 text-right text-text/90 group-hover:font-black transition-all">{bid.amount}</span>
                        <span className="w-1/3 text-right text-text-muted/30 text-[9px] font-bold">{bid.total}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
