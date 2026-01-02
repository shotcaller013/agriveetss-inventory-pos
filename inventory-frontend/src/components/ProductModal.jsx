import { useState, useEffect } from "react";

const initialState = {
    name: "",
    unit_type: "pcs",
    cost_price: "",
    selling_price: "",
    stock_qty: "",
};

export default function ProductModal({ open, onClose, onSave, product }) {
    const [form, setForm] = useState(initialState);
    console.log("ProductModal render", { open, product });
    useEffect(() => {
        if (!open) return;

        setForm(
            product
                ? {
                    name: product.name || "",
                    unit_type: product.unit_type || "pcs",
                    cost_price: product.cost_price || "",
                    selling_price: product.selling_price || "",
                    stock_qty: product.stock_qty || "",
                }
                : initialState
        );
    }, [open]);

    if (!open) return null;


    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const submit = (e) => {
        e.preventDefault();
        onSave(form);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white w-full max-w-md rounded shadow">
                {/* Header */}
                <div className="flex justify-between items-center px-4 py-3 border-b">
                    <h2 className="font-semibold text-lg">
                        {product ? "Edit Product" : "Add Product"}
                    </h2>
                    <button onClick={onClose}>✕</button>
                </div>

                {/* Body */}
                <form onSubmit={submit} className="p-4 space-y-3">
                    <input
                        name="name"
                        value= {form.name}
                        placeholder="Product name"
                        className="w-full border px-3 py-2 rounded"
                        onChange={handleChange}
                        required
                    />

                    <select
                        name="unit_type"
                        value={form.unit_type}
                        className="w-full border px-3 py-2 rounded"
                        onChange={handleChange}
                    >
                        <option value="pcs">PCS</option>
                        <option value="kg">KG</option>
                        <option value="pack">PACK</option>
                    </select>

                    <input
                        name="cost_price"
                        value={form.cost_price}
                        type="number"
                        step="0.01"
                        placeholder="Cost price"
                        className="w-full border px-3 py-2 rounded"
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="selling_price"
                        value={form.selling_price}
                        type="number"
                        step="0.01"
                        placeholder="Selling price"
                        className="w-full border px-3 py-2 rounded"
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="stock_qty"
                        value={form.stock_qty}
                        type="number"
                        step="0.001"
                        placeholder="Stock quantity"
                        className="w-full border px-3 py-2 rounded"
                        onChange={handleChange}
                        required
                    />

                    {/* Footer */}
                    <div className="flex justify-end gap-2 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
