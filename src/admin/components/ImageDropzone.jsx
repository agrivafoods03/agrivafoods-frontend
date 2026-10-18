import React, { useState, useRef } from 'react';
import { adminApi } from '../../services/api';
import {
  UploadCloud,
  ImageIcon,
  Loader2,
  AlertCircle,
  FolderOpen,
  X,
  Check,
  CheckCircle2
} from 'lucide-react';

export const ImageDropzone = ({
  onUploadSuccess,
  multiple = false,
  label = 'Drag and drop image here, or browse',
  sublabel = 'Supports JPG, PNG, WebP, SVG up to 5MB',
  compact = false,
  allowLibrarySelect = true,
  currentValue = ''
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showLibrary, setShowLibrary] = useState(false);
  const [libraryMedia, setLibraryMedia] = useState([]);
  const [loadingLibrary, setLoadingLibrary] = useState(false);

  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
    e.target.value = '';
  };

  const processFiles = async (files) => {
    setErrorMsg('');

    // Validate files
    const validFiles = [];
    const maxSizeBytes = 5 * 1024 * 1024; // 5MB
    const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!validMimes.includes(file.type)) {
        setErrorMsg(`"${file.name}" has invalid type. Only JPG, PNG, WebP, SVG are allowed.`);
        return;
      }
      if (file.size > maxSizeBytes) {
        setErrorMsg(`"${file.name}" exceeds 5MB size limit.`);
        return;
      }
      validFiles.push(file);
      if (!multiple) break; // Only take first file if single mode
    }

    if (validFiles.length === 0) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      for (const f of validFiles) {
        formData.append('images', f);
      }

      const res = await adminApi.uploadImages(formData);
      const uploadedData = res?.data;

      if (onUploadSuccess) {
        if (Array.isArray(uploadedData)) {
          if (multiple) {
            onUploadSuccess(uploadedData.map((item) => item.url));
          } else {
            onUploadSuccess(uploadedData[0]?.url || '');
          }
        } else if (uploadedData?.url) {
          onUploadSuccess(uploadedData.url);
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Image upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const openLibraryModal = async () => {
    setShowLibrary(true);
    setLoadingLibrary(true);
    try {
      const res = await adminApi.getMedia();
      setLibraryMedia(res?.data || []);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to fetch media assets');
    } finally {
      setLoadingLibrary(false);
    }
  };

  const selectLibraryItem = (url) => {
    if (onUploadSuccess) {
      onUploadSuccess(url);
    }
    setShowLibrary(false);
  };

  return (
    <div className="space-y-2">
      {/* Drop Zone Box */}
      <div
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl transition-all cursor-pointer select-none flex flex-col items-center justify-center text-center ${
          compact ? 'p-4 min-h-[110px]' : 'p-6 sm:p-8 min-h-[160px]'
        } ${
          isDragging
            ? 'border-[#009447] bg-[#E8F5EE] scale-[1.01]'
            : 'border-gray-300 hover:border-[#009447] bg-gray-50/60 hover:bg-[#E8F5EE]/30'
        } ${isUploading ? 'opacity-70 pointer-events-none' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp, image/svg+xml"
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-7 h-7 text-[#009447] animate-spin" />
            <p className="text-xs font-semibold text-[#18382A]">Uploading image...</p>
          </div>
        ) : isDragging ? (
          <div className="flex flex-col items-center gap-1.5 animate-pulse">
            <UploadCloud className="w-8 h-8 text-[#009447]" />
            <p className="text-xs font-bold text-[#009447]">Drop file(s) here to upload</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 shadow-2xs flex items-center justify-center text-[#009447]">
              <UploadCloud className="w-5 h-5" />
            </div>

            <div>
              <p className="text-xs font-bold text-[#18382A]">{label}</p>
              <p className="text-[11px] text-gray-500 mt-0.5">{sublabel}</p>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <span className="px-3 py-1 bg-white border border-gray-200 hover:border-[#009447] rounded-lg text-[11px] font-semibold text-gray-700 shadow-2xs">
                Browse Files
              </span>

              {allowLibrarySelect && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openLibraryModal();
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-[#18382A]/5 hover:bg-[#18382A]/10 text-[#18382A] rounded-lg text-[11px] font-semibold transition"
                >
                  <FolderOpen className="w-3.5 h-3.5 text-[#009447]" />
                  <span>Choose from Library</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Error alert */}
      {errorMsg && (
        <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMsg('')}
            className="text-red-400 hover:text-red-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Media Library Picker Modal */}
      {showLibrary && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-gray-200">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-[#009447]" />
                <h3 className="text-sm font-bold text-[#18382A]">Select from Media Library</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowLibrary(false)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Gallery */}
            <div className="p-4 overflow-y-auto flex-1">
              {loadingLibrary ? (
                <div className="py-12 text-center text-xs text-gray-500 flex flex-col items-center gap-2">
                  <Loader2 className="w-6 h-6 text-[#009447] animate-spin" />
                  <span>Loading store media assets...</span>
                </div>
              ) : libraryMedia.length === 0 ? (
                <div className="py-12 text-center text-xs text-gray-400">
                  <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No uploaded media files found. Upload images to populate your library.</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {libraryMedia.map((item) => (
                    <div
                      key={item._id || item.filename}
                      onClick={() => selectLibraryItem(item.url)}
                      className={`group relative aspect-square rounded-xl border border-gray-200 bg-gray-50 overflow-hidden cursor-pointer hover:border-[#009447] hover:ring-2 hover:ring-[#009447]/30 transition ${
                        currentValue === item.url ? 'ring-2 ring-[#009447] border-[#009447]' : ''
                      }`}
                    >
                      <img
                        src={item.url}
                        alt={item.altText || item.filename}
                        className="w-full h-full object-contain p-2 group-hover:scale-105 transition duration-200"
                      />
                      <div className="absolute inset-0 bg-[#009447]/10 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <span className="bg-[#009447] text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
                          Select
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button
                type="button"
                onClick={() => setShowLibrary(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-200 rounded-xl transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
