import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

export default function MainLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            {/* Header */}
            <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

            {/* Body */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside
                    className={`transition-all duration-300 ${
                        sidebarOpen ? "w-64" : "w-0"
                    } overflow-hidden`}
                >
                    <Sidebar />
                </aside>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-4">
                    {children}
                </main>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}
