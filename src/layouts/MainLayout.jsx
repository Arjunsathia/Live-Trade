import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { Outlet, useLocation } from "react-router-dom";

export function MainLayout() {
    // ── Navigation State ─────────────────────────────────────────────
    const location = useLocation();
    const activeNav = location.pathname.split("/")[1] || "dashboard";

    // ── Layout State ─────────────────────────────────────────────────
    const [collapsed, setCollapsed] = useState(false);
    const [theme, setTheme] = useState("dark");

    // Initialize layout behaviors
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);

    const toggleTheme = () => setTheme(prev => prev === "dark" ? "light" : "dark");

    useEffect(() => {
        const handleResize = () => setCollapsed(window.innerWidth < 1200);
        window.addEventListener("resize", handleResize);
        handleResize(); // Init on mount
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="flex bg-bg transition-colors duration-300 min-h-screen">
            {/* 1. Global Navigation */}
            <Sidebar active={activeNav} collapsed={collapsed} />

            {/* 2. Main Content Area */}
            <div
                className="flex-1 flex flex-col transition-[margin-left] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
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
                <div className="flex-1 overflow-x-hidden p-6 custom-scrollbar">
                    {/* The max-w container keeps content legible on ultra-wide screens */}
                    <div className="w-full max-w-[1720px] mx-auto h-full">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}
