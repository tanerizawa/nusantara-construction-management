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
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <div 
        className="bg-gradient-to-br from-[#1C1C1E] to-[#2C2C2E] border border-[#38383A] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="p-6 border-b border-[#38383A]">
          <h3 className="text-xl font-semibold text-white">
            {document ? 'Edit Dokumen' : 'Upload Dokumen'}
          </h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nama Dokumen */}
          <div>
            <label className="block text-sm font-medium text-[#8E8E93] mb-2">Nama Dokumen</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[#2C2C2E] border border-[#38383A] rounded-lg px-4 py-2.5 text-white placeholder-[#8E8E93] focus:outline-none focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent transition-all"
              placeholder="Masukkan nama dokumen"
              required
            />
          </div>

          {/* Category & Access Level */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#8E8E93] mb-2">Kategori</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-[#2C2C2E] border border-[#38383A] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent transition-all appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238E8E93' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center'
                }}
                required
              >
                {Object.entries(documentCategories).map(([key, cat]) => (
                  <option key={key} value={key}>{cat.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#8E8E93] mb-2">Access Level</label>
              <select
                value={formData.accessLevel}
                onChange={(e) => setFormData({ ...formData, accessLevel: e.target.value })}
                className="w-full bg-[#2C2C2E] border border-[#38383A] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent transition-all appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238E8E93' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center'
                }}
                required
              >
                <option value="public">Public</option>
                <option value="team">Team Only</option>
                <option value="restricted">Restricted</option>
              </select>
            </div>
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-sm font-medium text-[#8E8E93] mb-2">Deskripsi</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[#2C2C2E] border border-[#38383A] rounded-lg px-4 py-2.5 text-white placeholder-[#8E8E93] focus:outline-none focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent transition-all resize-none"
              rows={3}
              placeholder="Deskripsi dokumen"
              required
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-[#8E8E93] mb-2">Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 bg-[#2C2C2E] border border-[#38383A] rounded-lg px-4 py-2.5 text-white placeholder-[#8E8E93] focus:outline-none focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent transition-all"
                placeholder="Tambah tag"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-6 py-2.5 bg-[#0A84FF] text-white rounded-lg hover:bg-[#0A84FF]/90 transition-colors font-medium"
              >
                Tambah
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map(tag => (
                <span key={tag} className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#0A84FF]/20 text-[#0A84FF] text-sm rounded-lg border border-[#0A84FF]/30">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-[#0A84FF] hover:text-[#0A84FF]/70 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* File Upload */}
          {!document && (
            <div>
              <label className="block text-sm font-medium text-[#8E8E93] mb-2">Upload File</label>
              <div 
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                  dragActive 
                    ? 'border-[#0A84FF] bg-[#0A84FF]/10' 
                    : 'border-[#38383A] hover:border-[#0A84FF]/50 bg-[#2C2C2E]/30'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload size={32} className="mx-auto text-[#8E8E93] mb-3" />
                {selectedFile ? (
                  <div>
                    <p className="text-[#30D158] font-medium text-lg mb-1">{selectedFile.name}</p>
                    <p className="text-sm text-[#8E8E93] mb-3">
                      Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="text-[#FF453A] hover:text-[#FF453A]/80 text-sm font-medium transition-colors"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="text-[#8E8E93] mb-3">Drag & drop file atau click untuk upload</p>
                    <input 
                      type="file" 
                      id="fileInput"
                      className="hidden"
                      onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0])}
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg,.gif,.dwg,.txt,.zip"
                    />
                    <label 
                      htmlFor="fileInput"
                      className="inline-block px-6 py-2.5 bg-[#0A84FF] text-white rounded-lg hover:bg-[#0A84FF]/90 cursor-pointer transition-colors font-medium"
                    >
                      Pilih File
                    </label>
                  </div>
                )}
              </div>
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mt-3">
                  <div className="bg-[#38383A] rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-[#0A84FF] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-[#8E8E93] mt-2">Uploading... {uploadProgress}%</p>
                </div>
              )}
            </div>
          )}

          {/* Public Access Checkbox */}
          <div className="flex items-center gap-3 p-3 bg-[#2C2C2E]/50 rounded-lg border border-[#38383A]">
            <input
              type="checkbox"
              id="isPublic"
              checked={formData.isPublic}
              onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
              className="w-4 h-4 text-[#0A84FF] bg-[#2C2C2E] border-[#38383A] rounded focus:ring-[#0A84FF] focus:ring-2"
            />
            <label htmlFor="isPublic" className="text-sm text-white cursor-pointer">
              Dokumen dapat diakses publik
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-[#38383A]">
            <button
              type="submit"
              disabled={uploading || (!document && !selectedFile)}
              className={`flex-1 py-3 px-4 rounded-lg transition-all font-medium ${
                uploading || (!document && !selectedFile)
                  ? 'bg-[#38383A] text-[#636366] cursor-not-allowed'
                  : 'bg-[#0A84FF] text-white hover:bg-[#0A84FF]/90 hover:shadow-lg'
              }`}
            >
              {uploading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {document ? 'Updating...' : 'Uploading...'}
                </div>
              ) : (
                document ? 'Update Dokumen' : 'Upload Dokumen'
              )}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={uploading}
              className={`flex-1 py-3 px-4 rounded-lg transition-all font-medium ${
                uploading 
                  ? 'bg-[#38383A] text-[#636366] cursor-not-allowed'
                  : 'bg-[#2C2C2E] text-[#8E8E93] hover:bg-[#38383A] hover:text-white border border-[#38383A]'
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
