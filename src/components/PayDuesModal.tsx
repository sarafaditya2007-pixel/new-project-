import React, { useState } from 'react';
import { X, CreditCard, CheckCircle2, DollarSign, Download, Receipt } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PayDuesModalProps {
  isOpen: boolean;
  onClose: () => void;
  unit: string;
  residentName: string;
  onPaymentSuccess: () => void;
}

export const PayDuesModal: React.FC<PayDuesModalProps> = ({
  isOpen,
  onClose,
  unit,
  residentName,
  onPaymentSuccess,
}) => {
  const [method, setMethod] = useState<'card' | 'upi' | 'netbanking'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  if (!isOpen) return null;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsPaid(true);
      try {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      } catch {
        // Safe fallback
      }
      onPaymentSuccess();
    }, 900);
  };

  const handleClose = () => {
    setIsPaid(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 border border-slate-200 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isPaid ? (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-200">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0f172a]">Pay Maintenance Dues</h3>
                <p className="text-xs text-slate-500">Maple Heights Society • Q3 Maintenance</p>
              </div>
            </div>

            {/* Bill Summary */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 mb-4 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Unit / Flat:</span>
                <span className="font-semibold text-slate-900">{unit}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Resident:</span>
                <span className="font-semibold text-slate-900">{residentName}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Quarter Period:</span>
                <span className="font-semibold text-slate-900">July – Sep 2026</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Lift & Sinking Fund:</span>
                <span className="font-semibold text-slate-900">$30.00</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
                <span>Total Amount Due:</span>
                <span className="text-emerald-700 text-base">$180.00</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <form onSubmit={handlePay} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setMethod('card')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                      method === 'card'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Credit / Debit
                  </button>
                  <button
                    type="button"
                    onClick={() => setMethod('upi')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                      method === 'upi'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    UPI / QR
                  </button>
                  <button
                    type="button"
                    onClick={() => setMethod('netbanking')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                      method === 'netbanking'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Net Banking
                  </button>
                </div>
              </div>

              <div className="p-3 bg-slate-100 rounded-xl text-xs text-slate-600 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-slate-500" />
                <span>Simulated secure society payment gateway</span>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md shadow-emerald-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <span>Authorize & Pay $180.00</span>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Receipt State */
          <div className="text-center py-4 space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">Payment Successful!</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Receipt #MH-2026-PAY-8821 generated for {unit}
              </p>
            </div>

            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-left text-xs text-emerald-950 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-emerald-800">Paid Amount:</span>
                <span className="font-bold">$180.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-800">Status:</span>
                <span className="font-bold text-emerald-600">CONFIRMED (Zero Dues)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-800">Next Due Date:</span>
                <span>Oct 1, 2026</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleClose}
                className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
