import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import { useToast } from '../../context/ToastContext';
import { loadRazorpayScript } from '../../utils/razorpay';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  CreditCard,
  Banknote,
  Smartphone,
  Truck,
  Sparkles,
  AlertCircle,
  X
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
    paymentMethod: 'Razorpay' // Razorpay or COD
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sandboxData, setSandboxData] = useState(null);

  const handleSimulateSuccess = async () => {
    if (!sandboxData) return;
    setIsSubmitting(true);
    try {
      const { order, razorpayOrder } = sandboxData;
      const verifyPayload = {
        orderId: order._id || order.id,
        razorpayOrderId: razorpayOrder.id,
        razorpayPaymentId: `pay_sim_${Date.now()}`,
        razorpaySignature: 'test_mock_signature'
      };

      const verifiedOrder = await orderService.verifyPayment(verifyPayload);
      setSandboxData(null);
      clearCart();
      showToast('Payment Verified! Order Confirmed.', 'success');
      navigate('/order-success', { state: { order: verifiedOrder } });
    } catch (err) {
      console.error('Simulation verification failed:', err);
      showToast(err.message || 'Payment simulation failed.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSimulateFailure = () => {
    if (!sandboxData) return;
    const { order } = sandboxData;
    setSandboxData(null);
    showToast('Payment simulation marked as declined.', 'error');
    navigate('/order-failure', {
      state: {
        orderNumber: order.orderNumber,
        error: 'Payment was declined by bank or user cancelled (Simulation mode).'
      }
    });
  };

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
        quantity: i.quantity
      })),
      paymentMethod: formData.paymentMethod
    };

    try {
      // 1. Cash on Delivery Flow
      if (formData.paymentMethod === 'COD') {
        const placedOrder = await orderService.createOrder(orderPayload);
        clearCart();
        showToast('Order Placed Successfully via Cash on Delivery!', 'success');
        navigate('/order-success', { state: { order: placedOrder } });
        return;
      }

      // 2. Razorpay Payment Flow
      // Call backend to create Razorpay Order & validate trusted prices
      const sessionData = await orderService.createRazorpayOrder(orderPayload);
      const { order, razorpayOrder } = sessionData;

      if (!razorpayOrder) {
        throw new Error('Could not initiate payment session.');
      }

      // Check if backend is using placeholder test credentials
      const isPlaceholderKey =
        razorpayOrder.isSandboxMock ||
        !razorpayOrder.keyId ||
        razorpayOrder.keyId.includes('test_agrivafoods2026') ||
        razorpayOrder.keyId.includes('rzp_test_your_key_id');

      if (isPlaceholderKey) {
        setIsSubmitting(false);
        setSandboxData({ order, razorpayOrder });
        return;
      }

      // Live / Real Razorpay Test Key: Load Official SDK
      const isScriptReady = await loadRazorpayScript();
      if (!isScriptReady) {
        showToast('Unable to initialize Razorpay gateway. Please check your network connection.', 'error');
        setIsSubmitting(false);
        return;
      }

      const options = {
        key: razorpayOrder.keyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency || 'INR',
        name: 'AgrivaFoods',
        description: '100% Pure Organic Superfoods',
        image: '/assets/moringa-packaging.png',
        order_id: razorpayOrder.id,
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: '#009447'
        },
        handler: async function (response) {
          try {
            setIsSubmitting(true);
            const verifyPayload = {
              orderId: order._id || order.id,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            };

            const verifiedOrder = await orderService.verifyPayment(verifyPayload);
            clearCart();
            showToast('Payment Verified! Order Confirmed.', 'success');
            navigate('/order-success', { state: { order: verifiedOrder } });
          } catch (err) {
            console.error('Payment verification failed:', err);
            showToast(err.message || 'Payment verification failed.', 'error');
            navigate('/order-failure', {
              state: {
                orderNumber: order.orderNumber,
                error: err.message || 'Cryptographic signature verification failed.'
              }
            });
          } finally {
            setIsSubmitting(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
            showToast('Payment window closed. Your items remain in your cart.', 'info');
          }
        }
      };

      const razorpayInstance = new window.Razorpay(options);

      razorpayInstance.on('payment.failed', function (failureResponse) {
        setIsSubmitting(false);
        const errorDesc = failureResponse.error?.description || 'Payment was declined by bank or user cancelled.';
        showToast(errorDesc, 'error');
        navigate('/order-failure', {
          state: {
            orderNumber: order.orderNumber,
            error: errorDesc
          }
        });
      });

      razorpayInstance.open();
    } catch (err) {
      console.error('Error during checkout:', err);
      showToast(err.message || 'Failed to place order. Please try again.', 'error');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-3xl font-black text-primary-dark">Checkout</h1>
        <p className="text-xs text-muted mt-1">
          Complete your contact and delivery information to finalize your superfood order.
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12">
        {/* Left Columns: Forms */}
        <div className="lg:col-span-7 space-y-6 sm:space-y-8">
          {/* Customer Information */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-sage-light shadow-premium space-y-4">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider pb-2 border-b border-sage-light">
              1. Customer Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2.5 bg-[#FBF7F3] border rounded-xl text-xs sm:text-sm text-foreground focus:outline-none ${
                    errors.fullName ? 'border-error' : 'border-sage-light focus:border-primary'
                  }`}
                  placeholder="e.g. Nilesh Gawade"
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
                  className={`w-full px-3.5 py-2.5 bg-[#FBF7F3] border rounded-xl text-xs sm:text-sm text-foreground focus:outline-none ${
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
                  className={`w-full px-3.5 py-2.5 bg-[#FBF7F3] border rounded-xl text-xs sm:text-sm text-foreground focus:outline-none ${
                    errors.phone ? 'border-error' : 'border-sage-light focus:border-primary'
                  }`}
                  placeholder="8830052087"
                />
                {errors.phone && <p className="text-[11px] text-error mt-1">{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-sage-light shadow-premium space-y-4">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider pb-2 border-b border-sage-light">
              2. Shipping Address
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
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

          {/* Payment Method Selector */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-sage-light shadow-premium space-y-4">
            <div className="flex flex-wrap items-center justify-between pb-2 border-b border-sage-light gap-2">
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
                3. Payment Method
              </h2>
              <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Razorpay Verified
              </span>
            </div>

            <div className="space-y-3">
              {/* Razorpay Option */}
              <label className={`flex items-start gap-3 p-3.5 sm:p-4 rounded-2xl border cursor-pointer transition-all ${
                formData.paymentMethod === 'Razorpay' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-sage-light bg-[#FBF7F3] hover:border-primary/40'
              }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Razorpay"
                  checked={formData.paymentMethod === 'Razorpay'}
                  onChange={handleChange}
                  className="mt-1 accent-primary"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-xs font-bold text-foreground">Razorpay Standard</span>
                    </div>
                    <span className="text-[10px] bg-primary text-white font-extrabold px-2 py-0.5 rounded-full">
                      Recommended
                    </span>
                  </div>
                  <p className="text-[11px] text-muted mt-1 leading-relaxed">
                    Pay securely using UPI (Google Pay, PhonePe, Paytm), Cards, NetBanking, or Wallets.
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px] text-muted font-bold">
                    <span className="bg-white border border-sage-light px-1.5 py-0.5 rounded">UPI</span>
                    <span className="bg-white border border-sage-light px-1.5 py-0.5 rounded">GPay</span>
                    <span className="bg-white border border-sage-light px-1.5 py-0.5 rounded">PhonePe</span>
                    <span className="bg-white border border-sage-light px-1.5 py-0.5 rounded">Cards</span>
                    <span className="bg-white border border-sage-light px-1.5 py-0.5 rounded">NetBanking</span>
                  </div>
                </div>
              </label>

              {/* Cash on Delivery Option */}
              <label className={`flex items-start gap-3 p-3.5 sm:p-4 rounded-2xl border cursor-pointer transition-all ${
                formData.paymentMethod === 'COD' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-sage-light bg-[#FBF7F3] hover:border-primary/40'
              }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={formData.paymentMethod === 'COD'}
                  onChange={handleChange}
                  className="mt-1 accent-primary"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="text-xs font-bold text-foreground">Cash on Delivery (COD)</span>
                  </div>
                  <p className="text-[11px] text-muted mt-1 leading-relaxed">
                    Pay with cash or UPI scan when your parcel is delivered to your doorstep.
                  </p>
                </div>
              </label>
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
                        src={item.image}
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
                <span>Total Due</span>
                <span className="text-xl">₹{total}</span>
              </div>
            </div>

            {/* Place Order Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 min-h-[46px] bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? 'Processing Order...'
                  : formData.paymentMethod === 'Razorpay'
                  ? `Pay ₹${total} via Razorpay`
                  : `Place COD Order • ₹${total}`}
              </span>
            </button>

            <div className="pt-2 text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-primary">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Encrypted & Bank-Grade Secure Payment</span>
              </div>
              <span className="text-[10px] text-muted block">
                Prices and discounts are validated by backend security rules.
              </span>
            </div>
          </div>
        </div>
      </form>

      {/* Razorpay Test Sandbox Simulator Modal */}
      {sandboxData && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full border border-gray-200 shadow-2xl overflow-hidden animate-in zoom-in-95">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#18382A] to-[#009447] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-bold text-white text-xs">
                  Rzp
                </div>
                <div>
                  <h3 className="font-bold text-sm">Razorpay Sandbox Simulator</h3>
                  <p className="text-[11px] text-white/80">Local Development & Testing Mode</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSandboxData(null);
                  setIsSubmitting(false);
                }}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              {/* Order Info */}
              <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-gray-500 uppercase font-semibold">Order Reference</div>
                  <div className="font-mono font-bold text-xs text-gray-900">#{sandboxData.order.orderNumber}</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-gray-500 uppercase font-semibold">Amount Due</div>
                  <div className="font-extrabold text-base text-[#009447]">₹{sandboxData.order.total}</div>
                </div>
              </div>

              {/* Informative notice */}
              <div className="bg-amber-50 rounded-xl p-3.5 border border-amber-200 text-xs text-amber-900 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-amber-900">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-700" />
                  <span>Sandbox Test Mode Active</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  The backend is running with test placeholder keys (<code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-semibold">rzp_test_agrivafoods2026</code>). Razorpay's live server rejects placeholder keys. Choose an action below to test your full order flow:
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleSimulateSuccess}
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-[#009447] hover:bg-[#007A3B] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {isSubmitting ? 'Verifying Payment & Deducting Stock...' : `Simulate Successful Payment (₹${sandboxData.order.total})`}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleSimulateFailure}
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-xl border border-red-200 transition-all flex items-center justify-center gap-2"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>Simulate Payment Failure (Declined)</span>
                </button>
              </div>

              {/* Real Keys Guidance */}
              <div className="pt-3 border-t border-gray-100 text-[11px] text-gray-500 space-y-1">
                <span className="font-semibold text-gray-700 block">Want to test with the real Razorpay checkout popup?</span>
                <p className="leading-relaxed">
                  Generate free test keys in <a href="https://dashboard.razorpay.com" target="_blank" rel="noreferrer" className="text-[#009447] font-semibold underline">Razorpay Dashboard</a> and paste <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-gray-800">RAZORPAY_KEY_ID</code> and <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-gray-800">RAZORPAY_KEY_SECRET</code> in <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-gray-800">backend/.env</code>.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
