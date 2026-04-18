import { useEffect, useState, useRef } from "react";
import { AlertTriangle, Plus } from "lucide-react";

export default function AddToCartPanel({ product, onAdd }) {
  const [qty, setQty] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    setQty("");
    if (product) setTimeout(() => inputRef.current?.focus(), 50);
  }, [product]);

  if (!product) {
    return (
      <div className="py-10 border border-dashed border-slate-200 rounded-xl bg-slate-50/30 text-center">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Select an item to start</p>
      </div>
    );
  }

  const quantity = Number(qty) || 0;
  const isOutOfStock = product.stock_qty < quantity;

  const handleAdd = () => {
    if (quantity <= 0 || isOutOfStock) return;
    onAdd({
      product_id: product.id,
      name: product.name,
      unit_price: Number(product.selling_price),
      quantity,
      image: product.image, 
    });
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-start gap-4">

        {/* IMAGE */}
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 shrink-0">
          <img
            src={`http://localhost:8000/storage/${product.image}`}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://placehold.co/100x100?text=No+Image';
            }}
          />
        </div>

        {/* INFO */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 truncate">
            {product.name}
          </h3>

          <p className={`text-[11px] font-medium mt-0.5 ${product.stock_qty < 10 ? 'text-orange-500' : 'text-slate-400'
            }`}>
            {product.stock_qty} in stock
          </p>
        </div>

        {/* PRICE */}
        <div className="text-right shrink-0">
          <p className="text-lg font-bold text-slate-900 dark:text-slate-200">
            ₱{Number(product.selling_price).toFixed(2)}
          </p>
        </div>

      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="number"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Qty"
            className={`w-full px-4 py-2.5 border rounded-lg text-sm font-bold outline-none transition-all
        ${isOutOfStock
                ? "border-red-200 dark:border-red-500 text-red-600 bg-red-50 dark:bg-red-900/30"
                : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-700 focus:border-slate-900 dark:focus:border-white"
              }`}
          />
        </div>

        <button
          onClick={handleAdd}
          disabled={quantity <= 0 || isOutOfStock}
          className="px-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-800 dark:hover:bg-slate-200 disabled:bg-slate-100 dark:disabled:bg-slate-700 disabled:text-slate-300 dark:disabled:text-slate-500 transition-all active:scale-95"
        >
          <Plus size={16} />
          <span className="text-xs font-bold uppercase tracking-widest">
            Add
          </span>
        </button>
      </div>

      {isOutOfStock && (
        <div className="flex items-center gap-2 text-red-600 text-[10px] font-bold uppercase">
          <AlertTriangle size={12} /> Limit exceeded
        </div>
      )}
    </div>
  );
}