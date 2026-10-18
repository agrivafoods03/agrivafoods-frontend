import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { cartService } from '../services/cartService';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => cartService.getCart());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { showToast } = useToast();

  const FREE_SHIPPING_THRESHOLD = 499;
  const STANDARD_SHIPPING_FEE = 49;

  // Persist to localStorage on change
  useEffect(() => {
    cartService.saveCart(items);
  }, [items]);

  const addToCart = (product, variant, quantity = 1, openDrawer = true) => {
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.productId === product.id && item.variantId === variant.id
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevItems,
          {
            productId: product.id,
            variantId: variant.id,
            name: product.name,
            weight: variant.weight,
            price: variant.price,
            originalPrice: variant.originalPrice || variant.price,
            image: product.images[0],
            sku: variant.sku,
            quantity: quantity,
            productSlug: product.slug
          }
        ];
      }
    });

    showToast(`Added ${product.name} (${variant.weight}) to your cart!`, 'success');

    if (openDrawer) {
      setIsCartOpen(true);
    }
  };

  const removeFromCart = (variantId) => {
    setItems((prevItems) => {
      const removedItem = prevItems.find((i) => i.variantId === variantId);
      if (removedItem) {
        showToast(`Removed ${removedItem.name} from cart`, 'info');
      }
      return prevItems.filter((item) => item.variantId !== variantId);
    });
  };

  const updateQuantity = (variantId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(variantId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.variantId === variantId ? { ...item, quantity: Math.min(10, quantity) } : item
      )
    );
  };

  const updateVariant = (oldVariantId, newVariant, product) => {
    setItems((prevItems) => {
      const currentItem = prevItems.find((item) => item.variantId === oldVariantId);
      if (!currentItem) return prevItems;

      const filtered = prevItems.filter((item) => item.variantId !== oldVariantId);
      const existingNewVariant = filtered.find(
        (item) => item.productId === product.id && item.variantId === newVariant.id
      );

      if (existingNewVariant) {
        existingNewVariant.quantity += currentItem.quantity;
        return [...filtered];
      }

      return [
        ...filtered,
        {
          ...currentItem,
          variantId: newVariant.id,
          weight: newVariant.weight,
          price: newVariant.price,
          originalPrice: newVariant.originalPrice || newVariant.price,
          sku: newVariant.sku
        }
      ];
    });

    showToast(`Updated weight to ${newVariant.weight}`, 'success');
  };

  const clearCart = () => {
    setItems([]);
    cartService.clearCart();
  };

  // Calculations
  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const totalOriginalPrice = useMemo(() => {
    return items.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0);
  }, [items]);

  const totalDiscount = useMemo(() => {
    return Math.max(0, totalOriginalPrice - subtotal);
  }, [totalOriginalPrice, subtotal]);

  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || items.length === 0;
  const shippingFee = items.length === 0 ? 0 : (isFreeShipping ? 0 : STANDARD_SHIPPING_FEE);
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  const total = subtotal + shippingFee;
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateVariant,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        subtotal,
        totalOriginalPrice,
        totalDiscount,
        shippingFee,
        isFreeShipping,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        amountToFreeShipping,
        freeShippingProgress,
        total,
        totalItems
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
