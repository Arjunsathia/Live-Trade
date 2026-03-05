import { Copy, TrendingUp, TrendingDown, Zap, ExternalLink, CheckCircle2, History } from 'lucide-react';

const EVENT_LABELS = {
    copy_open: 'Started Copying',
    copy_close: 'Stopped Copying',
    filled: 'Order Executed',
    position_closed: 'Position Closed',
};

function PipBadge({ pips, inverted = false }) {
    if (pips === undefined || pips === null) return null;
    const isPos = inverted ? pips < 0 : pips >= 0;
    return (
        <span className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded-[6px] font-mono text-[10px] font-bold tabular-nums tracking-tracking-tight
            ${isPos ? 'bg-brand/10 text-brand border border-brand/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
            {isPos ? '+' : ''}{pips.toFixed(1)} PIPs
        </span>
    );
}

function EventIcon({ type, side, event }) {
    const isCopy = type === 'copy_event';
    const isOpen = event?.includes('open') || event === 'filled';
    const isBuy = side === 'buy';

    if (isCopy) {
        return (
            <div className="w-8 h-8 rounded-[10px] bg-brand/10 border border-brand/20 flex flex-col items-center justify-center shrink-0 relative z-10">
                <Copy size={13} strokeWidth={2.5} className="text-brand" />
            </div>
        );
    }

    if (isOpen && isBuy) {
        return (
            <div className="w-8 h-8 rounded-[10px] bg-brand/10 border border-brand/20 flex flex-col items-center justify-center shrink-0 relative z-10">
                <TrendingUp size={13} strokeWidth={2.5} className="text-brand" />
            </div>
        );
    }

    return (
        <div className="w-8 h-8 rounded-[10px] bg-red-500/10 border border-red-500/20 flex flex-col items-center justify-center shrink-0 relative z-10">
            <TrendingDown size={13} strokeWidth={2.5} className="text-red-500" />
        </div>
    );
}

function FeedRow({ event, isLast, now }) {
    const isCopy = event.type === 'copy_event';
    const isPositive = event.realizedPnl !== undefined ? event.realizedPnl >= 0 : true;
    const label = EVENT_LABELS[event.event] || event.event;

    const timeAgo = (() => {
        const diff = (now - event.timestamp) / 1000;
        if (diff < 60) return `${Math.round(diff)}s ago`;
        if (diff < 3600) return `${Math.round(diff / 60)}m ago`;
        return `${Math.round(diff / 3600)}h ago`;
    })();

    return (
        <div className="group relative flex items-stretch gap-3">
            {/* Timeline connectors */}
            <div className="flex flex-col items-center shrink-0 ml-1">
                <EventIcon type={event.type} side={event.side} event={event.event} />
                {!isLast && (
                    <div className="w-[1.5px] h-full bg-gradient-to-b from-border/80 to-transparent my-0.5 group-hover:from-brand/30 transition-colors" />
                )}
            </div>

            <div className={`flex-1 min-w-0 pb-4 ${!isLast ? 'border-none' : ''}`}>
                <div className="p-3 rounded-[12px] bg-surface-elevated/30 border border-border/40 hover:bg-surface-elevated/60 hover:border-border/80 transition-all duration-300">

                    {/* Header Row */}
                    <div className="flex justify-between items-start mb-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[9px] font-bold text-text-muted/80 uppercase tracking-widest">{label}</span>
                            <span className={`text-[12px] font-bold tracking-wider ${event.side === 'buy' ? 'text-brand' : event.side === 'sell' ? 'text-red-500' : 'text-text'}`} style={{ fontFamily: 'Space Grotesk' }}>
                                {event.symbol}
                            </span>
                            {event.copiedVolume && (
                                <span className="text-[10px] font-mono font-bold text-text-muted bg-surface/50 px-1.5 py-0.5 rounded-[4px] border border-border/50">
                                    {event.copiedVolume} LOTS
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                            <History size={10} className="text-text-muted/50" strokeWidth={3} />
                            <span className="text-[10px] font-mono font-bold text-text-muted/60">{timeAgo}</span>
                        </div>
                    </div>

                    {/* Details Row */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-3">
                            {isCopy && event.providerName && (
                                <div className="flex items-center gap-1.5">
                                    <Copy size={12} className="text-brand/60" />
                                    <span className="text-[11px] font-bold text-text-muted">{event.providerName}</span>
                                </div>
                            )}
                            {event.fillPrice && (
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-bold uppercase text-text-muted/50 tracking-widest">Filled At</span>
                                    <span className="text-[12px] text-text font-mono font-bold tabular-nums">{event.fillPrice.toFixed(5)}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            {event.realizedPnl !== undefined && (
                                <div className="flex flex-col items-end">
                                    <span className="text-[8px] font-bold uppercase text-text-muted/50 tracking-widest">Realized</span>
                                    <span className={`text-[14px] font-bold font-mono tabular-nums tracking-tight ${isPositive ? 'text-brand' : 'text-red-500'}`}>
                                        {isPositive ? '+' : '-'} ${Math.abs(event.realizedPnl).toFixed(2)}
                                    </span>
                                </div>
                            )}
                            <PipBadge pips={event.pips} />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export function ActivityFeed({ events = [], now }) {
    return (
        <div className="bg-surface border border-border/60 rounded-[28px] overflow-hidden flex flex-col shadow-[0_4px_30px_-10px_rgba(0,0,0,0.1)] relative">

            {/* Ambient Background Glow (Top Right Design System) */}
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-brand blur-[100px] rounded-full pointer-events-none z-0 opacity-20 transition-all duration-700" />

            <div className="p-5 border-b border-border/40 flex justify-between items-center relative z-10 bg-surface/80 backdrop-blur-md">
                <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2.5">
                        <h2 className="text-[16px] font-bold text-text-muted/90 tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>
                            Activity Feed
                        </h2>
                        {events.length > 0 && (
                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-brand/10 border border-brand/20 rounded-[8px]">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                                <span className="text-[10px] font-bold font-mono text-brand tabular-nums">
                                    {events.length} Live
                                </span>
                            </div>
                        )}
                    </div>
                </div>
                <button className="flex items-center justify-center w-7 h-7 rounded-[8px] bg-surface-elevated border border-border/50 text-text-muted hover:text-text hover:border-border transition-all">
                    <ExternalLink size={12} strokeWidth={2.5} />
                </button>
            </div>

            <div className="p-5 pt-6 bg-surface relative z-10 flex-1 overflow-y-auto custom-scrollbar">
                <div className="flex flex-col gap-1">
                    {events.length === 0 ? (
                        <div className="py-12 flex flex-col items-center gap-4 text-center mt-4">
                            <div className="w-16 h-16 rounded-[20px] bg-surface-elevated/40 border border-border/40 flex flex-col items-center justify-center relative group-hover:scale-105 transition-transform">
                                <Zap size={24} className="text-text-muted/30" />
                                <div className="absolute inset-0 ring-1 ring-inset ring-brand/0 rounded-[20px] transition-all duration-500"></div>
                            </div>
                            <div className="flex flex-col gap-1.5 px-4">
                                <span className="text-[15px] font-bold text-text/90" style={{ fontFamily: 'Space Grotesk' }}>No Recent Activity</span>
                                <span className="text-[13px] text-text-muted/60 font-medium leading-relaxed">Your executed trades, copied positions, and social events will appear here.</span>
                            </div>
                        </div>
                    ) : (
                        events.map((e, i) => (
                            <FeedRow key={i} event={e} isLast={i === events.length - 1} now={now} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
