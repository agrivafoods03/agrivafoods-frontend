import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, ShieldCheck, MapPin, Banknote, Clock } from 'lucide-react';
import { resolveMediaUrl } from '../../utils/mediaUtils';

export const OrderSuccessPage = () => {
  const location = useLocation();
  const order = location.state?.order;

  // Fallback structure if visited directly
  const displayOrder = order || {
    orderNumber: 'AGR-2026-COD',
    placedAt: new Date(),
    paymentMethod: 'COD',
    paymentStatus: 'Pending',
    customer: {
      fullName: 'Customer',
      email: 'order@agrivafoods.com',
      phone: '9876543210'
    },
    shippingAddress: {
      address: 'Shipping Address on File',
      city: 'Pune',
      state: 'Maharashtra',
      pinCode: '411001'
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
  const rawMethod = displayOrder.paymentMethod || 'COD';
  const isCod = rawMethod.toUpperCase() === 'COD' || rawMethod.toLowerCase().includes('cash');
  const isPaid = displayOrder.paymentStatus?.toLowerCase() === 'completed' || displayOrder.paymentStatus?.toLowerCase() === 'paid';

  return (
    <div className="max-w-3xl mx-auto px-3.5 sm:px-6 py-8 sm:py-16">
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-10 border border-sage-light shadow-xl text-center space-y-6">
        {/* Animated Checkmark */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-50 border border-primary/20 text-primary rounded-full flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2]" />
        </div>

        <div>
          <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-[11px] sm:text-xs font-bold rounded-full uppercase tracking-wider mb-2">
            {isCod ? 'Cash on Delivery Order Placed' : (isPaid ? 'Payment Verified & Order Confirmed' : 'Order Received')}
          </span>

          <h1 className="text-xl sm:text-3xl font-black text-primary-dark">
            Your Order Has Been Placed Successfully!
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-2 max-w-md mx-auto leading-relaxed">
            Thank you for ordering with AgrivaFoods! Your 100% natural superfoods order is being carefully packed for swift dispatch.
          </p>
        </div>

        {/* COD Reassurance Notice Box */}
        {isCod && (
          <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-50/90 to-amber-50/50 border border-emerald-200/80 rounded-2xl text-left space-y-2 shadow-2xs">
            <div className="font-bold flex items-center gap-2 text-xs sm:text-sm text-emerald-950">
              <Banknote className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Cash on Delivery (COD) Instructions</span>
            </div>
            <p className="text-xs text-emerald-900 leading-relaxed">
              Our courier executive will collect <strong className="font-bold text-[#18382A]">₹{displayOrder.total}</strong> at your doorstep. You can pay via cash or scan a digital UPI QR code (Google Pay, PhonePe, Paytm) upon receiving your sealed package.
            </p>
          </div>
        )}

        {/* Order Details Card */}
        <div className="p-3.5 sm:p-5 bg-[#FBF7F3] rounded-2xl border border-sage-light text-left space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-sage-light">
            <div>
              <span className="text-[11px] text-muted font-medium block">Order Number</span>
              <span className="text-sm font-mono font-bold text-primary-dark">#{orderNum}</span>
            </div>
            <div>
              <span className="text-[11px] text-muted font-medium block">Payment Method</span>
              <span className="text-xs font-bold text-foreground">
                {isCod ? 'Cash on Delivery (COD)' : rawMethod}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-muted font-medium block">Payment Status</span>
              {isPaid ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Collected / Paid
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-100/70 px-2.5 py-0.5 rounded-full">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  Pending (Pay on Delivery)
                </span>
              )}
            </div>
          </div>

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
                  <div className="flex items-center gap-2.5">
                    <img
                      src={resolveMediaUrl(item.image)}
                      alt={item.name}
                      className="w-9 h-9 object-contain bg-white rounded-lg border border-sage-light p-0.5"
                    />
                    <div>
                      <strong className="font-semibold text-foreground block">{item.name}</strong>
                      <span className="text-[11px] text-muted">Variant: {item.weight} × {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-bold text-foreground">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Summary */}
          <div className="pt-3 border-t border-sage-light space-y-1.5 text-xs">
            <div className="flex justify-between text-muted">
              <span>Subtotal:</span>
              <span className="font-semibold text-foreground">₹{displayOrder.subtotal}</span>
            </div>
            <div className="flex justify-between text-muted">
              <span>Shipping Delivery:</span>
              <span className="font-semibold text-foreground">
                {(displayOrder.shippingFee === 0 || displayOrder.shipping === 0) ? (
                  <span className="text-primary font-bold">FREE</span>
                ) : (
                  `₹${displayOrder.shippingFee ?? displayOrder.shipping ?? 0}`
                )}
              </span>
            </div>
            {displayOrder.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount Applied:</span>
                <span className="font-bold">-₹{displayOrder.discount}</span>
              </div>
            )}
            <div className="pt-2 border-t border-sage-light flex justify-between items-center text-sm font-bold text-primary-dark">
              <span>{isCod ? 'Total Payable on Delivery' : 'Total Due'}</span>
              <span className="text-xl font-black">₹{displayOrder.total}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
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
