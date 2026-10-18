import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { productService } from '../../services/productService';
import { FreeShippingBar } from '../../components/common/FreeShippingBar';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export const CartPage = () => {
  const {
    items,
    removeFromCart,
    updateQuantity,
    updateVariant,
    clearCart,
    subtotal,
    totalDiscount,
    shippingFee,
    total,
    totalItems
  } = useCart();
  const navigate = useNavigate();
  const [productsList, setProductsList] = useState([]);

  useEffect(() => {
    productService.getProducts()
      .then((data) => {
        if (Array.isArray(data)) setProductsList(data);
      })
      .catch((err) => console.warn('Failed to load products in CartPage:', err));
  }, []);

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-white rounded-full border border-sage-light flex items-center justify-center mx-auto mb-4 text-muted shadow-premium">
          <ShoppingBag className="w-10 h-10 stroke-[1.2]" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-primary-dark mb-2">Your Cart is Empty</h1>
        <p className="text-sm text-muted max-w-sm mx-auto mb-8 leading-relaxed">
          Looks like you haven't added any natural superfood powders yet. Nourish your body today!
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl shadow-lg transition-all"
        >
          <span>Explore Superfoods</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 sm:pb-6 mb-6 sm:mb-8 border-b border-sage-light gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-3xl font-black text-primary-dark">Shopping Cart</h1>
          <p className="text-xs text-muted mt-1">Review your superfood selection before checking out.</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-muted hover:text-error transition-colors flex items-center gap-1 self-start sm:self-auto py-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear All Items</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {/* Free Shipping Progress Card */}
          <FreeShippingBar />

          <div className="bg-white rounded-2xl border border-sage-light shadow-premium divide-y divide-sage-light/60 overflow-hidden">
            {items.map((item) => {
              // Find full product definition to display alternate variant options
              const productDef = productsList.find((p) => p.id === item.productId || p._id === item.productId || p.slug === item.productSlug);

              return (
                <div key={item.variantId} className="p-3.5 sm:p-6 flex flex-col sm:flex-row gap-3.5 sm:gap-4 sm:items-center justify-between">
                  {/* Image & Product Info */}
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-[#FBF7F3] border border-sage-light p-1.5 sm:p-2 flex-shrink-0 flex items-center justify-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/products/${item.productSlug}`}
                        className="text-xs sm:text-sm font-bold text-foreground hover:text-primary transition-colors block truncate"
                      >
                        {item.name}
                      </Link>
                      <span className="text-[10px] sm:text-[11px] text-muted block mt-0.5">SKU: {item.sku}</span>

                      {/* Variant Size Selector Dropdown */}
                      {productDef && (
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <span className="text-[11px] text-muted font-medium">Pack:</span>
                          <select
                            value={item.variantId}
                            onChange={(e) => {
                              const newVar = productDef.variants.find((v) => v.id === e.target.value);
                              if (newVar) {
                                updateVariant(item.variantId, newVar, productDef);
                              }
                            }}
                            className="text-[11px] font-semibold px-2 py-0.5 bg-[#FBF7F3] border border-sage-light rounded-lg text-foreground cursor-pointer focus:outline-none focus:border-primary max-w-[140px] truncate"
                          >
                            {productDef.variants.map((v) => (
                              <option key={v.id} value={v.id}>
                                {v.weight} – ₹{v.price}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quantity & Price Controls */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-sage-light/60">
                    <div className="flex items-center border border-sage-light rounded-lg bg-[#FBF7F3]">
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                        className="p-1.5 text-muted hover:text-foreground transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2.5 text-xs font-bold text-foreground min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        className="p-1.5 text-muted hover:text-foreground transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right min-w-[80px]">
                      <span className="text-sm sm:text-base font-bold text-foreground">
                        ₹{item.price * item.quantity}
                      </span>
                      {item.originalPrice > item.price && (
                        <span className="block text-[11px] text-muted line-through">
                          ₹{item.originalPrice * item.quantity}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => removeFromCart(item.variantId)}
                      className="p-2 text-muted/60 hover:text-error transition-colors"
                      aria-label="Remove item"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2">
            <Link
              to="/products"
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1.5"
            >
              <span>← Continue Shopping Superfoods</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-sage-light shadow-premium space-y-4 sticky top-28">
            <h3 className="text-base font-bold text-primary-dark pb-3 border-b border-sage-light">
              Order Summary ({totalItems} items)
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-muted">
                <span>Items Subtotal</span>
                <span className="font-semibold text-foreground">₹{subtotal}</span>
              </div>

              {totalDiscount > 0 && (
                <div className="flex justify-between text-accent">
                  <span>Product Savings</span>
                  <span className="font-bold">-₹{totalDiscount}</span>
                </div>
              )}

              <div className="flex justify-between text-muted">
                <span>Shipping Charges</span>
                <span className="font-semibold text-foreground">
                  {shippingFee === 0 ? (
                    <span className="text-primary font-bold">FREE</span>
                  ) : (
                    `₹${shippingFee}`
                  )}
                </span>
              </div>

              <div className="pt-3 border-t border-sage-light flex justify-between items-baseline text-sm font-black text-primary-dark">
                <span>Total Amount</span>
                <span className="text-xl">₹{total}</span>
              </div>
              <span className="block text-[10px] text-muted text-right">
                Includes all applicable taxes
              </span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-3.5 px-6 min-h-[44px] bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-4"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-4 border-t border-sage-light/60 space-y-2 text-[11px] text-muted">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>100% Secure Checkout with Instant UPI</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-primary" />
                <span>7-Day Easy Replacement Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
