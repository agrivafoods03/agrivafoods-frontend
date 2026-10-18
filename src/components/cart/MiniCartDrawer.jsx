import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { FreeShippingBar } from '../common/FreeShippingBar';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export const MiniCartDrawer = () => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    totalItems
  } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart Drawer"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#184A35]/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-sage-light animate-slide-in-right">
          {/* Header */}
          <div className="px-4 sm:px-5 py-3.5 sm:py-4 border-b border-sage-light bg-[#FBF7F3] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              <h2 className="text-base font-bold text-foreground">
                Your Cart <span className="text-xs text-muted font-normal">({totalItems} items)</span>
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-muted hover:text-foreground rounded-lg hover:bg-white/80 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Indicator */}
          <div className="px-5 pt-3 pb-1 bg-[#FBF7F3]/50">
            <FreeShippingBar />
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto px-5 py-3 space-y-4">
            {items.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#FBF7F3] border border-sage-light flex items-center justify-center text-muted mb-4">
                  <ShoppingBag className="w-8 h-8 stroke-[1.2]" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-1">Your cart is empty</h3>
                <p className="text-xs text-muted max-w-xs mb-6">
                  Explore our natural superfood powders and give your daily health a boost.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/products');
                  }}
                  className="px-6 py-2.5 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary-dark transition-colors shadow-md"
                >
                  Explore Our Products
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.variantId}
                  className="flex gap-3.5 pb-4 border-b border-sage-light/60 last:border-b-0"
                >
                  {/* Item Image */}
                  <div className="w-16 h-16 rounded-xl bg-[#FBF7F3] border border-sage-light p-1 flex-shrink-0 flex items-center justify-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Item Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <Link
                        to={`/products/${item.productSlug}`}
                        onClick={() => setIsCartOpen(false)}
                        className="text-xs font-bold text-foreground hover:text-primary transition-colors line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.variantId)}
                        className="text-muted/60 hover:text-error transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[11px] text-muted font-medium mt-0.5">
                      Pack Size: <span className="text-foreground font-semibold">{item.weight}</span>
                    </div>

                    <div className="flex items-center justify-between mt-2.5">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-sage-light rounded-lg bg-[#FBF7F3]">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="px-2 py-1 text-muted hover:text-foreground transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-foreground min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="px-2 py-1 text-muted hover:text-foreground transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Pricing */}
                      <div className="text-right">
                        <span className="text-xs font-bold text-foreground">
                          ₹{item.price * item.quantity}
                        </span>
                        {item.originalPrice > item.price && (
                          <span className="block text-[10px] text-muted line-through">
                            ₹{item.originalPrice * item.quantity}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & CTAs */}
          {items.length > 0 && (
            <div className="border-t border-sage-light p-5 bg-[#FBF7F3] space-y-3">
              <div className="flex justify-between items-center text-sm font-bold text-foreground">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <p className="text-[11px] text-muted">
                Taxes and shipping calculated at checkout.
              </p>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/cart');
                  }}
                  className="w-full py-2.5 px-4 bg-white border border-sage-light text-foreground text-xs font-bold rounded-xl hover:bg-sage-light/40 transition-colors text-center"
                >
                  View Cart
                </button>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/checkout');
                  }}
                  className="w-full py-2.5 px-4 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark transition-all flex items-center justify-center gap-1.5 shadow-md"
                >
                  Checkout
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => setIsCartOpen(false)}
                className="w-full text-center text-xs font-medium text-muted hover:text-foreground underline pt-1"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
