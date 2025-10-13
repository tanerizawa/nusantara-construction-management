// Hook for managing milestone photos
import { useState, useEffect, useCallback } from 'react';
import { milestoneDetailAPI } from '../services/milestoneDetailAPI';

export const useMilestonePhotos = (projectId, milestoneId) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  // Load photos
  const loadPhotos = useCallback(async (filter = {}) => {
    console.log('📥 [LOAD] Loading photos...', { projectId, milestoneId, filter });
    setLoading(true);
    setError(null);
    try {
      const response = await milestoneDetailAPI.getPhotos(projectId, milestoneId, filter);
      console.log('📥 [LOAD] Photos loaded:', response.data?.length || 0);
      
      if (response.data && response.data.length > 0) {
        console.log('📸 [LOAD] First photo sample:', {
          id: response.data[0].id,
          title: response.data[0].title,
          photoUrl: response.data[0].photoUrl,
          thumbnailUrl: response.data[0].thumbnailUrl,
          hasPhotoUrl: !!response.data[0].photoUrl,
          hasThumbnailUrl: !!response.data[0].thumbnailUrl,
          allKeys: Object.keys(response.data[0])
        });
      }
      
      setPhotos(response.data || []);
    } catch (err) {
      console.error('❌ [LOAD] Error loading photos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [projectId, milestoneId]);

  // Upload photos
  const uploadPhotos = async (formData) => {
    console.log('🚀 [UPLOAD] Starting photo upload...');
    setUploading(true);
    setError(null);
    try {
      const response = await milestoneDetailAPI.uploadPhotos(projectId, milestoneId, formData);
      
      console.log('📦 [UPLOAD] Raw Response:', response);
      console.log('📦 [UPLOAD] Response Data:', response.data);
      
      if (response.data && Array.isArray(response.data)) {
        console.log('📸 [UPLOAD] Uploaded Photos Count:', response.data.length);
        response.data.forEach((photo, idx) => {
          console.log(`📸 [UPLOAD] Photo ${idx + 1}:`, {
            id: photo.id,
            title: photo.title,
            photoUrl: photo.photoUrl,
            thumbnailUrl: photo.thumbnailUrl,
            photoType: photo.photoType,
            hasPhotoUrl: !!photo.photoUrl,
            hasThumbnailUrl: !!photo.thumbnailUrl,
            allKeys: Object.keys(photo)
          });
        });
      }
      
      console.log('🔄 [UPLOAD] Reloading photos...');
      await loadPhotos(); // Reload photos
      console.log('✅ [UPLOAD] Upload complete, photos reloaded');
      return response.data;
    } catch (err) {
      console.error('❌ [UPLOAD] Error uploading photos:', err);
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  // Delete photo
  const deletePhoto = async (photoId) => {
    try {
      await milestoneDetailAPI.deletePhoto(projectId, milestoneId, photoId);
      setPhotos(prev => prev.filter(p => p.id !== photoId));
    } catch (err) {
      console.error('Error deleting photo:', err);
      setError(err.message);
      throw err;
    }
  };

  // Initial load
  useEffect(() => {
    if (projectId && milestoneId) {
      loadPhotos();
    }
  }, [projectId, milestoneId, loadPhotos]);

  return {
    photos,
    loading,
    uploading,
    error,
    loadPhotos,
    uploadPhotos,
    deletePhoto
  };
};
