import MainLayout from "../layout/MainLayout";
import {
  BarChart3,
  Calendar,
  ReceiptText,
  Package,
  Download,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  Filter,
} from "lucide-react";
import api from "../api/axios";
import { useState, useEffect } from "react";

export default function SalesReport() {
  const today = new Date().toISOString().slice(0, 10);
  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(today);
  const [rows, setRows] = useState([]);
  console.log(rows);
  const [loading, setLoading] = useState(false);

  const [summary, setSummary] = useState({
    totalSales: 0,
    transactions: 0,
    totalQty: 0,
    totalProfit: 0,
  });

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await api.get("/reports/sales/daily", {
        params: { from, to },
      });
      setRows(res.data.sales || []);
      setSummary({
        totalSales: Number(res.data.summary?.total_sales || 0),
        transactions: Number(res.data.summary?.transactions || 0),
        totalQty: Number(res.data.summary?.total_qty || 0),
        totalProfit: Number(res.data.summary?.total_profit || 0),
      });
    } catch (error) {
      console.error("Failed to fetch report", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  return (
    <MainLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* TOP BAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg text-white">
                <BarChart3 size={24} />
              </div>
              Financial Overview
            </h1>
            <p className="text-slate-500 mt-1 font-medium">
              Analyze your revenue and profit margins for the selected period.
            </p>
          </div>

          <button className="flex items-center justify-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95">
            <Download size={18} />
            Export Data
          </button>
        </div>

        {/* CONTROLS & FILTERS */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
              <Filter size={16} className="text-slate-400" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Timeframe
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="date"
                className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer hover:border-blue-300"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
              <span className="text-slate-400 font-bold">→</span>
              <input
                type="date"
                className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer hover:border-blue-300"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={fetchReport}
            disabled={loading}
            className="bg-blue-600 text-white px-8 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md shadow-blue-200"
          >
            {loading ? "Syncing..." : "Apply Filters"}
          </button>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Revenue"
            value={summary.totalSales}
            isCurrency
            icon={<DollarSign className="text-blue-600" />}
            color="blue"
          />
          <MetricCard
            title="Net Profit"
            value={summary.totalProfit}
            isCurrency
            icon={<TrendingUp className="text-purple-600" />}
            color="purple"
          />
          <MetricCard
            title="Transactions"
            value={summary.transactions}
            icon={<ReceiptText className="text-emerald-600" />}
            color="emerald"
          />
          <MetricCard
            title="Items Sold"
            value={summary.totalQty}
            icon={<Package className="text-orange-500" />}
            color="orange"
          />
        </div>

        {/* DATA TABLE */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800">Transaction History</h3>
            <span className="text-xs font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-full">
              {rows.length} Records Found
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50/50 text-slate-500 uppercase text-[11px] font-bold tracking-widest">
                <tr>
                  <th className="px-8 py-4 text-left">Reference ID</th>
                  <th className="px-8 py-4 text-left">Date & Time</th>
                  <th className="px-8 py-4 text-right">Settlement Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-24">
                      <div className="flex flex-col items-center opacity-40">
                        <ReceiptText size={48} className="mb-2" />
                        <p className="font-bold">No transactions recorded</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr
                      key={row.sale_id}
                      className="hover:bg-blue-50/30 transition-colors group"
                    >
                      <td className="px-8 py-5">
                        <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          #{row.sale_id}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-slate-600 font-medium">
                        {new Date(row.created_at).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="font-black text-slate-900 text-base">
                            ₱
                            {Number(row.sale_total).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                          <ArrowUpRight
                            size={14}
                            className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

// Sub-component for clean metric cards
function MetricCard({ title, value, isCurrency, icon, color }) {
  const colorMap = {
    blue: "border-blue-500 text-blue-600 bg-blue-50",
    purple: "border-purple-500 text-purple-600 bg-purple-50",
    emerald: "border-emerald-500 text-emerald-600 bg-emerald-50",
    orange: "border-orange-500 text-orange-500 bg-orange-50",
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      <div
        className={`absolute -right-2 -top-2 w-16 h-16 rounded-full opacity-10 transition-transform group-hover:scale-150 ${colorMap[color]}`}
      />
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
            {title}
          </p>
          <h2 className="text-2xl font-extrabold text-slate-900">
            {isCurrency ? "₱" : ""}
            {value.toLocaleString(undefined, {
              minimumFractionDigits: isCurrency ? 2 : 0,
            })}
          </h2>
        </div>
        <div className={`p-3 rounded-xl ${colorMap[color]} bg-opacity-10`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
