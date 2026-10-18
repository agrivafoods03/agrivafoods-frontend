import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { Search, ShoppingBag, User, Heart, Menu, X, Phone } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

export const Navbar = ({ onOpenSearch }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Prevent background scrolling when mobile menu drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    if (mobileMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/products' },
    { name: 'About Us', path: '/about' },
    { name: 'FAQs', path: '/faq' },
    { name: 'Reviews', path: '/reviews' },
    { name: 'Contact', path: '/contact' }
  ];

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sage-light/80 shadow-premium transition-all">
      {/* Top Banner Notice */}
      <div className="bg-[#184A35] text-white py-1 sm:py-1.5 px-2 sm:px-4 text-center text-[10px] xs:text-[11px] font-medium tracking-wide flex items-center justify-center gap-1.5 sm:gap-2">
        <span className="truncate max-w-full">✨ <strong>FREE SHIPPING</strong> on all orders over ₹499 across India</span>
        <span className="hidden md:inline text-sage">•</span>
        <a
          href="tel:+918830052087"
          className="hidden md:inline-flex items-center gap-1 text-sage hover:text-white transition-colors"
        >
          <Phone className="w-3 h-3" /> Call: 8830052087
        </a>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-foreground hover:text-primary rounded-xl hover:bg-[#FBF7F3] focus:outline-none transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <BrandLogo size="md" />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 font-medium text-sm">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `transition-colors duration-150 py-1 border-b-2 ${
                    isActive
                      ? 'text-primary font-bold border-primary'
                      : 'text-foreground/90 hover:text-primary border-transparent'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-0.5 xs:gap-1.5 sm:gap-3">
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-foreground/80 hover:text-primary rounded-xl hover:bg-[#FBF7F3] transition-colors"
              aria-label="Search Products"
              title="Search"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-foreground/80 hover:text-primary rounded-xl hover:bg-[#FBF7F3] transition-colors"
              aria-label="View Wishlist"
              title="Wishlist"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Account Icon */}
            <Link
              to={isAuthenticated ? '/account' : '/login'}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-foreground/80 hover:text-primary rounded-xl hover:bg-[#FBF7F3] transition-colors"
              aria-label={isAuthenticated ? 'My Account' : 'Login'}
              title={isAuthenticated ? user?.name : 'Account'}
            >
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>

            {/* Cart Icon with Live Count */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative py-1.5 px-2 sm:px-2.5 bg-[#FBF7F3] hover:bg-sage-light/50 border border-sage-light text-primary-dark rounded-xl transition-all shadow-xs flex items-center gap-1 sm:gap-1.5 ml-0.5"
              aria-label="Shopping Cart"
              title="View Cart"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <span className="hidden sm:inline text-xs font-bold text-foreground">Cart</span>
              {totalItems > 0 && (
                <span className="w-4 h-4 sm:w-5 sm:h-5 bg-primary text-white text-[9px] sm:text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-xs">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-in Drawer via Portal to escape header backdrop-filter containing block */}
      {mobileMenuOpen && typeof document !== 'undefined' && createPortal(
        <div className="lg:hidden fixed inset-0 z-[100] flex" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#184A35]/60 backdrop-blur-sm transition-opacity animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Sidebar */}
          <div className="relative w-4/5 max-w-xs bg-white min-h-screen h-[100dvh] shadow-2xl flex flex-col p-6 border-r border-sage-light animate-slide-in-left z-10 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-sage-light">
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                <BrandLogo size="sm" />
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-muted hover:text-foreground rounded-lg focus:outline-none"
                aria-label="Close Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-2.5 py-6">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    `px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-foreground hover:bg-[#FBF7F3] hover:text-primary'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-sage-light space-y-3">
              <div className="flex items-center justify-between text-xs text-muted">
                <span>Direct Support:</span>
                <a href="tel:+918830052087" className="font-bold text-primary hover:underline">
                  8830052087
                </a>
              </div>
              <Link
                to={isAuthenticated ? '/account' : '/login'}
                onClick={handleLinkClick}
                className="w-full py-2.5 px-4 bg-[#FBF7F3] border border-sage-light text-foreground text-xs font-bold rounded-xl text-center block hover:bg-sage-light/30 transition-colors"
              >
                {isAuthenticated ? `Hi, ${user?.name}` : 'Login / Register'}
              </Link>
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
};
