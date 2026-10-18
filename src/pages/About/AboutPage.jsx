import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ShieldCheck, HeartHandshake, Eye, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export const AboutPage = () => {
  const brandValues = [
    {
      title: 'Uncompromised Quality',
      description: 'We select whole raw botanicals at peak maturity, rejecting leaves or roots with blemishes or artificial exposure.'
    },
    {
      title: 'Radical Transparency',
      description: 'Single-ingredient honesty. No hidden carriers, maltodextrins, color enhancers, or preservatives on our labels.'
    },
    {
      title: '100% Natural Ingredients',
      description: 'Pure shade-dried Moringa, dehydrated Beetroot, and sun-dried Amla. Exactly as nature intended.'
    },
    {
      title: 'Customer Trust',
      description: 'We test every harvest batch and offer a 7-day hassle-free replacement or refund guarantee on all orders.'
    },
    {
      title: 'Careful Processing',
      description: 'Low-temperature processing preserves heat-sensitive phytonutrients, active enzymes, and natural chlorophyll.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-16">
      {/* Hero Intro */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-block px-3 py-1 bg-white border border-sage-light text-primary text-xs font-bold rounded-full uppercase tracking-widest shadow-xs">
          Pure Botanical Nutrition
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-primary-dark tracking-tight">
          Superfood. Naturally Better.
        </h1>
        <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
          At AgrivaFoods, we believe that radiant daily wellness begins with authentic, unadulterated food from the soil. We bridge traditional Indian botanicals with pure, accessible daily nourishment.
        </p>
      </section>

      {/* Our Story & Mission */}
      <section className="bg-white rounded-3xl p-8 sm:p-12 border border-sage-light shadow-premium grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-4">
          <span className="text-xs font-bold text-primary uppercase tracking-widest">Our Story</span>
          <h2 className="text-2xl sm:text-3xl font-black text-primary-dark">
            Why AgrivaFoods Was Born
          </h2>
          <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed">
            In an industry crowded with synthetic pills, chemical additives, and confusing proprietary formulas, AgrivaFoods was created to restore simplicity and truth to wellness.
          </p>
          <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed">
            We asked ourselves: why consume laboratory synthetics when whole botanicals like Moringa, Beetroot, and Amla have provided profound daily stamina and immune balance for thousands of years?
          </p>
          <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed">
            From farm harvesting in Maharashtra to gentle shade-drying and moisture-sealed foil packaging, our entire process is designed to protect raw active phytonutrients for your home routine.
          </p>
        </div>

        <div className="bg-[#FBF7F3] rounded-2xl p-6 sm:p-8 border border-sage-light space-y-4">
          <h3 className="text-lg font-bold text-primary-dark border-l-4 border-primary pl-3">
            Our Mission
          </h3>
          <p className="text-xs text-muted leading-relaxed">
            To empower health-conscious families with honest, pure, single-ingredient powdered superfoods that deliver measurable vitality, cellular immunity, and natural athletic stamina every single day.
          </p>

          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>Zero Artificial Additives or Preservatives</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>Sourced Ethically from Indian Cultivators</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>Tested & Protected in Freshness-Lock Pouches</span>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Values */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold text-primary uppercase tracking-widest">
            Principles We Stand By
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-primary-dark mt-1">
            Our Core Brand Values
          </h2>
          <p className="text-xs sm:text-sm text-muted mt-1">
            These foundational standards govern every product we formulate, package, and deliver.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brandValues.map((val, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-sage-light shadow-premium hover:shadow-premium-hover transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-sm mb-4">
                0{idx + 1}
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">{val.title}</h3>
              <p className="text-xs text-muted leading-relaxed">{val.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Box */}
      <section className="bg-[#184A35] text-white rounded-3xl p-8 sm:p-12 text-center shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-black mb-2">Experience the Agriva Difference</h2>
        <p className="text-xs sm:text-sm text-[#FBF7F3]/80 max-w-md mx-auto mb-6">
          Explore our trio of natural superfood powders: Moringa, Beetroot, and Amla.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary hover:bg-[#007b3b] text-white text-xs font-bold rounded-xl shadow-lg transition-all"
        >
          <span>Shop Our Superfoods</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
};
