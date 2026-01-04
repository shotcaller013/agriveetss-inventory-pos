import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";

export default function AddToCartPanel({ product, onAdd }) {
    const [qty, setQty] = useState("");
    const inputRef = useRef(null);
    useEffect(() => {
        setQty("");
        if (product) inputRef.current?.focus();
    }, [product]);

    if (!product) {
        return (
            <div className="p-6 text-center text-[11px] text-gray-400
                            border border-dashed rounded-lg">
                Select item
            </div>
        );
    }

    const quantity = Number(qty) || 0;
    const canAdd = quantity > 0;
    const outStock = product.stock_qty < qty;
    console.log(outStock);

    const handleAdd = () => {
        if (!canAdd) return;
        if (outStock) {
            toast.warning(`${product.name} is out of stock`);
            return;
        }
        onAdd({
            product_id: product.id,
            name: product.name,
            unit_price: Number(product.selling_price),
            quantity,
        });
    };

    return (
        <div className="bg-white border rounded-lg p-3 space-y-2">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-gray-800 leading-tight truncate">
                    {product.name}
                </h3>
                <span className="px-1.5 py-0.5 text-[10px] font-bold
                                 uppercase rounded bg-gray-100 text-gray-600">
                    {product.unit_type}
                </span>
            </div>

            {/* Input + Action */}
            <div className="flex gap-2">
                <input
                    ref={inputRef}
                    type="number"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                    placeholder="Qty"
                    className="flex-1 px-2 py-1.5 border rounded text-sm text-right
                               focus:ring-1 focus:ring-black focus:outline-none"
                />

                <button
                    onClick={handleAdd}
                    disabled={!canAdd}
                    className="px-4 py-1.5 rounded text-xs font-bold tracking-wide
                               bg-black text-white
                               disabled:bg-gray-200 disabled:text-gray-400
                               transition"
                >
                    ADD
                </button>
            </div>
        </div>
    );
}
