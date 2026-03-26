import { CheckCircle2, LogIn, ArrowRightLeft, Clock } from 'lucide-react';

export function ActivityTimeline() {
    return (
        <div className="bg-surface-elevated rounded-[8px] p-6 border border-border h-full flex flex-col">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-[14px] font-bold uppercase tracking-normal text-text" style={{ fontFamily: 'Space Grotesk' }}>Activity Timeline</h3>
                <Clock size={16} strokeWidth={2.5} className="text-text-muted" />
            </div>
            
            <div className="space-y-6 flex-1">
                
                {/* Event 1 */}
                <div className="flex gap-4 relative group cursor-default">
                    <div className="absolute top-7 left-4 bottom-[-1.5rem] w-px bg-border/40 group-hover:bg-primary/30 transition-colors duration-500"></div>
                    <div className="w-8 h-8 rounded-full bg-positive/10 flex items-center justify-center shrink-0 border border-positive/20 z-10 transition-transform duration-300 group-hover:scale-110">
                        <CheckCircle2 size={14} className="text-positive" strokeWidth={3} />
                    </div>
                    <div>
                        <p className="text-[13px] font-bold text-text tracking-wide relative top-[-2px]">Order Filled: BTC/USDT</p>
                        <p className="text-[11px] text-text-muted mt-0.5">Bought 0.045 BTC at $67,420.00</p>
                        <p className="text-[9px] text-text-muted/50 mt-1 uppercase tracking-widest font-bold">2 mins ago</p>
                    </div>
                </div>

                {/* Event 2 */}
                <div className="flex gap-4 relative group cursor-default">
                    <div className="absolute top-7 left-4 bottom-[-1.5rem] w-px bg-border/40 group-hover:bg-primary/30 transition-colors duration-500"></div>
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 z-10 transition-transform duration-300 group-hover:scale-110">
                        <LogIn size={14} className="text-primary" strokeWidth={2.5} />
                    </div>
                    <div>
                        <p className="text-[13px] font-bold text-text tracking-wide relative top-[-2px]">Security Alert: New Login</p>
                        <p className="text-[11px] text-text-muted mt-0.5">IP: 192.168.1.45 (New York, US)</p>
                        <p className="text-[9px] text-text-muted/50 mt-1 uppercase tracking-widest font-bold">45 mins ago</p>
                    </div>
                </div>

                {/* Event 3 */}
                <div className="flex gap-4 group cursor-default">
                    <div className="w-8 h-8 rounded-full bg-bg flex items-center justify-center shrink-0 border border-border/60 z-10 transition-transform duration-300 group-hover:scale-110">
                        <ArrowRightLeft size={14} className="text-text-muted" strokeWidth={2.5} />
                    </div>
                    <div>
                        <p className="text-[13px] font-bold text-text tracking-wide relative top-[-2px]">Transfer Initiated</p>
                        <p className="text-[11px] text-text-muted mt-0.5">Deposit of $2,000.00 via ACH</p>
                        <p className="text-[9px] text-text-muted/50 mt-1 uppercase tracking-widest font-bold">3 hours ago</p>
                    </div>
                </div>

            </div>
            
            <button className="w-full mt-6 py-3 rounded-[8px] bg-bg border border-border/40 text-[11px] font-bold uppercase tracking-widest text-text-muted hover:text-text hover:bg-surface-bright transition-all duration-300">
                View All Logs
            </button>
        </div>
    );
}
