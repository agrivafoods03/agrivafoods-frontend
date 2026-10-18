const CART_KEY = 'Agriva_cart_items';

export const cartService = {
  getCart() {
    try {
      const items = localStorage.getItem(CART_KEY);
      return items ? JSON.parse(items) : [];
    } catch {
      return [];
    }
  },

  saveCart(items) {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Error saving cart to localStorage', e);
    }
  },

  clearCart() {
    localStorage.removeItem(CART_KEY);
  }
};
