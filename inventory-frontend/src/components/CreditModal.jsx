import { useState, useEffect } from "react";

export default function CreditModal({ open, onClose, onSave, items, credit }) {



    const [form, setForm] = useState({
        customer_name: "",
        due_date: "",
    });

    useEffect(() => {
        if (!open) return;
        if (credit) {
            setForm({
                customer_name: credit.customer_name ?? "",
                due_date: credit.due_date ?? "",
            });
        } else {
            setForm({
                customer_name: "",
                due_date: "",
            });
        }
    }, [open, credit]);


    if (!open) return null;
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        if (type === "number" && value < 0) return;
        setForm((prev) => ({ ...prev, [name]: value }));
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const mappingItems = items.map((item) => ({
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
        }));
        const creditData = {
            ...form,
            items: mappingItems,
        };
        onSave(creditData);
    }
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <h2 className="text-xl font-semibold text-slate-800">
                        {credit ? "Edit Credit" : "Add Credit"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition"
                    >
                        &times;
                    </button>
                </div>
                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Customer Name
                        </label>
                        <input
                            type="text"
                            name="customer_name"
                            value={form.customer_name}
                            onChange={handleChange}
                            className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter customer name"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Due Date
                        </label>
                        <input
                            type="date"
                            name="due_date"
                            value={form.due_date}
                            onChange={handleChange}
                            className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}