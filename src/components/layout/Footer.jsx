import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { productService } from '../../services/productService';

export const Footer = () => {
  const [shopLinks, setShopLinks] = useState([]);

  useEffect(() => {
    productService.getProducts()
      .then((items) => {
        if (Array.isArray(items)) {
          setShopLinks(items.slice(0, 4));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-[#184A35] text-[#FBF7F3] pt-12 sm:pt-16 pb-10 sm:pb-12 border-t border-sage-light/20">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-8 pb-10 sm:pb-12 border-b border-white/10">
          {/* Brand Bio (Col 1 & 2 on large) */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block" aria-label="AgrivaFoods Home">
              <BrandLogo variant="light" size="md" />
            </Link>

            <p className="text-xs sm:text-sm text-[#FBF7F3]/80 leading-relaxed max-w-sm">
              AgrivaFoods is committed to bringing you 100% pure, natural, and unprocessed superfood powders. Thoughtfully sourced, shade-dried, and crafted for your everyday vitality.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-[#C7D2A8]">
              <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent" />
                Pure Single-Ingredient
              </span>
              <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs">
                <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent" />
                No Additives
              </span>
            </div>
          </div>

          {/* Shop Column */}
          <div className="space-y-3.5">
            <h4 className="text-sm font-bold tracking-wider uppercase text-white border-l-2 border-primary pl-2.5">
              Shop
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#FBF7F3]/75">
              <li>
                <Link to="/products" className="hover:text-white hover:underline transition-colors">
                  All Products
                </Link>
              </li>
              {shopLinks.map((prod) => (
                <li key={prod.id || prod._id || prod.slug}>
                  <Link
                    to={`/products/${prod.slug}`}
                    className="hover:text-white hover:underline transition-colors block truncate max-w-[200px]"
                    title={prod.name}
                  >
                    {prod.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div className="space-y-3.5">
            <h4 className="text-sm font-bold tracking-wider uppercase text-white border-l-2 border-primary pl-2.5">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#FBF7F3]/75">
              <li>
                <Link to="/about" className="hover:text-white hover:underline transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white hover:underline transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white hover:underline transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="hover:text-white hover:underline transition-colors">
                  Customer Reviews
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-white hover:underline transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-white hover:underline transition-colors">
                  Returns & Refunds
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="space-y-3.5">
            <h4 className="text-sm font-bold tracking-wider uppercase text-white border-l-2 border-primary pl-2.5">
              Get in Touch
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-[#FBF7F3]/80">
              <a
                href="tel:+918830052087"
                className="flex items-center gap-2.5 hover:text-white transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <span>+91 88300 52087</span>
              </a>

              <a
                href="https://wa.me/918830052087"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 hover:text-white transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#25D366]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#25D366] transition-colors">
                  <span className="text-xs font-bold text-white">WA</span>
                </div>
                <span>WhatsApp: 8830052087</span>
              </a>

              <a
                href="mailto:agrivafoods03@gmail.com"
                className="flex items-center gap-2.5 hover:text-white transition-colors group break-all"
              >
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <span>agrivafoods03@gmail.com</span>
              </a>

              <div className="flex items-start gap-2.5 text-xs text-[#FBF7F3]/70 pt-1">
                <MapPin className="w-4 h-4 text-sage flex-shrink-0 mt-0.5" />
                <span>Maharashtra, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FBF7F3]/60 text-center sm:text-left">
          <p>© 2026 AgrivaFoods. All rights reserved.</p>

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3.5 sm:gap-6">
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
            <Link to="/shipping" className="hover:text-white transition-colors">
              Shipping Policy
            </Link>
            <Link to="/returns" className="hover:text-white transition-colors">
              Refund Policy
            </Link>
            <Link to="/admin/login" className="hover:text-white transition-colors text-white/50 hover:text-white">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
