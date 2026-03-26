import { useState, useEffect, useCallback } from 'react';
import { Globe, X, ChevronDown, Zap, Sun, Moon } from 'lucide-react';
import TradingViewWidget from '../../components/ui/TradingViewWidget';
import { WatchlistPanel }  from '../../features/trading/components/WatchlistPanel';
import { OrderBookPanel }  from '../../features/trading/components/OrderBookPanel';
import { OrderPanel }      from '../../features/trading/components/OrderPanel';
import { BottomPanel }     from '../../features/trading/components/BottomPanel';
import { useTicker }       from '../../features/trading/hooks/useTicker';

const MODES = ['spot', 'margin', 'futures'];
const LS_KEY = 'app-theme';

export function TerminalPage() {
    const [mode, setMode] = useState('spot');
    const ticker = useTicker();

    // ── Theme ────────────────────────────────────────────────────────────
    const [theme, setTheme] = useState(() => {
        // On first render, read from localStorage (default dark)
        try { return localStorage.getItem(LS_KEY) || 'dark'; }
        catch { return 'dark'; }
    });

    // Sync <html> class and localStorage whenever theme changes
    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
            root.setAttribute('data-theme', 'dark');
        } else {
            root.classList.remove('dark');
            root.setAttribute('data-theme', 'light');
        }
        try { localStorage.setItem(LS_KEY, theme); } catch {}
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme(t => t === 'dark' ? 'light' : 'dark');
    }, []);

    const isDark = theme === 'dark';

    // ── Render ───────────────────────────────────────────────────────────
    return (
        <div className="w-screen h-screen overflow-hidden flex flex-col bg-bg text-text transition-colors duration-300">

            {/* ══ TOP BAR ══════════════════════════════════════════════════ */}
            <header className="shrink-0 h-[52px] flex items-center border-b border-border/60 bg-bg/80 backdrop-blur-md shadow-sm px-4 gap-4 transition-all duration-300">

                {/* Brand */}
                <div className="flex items-center gap-2.5 pr-4 border-r border-border/40 shrink-0">
                    <div className="w-7 h-7 rounded-[8px] bg-primary flex items-center justify-center">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--bg)">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <span className="font-heading font-black text-[14px] tracking-tight text-text leading-none">
                        LIVETRADE<span className="text-primary">.</span>
                        <span className="block text-[8px] font-bold tracking-[0.4em] text-primary/60 uppercase">Pro Terminal</span>
                    </span>
                </div>

                {/* Pair + Live Price */}
                <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                            <Globe size={12} className="text-primary" />
                        </div>
                        <span className="font-heading font-black text-[13px] tracking-tight text-text">EUR/USD</span>
                        <ChevronDown size={11} className="text-text-muted/40" />
                    </div>
                    <div className="w-px h-5 bg-border/40" />
                    <span className={`font-mono font-black text-[16px] tracking-tighter transition-colors duration-300 ${ticker.up ? 'text-positive' : 'text-negative'}`}>
                        {ticker.price.toFixed(4)}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm ${ticker.up ? 'text-positive bg-positive/10' : 'text-negative bg-negative/10'}`}>
                        {ticker.changePercent >= 0 ? '+' : ''}{ticker.changePercent.toFixed(2)}%
                    </span>
                    {/* H / L / Vol / Spread */}
                    <div className="hidden xl:flex items-center gap-4 pl-3 border-l border-border/25">
                        {[
                            { label: 'H',      value: (ticker.price + 0.0012).toFixed(4) },
                            { label: 'L',      value: (ticker.price - 0.0008).toFixed(4) },
                            { label: 'Vol',    value: '142.5B',  cls: 'text-primary' },
                            { label: 'Spread', value: '0.0002' },
                        ].map(s => (
                            <div key={s.label} className="flex flex-col gap-0.5">
                                <span className="text-[8px] uppercase tracking-widest text-text-muted/40 font-black">{s.label}</span>
                                <span className={`font-mono text-[10px] font-bold ${s.cls || 'text-text/70'}`}>{s.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Center: Mode Switcher */}
                <div className="flex-1 flex justify-center">
                    <div className="flex p-[2px] bg-bg border border-border/30 rounded-lg">
                        {MODES.map(m => (
                            <button
                                key={m}
                                onClick={() => setMode(m)}
                                className={`px-5 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all duration-200 cursor-pointer ${
                                    mode === m
                                        ? 'bg-primary text-bg'
                                        : 'text-text-muted hover:text-text hover:bg-surface-bright/30'
                                }`}
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right: Live + Theme toggle + Latency + Close */}
                <div className="flex items-center gap-2.5 shrink-0">

                    {/* Live indicator */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-positive/10 border border-positive/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-positive animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-positive">Live</span>
                    </div>

                    {/* Latency */}
                    <div className="hidden sm:flex items-center gap-1 text-[10px] font-black">
                        <Zap size={10} className="text-primary/60" />
                        <span className="text-primary/60 font-mono">0.8ms</span>
                    </div>

                    <div className="w-px h-5 bg-border/30" />

                    {/* ── Dark / Light Mode Toggle ────────────────────── */}
                    {/* ── Dark / Light Mode Toggle ────────────────────── */}
                    <button
                        onClick={toggleTheme}
                        className="relative w-14 h-[28px] rounded-full bg-surface-elevated/60 ghost-border p-[3px] flex items-center transition-all duration-300 hover:border-border cursor-pointer group"
                        aria-label="Toggle dark mode"
                    >
                        <div className="w-full flex justify-between px-[5px] absolute inset-0 items-center pointer-events-none text-text-muted/30 group-hover:text-text-muted/50 transition-colors">
                            <Moon size={11} strokeWidth={3} />
                            <Sun size={11} strokeWidth={3} />
                        </div>
                        <div
                            className={`w-[20px] h-[20px] rounded-full bg-surface border-none flex items-center justify-center relative z-10 transition-transform duration-500 cubic-bezier(0.34,1.56,0.64,1) ${isDark ? 'translate-x-[26px] bg-primary/10 border-primary/30' : 'translate-x-0 bg-white border-border shadow-sm'}`}
                        >
                            {isDark ? (
                                <Moon size={12} strokeWidth={2.5} className="text-primary" />
                            ) : (
                                <Sun size={12} strokeWidth={2.5} className="text-warning" />
                            )}
                        </div>
                    </button>

                    <div className="w-px h-5 bg-border/30" />

                    {/* Close */}
                    <button
                        onClick={() => window.close()}
                        className="p-1.5 rounded-md hover:bg-negative/10 hover:text-negative text-text-muted/40 transition-all cursor-pointer border border-transparent hover:border-negative/20"
                        title="Close terminal"
                    >
                        <X size={14} />
                    </button>
                </div>
            </header>

            {/* ══ 4-ZONE GRID ══════════════════════════════════════════════ */}
            <div
                className="flex-1 min-h-0 bg-bg transition-colors duration-300"
                style={{
                    display: 'grid',
                    gridTemplateColumns: '280px 1fr 320px',
                    gridTemplateRows: '1fr 260px',
                    gridTemplateAreas: `
                        "watchlist chart sidebar"
                        "bottom    bottom sidebar"
                    `,
                    gap: '7px',
                    padding: '7px',
                }}
            >
                {/* Watchlist */}
                <div style={{ gridArea: 'watchlist' }} className="min-h-0 overflow-hidden">
                    <WatchlistPanel />
                </div>

                {/* Chart — TradingView widget, theme-aware */}
                <div
                    style={{ gridArea: 'chart' }}
                    className="min-h-0 overflow-hidden rounded-[8px] border border-border bg-surface-elevated transition-colors duration-300"
                >
                    {/* Key forces full remount when theme changes so widget re-renders with correct colors */}
                    <TradingViewWidget key={theme} symbol="FX:EURUSD" theme={isDark ? 'dark' : 'light'} />
                </div>

                {/* Right sidebar */}
                <div style={{ gridArea: 'sidebar' }} className="min-h-0 overflow-hidden flex flex-col gap-[6px]">
                    <div className="flex-1 min-h-0 overflow-hidden">
                        <OrderBookPanel />
                    </div>
                    <div className="shrink-0 h-[360px] overflow-hidden">
                        <OrderPanel type={mode} />
                    </div>
                </div>

                {/* Bottom */}
                <div style={{ gridArea: 'bottom' }} className="min-h-0 overflow-hidden">
                    <BottomPanel />
                </div>
            </div>
        </div>
    );
}
