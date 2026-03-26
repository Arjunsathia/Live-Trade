import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutGrid, Wallet, LineChart, ArrowRightLeft,
    FileText, BarChart3, Settings, LogOut, ChevronDown,
    Globe
} from 'lucide-react';

/* ───────────────────────────────────────────────────
   SidebarItem — accordion only (portal handled globally)
   ─────────────────────────────────────────────────── */
const SidebarItem = ({
    id, label, icon, active, onClick, collapsed,
    isSettings, isDanger, subItems, dropUp,
    onHoverStart, onHoverEnd,
    isExpanded, onToggle
}) => {
    const ref = useRef(null);

    const hasSubItems = subItems && subItems.length > 0;
    const isSubActive = hasSubItems && subItems.some(sub => active === sub.id || (sub.id === 'logout' && active === 'logout'));
    const isActive = active === id || isSubActive;

    const handleToggleClick = (e) => {
        e.stopPropagation();
        onToggle(id);
    };

    const handleParentClick = () => {
        if (hasSubItems && !collapsed) {
            onToggle(id);
            onClick(id);
        } else {
            onClick(id);
        }
    };

    const handleMouseEnter = () => {
        if (collapsed && ref.current) {
            const rect = ref.current.getBoundingClientRect();
            onHoverStart({ id, label, icon, subItems, dropUp, isDanger }, rect);
        }
    };

    const handleMouseLeave = () => {
        if (collapsed) {
            onHoverEnd();
        }
    };

    // ── PREMIUM HIGHLIGHTING ──────────────────────────────────────────
    const baseClass = 'rounded-[8px] transition-all duration-400';
    let btnClass    = `text-text-muted/60 hover:bg-white/5 hover:text-text hover:translate-x-1 ${baseClass}`;

    if (isDanger) {
        btnClass = `text-text-muted/60 hover:bg-negative/10 hover:text-negative hover:translate-x-1 ${baseClass}`;
    } else if (isActive) {
        // Updated to matched 8px rounding for consistency with dashboard cards
        btnClass = `bg-muted-surface text-text shadow-md border border-white/5 ${baseClass}`;
    } else if (isExpanded && !collapsed) {
        btnClass = `bg-white/2 text-text/80 hover:translate-x-1 ${baseClass}`;
    }

    let iconClass = 'transition-all duration-400';
    if (isDanger) iconClass += ' group-hover:text-negative';
    else if (isActive) iconClass += ' text-primary scale-105';
    else iconClass += ' group-hover:text-primary';

    const arrowClass = `ml-auto transition-transform duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isExpanded ? 'rotate-180 text-primary' : 'rotate-0 text-white/10'}`;

    const AccordionContent = () => (
        <div
            className="grid transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] overflow-hidden"
            style={{
                gridTemplateRows: isExpanded ? '1fr' : '0fr',
                opacity: isExpanded ? 1 : 0,
            }}
        >
            <div className="overflow-hidden">
                <div className={`flex flex-col gap-1 ml-6 pl-4 border-l border-white/5 relative ${dropUp ? 'mb-2' : 'mt-1'}`}>
                    {subItems.map(sub => {
                        const isSubItemSelected = active === sub.id;
                        const isSubDanger = sub.isDanger;
                        return (
                            <button
                                key={sub.id}
                                onClick={() => onClick(sub.id)}
                                className={`relative w-full text-left py-2 px-3 rounded-lg text-[12px] font-heading font-bold tracking-tight transition-all duration-400 border-none cursor-pointer outline-none flex items-center group/sub hover:translate-x-1
                                    ${isSubDanger
                                        ? 'text-negative/60 hover:bg-negative/10'
                                        : isSubItemSelected
                                            ? 'bg-primary/20 text-text shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]'
                                            : 'text-text-muted/60 hover:text-text'
                                    }
                                `}
                            >
                                <div className={`absolute -left-[18.5px] top-1/2 -translate-y-1/2 transition-all duration-400 
                                    ${isSubItemSelected ? 'w-1 h-3 bg-primary rounded-full' : 'w-1 h-1 bg-white/10 rounded-full group-hover/sub:bg-primary/30'}`}
                                />
                                {sub.icon && <span className="mr-2.5 opacity-40 group-hover/sub:opacity-100 transition-opacity">{sub.icon}</span>}
                                {sub.label}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col w-full relative group/item" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            {hasSubItems && !collapsed && dropUp && <AccordionContent />}

            <button
                ref={ref}
                onClick={handleParentClick}
                className={`relative flex items-center cursor-pointer outline-none whitespace-nowrap overflow-hidden transition-all duration-400 w-full px-4 py-3.5 ${collapsed ? 'justify-center gap-0' : 'justify-start gap-4'} ${btnClass}`}
            >
                {/* Visual Blade Indicator — Subtle alignment with the new pill shape */}
                {isActive && !collapsed && (
                    <div className="absolute left-[3px] top-[15%] bottom-[15%] w-[3px] bg-primary shadow-[0_0_12px_rgba(var(--primary-rgb),0.5)] rounded-full animate-in fade-in slide-in-from-left-full duration-400" />
                )}

                <div className={`shrink-0 flex items-center justify-center transition-all duration-400 w-5 h-5 ${iconClass}`}>
                    {icon}
                </div>

                <div className={`flex-1 transition-all duration-400 flex items-center ${collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
                    <span className={`text-[13px] font-heading font-bold tracking-[-0.01em] transition-all duration-400 ${isActive ? 'text-text' : 'text-text-muted/60 group-hover/item:text-text/90'}`}>
                        {label}
                    </span>

                    {hasSubItems && (
                        <ChevronDown size={14} strokeWidth={2.5} className={arrowClass} />
                    )}
                </div>
            </button>

            {hasSubItems && !collapsed && !dropUp && <AccordionContent />}
        </div>
    );
};

const routes = {
    'dashboard': '/dashboard',
    'trade': '/trade/overview',
    'trade-terminal': '/terminal',
    'trade-pro-chart': '/trade/chart',
    'trade-orders': '/trade/orders',
    'trade-positions': '/trade/positions',
    'trade-history': '/trade/history',
    'markets': '/markets/forex',
    'markets-forex': '/markets/forex',
    'markets-crypto': '/markets/crypto',
    'markets-commodities': '/markets/commodities',
    'markets-indices': '/markets/indices',
    'markets-watchlist': '/markets/watchlist',
    'copy': '/copy/discover',
    'copy-discover': '/copy/discover',
    'copy-leaderboard': '/copy/leaderboard',
    'copy-subscriptions': '/copy/subscriptions',
    'copy-strategies': '/copy/strategies',
    'portfolio': '/portfolio/holdings',
    'portfolio-holdings': '/portfolio/holdings',
    'portfolio-positions': '/portfolio/positions',
    'portfolio-history': '/portfolio/history',
    'portfolio-pnl': '/portfolio/pnl',
    'wallet': '/wallet/deposit',
    'wallet-deposit': '/wallet/deposit',
    'wallet-withdraw': '/wallet/withdraw',
    'wallet-transactions': '/wallet/transactions',
    'analytics': '/analytics/performance',
    'analytics-performance': '/analytics/performance',
    'analytics-risk': '/analytics/risk',
    'analytics-equity': '/analytics/equity',
    'settings': '/settings',
};

const items = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutGrid size={18} strokeWidth={2.5} /> },
    {
        id: 'trade', label: 'Trade', icon: <LineChart size={18} strokeWidth={2.5} />,
        subItems: [
            { id: 'trade-terminal', label: 'Terminal' },
            { id: 'trade-pro-chart', label: 'Pro Chart' },
            { id: 'trade-orders', label: 'Open Orders' },
            { id: 'trade-positions', label: 'Position' },
            { id: 'trade-history', label: 'Trade History' },
        ]
    },
    {
        id: 'markets', label: 'Markets', icon: <Globe size={18} strokeWidth={2.5} />,
        subItems: [
            { id: 'markets-forex', label: 'Forex' },
            { id: 'markets-crypto', label: 'Crypto' },
            { id: 'markets-commodities', label: 'Commodities' },
            { id: 'markets-indices', label: 'Indices' },
            { id: 'markets-watchlist', label: 'Watchlist' },
        ]
    },
    {
        id: 'copy', label: 'Copy Trading', icon: <ArrowRightLeft size={18} strokeWidth={2.5} />,
        subItems: [
            { id: 'copy-discover', label: 'Discover Strategies' },
            { id: 'copy-leaderboard', label: 'Leaderboard' },
            { id: 'copy-subscriptions', label: 'My Subscriptions' },
            { id: 'copy-strategies', label: 'My Strategies' },
        ]
    },
    {
        id: 'portfolio', label: 'Portfolio', icon: <FileText size={18} strokeWidth={2.5} />,
        subItems: [
            { id: 'portfolio-holdings', label: 'Holdings' },
            { id: 'portfolio-positions', label: 'Open Position' },
            { id: 'portfolio-history', label: 'Trade History' },
            { id: 'portfolio-pnl', label: 'PnL Analytics' },
        ]
    },
    {
        id: 'wallet', label: 'Wallet', icon: <Wallet size={18} strokeWidth={2.5} />,
        subItems: [
            { id: 'wallet-deposit', label: 'Deposit' },
            { id: 'wallet-withdraw', label: 'Withdraw' },
            { id: 'wallet-transactions', label: 'Transactions' },
        ]
    },
    {
        id: 'analytics', label: 'Analytics', icon: <BarChart3 size={18} strokeWidth={2.5} />,
        subItems: [
            { id: 'analytics-performance', label: 'Performance' },
            { id: 'analytics-risk', label: 'Risk Metrics' },
            { id: 'analytics-equity', label: 'Equity Curve' },
        ]
    },
];

/* ───────────────────────────────────────────────────
   Sidebar Root
   ─────────────────────────────────────────────────── */
export function Sidebar({ collapsed }) {
    const navigate = useNavigate();
    const location = useLocation();

    // ── Accordion State ──────────────────────────────────────────────
    const [expandedId, setExpandedId] = useState(null);

    // Global Hover Portal State
    const [hoverNode, setHoverNode] = useState(null);
    const hoverTimer = useRef(null);

    const handleHoverStart = useCallback((itemData, rect) => {
        clearTimeout(hoverTimer.current);
        const coords = itemData.dropUp
            ? { bottom: window.innerHeight - rect.bottom, left: 74 }
            : { top: rect.top, left: 74 };
        setHoverNode({ item: itemData, coords });
    }, []);

    const handleHoverEnd = useCallback(() => {
        hoverTimer.current = setTimeout(() => {
            setHoverNode(null);
        }, 150); // fast crisp clear to prevent clipping into the next item
    }, []);

    useEffect(() => () => clearTimeout(hoverTimer.current), []);

    const getActiveId = () => {
        const path = location.pathname.split('/').filter(Boolean);
        if (path.length === 0) return 'dashboard';

        const currentRoute = `/${path.join('/')}`;


        // 1. Try exact match in routes map
        const exactId = Object.entries(routes).find(([id, r]) => r === currentRoute)?.[0];
        if (exactId) return exactId;

        // 2. Try prefix match (for parent categories like /trade)
        const prefixId = Object.entries(routes).find(([id, r]) => currentRoute.startsWith(r) && id !== 'dashboard')?.[0];
        if (prefixId) return prefixId;

        // 3. Fallback segments
        if (path.length === 1) return path[0];
        return `${path[0]}-${path[1]}`;
    };

    const active = getActiveId();

    // Auto-expand active category on mount or transition
    useEffect(() => {
        if (!collapsed) {
            const path = location.pathname.split('/').filter(Boolean)[0];
            if (path) setExpandedId(path);
        }
    }, [collapsed, location.pathname]);

    const handleToggle = (id) => {
        setExpandedId(prev => prev === id ? null : id);
    };

    const handleNavigation = (id) => {
        // Trading Terminal always opens as a standalone new tab
        if (id === 'trade-terminal') {
            const base = window.location.href.split('#')[0];
            window.open(`${base}#/terminal`, '_blank', 'noopener,noreferrer');
            setHoverNode(null);
            return;
        }
        navigate(routes[id] || `/${id}`);
        setHoverNode(null);
    };

    return (
        <nav
            aria-label="Main Navigation"
            className="fixed left-0 top-0 h-screen max-h-screen z-[100] flex flex-col border-r border-border/10 overflow-hidden"
            style={{
                width: collapsed ? '72px' : '248px',
                transition: 'width 0.4s cubic-bezier(0.16,1,0.3,1)',
                backgroundColor: 'var(--surface-2)',
            }}
        >
            <style>{`.sidebar-scroll::-webkit-scrollbar { display: none; } .sidebar-scroll { -ms-overflow-style: none; scrollbar-width: none; }`}</style>

            {/* Logo Section — Modern Stacked Design */}
            <div className={`flex items-center shrink-0 transition-all duration-400 w-full ${collapsed ? 'justify-center h-[90px]' : 'px-6 h-[90px]'}`}>
                <div className="relative w-10 h-10 rounded-[8px] flex items-center justify-center shrink-0 bg-primary shadow-[0_4px_20px_rgba(var(--primary-rgb),0.25)]">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="var(--bg)" className="relative z-10">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                    {/* Subtle Glow Ring */}
                    <div className="absolute inset-0 rounded-[8px] border border-white/20 z-0"></div>
                </div>
                {!collapsed && (
                    <div className="ml-3.5 flex flex-col justify-center animate-fade-in whitespace-nowrap overflow-hidden">
                        <span className="font-heading font-black text-[18px] tracking-[-0.02em] leading-none text-text uppercase">
                            LIVETRADE<span className="text-primary">.</span> <span className="text-primary text-[9px] font-black uppercase tracking-[0.3em] mt-1.5 opacity-80">PRO</span>
                        </span>
                    </div>
                )}
            </div>

            <div className="flex-1 min-h-0 flex flex-col overflow-y-auto overflow-x-hidden sidebar-scroll px-3.5 pb-12">
                <div className="flex flex-col gap-1.5 mt-4 pb-4">
                    {items.map(item => (
                        <SidebarItem
                            key={item.id}
                            {...item}
                            active={active}
                            onClick={handleNavigation}
                            collapsed={collapsed}
                            onHoverStart={(itemData, rect) => handleHoverStart(itemData, rect)}
                            onHoverEnd={handleHoverEnd}
                            isExpanded={expandedId === item.id}
                            onToggle={handleToggle}
                        />
                    ))}
                </div>
            </div>

            {/* ── Footer / Settings ── */}
            <div className="pt-4 px-4 border-t border-border/5 shrink-0">
                <SidebarItem
                    id="settings"
                    label="Settings"
                    icon={<Settings size={18} strokeWidth={2.5} />}
                    active={active}
                    onClick={handleNavigation}
                    collapsed={collapsed}
                    isSettings={true}
                    dropUp={true}
                    onHoverStart={(itemData, rect) => handleHoverStart(itemData, rect)}
                    onHoverEnd={handleHoverEnd}
                    isExpanded={expandedId === 'settings'}
                    onToggle={handleToggle}
                    subItems={[
                        { id: 'settings-profile', label: 'Profile' },
                        { id: 'settings-security', label: 'Security' },
                        { id: 'logout', label: 'Sign Out', isDanger: true, icon: <LogOut size={14} /> },
                    ]}
                />
            </div>

            {/* ── Global Portal Rendering Engine ── */}
            {/* Renders exactly ONE portal dynamically based on the globally hovered item */}
            {collapsed && hoverNode && createPortal(
                <div
                    className={`fixed z-[99999] animate-in fade-in zoom-in-95 duration-200 flex flex-col
                        ${hoverNode.item.subItems && hoverNode.item.subItems.length > 0
                            ? 'bg-surface-elevated/95 backdrop-blur-xl border border-border/50 shadow-[0_12px_48px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)] rounded-[8px] py-2 min-w-[200px] pointer-events-auto'
                            : 'bg-primary text-bg px-4 py-2 rounded-[8px] text-[11px] font-black uppercase tracking-widest shadow-[0_4px_20px_rgba(var(--primary-rgb),0.3)] pointer-events-none'
                        }
                    `}
                    style={{
                        ...(hoverNode.item.dropUp ? { bottom: hoverNode.coords.bottom } : { top: hoverNode.coords.top }),
                        left: hoverNode.coords.left
                    }}
                    onMouseEnter={() => { clearTimeout(hoverTimer.current); }}
                    onMouseLeave={handleHoverEnd}
                >
                    {hoverNode.item.subItems && hoverNode.item.subItems.length > 0 ? (
                        <>
                            <div className="px-4 pb-2 mb-2 border-b border-border/30 text-[10px] font-bold tracking-[0.15em] text-text-muted uppercase">
                                {hoverNode.item.label}
                            </div>
                            <div className="flex flex-col px-1.5 gap-0.5">
                                {hoverNode.item.subItems.map(sub => {
                                    const isSubItemSelected = active === sub.id;
                                    const isSubDanger = sub.isDanger;
                                    return (
                                        <button
                                            key={sub.id}
                                            onClick={() => handleNavigation(sub.id)}
                                            className={`relative w-full text-left py-2 px-3 rounded-lg text-[11px] font-bold tracking-wider uppercase transition-all duration-300 border-none cursor-pointer outline-none flex items-center group/sub hover:translate-x-1
                                                ${isSubDanger
                                                    ? 'text-negative/70 hover:bg-negative/10 hover:text-negative'
                                                    : isSubItemSelected
                                                        ? 'bg-primary/15 text-primary shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] border border-primary/20'
                                                        : 'text-text-muted/70 hover:text-text'
                                                }
                                            `}
                                        >
                                            <div className={`absolute left-0 top-1/2 -translate-y-1/2 transition-all duration-500 
                                                ${isSubItemSelected ? 'w-1 h-3 bg-primary rounded-full' : 'w-1 h-1 bg-border/40 rounded-full group-hover/sub:bg-primary/40'}`}
                                            />
                                            {sub.icon && <span className="mr-2.5 opacity-40 group-hover/sub:opacity-100 transition-opacity">{sub.icon}</span>}
                                            {sub.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </>
                    ) : (
                        <button
                            onClick={() => handleNavigation(hoverNode.item.id)}
                            className="bg-transparent border-none text-inherit font-inherit tracking-inherit flex items-center justify-center cursor-pointer outline-none"
                        >
                            {hoverNode.item.label}
                        </button>
                    )}
                </div>,
                document.body
            )}
        </nav>
    );
}
