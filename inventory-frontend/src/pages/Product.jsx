import MainLayout from "../layout/MainLayout";
import { useState, useEffect } from "react";
import ProductModal from "../components/ProductModal";
import api from "../api/axios";
import { toast } from "react-toastify";

export default function Product() {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [products, setProducts] = useState([]);
    const [cursor, setCursor] = useState(null);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);

    console.log(cursor);

    const handleSave = async (product) => {
        try {
            const res = await api.post("/products", product);

            if (res.status === 201) {
                toast.success("Product added successfully!");
                setOpen(false);

                setProducts([]);
                setCursor(null);
                setOffset(0);
                fetchProducts(null);
            }
        } catch (err) {
            toast.error("Failed to add product");
            console.error(err);
        }
    };

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
            console.log(res.data);

            const newItems = res.data.data || [];
            setProducts((prev) =>
                cursorParam ? [...prev, ...newItems] : newItems
            );

            setOffset((prev) =>
                cursorParam ? prev + newItems.length : 0
            );

            setCursor(res.data.next_cursor || null);
        } catch (err) {
            toast.error("Failed to load products");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        const timer = setTimeout(() => {
            setProducts([]);
            setCursor(null);
            setOffset(0);
            fetchProducts(null);
        }, 400);

        return () => clearTimeout(timer);
    }, [search]);


    const handleEdit = (product) => {
        console.log("Edit:", product);
    };

    return (
        <MainLayout>
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-slate-800">
                        Products
                    </h1>

                    <button
                        onClick={() => setOpen(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Add Product
                    </button>

                    <ProductModal
                        open={open}
                        onClose={() => setOpen(false)}
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
                            {products.length === 0 && !loading && (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="px-4 py-6 text-center text-gray-500"
                                    >
                                        No products found
                                    </td>
                                </tr>
                            )}

                            {products.map((product, index) => (
                                <tr
                                    key={product.id}
                                    className="border-t hover:bg-slate-50"
                                >
                                    <td className="px-4 py-3">
                                        {offset + index + 1}
                                    </td>
                                    <td className="px-4 py-3">
                                        {product.name}
                                    </td>
                                    <td className="px-4 py-3">
                                        {product.cost_price}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        {product.unit_type}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        {product.selling_price}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        {product.stock_qty}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                        {/* Pagination */}
                        {cursor !== null && (
                            <tfoot>
                                <tr>
                                    <td colSpan="7" className="px-4 py-3 text-center">
                                        <button
                                            onClick={() => fetchProducts(cursor)}
                                            disabled={loading}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            {loading ? "Loading..." : "Load More"}
                                        </button>
                                        
                                    </td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            </div>
        </MainLayout>
    );
}
