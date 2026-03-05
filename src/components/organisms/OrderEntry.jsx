import { useState } from 'react';
import { TrendingUp, TrendingDown, ChevronDown, Info, Shield, Crosshair } from 'lucide-react';

const SIZES = [0.01, 0.05, 0.1, 0.5, 1.0, 5.0];
const PAIRS = [
    { s: 'EURUSD', p: 1.08526, sp: 1.4 },
    { s: 'GBPUSD', p: 1.26410, sp: 1.8 },
    { s: 'USDJPY', p: 150.211, sp: 1.2 },
    { s: 'XAUUSD', p: 2038.45, sp: 2.5 },
];

export function OrderEntry() {
    const [side, setSide] = useState('buy');
    const [orderType, setOrderType] = useState('market');
    const [symbol, setSymbol] = useState('EURUSD');
    const [volume, setVolume] = useState('0.10');
    const [price, setPrice] = useState('');
    const [sl, setSl] = useState('');
    const [tp, setTp] = useState('');

    const activeAsset = PAIRS.find(p => p.s === symbol) || PAIRS[0];
    const currentBid = activeAsset.p;
    const currentAsk = currentBid + (activeAsset.sp / 10000);
    const spread = activeAsset.sp.toFixed(1);

    // Naive margin calculation
    const estimatedMargin = (parseFloat(volume) * 1000 * currentAsk * 0.01).toFixed(2);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ side, orderType, symbol, volume: parseFloat(volume) });
    };

    const isBuy = side === 'buy';

    return (
        <div className="bg-surface border border-border/60 rounded-[28px] overflow-hidden shadow-[0_4px_30px_-10px_rgba(0,0,0,0.1)] relative transition-all duration-500 group/panel">

            {/* Ambient Background Glow mapped to Side */}
            <div className={`absolute -top-32 -right-32 w-64 h-64 blur-[100px] rounded-full pointer-events-none transition-colors duration-700 opacity-20
                ${isBuy ? 'bg-brand' : 'bg-red-500'}`}
            />

            <div className="p-5 flex flex-col gap-5 relative z-10 w-full">
                {/* Header */}
                <div className="flex items-center justify-between pointer-events-none">
                    <div className="flex items-center gap-3">
                        <h2 className="text-[16px] font-bold text-text tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>
                            Order Entry
                        </h2>
                    </div>
                </div>

                {/* Main Form Area */}
                <div className="flex flex-col gap-3">

                    {/* Asset & Order Type Row */}
                    <div className="flex bg-surface-elevated/40 border border-border/40 rounded-[14px] p-1 shadow-inner h-[40px]">
                        {['market', 'limit', 'stop'].map(t => (
                            <button
                                key={t}
                                onClick={() => setOrderType(t)}
                                className={`flex-1 rounded-[10px] text-[10px] font-bold uppercase tracking-[0.15em] transition-all duration-200 
                                    ${orderType === t
                                        ? 'bg-surface text-text shadow-sm border border-border/60'
                                        : 'text-text-muted hover:text-text hover:bg-surface/50 border border-transparent'
                                    }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>

                    {/* Symbol Selector */}
                    <div className="relative group">
                        <select
                            value={symbol}
                            onChange={e => setSymbol(e.target.value)}
                            className="w-full appearance-none bg-surface-elevated/60 border border-border/60 rounded-[12px] px-3 py-2.5 text-[14px] font-bold text-text pr-8 focus:outline-none focus:border-brand/50 transition-colors cursor-pointer hover:border-border/80 outline-none"
                            style={{ fontFamily: 'Space Grotesk' }}
                        >
                            {PAIRS.map(p => <option key={p.s} value={p.s}>{p.s}</option>)}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                    </div>

                    {/* Price Ticker Panel */}
                    <div className="grid grid-cols-3 gap-1.5">
                        {/* BID */}
                        <div
                            onClick={() => setSide('sell')}
                            className={`flex flex-col items-center justify-center py-2.5 rounded-[10px] border cursor-pointer transition-all duration-200
                            ${!isBuy ? 'bg-red-500/10 border-red-500/30' : 'bg-surface-elevated/30 border-border/40 hover:border-red-500/20 hover:bg-red-500/5'}`}
                        >
                            <span className={`text-[9px] font-bold uppercase tracking-[0.2em] mb-0.5 ${!isBuy ? 'text-red-500' : 'text-text-muted/60'}`}>Sell Base</span>
                            <span className={`text-[13px] font-mono font-bold tabular-nums ${!isBuy ? 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]' : 'text-text/80'}`}>{currentBid.toFixed(5)}</span>
                        </div>

                        {/* SPREAD */}
                        <div className="flex flex-col items-center justify-center py-2.5 bg-surface-elevated/20 border border-border/20 rounded-[10px] opacity-80 pointer-events-none">
                            <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-text-muted/50 mb-0.5">Spread</span>
                            <span className="text-[11px] font-mono font-medium text-text-muted tabular-nums tracking-wide">{spread}</span>
                        </div>

                        {/* ASK */}
                        <div
                            onClick={() => setSide('buy')}
                            className={`flex flex-col items-center justify-center py-2.5 rounded-[10px] border cursor-pointer transition-all duration-200
                            ${isBuy ? 'bg-brand/10 border-brand/30' : 'bg-surface-elevated/30 border-border/40 hover:border-brand/20 hover:bg-brand/5'}`}
                        >
                            <span className={`text-[9px] font-bold uppercase tracking-[0.2em] mb-0.5 ${isBuy ? 'text-brand' : 'text-text-muted/60'}`}>Buy Base</span>
                            <span className={`text-[13px] font-mono font-bold tabular-nums ${isBuy ? 'text-brand drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'text-text/80'}`}>{currentAsk.toFixed(5)}</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">

                        {/* Volume / Lots */}
                        <div className="flex flex-col gap-2.5">
                            <div className="flex items-center justify-between px-1">
                                <label className="text-[10px] font-semibold uppercase tracking-[0.15em] text-text-muted/80">
                                    Trade Size
                                </label>
                            </div>

                            <div className="relative rounded-[16px] border border-border/80 bg-surface-elevated/50 overflow-hidden focus-within:border-brand/50 transition-colors h-[44px] flex">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Lots</span>
                                <input
                                    type="number"
                                    value={volume}
                                    onChange={e => setVolume(e.target.value)}
                                    step="0.01"
                                    min="0.01"
                                    className="w-full h-full bg-transparent pl-12 pr-3 text-right font-mono text-[14px] font-bold text-text focus:outline-none tabular-nums"
                                />
                            </div>

                            {/* Preset Pills */}
                            <div className="flex gap-1.5 w-full">
                                {SIZES.map(s => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setVolume(s.toFixed(2))}
                                        className={`flex-1 py-1.5 rounded-[10px] text-[11px] font-mono font-bold transition-all border
                                            ${parseFloat(volume) === s
                                                ? 'bg-surface-elevated/80 text-text border-border/80 scale-105'
                                                : 'bg-surface-elevated/30 border-transparent text-text-muted hover:bg-surface-elevated hover:text-text'
                                            }`}
                                    >
                                        {s.toFixed(2)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Limit Price Input */}
                        {orderType !== 'market' && (
                            <div className="flex flex-col gap-1.5 animate-fade-up animate-duration-200">
                                <label className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted/80 px-1">
                                    Target Entry Price
                                </label>
                                <div className="relative rounded-[16px] border border-border/80 bg-surface-elevated/50 overflow-hidden focus-within:border-brand/50 transition-colors h-[44px]">
                                    <input
                                        type="number"
                                        value={price}
                                        onChange={e => setPrice(e.target.value)}
                                        step="0.00001"
                                        placeholder={isBuy ? currentAsk.toFixed(5) : currentBid.toFixed(5)}
                                        className="w-full h-full bg-transparent px-3 font-mono text-[14px] font-bold text-text focus:outline-none tabular-nums placeholder-text-muted/30"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Stop Loss / Take Profit */}
                        <div className="grid grid-cols-2 gap-3 mt-1">
                            {/* SL */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-semibold uppercase tracking-[0.15em] text-red-400/80 flex items-center gap-1.5 px-1">
                                    <Shield size={10} strokeWidth={2.5} /> Stop Loss
                                </label>
                                <div className="relative rounded-[16px] border border-red-500/20 bg-red-500/5 focus-within:border-red-500/40 transition-colors h-[44px] overflow-hidden">
                                    <input
                                        type="number"
                                        value={sl}
                                        onChange={e => setSl(e.target.value)}
                                        step="0.00001"
                                        placeholder="0.00000"
                                        className="w-full h-full bg-transparent px-2 text-center font-mono text-[13px] font-bold text-red-400 focus:outline-none tabular-nums placeholder-red-500/20 outline-none"
                                    />
                                </div>
                            </div>

                            {/* TP */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-semibold uppercase tracking-[0.15em] text-brand/80 flex items-center gap-1.5 px-1">
                                    <Crosshair size={10} strokeWidth={2.5} /> Take Profit
                                </label>
                                <div className="relative rounded-[16px] border border-brand/20 bg-brand/5 focus-within:border-brand/40 transition-colors h-[44px] overflow-hidden">
                                    <input
                                        type="number"
                                        value={tp}
                                        onChange={e => setTp(e.target.value)}
                                        step="0.00001"
                                        placeholder="0.00000"
                                        className="w-full h-full bg-transparent px-2 text-center font-mono text-[13px] font-bold text-brand focus:outline-none tabular-nums placeholder-brand/20 outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Action CTA & Margin */}
                        <div className="flex flex-col gap-3 mt-2">
                            <button
                                type="submit"
                                className={`w-full py-4 rounded-[16px] font-bold text-[13px] uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-all duration-300
                                    ${isBuy
                                        ? 'bg-brand/10 border border-brand/40 text-brand hover:bg-brand/20 hover:border-brand/60 active:scale-[0.98]'
                                        : 'bg-red-500/10 border border-red-500/40 text-red-500 hover:bg-red-500/20 hover:border-red-500/60 active:scale-[0.98]'}`}
                            >
                                {isBuy ? <TrendingUp size={15} strokeWidth={2.5} /> : <TrendingDown size={15} strokeWidth={2.5} />}
                                {isBuy ? 'Place Buy' : 'Place Sell'} Order
                            </button>

                            <div className="flex justify-between items-center px-4 py-3 bg-surface-elevated/40 border border-border/20 rounded-[14px]">
                                <div className="flex items-center gap-1.5 text-text-muted/80">
                                    <Info size={12} className="opacity-70" />
                                    <span className="text-[10px] font-semibold uppercase tracking-wider">Required Margin</span>
                                </div>
                                <span className="font-mono text-[13px] font-bold text-text tabular-nums opacity-90">${estimatedMargin}</span>
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}
