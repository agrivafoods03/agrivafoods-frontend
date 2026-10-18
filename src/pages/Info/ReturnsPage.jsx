import React from 'react';
import { RotateCcw, ShieldCheck, Phone, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ReturnsPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold text-primary uppercase tracking-widest">Our Guarantee</span>
        <h1 className="text-3xl font-black text-primary-dark mt-1">Returns & Refunds Policy</h1>
        <p className="text-xs sm:text-sm text-muted mt-2">
          Committed to your absolute satisfaction with our superfood products.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-sage-light shadow-premium space-y-6 text-xs sm:text-sm text-foreground/85 leading-relaxed">
        <div className="p-4 bg-emerald-50 border border-primary/20 rounded-2xl flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-primary flex-shrink-0" />
          <div>
            <h4 className="font-bold text-primary-dark text-sm">7-Day Quality Guarantee</h4>
            <p className="text-xs text-muted">
              If your pouch arrives damaged, unsealed, or flawed in any manner, we replace it or issue a prompt refund.
            </p>
          </div>
        </div>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-primary-dark">1. Eligibility for Replacement or Refund</h2>
          <p>
            Due to the consumable nature of food and botanical powders, opened packs cannot be returned unless there is an authentic defect or physical damage in transit.
          </p>
          <ul className="space-y-2 list-disc list-inside text-muted pl-2">
            <li>Damaged, punctured, or torn pouches upon delivery</li>
            <li>Incorrect variant or product received</li>
            <li>Seal tampering during courier transit</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-primary-dark">2. How to Claim a Replacement</h2>
          <p>
            Simply notify our team within 7 days of package delivery with a photo of the received parcel via:
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <a
              href="https://wa.me/918830052087"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#25D366]/10 text-[#25D366] font-bold text-xs rounded-xl border border-[#25D366]/30"
            >
              WhatsApp Support: 8830052087
            </a>
            <a
              href="mailto:agrivafoods03@gmail.com"
              className="px-4 py-2 bg-primary/10 text-primary font-bold text-xs rounded-xl border border-primary/30"
            >
              Email: agrivafoods03@gmail.com
            </a>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-primary-dark">3. Refund Processing</h2>
          <p>
            Approved refunds are credited back to the original source account (UPI / Bank Card) within 3 to 5 business days. For COD orders, a bank transfer or UPI transfer is initiated directly.
          </p>
        </section>
      </div>
    </div>
  );
};
