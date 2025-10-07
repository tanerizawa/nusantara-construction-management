import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { documentCategories } from '../config';

/**
 * Document upload/edit form component
 * Handles: file upload, metadata editing, drag & drop
 */
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
  const [uploadProgress] = useState(0);

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
                {Object.entries(documentCategories).map(([key, cat]) => (
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

export default DocumentForm;
