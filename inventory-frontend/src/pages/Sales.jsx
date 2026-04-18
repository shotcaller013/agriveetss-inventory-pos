import MainLayout from "../layout/MainLayout";
import { useState, useEffect } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

import AddToCartPanel from "../components/pos/AddToCartPanel";
import CartPanel from "../components/pos/CartPanel";
import ReceiptPanel from "../components/pos/ReceiptPanel";
import { ShoppingBag, Search, Info } from "lucide-react";
import CreditModal from "../components/CreditModal";
import ThemeToggle from "../components/ThemeToggle";

export default function Sales() {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [cart, setCart] = useState([]);
    const [receipt, setReceipt] = useState(null);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [showCredits, setShowCredits] = useState(false);

    const fetchProducts = async () => {
        try {
            const res = await api.get("/products", { params: { search } });
            setProducts(res.data.data || []);
        } catch {
            toast.error("Failed to load products");
        }
    };

    useEffect(() => {
        const t = setTimeout(fetchProducts, 300);
        return () => clearTimeout(t);
    }, [search]);

    /* ================= ACTION HANDLERS ================= */

    const addToCart = (item) => {
        setCart(prev => {
            const existing = prev.find(p => p.product_id === item.product_id);
            if (existing) {
                return prev.map(p =>
                    p.product_id === item.product_id
                        ? { ...p, quantity: p.quantity + item.quantity }
                        : p
                );
            }
            return [...prev, item];
        });
        setSelectedProduct(null);
        toast.info(`${item.name} added`, { autoClose: 800, hideProgressBar: true });
    };

    const updateQty = (productId, delta) => {
        setCart(prev =>
            prev.map(item =>
                item.product_id === productId
                    ? { ...item, quantity: Math.max(0, item.quantity + delta) }
                    : item
            ).filter(item => item.quantity > 0)
        );
    };

    const clearCart = () => {
        setCart([]);
        setSelectedProduct(null);
    };

    const handleCheckout = async ({ items, cash }) => {
        try {
            setLoading(true);
            const payload = {
                items: items.map(i => ({
                    product_id: i.product_id,
                    quantity: i.quantity,
                    unit_price: i.unit_price,
                })),
                cash,
            };
            const res = await api.post("/sales", payload);
            setReceipt(res.data.sale);
            setCart([]);
            setSelectedProduct(null);
            fetchProducts();
            toast.success("Sale completed");
        } catch (err) {
            toast.error(err.response?.data?.message || "Checkout failed");
        } finally {
            setLoading(false);
        }
    };

    const handleCreditSave = async (data) => {
        try {
            setLoading(true);
            await api.post("/credits", data);
            clearCart();
            setShowCredits(false);
            fetchProducts();
            toast.success("Credit saved");
        } catch (err) {
            toast.error(err.response?.data?.message || "Credit save failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <MainLayout showSidebar={false} showFooter={false}>

                <div className="h-[calc(100vh-64px)] grid grid-cols-12  relative bg-slate-50 dark:bg-slate-900">

                    {/* 🔥 TOP RIGHT THEME TOGGLE */}
                    {/* <div className="absolute top-4 right-6 z-50">
                        <ThemeToggle />
                    </div> */}

                    {/* LEFT PANEL (PRODUCTS) */}
                    <div className="col-span-8 h-full flex flex-col p-6 min-h-0">

                        {/* HEADER */}
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                            {/* TITLE SECTION */}
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200 dark:shadow-none">
                                        <ShoppingBag size={24} strokeWidth={2.5} />
                                    </div>
                                    {/* Animated pulse dot to show system is live */}
                                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                                    </span>
                                </div>

                                <div>
                                    <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                                        Store Catalog
                                    </h1>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                            <div className="w-1 h-1 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                                            {products.length} Products Available
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* ACTIONS SECTION */}
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <div className="relative flex-1 md:flex-none group">
                                    <Search
                                        className={`w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 transition-colors 
                ${search ? 'text-indigo-500' : 'text-slate-400 group-focus-within:text-indigo-500'}`}
                                    />

                                    <input
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search products..."
                                        className="w-full md:w-80 pl-11 pr-10 py-3.5 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl shadow-sm outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-400 font-medium"
                                    />

                                    {/* QUICK CLEAR BUTTON */}
                                    {search && (
                                        <button
                                            onClick={() => setSearch("")}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                                        >
                                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}

                                    {/* KEYBOARD HINT (HIDDEN ON MOBILE) */}
                                </div>
                                <button
                                    onClick={() => setShowCredits(true)}
                                    className="p-3.5 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-2xl border-2 border-slate-100 dark:border-slate-700 transition-all active:scale-95 shadow-sm"
                                    title="System Info"
                                >
                                    <Info size={22} />
                                </button>
                            </div>
                        </div>

                        {/* PRODUCT GRID (SCROLLABLE) */}
                        <div className="flex-1 overflow-y-auto pr-2 custom scroll-smooth">
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {products.map((product) => {
                                    const isSelected = selectedProduct?.id === product.id;
                                    const isLowStock = product.stock_quantity < 10;

                                    return (
                                        <button
                                            key={product.id}
                                            onClick={() => setSelectedProduct(product)}
                                            className="group relative flex flex-col rounded-xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-lg active:scale-95 transition h-full"
                                        >

                                            {/* IMAGE */}
                                            <div className="aspect-square w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-700">

                                                <img
                                                    src={`http://localhost:8000/storage/${product.image}`}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src = 'https://placehold.co/400x400?text=No+Image';
                                                    }}
                                                />

                                            </div>

                                            {/* INFO */}
                                            <div className="flex flex-col p-2 flex-1">

                                                {/* NAME */}
                                                <div className="text-sm font-semibold text-slate-800 dark:text-white line-clamp-2 leading-tight text-center">
                                                    {product.name}
                                                </div>

                                                {/* PRICE */}
                                                <div className="mt-auto text-lg font-bold text-red-600 text-center">
                                                    ₱{Number(product.selling_price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </div>

                                            </div>

                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PANEL (CART) */}
                    <div className="col-span-4 flex flex-col bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 p-5">

                        {receipt ? (
                            <ReceiptPanel
                                receipt={receipt}
                                onDone={() => setReceipt(null)}
                            />
                        ) : (
                            <div className="flex flex-col h-full min-h-0">

                                {/* ADD TO CART */}
                                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                                    <AddToCartPanel
                                        product={selectedProduct}
                                        onAdd={addToCart}
                                    />
                                </div>

                                {/* CART ITEMS */}
                                <div className="mt-4 flex-1 min-h-0 overflow-y-auto pr-2">
                                    <CartPanel
                                        cart={cart}
                                        updateQty={updateQty}
                                        onCheckout={handleCheckout}
                                        onClearCart={clearCart}
                                        loading={loading}
                                    />
                                </div>

                            </div>
                        )}
                    </div>
                </div>

                {/* CREDIT MODAL */}
                <CreditModal
                    open={showCredits}
                    onClose={() => setShowCredits(false)}
                    onSave={handleCreditSave}
                    items={cart}
                />

            </MainLayout>
        </>
    );
}