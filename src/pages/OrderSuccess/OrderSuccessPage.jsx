import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, ShieldCheck, Phone, MapPin, CreditCard } from 'lucide-react';

export const OrderSuccessPage = () => {
  const location = useLocation();
  const order = location.state?.order;

  // Fallback structure if visited directly
  const displayOrder = order || {
    orderNumber: 'AGR-2026-VERIFIED',
    placedAt: new Date(),
    paymentMethod: 'Razorpay',
    paymentStatus: 'Completed',
    customer: {
      fullName: 'Nilesh Gawade',
      email: 'customer@agrivafoods.com',
      phone: '8830052087'
    },
    shippingAddress: {
      address: 'Flat 402, Green View Residency, Baner',
      city: 'Pune',
      state: 'Maharashtra',
      pinCode: '411045'
    },
    items: [
      {
        name: 'AgrivaFoods Moringa Powder',
        weight: '250g',
        quantity: 1,
        price: 299,
        image: '/assets/moringa-packaging.png'
      }
    ],
    subtotal: 299,
    shippingFee: 0,
    total: 299
  };

  const orderNum = displayOrder.orderNumber || displayOrder.id || displayOrder._id;
  const isPaid = displayOrder.paymentStatus === 'Completed' || displayOrder.paymentStatus === 'paid';

  return (
    <div className="max-w-3xl mx-auto px-3.5 sm:px-6 py-8 sm:py-16">
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-10 border border-sage-light shadow-xl text-center">
        {/* Animated Checkmark */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-50 border border-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-xs">
          <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2]" />
        </div>

        <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-[11px] sm:text-xs font-bold rounded-full uppercase tracking-wider mb-2">
          {isPaid ? 'Payment Verified & Order Confirmed' : 'Order Received'}
        </span>

        <h1 className="text-xl sm:text-3xl font-black text-primary-dark">
          Order Placed Successfully!
        </h1>
        <p className="text-xs sm:text-sm text-muted mt-2 max-w-md mx-auto leading-relaxed">
          Thank you for trusting AgrivaFoods. Your 100% natural superfoods order is being carefully packed for swift dispatch.
        </p>

        {/* Order Details Card */}
        <div className="mt-6 sm:mt-8 p-3.5 sm:p-5 bg-[#FBF7F3] rounded-2xl border border-sage-light text-left space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-sage-light">
            <div>
              <span className="text-[11px] text-muted font-medium block">Order Number</span>
              <span className="text-sm font-mono font-bold text-primary-dark">{orderNum}</span>
            </div>
            <div>
              <span className="text-[11px] text-muted font-medium block">Payment Status</span>
              <span className={`inline-flex items-center gap-1 text-xs font-bold ${isPaid ? 'text-emerald-700' : 'text-amber-700'}`}>
                <ShieldCheck className="w-3.5 h-3.5" />
                {displayOrder.paymentStatus || 'Completed'}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-muted font-medium block">Payment Method</span>
              <span className="text-xs font-bold text-foreground capitalize">{displayOrder.paymentMethod || 'Razorpay'}</span>
            </div>
          </div>

          {/* Razorpay Transaction ID if present */}
          {displayOrder.razorpayPaymentId && (
            <div className="p-3 bg-white rounded-xl border border-sage-light/60 flex items-center justify-between text-xs">
              <span className="text-muted font-medium flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-primary" /> Razorpay Payment ID:
              </span>
              <span className="font-mono font-semibold text-primary-dark">{displayOrder.razorpayPaymentId}</span>
            </div>
          )}

          {/* Delivery Address */}
          <div>
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              Delivery Address
            </h4>
            <p className="text-xs text-muted leading-relaxed">
              <strong className="text-foreground">{displayOrder.customer?.fullName || displayOrder.customer?.name}</strong> ({displayOrder.customer?.phone})
              <br />
              {displayOrder.shippingAddress?.address || displayOrder.shippingAddress?.street}, {displayOrder.shippingAddress?.city},{' '}
              {displayOrder.shippingAddress?.state} – {displayOrder.shippingAddress?.pinCode || displayOrder.shippingAddress?.pincode}
            </p>
          </div>

          {/* Purchased Items List */}
          <div className="pt-3 border-t border-sage-light">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-primary" />
              Items Ordered
            </h4>
            <div className="space-y-2">
              {displayOrder.items?.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <img
                      src={item.image || '/assets/moringa-packaging.png'}
                      alt={item.name}
                      className="w-8 h-8 object-contain bg-white rounded border border-sage-light p-0.5"
                    />
                    <span>
                      <strong className="font-semibold text-foreground">{item.name}</strong> ({item.weight}) × {item.quantity}
                    </span>
                  </div>
                  <span className="font-bold text-foreground">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Total Row */}
          <div className="pt-3 border-t border-sage-light flex justify-between items-center text-sm font-bold text-primary-dark">
            <span>Total Amount Paid</span>
            <span className="text-lg font-black">₹{displayOrder.total}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/products"
            className="w-full sm:w-auto px-6 py-3 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/account/orders"
            className="w-full sm:w-auto px-6 py-3 bg-[#FBF7F3] hover:bg-cream border border-sage-light text-foreground text-xs font-bold rounded-xl transition-all"
          >
            View My Orders
          </Link>
        </div>
      </div>
    </div>
  );
};
