import { useState, useEffect, useRef } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { Outlet, useLocation } from "react-router-dom";

export function MainLayout() {
    // ── Navigation State ─────────────────────────────────────────────
    const location = useLocation();
    const activeNav = location.pathname.split("/")[1] || "dashboard";

    // ── Layout State ─────────────────────────────────────────────────
    const [collapsed, setCollapsed] = useState(false);
    const [theme, setTheme] = useState(() => {
        try { return localStorage.getItem('app-theme') || 'dark'; } catch { return 'dark'; }
    });

    // Initialize layout behaviors
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.classList.toggle('dark', theme === 'dark');
        try { localStorage.setItem('app-theme', theme); } catch {}
    }, [theme]);

    const toggleTheme = () => setTheme(prev => prev === "dark" ? "light" : "dark");

    // ── Navigation Behaviors ─────────────────────────────────────────
    const scrollContainerRef = useRef(null);

    // Reset scroll position on route change
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo(0, 0);
        }
    }, [location.pathname]);

    useEffect(() => {
        const handleResize = () => setCollapsed(window.innerWidth < 1200);
        window.addEventListener("resize", handleResize);
        handleResize(); // Init on mount
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div 
            className="flex bg-bg transition-colors duration-300 h-screen w-full overflow-hidden"
        >
            {/* 1. Global Navigation */}
            <Sidebar collapsed={collapsed} />

            {/* 2. Main Content Area */}
            <div
                className="flex-1 flex flex-col h-screen relative transition-[margin-left] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ marginLeft: collapsed ? '72px' : '248px' }}
            >
                {/* 3. Global Header */}
                <Topbar 
                    collapsed={collapsed} 
                    setCollapsed={setCollapsed} 
                    theme={theme} 
                    toggleTheme={toggleTheme} 
                />

                {/* 4. Page Content (Router Outlet) */}
                {(() => {
                    const TERMINAL_ROUTES = ['/terminal'];
                    const CHART_ROUTES    = ['/trade/chart'];
                    const isTerminal = TERMINAL_ROUTES.some(r => location.pathname.startsWith(r));
                    const isChart    = CHART_ROUTES.some(r => location.pathname.startsWith(r));

                    // Unified wrapper with dynamic classes to prevent layout snapping
                    return (
                        <div 
                            ref={scrollContainerRef}
                            className={`flex-1 flex flex-col min-h-0 ${isTerminal || isChart ? 'overflow-hidden' : 'overflow-y-auto custom-scrollbar'} p-6 transition-all duration-300`}
                            style={{ scrollbarGutter: 'stable' }}
                        >
                            <div className={`w-full flex-1 min-h-0 mx-auto flex flex-col ${isChart || isTerminal ? 'max-w-none' : 'max-w-[1720px]'}`}>
                                <Outlet />
                            </div>
                        </div>
                    );
                })()}
            </div>
        </div>
    );
}
