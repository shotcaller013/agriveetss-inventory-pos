import MainLayout from "../layout/MainLayout";
import { useState, useEffect } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

import AddToCartPanel from "../components/pos/AddToCartPanel";
import CartPanel from "../components/pos/CartPanel";
import ReceiptPanel from "../components/pos/ReceiptPanel";
import { BadgeDollarSign, Info, X } from "lucide-react"; // Added icons
import CreditModal from "../components/CreditModal";

export default function Sales() {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [cart, setCart] = useState([]);
    const [receipt, setReceipt] = useState(null);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [showCredits, setShowCredits] = useState(false); // New State

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
        toast.info(`${item.name} added to cart`, { autoClose: 1000, hideProgressBar: true });
    };


    const updateQty = (productId, delta) => {
        setCart(prev =>
            prev
                .map(item =>
                    item.product_id === productId
                        ? { ...item, quantity: Math.max(0, item.quantity + delta) }
                        : item
                )
                .filter(item => item.quantity > 0)
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
            toast.success("Sale completed successfully");
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
            toast.success("Credit saved successfully");
        } catch (err) {
            toast.error(err.response?.data?.message || "Credit save failed");
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <div className="h-[calc(100vh-64px)] grid grid-cols-12 bg-slate-100 overflow-hidden p-4 relative">

                {/* LEFT: PRODUCT CATALOG (8 cols) */}
                <div className="col-span-8 p-6 overflow-y-auto custom-scrollbar">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                            Catalog
                            <BadgeDollarSign className="inline-block ml-2 text-blue-600" />
                        </h1>

                        <div className="flex items-center gap-3">
                            <div className="relative w-72">
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by name or SKU..."
                                    className="w-full pl-10 pr-4 py-2 bg-white border-none rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                                <svg className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>

                            <button
                                onClick={() => setShowCredits(true)}
                                className="p-2.5 bg-white text-slate-500 hover:text-blue-600 rounded-xl shadow-sm hover:shadow-md transition-all border border-transparent hover:border-blue-100"
                                title="Credits"
                            >
                                <Info size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {products.map(product => {
                            const isSelected = selectedProduct?.id === product.id;
                            return (
                                <button
                                    key={product.id}
                                    onClick={() => setSelectedProduct(product)}
                                    className={`relative flex flex-col p-4 rounded-2xl bg-white transition-all duration-200 text-left shadow-sm hover:shadow-md active:scale-95 group border-2
                                        ${isSelected ? 'border-blue-500 ring-4 ring-blue-50' : 'border-transparent'}`}
                                >
                                    <div className="mb-3">
                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{product.category?.name || 'Item'}</div>
                                        <div className="font-bold text-slate-800 leading-tight h-10 overflow-hidden">{product.name}</div>
                                    </div>
                                    <div className="mt-auto flex justify-between items-end">
                                        <div className="text-blue-600 font-black text-lg">
                                            ₱{Number(product.selling_price).toFixed(2)}
                                        </div>
                                        <div className="text-[10px] font-bold text-gray-500 uppercase italic">
                                            Per {product.unit_type}
                                        </div>
                                    </div>
                                    {isSelected && (
                                        <div className="absolute top-2 right-2">
                                            <span className="flex h-3 w-3 relative">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                                            </span>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* RIGHT: BILLING PANEL (4 cols) */}
                <div className="col-span-4 bg-white border-l border-slate-200 shadow-2xl z-10 p-4 flex flex-col overflow-hidden">
                    {receipt ? (
                        <ReceiptPanel
                            receipt={receipt}
                            onDone={() => setReceipt(null)}
                        />
                    ) : (
                        <div className="flex flex-col h-full gap-4">
                            <div className="shrink-0">
                                <AddToCartPanel
                                    product={selectedProduct}
                                    onAdd={addToCart}
                                />
                            </div>
                            <div className="flex-1 overflow-hidden">
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

            {/* Modal remains outside the layout flow but inside the fragment */}
            <CreditModal
                open={showCredits}
                onClose={() => setShowCredits(false)}
                onSave={handleCreditSave}
                items={cart}
            />
        </>
    );
}