import { useState, useEffect } from "react";
import ConfirmDialog from "../ConfirmDialog";
import {
  ShoppingCart,
  RotateCcw,
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
    <div className="flex flex-col  bg-white dark:bg-slate-900">

      {/* HEADER */}
      <div className="p-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-slate-900 text-white rounded-lg">
            <ShoppingCart size={16} />
          </div>
          <div>
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Current Order
            </h2>
            <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">
              {cart.reduce((a, b) => a + b.quantity, 0)} Units
            </p>
          </div>
        </div>

        {cart.length > 0 && (
          <button
            onClick={() => setConfirmOpen(true)}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl"
          >
            <RotateCcw size={18} />
          </button>
        )}
      </div>

      {/* ITEMS */}
      <div className="p-4 space-y-3 custom-scrollbar max-h-[300px] overflow-y-auto">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-600">
            <ShoppingCart size={32} />
            <p className="text-sm font-bold uppercase mt-2">
              Cart is empty
            </p>
          </div>
        ) : (
          cart.map((item) => (
            <div
              key={item.product_id}
              className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            >

              {/* IMAGE */}
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 shrink-0">
                <img
                  src={`http://localhost:8000/storage/${item.image}`}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/100x100?text=No';
                  }}
                />
              </div>

              {/* INFO */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-slate-800 dark:text-white truncate">
                  {item.name}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">
                  {formatPrice(item.unit_price)}
                </p>
              </div>

              {/* QTY */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                <button
                  onClick={() => updateQty(item.product_id, -1)}
                  className="w-7 h-7 flex items-center justify-center hover:text-red-500"
                >
                  −
                </button>
                <span className="w-8 text-center text-xs font-black text-slate-800 dark:text-white">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQty(item.product_id, 1)}
                  className="w-7 h-7 flex items-center justify-center hover:text-blue-500"
                >
                  +
                </button>
              </div>

              {/* TOTAL */}
              <div className="w-20 text-right font-bold text-slate-900 dark:text-white">
                {formatPrice(item.quantity * item.unit_price)}
              </div>

            </div>
          ))
        )}
      </div>

      {/* SUMMARY */}
      <div className="sticky bottom-0 p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        <div className="space-y-4">

          {/* TOTAL & CHANGE ROW */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-baseline">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Payable
              </span>
              <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
                {formatPrice(total)}
              </span>
            </div>

            <div className="flex justify-between items-center h-8">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Change Due
              </span>
              <span className={`font-mono text-lg font-bold transition-colors ${change > 0 ? "text-emerald-500" : "text-slate-300 dark:text-slate-700"
                }`}>
                ₱{Math.max(0, change).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* MINIMAL CASH INPUT */}
          <div className="relative group">
            <input
              type="number"
              value={cash}
              onChange={(e) => setCash(e.target.value)}
              placeholder="0.00"
              className={`w-full py-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-center text-2xl font-black transition-all outline-none border-2
                    ${isInsufficient
                  ? "border-red-100 dark:border-red-900/20 text-red-500"
                  : "border-transparent focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-slate-100 dark:focus:ring-slate-800/50 text-slate-900 dark:text-white"
                }`}
            />
            {!cash && (
              <span className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 pointer-events-none text-sm font-bold uppercase tracking-widest">
              </span>
            )}
          </div>

          {/* CHECKOUT BUTTON */}
          <button
            onClick={() => canCheckout && onCheckout({ items: cart, cash: cashAmount })}
            disabled={!canCheckout}
            className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-[0.15em] transition-all
                ${canCheckout
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl shadow-slate-200 dark:shadow-none active:scale-[0.98]"
                : "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
              }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Processing
              </span>
            ) : (
              "Complete Transaction"
            )}
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Clear Cart?"
        message="Remove all items?"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          onClearCart();
          setConfirmOpen(false);
        }}
      />
    </div>
  );
}