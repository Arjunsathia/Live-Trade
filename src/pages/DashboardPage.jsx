import { useState } from "react";
import { ChartWidget } from "../features/market/components/ChartWidget";
import { PositionsTable } from "../features/trading/components/PositionsTable";
import { ActivityFeed } from "../features/trading/components/ActivityFeed";
import { OrderEntry } from "../features/trading/components/OrderEntry";
import { Leaderboard } from "../features/copyTrading/components/Leaderboard";
import { BalanceCard } from "../features/portfolio/components/BalanceCard";
import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";

import { mockPositions, mockLeaderboard, mockActivity } from "../features/trading/data/fixtures";

export function DashboardPage() {
    const [activeFilter, setActiveFilter] = useState("1D");
    const [now] = useState(() => Date.now());

    return (
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_390px] gap-6 items-start w-full">
            {/* ── Center Feed (Main Content) ────────────────── */}
            <div className="flex flex-col gap-6 min-w-0">
                {/* Pro Forex Chart */}
                <ChartWidget activeFilter={activeFilter} setActiveFilter={setActiveFilter} />

                {/* Live Positions */}
                <PositionsTable positions={mockPositions} />

                {/* Refined Copy Leaderboard */}
                <div className="animate-fade-up delay-2 w-full">
                    <Leaderboard providers={mockLeaderboard} />
                </div>
            </div>

            {/* ── Right Rail (Widgets) ──────────────────────── */}
            <div className="flex flex-col gap-6 w-full">
                {/* Premium Balance Card Segment */}
                <div className="flex flex-col gap-4 animate-fade-up delay-1 w-full">
                    <BalanceCard />

                    <div className="flex gap-3">
                        <button className="flex-1 py-3.5 rounded-[16px] bg-surface border border-border/60 text-brand font-bold text-[13px] tracking-widest uppercase flex justify-center items-center gap-2 transition-colors duration-200 hover:bg-brand/10 hover:border-brand/40 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)]">
                            <ArrowDownToLine size={16} strokeWidth={2.5} />
                            Deposit
                        </button>
                        <button className="flex-1 py-3.5 rounded-[16px] bg-surface border border-border/60 text-text font-bold text-[13px] tracking-widest uppercase flex justify-center items-center gap-2 transition-colors duration-200 hover:bg-surface-elevated hover:border-border/80 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)]">
                            <ArrowUpFromLine size={16} strokeWidth={2.5} />
                            Withdraw
                        </button>
                    </div>
                </div>

                {/* Professional Order Entry */}
                <div className="animate-fade-up delay-2">
                    <OrderEntry />
                </div>

                {/* Recent Activity */}
                <div className="animate-fade-up delay-3 w-full">
                    <ActivityFeed events={mockActivity} now={now} />
                </div>
            </div>
        </div>
    );
}
