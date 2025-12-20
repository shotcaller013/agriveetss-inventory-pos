export default function Footer() {
    return (
        <footer className="h-10 shrink-0 bg-slate-800 text-slate-300 flex items-center justify-center text-xs">
            © {new Date().getFullYear()} POS / Inventory System
        </footer>
    );
}
