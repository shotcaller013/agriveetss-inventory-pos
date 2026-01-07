import { useState, useEffect } from "react";
import ConfirmDialog from "../ConfirmDialog";
import {
  Trash2,
  ShoppingCart,
  Banknote,
  RotateCcw,
  CreditCard,
} from "lucide-react";

const formatPrice = (amount) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount);

export default function CartPanel({
  cart,
  updateQty,
  onCheckout,
  onClearCart,
  loading = false,
}) {
  const [cash, setCash] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const total = cart.reduce(
    (sum, item) => sum + item.quantity * item.unit_price,
    0
  );

  const cashAmount = Number(cash) || 0;
  const change = cashAmount - total;
  const isInsufficient = cashAmount < total && cashAmount > 0;
  const canCheckout = cart.length > 0 && cashAmount >= total && !loading;

  useEffect(() => {
    if (cart.length === 0) setCash("");
  }, [cart.length]);

  return (
    <div className="bg-white flex flex-col h-full min-h-0 border-t md:border-t-0">
      {/* HEADER */}
      <div className="p-4 flex items-center justify-between border-b bg-slate-50/30">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-slate-900 rounded-lg text-white">
            <ShoppingCart size={16} />
          </div>
          <div>
            <h2 className="text-xs font-black tracking-widest uppercase text-slate-500">
              Current Order
            </h2>
            <p className="text-[10px] font-bold text-blue-600 uppercase">
              {cart.reduce((a, b) => a + b.quantity, 0)} Units
            </p>
          </div>
        </div>

        {cart.length > 0 && (
          <button
            onClick={() => setConfirmOpen(true)}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
            title="Clear Cart"
          >
            <RotateCcw size={18} />
          </button>
        )}
      </div>

      {/* CART ITEMS (SCROLLABLE) */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3 min-h-0">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-300">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <ShoppingCart size={32} />
            </div>
            <p className="text-sm font-bold uppercase tracking-widest">
              Cart is empty
            </p>
          </div>
        ) : (
          cart.map((item) => (
            <div
              key={item.product_id}
              className="flex items-center gap-4 p-3 bg-white rounded-2xl border shadow-sm"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-slate-800 truncate">
                  {item.name}
                </p>
                <p className="text-[10px] font-bold text-slate-400">
                  {formatPrice(item.unit_price)} / unit
                </p>
              </div>

              {/* QTY */}
              <div className="flex items-center bg-slate-100 rounded-xl p-1 border">
                <button
                  onClick={() => updateQty(item.product_id, -1)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white hover:text-red-500"
                >
                  −
                </button>
                <span className="w-8 text-center text-xs font-black">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQty(item.product_id, 1)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white hover:text-blue-600"
                >
                  +
                </button>
              </div>

              <div className="w-20 text-right text-sm font-black">
                {formatPrice(item.quantity * item.unit_price)}
              </div>
            </div>
          ))
        )}
      </div>

      {/* SUMMARY (ALWAYS VISIBLE) */}
      <div className="mt-4 pt-4 border-t border-slate-200 bg-slate-50 -mx-4 px-4 pb-0 rounded-b-2xl">
        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400 uppercase">
              Total Payable
            </span>
            <span className="text-3xl font-black text-slate-900 tracking-tighter">
              {formatPrice(total)}
            </span>
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
              ₱
            </span>
            <input
              type="number"
              value={cash}
              onChange={(e) => setCash(e.target.value)}
              placeholder="Amount Tendered"
              className={`w-full bg-white border-2 rounded-xl pl-7 pr-3 py-3 text-right text-xl font-mono font-bold transition-all outline-none
                                ${
                                  isInsufficient
                                    ? "border-red-200 bg-red-50 text-red-600"
                                    : "border-slate-100 focus:border-green-500"
                                }`}
            />
          </div>

          <div className="flex justify-between items-center px-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-tight">
              Change Due
            </span>
            <span
              className={`text-lg font-mono font-black ${
                change < 0 ? "text-slate-300" : "text-green-600"
              }`}
            >
              {Math.max(0, change)}
            </span>
          </div>
        </div>

        <button
          onClick={() =>
            canCheckout && onCheckout({ items: cart, cash: cashAmount })
          }
          disabled={!canCheckout}
          className="w-full bg-green-600 text-white py-4 rounded-xl font-black text-lg shadow-lg shadow-green-100
                             hover:bg-green-700 active:scale-[0.98] disabled:bg-slate-200 disabled:text-slate-400 
                             disabled:shadow-none transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="animate-pulse">Processing...</span>
          ) : (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Complete Transaction
            </>
          )}
        </button>
      </div>

      {/* CONFIRM DIALOG */}
      <ConfirmDialog
        open={confirmOpen}
        title="Clear Cart?"
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
