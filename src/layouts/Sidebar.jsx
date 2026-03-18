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
    onHoverStart, onHoverEnd
}) => {
    const [expanded, setExpanded] = useState(false);
    const ref = useRef(null);

    const hasSubItems = subItems && subItems.length > 0;
    const isSubActive = hasSubItems && subItems.some(sub => active === sub.id || (sub.id === 'logout' && active === 'logout'));
    const isActive = active === id || isSubActive;

    useEffect(() => {
        if (isSubActive && !collapsed) setExpanded(true);
    }, [isSubActive, collapsed]);

    useEffect(() => {
        if (collapsed) setExpanded(false);
    }, [collapsed]);

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

    const handleParentClick = () => {
        if (onClick) onClick(id);
        if (hasSubItems && !collapsed && !expanded) {
            setExpanded(true);
        }
    };

    const handleToggleClick = (e) => {
        e.stopPropagation();
        setExpanded(prev => !prev);
    };

    let btnClass = 'text-text-muted hover:bg-surface-elevated/50 hover:text-text';
    if (isDanger) btnClass = 'text-text-muted hover:bg-negative/10 hover:text-negative';
    else if (isActive && isSettings) btnClass = 'bg-surface-elevated text-text shadow-sm';
    else if (isActive) btnClass = 'bg-primary/10 text-primary shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]';
    else if (expanded && !collapsed) btnClass = 'bg-surface-elevated/30 text-text shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]';

    let iconClass = 'transition-transform duration-200 group-hover:scale-110';
    if (isDanger) iconClass += ' group-hover:text-negative';
    else if (isSettings && isActive) iconClass = 'text-text scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]';
    else if (isActive) iconClass = 'text-primary scale-110 drop-shadow-[0_0_8px_rgba(122,248,106,0.3)]';
    else if (expanded && !collapsed) iconClass = 'text-text scale-110'; // Open but not fully active
    else if (isSettings) iconClass += ' group-hover:rotate-90 text-text-muted';

    let arrowClass = 'text-text-muted transition-transform duration-300';
    if (dropUp) {
        arrowClass += expanded ? ' rotate-0 text-brand' : ' rotate-180';
    } else {
        arrowClass += expanded ? ' rotate-180 text-brand' : ' rotate-0';
    }

    const AccordionContent = () => (
        <div
            className="grid transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ gridTemplateRows: expanded ? '1fr' : '0fr', opacity: expanded ? 1 : 0 }}
        >
            <div className="overflow-hidden">
                <div className={`flex flex-col gap-1 ml-[26px] pl-[26px] border-l border-border/30 relative ${dropUp ? 'mb-1.5' : 'mt-1.5'}`}>
                    {subItems.map(sub => {
                        const isSubItemSelected = active === sub.id;
                        const isSubDanger = sub.isDanger;
                        return (
                            <button
                                key={sub.id}
                                onClick={() => onClick(sub.id)}
                                className={`relative w-full text-left py-2 px-3 rounded-lg text-[13px] font-body transition-all duration-200 border-none cursor-pointer outline-none flex items-center group/sub
                                    ${isSubDanger 
                                        ? 'text-negative/80 hover:bg-negative/10 hover:text-negative' 
                                        : isSubItemSelected
                                            ? 'bg-primary/10 text-primary font-semibold'
                                            : 'text-text-muted hover:bg-surface-elevated/40 hover:text-text'
                                    }
                                `}
                            >
                                <div className={`absolute -left-[31px] top-1/2 -translate-y-1/2 rounded-full transition-all duration-200 
                                    ${isSubDanger ? 'w-1 h-1 bg-negative/50 group-hover/sub:bg-negative group-hover/sub:scale-150' : isSubItemSelected ? 'w-2 h-2 bg-primary shadow-[0_0_8px_var(--brand)]' : 'w-1 h-1 bg-border group-hover/sub:bg-text-muted group-hover/sub:scale-150'}`} 
                                />
                                {sub.icon && <span className="mr-2 opacity-70 group-hover/sub:opacity-100">{sub.icon}</span>}
                                {sub.label}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col w-full relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            {hasSubItems && !collapsed && dropUp && <AccordionContent />}

            <button
                ref={ref}
                onClick={handleParentClick}
                className={`relative flex items-center rounded-[14px] border-none cursor-pointer outline-none whitespace-nowrap overflow-hidden group transition-all duration-200 w-full px-3 py-3 ${collapsed ? 'justify-center gap-0' : 'justify-start gap-4'} ${btnClass}`}
            >
                {isActive && !isDanger && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[50%] bg-primary rounded-r-full shadow-[0_0_12px_var(--brand)] transition-transform duration-300 pointer-events-none" />
                )}

                <span className={`shrink-0 flex items-center justify-center transition-all duration-300 w-6 h-6 ${iconClass}`}>
                    {icon}
                </span>

                <span className={`text-[13px] font-body tracking-wide text-left transition-all duration-200 ${collapsed ? 'opacity-0 w-0 overflow-hidden' : 'flex-1 opacity-100'} ${isActive ? 'font-bold' : (expanded && !collapsed ? 'font-semibold' : 'font-medium')}`}>
                    {label}
                </span>

                {hasSubItems && !collapsed && (
                    <div
                        onClick={handleToggleClick}
                        className={`shrink-0 ml-auto w-6 h-6 flex items-center justify-center rounded-md hover:bg-surface-elevated transition-colors duration-200 z-10`}
                    >
                        <ChevronDown size={14} className={arrowClass} />
                    </div>
                )}
            </button>

            {hasSubItems && !collapsed && !dropUp && <AccordionContent />}
        </div>
    );
};

/* ───────────────────────────────────────────────────
   Sidebar Root
   ─────────────────────────────────────────────────── */
export function Sidebar({ collapsed }) {
    const navigate = useNavigate();
    const location = useLocation();

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
        if (path.length === 1) return path[0];
        return `${path[0]}-${path[1]}`;
    };

    const active = getActiveId();

    const items = [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutGrid size={20} strokeWidth={2} /> },
        {
            id: 'trade', label: 'Trade', icon: <LineChart size={20} strokeWidth={2} />,
            subItems: [
                { id: 'trade-spot',    label: 'Spot Trading' },
                { id: 'trade-margin',  label: 'Margin Trading' },
                { id: 'trade-futures', label: 'Futures Trading' },
            ]
        },
        {
            id: 'markets', label: 'Markets', icon: <Globe size={20} strokeWidth={2} />,
            subItems: [
                { id: 'markets-forex',       label: 'Forex' },
                { id: 'markets-crypto',      label: 'Crypto' },
                { id: 'markets-commodities', label: 'Commodities' },
                { id: 'markets-indices',     label: 'Indices' },
                { id: 'markets-watchlist',   label: 'Watchlist' },
            ]
        },
        {
            id: 'copy', label: 'Copy Trading', icon: <ArrowRightLeft size={20} strokeWidth={2} />,
            subItems: [
                { id: 'copy-discover',      label: 'Discover Strategies' },
                { id: 'copy-leaderboard',   label: 'Leaderboard' },
                { id: 'copy-subscriptions', label: 'My Subscriptions' },
                { id: 'copy-strategies',    label: 'My Strategies' },
            ]
        },
        {
            id: 'portfolio', label: 'Portfolio', icon: <FileText size={20} strokeWidth={2} />,
            subItems: [
                { id: 'portfolio-holdings',  label: 'Holdings' },
                { id: 'portfolio-positions', label: 'Open Positions' },
                { id: 'portfolio-history',   label: 'Trade History' },
                { id: 'portfolio-pnl',       label: 'PnL Analytics' },
            ]
        },
        {
            id: 'wallet', label: 'Wallet', icon: <Wallet size={20} strokeWidth={2} />,
            subItems: [
                { id: 'wallet-deposit',      label: 'Deposit' },
                { id: 'wallet-withdraw',     label: 'Withdraw' },
                { id: 'wallet-transactions', label: 'Transactions' },
            ]
        },
        {
            id: 'analytics', label: 'Analytics', icon: <BarChart3 size={20} strokeWidth={2} />,
            subItems: [
                { id: 'analytics-performance', label: 'Performance' },
                { id: 'analytics-risk',        label: 'Risk Metrics' },
                { id: 'analytics-equity',      label: 'Equity Curve' },
            ]
        },
    ];

    const routes = {
        'dashboard':              '/dashboard',
        'trade':                  '/trade/spot',
        'trade-spot':             '/trade/spot',
        'trade-margin':           '/trade/margin',
        'trade-futures':          '/trade/futures',
        'markets':                '/markets/forex',
        'markets-forex':          '/markets/forex',
        'markets-crypto':         '/markets/crypto',
        'markets-commodities':    '/markets/commodities',
        'markets-indices':        '/markets/indices',
        'markets-watchlist':      '/markets/watchlist',
        'copy':                   '/copy/discover',
        'copy-discover':          '/copy/discover',
        'copy-leaderboard':       '/copy/leaderboard',
        'copy-subscriptions':     '/copy/subscriptions',
        'copy-strategies':        '/copy/strategies',
        'portfolio':              '/portfolio/holdings',
        'portfolio-holdings':     '/portfolio/holdings',
        'portfolio-positions':    '/portfolio/positions',
        'portfolio-history':      '/portfolio/history',
        'portfolio-pnl':          '/portfolio/pnl',
        'wallet':                 '/wallet/deposit',
        'wallet-deposit':         '/wallet/deposit',
        'wallet-withdraw':        '/wallet/withdraw',
        'wallet-transactions':    '/wallet/transactions',
        'analytics':              '/analytics/performance',
        'analytics-performance':  '/analytics/performance',
        'analytics-risk':         '/analytics/risk',
        'analytics-equity':       '/analytics/equity',
        'settings':               '/settings/profile',
        'settings-profile':       '/settings/profile',
        'settings-security':      '/settings/security',
        'settings-kyc':           '/settings/kyc',
        'logout':                 '/login',
    };

    const handleNavigation = (id) => {
        navigate(routes[id] || `/${id}`);
        setHoverNode(null); // Hide portal strictly upon navigation
    };

    return (
        <nav
            aria-label="Main Navigation"
            className="fixed left-0 top-0 h-screen z-[100] flex flex-col py-6 shadow-[8px_0_32px_-12px_rgba(0,0,0,0.25)] border-r border-[#ffffff04] overflow-hidden"
            style={{
                width: collapsed ? '72px' : '248px',
                transition: 'width 0.3s cubic-bezier(0.16,1,0.3,1)',
                backgroundColor: 'color-mix(in srgb, var(--surface) 60%, transparent)',
                backdropFilter: 'blur(32px)',
            }}
        >
            <div className={`flex items-center mb-10 mt-1 transition-all duration-300 w-full ${collapsed ? 'justify-center' : 'px-6'}`}>
                <div className="relative w-10 h-10 rounded-[14px] flex items-center justify-center shrink-0 bg-primary shadow-[0_4px_20px_color-mix(in srgb,var(--brand)_40%,transparent)]">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="var(--bg)" className="relative z-10">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                </div>
                <div className={`whitespace-nowrap overflow-hidden transition-all duration-200 flex flex-col justify-center ${collapsed ? 'w-0 opacity-0 ml-0' : 'w-[120px] opacity-100 ml-4'}`}>
                    <span className="font-heading font-black text-[17px] tracking-[-0.03em] leading-none block pb-1 text-text">
                        LIVETRADE<span className="text-primary">.</span>
                    </span>
                    <span className="font-display text-[8px] font-bold tracking-[0.4em] uppercase block pl-[1px] text-primary/80">
                        Pro Terminal
                    </span>
                </div>
            </div>

            <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden sidebar-scroll px-3">
                <div className="flex flex-col gap-1.5 pb-2">
                {items.map(item => (
                    <SidebarItem
                        key={item.id}
                        {...item}
                        active={active}
                        onClick={handleNavigation}
                        collapsed={collapsed}
                        onHoverStart={handleHoverStart}
                        onHoverEnd={handleHoverEnd}
                    />
                ))}
                </div>
            </div>

            {/* ── Pinned Settings at absolute bottom ── */}
            <div className="pt-3 pb-1 px-3 border-t border-border/40 shrink-0">
                <SidebarItem
                    id="settings"
                    label="Settings"
                    icon={<Settings size={20} strokeWidth={2} />}
                    active={active}
                    onClick={handleNavigation}
                    collapsed={collapsed}
                    isSettings={true}
                    dropUp={true}
                    onHoverStart={handleHoverStart}
                    onHoverEnd={handleHoverEnd}
                    subItems={[
                        { id: 'settings-profile',  label: 'Profile' },
                        { id: 'settings-security', label: 'Security & 2FA' },
                        { id: 'settings-kyc',      label: 'KYC Verification' },
                        { id: 'logout',            label: 'Log Out', isDanger: true, icon: <LogOut size={14} /> },
                    ]}
                />
            </div>

            {/* ── Global Portal Rendering Engine ── */}
            {/* Renders exactly ONE portal dynamically based on the globally hovered item */}
            {collapsed && hoverNode && createPortal(
                <div
                    className="fixed z-[99999] bg-surface-elevated/95 backdrop-blur-xl border border-border/50 shadow-[0_12px_48px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)] rounded-2xl py-2 min-w-[200px] animate-in fade-in zoom-in-95 duration-200 pointer-events-auto flex flex-col"
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
                                            className={`w-full text-left py-2 px-3 rounded-xl text-[13px] font-body transition-all duration-200 border-none cursor-pointer outline-none flex items-center gap-2
                                                ${isSubDanger
                                                    ? 'text-negative/80 hover:bg-negative/10 hover:text-negative'
                                                    : isSubItemSelected 
                                                        ? 'bg-primary/15 text-primary font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]' 
                                                        : 'text-text-muted hover:bg-surface-elevated hover:text-text'
                                                }
                                            `}
                                        >
                                            {sub.icon && <span className="opacity-70">{sub.icon}</span>}
                                            {sub.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </>
                    ) : (
                        <div className="px-4 py-1.5 text-[13px] font-body font-medium text-text border-none flex items-center gap-2">
                            {hoverNode.item.label}
                        </div>
                    )}
                </div>,
                document.body
            )}
        </nav>
    );
}
