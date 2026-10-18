import React from 'react';

export const TermsPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold text-primary uppercase tracking-widest">Legal Agreement</span>
        <h1 className="text-3xl font-black text-primary-dark mt-1">Terms & Conditions</h1>
        <p className="text-xs sm:text-sm text-muted mt-2">Last updated: September 2026</p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-sage-light shadow-premium space-y-6 text-xs sm:text-sm text-foreground/85 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-primary-dark">1. Acceptance of Terms</h2>
          <p>
            By accessing or ordering from AgrivaFoods, you acknowledge and agree to comply with and be bound by the following terms and conditions of use.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-primary-dark">2. Product Descriptions & Pricing</h2>
          <p>
            AgrivaFoods strives to ensure that all packaging descriptions, nutritional details, and prices shown are accurate. In the rare event of a pricing or inventory discrepancy, we reserve the right to correct the error or cancel affected orders before courier dispatch.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-primary-dark">3. Health & Wellness Disclaimer</h2>
          <p>
            Our powdered food products are 100% whole botanical superfoods (Moringa, Beetroot, Amla) intended to support general dietary wellness. They are not intended to diagnose, treat, cure, or prevent any medical condition. Individuals with specific medical conditions or pregnant/nursing mothers should consult a physician before modifying their diet.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-primary-dark">4. Governing Law</h2>
          <p>
            Any disputes relating to your visit or purchase shall be subject to the exclusive jurisdiction of the competent courts in Maharashtra, India.
          </p>
        </section>
      </div>
    </div>
  );
};
