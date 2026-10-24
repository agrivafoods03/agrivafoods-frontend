// Central API Service connecting AgrivaFoods Frontend to Backend REST API
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  getAdminToken() {
    return localStorage.getItem('agriva_admin_token') || localStorage.getItem('agriva_token') || '';
  }

  getUserToken() {
    return localStorage.getItem('agriva_token') || '';
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    // Auto-attach admin token if calling admin endpoints
    if (endpoint?.startsWith('/admin') || options?.requiresAdmin) {
      const token = this.getAdminToken();
      if (token) headers['Authorization'] = `Bearer ${token}`;
    } else {
      const token = this.getUserToken();
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const error = new Error(data?.message || `Request failed with status ${response.status}`);
        error.status = response.status;
        error.errors = data?.errors || [];
        throw error;
      }

      return data;
    } catch (err) {
      throw err;
    }
  }

  // File Upload Helper
  async uploadFile(endpoint, formData) {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getAdminToken();
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'File upload failed');
    }
    return data;
  }
}

export const api = new ApiClient(API_BASE);

// --- Public Endpoints ---
export const publicApi = {
  getProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.request(`/products${query ? `?${query}` : ''}`);
  },
  getProductBySlug: (slug) => api.request(`/products/slug/${slug}`),
  getProductById: (id) => api.request(`/products/${id}`),
  getCategories: () => api.request('/categories'),
  getHomepage: () => api.request('/homepage'),
  getReviews: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.request(`/reviews${query ? `?${query}` : ''}`);
  },
  submitReview: (data) => api.request('/reviews', { method: 'POST', body: JSON.stringify(data) }),
  upvoteReview: (id) => api.request(`/reviews/${id}/upvote`, { method: 'POST' }),
  submitContact: (data) => api.request('/contact', { method: 'POST', body: JSON.stringify(data) }),
  subscribeNewsletter: (email) => api.request('/newsletter/subscribe', { method: 'POST', body: JSON.stringify({ email }) }),
  validateCoupon: (code, subtotal) => api.request('/coupons/validate', { method: 'POST', body: JSON.stringify({ code, subtotal }) }),
  placeOrder: (orderData) => api.request('/orders', { method: 'POST', body: JSON.stringify(orderData) }),
  trackOrder: (orderNumber) => api.request(`/orders/track/${orderNumber}`),
  getPaymentConfig: () => api.request('/payment/config'),
  createPaymentOrder: (orderData) => api.request('/payment/create-order', { method: 'POST', body: JSON.stringify(orderData) }),
  verifyPayment: (verifyData) => api.request('/payment/verify', { method: 'POST', body: JSON.stringify(verifyData) })
};

// --- Admin Endpoints ---
export const adminApi = {
  // Auth
  login: (email, password) => api.request('/admin/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  logout: () => api.request('/admin/auth/logout', { method: 'POST' }),
  getMe: () => api.request('/admin/auth/me'),
  forgotPassword: (email) => api.request('/admin/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  verifyOtp: (email, otp) => api.request('/admin/auth/verify-otp', { method: 'POST', body: JSON.stringify({ email, otp }) }),
  resetPassword: (email, resetToken, newPassword, confirmPassword) => api.request('/admin/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ email, resetToken, newPassword, confirmPassword })
  }),

  // Dashboard Overview
  getDashboardStats: () => api.request('/admin/dashboard'),

  // Products
  getProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.request(`/admin/products${query ? `?${query}` : ''}`);
  },
  getProductById: (id) => api.request(`/admin/products/${id}`),
  createProduct: (data) => api.request('/admin/products', { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (id, data) => api.request(`/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProduct: (id) => api.request(`/admin/products/${id}`, { method: 'DELETE' }),
  togglePublish: (id) => api.request(`/admin/products/${id}/toggle-publish`, { method: 'PATCH' }),
  toggleFeatured: (id) => api.request(`/admin/products/${id}/featured`, { method: 'PATCH' }),

  // Inventory
  getInventory: () => api.request('/admin/inventory'),
  updateVariantStock: (productId, sku, data) => api.request(`/admin/inventory/${productId}/variant/${sku}`, { method: 'PATCH', body: JSON.stringify(data) }),

  // Categories
  getCategories: () => api.request('/admin/categories'),
  createCategory: (data) => api.request('/admin/categories', { method: 'POST', body: JSON.stringify(data) }),
  updateCategory: (id, data) => api.request(`/admin/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCategory: (id) => api.request(`/admin/categories/${id}`, { method: 'DELETE' }),

  // Media & Images
  getMedia: () => api.request('/admin/media'),
  uploadImages: (formData) => api.uploadFile('/admin/media/upload', formData),
  deleteMedia: (filename) => api.request(`/admin/media/${filename}`, { method: 'DELETE' }),

  // Reviews Moderation
  getReviews: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.request(`/admin/reviews${query ? `?${query}` : ''}`);
  },
  updateReviewStatus: (id, status) => api.request(`/admin/reviews/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  deleteReview: (id) => api.request(`/admin/reviews/${id}`, { method: 'DELETE' }),

  // Homepage
  getHomepage: () => api.request('/admin/homepage'),
  updateHomepage: (data) => api.request('/admin/homepage', { method: 'PUT', body: JSON.stringify(data) }),

  // Orders
  getOrders: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.request(`/admin/orders${query ? `?${query}` : ''}`);
  },
  updateOrderStatus: (id, data) => api.request(`/admin/orders/${id}/status`, { method: 'PUT', body: JSON.stringify(data) })
};
