import React, { useState, useEffect } from 'react';
import { reviewService } from '../../services/reviewService';
import { useToast } from '../../context/ToastContext';
import { Star, ThumbsUp, CheckCircle2, MessageSquarePlus, Sparkles } from 'lucide-react';

export const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [helpfulMap, setHelpfulMap] = useState({});
  const { showToast } = useToast();

  const [form, setForm] = useState({
    name: '',
    location: '',
    productName: 'AgrivaFoods Moringa Powder',
    rating: 5,
    title: '',
    comment: ''
  });

  useEffect(() => {
    setReviews(reviewService.getReviews());
  }, []);

  const handleHelpful = (id) => {
    if (helpfulMap[id]) return;
    setHelpfulMap((prev) => ({ ...prev, [id]: true }));
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, helpfulCount: (r.helpfulCount || 0) + 1 } : r))
    );
    showToast('Thank you for your feedback!', 'success');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.title.trim() || !form.comment.trim()) {
      showToast('Please fill in all review fields.', 'error');
      return;
    }

    const newRev = await reviewService.submitReview({
      ...form,
      verified: true
    });

    setReviews([newRev, ...reviews]);
    setShowForm(false);
    setForm({
      name: '',
      location: '',
      productName: 'AgrivaFoods Moringa Powder',
      rating: 5,
      title: '',
      comment: ''
    });
    showToast('Thank you! Your review has been submitted.', 'success');
  };

  const averageRating = (
    reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1)
  ).toFixed(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold text-primary uppercase tracking-widest">
          Community Feedback
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-primary-dark mt-1">
          Customer Reviews & Experiences
        </h1>
        <p className="text-xs sm:text-sm text-muted mt-2 leading-relaxed">
          Read genuine impressions from individuals who have integrated AgrivaFoods Moringa, Beetroot, and Amla powders into their daily regimens.
        </p>
      </div>

      {/* Ratings Overview Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-sage-light shadow-premium grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        {/* Score */}
        <div className="text-center md:border-r border-sage-light md:pr-8">
          <span className="text-5xl font-black text-primary-dark">{averageRating}</span>
          <div className="flex justify-center text-amber-400 my-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-amber-400 stroke-amber-400" />
            ))}
          </div>
          <span className="text-xs text-muted font-medium">
            Based on {reviews.length} customer reviews
          </span>
        </div>

        {/* Rating Breakdown */}
        <div className="space-y-1.5 md:col-span-1">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = reviews.filter((r) => r.rating === stars).length;
            const percentage = Math.round((count / (reviews.length || 1)) * 100);

            return (
              <div key={stars} className="flex items-center gap-2 text-xs">
                <span className="w-8 font-semibold text-foreground text-right">{stars}★</span>
                <div className="flex-1 h-2 bg-sage-light/60 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-8 text-[11px] text-muted text-right">{percentage}%</span>
              </div>
            );
          })}
        </div>

        {/* CTA to Write Review */}
        <div className="text-center md:pl-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-full sm:w-auto px-6 py-3 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mx-auto"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Write a Review</span>
          </button>
          <span className="text-[10px] text-muted block mt-2">
            Share your experience with fellow wellness seekers
          </span>
        </div>
      </div>

      {/* Review Submission Form (Expandable) */}
      {showForm && (
        <div className="bg-[#FBF7F3] rounded-3xl p-6 sm:p-8 border border-sage-light shadow-md animate-fade-in max-w-2xl mx-auto">
          <h3 className="text-lg font-bold text-primary-dark mb-1">Write Your Review</h3>
          <p className="text-xs text-muted mb-4">Share your feedback about the product taste, potency, and benefits.</p>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Your Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Ramesh K."
                  className="w-full px-3.5 py-2.5 bg-white border border-sage-light rounded-xl text-xs text-foreground focus:outline-none focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">City / Location</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="e.g. Pune, Maharashtra"
                  className="w-full px-3.5 py-2.5 bg-white border border-sage-light rounded-xl text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Product Reviewed</label>
                <select
                  value={form.productName}
                  onChange={(e) => setForm({ ...form, productName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-sage-light rounded-xl text-xs text-foreground focus:outline-none focus:border-primary cursor-pointer"
                >
                  <option value="AgrivaFoods Moringa Powder">AgrivaFoods Moringa Powder</option>
                  <option value="AgrivaFoods Beetroot Powder">AgrivaFoods Beetroot Powder</option>
                  <option value="AgrivaFoods Amla Powder">AgrivaFoods Amla Powder</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Star Rating</label>
                <select
                  value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-white border border-sage-light rounded-xl text-xs text-foreground focus:outline-none focus:border-primary cursor-pointer"
                >
                  <option value="5">5 Stars – Excellent Purity</option>
                  <option value="4">4 Stars – Very Good</option>
                  <option value="3">3 Stars – Satisfactory</option>
                  <option value="2">2 Stars – Average</option>
                  <option value="1">1 Star – Poor</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Review Headline *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Pure color, noticeable energy in morning"
                className="w-full px-3.5 py-2.5 bg-white border border-sage-light rounded-xl text-xs text-foreground focus:outline-none focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Your Detailed Experience *</label>
              <textarea
                rows="3"
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                placeholder="How did you mix the powder? What changes have you observed?"
                className="w-full px-3.5 py-2.5 bg-white border border-sage-light rounded-xl text-xs text-foreground focus:outline-none focus:border-primary"
                required
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark transition-colors"
              >
                Submit Review
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2.5 bg-white border border-sage-light text-foreground text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Review List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white rounded-2xl p-6 border border-sage-light shadow-premium flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                  ))}
                </div>
                <span className="text-[11px] text-muted">{rev.date}</span>
              </div>

              <span className="text-[11px] font-bold text-primary block mb-1">
                {rev.productName}
              </span>
              <h4 className="text-sm font-bold text-foreground mb-2 leading-snug">
                "{rev.title}"
              </h4>
              <p className="text-xs text-muted leading-relaxed mb-4">{rev.comment}</p>
            </div>

            <div className="pt-3 border-t border-sage-light/60 flex items-center justify-between">
              <div>
                <span className="block text-xs font-bold text-foreground">{rev.name}</span>
                {rev.location && <span className="text-[10px] text-muted">{rev.location}</span>}
                {rev.verified && (
                  <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full mt-0.5">
                    <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                  </span>
                )}
              </div>

              {/* Helpful Button */}
              <button
                onClick={() => handleHelpful(rev.id)}
                disabled={helpfulMap[rev.id]}
                className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                  helpfulMap[rev.id]
                    ? 'bg-primary/10 text-primary border-primary/20'
                    : 'bg-[#FBF7F3] border-sage-light text-muted hover:text-foreground'
                }`}
                title="Mark this review as helpful"
              >
                <ThumbsUp className="w-3 h-3" />
                <span>{rev.helpfulCount || 0}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
