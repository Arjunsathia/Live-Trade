import { LineChart, Line, ResponsiveContainer } from 'recharts';

const Sparkline = ({ data, positive }) => {
    const chartData = data.map((v, i) => ({ value: v, index: i }));
    const color = positive ? "var(--color-positive)" : "var(--color-negative)";

    return (
        <div className="w-[80px] h-[32px]">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke={color}
                        strokeWidth={1.5}
                        dot={false}
                        isAnimationActive={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export function TransactionRow({ icon, name, ticker, time, price, change, sparkData, positive }) {
    return (
        <div className="flex items-center gap-4 px-4 h-[72px] rounded-[16px] hover:bg-surface-elevated/50 hover:-translate-y-[2px] hover:shadow-md transition-all duration-200 cursor-pointer group mb-1 border-b-[0.5px] border-border-subtle last:border-b-0">

            {/* Icon */}
            <div className="w-10 h-10 rounded-full bg-surface-elevated border-[0.5px] border-border flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300">
                {icon}
            </div>

            {/* Name + Ticker */}
            <div className="flex-none w-[110px]">
                <div className="font-heading font-bold text-[14px] text-text tracking-tight mb-0.5">{name}</div>
                <div className="font-body font-medium text-[11px] text-text-muted tracking-wide uppercase">{ticker}</div>
            </div>

            {/* Timestamp */}
            <div className="font-body font-medium text-[12px] text-text-secondary flex-none w-[100px]">{time}</div>

            {/* Price + % Change */}
            <div className="flex-none w-[110px]">
                <div className="font-display font-bold text-[15px] text-text tracking-tight mb-0.5">{price}</div>
                <div className="flex items-center gap-1">
                    <span className={`inline-flex px-1.5 py-0.5 rounded-full text-[10px] font-bold ${positive ? 'bg-positive/10 text-positive' : 'bg-negative/10 text-negative'}`}>
                        {positive ? '▲' : '▼'} {change}
                    </span>
                </div>
            </div>

            {/* Mini Sparkline */}
            <div className="flex-1 flex justify-center opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                <Sparkline data={sparkData} positive={positive} />
            </div>

            {/* Trade Button */}
            <button className="px-[24px] py-[8px] rounded-full border border-border bg-transparent text-text-secondary font-body font-bold text-[12px] uppercase tracking-wide cursor-pointer hover:bg-primary hover:border-primary hover:text-text-on-accent hover:shadow-glow-primary active:scale-95 transition-all duration-200 hover:scale-[1.03]">
                Trade
            </button>
        </div>
    );
}
