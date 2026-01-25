import { NavLink } from "react-router-dom";
import { LayoutDashboard, BadgeDollarSign, Package, BarChart3, Menu, X, LogOut } from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Sales", to: "/sales", icon: BadgeDollarSign },
  { label: "Products", to: "/products", icon: Package },
  { label: "Sales Report", to: "/sales-report", icon: BarChart3 },
];

export default function Sidebar({ isCollapsed, setIsCollapsed }) {
  return (
    <aside 
      className={`h-screen sticky top-0 bg-slate-950 flex flex-col border-r border-slate-900 transition-all duration-300 ease-in-out shrink-0 z-50 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="p-4 flex items-center min-h-[72px] border-b border-slate-900/50">
        {!isCollapsed && (
          <h1 className="text-lg font-bold text-white tracking-tight flex-1 animate-in fade-in duration-300">
            {/* Admin<span className="text-blue-500">Pro</span> */}
          </h1>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-all ${isCollapsed ? "mx-auto" : "ml-auto"}`}
        >
          {isCollapsed ? <Menu size={22} /> : <X size={22} />}
        </button>
      </div>

      <nav className="flex-1 px-3 space-y-1.5 mt-6">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative
              ${isActive ? "bg-blue-600/10 text-blue-500" : "text-slate-500 hover:bg-slate-900 hover:text-slate-100"}
            `}
          >
            {({ isActive }) => (
              <>
                <item.icon size={20} className="shrink-0" />
                {!isCollapsed && (
                  <span className="font-semibold text-sm tracking-wide animate-in slide-in-from-left-2">
                    {item.label}
                  </span>
                )}
                {isCollapsed && (
                  <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all shadow-xl border border-slate-800 z-[60]">
                    {item.label}
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* <div className="p-4 border-t border-slate-900">
        <button className={`flex items-center gap-3 w-full p-3 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition-all ${isCollapsed ? "justify-center" : ""}`}>
           <LogOut size={20} />
           {!isCollapsed && <span className="text-sm font-bold">Logout</span>}
        </button>
      </div> */}
    </aside>
  );
}