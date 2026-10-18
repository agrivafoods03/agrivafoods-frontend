import { publicApi } from './api';

const formatProduct = (p) => {
  if (!p) return null;
  return {
    ...p,
    id: p._id || p.id,
    images: Array.isArray(p.images) && p.images.length > 0 ? p.images : [],
    variants: (p.variants || []).map((v, idx) => ({
      ...v,
      id: v._id || v.sku || `var_${idx}`,
      price: Number(v.price),
      originalPrice: Number(v.originalPrice || v.price),
      stock: Number(v.stock || 0)
    }))
  };
};

export const productService = {
  async getProducts(params = {}) {
    try {
      const res = await publicApi.getProducts(params);
      if (res?.data && Array.isArray(res.data)) {
        return res.data
          .filter((p) => p.status === 'published' && p.isActive !== false)
          .map(formatProduct);
      }
      return [];
    } catch (err) {
      console.warn('[productService] Backend fetch failed:', err.message);
      return [];
    }
  },

  async getProductBySlug(slug) {
    if (!slug) throw new Error('Product slug is required');
    try {
      const res = await publicApi.getProductBySlug(slug);
      if (res?.data) {
        if (res.data.status !== 'published' || res.data.isActive === false) {
          throw new Error(`Product '${slug}' is currently unavailable`);
        }
        return formatProduct(res.data);
      }
      throw new Error(`Product '${slug}' not found`);
    } catch (err) {
      console.warn(`[productService] Error fetching product '${slug}':`, err.message);
      throw err;
    }
  },

  async getProductById(id) {
    if (!id) throw new Error('Product ID is required');
    try {
      const res = await publicApi.getProductById(id);
      if (res?.data) {
        if (res.data.status !== 'published' || res.data.isActive === false) {
          throw new Error('Product is currently unavailable');
        }
        return formatProduct(res.data);
      }
    } catch (err) {
      // Fallback to active products search
    }
    const products = await this.getProducts();
    const product = products.find((p) => (p.id === id || p._id === id || String(p.id) === String(id)));
    if (!product) throw new Error('Product not found');
    return product;
  },

  async getFeaturedProducts() {
    const products = await this.getProducts({ featured: true });
    return products.filter((p) => p.featured);
  }
};
