import { useState, useEffect } from "react";
import ConfirmDialog from "../ConfirmDialog";

// helper peso sign

const formatPrice = (amount) => new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
}).format(amount);

export default function CartPanel({
    cart,
    updateQty,
    onCheckout,
    onClearCart, // New prop to handle clearing the cart
    loading = false,
}) {
    const [cash, setCash] = useState("");
    const [confirmOpen, setConfirmOpen] = useState(true);

    const total = cart.reduce(
        (sum, item) => sum + item.quantity * item.unit_price,
        0
    );

    const cashAmount = Number(cash) || 0;
    const change = cashAmount - total;
    const isInsufficient = cashAmount < total && cashAmount > 0;
    const canCheckout = cart.length > 0 && cashAmount >= total && !loading;

    // Reset cash if cart is cleared
    useEffect(() => {
        if (cart.length === 0) setCash("");
    }, [cart.length]);

    return (
        <div className="bg-slate-50 rounded-2xl shadow-xl border border-slate-200 p-4 flex flex-col h-full max-h-[calc(100vh-2rem)]">

            {/* Header with Clear Action */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-sm font-black tracking-widest uppercase text-slate-500">Current Order</h2>
                    <p className="text-xs text-slate-400">{cart.length} unique items</p>
                </div>
                {cart.length > 0 && (
                    <button
                        onClick={() => setConfirmOpen(true)}
                        className="text-[10px] font-bold text-red-400 hover:text-red-600 uppercase tracking-tighter transition"
                    >
                        Clear All
                    </button>
                )}
            </div>

            {/* Scrollable Items Area */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-300 space-y-2">
                        <svg className="w-12 h-12 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <p className="text-sm italic">Your cart is empty</p>
                    </div>
                ) : (
                    cart.map(item => (
                        <div
                            key={item.product_id}
                            className="flex items-center gap-3 px-3 py-3 bg-white rounded-xl shadow-sm border border-slate-100 group transition-all"
                        >
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-800 truncate leading-none mb-1">
                                    {item.name}
                                </p>
                                <p className="text-[11px] font-mono text-slate-500">
                                    {(item.unit_price)}
                                </p>
                            </div>

                            {/* Precise Qty Controls */}
                            <div className="flex items-center bg-slate-100 rounded-lg p-1">
                                <button
                                    onClick={() => updateQty(item.product_id, -1)}
                                    className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm text-slate-600 transition"
                                >
                                    −
                                </button>
                                <span className="w-8 text-center text-xs font-black text-slate-800">
                                    {item.quantity}
                                </span>
                                <button
                                    onClick={() => updateQty(item.product_id, 1)}
                                    className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm text-slate-600 transition"
                                >
                                    +
                                </button>
                            </div>

                            <div className="w-20 text-right text-sm font-black text-slate-900">
                                {(item.quantity * item.unit_price)}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Bottom Transaction Summary */}
            <div className="mt-4 pt-4 border-t border-slate-200 bg-slate-50 -mx-4 px-4 pb-0 rounded-b-2xl">
                <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-400 uppercase">Total Payable</span>
                        <span className="text-3xl font-black text-slate-900 tracking-tighter">
                            {formatPrice(total)}
                        </span>
                    </div>

                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₱</span>
                        <input
                            type="number"
                            value={cash}
                            onChange={(e) => setCash(e.target.value)}
                            placeholder="Amount Tendered"
                            className={`w-full bg-white border-2 rounded-xl pl-7 pr-3 py-3 text-right text-xl font-mono font-bold transition-all outline-none
                                ${isInsufficient ? 'border-red-200 bg-red-50 text-red-600' : 'border-slate-100 focus:border-green-500'}`}
                        />
                    </div>

                    <div className="flex justify-between items-center px-1">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-tight">Change Due</span>
                        <span className={`text-lg font-mono font-black ${change < 0 ? 'text-slate-300' : 'text-green-600'}`}>
                            {(Math.max(0, change))}
                        </span>
                    </div>
                </div>

                <button
                    onClick={() => canCheckout && onCheckout({ items: cart, cash: cashAmount })}
                    disabled={!canCheckout}
                    className="w-full bg-green-600 text-white py-4 rounded-xl font-black text-lg shadow-lg shadow-green-100
                             hover:bg-green-700 active:scale-[0.98] disabled:bg-slate-200 disabled:text-slate-400 
                             disabled:shadow-none transition-all flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <span className="animate-pulse">Processing...</span>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Complete Transaction
                        </>
                    )}
                </button>
            </div>
                <ConfirmDialog
                    open={confirmOpen}
                    title="Clear all items?"
                    message="This will remove all items from the cart."
                    onCancel={() => setConfirmOpen(false)}
                    onConfirm={() => {
                        onClearCart();
                        setConfirmOpen(false);
                    }}
                />
        </div>
    );
}