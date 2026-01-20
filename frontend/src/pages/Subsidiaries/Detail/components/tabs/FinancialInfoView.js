import React from 'react';
import { DollarSign, TrendingUp, Calendar } from 'lucide-react';

const FinancialInfoView = ({ subsidiary }) => {
  const formatCurrency = (amount, currency = 'IDR') => {
    if (!amount) return '-';
    try {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    } catch {
      return `${currency} ${amount}`;
    }
  };

  const getCurrencyLabel = (code) => {
    const labels = {
      IDR: 'Indonesian Rupiah (IDR)',
      USD: 'US Dollar (USD)',
      EUR: 'Euro (EUR)'
    };
    return labels[code] || code;
  };

  return (
    <div className="space-y-6">
      {/* Capital Structure */}
      <div className="rounded-2xl border border-white/5 bg-white/5 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <DollarSign className="h-5 w-5 mr-2" />
          Struktur Modal
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs uppercase tracking-[0.15em] text-white/50 mb-2">Modal Dasar</label>
            <p className="text-white text-2xl font-bold">
              {formatCurrency(
                subsidiary.financialInfo?.authorizedCapital, 
                subsidiary.financialInfo?.currency
              )}
            </p>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.15em] text-white/50 mb-2">Modal Disetor</label>
            <p className="text-white text-2xl font-bold">
              {formatCurrency(
                subsidiary.financialInfo?.paidUpCapital, 
                subsidiary.financialInfo?.currency
              )}
            </p>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.15em] text-white/50 mb-2">Mata Uang</label>
            <p className="text-white text-base">
              {getCurrencyLabel(subsidiary.financialInfo?.currency)}
            </p>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.15em] text-white/50 mb-2">Akhir Tahun Fiskal</label>
            <p className="text-white text-base flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-white/40" />
              {subsidiary.financialInfo?.fiscalYearEnd || '-'}
            </p>
          </div>
        </div>
      </div>

      {/* Capital Utilization */}
      {subsidiary.financialInfo?.authorizedCapital && subsidiary.financialInfo?.paidUpCapital && (
        <div className="rounded-2xl border border-white/5 bg-white/5 p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Utilisasi Modal
          </h3>
          <div className="space-y-4">
            {(() => {
              const authorized = parseFloat(subsidiary.financialInfo.authorizedCapital);
              const paidUp = parseFloat(subsidiary.financialInfo.paidUpCapital);
              const percentage = authorized > 0 ? (paidUp / authorized * 100).toFixed(1) : 0;
              
              return (
                <>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-white/50">Persentase Modal Disetor</span>
                      <span className="text-sm font-semibold text-white">{percentage}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          percentage >= 80 ? 'bg-[#30D158]' :
                          percentage >= 50 ? 'bg-[#0ea5e9]' :
                          percentage >= 25 ? 'bg-[#FF9F0A]' :
                          'bg-[#FF453A]'
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                    <div className="text-center">
                      <p className="text-xs text-white/50 mb-1">Modal Belum Disetor</p>
                      <p className="text-lg font-bold text-white">
                        {formatCurrency(
                          authorized - paidUp, 
                          subsidiary.financialInfo.currency
                        )}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-white/50 mb-1">Persentase Sisa</p>
                      <p className="text-lg font-bold text-white">
                        {(100 - percentage).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Industry Classification */}
      {subsidiary.profileInfo?.industryClassification && (
        <div className="rounded-2xl border border-white/5 bg-white/5 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Klasifikasi Industri</h3>
          <p className="text-white text-base">
            {subsidiary.profileInfo.industryClassification}
          </p>
        </div>
      )}

      {/* Empty State */}
      {(!subsidiary.financialInfo || 
        (!subsidiary.financialInfo.authorizedCapital && !subsidiary.financialInfo.paidUpCapital)) && (
        <div className="text-center py-12">
          <DollarSign className="h-12 w-12 text-white/30 mx-auto mb-4" />
          <p className="text-white/60">Belum ada informasi keuangan yang tersedia</p>
        </div>
      )}
    </div>
  );
};

export default FinancialInfoView;
