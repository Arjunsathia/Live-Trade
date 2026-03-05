import { useState } from 'react';
import { X, TrendingUp, TrendingDown, BarChart2, ShieldAlert, Crosshair, HelpCircle } from 'lucide-react';

function SideBadge({ side }) {
    const isBuy = side === 'buy';
    return (
        <div className={`flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-[8px] border text-[10px] font-bold uppercase tracking-[0.15em] w-[72px] shrink-0
            ${isBuy
                ? 'bg-brand/10 text-brand border-brand/20'
                : 'bg-red-500/10 text-red-500 border-red-500/20'
            }`}
        >
            {isBuy ? <TrendingUp size={12} strokeWidth={3} /> : <TrendingDown size={12} strokeWidth={3} />}
            {side}
        </div>
    );
}

function MetricGroup({ label, value, valueClass = "text-text", subText }) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-text-muted/70">{label}</span>
            <div className={`font-mono text-[14px] font-bold tabular-nums tracking-tight ${valueClass}`}>
                {value}
            </div>
            {subText && (
                <span className="text-[10px] font-medium text-text-muted/80">{subText}</span>
            )}
        </div>
    );
}

function PositionRow({ pos, onClose }) {
    const isPos = pos.unrealizedPnl >= 0;

    return (
        <div className="group relative flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 p-4 rounded-[16px] bg-surface-elevated/20 border border-border/20 hover:bg-surface-elevated/40 hover:border-border/60 transition-all duration-300">

            {/* Left: Asset & Side */}
            <div className="flex items-center gap-4 min-w-[180px]">
                <SideBadge side={pos.side} />
                <div className="flex flex-col justify-center">
                    <span className="font-bold text-[16px] text-text tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>
                        {pos.symbol}
                    </span>
                    <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[12px] font-bold text-text-muted tabular-nums uppercase tracking-wider">
                            {pos.volume.toFixed(2)} LOTS
                        </span>
                    </div>
                </div>
            </div>

            {/* Center Grid: Pricing & Risk */}
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-6 items-center">
                <MetricGroup
                    label="Entry Price"
                    value={pos.openPrice.toFixed(5)}
                />
                <MetricGroup
                    label="Current"
                    value={pos.currentPrice.toFixed(5)}
                    valueClass={pos.currentPrice > pos.openPrice && pos.side === 'buy' || pos.currentPrice < pos.openPrice && pos.side === 'sell' ? 'text-brand' : 'text-text'}
                />

                {/* SL / TP Pills */}
                <div className="flex flex-col gap-1.5 col-span-2 sm:col-span-2 justify-center">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 w-[110px]">
                            <ShieldAlert size={12} className="text-red-400/60" />
                            <span className="text-[10px] font-bold uppercase text-text-muted tracking-wider">SL</span>
                        </div>
                        <span className="font-mono text-[12px] font-bold text-red-400 tabular-nums bg-red-500/10 px-2 py-0.5 rounded-[6px] border border-red-500/10">
                            {pos.stopLoss ? pos.stopLoss.toFixed(5) : '—'}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 w-[110px]">
                            <Crosshair size={12} className="text-brand/60" />
                            <span className="text-[10px] font-bold uppercase text-text-muted tracking-wider">TP</span>
                        </div>
                        <span className="font-mono text-[12px] font-bold text-brand tabular-nums bg-brand/10 px-2 py-0.5 rounded-[6px] border border-brand/10">
                            {pos.takeProfit ? pos.takeProfit.toFixed(5) : '—'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Right: PnL & Action */}
            <div className="flex justify-between xl:justify-end items-center gap-6 mt-4 xl:mt-0 pt-4 xl:pt-0 border-t xl:border-none border-border/40">
                <div className="flex flex-col items-start xl:items-end gap-0.5 min-w-[100px]">
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted/60 xl:hidden">Floating PnL</span>
                    <span className={`font-mono text-[18px] font-bold tabular-nums tracking-tight ${isPos ? 'text-brand' : 'text-red-500'}`}>
                        {isPos ? '+' : ''}${Math.abs(pos.unrealizedPnl).toFixed(2)}
                    </span>
                    <span className={`font-mono text-[11px] font-bold tabular-nums ${isPos ? 'text-brand/70' : 'text-red-500/70'}`}>
                        {isPos ? '+' : ''}{pos.pips.toFixed(1)} PIPs
                    </span>
                </div>

                <button
                    onClick={() => onClose(pos.id)}
                    className="flex items-center justify-center w-10 h-10 rounded-[10px] bg-surface-elevated border border-border/50 text-text-muted hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-500 transition-all duration-200 group/btn"
                    title="Close Position"
                >
                    <X size={16} strokeWidth={2.5} className="group-hover/btn:scale-110 transition-transform" />
                </button>
            </div>
        </div>
    );
}

export function PositionsTable({ positions = [] }) {
    const totalPnl = positions.reduce((sum, p) => sum + p.unrealizedPnl, 0);
    const isPnlPositive = totalPnl >= 0;

    const handleClose = (id) => console.log('Close position:', id);

    return (
        <div className="bg-surface border border-border/60 rounded-[28px] overflow-hidden flex flex-col shadow-[0_4px_30px_-10px_rgba(0,0,0,0.1)] relative">

            {/* Top Accent Gradient */}
            <div className={`absolute top-0 left-0 w-full h-[3px] 
                ${isPnlPositive ? 'bg-gradient-to-r from-brand/20 via-brand to-brand/20' : 'bg-gradient-to-r from-red-500/20 via-red-500 to-red-500/20'}`}
            />

            {/* Ambient Background Glow based on PnL */}
            <div className={`absolute -top-32 -right-32 w-64 h-64 rounded-full blur-[100px] pointer-events-none transition-colors duration-700 opacity-20 z-0
                ${isPnlPositive ? 'bg-brand' : 'bg-red-500'}`}
            />

            <div className="p-6 pb-2 border-b border-border/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10 bg-surface/80 backdrop-blur-md">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                        <h2 className="text-[20px] font-bold text-text tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>
                            Open Positions
                        </h2>
                        <span className="px-2.5 py-0.5 bg-surface-elevated border border-border/50 rounded-full text-[12px] font-bold text-text-muted font-mono">
                            {positions.length}
                        </span>
                    </div>
                    <p className="text-[11px] text-text-muted/80 font-medium uppercase tracking-[0.1em]">Live Market Exposure</p>
                </div>

                {positions.length > 0 && (
                    <div className="flex flex-col items-end gap-1 bg-surface-elevated/40 border border-border/50 px-4 py-2 rounded-[14px]">
                        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted">Total Floating P&L</span>
                        <span className={`font-mono text-[22px] font-bold tabular-nums tracking-tighter leading-none
                            ${isPnlPositive ? 'text-brand' : 'text-red-500'}`}>
                            {isPnlPositive ? '+' : '-'} ${Math.abs(totalPnl).toFixed(2)}
                        </span>
                    </div>
                )}
            </div>

            <div className="p-4 sm:p-6 bg-surface relative z-10 flex flex-col gap-3 min-h-[300px]">
                {positions.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
                        <div className="w-14 h-14 rounded-[16px] bg-surface-elevated/50 border border-border/50 flex items-center justify-center">
                            <BarChart2 size={24} className="text-text-muted/40" />
                        </div>
                        <div className="flex flex-col gap-1.5 px-6">
                            <span className="text-[15px] font-bold text-text/90" style={{ fontFamily: 'Space Grotesk' }}>No Open Trades</span>
                            <span className="text-[13px] text-text-muted/60 font-medium leading-relaxed">Market orders and pending limits will appear here once executed.</span>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {positions.map((pos) => (
                            <PositionRow key={pos.id} pos={pos} onClose={handleClose} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
