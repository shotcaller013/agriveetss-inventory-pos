import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

const isAuth = () => !!localStorage.getItem("token");

const ProtectedRoute = ({ children, allow }) => {
    if (!isAuth()) return <Navigate to="/login" />;

    const user = getUser();

    if (allow && !allow.includes(user?.role)) {
        return <Navigate to="/sales-report" />;
    }

    return children;
};

export default function App() {
    return (
        <BrowserRouter>
            <ToastContainer position="top-right" autoClose={3000} />

            <Routes>
                <Route path="/login" element={<Login />} />

                {/* Admin only */}
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

                {/* Admin + Cashier */}
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
                        <ProtectedRoute allow={["cashier", "admin"]}>
                            <SalesReport />
                        </ProtectedRoute>
                    }
                />

                {/* catch-all */}
                <Route
                    path="*"
                    element={
                        <Navigate to={isAuth() ? "/sales-report" : "/login"} />
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}
