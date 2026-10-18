import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../services/api';
import { ImageDropzone } from '../components/ImageDropzone';
import { Home, Save, Eye, CheckCircle2, AlertCircle, Image as ImageIcon, Sparkles } from 'lucide-react';

export const AdminHomepage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [products, setProducts] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [homepageData, setHomepageData] = useState({
    heroTitle: 'SUPERFOOD. NATURALLY BETTER.',
    heroSubtitle: '100% Raw, Pure Single-Ingredient Powders For Daily Vitality',
    heroBadge: '100% PURE & BOTANICAL',
    heroCtaText: 'Shop Pure Powders',
    heroCtaLink: '/products',
    featuredProductSlug: '',
    heroImage: '/assets/moringa-packaging.png',
    announcementText: 'FREE Express Delivery on all orders above ₹499 • 100% Pure & Lab Tested',
    showFeaturedSection: true,
    showTrustBadges: true,
    showWhyChoose: true,
    showReviews: true,
    showFaq: true
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [hpRes, prodRes] = await Promise.all([
        adminApi.getHomepage(),
        adminApi.getProducts()
      ]);
      if (hpRes?.data) setHomepageData(prev => ({ ...prev, ...hpRes.data }));
      if (prodRes?.data) setProducts(prodRes.data);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to load homepage configuration');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await adminApi.updateHomepage(homepageData);
      setSuccessMsg('Homepage content updated successfully! Public storefront updated.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update homepage');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-gray-400">Loading homepage settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#18382A]">Homepage Content Management</h1>
          <p className="text-xs sm:text-sm text-gray-500">Customize the hero banner, featured product showcase, and section displays</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition shadow-sm"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Live Home</span>
          </Link>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#009447] hover:bg-[#007A3B] rounded-xl transition shadow-sm disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* HERO SECTION SETTINGS */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#009447]" />
            <span>Hero Header & Banners</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Hero Main Heading *</label>
              <input
                type="text"
                value={homepageData.heroTitle}
                onChange={(e) => setHomepageData({ ...homepageData, heroTitle: e.target.value })}
                className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-[#009447] font-bold text-[#18382A]"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Hero Subheading</label>
              <input
                type="text"
                value={homepageData.heroSubtitle}
                onChange={(e) => setHomepageData({ ...homepageData, heroSubtitle: e.target.value })}
                className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-[#009447]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Hero Badge Text</label>
              <input
                type="text"
                value={homepageData.heroBadge}
                onChange={(e) => setHomepageData({ ...homepageData, heroBadge: e.target.value })}
                className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-[#009447]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Top Announcement Bar Text</label>
              <input
                type="text"
                value={homepageData.announcementText}
                onChange={(e) => setHomepageData({ ...homepageData, announcementText: e.target.value })}
                className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-[#009447]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Hero Call-To-Action Button Text</label>
              <input
                type="text"
                value={homepageData.heroCtaText}
                onChange={(e) => setHomepageData({ ...homepageData, heroCtaText: e.target.value })}
                className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-[#009447]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Hero CTA Link</label>
              <input
                type="text"
                value={homepageData.heroCtaLink}
                onChange={(e) => setHomepageData({ ...homepageData, heroCtaLink: e.target.value })}
                className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-[#009447]"
              />
            </div>
          </div>
        </div>

        {/* FEATURED PRODUCT SELECTOR */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
            Featured Product Showcase
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Select Featured Product Highlighted on Homepage *
              </label>
              <select
                value={homepageData.featuredProductSlug || ''}
                onChange={(e) => setHomepageData({ ...homepageData, featuredProductSlug: e.target.value })}
                className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-[#009447]"
              >
                <option value="">-- First Published Product (Default) --</option>
                {products.map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.name} ({p.slug})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-gray-400 mt-1">
                This product will be prominently highlighted in the homepage card with its variants and buy button.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-700">Hero Product / Banner Image</label>
              <ImageDropzone
                compact={true}
                multiple={false}
                currentValue={homepageData.heroImage}
                label="Upload or drop Hero banner image"
                sublabel="Drag & drop new packaging photo or select from library"
                onUploadSuccess={(url) => setHomepageData({ ...homepageData, heroImage: url })}
              />

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={homepageData.heroImage}
                  onChange={(e) => setHomepageData({ ...homepageData, heroImage: e.target.value })}
                  placeholder="/assets/moringa-packaging.png or /uploads/..."
                  className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-xl outline-none focus:border-[#009447] bg-gray-50"
                />
                {homepageData.heroImage && (
                  <div className="h-10 w-10 bg-white border border-gray-200 rounded-lg p-0.5 flex-shrink-0 flex items-center justify-center">
                    <img src={homepageData.heroImage} alt="Hero preview" className="h-full w-full object-contain" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION VISIBILITY TOGGLES */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
            Section Display & Visibility
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={homepageData.showFeaturedSection}
                onChange={(e) => setHomepageData({ ...homepageData, showFeaturedSection: e.target.checked })}
                className="rounded text-[#009447] focus:ring-0"
              />
              <span className="text-xs font-semibold text-gray-700">Display Featured Product Section</span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={homepageData.showTrustBadges}
                onChange={(e) => setHomepageData({ ...homepageData, showTrustBadges: e.target.checked })}
                className="rounded text-[#009447] focus:ring-0"
              />
              <span className="text-xs font-semibold text-gray-700">Display 4 Trust Pillars & Badges</span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={homepageData.showWhyChoose}
                onChange={(e) => setHomepageData({ ...homepageData, showWhyChoose: e.target.checked })}
                className="rounded text-[#009447] focus:ring-0"
              />
              <span className="text-xs font-semibold text-gray-700">Display "Why Choose AgrivaFoods" Section</span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={homepageData.showReviews}
                onChange={(e) => setHomepageData({ ...homepageData, showReviews: e.target.checked })}
                className="rounded text-[#009447] focus:ring-0"
              />
              <span className="text-xs font-semibold text-gray-700">Display Customer Reviews Carousel</span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={homepageData.showFaq}
                onChange={(e) => setHomepageData({ ...homepageData, showFaq: e.target.checked })}
                className="rounded text-[#009447] focus:ring-0"
              />
              <span className="text-xs font-semibold text-gray-700">Display Frequently Asked Questions</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-6 py-2.5 min-h-[44px] bg-[#009447] hover:bg-[#007A3B] text-white text-xs font-bold rounded-xl shadow-md transition disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save & Publish Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};
