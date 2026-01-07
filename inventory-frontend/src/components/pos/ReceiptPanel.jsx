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
          className="w-full max-w-[300px] bg-white p-6 font-mono text-slate-900 relative shadow-md rounded-sm h-fit border border-slate-200"
        >
          {/* Header Status (Screen only) */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-full flex items-center gap-1 shadow-sm print:hidden">
            <CheckCircle2 size={12} />
            <span className="text-[10px] font-black uppercase tracking-tighter">
              Success
            </span>
          </div>

          {/* Store Branding */}
          <div className="text-center mb-6 pt-2">
            <h2 className="text-2xl font-black tracking-tighter text-slate-950">
              DANGSKIE
            </h2>
            <div className="h-0.5 w-16 bg-slate-900 mx-auto my-1" />
            <p className="text-[10px] uppercase text-slate-500 leading-tight">
              Pulpog, Sabang, Leyte <br />
              TIN: 000-123-456-000
            </p>
          </div>

          {/* Transaction Metadata */}
          <div className="text-[10px] border-y border-dashed border-slate-300 py-3 mb-4 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">REF:</span>
              <span className="font-bold">
                {receipt.reference?.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">DATE:</span>
              <span>
                {new Date(receipt.created_at).toLocaleString("en-PH", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            </div>
          </div>

          {/* Items Header */}
          <div className="flex justify-between text-[9px] font-black text-slate-400 mb-2 border-b pb-1">
            <span>DESCRIPTION / QTY</span>
            <span>TOTAL</span>
          </div>

          {/* Items List */}
          <div className="space-y-4 mb-6">
            {receipt.items?.map((item) => (
              <div key={item.id} className="text-[11px]">
                <div className="flex justify-between items-start gap-4">
                  <span className="font-bold uppercase leading-tight">
                    {item.product?.name}
                  </span>
                  <span className="font-bold">
                    {formatCurrency(item.subtotal)}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500">
                  {item.quantity} {item.product?.unit_type} ×{" "}
                  {formatCurrency(item.unit_price)}
                </div>
              </div>
            ))}
          </div>

          {/* Financials */}
          <div className="space-y-1 border-t-2 border-slate-900 pt-3">
            <div className="flex justify-between text-xs">
              <span>SUBTOTAL</span>
              <span>{formatCurrency(receipt.total_price)}</span>
            </div>
            <div className="flex justify-between text-xs font-bold">
              <span>CASH TENDERED</span>
              <span>{formatCurrency(receipt.cash_received)}</span>
            </div>
            <div className="flex justify-between text-lg font-black mt-2 pt-2 border-t border-dashed border-slate-300">
              <span>CHANGE</span>
              <span>{formatCurrency(receipt.change_given)}</span>
            </div>
          </div>

          {/* QR & Footer */}
          <div className="mt-8 text-center">
            <div className="inline-block p-1 border-2 border-slate-900 rounded-lg mb-3">
              <QrCode size={40} strokeWidth={1.5} />
            </div>
            <div className="text-[9px] text-slate-500 uppercase tracking-widest space-y-1">
              <p>Official Receipt</p>
              <p className="font-bold">Thanks for shopping!</p>
            </div>
          </div>

          {/* Zig-Zag Edge */}
          <div className="absolute -bottom-2 left-0 w-full h-2 flex print:hidden overflow-hidden">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="flex-1 h-full bg-white rotate-45 border-r border-b border-slate-200"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons (Fixed at bottom) */}
      <div className="p-4 bg-white border-t border-slate-200 flex flex-col gap-2 shrink-0 print:hidden">
        <button
          onClick={handlePrint}
          className="flex items-center justify-center gap-2 w-full py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all"
        >
          <Printer size={16} /> Print Receipt
        </button>
        <button
          onClick={onDone}
          className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
        >
          <PlusCircle size={16} /> New Transaction
        </button>
      </div>

      <style jsx global>{`
        @media print {
          @page {
            margin: 0;
            size: 80mm auto;
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
            width: 100%;
            max-width: 80mm;
            box-shadow: none;
            border: none;
            padding: 5mm;
          }
        }
      `}</style>
    </div>
  );
}
