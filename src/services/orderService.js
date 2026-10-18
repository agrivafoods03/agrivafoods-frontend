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

  async createRazorpayOrder(orderPayload) {
    const res = await publicApi.createPaymentOrder(orderPayload);
    return res.data;
  },

  async verifyPayment(verificationPayload) {
    const res = await publicApi.verifyPayment(verificationPayload);
    if (res?.data) {
      this.savePlacedOrder(res.data);
    }
    return res.data;
  },

  async createOrder(orderPayload) {
    const res = await publicApi.createPaymentOrder({
      ...orderPayload,
      paymentMethod: orderPayload.paymentMethod || 'COD'
    });
    const savedOrder = res?.data?.order || res?.data;
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
