import MainLayout from "../layout/MainLayout";
import { useState, useEffect } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

import AddToCartPanel from "../components/pos/AddToCartPanel";
import CartPanel from "../components/pos/CartPanel";
import ReceiptPanel from "../components/pos/ReceiptPanel";
import { ShoppingBag, Search, Info } from "lucide-react"; 
import CreditModal from "../components/CreditModal";

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
            <div className="h-[calc(100vh-64px)] grid grid-cols-12 bg-slate-50 overflow-hidden relative">

                {/* LEFT: PRODUCT CATALOG (8 cols) */}
                <div className="col-span-8 p-8 overflow-y-auto custom-scrollbar">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                                <div className="p-2 bg-indigo-600 rounded-lg text-white">
                                    <ShoppingBag size={22} />
                                </div>
                                Store Catalog
                            </h1>
                            <p className="text-sm text-slate-500 mt-1">Select items to add to the customer's cart</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative group">
                                <Search className="w-5 h-5 absolute left-3 top-3 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by name or SKU..."
                                    className="w-80 pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all"
                                />
                            </div>

                            <button
                                onClick={() => setShowCredits(true)}
                                className="p-3 bg-white text-slate-500 hover:text-indigo-600 rounded-xl shadow-sm border border-slate-200 hover:border-indigo-200 transition-all hover:bg-indigo-50"
                                title="Customer Credits"
                            >
                                <Info size={22} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map(product => {
                            const isSelected = selectedProduct?.id === product.id;
                            return (
                                <button
                                    key={product.id}
                                    onClick={() => setSelectedProduct(product)}
                                    className={`group relative flex flex-col p-5 rounded-2xl transition-all duration-300 text-left 
                                        ${isSelected 
                                            ? 'bg-white border-2 border-indigo-500 shadow-lg -translate-y-1' 
                                            : 'bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5'}`}
                                >
                                    <div className="mb-4">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                                            {product.category?.name || 'Item'}
                                        </span>
                                        <div className="font-bold text-slate-700 leading-tight h-10 overflow-hidden group-hover:text-indigo-700 transition-colors">
                                            {product.name}
                                        </div>
                                    </div>
                                    
                                    <div className="mt-auto flex justify-between items-center pt-3 border-t border-slate-50">
                                        <div className="text-slate-900 font-extrabold text-xl">
                                            ₱{Number(product.selling_price).toLocaleString()}
                                        </div>
                                        <div className="px-2 py-1 rounded bg-slate-100 text-[10px] font-bold text-slate-500 uppercase">
                                            {product.unit_type}
                                        </div>
                                    </div>

                                    {isSelected && (
                                        <div className="absolute -top-2 -right-2">
                                            <span className="flex h-5 w-5">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-5 w-5 bg-indigo-600 border-2 border-white shadow-sm"></span>
                                            </span>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* RIGHT: BILLING PANEL (4 cols) */}
                <div className="col-span-4 bg-white border-l border-slate-200 shadow-2xl z-10 p-6 flex flex-col overflow-hidden">
                    {receipt ? (
                        <ReceiptPanel
                            receipt={receipt}
                            onDone={() => setReceipt(null)}
                        />
                    ) : (
                        <div className="flex flex-col h-full gap-6">
                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                <AddToCartPanel
                                    product={selectedProduct}
                                    onAdd={addToCart}
                                />
                            </div>
                            <div className="flex-1 overflow-hidden bg-white">
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

            <CreditModal
                open={showCredits}
                onClose={() => setShowCredits(false)}
                onSave={handleCreditSave}
                items={cart}
            />
        </>
    );
}