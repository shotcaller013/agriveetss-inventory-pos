import { useState } from "react";

export default function ProductModal({ open, onClose, onSave }) {
    const [form, setForm] = useState({
        name: "",
        unit_type: "pcs",
        cost_price: "",
        selling_price: "",
        stock_qty: "",
    });

    if (!open) return null;

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
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
                        Add Product
                    </h2>
                    <button onClick={onClose}>✕</button>
                </div>

                {/* Body */}
                <form onSubmit={submit} className="p-4 space-y-3">
                    <input
                        name="name"
                        placeholder="Product name"
                        className="w-full border px-3 py-2 rounded"
                        onChange={handleChange}
                        required
                    />

                    <select
                        name="unit_type"
                        className="w-full border px-3 py-2 rounded"
                        onChange={handleChange}
                    >
                        <option value="pcs">PCS</option>
                        <option value="kg">KG</option>
                        <option value="pack">PACK</option>
                    </select>

                    <input
                        name="cost_price"
                        type="number"
                        step="0.01"
                        placeholder="Cost price"
                        className="w-full border px-3 py-2 rounded"
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="selling_price"
                        type="number"
                        step="0.01"
                        placeholder="Selling price"
                        className="w-full border px-3 py-2 rounded"
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="stock_qty"
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
