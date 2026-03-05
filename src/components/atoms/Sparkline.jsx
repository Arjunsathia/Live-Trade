import { tokens } from '../../tokens/tokens';

export function Sparkline({ data, color = tokens.accent, width = 72, height = 28 }) {
    if (!data || data.length < 2) return null;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const pts = data.map((v, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((v - min) / range) * (height - 4) - 2;
        return `${x},${y}`;
    });
    const d = `M ${pts.join(" L ")}`;
    return (
        <svg width={width} height={height} className="overflow-visible">
            <defs>
                <filter id={`glow-${color.replace("#", "")}`}>
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
            </defs>
            <path d={d} fill="none" stroke={color} strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round"
                filter={`url(#glow-${color.replace("#", "")})`} />
        </svg>
    );
}
