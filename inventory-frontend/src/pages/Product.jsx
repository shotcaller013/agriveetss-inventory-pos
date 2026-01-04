import MainLayout from "../layout/MainLayout";
import { useState, useEffect } from "react";
import ProductModal from "../components/ProductModal";
import ConfirmDialog from "../components/ConfirmDialog";
import api from "../api/axios";
import { toast } from "react-toastify";

export default function Product() {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [products, setProducts] = useState([]);
    const [nextCursor, setNextCursor] = useState(null);
    const [prevCursor, setPrevCursor] = useState(null);
    const [loading, setLoading] = useState(false);
    const [editProduct, setEditProduct] = useState(null);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const fetchProducts = async (cursorParam = null) => {
        if (loading) return;

        try {
            setLoading(true);
            const res = await api.get("/products", {
                params: { search, cursor: cursorParam },
            });

            setProducts(res.data.data || []);
            setNextCursor(res.data.next_cursor || null);
            setPrevCursor(res.data.prev_cursor || null);
        } catch {
            toast.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => fetchProducts(null), 400);
        return () => clearTimeout(timer);
    }, [search]);

    const handleSave = async (data) => {
        try {
            if (editProduct) {
                const res = await api.put(
                    `/products/${editProduct.id}`,
                    data
                );

                setProducts(prev =>
                    prev.map(p =>
                        p.id === editProduct.id ? res.data.product : p
                    )
                );

                toast.success("Product updated");
            } else {
                const res = await api.post("/products", data);
                setProducts(prev => [res.data.product, ...prev]);
                toast.success("Product added");
            }

            setEditProduct(null);
            setOpen(false);
        } catch {
            toast.error("Failed to save product");
        }
    };

    const confirmDelete = async () => {
        try {
            await api.delete(`/products/${deleteId}`);
            setProducts(prev =>
                prev.filter(p => p.id !== deleteId)
            );
            toast.success("Product deleted");
        } catch {
            toast.error("Failed to delete product");
        } finally {
            setConfirmOpen(false);
            setDeleteId(null);
        }
    };

    return (
        <MainLayout>
            <div className="space-y-6">
                {/* Header + Actions */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-slate-800">
                        Products
                    </h1>

                    <button
                        onClick={() => setOpen(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg
                           text-sm font-medium hover:bg-blue-700"
                    >
                        + Add Product
                    </button>
                </div>

                {/* Toolbar */}
                <div className="flex items-center justify-between">
                    <input
                        type="text"
                        className="w-72 px-3 py-2 border rounded-lg text-sm
                           focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Product Modal */}
                <ProductModal
                    open={open}
                    product={editProduct}
                    onClose={() => {
                        setOpen(false);
                        setEditProduct(null);
                    }}
                    onSave={handleSave}
                />

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <table className="min-w-full text-sm">
                        <thead className="bg-slate-100 text-slate-600 uppercase text-xs">
                            <tr>
                                <th className="px-4 py-3 text-left">ID</th>
                                <th className="px-4 py-3 text-left">Product</th>
                                <th className="px-4 py-3 text-right">Cost</th>
                                <th className="px-4 py-3 text-center">Unit</th>
                                <th className="px-4 py-3 text-right">Selling</th>
                                <th className="px-4 py-3 text-right">Stock</th>
                                <th className="px-4 py-3 text-right">Action</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {!loading && products.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="px-4 py-12 text-center text-gray-500"
                                    >
                                        No products found
                                    </td>
                                </tr>
                            )}

                            {products.map(product => (
                                <tr
                                    key={product.id}
                                    className="hover:bg-slate-50 transition"
                                >
                                    <td className="px-4 py-3 text-gray-500">
                                        {product.id}
                                    </td>

                                    <td className="px-4 py-3 font-medium">
                                        {product.name}
                                    </td>

                                    <td className="px-4 py-3 text-right">
                                        ₱{Number(product.cost_price).toFixed(2)}
                                    </td>

                                    <td className="px-4 py-3 text-center">
                                        <span className="px-2 py-1 text-xs font-semibold bg-slate-200 rounded">
                                            {product.unit_type.toUpperCase()}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3 text-right">
                                        ₱{Number(product.selling_price).toFixed(2)}
                                    </td>

                                    <td className="px-4 py-3 text-right">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold
            ${product.stock_qty <= 5
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-green-100 text-green-700"
                                                }`}
                                        >
                                            {product.stock_qty}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3 text-right space-x-2">
                                        <button
                                            onClick={() => {
                                                setEditProduct(product);
                                                setOpen(true);
                                            }}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            ✎
                                        </button>

                                        <button
                                            onClick={() => {
                                                setDeleteId(product.id);
                                                setConfirmOpen(true);
                                            }}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            🗑
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center">
                    <button
                        disabled={!prevCursor || loading}
                        onClick={() => fetchProducts(prevCursor)}
                        className="px-4 py-2 text-sm border rounded-lg
                           hover:bg-gray-100 disabled:opacity-50"
                    >
                        ← Prev
                    </button>

                    <button
                        disabled={!nextCursor || loading}
                        onClick={() => fetchProducts(nextCursor)}
                        className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg
                           hover:bg-blue-700 disabled:opacity-50"
                    >
                        Next →
                    </button>
                </div>
            </div>

            {/* Confirm Dialog */}
            <ConfirmDialog
                open={confirmOpen}
                title="Delete product"
                message="This product will be permanently deleted."
                onCancel={() => {
                    setConfirmOpen(false);
                    setDeleteId(null);
                }}
                onConfirm={confirmDelete}
            />
        </MainLayout>

    );
}
