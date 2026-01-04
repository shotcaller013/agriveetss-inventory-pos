import React from "react";

const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
    }).format(amount || 0);

export default function ReceiptPanel({ receipt, onDone }) {
    if (!receipt) return null;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex flex-col h-full bg-slate-200/50 backdrop-blur-sm animate-in fade-in duration-300">
            {/* Main Receipt Container */}
            <div className="flex-1 overflow-y-auto flex justify-center p-6">
                <div
                    id="receipt-content"
                    className="w-full max-w-[320px] bg-white p-6 font-mono text-slate-900 relative shadow-2xl rounded-sm h-fit"
                >
                    {/* Visual Thermal Edge Effect */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-blue-600 print:hidden" />

                    {/* Store Branding */}
                    <div className="text-center mb-6">
                        <div className="flex flex-col items-center">
                            <h2 className="text-2xl font-black tracking-tighter text-slate-950">
                                DANGSKIE
                            </h2>
                            <div className="h-1 w-12 bg-slate-900 my-1" />
                        </div>
                        <p className="text-[10px] uppercase text-slate-500 leading-tight">
                            Pulpog, Sabang, Leyte <br />
                            TIN: 000-123-456-000
                        </p>
                    </div>

                    {/* Transaction Details */}
                    <div className="text-[11px] border-y border-dashed border-slate-300 py-3 mb-4 space-y-1">
                        <div className="flex justify-between">
                            <span className="text-slate-500">REF:</span>
                            <span className="font-bold">{receipt.reference?.toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">DATE:</span>
                            <span>{new Date(receipt.created_at).toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">CASHIER:</span>
                            <span>SYSTEM_ADMIN</span>
                        </div>
                    </div>

                    {/* Items Table Header */}
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-2 px-1">
                        <span>ITEM DESCRIPTION</span>
                        <span>TOTAL</span>
                    </div>

                    {/* Items List */}
                    <div className="space-y-4 mb-6">
                        {receipt.items?.map((item) => (
                            <div key={item.id} className="text-xs">
                                <div className="flex justify-between leading-none mb-1">
                                    <span className="font-bold uppercase max-w-[70%] leading-tight">
                                        {item.product?.name}
                                    </span>
                                    <span className="font-bold font-mono">
                                        {formatCurrency(item.subtotal)}
                                    </span>
                                </div>
                                <div className="text-[10px] text-slate-500 italic">
                                    {item.quantity} {item.product?.unit_type} @ {formatCurrency(item.unit_price || (item.subtotal / item.quantity))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Financial Summary */}
                    <div className="space-y-1.5 border-t border-slate-900 pt-3">
                        <div className="flex justify-between text-sm">
                            <span>SUBTOTAL</span>
                            <span>{formatCurrency(receipt.total_price)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>CASH</span>
                            <span className="underline">{formatCurrency(receipt.cash_received)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-black mt-2 pt-2 border-t border-dashed border-slate-300">
                            <span>CHANGE</span>
                            <span className="font-mono">{formatCurrency(receipt.change_given)}</span>
                        </div>
                    </div>

                    {/* Footer / QR Section */}
                    <div className="mt-10 text-center">
                        <div className="inline-block p-2 border-2 border-slate-100 rounded-lg mb-3">
                            {/* Placeholder for QR Code */}
                            <div className="w-20 h-20 bg-slate-50 flex items-center justify-center text-[8px] text-slate-300 border border-dashed border-slate-200">
                                QR VERIFY
                            </div>
                        </div>
                        <div className="text-[9px] text-slate-400 uppercase tracking-widest leading-relaxed">
                            <p>Thank you for your patronage</p>
                            <p className="font-bold">This serves as your OFFICIAL RECEIPT</p>
                        </div>
                    </div>
                    
                    {/* Thermal Zig-Zag Bottom (CSS Only) */}
                    <div className="absolute -bottom-2 left-0 w-full h-2 flex print:hidden">
                        {[...Array(20)].map((_, i) => (
                            <div key={i} className="flex-1 h-full bg-white" style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Actions Bar */}
            <div className="p-4 bg-white/80 backdrop-blur-md border-t border-slate-200 flex gap-3 justify-center print:hidden">
                <button
                    onClick={handlePrint}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all active:scale-95"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                    Print
                </button>
                <button
                    onClick={onDone}
                    className="flex items-center justify-center gap-2 px-10 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    Next Sale
                </button>
            </div>

            <style jsx global>{`
                @media print {
                    @page { margin: 0; size: 80mm auto; }
                    body { background: white; }
                    .print\\:hidden { display: none !important; }
                    #receipt-content {
                        position: static;
                        width: 100%;
                        max-width: none;
                        box-shadow: none;
                        padding: 10mm;
                    }
                }
            `}</style>
        </div>
    );
}