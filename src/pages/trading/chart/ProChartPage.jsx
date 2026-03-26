import { useState } from 'react';
import {
    ArrowLeft, ChevronDown, Globe, BarChart3, Layers, TrendingUp,
    Maximize2, Settings, Activity, BookOpen,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TradingViewWidget from '../../../components/ui/TradingViewWidget';
import { useTicker } from '../../../features/trading/hooks/useTicker';

/* ── Constants ───────────────────────────────────────────────────── */
const PAIRS = [
    { label: 'EUR/USD', symbol: 'FX:EURUSD' },
    { label: 'GBP/USD', symbol: 'FX:GBPUSD' },
    { label: 'USD/JPY', symbol: 'FX:USDJPY' },
    { label: 'USD/CHF', symbol: 'FX:USDCHF' },
    { label: 'AUD/USD', symbol: 'FX:AUDUSD' },
    { label: 'BTC/USD', symbol: 'BITSTAMP:BTCUSD' },
];

const INTERVALS = ['1m', '5m', '15m', '1h', '4h', '1D', '1W'];

const CHART_TYPES = [
    { id: 'candles', label: 'Candles', icon: <BarChart3 size={13} /> },
    { id: 'line',    label: 'Line',    icon: <TrendingUp size={13} /> },
    { id: 'area',    label: 'Area',    icon: <Layers size={13} /> },
];

const LOT_PRESETS = [0.01, 0.05, 0.10, 0.50, 1.00];

/* ── Tiny label/value stat ───────────────────────────────────────── */
function Stat({ label, value, cls }) {
    return (
        <div className="flex flex-col leading-none gap-[3px]">
            <span className="text-[8px] uppercase tracking-[0.18em] text-text-muted/40 font-black">{label}</span>
            <span className={`font-mono text-[11px] font-bold ${cls || 'text-text/80'}`}>{value}</span>
        </div>
    );
}

/* ── Pill toggle group ───────────────────────────────────────────── */
function PillGroup({ items, active, onSelect, isIcon = false }) {
    return (
        <div className="flex p-[2px] bg-bg border border-border/25 rounded-lg shrink-0">
            {items.map(item => (
                <button
                    key={item.id ?? item}
                    onClick={() => onSelect(item.id ?? item)}
                    title={item.label ?? item}
                    className={`transition-all duration-150 cursor-pointer rounded-md font-black ${
                        isIcon ? 'p-1.5' : 'px-2.5 py-1 text-[10px]'
                    } ${
                        (item.id ?? item) === active
                            ? 'bg-primary/10 text-primary'
                            : 'text-text-muted hover:text-text hover:bg-surface-bright/30'
                    }`}
                >
                    {isIcon ? item.icon : item}
                </button>
            ))}
        </div>
    );
}

/* ── Right Panel ─────────────────────────────────────────────────── */
function RightPanel({ ticker, pair }) {
    const [side,      setSide]      = useState('BUY');
    const [orderType, setOrderType] = useState('MARKET');
    const [lots,      setLots]      = useState('0.10');
    const [limitPx,   setLimitPx]   = useState('');
    const [sl,        setSl]         = useState('');
    const [tp,        setTp]         = useState('');

    const bid    = (ticker.price - 0.0002).toFixed(4);
    const ask    = (ticker.price + 0.0002).toFixed(4);
    const spread = '0.2';

    const adjustLots = (delta) => {
        const next = Math.max(0.01, parseFloat(lots || 0) + delta);
        setLots(next.toFixed(2));
    };

    const execLabel = side === 'BUY' ? `▲ BUY @ ${ask}` : `▼ SELL @ ${bid}`;

    return (
        <div className="w-[268px] shrink-0 flex flex-col gap-3 h-full overflow-y-auto overflow-x-hidden custom-scrollbar">

            {/* ── Live Bid / Ask ───────────────────────── */}
            <div className="bg-surface-elevated border border-border/50 rounded-[8px] p-4 flex flex-col gap-3 shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center">
                        <Globe size={10} className="text-primary" />
                    </div>
                    <span className="font-heading font-black text-[13px] tracking-tight text-text flex-1">{pair.label}</span>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-positive/10 border border-positive/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-positive animate-pulse" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-positive">Live</span>
                    </div>
                </div>

                {/* Bid / Ask boxes */}
                <div className="grid grid-cols-2 gap-2">
                    <div className="bg-negative/8 border border-negative/20 rounded-[6px] p-2.5 text-center">
                        <div className="text-[8px] font-black uppercase tracking-widest text-negative/60 mb-1">Bid</div>
                        <div className="font-mono font-black text-[16px] text-negative leading-none">{bid}</div>
                    </div>
                    <div className="bg-positive/8 border border-positive/20 rounded-[6px] p-2.5 text-center">
                        <div className="text-[8px] font-black uppercase tracking-widest text-positive/60 mb-1">Ask</div>
                        <div className="font-mono font-black text-[16px] text-positive leading-none">{ask}</div>
                    </div>
                </div>

                <div className="flex items-center justify-between text-[9px] font-bold border-t border-border/20 pt-2">
                    <span className="uppercase tracking-widest text-text-muted/50">Spread</span>
                    <span className="font-mono text-text-muted">{spread} pips</span>
                </div>
            </div>

            {/* ── OHLCV ────────────────────────────────── */}
            <div className="bg-surface-elevated border border-border/50 rounded-[8px] p-4 shrink-0">
                <div className="text-[8px] font-black uppercase tracking-[0.18em] text-text-muted/40 mb-3">Session OHLCV</div>
                <div className="grid grid-cols-3 gap-x-2 gap-y-3">
                    <Stat label="Open"   value={(ticker.price - 0.0008).toFixed(4)} />
                    <Stat label="High"   value={(ticker.price + 0.0012).toFixed(4)} cls="text-positive" />
                    <Stat label="Low"    value={(ticker.price - 0.0021).toFixed(4)} cls="text-negative" />
                    <Stat label="Close"  value={ticker.price.toFixed(4)} />
                    <Stat label="Volume" value="142.5B" cls="text-primary" />
                    <Stat label="Chg%"   value={`${ticker.changePercent >= 0 ? '+' : ''}${ticker.changePercent.toFixed(2)}%`}
                          cls={ticker.up ? 'text-positive' : 'text-negative'} />
                </div>
            </div>

            {/* ── Quick Order ───────────────────────────── */}
            <div className="bg-surface-elevated border border-border/50 rounded-[8px] flex flex-col shrink-0 min-w-0">
                {/* Panel header */}
                <div className="px-4 py-3 border-b border-border/30 flex items-center gap-2">
                    <Activity size={11} className="text-primary" />
                    <span className="text-[9px] font-black uppercase tracking-[0.18em] text-text-muted">Quick Order</span>
                </div>

                <div className="p-4 flex flex-col gap-3.5">

                    {/* BUY / SELL toggle */}
                    <div className="flex rounded-[8px] overflow-hidden border border-border/40 shrink-0">
                        {['BUY', 'SELL'].map(s => (
                            <button
                                key={s}
                                onClick={() => setSide(s)}
                                className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all duration-200 cursor-pointer ${
                                    side === s
                                        ? s === 'BUY'
                                            ? 'bg-positive text-bg'
                                            : 'bg-negative text-bg'
                                        : 'bg-surface-bright/20 text-text-muted hover:text-text'
                                }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>

                    {/* Order Type */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[8px] font-black uppercase tracking-widest text-text-muted/50">Order Type</label>
                        <div className="flex gap-1.5">
                            {['MARKET', 'LIMIT', 'STOP'].map(t => (
                                <button
                                    key={t}
                                    onClick={() => setOrderType(t)}
                                    className={`flex-1 py-1.5 text-[8px] font-black rounded-[6px] uppercase tracking-widest transition-all cursor-pointer border ${
                                        orderType === t
                                            ? 'bg-primary/10 text-primary border-primary/30'
                                            : 'bg-bg text-text-muted border-border/25 hover:border-border/50 hover:text-text'
                                    }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Limit/Stop Price (only if not MARKET) */}
                    {orderType !== 'MARKET' && (
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[8px] font-black uppercase tracking-widest text-text-muted/50">
                                {orderType === 'LIMIT' ? 'Limit Price' : 'Stop Price'}
                            </label>
                            <div className="flex items-center gap-1.5 bg-bg border border-border/30 rounded-[6px] px-3 focus-within:border-primary/50 transition-colors">
                                <input
                                    type="number"
                                    value={limitPx}
                                    onChange={e => setLimitPx(e.target.value)}
                                    placeholder={ticker.price.toFixed(4)}
                                    className="flex-1 bg-transparent py-2 font-mono font-bold text-[12px] text-text placeholder:text-text-muted/30 focus:outline-none"
                                />
                                <span className="text-[9px] font-bold text-text-muted/40 shrink-0">USD</span>
                            </div>
                        </div>
                    )}

                    {/* Lot Size */}
                    <div className="flex flex-col gap-1.5 shrink-0">
                        <label className="text-[8px] font-black uppercase tracking-widest text-text-muted/40">Lot Size</label>
                        <div className="flex items-center gap-1 bg-bg border border-border/30 rounded-[6px] overflow-hidden group focus-within:border-primary/40">
                            <button
                                onClick={() => adjustLots(-0.01)}
                                className="w-9 h-9 flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-bright/20 transition-all cursor-pointer font-black text-base"
                            >−</button>
                            <input
                                type="number"
                                value={lots}
                                onChange={e => setLots(e.target.value)}
                                step="0.01"
                                min="0.01"
                                className="flex-1 bg-transparent text-center font-mono font-bold text-[13px] text-text focus:outline-none border-x border-border/10"
                            />
                            <button
                                onClick={() => adjustLots(0.01)}
                                className="w-9 h-9 flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-bright/20 transition-all cursor-pointer font-black text-base"
                            >+</button>
                        </div>
                        {/* Preset chips - use grid for strict alignment */}
                        <div className="grid grid-cols-5 gap-1">
                            {LOT_PRESETS.map(p => (
                                <button
                                    key={p}
                                    onClick={() => setLots(p.toFixed(2))}
                                    className={`py-1 rounded text-[8px] font-black cursor-pointer transition-all border ${
                                        parseFloat(lots) === p
                                            ? 'bg-primary/20 text-primary border-primary/40'
                                            : 'bg-bg text-text-muted/40 border-border/20 hover:text-text hover:border-border/50'
                                    }`}
                                >
                                    {p.toFixed(2)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Margin info for this lot */}
                    <div className="bg-bg/40 border border-border/10 rounded-[6px] px-3 py-2 flex items-center justify-between shrink-0">
                        <span className="text-[8px] font-black uppercase tracking-[0.15em] text-text-muted/30">Est. Margin</span>
                        <span className="font-mono text-[10px] font-bold text-text/60">
                            ${(parseFloat(lots || 0) * 1000 * 0.02).toFixed(2)}
                        </span>
                    </div>

                    {/* Stop Loss / Take Profit */}
                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-1">
                            <label className="text-[8px] font-black uppercase tracking-widest text-negative/60">Stop Loss</label>
                            <div className="flex items-center bg-bg border border-border/25 rounded-[6px] px-2 focus-within:border-negative/40 transition-colors">
                                <input
                                    type="number"
                                    value={sl}
                                    onChange={e => setSl(e.target.value)}
                                    placeholder="0.0000"
                                    className="flex-1 py-1.5 bg-transparent font-mono text-[11px] font-bold text-negative/80 placeholder:text-text-muted/25 focus:outline-none w-0"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[8px] font-black uppercase tracking-widest text-positive/60">Take Profit</label>
                            <div className="flex items-center bg-bg border border-border/25 rounded-[6px] px-2 focus-within:border-positive/40 transition-colors">
                                <input
                                    type="number"
                                    value={tp}
                                    onChange={e => setTp(e.target.value)}
                                    placeholder="0.0000"
                                    className="flex-1 py-1.5 bg-transparent font-mono text-[11px] font-bold text-positive/80 placeholder:text-text-muted/25 focus:outline-none w-0"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Execute */}
                    <button
                        className={`w-full py-3 rounded-[8px] font-black text-[11px] uppercase tracking-[0.12em] transition-all active:scale-[0.98] cursor-pointer shadow-lg ${
                            side === 'BUY'
                                ? 'bg-positive text-bg hover:brightness-110 shadow-positive/20'
                                : 'bg-negative text-bg hover:brightness-110 shadow-negative/20'
                        }`}
                    >
                        {execLabel}
                    </button>

                    {/* Account snapshot */}
                    <div className="pt-1 border-t border-border/20 flex flex-col gap-2">
                        {[
                            { label: 'Balance',     value: '$42,500.24' },
                            { label: 'Free Margin', value: '$12,300.00' },
                            { label: 'Margin Lvl',  value: '342.6%',   cls: 'text-positive' },
                        ].map(r => (
                            <div key={r.label} className="flex items-center justify-between">
                                <span className="text-[8px] font-black uppercase tracking-[0.15em] text-text-muted/40">{r.label}</span>
                                <span className={`font-mono text-[10px] font-bold ${r.cls || 'text-text/70'}`}>{r.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ── Main ProChartPage ───────────────────────────────────────────── */
export function ProChartPage() {
    const navigate  = useNavigate();
    const ticker    = useTicker();

    const [pair,      setPair]      = useState(PAIRS[0]);
    const [interval,  setInterval]  = useState('1h');
    const [chartType, setChartType] = useState('candles');
    const [showPairs, setShowPairs] = useState(false);
    const [showPanel, setShowPanel] = useState(true);

    return (
        <div className="flex flex-col h-full w-full gap-3 animate-fade-in">

            {/* ── Toolbar ──────────────────────────────────────────── */}
            <div className="shrink-0 h-[52px] flex items-center gap-3 px-4 bg-surface-elevated border border-border/50 rounded-[8px]">

                {/* Back */}
                <button
                    onClick={() => navigate('/trade/overview')}
                    className="p-1.5 rounded-md hover:bg-surface-bright/40 text-text-muted hover:text-text transition-all cursor-pointer border border-transparent hover:border-border/40 shrink-0"
                >
                    <ArrowLeft size={15} />
                </button>
                <div className="w-px h-6 bg-border/40 shrink-0" />

                {/* Pair Selector */}
                <div className="relative shrink-0">
                    <button
                        onClick={() => setShowPairs(v => !v)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg border border-border/30 hover:border-primary/40 transition-all cursor-pointer group"
                    >
                        <div className="w-5 h-5 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center shrink-0">
                            <Globe size={10} className="text-primary" />
                        </div>
                        <span className="font-heading font-black text-[13px] tracking-tight text-text">{pair.label}</span>
                        <ChevronDown size={11} className="text-text-muted/50 group-hover:text-primary transition-colors" />
                    </button>
                    {showPairs && (
                        <div className="absolute top-full left-0 mt-1.5 bg-surface-elevated border border-border/50 rounded-xl shadow-2xl z-50 py-1.5 min-w-[150px]">
                            {PAIRS.map(p => (
                                <button
                                    key={p.label}
                                    onClick={() => { setPair(p); setShowPairs(false); }}
                                    className={`w-full text-left px-4 py-2 text-[12px] font-bold transition-colors cursor-pointer ${
                                        p.label === pair.label
                                            ? 'text-primary bg-primary/10'
                                            : 'text-text-muted hover:text-text hover:bg-surface-bright/30'
                                    }`}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Live price */}
                <div className="flex items-center gap-2 shrink-0">
                    <span className={`font-mono font-black text-[16px] tracking-tighter transition-colors duration-300 ${ticker.up ? 'text-positive' : 'text-negative'}`}>
                        {ticker.price.toFixed(4)}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${ticker.up ? 'text-positive bg-positive/10' : 'text-negative bg-negative/10'}`}>
                        {ticker.changePercent >= 0 ? '+' : ''}{ticker.changePercent.toFixed(2)}%
                    </span>
                </div>

                <div className="w-px h-6 bg-border/30 shrink-0" />

                {/* OHLCV bar (xl+) */}
                <div className="hidden xl:flex items-center gap-5 shrink-0">
                    <Stat label="Open"   value={(ticker.price - 0.0008).toFixed(4)} />
                    <Stat label="High"   value={(ticker.price + 0.0012).toFixed(4)} cls="text-positive" />
                    <Stat label="Low"    value={(ticker.price - 0.0021).toFixed(4)} cls="text-negative" />
                    <Stat label="Vol"    value="142.5B" cls="text-primary" />
                    <Stat label="Spread" value="0.0002" />
                </div>

                <div className="flex-1" />

                {/* Interval pills */}
                <PillGroup items={INTERVALS} active={interval} onSelect={setInterval} />
                <div className="w-px h-6 bg-border/30 shrink-0" />

                {/* Chart type */}
                <PillGroup items={CHART_TYPES} active={chartType} onSelect={setChartType} isIcon />
                <div className="w-px h-6 bg-border/30 shrink-0" />

                {/* Extra actions */}
                <div className="flex items-center gap-1 text-text-muted/40 shrink-0">
                    <button
                        title="Order Panel"
                        onClick={() => setShowPanel(v => !v)}
                        className={`p-1.5 rounded-md hover:bg-surface-bright/40 transition-all cursor-pointer ${showPanel ? 'text-primary bg-primary/8' : 'hover:text-primary'}`}
                    >
                        <BookOpen size={14} />
                    </button>
                    <button title="Indicators" className="p-1.5 rounded-md hover:bg-surface-bright/40 hover:text-primary transition-all cursor-pointer">
                        <Activity size={14} />
                    </button>
                    <button title="Settings" className="p-1.5 rounded-md hover:bg-surface-bright/40 hover:text-primary transition-all cursor-pointer">
                        <Settings size={14} />
                    </button>
                    <button
                        title="Full Terminal"
                        onClick={() => window.open(window.location.href.split('#')[0] + '#/terminal', '_blank')}
                        className="p-1.5 rounded-md hover:bg-surface-bright/40 hover:text-primary transition-all cursor-pointer"
                    >
                        <Maximize2 size={14} />
                    </button>
                </div>

                {/* Live badge */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-positive/10 border border-positive/20 shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-positive animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-positive">Live</span>
                </div>
            </div>

            {/* ── Body: Chart + Side Panel ─────────────────────────── */}
            <div className="flex flex-1 min-h-0 gap-3">
                {/* Chart */}
                <div className="flex-1 min-w-0 bg-surface-elevated border border-border/50 rounded-[8px] overflow-hidden">
                    <TradingViewWidget symbol={pair.symbol} theme="dark" hideToolbar={false} />
                </div>

                {/* Right panel */}
                {showPanel && <RightPanel ticker={ticker} pair={pair} />}
            </div>
        </div>
    );
}
