import React, { useState, useMemo, useEffect } from 'react';
import { projectAPI } from '../services/api';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Download,
  Upload,
  FileText,
  Image,
  File,
  Eye,
  Share2,
  Lock,
  Unlock,
  Calendar,
  User,
  Search,
  Filter,
  FolderOpen,
  Tag,
  Clock
} from 'lucide-react';

const ProjectDocuments = ({ project, onUpdate }) => {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Document categories
  const categories = {
    contract: { name: 'Kontrak', icon: FileText, color: 'blue' },
    design: { name: 'Desain & Gambar', icon: Image, color: 'green' },
    permit: { name: 'Perizinan', icon: File, color: 'yellow' },
    report: { name: 'Laporan', icon: FileText, color: 'purple' },
    certificate: { name: 'Sertifikat', icon: File, color: 'red' },
    specification: { name: 'Spesifikasi', icon: FileText, color: 'indigo' },
    other: { name: 'Lainnya', icon: File, color: 'gray' }
  };

  // Documents state - initialize empty, will load from database
  const [documents, setDocuments] = useState([]);

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
          size: 2456789, // bytes
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

  // Load documents on component mount and when project changes
  useEffect(() => {
    loadDocuments();
  }, [project?.id]);

  // Sample documents data - keeping as fallback/demo data
  const sampleDocuments = [
    {
      id: 'DOC001',
      name: 'Kontrak Kerja Renovasi Pabrik',
      filename: 'kontrak-renovasi-pabrik-2024.pdf',
      category: 'contract',
      size: 2456789, // bytes
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
  ];

  // Calculate statistics
  const stats = useMemo(() => {
    const totalDocuments = documents.length;
    const totalSize = documents.reduce((sum, doc) => sum + doc.size, 0);
    const byCategory = Object.keys(categories).reduce((acc, cat) => {
      acc[cat] = documents.filter(doc => doc.category === cat).length;
      return acc;
    }, {});
    const byStatus = {
      approved: documents.filter(doc => doc.status === 'approved').length,
      review: documents.filter(doc => doc.status === 'review').length,
      draft: documents.filter(doc => doc.status === 'draft').length
    };
    
    return { totalDocuments, totalSize, byCategory, byStatus };
  }, [documents]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getFileIcon = (fileType) => {
    const iconMap = {
      pdf: FileText,
      doc: FileText,
      docx: FileText,
      xls: FileText,
      xlsx: FileText,
      dwg: Image,
      png: Image,
      jpg: Image,
      jpeg: Image,
      gif: Image
    };
    return iconMap[fileType] || File;
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      approved: { color: 'green', text: 'Disetujui' },
      review: { color: 'yellow', text: 'Review' },
      draft: { color: 'gray', text: 'Draft' },
      published: { color: 'blue', text: 'Published' }
    };
    return statusMap[status] || statusMap.draft;
  };

  const DocumentForm = ({ document, onSave, onCancel }) => {
    const [formData, setFormData] = useState(document || {
      name: '',
      category: 'other',
      description: '',
      accessLevel: 'team',
      tags: [],
      isPublic: false
    });
    const [tagInput, setTagInput] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (!document && !selectedFile) {
        alert('Pilih file untuk diupload');
        return;
      }

      setUploading(true);
      
      try {
        console.log('=== FRONTEND DEBUG ===');
        console.log('FormData type:', typeof formData);
        console.log('SelectedFile type:', typeof selectedFile);
        console.log('File details:', selectedFile ? 'File object exists' : 'No file');
        console.log('=====================');

        // Create document data without the file object - pass file separately
        const documentData = {
          ...formData,
          file: selectedFile // Keep the File object reference
        };

        await onSave(documentData);
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('Gagal menyimpan dokumen');
      } finally {
        setUploading(false);
      }
    };

    const handleFileSelect = (file) => {
      console.log('📁 File selected - name:', file?.name, 'size:', file?.size);
      
      setSelectedFile(file);
      if (!formData.name) {
        setFormData({
          ...formData,
          name: file.name.split('.')[0]
        });
      }
    };

    const handleDrag = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileSelect(e.dataTransfer.files[0]);
      }
    };

    const addTag = () => {
      if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
        setFormData({
          ...formData,
          tags: [...formData.tags, tagInput.trim()]
        });
        setTagInput('');
      }
    };

    const removeTag = (tagToRemove) => {
      setFormData({
        ...formData,
        tags: formData.tags.filter(tag => tag !== tagToRemove)
      });
    };

    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
        style={{
          zIndex: 9999,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div 
          className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto"
          style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            maxWidth: '672px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}
        >
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">
              {document ? 'Edit Dokumen' : 'Upload Dokumen'}
            </h3>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nama Dokumen</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Kategori</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                >
                  {Object.entries(categories).map(([key, cat]) => (
                    <option key={key} value={key}>{cat.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Access Level</label>
                <select
                  value={formData.accessLevel}
                  onChange={(e) => setFormData({ ...formData, accessLevel: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                >
                  <option value="public">Public</option>
                  <option value="team">Team Only</option>
                  <option value="restricted">Restricted</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Deskripsi</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tags</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 border rounded-lg px-3 py-2"
                  placeholder="Tambah tag"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Tambah
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {!document && (
              <div>
                <label className="block text-sm font-medium mb-1">Upload File</label>
                <div 
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    dragActive 
                      ? 'border-blue-400 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                  {selectedFile ? (
                    <div>
                      <p className="text-green-600 font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-gray-500">
                        Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <button
                        type="button"
                        onClick={() => setSelectedFile(null)}
                        className="mt-2 text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove file
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-600 mb-2">Drag & drop file atau click untuk upload</p>
                      <input 
                        type="file" 
                        id="fileInput"
                        className="hidden"
                        onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0])}
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg,.gif,.dwg,.txt,.zip"
                      />
                      <label 
                        htmlFor="fileInput"
                        className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                      >
                        Pilih File
                      </label>
                    </div>
                  )}
                </div>
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="mt-2">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Uploading... {uploadProgress}%</p>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublic"
                checked={formData.isPublic}
                onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="isPublic" className="text-sm">Dokumen dapat diakses publik</label>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={uploading || (!document && !selectedFile)}
                className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                  uploading || (!document && !selectedFile)
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {uploading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {document ? 'Updating...' : 'Uploading...'}
                  </div>
                ) : (
                  document ? 'Update' : 'Upload'
                )}
              </button>
              <button
                type="button"
                onClick={onCancel}
                disabled={uploading}
                className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                  uploading 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                }`}
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Database operations
  const handleSaveDocument = async (documentData) => {
    try {
      if (editingDocument) {
        // Update existing document (metadata only)
        const updateData = {
          title: documentData.name,
          description: documentData.description,
          category: documentData.category,
          accessLevel: documentData.accessLevel,
          tags: JSON.stringify(documentData.tags || []),
          isPublic: documentData.isPublic || false,
          updatedAt: new Date().toISOString()
        };

        const response = await projectAPI.updateDocument(project.id, editingDocument.id, updateData);
        
        // Update local state
        const updatedDocument = {
          ...editingDocument,
          name: documentData.name,
          description: documentData.description,
          category: documentData.category,
          accessLevel: documentData.accessLevel,
          tags: documentData.tags || [],
          isPublic: documentData.isPublic || false,
          updatedAt: new Date().toISOString()
        };
        
        setDocuments(docs => docs.map(doc => 
          doc.id === editingDocument.id ? updatedDocument : doc
        ));
        
        setEditingDocument(null);
        alert('Dokumen berhasil diperbarui!');
        
      } else {
        // Upload new document with file
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
        console.log('FormData entries:');
        for (let pair of formData.entries()) {
          console.log(pair[0] + ': ', pair[1]);
        }
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
        setShowUploadForm(false);
        alert('Dokumen berhasil diupload!');
      }
      
      // Reload documents from database to sync
      await loadDocuments();
      
    } catch (error) {
      console.error('Error saving document:', error);
      alert('Gagal menyimpan dokumen. Silakan coba lagi.');
    }
  };

  const handleDeleteDocument = async (documentId) => {
    if (!window.confirm('Yakin ingin menghapus dokumen ini?')) return;
    
    try {
      await projectAPI.deleteDocument(project.id, documentId);
      
      // Remove from local state
      const updatedDocuments = documents.filter(doc => doc.id !== documentId);
      setDocuments(updatedDocuments);
      
      // Reload from database to ensure sync
      await loadDocuments();
      
      alert('Dokumen berhasil dihapus!');
      
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Gagal menghapus dokumen. Silakan coba lagi.');
    }
  };

  const handleDownloadDocument = async (documentId, filename) => {
    try {
      const response = await projectAPI.downloadDocument(project.id, documentId);
      
      // Create blob and download link
      const blob = new Blob([response.data], { 
        type: response.headers['content-type'] || 'application/octet-stream' 
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
      // Update download count in local state
      setDocuments(docs => docs.map(doc => 
        doc.id === documentId 
          ? { ...doc, downloadCount: (doc.downloadCount || 0) + 1, lastAccessed: new Date().toISOString().split('T')[0] }
          : doc
      ));
      
    } catch (error) {
      console.error('Error downloading document:', error);
      alert('Gagal download dokumen. Silakan coba lagi.');
    }
  };

  // Filter documents
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || doc.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Early return if no project
  if (!project) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Project Selected</h3>
          <p className="text-gray-600">Please select a project to view documents</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">Project Documents</h3>
          <p className="text-gray-600">Kelola dokumen dan file proyek</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            disabled={loading}
          >
            {viewMode === 'grid' ? 'List View' : 'Grid View'}
          </button>
          <button 
            onClick={() => setShowUploadForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            disabled={loading}
          >
            <Upload size={16} />
            Upload Dokumen
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            Memuat dokumen...
          </div>
        </div>
      )}

      {!loading && (
        <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <FileText size={20} />
            <span className="font-medium">Total Dokumen</span>
          </div>
          <div className="text-2xl font-bold text-blue-700">{stats.totalDocuments}</div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <FolderOpen size={20} />
            <span className="font-medium">Total Size</span>
          </div>
          <div className="text-2xl font-bold text-green-700">
            {formatFileSize(stats.totalSize)}
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-600 mb-2">
            <Eye size={20} />
            <span className="font-medium">Disetujui</span>
          </div>
          <div className="text-2xl font-bold text-yellow-700">{stats.byStatus.approved}</div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-purple-600 mb-2">
            <Clock size={20} />
            <span className="font-medium">Review</span>
          </div>
          <div className="text-2xl font-bold text-purple-700">{stats.byStatus.review}</div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari dokumen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="all">Semua Kategori</option>
          {Object.entries(categories).map(([key, cat]) => (
            <option key={key} value={key}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Documents Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc) => {
            const category = categories[doc.category];
            const Icon = getFileIcon(doc.fileType);
            const statusInfo = getStatusInfo(doc.status);
            
            return (
              <div key={doc.id} className="bg-white rounded-lg border p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 bg-${category.color}-100 rounded-lg flex items-center justify-center`}>
                      <Icon size={24} className={`text-${category.color}-600`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">{doc.name}</h4>
                      <p className="text-sm text-gray-500">{category.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {doc.isPublic ? (
                      <Unlock size={16} className="text-green-600" title="Public" />
                    ) : (
                      <Lock size={16} className="text-red-600" title="Private" />
                    )}
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{doc.description}</p>

                <div className="space-y-2 mb-4 text-xs text-gray-500">
                  <div className="flex justify-between">
                    <span>Size:</span>
                    <span>{formatFileSize(doc.size)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Upload:</span>
                    <span>{formatDate(doc.uploadDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Version:</span>
                    <span>v{doc.version}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-3">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium bg-${statusInfo.color}-100 text-${statusInfo.color}-800`}>
                    {statusInfo.text}
                  </span>
                  <span className="text-xs text-gray-500">{doc.downloadCount} downloads</span>
                </div>

                {doc.tags && doc.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {doc.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="inline-flex px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                    {doc.tags.length > 3 && (
                      <span className="text-xs text-gray-500">+{doc.tags.length - 3} more</span>
                    )}
                  </div>
                )}

                <div className="flex gap-2">
                  <button 
                    onClick={() => handleDownloadDocument(doc.id, doc.filename)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    <Download size={14} />
                    Download
                  </button>
                  <button 
                    onClick={() => setEditingDocument(doc)}
                    className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    <Edit size={14} />
                  </button>
                  <button 
                    onClick={() => handleDeleteDocument(doc.id)}
                    className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-900">Dokumen</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-900">Kategori</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-900">Size</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-900">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-900">Upload Date</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDocuments.map((doc) => {
                  const category = categories[doc.category];
                  const Icon = getFileIcon(doc.fileType);
                  const statusInfo = getStatusInfo(doc.status);
                  
                  return (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Icon size={20} className={`text-${category.color}-600`} />
                          <div>
                            <div className="font-medium text-gray-900">{doc.name}</div>
                            <div className="text-sm text-gray-500">{doc.filename}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{category.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{formatFileSize(doc.size)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium bg-${statusInfo.color}-100 text-${statusInfo.color}-800`}>
                          {statusInfo.text}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{formatDate(doc.uploadDate)}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center gap-2">
                          <button 
                            onClick={() => handleDownloadDocument(doc.id, doc.filename)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Download"
                          >
                            <Download size={16} />
                          </button>
                          <button
                            onClick={() => setEditingDocument(doc)}
                            className="text-green-600 hover:text-green-800"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteDocument(doc.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada dokumen</h3>
          <p className="text-gray-600">
            {searchTerm || filterCategory !== 'all' 
              ? 'Tidak ada dokumen yang sesuai dengan filter' 
              : 'Belum ada dokumen yang diupload'
            }
          </p>
        </div>
      )}

      {/* Forms */}
      {showUploadForm && (
        <DocumentForm
          onSave={handleSaveDocument}
          onCancel={() => setShowUploadForm(false)}
        />
      )}
      
      {editingDocument && (
        <DocumentForm
          document={editingDocument}
          onSave={handleSaveDocument}
          onCancel={() => setEditingDocument(null)}
        />
      )}
        </>
      )}
    </div>
  );
};

export default ProjectDocuments;
