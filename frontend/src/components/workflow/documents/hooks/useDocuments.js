import { useState, useEffect } from 'react';
import { projectAPI } from '../../../../services/api';

/**
 * Custom hook untuk mengelola dokumen proyek
 * Handles: loading, CRUD operations, state management
 */
export const useDocuments = (project) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Load documents from database
  const loadDocuments = async () => {
    if (!project?.id) return;
    
    try {
      setLoading(true);
      const response = await projectAPI.getDocuments(project.id);
      
      // Transform backend data to frontend format
      const transformedDocuments = (response.data || []).map(doc => ({
        id: doc.id,
        name: doc.title || doc.name || 'Untitled Document',
        filename: doc.fileName || doc.filename || 'unknown.pdf',
        category: doc.category || 'other',
        size: doc.fileSize || doc.size || 0,
        uploadDate: doc.uploadDate || doc.createdAt || new Date().toISOString().split('T')[0],
        uploadedBy: doc.uploadedBy || 'Unknown User',
        version: doc.version || '1.0',
        status: doc.status || 'draft',
        accessLevel: doc.accessLevel || 'team',
        description: doc.description || '',
        tags: doc.tags ? (Array.isArray(doc.tags) ? doc.tags : JSON.parse(doc.tags || '[]')) : [],
        downloadCount: doc.downloadCount || 0,
        lastAccessed: doc.lastAccessed || doc.updatedAt || new Date().toISOString().split('T')[0],
        fileType: doc.mimeType ? doc.mimeType.split('/')[1] : (doc.fileType || 'pdf'),
        isPublic: doc.isPublic || false,
        approvedBy: doc.approvedBy || null,
        approvalDate: doc.approvalDate || null,
        filePath: doc.filePath || null,
        mimeType: doc.mimeType || 'application/pdf'
      }));
      
      setDocuments(transformedDocuments);
      
    } catch (error) {
      console.error('Error loading documents:', error);
      // Keep sample data as fallback for demo
      setDocuments([
        {
          id: 'DOC001',
          name: 'Kontrak Kerja Renovasi Pabrik',
          filename: 'kontrak-renovasi-pabrik-2024.pdf',
          category: 'contract',
          size: 2456789,
          uploadDate: '2024-03-15',
          uploadedBy: 'Dedi Kurniawan',
          version: '2.1',
          status: 'approved',
          accessLevel: 'restricted',
          description: 'Kontrak kerja renovasi pabrik tekstil dengan PT Tekstil Nusantara',
          tags: ['kontrak', 'legal', 'final'],
          downloadCount: 12,
          lastAccessed: '2024-08-30',
          fileType: 'pdf',
          isPublic: false,
          approvedBy: 'Manager',
          approvalDate: '2024-03-16'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Upload new document
  const uploadDocument = async (documentData) => {
    if (!documentData.file) {
      throw new Error('File is required for new document');
    }

    const formData = new FormData();
    formData.append('file', documentData.file);
    formData.append('title', documentData.name);
    formData.append('description', documentData.description || '');
    formData.append('category', documentData.category);
    formData.append('accessLevel', documentData.accessLevel);
    formData.append('tags', JSON.stringify(documentData.tags || []));
    formData.append('isPublic', documentData.isPublic || false);
    formData.append('projectId', project.id);

    console.log('=== FORMDATA DEBUG ===');
    console.log('Selected file object:', documentData.file);
    console.log('File name:', documentData.file?.name);
    console.log('File size:', documentData.file?.size);
    console.log('File type:', documentData.file?.type);
    console.log('=====================');

    // Upload with progress tracking
    const response = await projectAPI.uploadDocument(project.id, formData);
    
    // Transform response to frontend format
    const newDocument = {
      id: response.data.id,
      name: response.data.title || documentData.name,
      filename: response.data.fileName || documentData.file.name,
      category: response.data.category || documentData.category,
      size: response.data.fileSize || documentData.file.size,
      uploadDate: response.data.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
      uploadedBy: response.data.uploadedBy || 'Current User',
      version: response.data.version || '1.0',
      status: response.data.status || 'draft',
      accessLevel: response.data.accessLevel || documentData.accessLevel,
      description: response.data.description || documentData.description,
      tags: response.data.tags ? (Array.isArray(response.data.tags) ? response.data.tags : JSON.parse(response.data.tags || '[]')) : [],
      downloadCount: 0,
      lastAccessed: new Date().toISOString().split('T')[0],
      fileType: response.data.mimeType ? response.data.mimeType.split('/')[1] : 'pdf',
      isPublic: response.data.isPublic || false,
      approvedBy: null,
      approvalDate: null,
      filePath: response.data.filePath,
      mimeType: response.data.mimeType
    };
    
    setDocuments(docs => [...docs, newDocument]);
    return newDocument;
  };

  // Update existing document (metadata only)
  const updateDocument = async (documentId, documentData) => {
    const updateData = {
      title: documentData.name,
      description: documentData.description,
      category: documentData.category,
      accessLevel: documentData.accessLevel,
      tags: JSON.stringify(documentData.tags || []),
      isPublic: documentData.isPublic || false,
      updatedAt: new Date().toISOString()
    };

    await projectAPI.updateDocument(project.id, documentId, updateData);
    
    // Update local state
    setDocuments(docs => docs.map(doc => 
      doc.id === documentId 
        ? {
            ...doc,
            name: documentData.name,
            description: documentData.description,
            category: documentData.category,
            accessLevel: documentData.accessLevel,
            tags: documentData.tags || [],
            isPublic: documentData.isPublic || false,
            updatedAt: new Date().toISOString()
          }
        : doc
    ));
  };

  // Delete document
  const deleteDocument = async (documentId) => {
    await projectAPI.deleteDocument(project.id, documentId);
    setDocuments(docs => docs.filter(doc => doc.id !== documentId));
  };

  // Download document - View in new tab instead of download
  const downloadDocument = async (documentId, filename) => {
    try {
      const response = await projectAPI.downloadDocument(project.id, documentId);
      
      // Create blob with proper mime type
      const blob = new Blob([response.data], { 
        type: response.headers['content-type'] || 'application/pdf' 
      });
      
      // Create URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Open in new tab instead of downloading
      window.open(url, '_blank');
      
      // Cleanup after a delay to ensure file is opened
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 100);
      
      // Update download count in local state
      setDocuments(docs => docs.map(doc => 
        doc.id === documentId 
          ? { 
              ...doc, 
              downloadCount: (doc.downloadCount || 0) + 1, 
              lastAccessed: new Date().toISOString().split('T')[0] 
            }
          : doc
      ));
    } catch (error) {
      console.error('Error viewing document:', error);
      alert('Gagal membuka dokumen');
    }
  };

  // Load documents on mount and when project changes
  useEffect(() => {
    loadDocuments();
  }, [project?.id]);

  return {
    documents,
    setDocuments,
    loading,
    uploadProgress,
    setUploadProgress,
    loadDocuments,
    uploadDocument,
    updateDocument,
    deleteDocument,
    downloadDocument
  };
};
