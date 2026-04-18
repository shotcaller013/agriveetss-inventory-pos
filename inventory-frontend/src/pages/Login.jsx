import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Login() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(""); //  CLEAR ERROR FIRST

        try {
            const { data } = await api.post("/login", { name, password });

            //  STORE SESSION
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            //  REDIRECT BY ROLE
            if (data.user.role === "admin") {
                navigate("/sales-report", { replace: true });
            } else {
                navigate("/sales", { replace: true });
            }
        } catch (err) {
            setError(
                err?.response?.data?.message || "Invalid name or password"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center 
    bg-slate-100 dark:bg-slate-900 px-4">

            <form
                onSubmit={submit}
                className="w-full max-w-sm 
        bg-white dark:bg-slate-800 
        p-8 rounded-2xl shadow-xl 
        border border-slate-200 dark:border-slate-700
        space-y-5"
            >

                {/* TITLE */}
                <div className="text-center">
                    <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">
                        Zhaneyaa Agriveets
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Inventory System Login
                    </p>
                </div>

                {/* ERROR */}
                {error && (
                    <p className="text-sm text-red-600 dark:text-red-400 text-center">
                        {error}
                    </p>
                )}

                {/* NAME */}
                <div>
                    <input
                        className="w-full px-4 py-2.5 rounded-xl outline-none transition-all
                bg-slate-50 dark:bg-slate-700
                text-slate-900 dark:text-white
                border border-slate-200 dark:border-slate-600
                focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-500/30"
                        placeholder="Username"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                {/* PASSWORD */}
                <div>
                    <input
                        type="password"
                        className="w-full px-4 py-2.5 rounded-xl outline-none transition-all
                bg-slate-50 dark:bg-slate-700
                text-slate-900 dark:text-white
                border border-slate-200 dark:border-slate-600
                focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-500/30"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {/* BUTTON */}
                <button
                    disabled={loading}
                    className="w-full py-3 rounded-xl font-bold transition-all
            bg-indigo-600 hover:bg-indigo-700 text-white
            disabled:opacity-50 active:scale-[0.98]"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

            </form>
        </div>
    );
}
