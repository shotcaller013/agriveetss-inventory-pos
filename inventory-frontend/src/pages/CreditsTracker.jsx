import api from "../api/axios";
import { useState, useEffect } from "react";
import MainLayout from "../layout/MainLayout";
import { toast } from "react-toastify";
import {
    ReceiptText,
    History,
    Wallet,
    ChevronRight,
    User,
    CircleDollarSign,
    Search,
    X
} from "lucide-react";

export default function CreditsTracker() {
    const [credits, setCredits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const [detailsModal, setDetailsModal] = useState(null);
    const [historyModal, setHistoryModal] = useState(null);
    const [paymentModal, setPaymentModal] = useState(null);

    const [paidAmount, setPaidAmount] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState("cash");

    const fetchCredits = async () => {
        setLoading(true);
        try {
            const res = await api.get("/credits");
            setCredits(res.data.credits || []);
        } catch {
            setCredits([]);
            toast.error("Failed to load records");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCredits();
    }, []);

    const filteredCredits = credits.filter(c =>
        c.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handlePayment = async () => {
        if (!paymentModal || paidAmount <= 0) return;
        if (paidAmount > paymentModal.remaining_balance) {
            toast.error("Payment exceeds remaining balance");
            return;
        }

        try {
            await api.post(`/credits/${paymentModal.id}/pay`, {
                amount_paid: paidAmount,
                payment_method: paymentMethod,
            });
            toast.success("Payment recorded successfully");
            fetchCredits();
        } catch {
            toast.error("Payment failed");
        } finally {
            setPaymentModal(null);
            setPaidAmount(0);
        }
    };

    return (
        <MainLayout>
            <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
                {/* Header Section */}
                <div className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                            <CircleDollarSign className="text-indigo-600" />
                            Credits Tracker
                        </h1>
                        <p className="text-slate-500 text-sm">Manage customer balances and payment histories</p>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search customer..."
                            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-64 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table Card */}
                <div className="max-w-6xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                                    <th className="px-6 py-4 text-left font-semibold">Customer</th>
                                    <th className="px-6 py-4 text-left font-semibold">Total Debt</th>
                                    <th className="px-6 py-4 text-left font-semibold">Remaining</th>
                                    <th className="px-6 py-4 text-center font-semibold">Contact Number</th>
                                    <th className="px-6 py-4 text-center font-semibold">Actions</th>
                                    <th className="px-6 py-4 text-right font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr><td colSpan="5" className="py-12 text-center text-slate-400">Loading records...</td></tr>
                                ) : filteredCredits.length === 0 ? (
                                    <tr><td colSpan="5" className="py-12 text-center text-slate-400">No records found.</td></tr>
                                ) : (
                                    filteredCredits.map((credit) => (
                                        <tr key={credit.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                                                        {credit.customer_name.charAt(0)}
                                                    </div>
                                                    <span className="font-semibold text-slate-700">{credit.customer_name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                ₱{Math.max(0, credit.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className="font-bold text-slate-900 text-base">
                                                    ₱{Math.max(0, credit.remaining_balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {credit.contact_number || <span className="text-slate-400 italic">N/A</span>}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => setDetailsModal(credit)}
                                                        className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-lg transition-colors group"
                                                        title="View Items"
                                                    >
                                                        <ReceiptText size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => setHistoryModal(credit)}
                                                        className="p-2 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors"
                                                        title="Payment History"
                                                    >
                                                        <History size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <StatusBadge
                                                    status={credit.status}
                                                    onClick={credit.status !== 'paid' ? () => setPaymentModal(credit) : null}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {detailsModal && (
                <Modal title="Items Owed" icon={<ReceiptText className="text-indigo-600" />} onClose={() => setDetailsModal(null)}>
                    <div className="space-y-3">
                        {detailsModal.items.map((item, i) => (
                            <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <div>
                                    <p className="font-semibold text-slate-800">{item.product_name}</p>
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <span>{item.quantity} units</span>
                                        <span>•</span>
                                        <span>₱{Number(item.unit_price).toLocaleString(undefined, { minimumFractionDigits: 2 })} each</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold uppercase text-slate-400 leading-none mb-1">Subtotal</p>
                                    <span className="font-bold text-slate-900">
                                        ₱{Number(item.subtotal).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Modal>
            )}

            {historyModal && (
                <Modal title="Payment History" icon={<History className="text-amber-600" />} onClose={() => setHistoryModal(null)}>
                    <div className="space-y-2">
                        {historyModal.payments?.length ? (
                            historyModal.payments.map((p, i) => (
                                <div key={i} className="flex justify-between items-center p-3 border-l-4 border-emerald-400 bg-white shadow-sm rounded-r-lg">
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">₱{p.amount_paid}</p>
                                        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                                            {new Date(p.paid_at).toLocaleString()}
                                        </p>
                                    </div>

                                    <span className="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-500 font-bold uppercase">{p.payment_method || 'cash'}</span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-sm text-slate-400 italic">No payments recorded yet</p>
                            </div>
                        )}
                    </div>
                </Modal>
            )}

            {paymentModal && (
                <Modal title="Process Payment" icon={<Wallet className="text-emerald-600" />} onClose={() => setPaymentModal(null)}>
                    <div className="space-y-4">
                        <div className="p-4 bg-emerald-50 rounded-xl mb-4 text-center">
                            <p className="text-xs text-emerald-700 font-bold uppercase tracking-widest">Balance Due</p>
                            <p className="text-3xl font-black text-emerald-800">₱{paymentModal.remaining_balance}</p>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Payment Amount</label>
                            <input
                                type="number"
                                className="w-full border-2 border-slate-100 p-3 rounded-xl focus:border-indigo-500 outline-none font-bold text-lg transition-all"
                                placeholder="0.00"
                                autoFocus
                                onChange={(e) => setPaidAmount(Number(e.target.value))}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Method</label>
                            <div className="grid grid-cols-2 gap-2">
                                {['cash', 'gcash'].map((m) => (
                                    <button
                                        key={m}
                                        onClick={() => setPaymentMethod(m)}
                                        className={`py-3 rounded-xl border-2 font-bold capitalize transition-all ${paymentMethod === m
                                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                            : 'border-slate-100 text-slate-400 hover:bg-slate-50'
                                            }`}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handlePayment}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] mt-4"
                        >
                            Confirm Payment
                        </button>
                    </div>
                </Modal>
            )}
        </MainLayout>
    );
}

/* HELPER COMPONENTS */

function StatusBadge({ status, onClick }) {
    const styles = {
        open: "bg-slate-100 text-slate-600 hover:bg-slate-200",
        partial: "bg-amber-100 text-amber-700 hover:bg-amber-200",
        paid: "bg-emerald-100 text-emerald-700 cursor-default"
    };

    return (
        <button
            disabled={status === 'paid'}
            onClick={onClick}
            className={`px-3 py-1.5 text-[11px] font-black rounded-full uppercase tracking-tighter transition-all flex items-center gap-1 ml-auto ${styles[status]}`}
        >
            <span className={`w-1.5 h-1.5 rounded-full ${status === 'paid' ? 'bg-emerald-500' : status === 'partial' ? 'bg-amber-500' : 'bg-slate-400'
                }`} />
            {status}
            {status !== 'paid' && <ChevronRight size={12} />}
        </button>
    );
}

function Modal({ title, icon, children, onClose }) {
    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
                        <h3 className="font-bold text-slate-800 text-lg">{title}</h3>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}