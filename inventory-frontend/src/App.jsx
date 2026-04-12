import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Sales from "./pages/Sales";
import Product from "./pages/Product";
import SalesReport from "./pages/SalesReport";
import CreditsTracker from "./pages/CreditsTracker";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const getUser = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
};

const isAuth = () => {
    return !!localStorage.getItem("token") && !!localStorage.getItem("user");
};

const ProtectedRoute = ({ children, allow }) => {
    const token = localStorage.getItem("token");
    const user = getUser();

    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    if (allow && !allow.includes(user.role)) {
        return (
            <Navigate
                to={user.role === "cashier" ? "/sales" : "/dashboard"}
                replace
            />
        );
    }

    return children;
};

export default function App() {
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") || "light"
    );

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }

        localStorage.setItem("theme", theme);
    }, [theme]);

    return (
        <BrowserRouter>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                toastClassName="bg-white text-slate-900 dark:bg-gray-800 dark:text-white"
            />

            <Routes>
                <Route path="/login" element={<Login theme={theme} setTheme={setTheme} />} />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute allow={["admin"]}>
                            <Dashboard theme={theme} setTheme={setTheme} />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/products"
                    element={
                        <ProtectedRoute allow={["admin"]}>
                            <Product theme={theme} setTheme={setTheme} />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/credits-tracker"
                    element={
                        <ProtectedRoute allow={["admin"]}>
                            <CreditsTracker theme={theme} setTheme={setTheme} />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/sales"
                    element={
                        <ProtectedRoute allow={["admin", "cashier"]}>
                            <Sales theme={theme} setTheme={setTheme} />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/sales-report"
                    element={
                        <ProtectedRoute allow={["admin", "cashier"]}>
                            <SalesReport theme={theme} setTheme={setTheme} />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="*"
                    element={
                        isAuth()
                            ? getUser()?.role === "cashier"
                                ? <Navigate to="/sales" replace />
                                : <Navigate to="/dashboard" replace />
                            : <Navigate to="/login" replace />
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}