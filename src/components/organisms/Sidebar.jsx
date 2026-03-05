import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
    LayoutGrid, Wallet, LineChart, ArrowRightLeft,
    FileText, Newspaper, Settings, LogOut
} from 'lucide-react';

const SidebarItem = ({ id, label, icon, active, onClick, collapsed, isSettings, isDanger }) => {
    const [hovered, setHovered] = useState(false);
    const [coords, setCoords] = useState(null);
    const ref = useRef(null);

    const handleMouseEnter = () => {
        setHovered(true);
        if (collapsed && ref.current) {
            const rect = ref.current.getBoundingClientRect();
            setCoords({
                top: rect.top + rect.height / 2,
                left: rect.right + 12
            });
        }
    };

    const handleMouseLeave = () => {
        setHovered(false);
    };

    const isActive = active === id;

    // Determine conditional classes for hover and active states
    let btnClass = 'bg-transparent text-text-muted hover:bg-surface-elevated/40 hover:text-text';
    if (isDanger) btnClass = 'bg-transparent text-text-muted hover:bg-negative/10 hover:text-negative';
    else if (isActive && isSettings) btnClass = 'bg-surface-elevated text-text shadow-sm';
    else if (isActive) btnClass = 'bg-primary/10 text-primary shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]';

    let iconClass = 'group-hover:text-text group-hover:scale-105';
    if (isDanger) iconClass = 'group-hover:text-negative';
    else if (isSettings && isActive) iconClass = 'text-text scale-110';
    else if (isSettings) iconClass = 'group-hover:text-text group-hover:rotate-90';
    else if (isActive) iconClass = 'text-primary scale-110 drop-shadow-[0_0_8px_rgba(122,248,106,0.4)]';

    return (
        <button
            ref={ref}
            onClick={() => onClick(id)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`relative flex items-center gap-3 rounded-xl border-none cursor-pointer outline-none whitespace-nowrap overflow-hidden group transition-all duration-200 w-full px-3 py-2.5 justify-start ${btnClass}`}
        >
            {/* Active Indicator Pip */}
            {isActive && !isSettings && !isDanger && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[40%] bg-primary rounded-r-full shadow-glow-primary transition-transform duration-300"></div>
            )}

            <span className={`shrink-0 flex transition-all duration-300 ${iconClass}`}>
                {icon}
            </span>

            <span className={`text-[13px] font-body tracking-wide transition-opacity duration-200 ${collapsed ? 'opacity-0' : 'opacity-100'} ${isActive && !isSettings ? 'font-bold' : 'font-medium'}`}>
                {label}
            </span>

            {/* Portal Tooltip for Collapsed State */}
            {collapsed && hovered && coords && createPortal(
                <div
                    className="fixed z-[99999] bg-surface-elevated/95 backdrop-blur-md border-[0.5px] border-border text-text px-3 py-1.5 rounded-lg text-[12px] font-body font-medium shadow-2xl pointer-events-none"
                    style={{
                        top: coords.top,
                        left: coords.left,
                        transform: 'translateY(-50%)'
                    }}
                >
                    {label}
                </div>,
                document.body
            )}
        </button>
    );
};

export function Sidebar({ active, setActive, collapsed }) {
    const items = [
        { id: "dashboard", label: "Overview", icon: <LayoutGrid size={18} strokeWidth={2} /> },
        { id: "wallet", label: "My Wallet", icon: <Wallet size={18} strokeWidth={2} /> },
        { id: "market", label: "Market", icon: <LineChart size={18} strokeWidth={2} /> },
        { id: "transaction", label: "Transactions", icon: <ArrowRightLeft size={18} strokeWidth={2} /> },
        { id: "invoices", label: "Invoices", icon: <FileText size={18} strokeWidth={2} /> },
        { id: "news", label: "News & Insights", icon: <Newspaper size={18} strokeWidth={2} /> },
    ];

    return (
        <nav
            aria-label="Main Navigation"
            className={`fixed left-0 top-0 h-screen z-[100] transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col overflow-hidden bg-surface/40 backdrop-blur-xl border-r border-[#ffffff05] shadow-[4px_0_24px_-10px_rgba(0,0,0,0.1)] px-3 py-5
                ${collapsed ? 'w-[64px]' : 'w-[220px]'}`}
        >
            {/* Logo Area */}
            <div className={`flex items-center gap-3 mb-10 transition-all duration-300 mt-2 px-1`}>
                <div className="relative w-9 h-9 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(122,248,106,0.3)] group-hover:shadow-[0_0_30px_rgba(122,248,106,0.5)] transition-shadow duration-300">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--color-bg)" className="relative z-10">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                </div>

                <div className={`flex flex-col justify-center transition-opacity duration-200 whitespace-nowrap ${collapsed ? 'opacity-0' : 'opacity-100'}`}>
                    <span className="font-heading font-black text-[15px] tracking-[-0.04em] leading-none text-transparent bg-clip-text bg-gradient-to-br from-text to-text-muted pb-0.5">
                        LIVETRADE<span className="text-primary">.</span>
                    </span>
                    <span className="font-display text-[7px] font-bold tracking-[0.35em] uppercase text-primary/80 mt-1 pl-[1px]">
                        Pro Terminal
                    </span>
                </div>
            </div>

            {/* Nav Items */}
            <div className="flex-1 flex flex-col gap-1.5">
                {items.map(item => (
                    <SidebarItem
                        key={item.id}
                        {...item}
                        active={active}
                        onClick={setActive}
                        collapsed={collapsed}
                    />
                ))}
            </div>

            {/* Bottom Actions Area */}
            <div className="mt-auto pt-4 flex flex-col gap-1 relative before:absolute before:top-0 before:left-3 before:right-3 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-border before:to-transparent">
                <SidebarItem
                    id="settings"
                    label="Settings"
                    icon={<Settings size={18} strokeWidth={2} />}
                    active={active}
                    onClick={setActive}
                    collapsed={collapsed}
                    isSettings={true}
                />
                <SidebarItem
                    id="logout"
                    label="Log Out"
                    icon={<LogOut size={18} strokeWidth={2} />}
                    active={active}
                    onClick={setActive}
                    collapsed={collapsed}
                    isDanger={true}
                />
            </div>
        </nav>
    );
}
