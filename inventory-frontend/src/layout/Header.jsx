export default function Header() {
    const logout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    return (
        <header className="h-14 bg-slate-800 text-white flex items-center justify-between px-6">
            <span className="font-semibold">Inventory System</span>
            <button
                onClick={logout}
                className="text-sm hover:underline"
            >
                Logout
            </button>
        </header>
    );
}
