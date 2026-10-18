import React from 'react';
import { useCart } from '../../context/CartContext';
import { Truck, CheckCircle2 } from 'lucide-react';

export const FreeShippingBar = ({ className = '' }) => {
  const { subtotal, isFreeShipping, freeShippingThreshold, amountToFreeShipping, freeShippingProgress } = useCart();

  return (
    <div className={`p-3.5 bg-white rounded-xl border border-sage-light ${className}`}>
      <div className="flex items-center justify-between text-xs font-medium mb-1.5">
        <span className="flex items-center gap-1.5 text-foreground">
          {isFreeShipping ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span className="font-semibold text-primary">You unlocked Free Standard Shipping!</span>
            </>
          ) : (
            <>
              <Truck className="w-4 h-4 text-primary" />
              <span>
                Add <strong className="text-primary font-bold">₹{amountToFreeShipping}</strong> more for <strong className="font-bold">Free Shipping</strong>
              </span>
            </>
          )}
        </span>
        <span className="text-muted font-semibold">{freeShippingProgress}%</span>
      </div>

      {/* Progress Bar Track */}
      <div className="w-full h-2 bg-[#DCE2C8]/60 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#009447] to-[#78A603] rounded-full transition-all duration-300"
          style={{ width: `${freeShippingProgress}%` }}
        />
      </div>
    </div>
  );
};
