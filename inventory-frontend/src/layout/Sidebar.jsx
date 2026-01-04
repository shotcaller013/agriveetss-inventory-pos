import { NavLink } from "react-router-dom";

const base =
    "block px-4 py-2 rounded transition-colors";
const active =
    "bg-slate-700 text-white";
const inactive =
    "text-slate-300 hover:bg-slate-800 hover:text-white";

export default function Sidebar() {
    return (
        <aside className="h-full bg-slate-900 text-sm p-4 space-y-1">
            <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                    `${base} ${isActive ? active : inactive}`
                }
            >
                Dashboard
            </NavLink>

            <NavLink
                to="/sales"
                className={({ isActive }) =>
                    `${base} ${isActive ? active : inactive}`
                }
            >
                Sales
            </NavLink>

            <NavLink
                to="/products"
                className={({ isActive }) =>
                    `${base} ${isActive ? active : inactive}`
                }
            >
                Products
            </NavLink>
        </aside>
    );
}
