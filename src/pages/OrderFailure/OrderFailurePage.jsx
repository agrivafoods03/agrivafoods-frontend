import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { AlertCircle, RefreshCw, ShoppingBag, ArrowLeft, Phone, ShieldCheck } from 'lucide-react';

export const OrderFailurePage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const errorMessage = location.state?.error || 'Payment transaction was declined or interrupted.';
  const orderNumber = location.state?.orderNumber || null;

  return (
    <div className="max-w-2xl mx-auto px-3.5 sm:px-6 py-8 sm:py-20">
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-10 border border-sage-light shadow-xl text-center">
        {/* Warning / Error Icon */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-50 border border-red-200 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xs">
          <AlertCircle className="w-8 h-8 sm:w-9 sm:h-9 stroke-[2]" />
        </div>

        <span className="inline-block px-3 py-1 bg-red-100 text-red-800 text-[11px] sm:text-xs font-bold rounded-full uppercase tracking-wider mb-2">
          Payment Incomplete
        </span>

        <h1 className="text-xl sm:text-3xl font-black text-primary-dark">
          Payment Could Not Be Verified
        </h1>
        <p className="text-xs sm:text-sm text-muted mt-2 max-w-md mx-auto leading-relaxed">
          We were unable to complete your payment transaction. If any amount was deducted by your bank, it will be automatically refunded within 3-5 business days.
        </p>

        {/* Error Details Card */}
        <div className="mt-6 sm:mt-8 p-3.5 sm:p-5 bg-[#FBF7F3] rounded-2xl border border-sage-light text-left space-y-3">
          {orderNumber && (
            <div className="flex justify-between items-center pb-2.5 border-b border-sage-light text-xs">
              <span className="text-muted font-medium">Order Reference:</span>
              <span className="font-mono font-bold text-primary-dark">{orderNumber}</span>
            </div>
          )}
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted font-medium">Failure Reason:</span>
            <span className="font-semibold text-red-700 text-right max-w-[240px] truncate">{errorMessage}</span>
          </div>
          <div className="flex justify-between items-center text-xs pt-2.5 border-t border-sage-light">
            <span className="text-muted font-medium">Payment Gateway:</span>
            <span className="font-semibold text-foreground">Razorpay Secure Standard Checkout</span>
          </div>
        </div>

        {/* What to do next */}
        <div className="mt-6 text-left p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 text-xs text-gray-700 space-y-1">
          <p className="font-bold text-primary-dark">Tips to resolve payment issues:</p>
          <ul className="list-disc pl-4 space-y-1 text-muted text-[11px]">
            <li>Check your UPI App or NetBanking connection and try again.</li>
            <li>Ensure sufficient balance or credit limit on your chosen card.</li>
            <li>Alternatively, choose Cash on Delivery (COD) to place your order without online payment.</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/checkout"
            className="w-full sm:w-auto px-6 py-3 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Checkout</span>
          </Link>
          <Link
            to="/cart"
            className="w-full sm:w-auto px-6 py-3 bg-[#FBF7F3] hover:bg-sage-light text-foreground text-xs font-bold rounded-xl border border-sage-light transition-all flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Return to Cart</span>
          </Link>
          <Link
            to="/contact"
            className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-gray-50 text-muted hover:text-primary text-xs font-bold rounded-xl border border-gray-200 transition-all flex items-center justify-center gap-2"
          >
            <Phone className="w-3.5 h-3.5 text-primary" />
            <span>Need Help?</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
