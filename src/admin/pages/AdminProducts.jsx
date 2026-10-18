import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminApi } from '../../services/api';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Star,
  Check,
  X,
  Eye,
  RefreshCw,
  AlertCircle,
  MoreVertical,
  CheckCircle2
} from 'lucide-react';

export const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteModal, setDeleteModal] = useState({ open: false, product: null });
  const [actionLoading, setActionLoading] = useState(false);

  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (search) params.search = search;
      if (category !== 'All') params.category = category;
      if (statusFilter !== 'all') params.status = statusFilter;

      const res = await adminApi.getProducts(params);
      setProducts(res?.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, category, statusFilter]);

  const handleTogglePublish = async (id) => {
    setActionLoading(true);
    try {
      await adminApi.togglePublish(id);
      await fetchProducts();
    } catch (err) {
      alert(err.message || 'Failed to update publish state');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleFeatured = async (id) => {
    setActionLoading(true);
    try {
      await adminApi.toggleFeatured(id);
      await fetchProducts();
    } catch (err) {
      alert(err.message || 'Failed to update featured state');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.product) return;
    setActionLoading(true);
    try {
      await adminApi.deleteProduct(deleteModal.product._id || deleteModal.product.id);
      setDeleteModal({ open: false, product: null });
      await fetchProducts();
    } catch (err) {
      alert(err.message || 'Failed to delete product');
    } finally {
      setActionLoading(false);
    }
  };

  const categories = ['All', 'Superfood Powders', 'Single-Ingredient Powders', 'Wellness Essentials'];

  return (
    <div className="space-y-6">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#18382A]">Product Catalog</h1>
          <p className="text-xs sm:text-sm text-gray-500">Manage all superfood powders, pricing, weights, and availability</p>
        </div>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-[#009447] hover:bg-[#007A3B] rounded-xl transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, slug, or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-xs sm:text-sm outline-none focus:border-[#009447] focus:ring-1 focus:ring-[#009447] transition"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full md:w-auto px-3 py-2 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-700 outline-none focus:border-[#009447]"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-auto px-3 py-2 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-700 outline-none focus:border-[#009447]"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
          {error}
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-3 border-[#009447] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-gray-500">Loading product listings...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <h3 className="text-sm font-semibold text-gray-700">No products found</h3>
            <p className="text-xs text-gray-500 mt-1">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/70 border-b border-gray-200 text-gray-500 uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Product Details</th>
                  <th className="py-3.5 px-3">Category</th>
                  <th className="py-3.5 px-3">Price & Weights</th>
                  <th className="py-3.5 px-3">Inventory</th>
                  <th className="py-3.5 px-3 text-center">Featured</th>
                  <th className="py-3.5 px-3 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => {
                  const id = product._id || product.id;
                  const variants = product.variants || [];
                  const defaultVariant = variants[0];
                  const totalStock = variants.reduce((sum, v) => sum + (v.stock || 0), 0);
                  const isPublished = product.status === 'published' || (product.isActive && product.status !== 'draft');

                  return (
                    <tr key={id} className="hover:bg-gray-50/80 transition">
                      {/* Product Thumbnail & Title */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.images?.[0] || '/assets/moringa-packaging.png'}
                            alt={product.name}
                            className="w-12 h-12 rounded-xl object-contain bg-gray-50 border border-gray-100 flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="font-bold text-sm text-[#18382A] truncate hover:text-[#009447] cursor-pointer" onClick={() => navigate(`/admin/products/${id}/edit`)}>
                              {product.name}
                            </div>
                            <div className="text-[11px] text-gray-400 font-mono mt-0.5">
                              slug: {product.slug}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-3 text-gray-600 font-medium">
                        {product.category}
                      </td>

                      {/* Price & Weights */}
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-[#18382A]">
                          ₹{defaultVariant?.price || 0}
                          {defaultVariant?.originalPrice > defaultVariant?.price && (
                            <span className="text-[11px] text-gray-400 line-through ml-1.5 font-normal">
                              ₹{defaultVariant.originalPrice}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-gray-400 mt-0.5">
                          {variants.map(v => v.weight).join(', ')}
                        </div>
                      </td>

                      {/* Stock */}
                      <td className="py-3.5 px-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          totalStock > 10
                            ? 'bg-emerald-50 text-emerald-700'
                            : totalStock > 0
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-red-50 text-red-700'
                        }`}>
                          {totalStock > 0 ? `${totalStock} in stock` : 'Out of stock'}
                        </span>
                      </td>

                      {/* Featured Toggle */}
                      <td className="py-3.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(id)}
                          className={`p-1.5 rounded-lg transition ${
                            product.featured ? 'text-amber-500 hover:bg-amber-50' : 'text-gray-300 hover:text-amber-400'
                          }`}
                          title="Toggle homepage featured"
                        >
                          <Star className={`w-4 h-4 ${product.featured ? 'fill-amber-400' : ''}`} />
                        </button>
                      </td>

                      {/* Publish Status Toggle */}
                      <td className="py-3.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition ${
                            isPublished
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                          }`}
                        >
                          {isPublished ? 'Published' : 'Draft'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/products/${product.slug}`}
                            target="_blank"
                            className="p-1.5 text-gray-400 hover:text-[#009447] hover:bg-emerald-50 rounded-lg transition"
                            title="Preview on live site"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/admin/products/${id}/edit`}
                            className="p-1.5 text-gray-500 hover:text-[#009447] hover:bg-emerald-50 rounded-lg transition"
                            title="Edit Product"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setDeleteModal({ open: true, product })}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Archive / Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-xl">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Archive Product?</h3>
              <p className="text-xs text-gray-500 mt-1">
                Are you sure you want to remove <span className="font-semibold text-gray-700">{deleteModal.product?.name}</span>? Existing order history will be preserved.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModal({ open: false, product: null })}
                className="flex-1 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={actionLoading}
                className="flex-1 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition disabled:opacity-50"
              >
                {actionLoading ? 'Archiving...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
