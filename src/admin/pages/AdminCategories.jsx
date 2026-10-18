import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import { ImageDropzone } from '../components/ImageDropzone';
import { Layers, Plus, Edit, Trash2, CheckCircle2, AlertCircle, X, Save } from 'lucide-react';

export const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', slug: '', description: '', image: '', order: 1 });
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getCategories();
      setCategories(res?.data || []);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({ name: '', slug: '', description: '', image: '', order: categories.length + 1 });
    setModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name || '',
      slug: cat.slug || '',
      description: cat.description || '',
      image: cat.image || '',
      order: cat.order || 1
    });
    setModalOpen(true);
  };

  const handleNameChange = (name) => {
    const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setFormData(prev => ({ ...prev, name, slug: !editingCategory ? slug : prev.slug }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name) return;
    setSaving(true);
    setErrorMsg('');

    try {
      if (editingCategory) {
        await adminApi.updateCategory(editingCategory._id || editingCategory.id, formData);
      } else {
        await adminApi.createCategory(formData);
      }
      setModalOpen(false);
      await fetchCategories();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await adminApi.deleteCategory(id);
      await fetchCategories();
    } catch (err) {
      alert(err.message || 'Failed to delete category');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#18382A]">Product Categories</h1>
          <p className="text-xs sm:text-sm text-gray-500">Organize botanicals into customer-facing departments</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-[#009447] hover:bg-[#007A3B] rounded-xl transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
          {errorMsg}
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-3 p-12 text-center text-xs text-gray-400">Loading categories...</div>
        ) : categories.map((cat) => {
          const id = cat._id || cat.id;
          return (
            <div key={id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#009447] flex items-center justify-center font-bold">
                    <Layers className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono text-gray-400">Order: {cat.order || 0}</span>
                </div>
                <h3 className="font-bold text-base text-[#18382A]">{cat.name}</h3>
                <p className="text-xs text-gray-400 font-mono mt-0.5">/{cat.slug}</p>
                <p className="text-xs text-gray-600 mt-2 line-clamp-2">{cat.description || 'No description provided.'}</p>
              </div>

              <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => openEditModal(cat)}
                  className="px-2.5 py-1 text-xs font-semibold text-[#009447] hover:bg-emerald-50 rounded-lg transition"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(id)}
                  className="px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-base text-[#18382A]">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Superfood Powders"
                  required
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-[#009447]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Slug *</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g. superfood-powders"
                  required
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-[#009447]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description for category banner..."
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-[#009447]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Category Image / Icon (Optional)</label>
                <ImageDropzone
                  compact={true}
                  multiple={false}
                  currentValue={formData.image}
                  label="Upload category image or icon"
                  sublabel="Drag & drop image or select from library"
                  onUploadSuccess={(url) => setFormData((prev) => ({ ...prev, image: url }))}
                />
                {formData.image && (
                  <div className="flex items-center gap-2 mt-1.5">
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="/assets/... or /uploads/..."
                      className="w-full px-2.5 py-1 text-xs border border-gray-200 rounded-lg outline-none bg-gray-50"
                    />
                    <div className="h-8 w-8 rounded-lg bg-gray-50 border border-gray-200 p-0.5 flex-shrink-0 flex items-center justify-center">
                      <img src={formData.image} alt="Preview" className="h-full w-full object-contain" />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#009447] hover:bg-[#007A3B] rounded-xl shadow-sm"
                >
                  {saving ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
