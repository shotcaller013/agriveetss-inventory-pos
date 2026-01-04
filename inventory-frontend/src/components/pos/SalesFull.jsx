import { useEffect, useState } from "react";

export default function SalePanel({
    product,
    onCompleteSale,
    loading = false,
}) {
    const [qty, setQty] = useState("");
    const [cash, setCash] = useState("");

    useEffect(() => {
        setQty("");
        setCash("");
    }, [product]);

    if (!product) {
        return (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                Select a product to start selling
            </div>
        );
    }

    const price = Number(product.selling_price);
    const quantity = Number(qty) || 0;
    const subtotal = quantity * price;
    const cashAmount = Number(cash) || 0;
    const change = cashAmount - subtotal;

    const isKg = product.unit_type === "kg";
    const qtyStep = isKg ? "0.01" : "1";

    const canSubmit =
        quantity > 0 &&
        subtotal > 0 &&
        cashAmount >= subtotal &&
        !loading;

    const handleSubmit = () => {
        if (!canSubmit) return;

        onCompleteSale({
            product_id: product.id,
            quantity,
            unit_price: price,
            cash: cashAmount,
        });
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-lg shadow-md p-4">
            {/* Product */}
            <div className="mb-5">
                <h2 className="text-xl font-semibold">{product.name}</h2>
                <p className="text-sm text-gray-500">
                    ₱{price.toFixed(2)} / {product.unit_type}
                </p>
            </div>

            {/* Quantity */}
            <div className="mb-4">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                    Quantity ({product.unit_type})
                </label>
                <input
                    type="number"
                    step={qtyStep}
                    min="0"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    className="w-full border rounded-md px-3 py-2 text-right
                               focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder={isKg ? "e.g. 2.50" : "e.g. 1"}
                />
            </div>

            {/* Subtotal */}
            <div className="mb-4 bg-gray-50 rounded-md p-3">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-bold text-lg">
                        ₱{subtotal.toFixed(2)}
                    </span>
                </div>
            </div>

            {/* Cash */}
            <div className="mb-4">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                    Cash Received
                </label>
                <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={cash}
                    onChange={(e) => setCash(e.target.value)}
                    className="w-full border rounded-md px-3 py-2 text-right
                               focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Enter cash amount"
                />
            </div>

            {/* Change */}
            <div className="mb-6">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Change</span>
                    <span
                        className={`font-bold text-lg ${change < 0 ? "text-red-600" : "text-green-600"
                            }`}
                    >
                        ₱{change.toFixed(2)}
                    </span>
                </div>
            </div>

            {/* Submit */}
            <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className=" bg-blue-600 text-white py-3 rounded-md font-medium
                           hover:bg-blue-700 active:scale-[0.98] transition
                           disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? "Processing..." : "Complete Sale"}
            </button>
        </div>
    );
}
