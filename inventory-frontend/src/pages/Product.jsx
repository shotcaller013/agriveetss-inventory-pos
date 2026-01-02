import MainLayout from "../layout/MainLayout";
import { useState, useEffect } from "react";
import ProductModal from "../components/ProductModal";
import api from "../api/axios";
import { toast } from "react-toastify";

export default function Product() {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [products, setProducts] = useState([]);
    const [nextCursor, setNextCursor] = useState(null);
    const [prevCursor, setPrevCursor] = useState(null);
    const [loading, setLoading] = useState(false);
    const [editProduct, setEditProduct] = useState(false);

    const fetchProducts = async (cursorParam = null) => {
        if (loading) return;
        try {
            setLoading(true);

            const res = await api.get("/products", {
                params: {
                    search,
                    cursor: cursorParam,
                },
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

    const deleteProductById = async (id) => {
        try {
            await api.delete(`/products/${id}`);
            setProducts((prev) => prev.filter((p) => p.id !== id));
            toast.success("Product deleted successfully");
        } catch {
            toast.error("Failed to delete product");
        }
    };

    


    // Initial load + search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchProducts(null);
        }, 400);

        return () => clearTimeout(timer);
    }, [search]);

    const handleSave = async (data) => {
        console.log("Saving product", data);
        try {
            if (editProduct) {
                const res = await api.put(`/products/${editProduct.id}`, data);
                setProducts((prev) => prev.map((p) => (p.id === editProduct.id ? res.data.product : p)));
                toast.success("Product updated successfully");
                setEditProduct(null);
                setOpen(false);
            }
            else {
                const res = await api.post("/products", data);
                console.log("Product save response", res);
                setProducts((prev) => [res.data.product, ...prev]);
                toast.success("Product saved successfully");
                setOpen(false);
            }
        } catch {
            toast.error("Failed to add product");
        }
    };

    return (
        <MainLayout>
            <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-slate-800">Products</h1>

                    <button
                        onClick={() => setOpen(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Add Product
                    </button>

                    <ProductModal
                        open={open}
                        product={editProduct}
                        onClose={() => {
                            setOpen(false);
                            setEditProduct(null);
                        }}
                        onSave={handleSave}
                    />

                </div>

                {/* Search */}
                <div className="mb-4 text-right">
                    <input
                        type="text"
                        className="w-64 px-3 py-2 border rounded"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Table */}
                <div className="bg-white rounded shadow overflow-hidden">
                    <table className="min-w-full text-sm">
                        <thead className="bg-slate-100 text-slate-700">
                            <tr>
                                <th className="px-4 py-3 text-left">#</th>
                                <th className="px-4 py-3 text-left">Name</th>
                                <th className="px-4 py-3 text-left">Cost</th>
                                <th className="px-4 py-3 text-right">Unit</th>
                                <th className="px-4 py-3 text-right">Selling</th>
                                <th className="px-4 py-3 text-right">Stock</th>
                                <th className="px-4 py-3 text-right">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {!loading && products.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="px-4 py-6 text-center text-gray-500">
                                        No products found
                                    </td>
                                </tr>
                            )}

                            {products.map((product, index) => (
                                <tr key={product.id} className="border-t hover:bg-slate-50">
                                    <td className="px-4 py-3">{index + 1}</td>
                                    <td className="px-4 py-3">{product.name}</td>
                                    <td className="px-4 py-3">{product.cost_price}</td>
                                    <td className="px-4 py-3 text-right">
                                        {product.unit_type}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        {product.selling_price}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        {product.stock_qty}
                                    </td>
                                    <td className="px-4 py-3 text-right space-x-2">
                                        <button onClick={() => { setEditProduct(product); setOpen(true); }} className="text-blue-600 hover:text-blue-800">
                                            Edit
                                        </button>
                                        <button onClick={() => { deleteProductById(product.id) }} className="text-red-600 hover:text-red-800">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-between mt-4">
                    <button
                        disabled={!prevCursor || loading}
                        onClick={() => fetchProducts(prevCursor)}
                        className="px-4 py-2 text-sm border rounded
              disabled:opacity-50 disabled:cursor-not-allowed
              hover:bg-gray-100"
                    >
                        Prev
                    </button>

                    <button
                        disabled={!nextCursor || loading}
                        onClick={() => fetchProducts(nextCursor)}
                        className="px-4 py-2 text-sm text-white bg-blue-600 rounded
              hover:bg-blue-700
              disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            </div>
        </MainLayout>
    );
}
