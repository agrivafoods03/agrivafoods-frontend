import React from 'react';

export const PrivacyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold text-primary uppercase tracking-widest">Data Protection</span>
        <h1 className="text-3xl font-black text-primary-dark mt-1">Privacy Policy</h1>
        <p className="text-xs sm:text-sm text-muted mt-2">Last updated: September 2026</p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-sage-light shadow-premium space-y-6 text-xs sm:text-sm text-foreground/85 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-primary-dark">1. Information We Collect</h2>
          <p>
            When you purchase from AgrivaFoods, we collect information necessary to fulfill your order, including your full name, shipping address, telephone number, and email address. We do not store sensitive payment card information on our servers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-primary-dark">2. How We Use Your Data</h2>
          <p>
            Your information is strictly used for order processing, logistics delivery via registered courier partners, and order status communications. We will never sell, rent, or trade your personal information with third-party advertisers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-primary-dark">3. Cookies & Session Storage</h2>
          <p>
            Our web platform uses local browser storage to keep track of your shopping cart, selected variant sizes, and authentication session between page navigations.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-primary-dark">4. Contacting Us Regarding Privacy</h2>
          <p>
            For any inquiries regarding data protection or account deletion requests, please contact us at <strong>agrivafoods03@gmail.com</strong> or phone +91 88300 52087.
          </p>
        </section>
      </div>
    </div>
  );
};
