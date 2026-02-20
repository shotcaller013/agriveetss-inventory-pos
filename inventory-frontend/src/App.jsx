import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Sales from "./pages/Sales";
import Product from "./pages/Product";
import SalesReport from "./pages/SalesReport";
import CreditsTracker from "./pages/CreditsTracker";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ================= HELPERS ================= */

const getUser = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
};

const isAuth = () => {
    return !!localStorage.getItem("token") && !!localStorage.getItem("user");
};

/* ================= PROTECTED ROUTE ================= */

const ProtectedRoute = ({ children, allow }) => {
    const token = localStorage.getItem("token");
    const user = getUser();

    // ❌ not logged in
    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    // ❌ role not allowed
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

/* ================= APP ================= */

export default function App() {
    return (
        <BrowserRouter>
            <ToastContainer position="top-right" autoClose={3000} />

            <Routes>
                <Route path="/login" element={<Login />} />

                {/* ADMIN ONLY */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute allow={["admin"]}>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/products"
                    element={
                        <ProtectedRoute allow={["admin"]}>
                            <Product />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/credits-tracker"
                    element={
                        <ProtectedRoute allow={["admin"]}>
                            <CreditsTracker />
                        </ProtectedRoute>
                    }
                />

                {/* ADMIN + CASHIER */}
                <Route
                    path="/sales"
                    element={
                        <ProtectedRoute allow={["admin", "cashier"]}>
                            <Sales />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/sales-report"
                    element={
                        <ProtectedRoute allow={["admin", "cashier"]}>
                            <SalesReport />
                        </ProtectedRoute>
                    }
                />

                {/* CATCH-ALL (IMPORTANT FIX) */}
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
