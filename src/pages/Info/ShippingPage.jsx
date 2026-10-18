import React from 'react';
import { Truck, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const ShippingPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold text-primary uppercase tracking-widest">Delivery Policies</span>
        <h1 className="text-3xl font-black text-primary-dark mt-1">Shipping & Delivery</h1>
        <p className="text-xs sm:text-sm text-muted mt-2">
          Fast, reliable, and hygienic doorstep delivery across India.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-sage-light shadow-premium space-y-6 text-xs sm:text-sm text-foreground/85 leading-relaxed">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6 border-b border-sage-light">
          <div className="p-4 bg-[#FBF7F3] rounded-2xl border border-sage-light text-center">
            <Truck className="w-6 h-6 text-primary mx-auto mb-2" />
            <h4 className="font-bold text-foreground">Free Shipping</h4>
            <p className="text-xs text-muted mt-1">On all orders above ₹499</p>
          </div>
          <div className="p-4 bg-[#FBF7F3] rounded-2xl border border-sage-light text-center">
            <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
            <h4 className="font-bold text-foreground">3 to 5 Days</h4>
            <p className="text-xs text-muted mt-1">Standard transit time</p>
          </div>
          <div className="p-4 bg-[#FBF7F3] rounded-2xl border border-sage-light text-center">
            <ShieldCheck className="w-6 h-6 text-primary mx-auto mb-2" />
            <h4 className="font-bold text-foreground">Secure Packaging</h4>
            <p className="text-xs text-muted mt-1">Multi-layered sealed pouches</p>
          </div>
        </div>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-primary-dark">1. Shipping Rates & Thresholds</h2>
          <p>
            AgrivaFoods offers <strong>Free Standard Shipping</strong> on all retail orders having a cart value of <strong>₹499 or higher</strong>.
          </p>
          <p>
            For orders below ₹499, a nominal flat courier fee of <strong>₹49</strong> is applied at checkout to cover transit and packaging costs.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-primary-dark">2. Order Processing & Dispatch</h2>
          <p>
            Orders received before 2:00 PM IST on business days (Monday through Saturday) are typically dispatched on the same or next business day. You will receive an SMS or email tracking confirmation once the parcel is handed to our courier partners.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-primary-dark">3. Delivery Timeline</h2>
          <p>
            Metro cities (Mumbai, Pune, Delhi NCR, Bengaluru, Hyderabad, Chennai) usually receive delivery within <strong>2 to 4 business days</strong>. Non-metro locations and tier 2/3 towns typically arrive within <strong>3 to 6 business days</strong>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-primary-dark">4. Need Assistance?</h2>
          <p>
            For tracking queries or urgent address corrections, please call us directly at <strong>+91 88300 52087</strong> or WhatsApp our team.
          </p>
        </section>
      </div>
    </div>
  );
};
