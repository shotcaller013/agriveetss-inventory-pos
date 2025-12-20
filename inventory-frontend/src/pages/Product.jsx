import React from "react";
import MainLayout from "../layout/MainLayout";
import { useState } from "react";
import ProductModal from "../components/ProductModal";
import api from "../api/axios";

export default function Product() {
    const [open, setOpen] = useState(false);

    const handleSave = async (product) => {
        try {
            await api.post("/products", product);
            setOpen(false);
            // Optionally, refresh the product list here
        } catch (err) {
            console.error("Failed to save product:", err);
        }
    };

    return (
        <MainLayout>
            <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-slate-800">
                        Products
                    </h1>

                    <button onClick={() => setOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Add Product
                    </button>

                    <ProductModal
                        open={open}
                        onClose={() => setOpen(false)}
                        onSave={handleSave}
                    />
                </div>

                {/* Table */}
                <div className="bg-white rounded shadow overflow-hidden">
                    <table className="min-w-full text-sm">
                        <thead className="bg-slate-100 text-slate-700">
                            <tr>
                                <th className="px-4 py-3 text-left">ID</th>
                                <th className="px-4 py-3 text-left">Name</th>
                                <th className="px-4 py-3 text-right">Price</th>
                                <th className="px-4 py-3 text-right">Stock</th>
                                <th className="px-4 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-t hover:bg-slate-50">
                                <td className="px-4 py-2">1</td>
                                <td className="px-4 py-2">Product A</td>
                                <td className="px-4 py-2 text-right">₱10.00</td>
                                <td className="px-4 py-2 text-right">100</td>
                                <td className="px-4 py-2 text-right">
                                    <button className="text-blue-600 hover:underline"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                                    </svg>
                                        Edit
                                    </button>
                                    <button className="ml-4 text-red-600 hover:underline"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102-1V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                        Delete
                                    </button>
                                </td>

                            </tr>

                            <tr className="border-t hover:bg-slate-50">
                                <td className="px-4 py-2">2</td>
                                <td className="px-4 py-2">Product B</td>
                                <td className="px-4 py-2 text-right">₱15.00</td>
                                <td className="px-4 py-2 text-right">150</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </MainLayout>
    );
}
