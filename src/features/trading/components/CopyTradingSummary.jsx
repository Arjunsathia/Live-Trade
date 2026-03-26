import { Users, ChevronRight, ShieldCheck } from "lucide-react";

export function CopyTradingSummary() {
    return (
        <div className="flex flex-col gap-6 h-full">
            {/* Main Copy Card */}
            <div className="bg-gradient-to-br from-primary/10 to-surface-elevated rounded-[8px] p-6 border border-primary/20 relative overflow-hidden flex-1 group transition-all duration-500">
                <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary/20 rounded-full blur-[60px] pointer-events-none transition-transform group-hover:scale-110 duration-700"></div>
                
                <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-[14px] font-extrabold uppercase tracking-tight text-primary font-heading leading-tight">Copy Trading Summary</h3>
                            <p className="text-[10px] text-text-muted mt-1 font-bold uppercase tracking-[0.1em]">Automated Mirror Trading</p>
                        </div>
                        <div className="bg-primary border border-primary/20 rounded-full p-2.5 shadow-sm shadow-primary/20">
                            <Users size={16} className="text-bg" fill="currentColor" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center bg-bg/50 p-3.5 rounded-[8px] border border-border/40 hover:bg-bg transition-colors">
                            <span className="text-[11px] font-bold text-text-muted uppercase tracking-[0.15em]">Followed Strategies</span>
                            <span className="text-[13px] font-mono font-bold text-text tabular-nums tracking-tight">4 Active</span>
                        </div>
                        <div className="flex justify-between items-center bg-bg/50 p-3.5 rounded-[8px] border border-border/40 hover:bg-bg transition-colors">
                            <span className="text-[11px] font-bold text-text-muted uppercase tracking-[0.15em]">Total ROI (All)</span>
                            <span className="text-[13px] font-mono font-bold text-positive tabular-nums tracking-tight">+22.4%</span>
                        </div>
                        <div className="flex justify-between items-center bg-bg/50 p-3.5 rounded-[8px] border border-border/40 hover:bg-bg transition-colors">
                            <span className="text-[11px] font-bold text-text-muted uppercase tracking-[0.15em]">Active Positions</span>
                            <span className="text-[13px] font-mono font-bold text-text tabular-nums tracking-tight">12 Orders</span>
                        </div>
                    </div>

                    <div className="mt-auto pt-8">
                        <div className="flex -space-x-3 overflow-hidden">
                            <img alt="Trader" className="inline-block h-9 w-9 rounded-full ring-2 ring-surface border border-border/40" src="https://i.pravatar.cc/100?img=11" />
                            <img alt="Trader" className="inline-block h-9 w-9 rounded-full ring-2 ring-surface border border-border/40" src="https://i.pravatar.cc/100?img=12" />
                            <img alt="Trader" className="inline-block h-9 w-9 rounded-full ring-2 ring-surface border border-border/40" src="https://i.pravatar.cc/100?img=13" />
                            <div className="flex items-center justify-center h-9 w-9 rounded-full bg-surface-bright text-[9px] text-text font-black tracking-tighter border-2 border-surface z-10 shadow-sm">+1</div>
                        </div>
                        <p className="text-[10px] text-text-muted/80 mt-3 font-semibold tracking-wide italic leading-relaxed">Strategy "Alpha Growth" just opened a Long ETH.</p>
                    </div>
                </div>
            </div>

            {/* Small Secondary Action/Status */}
            <div className="bg-surface-elevated rounded-[8px] p-5 border border-border flex items-center justify-between group cursor-pointer hover:bg-surface-bright hover:border-border/60 transition-all duration-300 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-[8px] bg-positive/10 flex items-center justify-center border border-positive/20">
                        <ShieldCheck size={20} className="text-positive" />
                    </div>
                    <div>
                        <p className="text-[12px] font-bold text-text tracking-wide relative top-[-1px]">Auto-Deleveraging</p>
                        <p className="text-[10px] text-text-muted mt-0.5 font-semibold">Risk Level: Low</p>
                    </div>
                </div>
                <ChevronRight size={18} className="text-text-muted/60 group-hover:translate-x-1 transition-transform duration-300 group-hover:text-text" />
            </div>
        </div>
    );
}
