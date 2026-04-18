import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

export default function MainLayout({
    children,
    showFooter = true,
    showSidebar = true,
    showHeader = true,
}) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="h-screen flex overflow-hidden bg-gray-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100">

            {/* Sidebar (optional) */}
            {showSidebar && (
                <aside
                    className={`transition-all duration-300 bg-slate-950 ${
                        sidebarOpen ? "w-64" : "w-0"
                    } z-20 flex-shrink-0 border-r border-slate-800`}
                >
                    <Sidebar />
                </aside>
            )}

            {/* Main */}
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

                {/* Header (optional) */}
                {showHeader && (
                    <Header
                        onToggleSidebar={() =>
                            setSidebarOpen(!sidebarOpen)
                        }
                    />
                )}

                <main className="flex-1 overflow-y-auto relative">
                    {children}
                </main>

                {/* Footer (optional) */}
                {showFooter && <Footer />}
            </div>
        </div>
    );
}