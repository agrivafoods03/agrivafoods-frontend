import { publicApi } from './api';

const ORDERS_KEY = 'Agriva_placed_orders';

export const orderService = {
  getOrders() {
    try {
      const stored = localStorage.getItem(ORDERS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  savePlacedOrder(order) {
    try {
      const stored = localStorage.getItem(ORDERS_KEY);
      const orders = stored ? JSON.parse(stored) : [];
      orders.unshift(order);
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders.slice(0, 50)));
    } catch (e) {
      console.warn('Could not persist order to local storage cache:', e);
    }
  },

  async createRazorpayOrder() {
    throw new Error('Online payments are temporarily disabled. AgrivaFoods accepts Cash on Delivery (COD) only.');
  },

  async verifyPayment() {
    throw new Error('Online payment verification is disabled in Cash on Delivery mode.');
  },

  async createOrder(orderPayload) {
    const res = await publicApi.placeOrder({
      ...orderPayload,
      paymentMethod: 'COD'
    });
    const savedOrder = res?.data?.order || res?.data || res;
    if (savedOrder) {
      this.savePlacedOrder(savedOrder);
    }
    return savedOrder;
  },

  async trackOrder(orderNumber) {
    const res = await publicApi.trackOrder(orderNumber);
    return res.data;
  }
};
