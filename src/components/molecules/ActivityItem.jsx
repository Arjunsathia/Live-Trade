export function ActivityItem({ logo, name, subtitle, change, profit, date, positive, barWidth }) {
    return (
        <div className="pb-[18px] mb-[18px] border-b-[0.5px] border-border last:border-0 last:mb-0 last:pb-0 group cursor-pointer">

            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-elevated border-[0.5px] border-border flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300">
                        <span className="font-heading font-bold text-[15px] text-text">{logo}</span>
                    </div>
                    <div>
                        <div className="font-heading font-bold text-[14px] text-text tracking-tight mb-0.5 group-hover:text-primary transition-colors duration-200">
                            {name}
                        </div>
                        <div className="font-body font-medium text-[11px] text-text-muted tracking-wide">
                            {subtitle}
                        </div>
                    </div>
                </div>

                <span className={`font-display font-bold text-[13px] tracking-[-0.01em] ${positive ? 'text-positive' : 'text-negative'}`}>
                    {positive ? "+" : ""}{change}
                </span>
            </div>

            {/* Progress Bar Container */}
            <div className="h-1 rounded-full bg-border-subtle overflow-hidden mb-2 relative">
                <div
                    className={`h-full rounded-full absolute left-0 top-0 transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${positive
                            ? 'bg-gradient-to-r from-positive/40 to-positive shadow-glow-primary'
                            : 'bg-gradient-to-r from-negative/40 to-negative shadow-[0_0_8px_rgba(255,69,96,0.3)]'
                        }`}
                    style={{ width: `${barWidth}%` }}
                />
            </div>

            <div className="flex justify-between items-center font-body font-medium text-[11px]">
                <span className="text-text-secondary">
                    Profit <span className="font-bold text-positive ml-1 tracking-tight">{profit}</span>
                </span>
                <span className="text-text-muted">{date}</span>
            </div>
        </div>
    );
}
