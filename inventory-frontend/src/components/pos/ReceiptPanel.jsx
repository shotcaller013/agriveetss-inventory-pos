import React from "react";
import { Printer, PlusCircle, CheckCircle2, QrCode } from "lucide-react";

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
    <div className="flex flex-col h-full bg-slate-50 animate-in fade-in duration-300">
      {/* Scrollable Receipt Preview Area */}
      <div className="flex-1 overflow-y-auto flex justify-center p-4 custom-scrollbar">
        <div
          id="receipt-content"
          className="w-full max-w-[320px] bg-white p-6 font-mono text-slate-900 relative shadow-md rounded-sm h-fit border border-slate-200"
        >
          {/* Header Status (Screen only) */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-4 py-1 rounded-full flex items-center gap-1.5 shadow-md print:hidden transition-transform hover:scale-105">
            <CheckCircle2 size={14} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Paid Successfully
            </span>
          </div>

          {/* Store Branding */}
          <div className="text-center mb-6 pt-4">
            <h2 className="text-3xl font-serif font-black tracking-tighter text-slate-950">
              DANGSKIE
            </h2>
            <div className="h-[1px] w-20 bg-slate-300 mx-auto my-2" />
            <p className="text-[10px] uppercase text-slate-500 font-sans leading-relaxed">
              Pulpog, Sabang, Leyte <br />
              <span className="tracking-widest">TIN: 000-123-456-000</span>
            </p>
          </div>

          {/* Transaction Metadata */}
          <div className="text-[10px] border-y border-dashed border-slate-300 py-3 mb-4 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">REFERENCE:</span>
              <span className="font-bold text-slate-900">
                #{receipt.reference?.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">DATE/TIME:</span>
              <span className="uppercase">
                {new Date(receipt.created_at).toLocaleString("en-PH", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            </div>
          </div>

          {/* Items Header */}
          <div className="flex justify-between text-[9px] font-black text-slate-400 mb-3 border-b pb-1 uppercase tracking-wider">
            <span>Description / Qty</span>
            <span>Total</span>
          </div>

          {/* Items List */}
          <div className="space-y-3 mb-6">
            {receipt.items?.map((item) => (
              <div key={item.id} className="text-[11px] group">
                <div className="flex justify-between items-start gap-4">
                  <span className="font-bold uppercase text-slate-800 leading-tight">
                    {item.product?.name}
                  </span>
                  <span className="font-bold text-slate-900">
                    {formatCurrency(item.subtotal)}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {item.quantity} {item.product?.unit_type} @ {formatCurrency(item.unit_price)}
                </div>
              </div>
            ))}
          </div>

          {/* Financials */}
          <div className="space-y-2 border-t-2 border-slate-900 pt-4">
            <div className="flex justify-between text-[11px] text-slate-600">
              <span>SUBTOTAL</span>
              <span>{formatCurrency(receipt.total_price)}</span>
            </div>
            <div className="flex justify-between text-[11px] font-bold text-slate-700">
              <span>CASH TENDERED</span>
              <span>{formatCurrency(receipt.cash_received)}</span>
            </div>
            
            {/* Change Highlight - Softer for cashier eyes */}
            <div className="flex justify-between text-xl font-black mt-3 p-2 bg-slate-50 border-t border-dashed border-slate-300 print:bg-transparent print:p-0 print:border-none">
              <span className="text-slate-500 text-sm self-center">CHANGE</span>
              <span className="text-indigo-600 print:text-black">
                {formatCurrency(receipt.change_given)}
              </span>
            </div>
          </div>

          {/* QR & Footer */}
          <div className="mt-8 text-center">
            <div className="inline-block p-2 border border-slate-200 rounded-xl mb-4 bg-white shadow-sm print:border-black print:rounded-none">
              <QrCode size={48} strokeWidth={1} className="text-slate-900" />
            </div>
            <div className="text-[9px] text-slate-400 uppercase tracking-[0.2em] space-y-1">
              <p className="font-sans">*** Official Receipt ***</p>
              <p className="font-bold text-slate-600">Thank you for coming!</p>
            </div>
          </div>

          {/* Zig-Zag Edge (Decorative for UI) */}
          <div className="absolute -bottom-2 left-0 w-full h-2 flex print:hidden overflow-hidden opacity-50">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="flex-1 h-full bg-white rotate-45 border-r border-b border-slate-200"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 bg-white border-t border-slate-200 flex flex-col gap-3 shrink-0 print:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <button
          onClick={handlePrint}
          className="flex items-center justify-center gap-2 w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-[0.15em] hover:bg-slate-800 active:scale-[0.98] transition-all shadow-md"
        >
          <Printer size={18} /> Print Receipt
        </button>
        <button
          onClick={onDone}
          className="flex items-center justify-center gap-2 w-full py-3.5 bg-indigo-600 text-white rounded-xl font-bold text-xs uppercase tracking-[0.15em] hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-lg shadow-indigo-100"
        >
          <PlusCircle size={18} /> New Sale
        </button>
      </div>

      <style jsx global>{`
        @media print {
          @page {
            margin: 0;
            size: 80mm auto;
          }
          body {
            background: #fff;
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact;
          }
          body * {
            visibility: hidden;
          }
          #receipt-content,
          #receipt-content * {
            visibility: visible;
          }
          #receipt-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 80mm;
            padding: 4mm 6mm;
            box-shadow: none !important;
            border: none !important;
            font-family: 'Courier New', Courier, monospace !important;
          }
          /* Standardize fonts for thermal printers */
          .font-sans, .font-serif {
            font-family: 'Courier New', Courier, monospace !important;
          }
          .text-slate-500, .text-slate-400 {
            color: #000 !important;
            opacity: 0.8;
          }
          /* Force hide the zig-zag and shadows */
          .print\:hidden {
            display: none !important;
          }
          hr {
            border-top: 1px dashed #000 !important;
          }
        }
      `}</style>
    </div>
  );
}