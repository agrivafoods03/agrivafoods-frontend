import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ArrowRight, Home } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
      <div className="w-20 h-20 bg-white rounded-3xl border border-sage-light flex items-center justify-center mx-auto text-primary shadow-premium">
        <Leaf className="w-10 h-10 stroke-[1.5]" />
      </div>
      <span className="text-4xl sm:text-6xl font-black text-primary-dark block">404</span>
      <h1 className="text-2xl font-bold text-foreground">Page Not Found</h1>
      <p className="text-xs sm:text-sm text-muted max-w-sm mx-auto leading-relaxed">
        The page you are looking for does not exist or may have been moved. Let's get you back to our natural superfoods.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          to="/"
          className="w-full sm:w-auto px-6 py-3 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <Link
          to="/products"
          className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-cream border border-sage-light text-foreground text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <span>Shop Superfoods</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
