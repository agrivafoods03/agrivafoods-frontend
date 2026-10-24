import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import { useToast } from '../../context/ToastContext';
import { resolveMediaUrl } from '../../utils/mediaUtils';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Banknote,
  Truck,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const CheckoutPage = () => {
  const { items, subtotal, shippingFee, total, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user?.name || 'Nilesh Gawade',
    email: user?.email || 'customer@agrivafoods.com',
    phone: user?.phone || '8830052087',
    address: 'Flat 402, Green View Residency, Baner',
    apartment: 'Near High Street',
    city: 'Pune',
    state: 'Maharashtra',
    pinCode: '411045',
    country: 'India',
    paymentMethod: 'COD'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If cart is empty, redirect to cart page
  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-foreground mb-2">Your Cart is Empty</h2>
        <p className="text-xs text-muted mb-6">
          Please add superfoods to your cart before proceeding to checkout.
        </p>
        <Link
          to="/products"
          className="px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-xl"
        >
          Browse Superfoods
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) newErrors.email = 'Valid Email is required';
    if (!formData.phone.trim() || formData.phone.length < 10) newErrors.phone = 'Valid 10-digit Phone is required';
    if (!formData.address.trim()) newErrors.address = 'Street Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pinCode.trim() || formData.pinCode.length < 6) newErrors.pinCode = 'Valid 6-digit PIN code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please check the required fields in the form.', 'error');
      return;
    }

    setIsSubmitting(true);

    const orderPayload = {
      customer: {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone
      },
      shippingAddress: {
        address: formData.address,
        apartment: formData.apartment,
        city: formData.city,
        state: formData.state,
        pinCode: formData.pinCode,
        country: formData.country
      },
      items: items.map((i) => ({
        productId: i.productId,
        id: i.productId,
        slug: i.productSlug,
        name: i.name,
        weight: i.weight,
        sku: i.sku,
        quantity: i.quantity,
        price: i.price,
        image: i.image
      })),
      paymentMethod: 'COD'
    };

    try {
      const placedOrder = await orderService.createOrder(orderPayload);
      clearCart();
      showToast('Your order has been placed successfully with Cash on Delivery!', 'success');
      navigate('/order-success', { state: { order: placedOrder } });
    } catch (err) {
      console.error('Order placement failed:', err);
      showToast(err.message || 'Failed to place order. Please check details and try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-12">
      {/* Page Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-primary-dark tracking-tight">
          Checkout
        </h1>
        <p className="text-xs sm:text-sm text-muted mt-1">
          Review your items and complete your order with Cash on Delivery.
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Column: Delivery & Payment Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Contact Information */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-sage-light shadow-premium space-y-4">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider pb-2 border-b border-sage-light">
              1. Contact Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full px-3 sm:px-3.5 py-2 sm:py-2.5 bg-[#FBF7F3] border rounded-xl text-xs sm:text-sm text-foreground focus:outline-none ${
                    errors.fullName ? 'border-error' : 'border-sage-light focus:border-primary'
                  }`}
                  placeholder="Nilesh Gawade"
                />
                {errors.fullName && <p className="text-[11px] text-error mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 sm:px-3.5 py-2 sm:py-2.5 bg-[#FBF7F3] border rounded-xl text-xs sm:text-sm text-foreground focus:outline-none ${
                    errors.email ? 'border-error' : 'border-sage-light focus:border-primary'
                  }`}
                  placeholder="nilesh@example.com"
                />
                {errors.email && <p className="text-[11px] text-error mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Phone Number (10 digits) *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-3 sm:px-3.5 py-2 sm:py-2.5 bg-[#FBF7F3] border rounded-xl text-xs sm:text-sm text-foreground focus:outline-none ${
                    errors.phone ? 'border-error' : 'border-sage-light focus:border-primary'
                  }`}
                  placeholder="9876543210"
                />
                {errors.phone && <p className="text-[11px] text-error mt-1">{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* 2. Shipping Address */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-sage-light shadow-premium space-y-4">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider pb-2 border-b border-sage-light">
              2. Shipping Address
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Street Address / House / Flat *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full px-3 sm:px-3.5 py-2 sm:py-2.5 bg-[#FBF7F3] border rounded-xl text-xs sm:text-sm text-foreground focus:outline-none ${
                    errors.address ? 'border-error' : 'border-sage-light focus:border-primary'
                  }`}
                  placeholder="Flat 402, Green View Residency, Baner"
                />
                {errors.address && <p className="text-[11px] text-error mt-1">{errors.address}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Apartment, Suite, Landmark (Optional)
                </label>
                <input
                  type="text"
                  name="apartment"
                  value={formData.apartment}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 bg-[#FBF7F3] border border-sage-light rounded-xl text-xs sm:text-sm text-foreground focus:outline-none focus:border-primary"
                  placeholder="Near High Street"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`w-full px-3 sm:px-3.5 py-2 sm:py-2.5 bg-[#FBF7F3] border rounded-xl text-xs sm:text-sm text-foreground focus:outline-none ${
                    errors.city ? 'border-error' : 'border-sage-light focus:border-primary'
                  }`}
                  placeholder="Pune"
                />
                {errors.city && <p className="text-[11px] text-error mt-1">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={`w-full px-3 sm:px-3.5 py-2 sm:py-2.5 bg-[#FBF7F3] border rounded-xl text-xs sm:text-sm text-foreground focus:outline-none ${
                    errors.state ? 'border-error' : 'border-sage-light focus:border-primary'
                  }`}
                  placeholder="Maharashtra"
                />
                {errors.state && <p className="text-[11px] text-error mt-1">{errors.state}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  PIN Code *
                </label>
                <input
                  type="text"
                  name="pinCode"
                  value={formData.pinCode}
                  onChange={handleChange}
                  className={`w-full px-3 sm:px-3.5 py-2 sm:py-2.5 bg-[#FBF7F3] border rounded-xl text-xs sm:text-sm text-foreground focus:outline-none ${
                    errors.pinCode ? 'border-error' : 'border-sage-light focus:border-primary'
                  }`}
                  placeholder="411045"
                />
                {errors.pinCode && <p className="text-[11px] text-error mt-1">{errors.pinCode}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  disabled
                  className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 bg-sage-light/30 border border-sage-light rounded-xl text-xs sm:text-sm text-foreground opacity-80 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* 3. Payment Method: Cash on Delivery Only */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-sage-light shadow-premium space-y-4">
            <div className="flex flex-wrap items-center justify-between pb-2 border-b border-sage-light gap-2">
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
                3. Payment Method
              </h2>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
                <Banknote className="w-3.5 h-3.5 text-emerald-700" /> Cash on Delivery (COD)
              </span>
            </div>

            {/* Exclusive Cash on Delivery Card */}
            <div className="p-4 sm:p-5 rounded-2xl border-2 border-[#009447] bg-gradient-to-br from-emerald-50/70 to-white shadow-xs space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#009447] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Truck className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <span className="text-sm font-bold text-[#18382A]">
                      Pay When Your Order Arrives
                    </span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-200/80 text-emerald-900">
                      Standard
                    </span>
                  </div>
                  <p className="text-xs text-muted mt-1 leading-relaxed">
                    Pay <strong className="font-bold text-[#18382A]">₹{total}</strong> when your parcel is delivered at your doorstep. No advance payment or card details required.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-emerald-100/80 text-[11px] text-[#18382A]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#009447] shrink-0" />
                  <span>Zero advance payment required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#009447] shrink-0" />
                  <span>Inspect package upon delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#009447] shrink-0" />
                  <span>Pay with Cash or UPI QR Code</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#009447] shrink-0" />
                  <span>Safe, direct & transparent delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-sage-light shadow-premium sticky top-24 space-y-5 sm:space-y-6">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider pb-3 border-b border-sage-light">
              Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})
            </h2>

            {/* Item List */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.variantId} className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#FBF7F3] border border-sage-light rounded-xl p-1 flex-shrink-0 flex items-center justify-center">
                      <img
                        src={resolveMediaUrl(item.image)}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground line-clamp-1">{item.name}</h4>
                      <span className="text-[11px] text-muted">
                        {item.weight} × {item.quantity}
                      </span>
                    </div>
                  </div>
                  <span className="font-extrabold text-primary-dark">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="pt-3 border-t border-sage-light space-y-2 text-xs">
              <div className="flex justify-between text-muted">
                <span>Subtotal</span>
                <span className="font-semibold text-foreground">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Shipping Delivery</span>
                <span className="font-semibold text-foreground">
                  {shippingFee === 0 ? <span className="text-primary font-bold">FREE</span> : `₹${shippingFee}`}
                </span>
              </div>
              <div className="pt-3 border-t border-sage-light flex justify-between items-baseline text-sm font-black text-primary-dark">
                <span>Total Due on Delivery</span>
                <span className="text-xl">₹{total}</span>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 min-h-[48px] bg-primary hover:bg-primary-dark text-white text-xs sm:text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
            >
              <Truck className="w-4 h-4" />
              <span>
                {isSubmitting ? 'Placing Order...' : `Place COD Order • ₹${total}`}
              </span>
            </button>

            <div className="pt-2 text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-primary">
                <ShieldCheck className="w-4 h-4" />
                <span>Pay safely upon delivery at your doorstep</span>
              </div>
              <span className="text-[10px] text-muted block">
                Prices and stock availability are validated in real-time.
              </span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
