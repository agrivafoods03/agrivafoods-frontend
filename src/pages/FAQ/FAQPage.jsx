import React, { useState } from 'react';
import { mockFAQs } from '../../data/mockFAQs';
import { ChevronDown, HelpCircle, Phone, Mail, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FAQPage = () => {
  const [openItems, setOpenItems] = useState({ '0-0': true, '1-0': true });

  const toggleItem = (catIdx, qIdx) => {
    const key = `${catIdx}-${qIdx}`;
    setOpenItems((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold text-primary uppercase tracking-widest">
          Knowledge Base & Support
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-primary-dark mt-1">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-muted mt-2 leading-relaxed">
          Find straightforward answers about our pure superfood powders, harvesting methods, daily recipes, and doorstep delivery.
        </p>
      </div>

      {/* FAQ Categories */}
      <div className="space-y-8">
        {mockFAQs.map((category, catIdx) => (
          <div key={catIdx} className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-primary-dark border-l-4 border-primary pl-3">
              {category.category}
            </h2>

            <div className="bg-white rounded-2xl border border-sage-light shadow-premium divide-y divide-sage-light/60 overflow-hidden">
              {category.questions.map((faq, qIdx) => {
                const key = `${catIdx}-${qIdx}`;
                const isOpen = !!openItems[key];

                return (
                  <div key={qIdx} className="transition-colors">
                    <button
                      onClick={() => toggleItem(catIdx, qIdx)}
                      className="w-full py-4 px-6 text-left flex items-center justify-between gap-4 focus:outline-none hover:bg-[#FBF7F3]/50"
                    >
                      <span className="text-xs sm:text-sm font-bold text-foreground">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-primary transition-transform duration-200 flex-shrink-0 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-4 pt-1 text-xs text-muted leading-relaxed animate-fade-in">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Direct Contact Banner */}
      <div className="bg-[#FBF7F3] rounded-3xl p-8 border border-sage-light text-center space-y-4">
        <h3 className="text-lg font-bold text-primary-dark">Still have questions?</h3>
        <p className="text-xs text-muted max-w-md mx-auto">
          Our friendly customer care team is always here to advise you on picking the right superfood powder for your fitness or daily health goals.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href="tel:+918830052087"
            className="px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl shadow-xs hover:bg-primary-dark transition-all flex items-center gap-2"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call 8830052087</span>
          </a>
          <a
            href="https://wa.me/918830052087"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-[#25D366] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#20ba59] transition-all flex items-center gap-2"
          >
            <span>WhatsApp Us</span>
          </a>
        </div>
      </div>
    </div>
  );
};
