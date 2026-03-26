import { useState, useEffect } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from "recharts";
import { TrendingUp, Maximize2, ChevronDown, Activity, Layers, Crosshair } from "lucide-react";

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[#0B0E14] border border-white/10 shadow-2xl p-3 rounded-xl flex flex-col min-w-[140px] z-[100]">
                <p className="font-mono font-bold text-[10px] text-gray-400 uppercase tracking-[0.1em] mb-1.5 overflow-hidden">
                    {label}
                </p>
                <div className="flex items-center justify-between gap-4">
                    <span className="font-heading font-black text-[16px] text-text tracking-tighter">
                        ${payload[0].value.toLocaleString(undefined, { minimumFractionDigits: 5, maximumFractionDigits: 5 })}
                    </span>
                    <span className="text-[10px] font-mono text-positive font-bold uppercase">Live</span>
                </div>
            </div>
        );
    }
    return null;
};

const generateForexData = () => {
    const base = 1.08430;
    const count = 40;
    return Array.from({ length: count }, (_, i) => ({
        value: base + (Math.sin(i * 0.4) * 0.001) + (Math.random() * 0.001),
        indicator: base + (Math.sin(i * 0.4) * 0.0008),
        date: `${Math.floor(i / 2)}:${i % 2 === 0 ? '00' : '30'}`
    }));
};

export function ChartWidget({ activeFilter = "1D", setActiveFilter }) {
    const filters = ["1M", "5M", "15M", "1H", "4H", "1D", "1W"];
    const [chartData, setChartData] = useState(generateForexData(activeFilter));

    useEffect(() => {
        setChartData(generateForexData(activeFilter));
    }, [activeFilter]);

    const currentPrice = chartData.length > 0 ? chartData[chartData.length - 1].value : 1.08430;
    const isPositive = chartData.length > 0 ? currentPrice > chartData[0].value : true;

    return (
        <div className="bg-surface-elevated border border-border rounded-[8px] p-6 flex flex-col h-auto min-h-[400px] flex-1 relative overflow-hidden group/panel transition-all duration-500">

            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6 z-10 w-full">
                <div className="flex gap-4 items-center">
                    <div className="flex items-center gap-3 px-3 py-2 bg-surface-elevated border border-border/40 rounded-[14px]">
                        <div className="flex -space-x-2">
                            <div className="w-7 h-7 rounded-full bg-blue-600 border border-surface flex items-center justify-center overflow-hidden">
                                <img src="https://flagcdn.com/w40/eu.png" className="w-full h-full object-cover" alt="EU" />
                            </div>
                            <div className="w-7 h-7 rounded-full bg-red-600 border border-surface flex items-center justify-center overflow-hidden">
                                <img src="https://flagcdn.com/w40/us.png" className="w-full h-full object-cover" alt="US" />
                            </div>
                        </div>
                        <div className="flex flex-col min-w-[70px]">
                            <span className="font-heading font-black text-[16px] text-text leading-none">EUR/USD</span>
                            <span className="text-[10px] font-bold text-text-muted/60 uppercase tracking-widest mt-1">Forex Spot</span>
                        </div>
                        <ChevronDown size={14} className="text-text-muted" />
                    </div>

                    <div className="flex flex-col ml-2">
                        <div className="flex items-baseline gap-2">
                            <span className="font-mono font-bold text-[28px] text-text tabular-nums leading-none">
                                {currentPrice.toFixed(5)}
                            </span>
                            <span className={`text-[12px] font-bold ${isPositive ? 'text-positive' : 'text-negative'}`}>
                                {isPositive ? '+' : ''}24.5
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-1 bg-surface-bright/30 p-1 rounded-[8px] border border-border/40">
                    {filters.map(f => (
                        <button
                            key={f}
                            onClick={() => setActiveFilter && setActiveFilter(f)}
                            className={`px-3 py-1.5 text-[10px] rounded-[6px] font-extrabold transition-all uppercase tracking-widest
                                ${activeFilter === f ? 'bg-surface-elevated text-text shadow-sm border border-border/80' : 'text-text-muted hover:text-text hover:bg-surface/50'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chart Area - Dynamically Sized */}
            <div className="w-full flex-1 relative overflow-hidden min-h-[250px] mb-2" style={{ minWidth: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 60, left: 10, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorForex" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={isPositive ? 'var(--color-positive)' : 'var(--color-negative)'} stopOpacity={0.2} />
                                <stop offset="95%" stopColor={isPositive ? 'var(--color-positive)' : 'var(--color-negative)'} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            minTickGap={40}
                            tick={{ fill: "#666", fontSize: 10, fontFamily: 'monospace' }}
                        />
                        <YAxis
                            orientation="right"
                            axisLine={false}
                            tickLine={false}
                            domain={['auto', 'auto']}
                            tick={{ fill: "#666", fontSize: 10, fontFamily: 'monospace' }}
                            tickFormatter={(v) => v.toFixed(5)}
                        />
                        <Tooltip content={<CustomTooltip />} isAnimationActive={false} />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke={isPositive ? 'var(--color-positive)' : 'var(--color-negative)'}
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorForex)"
                            isAnimationActive={false}
                        />
                        <ReferenceLine
                            y={currentPrice}
                            stroke={isPositive ? 'var(--color-positive)' : 'var(--color-negative)'}
                            strokeDasharray="3 3"
                            label={{ position: 'right', value: currentPrice.toFixed(5), fill: isPositive ? 'var(--color-positive)' : 'var(--color-negative)', fontSize: 10, fontWeight: 'bold' }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 mt-auto border-t border-border/30">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-positive animate-pulse" />
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Market Live</span>
                </div>
                <div className="flex items-center gap-2 overflow-hidden">
                    <Activity size={14} className="text-text-muted" />
                    <span className="text-[10px] text-text-muted uppercase font-bold tracking-widest truncate">Live Data Stream</span>
                </div>
            </div>
        </div>
    );
}
