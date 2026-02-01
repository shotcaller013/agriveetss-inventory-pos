import api from "../api/axios";
import { useState, useEffect } from "react";
import MainLayout from "../layout/MainLayout";

export default function CreditsTracker() {
    const [credits, setCredits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedCredit, setSelectedCredit] = useState(null);

    const [paidAmount, setPaidAmount] = useState(0);

    const openModal = (credit) => setSelectedCredit(credit);
    const closeModal = () => setSelectedCredit(null);

    const fetchCredits = async () => {
        setLoading(true);
        try {
            const res = await api.get("/credits");
            console.log("Credits Data:", res.data);
            setCredits(res.data.credits || []);
        } catch (err) {
            console.error(err);
            setCredits([]);
        } finally {
            setLoading(false);
        }
    };

    console.log(credits);

    useEffect(() => {
        fetchCredits();
    }, []);

    return (
        <MainLayout>
            <div className="p-8 bg-slate-50 min-h-screen">
                {/* Dashboard Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Credits Tracker</h1>
                        <p className="text-slate-500 mt-1">Manage customer balances and transaction history.</p>
                    </div>
                    {/* <button className="inline-flex items-center justify-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm shadow-indigo-200">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        New Credit Record
                    </button> */}
                </div>

                {/* Main Table Container */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-200">
                                    <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">ID</th>
                                    <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Customer Name</th>
                                    <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Details</th>
                                    <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Contact Number</th>
                                    <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Amount Due</th>
                                    <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Due Date</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    [...Array(5)].map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan="5" className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-full"></div></td>
                                        </tr>
                                    ))
                                ) : credits.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="p-3 bg-slate-50 rounded-full mb-3 text-slate-300">
                                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                                                </div>
                                                <p className="text-slate-500 font-medium">No credit records found</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    credits.map((credit, index) => (
                                        <tr key={credit.id} className="group hover:bg-slate-50/80 transition-colors">
                                            <td className="px-6 py-4 font-mono text-xs text-slate-400">{index + 1}</td>
                                            <td className="px-6 py-4 font-bold text-slate-800">{credit.customer_name}</td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => openModal(credit)}
                                                    className="inline-flex items-center px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold hover:bg-indigo-100 transition-colors border border-indigo-100"
                                                >
                                                    <svg className="w-3.5 h-3.5 mr-1.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                    {credit.items?.length || 0} Items
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500">
                                                {credit.contact_number || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 font-black text-slate-900">
                                                ₱{(credit.total_amount)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                                    {credit.due_date}
                                                </span>
                                            </td>

                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Enhanced Modal */}
            {selectedCredit && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeModal} />

                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800 text-lg">Process Payment</h3>
                            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 text-2xl">&times;</button>
                        </div>

                        <div className="p-6">
                            {/* Product Summary (Condensed) */}
                            <div className="mb-6">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Order Items</p>
                                <div className="max-h-32 overflow-y-auto space-y-2 ml-2 pr-2">
                                    {selectedCredit.items?.map((item, i) => (
                                        <div key={i} className="flex justify-between text-sm">
                                            <span className="text-slate-600">{item.product_name} <span className="text-xs text-slate-400">x {item.quantity}</span></span>
                                            <span className="font-medium text-slate-800">₱{(item.subtotal)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Payment Input Section */}
                            <div className="space-y-4 bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100">
                                <div>
                                    <label className="block text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2">
                                        Enter Paid Amount
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 font-bold">₱</span>
                                        <input
                                            type="number"
                                            className="w-full pl-8 pr-4 py-3 bg-white border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-lg font-bold text-slate-800 transition-all"
                                            placeholder="0.00"
                                            onChange={(e) => setPaidAmount(Number(e.target.value))}
                                        />
                                    </div>
                                </div>

                                {/* Dynamic Calculation */}
                                <div className="flex justify-between items-center pt-2 border-t border-indigo-100">
                                    <span className="text-sm text-indigo-700 font-medium">Remaining Balance:</span>
                                    <span className={`text-lg font-black ${selectedCredit.total_amount - paidAmount <= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        ₱{(selectedCredit.total_amount - paidAmount).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Footer Action */}
                        <div className="p-6 bg-slate-50 flex gap-3">
                            <button
                                onClick={closeModal}
                                className="flex-1 px-4 py-3 text-sm font-bold text-slate-500 hover:bg-slate-200 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                className="flex-1 px-4 py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95"
                                onClick={() => {
                                    alert(`Processing payment of ₱${paidAmount} for ${selectedCredit.customer_name}`);
                                    // Add your API call here: api.post(`/credits/${selectedCredit.id}/pay`, { amount: paidAmount })
                                }}
                            >
                                Update Credit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}