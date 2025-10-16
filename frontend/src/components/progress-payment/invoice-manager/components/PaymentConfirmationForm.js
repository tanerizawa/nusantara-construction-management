import React from 'react';
import { DollarSign, Receipt, X, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { formatCurrency } from '../../../../utils/formatters';
import { FALLBACK_BANK_OPTIONS } from '../config/invoiceConfig';

/**
 * Payment Confirmation Form Component
 */
const PaymentConfirmationForm = ({
  invoice,
  formData,
  bankAccounts,
  loadingBanks,
  onUpdateData,
  onSubmit,
  onClose,
  loading = false
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  const handleInputChange = (field, value) => {
    onUpdateData({ [field]: value });
  };

  const handleFileChange = (file) => {
    onUpdateData({ evidenceFile: file });
  };

  const isPaidAmountCorrect = parseFloat(formData.paidAmount) === parseFloat(invoice?.netAmount);

  return (
    <div id="confirm-payment-form" className="mt-6 bg-[#2C2C2E] border border-[#38383A] rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#30D158]/20 rounded-lg">
            <DollarSign className="text-[#30D158]" size={20} />
          </div>
          <h3 className="text-lg font-semibold text-white">Konfirmasi Pembayaran Diterima</h3>
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
          <DollarSign size={16} className="text-[#FF9F0A]" />
          <p className="text-sm text-[#8E8E93]">Expected: <span className="font-semibold text-[#FF9F0A]">{formatCurrency(invoice?.netAmount)}</span></p>
        </div>
      </div>

      <div className="bg-[#FF9F0A]/10 border border-[#FF9F0A]/30 rounded-lg p-3 mb-4 flex items-start gap-2">
        <AlertCircle size={16} className="text-[#FF9F0A] mt-0.5 flex-shrink-0" />
        <p className="text-xs text-[#FF9F0A]">Bukti transfer wajib diupload!</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">Jumlah Diterima *</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8E93]">Rp</span>
            <input
              type="number"
              value={formData.paidAmount}
              onChange={(e) => handleInputChange('paidAmount', e.target.value)}
              className="w-full pl-12 pr-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white focus:outline-none focus:border-[#0A84FF]"
              required
              step="0.01"
              disabled={loading}
            />
            {isPaidAmountCorrect && (
              <CheckCircle size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#30D158]" />
            )}
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">Tanggal Pembayaran *</label>
          <input
            type="date"
            value={formData.paidDate}
            onChange={(e) => handleInputChange('paidDate', e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white focus:outline-none focus:border-[#0A84FF]"
            required
            disabled={loading}
          />
        </div>

        {/* Bank */}
        <div>
          <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
            Bank Penerima *
            {loadingBanks && (
              <RefreshCw size={14} className="animate-spin text-[#0A84FF]" />
            )}
          </label>
          <select
            value={formData.bankName}
            onChange={(e) => handleInputChange('bankName', e.target.value)}
            className={`w-full px-3 py-2 bg-[#1C1C1E] border rounded-lg text-white focus:outline-none focus:border-[#0A84FF] ${
              !formData.bankName ? 'border-[#FF453A]' : 'border-[#38383A]'
            }`}
            required
            disabled={loadingBanks || loading}
          >
            <option value="">
              {loadingBanks ? 'Loading banks...' : '-- Pilih Bank Penerima --'}
            </option>
            
            {bankAccounts.length > 0 ? (
              <>
                {/* Bank accounts from Chart of Accounts */}
                {bankAccounts.map(account => (
                  <option key={account.id} value={account.accountName}>
                    {account.accountCode} - {account.accountName}
                  </option>
                ))}
                
                {/* Separator */}
                <option disabled>──────────</option>
                <option value="Other">Lainnya (Manual Entry)</option>
              </>
            ) : (
              <>
                {/* Fallback options if no COA banks found */}
                {FALLBACK_BANK_OPTIONS.map(bank => (
                  <option key={bank} value={bank}>
                    {bank}
                  </option>
                ))}
              </>
            )}
          </select>
          
          {!formData.bankName && (
            <p className="text-xs text-[#FF453A] mt-1 flex items-center gap-1">
              <AlertCircle size={12} />
              <span>Bank penerima wajib dipilih</span>
            </p>
          )}
          
          {bankAccounts.length > 0 && formData.bankName && (
            <p className="text-xs text-[#30D158] mt-1 flex items-center gap-1">
              <CheckCircle size={12} />
              <span>Bank dipilih: {formData.bankName}</span>
            </p>
          )}
          
          {bankAccounts.length > 0 && !formData.bankName && (
            <p className="text-xs text-[#8E8E93] mt-1">
              {bankAccounts.length} bank tersedia dari Chart of Accounts
            </p>
          )}
        </div>

        {/* Reference */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">Referensi Transfer</label>
          <input
            type="text"
            value={formData.paymentReference}
            onChange={(e) => handleInputChange('paymentReference', e.target.value)}
            className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white focus:outline-none focus:border-[#0A84FF]"
            placeholder="TRF123456"
            disabled={loading}
          />
        </div>

        {/* Evidence Upload (REQUIRED) */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Bukti Transfer * <span className="text-[#FF3B30]">(WAJIB)</span>
          </label>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => handleFileChange(e.target.files[0])}
            className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#30D158] file:text-white file:cursor-pointer"
            required
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
            value={formData.paymentNotes}
            onChange={(e) => handleInputChange('paymentNotes', e.target.value)}
            className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg text-white focus:outline-none focus:border-[#0A84FF]"
            rows={3}
            placeholder="Catatan pembayaran..."
            disabled={loading}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-[#38383A]">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#30D158] text-white rounded-lg hover:bg-[#30D158]/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle size={18} />
            <span>{loading ? 'Memproses...' : 'Konfirmasi Pembayaran'}</span>
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

export default PaymentConfirmationForm;