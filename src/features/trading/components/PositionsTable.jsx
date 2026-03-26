import { TrendingUp, BarChart2 } from 'lucide-react';
import { formatPrice, formatCurrency } from '../../../utils/formatters';

export function PositionsTable({ positions }) {
    return (
        <div className="bg-surface-elevated border border-border rounded-[8px] overflow-hidden flex flex-col h-full group/panel transition-all duration-500">
            {/* Header */}
            <div className="p-6 border-b border-border flex justify-between items-center relative z-10 w-full">
                <div className="flex items-center gap-3">
                    <h2 className="text-[14px] font-bold text-text tracking-normal uppercase relative top-0.5" style={{ fontFamily: 'Space Grotesk' }}>
                        Recent Trades
                    </h2>
                </div>
                <div className="flex gap-4">
                    <span className="text-[10px] text-text-muted flex items-center gap-1.5 cursor-pointer hover:text-text font-bold uppercase tracking-widest transition-colors"><TrendingUp size={12} strokeWidth={3} /> Filter</span>
                    <span className="text-[10px] text-text-muted flex items-center gap-1.5 cursor-pointer hover:text-text font-bold uppercase tracking-widest transition-colors"><BarChart2 size={12} strokeWidth={3} /> Sort</span>
                </div>
            </div>

            {/* Table Area */}
            <div className="w-full flex-1 overflow-x-auto overflow-y-auto custom-scrollbar min-h-0">
                <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead className="sticky top-0 bg-surface-elevated z-10 border-b border-border/60 shadow-sm backdrop-blur-md">
                        <tr>
                            <th className="px-6 py-4 text-[10px] uppercase tracking-[0.15em] text-text-muted font-bold">Symbol</th>
                            <th className="px-6 py-4 text-[10px] uppercase tracking-[0.15em] text-text-muted font-bold">Type</th>
                            <th className="px-6 py-4 text-[10px] uppercase tracking-[0.15em] text-text-muted font-bold text-right">Size</th>
                            <th className="px-6 py-4 text-[10px] uppercase tracking-[0.15em] text-text-muted font-bold text-right">Entry Price</th>
                            <th className="px-6 py-4 text-[10px] uppercase tracking-[0.15em] text-text-muted font-bold text-right">Current Price</th>
                            <th className="px-6 py-4 text-[10px] uppercase tracking-[0.15em] text-text-muted font-bold text-right">Status / Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                        {positions.map(pos => {
                            const isBuy = pos.side === 'buy';
                            const isPos = pos.unrealizedPnl >= 0;
                            // Fake time generated from id length for cosmetic consistency 
                            const fakeTime = `14:${String(pos.id.length * 5).padStart(2, '0')}:05`;

                            return (
                                <tr key={pos.id} className="hover:bg-surface-bright/50 transition-colors group cursor-default">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-7 h-7 rounded-sm bg-bg border border-border/40 flex items-center justify-center text-[10px] text-text font-bold shadow-sm">
                                                {pos.symbol.charAt(0)}
                                            </div>
                                            <span className="text-[13px] font-bold tracking-tight text-text whitespace-nowrap">{pos.symbol}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[9px] font-extrabold px-2 py-1 rounded-[4px] uppercase tracking-[0.15em] 
                                            ${isBuy ? 'text-positive bg-positive/10 border border-positive/10' : 'text-negative bg-negative/10 border border-negative/10'}`}>
                                            {pos.side}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-[13px] font-mono font-bold tabular-nums text-text text-right opacity-90">
                                        {formatPrice(pos.volume, 2)}
                                    </td>
                                    <td className="px-6 py-4 text-[13px] font-mono font-medium tabular-nums text-text-muted text-right tracking-wide">
                                        {formatPrice(pos.openPrice)}
                                    </td>
                                    <td className="px-6 py-4 text-[13px] font-mono font-bold tabular-nums text-right">
                                        <div className="flex flex-col items-end">
                                            <span className={isPos ? 'text-positive' : 'text-negative'}>{formatPrice(pos.currentPrice)}</span>
                                            <span className={`text-[10px] mt-0.5 ${isPos ? 'text-positive/70' : 'text-negative/70'}`}>{formatCurrency(pos.unrealizedPnl)}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-[4px] bg-primary/10 text-primary uppercase tracking-widest border border-primary/20">
                                                Active
                                            </span>
                                            <span className="text-[10px] font-mono text-text-muted font-medium tabular-nums opacity-60">
                                                {fakeTime} UTC
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                {positions.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-text-muted gap-4">
                        <TrendingUp size={32} className="opacity-20" />
                        <span className="text-[11px] font-bold uppercase tracking-[0.2em]">No active trades</span>
                    </div>
                )}
            </div>
        </div>
    );
}
