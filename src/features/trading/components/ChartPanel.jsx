import { Globe, BarChart3, Maximize2, Layers, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TradingViewWidget from '../../../components/ui/TradingViewWidget';
import { useTicker } from '../hooks/useTicker';

const MODES = ['spot', 'margin', 'futures'];

export function ChartPanel({ mode = 'spot', onModeChange }) {
    const ticker = useTicker();
    const navigate = useNavigate();

    const handleMode = (m) => {
        if (onModeChange) onModeChange(m);
        navigate(`/trade/${m}`, { replace: true });
    };

    return (
        <div className="h-full flex flex-col overflow-hidden rounded-[8px] bg-surface-elevated">

            {/* ── Chart Toolbar ──────────────────────────────────────────── */}
            <div
                className="shrink-0 flex items-center border-b border-border/40 px-3"
                style={{ height: '48px', gap: '0' }}
            >
                {/* Left: Pair Info */}
                <div className="flex items-center gap-3 pr-3 border-r border-border/25 shrink-0">
                    <div className="w-6 h-6 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center">
                        <Globe size={12} className="text-primary" />
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="font-heading font-black text-[13px] tracking-tight text-text">EUR/USD</span>
                        <ChevronDown size={11} className="text-text-muted/40" />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`font-mono font-black text-[14px] tracking-tighter transition-colors duration-300 ${ticker.up ? 'text-positive' : 'text-negative'}`}>
                            {ticker.price.toFixed(4)}
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm ${ticker.up ? 'text-positive bg-positive/10' : 'text-negative bg-negative/10'}`}>
                            {ticker.changePercent >= 0 ? '+' : ''}{ticker.changePercent.toFixed(2)}%
                        </span>
                    </div>
                    {/* H/L/Vol — hidden on smaller screens */}
                    <div className="hidden lg:flex items-center gap-3 pl-2 border-l border-border/20">
                        {[
                            { label: 'H', value: (ticker.price + 0.0012).toFixed(4) },
                            { label: 'L', value: (ticker.price - 0.0008).toFixed(4) },
                            { label: 'Vol', value: '142.5B', cls: 'text-primary' },
                        ].map(s => (
                            <div key={s.label} className="flex flex-col leading-none gap-0.5">
                                <span className="text-[8px] uppercase tracking-widest text-text-muted/40 font-black">{s.label}</span>
                                <span className={`font-mono text-[10px] font-bold ${s.cls || 'text-text/80'}`}>{s.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Center: Mode Switcher — flex-1 so it sits in the middle naturally */}
                <div className="flex-1 flex justify-center px-2">
                    <div className="flex p-[2px] bg-bg/60 rounded-lg">
                        {MODES.map(m => (
                            <button
                                key={m}
                                onClick={() => handleMode(m)}
                                className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all duration-200 cursor-pointer ${
                                    mode === m
                                        ? 'bg-primary/10 text-primary shadow-[0_0_12px_rgba(173,198,255,0.1)]'
                                        : 'text-text-muted hover:text-primary hover:bg-primary/5'
                                }`}
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right: Action icons */}
                <div className="flex items-center gap-0.5 shrink-0 pl-3 border-l border-border/20">
                    <button
                        title="Pro Chart (new tab)"
                        onClick={() => window.open(window.location.href.split('#')[0] + '#/trade/chart', '_blank')}
                        className="p-1.5 rounded-md text-text-muted/50 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer"
                    >
                        <Layers size={14} />
                    </button>
                    <button title="Indicators" className="p-1.5 rounded-md text-text-muted/50 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer">
                        <BarChart3 size={14} />
                    </button>
                    <button
                        title="Fullscreen Terminal"
                        onClick={() => window.open(window.location.href.split('#')[0] + '#/terminal', '_blank')}
                        className="p-1.5 rounded-md text-text-muted/50 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer"
                    >
                        <Maximize2 size={14} />
                    </button>
                </div>
            </div>

            {/* ── TradingView Chart ──────────────────────────────────────── */}
            <div className="flex-1 min-h-0 w-full overflow-hidden bg-bg">
                <TradingViewWidget symbol="FX:EURUSD" theme="dark" />
            </div>
        </div>
    );
}
