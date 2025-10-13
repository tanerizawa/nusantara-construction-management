// Photos Tab - Photo gallery with upload
import React, { useState } from 'react';
import { Upload, Image as ImageIcon, Filter, Trash2, Camera, Download, Sparkles } from 'lucide-react';
import { useMilestonePhotos } from '../hooks/useMilestonePhotos';
import { PHOTO_TYPES } from '../services/milestoneDetailAPI';
import { formatDate } from '../../../utils/formatters';
import { getImageUrl } from '../../../utils/config';

const PhotosTab = ({ milestone, projectId }) => {
  const { photos, loading, uploading, uploadPhotos, deletePhoto } = useMilestonePhotos(projectId, milestone.id);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    photoType: 'progress'
  });

  // Generate auto title: {photoType}-{projectId}-{ddmmyyyy}-{time}-{sequence}
  const generateAutoTitle = () => {
    const now = new Date();
    
    // Format date: ddmmyyyy
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const dateStr = `${day}${month}${year}`;
    
    // Format time: HHmmss
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timeStr = `${hours}${minutes}${seconds}`;
    
    // Get sequence: count of photos with same type today + 1
    const todayPhotos = photos.filter(p => {
      if (!p.createdAt) return false;
      const photoDate = new Date(p.createdAt);
      return (
        p.photoType === uploadForm.photoType &&
        photoDate.toDateString() === now.toDateString()
      );
    });
    const sequence = String(todayPhotos.length + 1).padStart(2, '0');
    
    // Format: progress-2025HDL001-13102025-143022-01
    const autoTitle = `${uploadForm.photoType}-${projectId}-${dateStr}-${timeStr}-${sequence}`;
    
    setUploadForm(prev => ({ ...prev, title: autoTitle }));
  };

  // Filter photos by type
  const filteredPhotos = selectedType === 'all' 
    ? photos 
    : photos.filter(p => p.photoType === selectedType);

  // Handle file selection (no auto-upload)
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    setSelectedFiles(files);
    
    // Auto-generate title if empty
    if (!uploadForm.title) {
      generateAutoTitle();
    }
  };

  // Handle manual upload button click
  const handleUploadClick = async () => {
    // Validation
    if (!uploadForm.title || uploadForm.title.trim() === '') {
      alert('❌ Title is required!\n\nPlease enter a title or click "Auto" to generate one.');
      return;
    }

    if (selectedFiles.length === 0) {
      alert('❌ No files selected!\n\nPlease select photos to upload.');
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append('photos', file);
    });
    formData.append('title', uploadForm.title.trim());
    formData.append('description', uploadForm.description || '');
    formData.append('photoType', uploadForm.photoType);

    try {
      await uploadPhotos(formData);
      
      // Reset form and clear selected files
      setUploadForm({
        title: '',
        description: '',
        photoType: 'progress'
      });
      setSelectedFiles([]);
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error('Upload failed:', error);
      alert('❌ Upload failed!\n\n' + (error.message || 'Please try again.'));
    }
  };

  // Handle delete
  const handleDelete = async (photoId) => {
    const photo = photos.find(p => p.id === photoId);
    const photoTitle = photo?.title || 'this photo';
    
    if (!window.confirm(
      `Are you sure you want to delete "${photoTitle}"?\n\n` +
      `This action cannot be undone. The photo will be permanently removed from the milestone.`
    )) return;
    
    try {
      await deletePhoto(photoId);
      // Close modal if it's open
      if (selectedPhoto && selectedPhoto.id === photoId) {
        setSelectedPhoto(null);
      }
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete photo. Please try again.');
    }
  };

  // Get photo type badge color
  const getTypeColor = (type) => {
    const colors = {
      progress: 'bg-[#0A84FF]/10 text-[#0A84FF] border-[#0A84FF]/30',
      issue: 'bg-[#FF453A]/10 text-[#FF453A] border-[#FF453A]/30',
      inspection: 'bg-[#FF9F0A]/10 text-[#FF9F0A] border-[#FF9F0A]/30',
      quality: 'bg-[#30D158]/10 text-[#30D158] border-[#30D158]/30',
      before: 'bg-[#BF5AF2]/10 text-[#BF5AF2] border-[#BF5AF2]/30',
      after: 'bg-[#FFD60A]/10 text-[#FFD60A] border-[#FFD60A]/30',
      general: 'bg-[#8E8E93]/10 text-[#8E8E93] border-[#8E8E93]/30'
    };
    return colors[type] || colors.general;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Upload Section */}
      <div className="bg-[#2C2C2E] rounded-lg p-4 border border-[#38383A]">
        <div className="flex items-center gap-2 mb-4">
          <Camera size={18} className="text-[#0A84FF]" />
          <h3 className="font-semibold text-white">Upload Photos</h3>
        </div>

        {/* Upload Form */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-[#8E8E93] mb-1">
              Title <span className="text-[#FF453A]">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={uploadForm.title}
                onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Foundation Progress Day 1"
                required
                className="flex-1 px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded text-sm text-white placeholder-[#636366] focus:border-[#0A84FF] focus:outline-none"
              />
              <button
                type="button"
                onClick={generateAutoTitle}
                className="px-3 py-2 bg-[#5AC8FA]/10 hover:bg-[#5AC8FA]/20 text-[#5AC8FA] border border-[#5AC8FA]/30 rounded text-sm font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap"
                title="Auto-generate title based on photo type, project code, and timestamp"
              >
                <Sparkles size={14} />
                <span>Auto</span>
              </button>
            </div>
            <p className="text-xs text-[#636366] mt-1">
              Format: {uploadForm.photoType}-{projectId}-ddmmyyyy-time-sequence
            </p>
          </div>

          <div>
            <label className="block text-xs text-[#8E8E93] mb-1">Description (Optional)</label>
            <textarea
              value={uploadForm.description}
              onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Add notes about this photo..."
              rows={2}
              className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded text-sm text-white placeholder-[#636366] focus:border-[#0A84FF] focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs text-[#8E8E93] mb-1">Photo Type</label>
            <select
              value={uploadForm.photoType}
              onChange={(e) => setUploadForm(prev => ({ ...prev, photoType: e.target.value }))}
              className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded text-sm text-white focus:border-[#0A84FF] focus:outline-none"
            >
              <option value="progress">Progress</option>
              <option value="issue">Issue</option>
              <option value="inspection">Inspection</option>
              <option value="quality">Quality Check</option>
              <option value="before">Before</option>
              <option value="after">After</option>
              <option value="general">General</option>
            </select>
          </div>

          {/* File Picker Section */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-[#8E8E93] mb-2">Select Photos</label>
              <label className="flex items-center justify-center gap-2 px-4 py-3 bg-[#2C2C2E] hover:bg-[#38383A] border-2 border-dashed border-[#38383A] hover:border-[#0A84FF] text-[#8E8E93] hover:text-white rounded-lg cursor-pointer transition-all">
                <ImageIcon size={18} />
                <span className="font-medium">
                  {selectedFiles.length > 0 
                    ? `${selectedFiles.length} photo${selectedFiles.length > 1 ? 's' : ''} selected` 
                    : 'Choose Photos'}
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/jpg,image/png,image/gif"
                  onChange={handleFileSelect}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-[#636366] text-center mt-2">
                Max 10 photos, 10MB each. JPEG, JPG, PNG, GIF
              </p>
            </div>

            {/* Selected Files Preview */}
            {selectedFiles.length > 0 && (
              <div className="bg-[#1C1C1E] rounded-lg p-3 border border-[#38383A]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[#8E8E93] font-medium">
                    Selected Files ({selectedFiles.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFiles([]);
                      const fileInput = document.querySelector('input[type="file"]');
                      if (fileInput) fileInput.value = '';
                    }}
                    className="text-xs text-[#FF453A] hover:text-[#FF453A]/80"
                  >
                    Clear All
                  </button>
                </div>
                <div className="space-y-1">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs text-[#636366]">
                      <ImageIcon size={12} className="text-[#0A84FF]" />
                      <span className="flex-1 truncate">{file.name}</span>
                      <span className="text-[#8E8E93]">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Button */}
            <button
              type="button"
              onClick={handleUploadClick}
              disabled={uploading || selectedFiles.length === 0 || !uploadForm.title.trim()}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                uploading || selectedFiles.length === 0 || !uploadForm.title.trim()
                  ? 'bg-[#38383A] text-[#636366] cursor-not-allowed'
                  : 'bg-[#0A84FF] hover:bg-[#0A84FF]/90 text-white shadow-lg shadow-[#0A84FF]/20 hover:shadow-[#0A84FF]/30'
              }`}
            >
              <Upload size={18} />
              <span>
                {uploading ? 'Uploading...' : 'Upload Photos'}
              </span>
            </button>

            {/* Validation Helper */}
            {selectedFiles.length > 0 && !uploadForm.title.trim() && (
              <div className="flex items-start gap-2 p-3 bg-[#FF9F0A]/10 border border-[#FF9F0A]/30 rounded-lg">
                <span className="text-[#FF9F0A] text-xs">⚠️</span>
                <p className="text-xs text-[#FF9F0A]">
                  <strong>Title required:</strong> Please enter a title or click "Auto" to generate one before uploading.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter size={16} className="text-[#8E8E93]" />
        <button
          onClick={() => setSelectedType('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            selectedType === 'all'
              ? 'bg-[#0A84FF] text-white'
              : 'bg-[#2C2C2E] text-[#8E8E93] hover:text-white'
          }`}
        >
          All ({photos.length})
        </button>
        {Object.values(PHOTO_TYPES).map(type => {
          const count = photos.filter(p => p.photoType === type).length;
          return (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${
                selectedType === type
                  ? 'bg-[#0A84FF] text-white'
                  : 'bg-[#2C2C2E] text-[#8E8E93] hover:text-white'
              }`}
            >
              {type.replace('_', ' ')} ({count})
            </button>
          );
        })}
      </div>

      {/* Photos Grid */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-sm text-[#8E8E93]">Loading photos...</p>
        </div>
      ) : filteredPhotos.length === 0 ? (
        <div className="text-center py-12 bg-[#2C2C2E] rounded-lg border border-[#38383A]">
          <ImageIcon size={48} className="text-[#636366] mx-auto mb-3" />
          <p className="text-sm text-[#8E8E93]">No photos yet. Upload some to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filteredPhotos.map((photo, idx) => {
            // Debug logging for each photo
            const hasValidUrl = photo.photoUrl || photo.thumbnailUrl;
            const thumbnailUrl = hasValidUrl ? getImageUrl(photo.thumbnailUrl || photo.photoUrl) : '';
            
            console.log(`🖼️ [RENDER] Photo ${idx + 1}:`, {
              id: photo.id,
              title: photo.title,
              photoUrl: photo.photoUrl,
              thumbnailUrl: photo.thumbnailUrl,
              computedThumbnailUrl: thumbnailUrl,
              hasPhotoUrl: !!photo.photoUrl,
              hasThumbnailUrl: !!photo.thumbnailUrl,
              hasValidUrl,
              allKeys: Object.keys(photo)
            });
            
            // Skip photos without URLs to prevent errors
            if (!hasValidUrl) {
              console.warn('⚠️ [RENDER] Skipping photo without URL:', photo);
              return null;
            }
            
            return (
            <div
              key={photo.id}
              className="group relative bg-[#2C2C2E] rounded-lg overflow-hidden border border-[#38383A] hover:border-[#0A84FF] transition-colors cursor-pointer"
              onClick={() => setSelectedPhoto(photo)}
            >
              {/* Photo - Use thumbnail for grid, fallback to original */}
              <div className="aspect-square relative bg-[#1C1C1E]">
                <img
                  src={thumbnailUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    console.error('❌ [IMG] Image load error:', {
                      photoId: photo.id,
                      attemptedSrc: e.target.src,
                      photoUrl: photo.photoUrl,
                      thumbnailUrl: photo.thumbnailUrl
                    });
                    
                    // Prevent infinite loop - only fallback once
                    if (!e.target.dataset.fallbackAttempted) {
                      e.target.dataset.fallbackAttempted = 'true';
                      const originalUrl = getImageUrl(photo.photoUrl);
                      
                      if (originalUrl && e.target.src !== originalUrl) {
                        console.log('🔄 [IMG] Falling back to original:', originalUrl);
                        e.target.src = originalUrl;
                      } else {
                        console.error('❌ [IMG] No fallback available, hiding image');
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<div class="flex items-center justify-center w-full h-full bg-red-500/10 text-red-500 text-xs p-4 text-center">Image not found</div>';
                      }
                    }
                  }}
                  onLoad={(e) => {
                    console.log('✅ [IMG] Image loaded successfully:', {
                      photoId: photo.id,
                      src: e.target.src,
                      naturalWidth: e.target.naturalWidth,
                      naturalHeight: e.target.naturalHeight
                    });
                  }}
                />
                
                {/* Overlay on hover with View and Delete */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPhoto(photo);
                    }}
                    className="p-2 bg-[#0A84FF] hover:bg-[#0A84FF]/90 text-white rounded-lg transition-colors"
                    title="View Photo"
                  >
                    <ImageIcon size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(photo.id);
                    }}
                    className="p-2 bg-[#FF453A] hover:bg-[#FF453A]/90 text-white rounded-lg transition-colors"
                    title="Delete Photo"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                {/* Download/View button on top-right */}
                <a
                  href={getImageUrl(photo.photoUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-[#30D158] hover:bg-[#30D158]/90 text-white rounded-lg transition-all opacity-0 group-hover:opacity-100 shadow-lg"
                  title="Download Photo"
                >
                  <Download size={14} />
                </a>
              </div>

              {/* Info */}
              <div className="p-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="text-sm font-medium text-white line-clamp-1">
                    {photo.title}
                  </h4>
                  <span className={`inline-flex px-2 py-0.5 rounded text-xs border ${getTypeColor(photo.photoType)}`}>
                    {photo.photoType}
                  </span>
                </div>
                {photo.description && (
                  <p className="text-xs text-[#8E8E93] line-clamp-2 mb-2">
                    {photo.description}
                  </p>
                )}
                <p className="text-xs text-[#636366]">
                  {formatDate(photo.takenAt || photo.createdAt)}
                </p>
                {photo.uploader_name && (
                  <p className="text-xs text-[#636366]">
                    By: {photo.uploader_name}
                  </p>
                )}
              </div>
            </div>
            );
          })}
        </div>
      )}

      {/* Photo Detail Modal */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div 
            className="max-w-4xl w-full bg-[#1C1C1E] rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={getImageUrl(selectedPhoto.photoUrl)}
              alt={selectedPhoto.title}
              className="w-full max-h-[70vh] object-contain bg-black"
            />
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {selectedPhoto.title}
                  </h3>
                  {selectedPhoto.description && (
                    <p className="text-sm text-[#8E8E93] mb-3">
                      {selectedPhoto.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-[#636366]">
                    <span>{formatDate(selectedPhoto.takenAt || selectedPhoto.createdAt)}</span>
                    {selectedPhoto.uploader_name && (
                      <span>By: {selectedPhoto.uploader_name}</span>
                    )}
                  </div>
                </div>
                <span className={`inline-flex px-3 py-1 rounded border text-xs font-medium ${getTypeColor(selectedPhoto.photoType)}`}>
                  {selectedPhoto.photoType}
                </span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    handleDelete(selectedPhoto.id);
                    setSelectedPhoto(null);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-[#FF453A] hover:bg-[#FF453A]/90 text-white rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                  Delete Photo
                </button>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="flex-1 px-4 py-2 bg-[#48484A] hover:bg-[#48484A]/80 text-white rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotosTab;
