import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import { ImageDropzone } from '../components/ImageDropzone';
import { Image as ImageIcon, Upload, Trash2, Copy, Check, Eye, AlertCircle } from 'lucide-react';

export const AdminMedia = () => {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [previewImage, setPreviewImage] = useState(null);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getMedia();
      setMediaList(res?.data || []);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to fetch media assets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setErrorMsg('');

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    try {
      await adminApi.uploadImages(formData);
      await fetchMedia();
    } catch (err) {
      setErrorMsg(err.message || 'Upload failed. Only image files (JPG, PNG, WebP) are allowed.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleCopy = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (filename) => {
    if (!window.confirm(`Delete image '${filename}'?`)) return;
    try {
      await adminApi.deleteMedia(filename);
      await fetchMedia();
    } catch (err) {
      alert(err.message || 'Failed to delete image');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#18382A]">Product Images & Media</h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Upload, organize, drag-and-drop, and copy image links for products and homepage banners
          </p>
        </div>

        {/* Quick Upload Button */}
        <label className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#009447] hover:bg-[#007A3B] rounded-xl transition shadow-sm cursor-pointer">
          <Upload className="w-4 h-4" />
          <span>{uploading ? 'Uploading...' : 'Browse Image(s)'}</span>
          <input
            type="file"
            multiple
            accept="image/png, image/jpeg, image/webp, image/svg+xml"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Interactive Drag & Drop Upload Zone */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h2 className="text-sm font-bold text-[#18382A] mb-3">Upload Media Assets</h2>
        <ImageDropzone
          multiple={true}
          allowLibrarySelect={false}
          label="Drag and drop product images here, or browse files"
          sublabel="Instant multi-file upload for JPG, PNG, WebP, SVG up to 5MB"
          onUploadSuccess={() => {
            fetchMedia();
          }}
        />
      </div>

      {/* Media Grid */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-400">Loading media library...</div>
        ) : mediaList.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <ImageIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p className="text-xs">No media files uploaded yet. Click "Upload Image" to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {mediaList.map((media) => {
              const id = media._id || media.filename;
              return (
                <div key={id} className="group relative bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden flex flex-col justify-between hover:shadow-md transition">
                  {/* Image Display */}
                  <div
                    className="h-32 bg-white flex items-center justify-center p-2 cursor-pointer overflow-hidden"
                    onClick={() => setPreviewImage(media.url)}
                  >
                    <img
                      src={media.url}
                      alt={media.filename}
                      className="h-full object-contain group-hover:scale-105 transition"
                    />
                  </div>

                  {/* Info and Actions */}
                  <div className="p-2.5 bg-gray-50 border-t border-gray-100 flex flex-col gap-1.5">
                    <div className="text-[11px] font-semibold text-gray-800 truncate" title={media.filename}>
                      {media.filename}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() => handleCopy(media.url, id)}
                        className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#009447] hover:underline"
                        title="Copy relative image URL to clipboard"
                      >
                        {copiedId === id ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy URL</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(media.filename)}
                        className="p-1 text-gray-400 hover:text-red-500 rounded"
                        title="Delete image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setPreviewImage(null)}>
          <div className="bg-white rounded-2xl p-4 max-w-lg w-full max-h-[85vh] flex flex-col items-center">
            <img src={previewImage} alt="Preview" className="max-h-[70vh] object-contain rounded-xl" />
            <div className="mt-3 flex flex-col sm:flex-row items-center gap-2 w-full justify-center">
              <input
                type="text"
                readOnly
                value={previewImage}
                className="px-3 py-1.5 text-xs bg-gray-100 rounded-lg text-gray-600 font-mono w-full sm:w-64 text-center sm:text-left"
              />
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-lg text-xs font-semibold w-full sm:w-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
