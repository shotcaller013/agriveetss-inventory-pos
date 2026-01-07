import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

export default function MainLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        /* 1. Use h-screen and overflow-hidden to prevent the whole body from scrolling */
        <div className="h-screen flex overflow-hidden bg-gray-100">
            
            {/* 2. Sidebar: Now spans the full height of the screen */}
            <aside
                className={`transition-all duration-300 bg-slate-950 ${
                    sidebarOpen ? "w-64" : "w-0"
                } z-20 flex-shrink-0 border-r border-slate-800`}
            >
                <Sidebar />
            </aside>

            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                
                {/* Header stays at the top */}
                <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

                <main className="flex-1 overflow-y-auto p-4 relative">
                    {/* <div className="max-w-7xl mx-auto"> */}
                        {children}
                    {/* </div> */}
                </main>

                {/* Footer stays at the bottom of the content area */}
                <Footer />
            </div>
        </div>
    );
}