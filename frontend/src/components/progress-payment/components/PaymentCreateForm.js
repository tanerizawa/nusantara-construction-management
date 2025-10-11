import React, { useState, useEffect } from 'react';
import { X, FileText, DollarSign, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { formatCurrency, formatDate } from '../../../utils/formatters';

/**
 * Inline form untuk membuat progress payment baru
 * Modern dark theme dengan validation
 */
const PaymentCreateForm = ({ onClose, onSubmit, projectId }) => {
  const [loading, setLoading] = useState(false);
  const [approvedBAs, setApprovedBAs] = useState([]);
  const [formData, setFormData] = useState({
    beritaAcaraId: '',
    amount: '',
    percentage: '', // Changed from paymentPercentage
    dueDate: '',
    description: '',
    notes: ''
  });
  const [selectedBA, setSelectedBA] = useState(null);
  const [errors, setErrors] = useState({});

  // Fetch approved Berita Acara
  useEffect(() => {
    const fetchApprovedBA = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}/berita-acara?status=approved`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setApprovedBAs(data.data || []);
        }
      } catch (err) {
        console.error('Error fetching BA:', err);
      }
    };
    fetchApprovedBA();
  }, [projectId]);

  // Handle BA selection
  const handleBASelect = (baId) => {
    const ba = approvedBAs.find(b => b.id === parseInt(baId));
    setSelectedBA(ba);
    setFormData(prev => ({
      ...prev,
      beritaAcaraId: String(baId), // Keep as string for backend
      description: ba ? `Pembayaran Progress ${ba.completionPercentage}% - ${ba.baNumber}` : '',
      percentage: ba ? String(ba.completionPercentage) : '' // Keep as string for input
    }));
  };

  // Handle input change
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Validate form
  const validate = () => {
    const newErrors = {};
    if (!formData.beritaAcaraId) newErrors.beritaAcaraId = 'Pilih Berita Acara';
    if (!formData.amount || formData.amount <= 0) newErrors.amount = 'Jumlah harus lebih dari 0';
    if (!formData.percentage || formData.percentage <= 0) newErrors.percentage = 'Persentase harus lebih dari 0';
    if (!formData.dueDate) newErrors.dueDate = 'Tanggal jatuh tempo harus diisi';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      // Prepare payload for backend
      const payload = {
        beritaAcaraId: String(formData.beritaAcaraId),
        amount: parseFloat(formData.amount),
        percentage: parseFloat(formData.percentage),
        dueDate: formData.dueDate,
        notes: formData.notes || '',
        taxAmount: 0,        // Default 0, can be calculated later
        retentionAmount: 0   // Default 0, can be calculated later
      };

      console.log('📤 Submitting payment data:', payload);
      
      await onSubmit(payload);
    } catch (err) {
      console.error('❌ Submit error:', err);
      alert('Gagal membuat pembayaran: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#2C2C2E] rounded-lg border border-[#0A84FF] mb-6 overflow-hidden animate-slideDown">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0A84FF]/10 to-transparent border-b border-[#38383A] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#0A84FF]/20 flex items-center justify-center">
            <DollarSign size={20} className="text-[#0A84FF]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Buat Progress Payment Baru</h3>
            <p className="text-sm text-[#8E8E93]">Isi form di bawah untuk membuat pembayaran progress</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-[#8E8E93] hover:text-white transition-colors p-2 hover:bg-[#38383A] rounded"
        >
          <X size={20} />
        </button>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Info Alert */}
        <div className="bg-[#0A84FF]/10 border border-[#0A84FF]/30 rounded-lg p-4">
          <div className="flex gap-3">
            <AlertCircle className="text-[#0A84FF] flex-shrink-0" size={20} />
            <div>
              <p className="text-white font-medium mb-1">Informasi Pembayaran Progress</p>
              <p className="text-sm text-[#8E8E93]">
                Pilih Berita Acara yang sudah disetujui untuk membuat pembayaran. Jumlah dan persentase akan otomatis disesuaikan.
              </p>
            </div>
          </div>
        </div>

        {/* Pilih Berita Acara */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Pilih Berita Acara <span className="text-[#FF3B30]">*</span>
          </label>
          <select
            value={formData.beritaAcaraId}
            onChange={(e) => handleBASelect(e.target.value)}
            className="w-full bg-[#1C1C1E] border border-[#38383A] text-white rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
          >
            <option value="">-- Pilih Berita Acara --</option>
            {approvedBAs.map(ba => (
              <option key={ba.id} value={ba.id}>
                {ba.baNumber} - {ba.completionPercentage}% ({formatDate(ba.completionDate)})
              </option>
            ))}
          </select>
          {errors.beritaAcaraId && (
            <p className="text-[#FF3B30] text-sm mt-1">{errors.beritaAcaraId}</p>
          )}
        </div>

        {/* BA Preview Card */}
        {selectedBA && (
          <div className="bg-[#1C1C1E] border border-[#38383A] rounded-lg p-4">
            <div className="flex items-start gap-3">
              <FileText size={20} className="text-[#0A84FF] mt-0.5" />
              <div className="flex-1">
                <h4 className="text-white font-medium mb-2">{selectedBA.baNumber}</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-[#8E8E93]">Progress:</span>
                    <span className="text-white ml-2">{selectedBA.completionPercentage}%</span>
                  </div>
                  <div>
                    <span className="text-[#8E8E93]">Tanggal:</span>
                    <span className="text-white ml-2">{formatDate(selectedBA.completionDate)}</span>
                  </div>
                </div>
                <p className="text-[#8E8E93] text-sm mt-2">{selectedBA.workDescription}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Jumlah Pembayaran */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Jumlah Pembayaran <span className="text-[#FF3B30]">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8E93]">Rp</span>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                placeholder="0"
                className="w-full bg-[#1C1C1E] border border-[#38383A] text-white rounded-lg pl-10 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
              />
            </div>
            {errors.amount && (
              <p className="text-[#FF3B30] text-sm mt-1">{errors.amount}</p>
            )}
          </div>

          {/* Persentase Pembayaran */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Persentase Pembayaran <span className="text-[#FF3B30]">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                value={formData.percentage}
                onChange={(e) => handleChange('percentage', e.target.value)}
                placeholder="0"
                min="0"
                max="100"
                className="w-full bg-[#1C1C1E] border border-[#38383A] text-white rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E8E93]">%</span>
            </div>
            {errors.percentage && (
              <p className="text-[#FF3B30] text-sm mt-1">{errors.percentage}</p>
            )}
          </div>
        </div>

        {/* Tanggal Jatuh Tempo */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Tanggal Jatuh Tempo <span className="text-[#FF3B30]">*</span>
          </label>
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => handleChange('dueDate', e.target.value)}
            className="w-full bg-[#1C1C1E] border border-[#38383A] text-white rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
          />
          {errors.dueDate && (
            <p className="text-[#FF3B30] text-sm mt-1">{errors.dueDate}</p>
          )}
        </div>

        {/* Deskripsi */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Deskripsi
          </label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Deskripsi pembayaran"
            className="w-full bg-[#1C1C1E] border border-[#38383A] text-white rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
          />
        </div>

        {/* Catatan */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Catatan Tambahan
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            rows={3}
            placeholder="Catatan atau informasi tambahan..."
            className="w-full bg-[#1C1C1E] border border-[#38383A] text-white rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-[#38383A]">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-[#48484A] text-white px-4 py-2.5 rounded-lg hover:bg-[#48484A]/80 transition-colors font-medium"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 bg-[#30D158] text-white px-4 py-2.5 rounded-lg hover:bg-[#30D158]/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <CheckCircle size={18} />
                Buat Pembayaran
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentCreateForm;
