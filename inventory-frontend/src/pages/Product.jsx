import MainLayout from "../layout/MainLayout";
import { useState, useEffect } from "react";
import ProductModal from "../components/ProductModal";
import ConfirmDialog from "../components/ConfirmDialog";
import api from "../api/axios";
import { toast } from "react-toastify";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Package,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";

export default function Product({ theme, setTheme }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  console.log('products test',products );
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
      const config = {
        headers: { "Content-Type": "multipart/form-data" },
      };

      if (editProduct) {
        const res = await api.post(
          `/products/${editProduct.id}?_method=PUT`,
          data,
          config
        );

        setProducts((prev) =>
          prev.map((p) => (p.id === editProduct.id ? res.data.product : p))
        );

        toast.success("Product updated");
      } else {
        const res = await api.post("/products", data, config);

        setProducts((prev) => [res.data.product, ...prev]);

        toast.success("Product added successfully");
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
      setProducts((prev) => prev.filter((p) => p.id !== deleteId));
      toast.success("Product removed from inventory");
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setConfirmOpen(false);
      setDeleteId(null);
    }
  };

  return (
    <MainLayout theme={theme} setTheme={setTheme}>
      <div className="space-y-6 animate-in fade-in duration-500 p-4">
        {/* 1. TOP HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-3xl font-extrabold text-slate-900 dark:text-slate-200 tracking-tight flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-200">
                <Package size={24} />
              </div>
              Inventory Management
            </h3>
            <p className="text-slate-500 dark:text-slate-400  mt-1 font-medium">
              Manage your products, pricing, and stock levels.
            </p>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
          >
            <Plus size={20} />
            Add New Product
          </button>
        </div>

        {/* 2. TOOLBAR (Search & Quick Stats) */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col md:flex-row items-center gap-4">

          <div className="relative w-full md:w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
              size={18}
            />

            <input
              type="text"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-700 outline-none transition-all"
              placeholder="Search by name, ID or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 ml-auto">
            <Filter size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">
              Sort: Newest First
            </span>
          </div>

        </div>

        {/* 3. PRODUCT TABLE */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-slate-900 dark:text-slate-100">

              {/* HEADER */}
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 uppercase text-[11px] font-bold tracking-widest border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4 text-left">SKU/ID</th>
                  <th className="px-6 py-4 text-left">Product Name</th>
                  <th className="px-6 py-4 text-right">Cost</th>
                  <th className="px-6 py-4 text-center">Unit</th>
                  <th className="px-6 py-4 text-right text-blue-600 dark:text-blue-400">
                    Selling Price
                  </th>
                  <th className="px-6 py-4 text-right">Stock Level</th>
                  <th className="px-6 py-4 text-right">Image</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              {/* BODY */}
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">

                {loading && products.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-20 text-center text-slate-400 dark:text-slate-500 font-medium">
                      Syncing inventory...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center opacity-40">
                        <Package size={48} className="mb-2" />
                        <p className="font-bold">No products found in your database.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  products.map((product, index) => (
                    <tr
                      key={product.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800 transition-colors group"
                    >
                      {/* ID */}
                      <td className="px-6 py-4 text-slate-400 dark:text-slate-500 font-mono text-xs">
                        #{index + 1}
                      </td>

                      {/* NAME */}
                      <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">
                        {product.name}
                      </td>

                      {/* COST */}
                      <td className="px-6 py-4 text-right text-slate-500 dark:text-slate-400 font-medium">
                        ₱{Number(product.cost_price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>

                      {/* UNIT */}
                      <td className="px-6 py-4 text-center">
                        <span className="px-2.5 py-1 text-[10px] font-black bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md uppercase tracking-tighter">
                          {product.unit_type}
                        </span>
                      </td>

                      {/* SELLING PRICE */}
                      <td className="px-6 py-4 text-right font-black text-slate-900 dark:text-white text-base">
                        ₱{Number(product.selling_price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>

                      {/* STOCK */}
                      <td className="px-6 py-4 text-right">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold
                  ${product.stock_qty <= 5
                              ? "bg-red-50 text-red-600 border border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30"
                              : "bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30"
                            }`}
                        >
                          {product.stock_qty <= 5 && <AlertCircle size={12} />}
                          {product.stock_qty} {product.unit_type}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <img
                          src={`http://localhost:8000/storage/${product.image}`}
                          className="w-12 h-12 rounded object-cover mx-auto"
                        />
                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">

                          <button
                            onClick={() => {
                              setEditProduct(product);
                              setOpen(true);
                            }}
                            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="Edit Product"
                          >
                            <Pencil size={18} />
                          </button>

                          <button
                            onClick={() => {
                              setDeleteId(product.id);
                              setConfirmOpen(true);
                            }}
                            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 size={18} />
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))
                )}

              </tbody>
            </table>
          </div>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 mt-4">

          <button
            disabled={!prevCursor || loading}
            onClick={() => fetchProducts(prevCursor)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-30 transition-all shadow-sm"
          >
            <ChevronLeft size={18} />
            Previous
          </button>

          <div className="hidden md:block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Showing {products.length} Products
          </div>

          <button
            disabled={!nextCursor || loading}
            onClick={() => fetchProducts(nextCursor)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-slate-900 dark:bg-slate-700 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-600 disabled:opacity-30 transition-all shadow-md shadow-slate-200 dark:shadow-none"
          >
            Next Page
            <ChevronRight size={18} />
          </button>

        </div>
      </div>

      <ProductModal
        open={open}
        product={editProduct}
        onClose={() => {
          setOpen(false);
          setEditProduct(null);
        }}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Confirm Deletion"
        message="Are you sure you want to delete this product? This action cannot be undone and will affect your reports."
        onCancel={() => {
          setConfirmOpen(false);
          setDeleteId(null);
        }}
        onConfirm={confirmDelete}
      />
    </MainLayout>
  );
}
