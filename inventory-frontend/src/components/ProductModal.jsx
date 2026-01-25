import { useState, useEffect, useMemo } from "react";

const initialState = {
    name: "",
    unit_type: "pcs",
    cost_price: "",
    selling_price: "",
    stock_qty: "",
};

export default function ProductModal({ open, onClose, onSave, product }) {
    const [form, setForm] = useState(initialState);

    useEffect(() => {
        if (!open) return;

        if (product) {
            setForm({
                name: product.name ?? "",
                unit_type: product.unit_type ?? "pcs",
                cost_price: product.cost_price ?? "",
                selling_price: product.selling_price ?? "",
                stock_qty: product.stock_qty ?? "",
            });
        } else {
            setForm(initialState);
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
        onSave(form);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-8 py-6 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-black text-slate-800">
                            {product ? "Update Product" : "New Inventory Item"}
                        </h2>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                            {product ? `ID: #${product.id}` : "Basic Details"}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:shadow-md transition-all text-slate-400 hover:text-slate-600"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-8 space-y-5">
                    {/* Name */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                            Product Identifier
                        </label>
                        <input
                            required
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Enter descriptive name..."
                            className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Unit */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                Measuring Unit
                            </label>
                            <select
                                name="unit_type"
                                value={form.unit_type}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                            >
                                <option value="pcs">Pieces (pcs)</option>
                                <option value="kg">Kilograms (kg)</option>
                                <option value="pack">Pack</option>
                                <option value="box">Box</option>
                            </select>
                        </div>

                        {/* Stock */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                Initial Stock
                            </label>
                            <input
                                required
                                type="number"
                                name="stock_qty"
                                value={form.stock_qty}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-blue-600 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    {/* Pricing Section */}
                    <div className="bg-slate-50 p-5 rounded-[2rem] border border-slate-100 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Cost Price
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-slate-400 text-sm">₱</span>
                                    <input
                                        required
                                        type="number"
                                        name="cost_price"
                                        step="0.01"
                                        value={form.cost_price}
                                        onChange={handleChange}
                                        className="w-full bg-white border-none rounded-xl pl-7 pr-3 py-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Selling Price
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-slate-400 text-sm">₱</span>
                                    <input
                                        required
                                        type="number"
                                        name="selling_price"
                                        step="0.01"
                                        value={form.selling_price}
                                        onChange={handleChange}
                                        className="w-full bg-white border-none rounded-xl pl-7 pr-3 py-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Real-time Profit Badge */}
                        <div className={`flex items-center justify-between px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-tighter transition-all ${marginStats.profit >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                            <span>Estimated Profit: ₱{marginStats.profit.toFixed(2)}</span>
                            <span>{marginStats.percentage.toFixed(1)}% Margin</span>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3.5 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-2xl transition-all"
                        >
                            Dismiss
                        </button>
                        <button
                            type="submit"
                            className="flex-[2] px-6 py-3.5 text-sm font-bold bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all"
                        >
                            {product ? "Save Changes" : "Confirm & Add"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}