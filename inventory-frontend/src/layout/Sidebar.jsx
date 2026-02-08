import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BadgeDollarSign,
  Package,
  BarChart3,
  Menu,
  X,
  WalletCards
} from "lucide-react";

const NAV_ITEMS = [
  // { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard, roles: ["admin"] },
  { label: "Sales", to: "/sales", icon: BadgeDollarSign, roles: ["admin", "cashier"] },
  { label: "Products", to: "/products", icon: Package, roles: ["admin"] },
  { label: "Sales Report", to: "/sales-report", icon: BarChart3, roles: ["admin"] },
  { label: "Credits", to: "/credits-tracker", icon: WalletCards, roles: ["admin"] },
];

export default function Sidebar({ isCollapsed, setIsCollapsed }) {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <aside
      className={`h-screen sticky top-0 bg-slate-950 flex flex-col border-r border-slate-900 transition-all duration-300 ease-in-out shrink-0 z-50 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="p-4 flex items-center min-h-[72px] border-b border-slate-900/50">
        {!isCollapsed && (
          <h1 className="text-lg font-bold text-white tracking-tight flex-1">
            POS System
          </h1>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-all ${
            isCollapsed ? "mx-auto" : "ml-auto"
          }`}
        >
          {isCollapsed ? <Menu size={22} /> : <X size={22} />}
        </button>
      </div>

      <nav className="flex-1 px-3 space-y-1.5 mt-6">
        {NAV_ITEMS.filter(item =>
          item.roles.includes(user?.role)
        ).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative
              ${
                isActive
                  ? "bg-blue-600/10 text-blue-500"
                  : "text-slate-500 hover:bg-slate-900 hover:text-slate-100"
              }`
            }
          >
            <item.icon size={20} className="shrink-0" />

            {!isCollapsed && (
              <span className="font-semibold text-sm tracking-wide">
                {item.label}
              </span>
            )}

            {isCollapsed && (
              <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all shadow-xl border border-slate-800 z-[60]">
                {item.label}
              </div>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
