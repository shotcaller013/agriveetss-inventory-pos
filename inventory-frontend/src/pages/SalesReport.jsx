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
  Wallet, // Added for Collections
} from "lucide-react";
import api from "../api/axios";
import { useState, useEffect } from "react";

export default function SalesReport() {
  const today = new Date().toISOString().slice(0, 10);
  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(today);
  const [rows, setRows] = useState([]); // Now includes both sales and credit payments
  const [loading, setLoading] = useState(false);

  const [summary, setSummary] = useState({
    totalSalesVolume: 0, // Potential revenue (Direct + Credit sales)
    totalCollections: 0, // Actual cash from credit payments
    totalCashInflow: 0,   // Real money in hand (Direct Sales + Collections)
    transactions: 0,
    totalProfit: 0,
  });

  const exportToCSV = () => {
    if (!rows.length) return;

    const headers = [
      "Reference",
      "Category",
      "Date",
      "Time",
      "Amount_PHP"
    ];

    const csvRows = rows.map((row) => {
      const date = new Date(row.created_at);

      const dateOnly = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      });

      const timeOnly = date.toLocaleTimeString("en-PH", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      return [
        `"${row.sale_id}"`,
        `"${row.type}"`,
        `"${dateOnly}"`,
        `"${timeOnly}"`,
        Number(row.sale_total).toFixed(2),
      ];
    });

    const csvContent =
      "\uFEFF" +
      [headers.join(","), ...csvRows.map((r) => r.join(","))].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Financial_Report_${from}_to_${to}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await api.get("/reports/sales/daily", {
        params: { from, to },
      });

      console.log("Summary Data:", res);


      // CHANGE THIS LINE: 
      // Previously it was res.data.sales, now it must be res.data.activity
      setRows(res.data.activity || []);

      setSummary({
        totalSalesVolume: Number(res.data.summary?.total_sales_volume || 0),
        totalCollections: Number(res.data.summary?.total_collections || 0),
        totalCashInflow: Number(res.data.summary?.total_cash_inflow || 0),
        transactions: Number(res.data.summary?.transactions || 0),
        totalProfit: Number(res.data.summary?.total_profit || 0),
      });
    } catch (error) {
      setRows([]); // Clear rows on error to show empty state
      console.error("Failed to fetch report", error);
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    fetchReport();
  }, []);

  return (
    <MainLayout>
      <div className="space-y-8 animate-in fade-in duration-500 p-4">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg text-white">
                <BarChart3 size={24} />
              </div>
              Financial Overview
            </h1>
            <p className="text-slate-500 mt-1 font-medium">
              Analyze cash inflow from direct sales and credit collections.
            </p>
          </div>
          <button
            onClick={exportToCSV}
            disabled={rows.length === 0}
            className="flex items-center justify-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={18} />
            Export Data
          </button>
        </div>

        {/* FILTERS */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
              <Filter size={16} className="text-slate-400" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Timeframe</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="date" className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-semibold outline-none" value={from} onChange={(e) => setFrom(e.target.value)} />
              <span className="text-slate-400 font-bold">→</span>
              <input type="date" className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-semibold outline-none" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
          </div>
          <button onClick={fetchReport} disabled={loading} className="bg-blue-600 text-white px-8 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-blue-700 disabled:opacity-50 transition-all">
            {loading ? "Syncing..." : "Apply Filters"}
          </button>
        </div>

        {/* METRICS GRID - UPDATED FOR CASH FLOW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Cash Inflow"
            value={summary.totalCashInflow}
            isCurrency
            icon={<Wallet className="text-emerald-600" />}
            color="emerald"
            description="Actual money collected"
          />
          <MetricCard
            title="Sales Volume"
            value={summary.totalSalesVolume}
            isCurrency
            icon={<DollarSign className="text-blue-600" />}
            color="blue"
            description="Direct + Credit Sales"
          />
          <MetricCard
            title="Debt Recovery"
            value={summary.totalCollections}
            isCurrency
            icon={<TrendingUp className="text-purple-600" />}
            color="purple"
            description="Payments on old debts"
          />
          <MetricCard
            title="Net Profit"
            value={summary.totalProfit}
            isCurrency
            icon={<ArrowUpRight className="text-orange-500" />}
            color="orange"
            description="Based on items sold"
          />
        </div>

        {/* TRANSACTION TABLE */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800"> Activity Log</h3>
            <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-3 py-1 rounded-full uppercase">
              Sales & Collections
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50/50 text-slate-500 uppercase text-[11px] font-bold tracking-widest">
                <tr>
                  <th className="px-8 py-4 text-left">Ref ID / Type</th>
                  <th className="px-8 py-4 text-left">Date & Time</th>
                  <th className="px-8 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.length === 0 ? (
                  <tr><td colSpan="3" className="text-center py-20 opacity-40">No activity recorded</td></tr>
                ) : (
                  rows.map((row, idx) => {
                    const isCollection = row.type.includes("Collection");
                    return (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-8 py-5">
                          <div className="flex flex-col">
                            <span className="font-mono font-bold text-slate-900">#{row.sale_id}</span>
                            <span className={`text-[10px] font-bold uppercase tracking-tight ${isCollection ? 'text-emerald-600' : 'text-blue-500'}`}>
                              {row.type}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-slate-500 font-medium">
                          {new Date(row.created_at).toLocaleString("en-PH", {
                            month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                          })}
                        </td>
                        <td className="px-8 py-5 text-right">
                          <span className={`font-black text-base ${isCollection ? 'text-emerald-700' : 'text-slate-900'}`}>
                            ₱{Number(row.sale_total).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

function MetricCard({ title, value, isCurrency, icon, color, description }) {
  const colorMap = {
    blue: "border-blue-500 text-blue-600 bg-blue-50",
    purple: "border-purple-500 text-purple-600 bg-purple-50",
    emerald: "border-emerald-500 text-emerald-600 bg-emerald-50",
    orange: "border-orange-500 text-orange-500 bg-orange-50",
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
          <h2 className="text-2xl font-black text-slate-900">
            {isCurrency ? "₱" : ""}{value.toLocaleString(undefined, { minimumFractionDigits: isCurrency ? 2 : 0 })}
          </h2>
          <p className="text-[10px] text-slate-400 mt-1 font-bold italic">{description}</p>
        </div>
        <div className={`p-3 rounded-xl ${colorMap[color]} bg-opacity-10`}>{icon}</div>
      </div>
    </div>
  );
}