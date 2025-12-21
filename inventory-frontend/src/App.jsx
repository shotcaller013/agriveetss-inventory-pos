// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Product from "./pages/Product";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const isAuth = () => !!localStorage.getItem("token");

export default function App() {
    return (
        <BrowserRouter>
            <ToastContainer position="top-right" autoClose={3000} />

            <Routes>
                <Route path="/login" element={<Login />} />

                <Route
                    path="/dashboard"
                    element={
                        isAuth()
                            ? <Dashboard />
                            : <Navigate to="/login" />
                    }
                />

                <Route
                    path="*"
                    element={<Navigate to={isAuth() ? "/dashboard" : "/login"} />}
                />

                <Route path="/products" element={isAuth() ? <Product /> : <Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    );
}
