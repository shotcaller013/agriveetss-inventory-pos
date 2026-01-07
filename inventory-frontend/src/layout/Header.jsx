import { Menu, LogOut, ShieldCheck } from "lucide-react";

export default function Header({ onToggleSidebar }) {
    const logout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    return (
        <header className="h-16 bg-gray border-b border-slate-200 flex items-center justify-between px-4 md:px-6 shrink-0 z-20">
            <div className="flex items-center gap-4">
                {/* Hamburger Button - Hidden on Desktop (lg) */}
                <button
                    onClick={onToggleSidebar}
                    className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden"
                >
                    <Menu size={24} />
                </button>
                
                <div className="flex items-center gap-2">
                    {/* <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                        <ShieldCheck size={20} />
                    </div>
                    <span className="font-bold text-slate-800 hidden sm:block tracking-tight">
                        Inventory<span className="text-blue-600">System</span>
                    </span> */}
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={logout}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <span className="hidden xs:block">Logout</span>
                    <LogOut size={18} />
                </button>
            </div>
        </header>
    );
}