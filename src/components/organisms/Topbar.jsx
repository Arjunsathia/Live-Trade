import { Search, Sun, Moon, Bell, Command, ChevronLeft, ChevronRight } from 'lucide-react';

export function Topbar({ collapsed, setCollapsed, theme, toggleTheme }) {
    return (
        <header className="flex items-center justify-between px-6 h-[64px] bg-bg/80 backdrop-blur-3xl sticky top-0 z-50 transition-all duration-300 border-b border-border/40">

            {/* Left Section: Menu Toggle & Title */}
            <div className="flex items-center gap-4 w-1/3">
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="relative w-9 h-9 flex items-center justify-center rounded-[10px] bg-surface-elevated/30 border border-border/40 transition-all duration-300 hidden xl:flex group cursor-pointer hover:bg-surface-elevated hover:border-border/80"
                    aria-label="Toggle Sidebar"
                >
                    <div className="absolute inset-0 rounded-[10px] ring-1 ring-inset ring-brand/0 group-hover:ring-brand/10 transition-all duration-500 pointer-events-none"></div>

                    <div className={`relative flex items-center justify-center w-[22px] h-[22px] rounded-full bg-surface/80 border transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-active:scale-90 ${collapsed ? '-rotate-180 border-brand/40' : 'rotate-0 border-border/80'}`}>
                        <ChevronLeft size={13} strokeWidth={3} className={`relative right-[0.5px] transition-colors duration-300 ${collapsed ? 'text-brand' : 'text-text-muted group-hover:text-text'}`} />
                    </div>
                </button>

                <div className="hidden sm:flex flex-col justify-center pointer-events-none">
                    <h1 className="font-heading font-black text-[20px] text-text tracking-tighter leading-none m-0 pt-0.5">
                        Overview
                    </h1>
                </div>
            </div>

            {/* Center Section: Minimalist Command Palette Style Search */}
            <div className="hidden lg:flex flex-1 justify-center w-1/3">
                <div className="relative flex items-center rounded-[12px] bg-surface-elevated/40 border border-border/50 w-[380px] h-[36px] transition-all duration-300 focus-within:bg-surface focus-within:border-brand/40 overflow-hidden group">
                    <div className="pl-3 pr-2 h-full flex items-center justify-center text-text-muted group-focus-within:text-brand transition-colors">
                        <Search size={14} strokeWidth={2.5} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search markets, pairs, or providers..."
                        className="bg-transparent border-none outline-none text-text text-[13px] font-body w-full h-full placeholder:text-text-muted/60"
                        spellCheck="false"
                    />
                    <div className="pr-2 flex items-center justify-center">
                        <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded-[6px] bg-surface-elevated border border-border/50 text-text-muted/70 group-focus-within:opacity-0 transition-opacity">
                            <Command size={10} strokeWidth={2.5} />
                            <span className="text-[10px] font-mono font-bold">K</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Section: Actions */}
            <div className="flex items-center gap-3 justify-end w-1/3">

                {/* Modern Theme Toggler */}
                <button
                    onClick={toggleTheme}
                    className="relative w-14 h-[28px] rounded-full bg-surface-elevated/60 border border-border/60 p-[3px] flex items-center transition-all duration-300 hover:border-border cursor-pointer"
                    aria-label="Toggle dark mode"
                >
                    <div className="w-full flex justify-between px-[5px] absolute inset-0 items-center pointer-events-none text-text-muted/30">
                        <Moon size={11} strokeWidth={3} />
                        <Sun size={11} strokeWidth={3} />
                    </div>
                    <div
                        className={`w-[20px] h-[20px] rounded-full bg-surface border border-border/80 flex items-center justify-center relative z-10 transition-transform duration-500 cubic-bezier(0.34,1.56,0.64,1) ${theme === 'dark' ? 'translate-x-[26px] bg-brand/10 border-brand/30' : 'translate-x-0 bg-white border-border'}`}
                    >
                        {theme === 'dark' ? (
                            <Moon size={12} strokeWidth={2.5} className="text-brand" />
                        ) : (
                            <Sun size={12} strokeWidth={2.5} className="text-yellow-500" />
                        )}
                    </div>
                </button>

                {/* Minimalist Notifications (Transparent Hover Ring style) */}
                <button className="relative flex items-center justify-center w-9 h-9 rounded-full bg-transparent hover:bg-surface-elevated/80 text-text-muted hover:text-text transition-all duration-300 group cursor-pointer border border-transparent hover:border-border/40">
                    <Bell size={16} strokeWidth={2} className="group-hover:origin-top group-hover:rotate-12 transition-transform duration-200" />
                    <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-red-500 ring-2 ring-bg transition-colors duration-300 z-10 box-content"></span>
                </button>

                <div className="w-[1px] h-5 bg-border/80 mx-1 hidden sm:block"></div>

                {/* Connect Wallet / Deposit button */}
                <button className="hidden sm:flex items-center justify-center px-4 py-2 rounded-[10px] font-bold text-[12px] tracking-widest text-[#000] uppercase bg-brand hover:bg-brand/90 transition-all duration-300 active:scale-[0.98]">
                    Connect
                </button>

                {/* Minimal Avatar */}
                <div className="w-9 h-9 rounded-full border border-border/80 flex items-center justify-center cursor-pointer transition-all duration-300 hover:border-brand/40 hover:ring-2 hover:ring-brand/20 overflow-hidden relative group shrink-0 ml-1">
                    {/* Updated sleek profile image */}
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop" alt="Profile" className="w-full h-full object-cover filter grayscale-[30%] contrast-110 group-hover:grayscale-0 transition-all duration-500" />
                    <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-full pointer-events-none"></div>
                </div>
            </div>
        </header>
    );
}
