import { Menu, LogOut } from "lucide-react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

export default function Header({ onToggleSidebar }) {
    const navigate = useNavigate();

    const logout = async () => {
        try {
            await api.post("/logout");
        } finally {
            localStorage.clear();
            navigate("/login", { replace: true });
        }
    };

    return (
        <header className="h-16 bg-gray border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-6 shrink-0 z-20">
            <div className="flex items-center gap-4">
                <button
                    onClick={onToggleSidebar}
                    className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden"
                >
                    <Menu size={24} />
                </button>
            </div>

            <div className="flex items-center gap-3">
                <ThemeToggle />

                <button
                    onClick={logout}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-200 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                    <span className="hidden sm:block">Logout</span>
                    <LogOut size={18} />
                </button>
            </div>
        </header>
    );
}