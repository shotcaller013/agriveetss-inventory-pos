import { NavLink, useNavigate, Link } from "react-router-dom";
import { BadgeDollarSign, Package, BarChart3, Menu, X, WalletCards } from "lucide-react";
import api from "../api/axios";
import { useState, useEffect } from "react";

const NAV_ITEMS = [
  { label: "Sales", to: "/sales", icon: BadgeDollarSign, roles: ["admin", "cashier"] },
  { label: "Products", to: "/products", icon: Package, roles: ["admin"] },
  { label: "Sales Report", to: "/sales-report", icon: BarChart3, roles: ["admin"] },
  { label: "Credits", to: "/credits-tracker", icon: WalletCards, roles: ["admin"] },
];

export default function Sidebar({ isCollapsed, setIsCollapsed }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [counter, setCounter] = useState(0);

  const creditCounter = async () => {
    try {
      const res = await api.get("/credits");
      setCounter(res.data.overdueCount || 0);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    creditCounter();
  }, []);

  const logout = async () => {
    try {
      await api.post("/logout");
    } finally {
      localStorage.clear();
      navigate("/login", { replace: true });
    }
  };

  return (
    <aside
      className={`h-screen sticky top-0 bg-slate-950 flex flex-col border-r border-slate-900 transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"
        }`}
    >
      {/* Header */}
      <div className="p-4 flex items-center border-b border-slate-900/50">
        {!isCollapsed && (
          <Link
            to="/sales-report"
            className="text-lg font-bold text-white flex-1 hover:text-blue-400"
          >
            Inventory System
          </Link>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-2 text-slate-400 hover:text-white ${isCollapsed ? "mx-auto" : "ml-auto"
            }`}
        >
          {isCollapsed ? <Menu size={22} /> : <X size={22} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 mt-6 space-y-1.5">
        {NAV_ITEMS.filter((item) => item.roles.includes(user?.role)).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-3 rounded-xl ${isActive
                ? "bg-blue-600/10 text-blue-500"
                : "text-slate-500 hover:bg-slate-900 hover:text-white"
              }`
            }
          >
            <div className="flex items-center gap-3">
              <item.icon size={20} />
              {!isCollapsed && (
                <span className="text-sm font-semibold">{item.label}</span>
              )}
            </div>

            {!isCollapsed &&
              item.to === "/credits-tracker" &&
              counter > 0 && (
                <span className="relative flex h-5 min-w-[20px] items-center justify-center">

                  <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping"></span>

                  <span className="relative bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {counter}
                  </span>

                </span>
              )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}