import { useLocation } from 'react-router-dom';
import { Search, Sun, Moon, Bell, Command, ChevronLeft } from 'lucide-react';

export function Topbar({ collapsed, setCollapsed, theme, toggleTheme }) {
    const location = useLocation();

    // Derive page title from route — check sub-segment first for /trade/* overrides
    const SUB_TITLES = {
        'overview':  'Trade Overview',
        'orders':    'Open Orders',
        'positions': 'Positions',
        'history':   'Trade History',
        'chart':     'Pro Chart',
        'spot':      'Spot Trading',
        'margin':    'Margin Trading',
        'futures':   'Futures Trading',
    };
    const PAGE_TITLES = {
        '':             'Dashboard',
        'dashboard':    'Dashboard',
        'trade':        'Trading Terminal',
        'markets':      'Markets',
        'copy':         'Copy Trading',
        'portfolio':    'Portfolio',
        'wallet':       'Wallet',
        'analytics':    'Analytics',
        'settings':     'Settings',
        'login':        'Sign In',
        'register':     'Create Account',
    };
    const segments  = location.pathname.split('/').filter(Boolean);
    const seg0      = segments[0] || '';
    const seg1      = segments[1] || '';
    const pageTitle = SUB_TITLES[seg1] ?? PAGE_TITLES[seg0] ?? (seg0.charAt(0).toUpperCase() + seg0.slice(1));

    return (
        <header className="sticky top-0 w-full z-50 flex items-center justify-between px-6 h-16 bg-bg/60 backdrop-blur-xl border-b border-white/5 shadow-none transition-all duration-300">

            {/* Left Section: Menu Toggle & Title */}
            <div className="flex items-center gap-4 w-1/3">
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="relative w-9 h-9 flex items-center justify-center rounded-[8px] bg-surface-elevated/80 border border-white/5 transition-all duration-300 hidden xl:flex group cursor-pointer hover:bg-surface-bright"
                    aria-label="Toggle Sidebar"
                >
                    <div className={`relative flex items-center justify-center w-[22px] h-[22px] rounded-full bg-surface transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-active:scale-90 pointer-events-none ${collapsed ? '-rotate-180 border-primary/40' : 'rotate-0 border border-border/20'}`}>
                        <ChevronLeft size={13} strokeWidth={3} className={`relative right-[0.5px] transition-colors duration-300 ${collapsed ? 'text-primary' : 'text-text-muted group-hover:text-text'}`} />
                    </div>
                </button>

                <div className="hidden sm:flex flex-col justify-center pointer-events-none">
                    <h1 className="font-heading font-black text-[22px] text-text tracking-[-0.04em] leading-none m-0 pt-1">
                        {pageTitle}
                    </h1>
                </div>
            </div>

            {/* Center Section: Command Palette Style Search */}
            <div className="hidden lg:flex flex-1 justify-center w-1/3">
                <div className="relative flex items-center rounded-[8px] bg-surface-elevated/60 border border-white/5 w-[380px] h-[38px] transition-all duration-300 focus-within:bg-bg focus-within:border-primary/30 overflow-hidden group">
                    <div className="pl-3 pr-2 h-full flex items-center justify-center text-text-muted/60 group-focus-within:text-primary transition-colors">
                        <Search size={14} strokeWidth={2.5} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search markets, pairs, or providers..."
                        className="bg-transparent border-none outline-none text-text text-[13px] font-body w-full h-full placeholder:text-text-muted/40"
                        spellCheck="false"
                    />
                    <div className="pr-2 flex items-center justify-center">
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-[6px] bg-bg border border-white/5 text-text-muted/50 group-focus-within:opacity-0 transition-opacity">
                            <Command size={10} strokeWidth={2.5} />
                            <span className="text-[10px] font-mono font-bold">K</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Section: Actions */}
            <div className="flex items-center gap-3 justify-end w-1/3">

                {/* Live Status Indicator */}
                {location.pathname.includes('/trade/') && (
                    <div className="hidden xl:flex items-center gap-2 bg-surface-elevated/80 px-3 py-1.5 rounded-[8px] border border-white/5 mr-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-positive animate-pulse shadow-[0_0_8px_rgba(var(--positive-rgb),0.5)]"></span>
                        <span className="text-[10px] uppercase font-black text-positive tracking-widest">Live</span>
                    </div>
                )}

                {/* Modern Theme Toggler */}
                <button
                    onClick={toggleTheme}
                    className="relative w-14 h-[28px] rounded-full bg-surface-elevated/80 border border-white/5 p-[3px] flex items-center transition-all duration-300 hover:border-white/10 cursor-pointer group"
                    aria-label="Toggle dark mode"
                >
                    <div className="w-full flex justify-between px-[5px] absolute inset-0 items-center pointer-events-none text-text-muted/30 group-hover:text-text-muted/50 transition-colors">
                        <Moon size={11} strokeWidth={3} />
                        <Sun size={11} strokeWidth={3} />
                    </div>
                    <div
                        className={`w-[20px] h-[20px] rounded-full bg-surface border-none flex items-center justify-center relative z-10 transition-transform duration-500 cubic-bezier(0.34,1.56,0.64,1) ${theme === 'dark' ? 'translate-x-[26px] bg-primary/10 border-primary/30' : 'translate-x-0 bg-white border-border shadow-sm'}`}
                    >
                        {theme === 'dark' ? (
                            <Moon size={12} strokeWidth={2.5} className="text-primary" />
                        ) : (
                            <Sun size={12} strokeWidth={2.5} className="text-yellow-500" />
                        )}
                    </div>
                </button>

                {/* Notifications */}
                <button className="relative flex items-center justify-center w-9 h-9 rounded-[8px] bg-transparent hover:bg-surface-elevated/80 text-text-muted hover:text-text transition-all duration-300 group cursor-pointer border border-transparent hover:border-white/5">
                    <Bell size={17} strokeWidth={2} className="group-hover:origin-top group-hover:rotate-12 transition-transform duration-200" />
                    <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-tertiary ring-2 ring-bg transition-colors duration-300 z-10 box-content"></span>
                </button>

                <div className="w-[1px] h-5 bg-white/10 mx-1 hidden sm:block"></div>

                {/* Connect button */}
                <button className="hidden sm:flex items-center justify-center px-4 py-2 rounded-[8px] font-bold text-[12px] tracking-widest text-bg uppercase bg-primary transition-all duration-300 active:scale-[0.98] shadow-lg shadow-primary/20 hover:brightness-110">
                    Connect
                </button>

                {/* Avatar */}
                <div className="w-9 h-9 flex items-center justify-center rounded-[8px] bg-surface-elevated/80 text-text font-heading text-[13px] font-bold border border-white/5 cursor-pointer transition-all duration-300 hover:border-primary/50 hover:text-primary hover:shadow-glow-primary relative group shrink-0 ml-1 tracking-wider overflow-hidden">
                    JD
                    <div className="absolute inset-x-0 bottom-0 h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-full"></div>
                </div>
            </div>
        </header>
    );
}
