import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../services/api';
import {
  Package,
  Layers,
  Star,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Plus,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  DollarSign
} from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.getDashboardStats();
      if (res?.data) {
        setStats(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#009447] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-gray-500">Loading store analytics...</p>
        </div>
      </div>
    );
  }

  const overview = stats?.overview || {};
  const recentProducts = stats?.recentProducts || [];
  const recentOrders = stats?.recentOrders || [];

  return (
    <div className="space-y-6">
      {/* Title & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#18382A]">Store Overview</h1>
          <p className="text-xs sm:text-sm text-gray-500">Real-time metrics, product availability, and inventory health</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchStats}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
          <Link
            to="/admin/products/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#009447] hover:bg-[#007A3B] rounded-xl transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
          {error}
        </div>
      )}

      {/* Primary KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Products Card */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Products</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#009447] flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#18382A]">{overview.totalProducts || 0}</div>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className="text-emerald-700 font-medium">{overview.activeProducts || 0} Active</span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-500">{overview.outOfStockProducts || 0} Out of stock</span>
          </div>
        </div>

        {/* Inventory Alerts Card */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Stock Alerts</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#18382A]">{overview.lowStockProducts || 0}</div>
          <div className="mt-2 text-xs text-amber-700 font-medium">
            Variants with stock &le; 10 units
          </div>
        </div>

        {/* Reviews & Ratings Card */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Customer Reviews</span>
            <div className="w-9 h-9 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center">
              <Star className="w-5 h-5 fill-yellow-500" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#18382A]">{overview.avgRating || '5.0'}</span>
            <span className="text-xs text-yellow-600 font-bold">★ Rating</span>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Across {overview.totalReviews || 0} approved reviews
          </div>
        </div>

        {/* Revenue Card */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Sales</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#18382A]">₹{overview.totalRevenue?.toLocaleString('en-IN') || 0}</div>
          <div className="mt-2 text-xs text-gray-500">
            From {overview.totalOrders || 0} customer orders
          </div>
        </div>
      </div>

      {/* Grid: Recent Products & Quick Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Table Preview */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-[#18382A]">Recent Products</h2>
              <p className="text-xs text-gray-500">Latest active products in your catalog</p>
            </div>
            <Link
              to="/admin/products"
              className="text-xs font-semibold text-[#009447] hover:underline flex items-center gap-1"
            >
              <span>Manage All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 uppercase text-[10px] tracking-wider">
                  <th className="pb-2.5">Product</th>
                  <th className="pb-2.5">Category</th>
                  <th className="pb-2.5">Price</th>
                  <th className="pb-2.5">Status</th>
                  <th className="pb-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentProducts.map((p) => {
                  const defaultVariant = p.variants?.[0];
                  return (
                    <tr key={p._id || p.id} className="hover:bg-gray-50/70 transition">
                      <td className="py-3 pr-2">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images?.[0] || '/assets/moringa-packaging.png'}
                            alt={p.name}
                            className="w-9 h-9 rounded-lg object-contain bg-gray-50 border border-gray-100"
                          />
                          <div>
                            <div className="font-semibold text-[#18382A]">{p.name}</div>
                            <div className="text-[11px] text-gray-400">{p.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-gray-600">{p.category}</td>
                      <td className="py-3 font-semibold text-[#18382A]">
                        ₹{defaultVariant?.price || 0}
                      </td>
                      <td className="py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          p.status === 'published' || p.isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {p.status || (p.isActive ? 'published' : 'draft')}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          to={`/admin/products/${p._id || p.id}/edit`}
                          className="px-2.5 py-1 text-[11px] font-semibold text-[#009447] hover:bg-emerald-50 rounded-lg transition"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions & Storefront Links */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <h2 className="text-base font-bold text-[#18382A] mb-3">Quick Actions</h2>
            <div className="space-y-2">
              <Link
                to="/admin/products/new"
                className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-[#009447] hover:bg-emerald-50/40 transition group text-xs font-semibold text-[#18382A]"
              >
                <div className="flex items-center gap-2.5">
                  <Package className="w-4 h-4 text-[#009447]" />
                  <span>Create New Product</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#009447] transition" />
              </Link>

              <Link
                to="/admin/homepage"
                className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-[#009447] hover:bg-emerald-50/40 transition group text-xs font-semibold text-[#18382A]"
              >
                <div className="flex items-center gap-2.5">
                  <TrendingUp className="w-4 h-4 text-[#009447]" />
                  <span>Update Featured Product</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#009447] transition" />
              </Link>

              <Link
                to="/admin/inventory"
                className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-[#009447] hover:bg-emerald-50/40 transition group text-xs font-semibold text-[#18382A]"
              >
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>Adjust Stock Levels</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#009447] transition" />
              </Link>

              <Link
                to="/admin/reviews"
                className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-[#009447] hover:bg-emerald-50/40 transition group text-xs font-semibold text-[#18382A]"
              >
                <div className="flex items-center gap-2.5">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>Moderate Reviews</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#009447] transition" />
              </Link>
            </div>
          </div>

          {/* System Health Status */}
          <div className="bg-[#122A1F] text-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#86D39D] mb-1">
              <CheckCircle2 className="w-4 h-4 text-[#009447]" />
              <span>AgrivaFoods Live Engine</span>
            </div>
            <p className="text-xs text-gray-300 mt-1">
              Storefront and Admin Panel synchronized directly through MongoDB REST APIs.
            </p>
            <div className="mt-4 pt-3 border-t border-[#214736] flex items-center justify-between text-[11px] text-[#B4C9BE]">
              <span>Port: 5000 / 5173</span>
              <span className="text-[#86D39D] font-mono">v1.0.0 Production</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
