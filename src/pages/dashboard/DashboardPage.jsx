import { useState } from "react";
import { ChartWidget } from "../../features/market/components/ChartWidget";
import { PositionsTable } from "../../features/trading/components/PositionsTable";
import { ActivityTimeline } from "../../features/trading/components/ActivityTimeline";
import { CopyTradingSummary } from "../../features/trading/components/CopyTradingSummary";
import { OrderEntry } from "../../features/trading/components/OrderEntry";
import { Leaderboard } from "../../features/copyTrading/components/Leaderboard";

import { Plus, Landmark, LineChart, Layers, TrendingUp, ArrowUpRight } from "lucide-react";
import { mockPositions, mockLeaderboard } from "../../features/trading/data/fixtures";

export function DashboardPage() {
    const [activeFilter, setActiveFilter] = useState("1D");

    return (
        <div className="w-full flex justify-center pb-8">
            <div className="max-w-[1600px] w-full">

                {/* Dashboard Header */}
                <div className="mb-6 flex justify-end items-end">
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-surface-elevated border border-border/40 rounded-[8px] text-sm font-bold text-text hover:bg-surface-bright transition-colors">
                            Export Data
                        </button>
                        <button className="px-4 py-2 bg-primary text-bg rounded-[8px] text-sm font-bold hover:brightness-110 transition-all flex items-center gap-2">
                            <Plus size={16} strokeWidth={3} /> New Order
                        </button>
                    </div>
                </div>

                {/* Bento Grid Layout */}
                <div className="grid grid-cols-12 gap-5 w-full">

                    {/* Stat Cards Cluster */}
                    <div className="col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Total Balance */}
                        <div className="bg-surface-elevated p-5 rounded-[8px] border border-border relative overflow-hidden group">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[11px] uppercase tracking-widest text-text-muted font-bold">Total Balance</span>
                                <Landmark size={18} className="text-text-muted/60" />
                            </div>
                            <div className="text-2xl font-bold tracking-tight text-text font-heading">$42,500.24</div>
                            <div className="mt-2 text-[10px] text-text-muted font-medium">Combined assets across all wallets</div>
                        </div>

                        {/* Net Equity */}
                        <div className="bg-surface-elevated p-5 rounded-[8px] border border-border relative overflow-hidden group">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[11px] uppercase tracking-widest text-text-muted font-bold">Net Equity</span>
                                <LineChart size={18} className="text-text-muted/60" />
                            </div>
                            <div className="text-2xl font-bold tracking-tight text-text font-heading">$42,500.24</div>
                            <div className="mt-2 flex items-center gap-2">
                                <span className="text-[10px] text-positive font-bold tracking-widest">LIVE</span>
                                <div className="w-24 h-[4px] bg-surface-bright rounded-full overflow-hidden">
                                    <div className="h-full bg-positive w-full"></div>
                                </div>
                            </div>
                        </div>

                        {/* Available Margin */}
                        <div className="bg-surface-elevated p-5 rounded-[8px] border border-border relative overflow-hidden group">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[11px] uppercase tracking-widest text-text-muted font-bold">Avail. Margin</span>
                                <Layers size={18} className="text-text-muted/60" />
                            </div>
                            <div className="text-2xl font-bold tracking-tight text-text font-heading">$12,300.00</div>
                            <div className="mt-2 text-[10px] text-text-muted font-medium">28.9% Utilization</div>
                        </div>

                        {/* Today's PnL */}
                        <div className="bg-surface-elevated p-5 rounded-[8px] border border-border relative overflow-hidden group">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[11px] uppercase tracking-widest text-text-muted font-bold">Today's PnL</span>
                                <TrendingUp size={18} className="text-positive" />
                            </div>
                            <div className="text-2xl font-bold tracking-tight text-positive font-heading">+$450.12</div>
                            <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-positive">
                                <ArrowUpRight size={12} strokeWidth={3} /> 1.07%
                            </div>
                        </div>
                    </div>

                    {/* Middle Section: Chart + OrderEntry */}
                    <div className="col-span-12 lg:col-span-8 flex flex-col">
                        <ChartWidget activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
                    </div>
                    <div className="col-span-12 lg:col-span-4 flex flex-col">
                        <OrderEntry />
                    </div>

                    {/* Bottom Section: Positions Table + ActivityTimeline */}
                    <div className="col-span-12 lg:col-span-8 flex flex-col">
                        <PositionsTable positions={mockPositions} />
                    </div>
                    <div className="col-span-12 lg:col-span-4 flex flex-col">
                        <ActivityTimeline />
                    </div>

                    {/* Extra Sections: Leaderboard + CopyTradingSummary */}
                    <div className="col-span-12 lg:col-span-8 flex flex-col">
                        <Leaderboard providers={mockLeaderboard} />
                    </div>
                    <div className="col-span-12 lg:col-span-4 flex flex-col">
                        <CopyTradingSummary />
                    </div>

                </div>
            </div>
        </div>
    );
}
