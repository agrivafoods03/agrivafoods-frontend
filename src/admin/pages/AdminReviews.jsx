import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import { Star, CheckCircle, XCircle, Trash2, Filter, AlertCircle, ThumbsUp } from 'lucide-react';

export const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [productFilter, setProductFilter] = useState('All');
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (productFilter !== 'All') params.productName = productFilter;
      const res = await adminApi.getReviews(params);
      setReviews(res?.data || []);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [statusFilter, productFilter]);

  const handleStatusChange = async (id, status) => {
    setActionLoading(true);
    try {
      await adminApi.updateReviewStatus(id, status);
      await fetchReviews();
    } catch (err) {
      alert(err.message || 'Failed to update review status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review permanently?')) return;
    try {
      await adminApi.deleteReview(id);
      await fetchReviews();
    } catch (err) {
      alert(err.message || 'Failed to delete review');
    }
  };

  const productOptions = ['All', 'AgrivaFoods Moringa Powder', 'AgrivaFoods Beetroot Powder', 'AgrivaFoods Amla Powder'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#18382A]">Customer Reviews & Ratings</h1>
        <p className="text-xs sm:text-sm text-gray-500">Moderate customer submissions, approve feedback, and recalculate ratings</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs font-semibold text-gray-600">Product:</label>
          <select
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#009447]"
          >
            {productOptions.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs font-semibold text-gray-600">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#009447]"
          >
            <option value="all">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending Moderation</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
          {errorMsg}
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-3">
        {loading ? (
          <div className="bg-white p-12 text-center text-xs text-gray-400 rounded-2xl border">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="bg-white p-12 text-center text-gray-400 rounded-2xl border">
            <Star className="w-10 h-10 mx-auto mb-2 text-gray-300" />
            <p className="text-xs">No customer reviews found matching criteria.</p>
          </div>
        ) : (
          reviews.map((rev) => {
            const id = rev._id || rev.id;
            return (
              <div key={id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#18382A]">{rev.name}</span>
                    <span className="text-[11px] text-gray-400">• {rev.location || 'India'}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                      rev.status === 'approved' ? 'bg-emerald-50 text-emerald-700' :
                      rev.status === 'pending' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {rev.status || 'approved'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400' : 'text-gray-200'}`}
                      />
                    ))}
                    <span className="text-xs font-bold text-gray-700 ml-1.5">{rev.title}</span>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed pt-1">{rev.comment}</p>

                  <div className="text-[11px] text-gray-400 pt-2 flex items-center gap-3">
                    <span className="font-medium text-[#009447]">{rev.productName}</span>
                    <span>• {new Date(rev.createdAt || Date.now()).toLocaleDateString()}</span>
                    <span>• Helpful: {rev.helpfulCount || 0}</span>
                  </div>
                </div>

                {/* Moderation Controls */}
                <div className="flex items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0">
                  {rev.status !== 'approved' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(id, 'approved')}
                      disabled={actionLoading}
                      className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-semibold flex items-center gap-1 transition"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                  )}

                  {rev.status !== 'rejected' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(id, 'rejected')}
                      disabled={actionLoading}
                      className="px-3 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-xl text-xs font-semibold flex items-center gap-1 transition"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDelete(id)}
                    className="p-2 text-gray-400 hover:text-red-500 rounded-xl transition"
                    title="Delete review"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
