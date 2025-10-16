import React from 'react';
import { Send, Receipt, DollarSign, X, Truck, Mail, Package } from 'lucide-react';
import { formatCurrency } from '../../../../utils/formatters';
import { DELIVERY_METHODS } from '../config/invoiceConfig';

/**
 * Mark Invoice as Sent Form Component
 */
const MarkSentForm = ({
  invoice,
  formData,
  onUpdateData,
  onSubmit,
  onClose,
  loading = false
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  const handleDeliveryMethodChange = (method) => {
    onUpdateData({ deliveryMethod: method });
  };

  const handleInputChange = (field, value) => {
    onUpdateData({ [field]: value });
  };

  const handleFileChange = (file) => {
    onUpdateData({ evidenceFile: file });
  };

  return (
    <div id="mark-sent-form" className="mt-6 bg-[#2C2C2E] border border-[#38383A] rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#FF9F0A]/20 rounded-lg">
            <Send className="text-[#FF9F0A]" size={20} />
          </div>
          <h3 className="text-lg font-semibold text-white">Tandai Invoice Terkirim</h3>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-[#8E8E93] hover:bg-[#8E8E93]/10 rounded-lg transition-colors"
          disabled={loading}
        >
          <X size={20} />
        </button>
      </div>

      <div className="bg-[#1C1C1E] border border-[#38383A] rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Receipt size={16} className="text-[#0A84FF]" />
          <p className="text-sm text-white">Invoice: <span className="font-semibold">{invoice?.invoiceNumber}</span></p>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign size={16} className="text-[#30D158]" />
          <p className="text-sm text-[#8E8E93]">Amount: {formatCurrency(invoice?.netAmount)}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Recipient Name */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">Diterima Oleh *</label>
          <input
            type="text"
            value={formData.recipientName}
            onChange={(e) => handleInputChange('recipientName', e.target.value)}
            className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white focus:outline-none focus:border-[#0A84FF]"
            required
            minLength={3}
            placeholder="Nama penerima"
            disabled={loading}
          />
        </div>

        {/* Send Date */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">Tanggal Kirim *</label>
          <input
            type="date"
            value={formData.sentDate}
            onChange={(e) => handleInputChange('sentDate', e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white focus:outline-none focus:border-[#0A84FF]"
            required
            disabled={loading}
          />
        </div>

        {/* Delivery Method */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">Metode Pengiriman *</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {DELIVERY_METHODS.map(method => {
              const Icon = method.icon;
              return (
                <button
                  key={method.value}
                  type="button"
                  onClick={() => handleDeliveryMethodChange(method.value)}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    formData.deliveryMethod === method.value
                      ? 'bg-[#0A84FF] text-white'
                      : 'bg-[#1C1C1E] text-[#8E8E93] hover:bg-[#38383A]'
                  }`}
                  disabled={loading}
                >
                  <Icon size={16} />
                  <span>{method.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Courier Fields */}
        {formData.deliveryMethod === 'courier' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Nama Kurir *</label>
              <input
                type="text"
                value={formData.courierService}
                onChange={(e) => handleInputChange('courierService', e.target.value)}
                className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white focus:outline-none focus:border-[#0A84FF]"
                required
                placeholder="JNE, TIKI, dll"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">No. Resi</label>
              <input
                type="text"
                value={formData.trackingNumber}
                onChange={(e) => handleInputChange('trackingNumber', e.target.value)}
                className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white focus:outline-none focus:border-[#0A84FF]"
                placeholder="Optional"
                disabled={loading}
              />
            </div>
          </div>
        )}

        {/* Evidence Upload */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">Bukti Kirim (Optional)</label>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => handleFileChange(e.target.files[0])}
            className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#0A84FF] file:text-white file:cursor-pointer"
            disabled={loading}
          />
          {formData.evidenceFile && (
            <p className="mt-2 text-xs text-[#30D158]">✓ File selected: {formData.evidenceFile.name}</p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">Catatan</label>
          <textarea
            value={formData.deliveryNotes}
            onChange={(e) => handleInputChange('deliveryNotes', e.target.value)}
            className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white focus:outline-none focus:border-[#0A84FF]"
            rows={3}
            placeholder="Catatan tambahan..."
            disabled={loading}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-[#38383A]">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#0A84FF] text-white rounded-lg hover:bg-[#0A84FF]/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
            <span>{loading ? 'Memproses...' : 'Tandai Terkirim'}</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 bg-[#8E8E93]/20 text-white rounded-lg hover:bg-[#8E8E93]/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
};

export default MarkSentForm;