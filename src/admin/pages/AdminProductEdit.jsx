import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { adminApi } from '../../services/api';
import { ImageDropzone } from '../components/ImageDropzone';
import { resolveMediaUrl } from '../../utils/mediaUtils';
import {
  Package,
  Layers,
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Eye,
  Info,
  DollarSign,
  FileText,
  Star,
  Search,
  Upload
} from 'lucide-react';

export const AdminProductEdit = () => {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    sku: '',
    tagline: '',
    category: 'Superfood Powders',
    badge: '',
    origin: 'India',
    shelfLife: '12 Months',
    shortDescription: '',
    description: '',
    benefits: [''],
    ingredients: [''],
    usageInstructions: '',
    storageInstructions: '',
    images: [''],
    variants: [
      { weight: '100g', sku: '', price: 149, originalPrice: 199, stock: 50, isPopular: false },
      { weight: '250g', sku: '', price: 299, originalPrice: 349, stock: 100, isPopular: true },
      { weight: '500g', sku: '', price: 549, originalPrice: 649, stock: 40, isPopular: false },
      { weight: '1kg', sku: '', price: 999, originalPrice: 1199, stock: 20, isPopular: false }
    ],
    featured: false,
    status: 'published',
    seoTitle: '',
    seoDescription: ''
  });

  // Fetch existing product if editing
  useEffect(() => {
    if (!isNew) {
      adminApi.getProductById(id)
        .then((res) => {
          if (res?.data) {
            const p = res.data;
            setFormData({
              name: p.name || '',
              slug: p.slug || '',
              sku: p.sku || '',
              tagline: p.tagline || '',
              category: p.category || 'Superfood Powders',
              badge: p.badge || '',
              origin: p.origin || 'India',
              shelfLife: p.shelfLife || '12 Months',
              shortDescription: p.shortDescription || '',
              description: p.description || '',
              benefits: p.benefits?.length ? p.benefits : [''],
              ingredients: p.ingredients?.length ? p.ingredients : [''],
              usageInstructions: p.usageInstructions || '',
              storageInstructions: p.storageInstructions || '',
              images: p.images?.length ? p.images : [''],
              variants: p.variants?.length ? p.variants : [
                { weight: '100g', sku: '', price: 149, originalPrice: 199, stock: 50, isPopular: false }
              ],
              featured: !!p.featured,
              status: p.status || (p.isActive ? 'published' : 'draft'),
              seoTitle: p.seoTitle || '',
              seoDescription: p.seoDescription || ''
            });
          }
        })
        .catch((err) => {
          setErrorMsg(err.message || 'Failed to load product details');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, isNew]);

  // Auto-slug generator on title change for new products
  const handleNameChange = (name) => {
    const autoSlug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setFormData(prev => ({
      ...prev,
      name,
      slug: isNew ? autoSlug : prev.slug,
      sku: isNew && !prev.sku ? `AGR-${autoSlug.substring(0, 3).toUpperCase()}` : prev.sku
    }));
  };

  // Variant Helpers
  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [
        ...prev.variants,
        { weight: '250g', sku: `AGR-${Date.now().toString().slice(-4)}`, price: 299, originalPrice: 349, stock: 50, isPopular: false }
      ]
    }));
  };

  const removeVariant = (index) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const updateVariant = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.variants];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, variants: updated };
    });
  };

  // Array Field Helpers (Benefits, Ingredients, Images)
  const addArrayItem = (field) => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const updateArrayItem = (field, index, value) => {
    setFormData(prev => {
      const arr = [...prev[field]];
      arr[index] = value;
      return { ...prev, [field]: arr };
    });
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      setErrorMsg('Product name is required.');
      return;
    }
    if (!formData.variants.length) {
      setErrorMsg('At least one weight variant is required.');
      return;
    }

    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    // Clean payload
    const payload = {
      ...formData,
      benefits: formData.benefits.filter(b => b.trim()),
      ingredients: formData.ingredients.filter(i => i.trim()),
      images: formData.images.filter(img => img.trim()),
      isActive: formData.status === 'published'
    };

    try {
      if (isNew) {
        const res = await adminApi.createProduct(payload);
        setSuccessMsg('Product created successfully!');
        setTimeout(() => {
          navigate(`/admin/products/${res.data._id || res.data.id}/edit`);
        }, 1200);
      } else {
        await adminApi.updateProduct(id, payload);
        setSuccessMsg('Product updated successfully! Changes are live on storefront.');
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-[#009447] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs text-gray-500">Loading product...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'basic', label: '1. Basic Info', icon: Info },
    { id: 'descriptions', label: '2. Descriptions', icon: FileText },
    { id: 'variants', label: '3. Pricing & Variants', icon: DollarSign },
    { id: 'images', label: '4. Images & Gallery', icon: ImageIcon },
    { id: 'seo', label: '5. SEO Meta', icon: Search },
    { id: 'publishing', label: '6. Publishing', icon: CheckCircle2 }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="p-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-[#18382A] transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#18382A]">
              {isNew ? 'Create New Product' : `Edit: ${formData.name}`}
            </h1>
            <p className="text-xs text-gray-500">
              {isNew ? 'Add a new superfood botanical to the store' : `Managing SKU ${formData.sku || 'N/A'}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {!isNew && formData.slug && (
            <Link
              to={`/products/${formData.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition shadow-sm"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview Live</span>
            </Link>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#009447] hover:bg-[#007A3B] rounded-xl transition shadow-sm disabled:opacity-60"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isNew ? 'Create Product' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Workflow Tabs */}
      <div className="flex items-center gap-1 bg-white p-1.5 border border-gray-200 rounded-2xl overflow-x-auto no-scrollbar shadow-sm">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex-shrink-0 ${
                isActive
                  ? 'bg-[#18382A] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#86D39D]' : 'text-gray-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6">
        {/* TAB 1: BASIC INFORMATION */}
        {activeTab === 'basic' && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">Basic Product Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. AgrivaFoods Organic Moringa Powder"
                  className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-[#009447]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">URL Slug (Unique Key) *</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g. organic-moringa-powder"
                  className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-[#009447]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-[#009447]"
                >
                  <option value="Superfood Powders">Superfood Powders</option>
                  <option value="Single-Ingredient Powders">Single-Ingredient Powders</option>
                  <option value="Wellness Essentials">Wellness Essentials</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Product SKU / Code</label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  placeholder="e.g. AGR-MOR"
                  className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-[#009447]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Promotional Badge</label>
                <input
                  type="text"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  placeholder="e.g. Bestseller, 100% Pure Organic"
                  className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-[#009447]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g. All The Goodness, Naturally."
                  className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-[#009447]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Shelf Life</label>
                <input
                  type="text"
                  value={formData.shelfLife}
                  onChange={(e) => setFormData({ ...formData, shelfLife: e.target.value })}
                  placeholder="e.g. 12 Months"
                  className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-[#009447]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Country of Origin</label>
                <input
                  type="text"
                  value={formData.origin}
                  onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                  placeholder="e.g. India"
                  className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-[#009447]"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DESCRIPTIONS & INGREDIENTS */}
        {activeTab === 'descriptions' && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">Descriptions & Wellness Details</h2>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Short Description (Summary)</label>
              <textarea
                rows={2}
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                placeholder="Brief 1-2 sentence highlight shown in cards"
                className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-[#009447]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Full Detailed Description *</label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Comprehensive description of botanical sourcing, raw benefits, and nutritional values..."
                className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-[#009447]"
                required
              />
            </div>

            {/* Benefits Bullet Points */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-gray-700">Key Health Benefits</label>
                <button
                  type="button"
                  onClick={() => addArrayItem('benefits')}
                  className="text-xs text-[#009447] font-semibold hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Benefit</span>
                </button>
              </div>
              <div className="space-y-2">
                {formData.benefits.map((b, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={b}
                      onChange={(e) => updateArrayItem('benefits', i, e.target.value)}
                      placeholder="e.g. Fortifies cellular defenses with Vitamin C and iron"
                      className="flex-1 px-3 py-1.5 text-xs border border-gray-200 rounded-xl outline-none focus:border-[#009447]"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('benefits', i)}
                      className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Ingredients */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-gray-700">Ingredients (100% Pure)</label>
                <button
                  type="button"
                  onClick={() => addArrayItem('ingredients')}
                  className="text-xs text-[#009447] font-semibold hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Ingredient</span>
                </button>
              </div>
              <div className="space-y-2">
                {formData.ingredients.map((ing, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={ing}
                      onChange={(e) => updateArrayItem('ingredients', i, e.target.value)}
                      placeholder="e.g. 100% Pure Organic Moringa Leaf Powder"
                      className="flex-1 px-3 py-1.5 text-xs border border-gray-200 rounded-xl outline-none focus:border-[#009447]"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('ingredients', i)}
                      className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Usage Instructions</label>
                <textarea
                  rows={2}
                  value={formData.usageInstructions}
                  onChange={(e) => setFormData({ ...formData, usageInstructions: e.target.value })}
                  placeholder="Mix 1/2 to 1 tsp in lukewarm water with honey or blend into smoothies..."
                  className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-[#009447]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Storage Instructions</label>
                <textarea
                  rows={2}
                  value={formData.storageInstructions}
                  onChange={(e) => setFormData({ ...formData, storageInstructions: e.target.value })}
                  placeholder="Store in a cool dry place. Keep pouch airtight after opening..."
                  className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-[#009447]"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DYNAMIC PRICING & WEIGHT VARIANTS */}
        {activeTab === 'variants' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <div>
                <h2 className="text-sm font-bold text-gray-900">Package Sizes & Dynamic Pricing</h2>
                <p className="text-xs text-gray-500">Configure weight variants (100g, 250g, 500g, 1kg) with independent prices and inventory stock</p>
              </div>
              <button
                type="button"
                onClick={addVariant}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-[#009447] hover:bg-[#007A3B] rounded-xl transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Variant</span>
              </button>
            </div>

            <div className="space-y-3">
              {formData.variants.map((v, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 grid grid-cols-2 sm:grid-cols-6 gap-3 items-end">
                  {/* Weight */}
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Weight / Size</label>
                    <input
                      type="text"
                      value={v.weight}
                      onChange={(e) => updateVariant(i, 'weight', e.target.value)}
                      placeholder="e.g. 250g"
                      className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-xl bg-white"
                      required
                    />
                  </div>

                  {/* SKU */}
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Variant SKU</label>
                    <input
                      type="text"
                      value={v.sku}
                      onChange={(e) => updateVariant(i, 'sku', e.target.value)}
                      placeholder="AGR-MOR-250"
                      className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-xl bg-white"
                    />
                  </div>

                  {/* Selling Price */}
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Selling Price (₹) *</label>
                    <input
                      type="number"
                      value={v.price}
                      onChange={(e) => updateVariant(i, 'price', e.target.value)}
                      placeholder="299"
                      min="0"
                      className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-xl bg-white font-semibold text-[#18382A]"
                      required
                    />
                  </div>

                  {/* Original / MRP Price */}
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">MRP Price (₹)</label>
                    <input
                      type="number"
                      value={v.originalPrice || ''}
                      onChange={(e) => updateVariant(i, 'originalPrice', e.target.value)}
                      placeholder="349"
                      min="0"
                      className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-xl bg-white"
                    />
                  </div>

                  {/* Stock Quantity */}
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Stock Units *</label>
                    <input
                      type="number"
                      value={v.stock}
                      onChange={(e) => updateVariant(i, 'stock', e.target.value)}
                      placeholder="50"
                      min="0"
                      className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-xl bg-white"
                      required
                    />
                  </div>

                  {/* Delete & Popular Toggle */}
                  <div className="flex items-center justify-between pb-1 gap-2">
                    <label className="flex items-center gap-1.5 text-[11px] text-gray-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!v.isPopular}
                        onChange={(e) => updateVariant(i, 'isPopular', e.target.checked)}
                        className="rounded text-[#009447] focus:ring-0"
                      />
                      <span>Popular</span>
                    </label>

                    {formData.variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(i)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                        title="Delete variant"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Optional Variant Image Row */}
                  <div className="col-span-2 sm:col-span-6 mt-2 pt-2 border-t border-gray-200/80 flex items-center gap-3">
                    <div className="w-9 h-9 bg-white border border-gray-200 rounded-lg p-0.5 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {v.image ? (
                        <img src={resolveMediaUrl(v.image)} alt="Variant" className="max-h-full max-w-full object-contain" />
                      ) : (
                        <ImageIcon className="w-4 h-4 text-gray-300" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        value={v.image || ''}
                        onChange={(e) => updateVariant(i, 'image', e.target.value)}
                        placeholder="Variant packaging photo URL (optional)"
                        className="w-full px-2.5 py-1 text-[11px] border border-gray-200 rounded-lg bg-white outline-none focus:border-[#009447]"
                      />
                    </div>
                    <label className="cursor-pointer px-2.5 py-1 bg-white border border-gray-200 hover:border-[#009447] text-[11px] font-semibold text-gray-700 rounded-lg shadow-2xs whitespace-nowrap hover:text-[#009447] transition">
                      Upload Photo
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const fd = new FormData();
                          fd.append('images', file);
                          try {
                            const res = await adminApi.uploadImages(fd);
                            const url = Array.isArray(res?.data) ? res.data[0]?.url : res?.data?.url;
                            if (url) updateVariant(i, 'image', url);
                          } catch (err) {
                            alert('Upload failed: ' + err.message);
                          }
                          e.target.value = '';
                        }}
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PRODUCT IMAGES & GALLERY */}
        {activeTab === 'images' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <div>
                <h2 className="text-sm font-bold text-gray-900">Product Images & Media Gallery</h2>
                <p className="text-xs text-gray-500">
                  Drag and drop images, upload new files directly, or choose from Media Library
                </p>
              </div>
              <button
                type="button"
                onClick={() => addArrayItem('images')}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#009447] bg-[#E8F5EE] hover:bg-[#D4EEDB] rounded-xl transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Empty Slot</span>
              </button>
            </div>

            {/* Top Drag & Drop Batch Upload Zone */}
            <div className="bg-gray-50/60 p-5 rounded-2xl border border-gray-200 space-y-2">
              <label className="block text-xs font-bold text-[#18382A]">
                Upload or Drop Images to Gallery
              </label>
              <ImageDropzone
                multiple={true}
                label="Drag and drop product photos here, or browse"
                sublabel="Files are automatically uploaded to the server and added to this product's gallery"
                onUploadSuccess={(urls) => {
                  const newUrls = Array.isArray(urls) ? urls : [urls];
                  setFormData((prev) => {
                    const filtered = prev.images.filter((img) => img.trim() !== '');
                    return { ...prev, images: [...filtered, ...newUrls] };
                  });
                }}
              />
            </div>

            {/* Existing Images Cards */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Current Gallery ({formData.images.filter(Boolean).length} Images)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.images.map((img, i) => (
                  <div key={i} className="p-4 bg-white rounded-2xl border border-gray-200 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                        {i === 0 ? (
                          <span className="bg-[#009447] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                            Main Display Image
                          </span>
                        ) : (
                          <span className="bg-gray-100 text-gray-700 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                            Gallery Photo #{i + 1}
                          </span>
                        )}
                      </span>

                      <div className="flex items-center gap-2">
                        {i > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newImgs = [...formData.images];
                              const [selected] = newImgs.splice(i, 1);
                              newImgs.unshift(selected);
                              setFormData({ ...formData, images: newImgs });
                            }}
                            className="text-[11px] text-[#009447] hover:underline font-semibold"
                          >
                            Set as Main
                          </button>
                        )}
                        {formData.images.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeArrayItem('images', i)}
                            className="text-xs text-red-500 hover:text-red-700"
                            title="Delete this image slot"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Image Preview & Dropzone for this slot */}
                    <div className="grid grid-cols-3 gap-3 items-center">
                      <div className="aspect-square bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center overflow-hidden p-2">
                        {img ? (
                          <img src={resolveMediaUrl(img)} alt={`Preview ${i}`} className="max-h-full max-w-full object-contain" />
                        ) : (
                          <span className="text-[10px] text-gray-400 text-center flex flex-col items-center">
                            <ImageIcon className="w-5 h-5 mb-1 opacity-50" />
                            No Image
                          </span>
                        )}
                      </div>

                      <div className="col-span-2 space-y-2">
                        <ImageDropzone
                          compact={true}
                          multiple={false}
                          currentValue={img}
                          label="Replace or Upload"
                          sublabel="Drop image or pick from library"
                          onUploadSuccess={(url) => updateArrayItem('images', i, url)}
                        />
                      </div>
                    </div>

                    {/* Direct URL Input */}
                    <div>
                      <label className="block text-[11px] text-gray-500 mb-0.5 font-medium">Image URL / Path</label>
                      <input
                        type="text"
                        value={img}
                        onChange={(e) => updateArrayItem('images', i, e.target.value)}
                        placeholder="/assets/moringa-packaging.png or /uploads/..."
                        className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-xl bg-white outline-none focus:border-[#009447]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <Info className="w-4 h-4 text-[#009447] flex-shrink-0" />
              <span>
                Tip: The first image in the list is automatically displayed as the main superfood packaging photo on the homepage and catalog.
              </span>
            </div>
          </div>
        )}

        {/* TAB 5: SEO META */}
        {activeTab === 'seo' && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">Search Engine Optimization (SEO)</h2>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">SEO Title Tag</label>
              <input
                type="text"
                value={formData.seoTitle}
                onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                placeholder="e.g. Organic Moringa Powder 100% Pure | AgrivaFoods"
                className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-[#009447]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Meta Description</label>
              <textarea
                rows={3}
                value={formData.seoDescription}
                onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                placeholder="High search visibility summary shown on Google search results..."
                className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-[#009447]"
              />
            </div>
          </div>
        )}

        {/* TAB 6: PUBLISHING & VISIBILITY */}
        {activeTab === 'publishing' && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">Status & Storefront Visibility</h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Publication Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full sm:w-64 px-3.5 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-[#009447]"
                >
                  <option value="published">Published (Visible to public customers)</option>
                  <option value="draft">Draft (Hidden from storefront)</option>
                  <option value="archived">Archived (Unlisted)</option>
                </select>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-[#009447] focus:ring-0"
                  />
                  <span className="text-xs font-semibold text-gray-800">
                    Feature this product on homepage
                  </span>
                </label>
                <p className="text-[11px] text-gray-400 ml-6 mt-0.5">
                  Featured products are highlighted in the homepage hero and best-sellers carousel.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Save Bar */}
        <div className="mt-8 pt-5 border-t border-gray-100 flex items-center justify-between">
          <Link
            to="/admin/products"
            className="text-xs text-gray-500 hover:text-gray-900 font-medium"
          >
            Cancel and Return
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-[#009447] hover:bg-[#007A3B] rounded-xl transition shadow-md disabled:opacity-50"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isNew ? 'Create & Publish' : 'Save Changes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
