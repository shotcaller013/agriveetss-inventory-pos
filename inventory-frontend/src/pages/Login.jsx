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
        setError("");

        try {
            const { data } = await api.post("/login", { name, password });
            localStorage.setItem("token", data.token);

            navigate("/dashboard");
        } catch (err) {
            setError(
                err?.response?.data?.message || "Invalid name or password"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <form
                onSubmit={submit}
                className="w-full max-w-sm bg-white p-6 rounded shadow"
            >
                <h2 className="text-2xl font-bold mb-4 text-center">
                    Shaneyaa Agriveets Inventory Login
                </h2>

                {error && (
                    <p className="mb-3 text-sm text-red-600">{error}</p>
                )}

                <input
                    className="w-full mb-3 px-3 py-2 border rounded"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <input
                    type="password"
                    className="w-full mb-4 px-3 py-2 border rounded"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button
                    disabled={loading}
                    className="w-full bg-slate-800 text-white py-2 rounded disabled:opacity-60"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
}
