import { useState, useEffect, useMemo } from "react";
import ImageUploader from "./ImageUploader";

const initialState = {
    name: "",
    unit_type: "pcs",
    cost_price: "",
    selling_price: "",
    stock_qty: "",
};

export default function ProductModal({ open, onClose, onSave, product }) {
    const [form, setForm] = useState(initialState);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (!open) return;

        if (product) {
            setForm({
                name: product.name ?? "",
                unit_type: product.unit_type ?? "pcs",
                cost_price: product.cost_price ?? "",
                selling_price: product.selling_price ?? "",
                stock_qty: product.stock_qty ?? "",
                image: null,
            });

            setPreview(`http://localhost:8000/storage/${product.image}`);
            setImage(null);
        } else {
            setForm(initialState);
            setPreview(null);
            setImage(null);
        }
    }, [open, product]);
    // Live Margin Calculation
    const marginStats = useMemo(() => {
        const cost = parseFloat(form.cost_price) || 0;
        const sell = parseFloat(form.selling_price) || 0;
        const profit = sell - cost;
        const percentage = cost > 0 ? (profit / cost) * 100 : 0;
        return { profit, percentage };
    }, [form.cost_price, form.selling_price]);

    if (!open) return null;

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        // Basic validation: Prevent negative numbers for prices/stock
        if (type === "number" && value < 0) return;

        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("name", form.name);
        formData.append("unit_type", form.unit_type);
        formData.append("cost_price", form.cost_price);
        formData.append("selling_price", form.selling_price);
        formData.append("stock_qty", form.stock_qty);

        // only if new file
        if (image) {
            formData.append("image", image);
        }

        onSave(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">

            <div
                className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-8 py-6 bg-slate-50/50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-black text-slate-800 dark:text-white">
                            {product ? "Update Product" : "New Inventory Item"}
                        </h2>

                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">
                            {product ? `ID: #${product.id}` : "Basic Details"}
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center rounded-full 
                hover:bg-white dark:hover:bg-slate-700 
                hover:shadow-md transition-all 
                text-slate-400 hover:text-slate-600 dark:hover:text-white"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-8 space-y-5">

                    {/* Name */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">
                            Product Identifier
                        </label>

                        <input
                            required
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Enter descriptive name..."
                            className="w-full bg-slate-50 dark:bg-slate-800 
                    text-slate-900 dark:text-white
                    border-none rounded-2xl px-4 py-3 text-sm font-semibold 
                    focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <ImageUploader
                        image={image}
                        setImage={setImage}
                        preview={preview}
                        setPreview={setPreview}
                    />

                    <div className="grid grid-cols-2 gap-4">

                        {/* Unit */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">
                                Measuring Unit
                            </label>

                            <select
                                name="unit_type"
                                value={form.unit_type}
                                onChange={handleChange}
                                className="w-full bg-slate-50 dark:bg-slate-800 
                        text-slate-900 dark:text-white
                        border-none rounded-2xl px-4 py-3 text-sm font-semibold 
                        focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="pcs">Pieces (pcs)</option>
                                <option value="kg">Kilograms (kg)</option>
                                <option value="pack">Pack</option>
                                <option value="box">Box</option>
                            </select>
                        </div>

                        {/* Stock */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">
                                Initial Stock
                            </label>

                            <input
                                required
                                type="number"
                                name="stock_qty"
                                value={form.stock_qty}
                                onChange={handleChange}
                                className="w-full bg-slate-50 dark:bg-slate-800 
                        text-blue-600 dark:text-blue-400
                        border-none rounded-2xl px-4 py-3 text-sm font-bold 
                        focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    {/* Pricing Section */}
                    <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-700 space-y-4">

                        <div className="grid grid-cols-2 gap-4">

                            {/* Cost */}
                            <div>
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                    Cost Price
                                </label>

                                <input
                                    type="number"
                                    name="cost_price"
                                    value={form.cost_price}
                                    onChange={handleChange}
                                    className="w-full bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2.5"
                                />
                            </div>

                            {/* Selling */}
                            <div>
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                    Selling Price
                                </label>

                                <input
                                    type="number"
                                    name="selling_price"
                                    value={form.selling_price}
                                    onChange={handleChange}
                                    className="w-full bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2.5"
                                />
                            </div>
                        </div>

                        {/* Profit */}
                        <div className={`flex justify-between px-4 py-2 rounded-xl text-[11px] font-black uppercase
                    ${marginStats.profit >= 0
                                ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                                : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                            }`}
                        >
                            <span>Profit: ₱{marginStats.profit.toFixed(2)}</span>
                            <span>{marginStats.percentage.toFixed(1)}%</span>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex gap-3 pt-4">

                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-2xl"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="flex-[2] px-6 py-3 text-sm font-bold bg-blue-600 text-white rounded-2xl hover:bg-blue-700"
                        >
                            {product ? "Save Changes" : "Add Product"}
                        </button>

                    </div>
                </form>
            </div>
        </div>
    );
}