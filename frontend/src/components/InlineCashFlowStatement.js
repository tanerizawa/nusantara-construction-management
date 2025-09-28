import React from 'react';
import { Printer, Download, X } from 'lucide-react';

const InlineCashFlowStatement = ({ 
  data, 
  onClose,
  companyInfo = {
    name: "PT. NUSANTARA KONSTRUKSI",
    address: "Jakarta, Indonesia",
    period: "Untuk Tahun yang Berakhir 31 Desember 2024"
  }
}) => {
  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR', 
      minimumFractionDigits: 0 
    }).format(amount || 0);
  };

  // Calculate detailed breakdown for Cash Flow Statement
  const operating = {
    netIncome: data.incomeStatement?.netIncome || 0,
    adjustments: {
      depreciation: 5000000,
      amortization: 1000000,
      badDebtExpense: 500000
    },
    workingCapitalChanges: {
      accountsReceivable: -2000000,
      inventory: -1500000,
      prepaidExpenses: -300000,
      accountsPayable: 1800000,
      accruedExpenses: 900000
    },
    total: data.cashFlow?.operatingCashFlow || 0
  };

  const investing = {
    equipmentPurchase: -12000000,
    vehiclePurchase: -5000000,
    investmentSales: 1245000,
    total: data.cashFlow?.investingCashFlow || 0
  };

  const financing = {
    loanProceeds: 5000000,
    loanRepayments: -2500000,
    dividendPayments: 0,
    total: data.cashFlow?.financingCashFlow || 0
  };

  const beginningCash = 15000000;
  const endingCash = beginningCash + (data.cashFlow?.netCashChange || 0);

  return (
    <div className="bg-white rounded-lg shadow-lg border-2 border-purple-200 p-6 mb-6 print:shadow-none print:border-none">
      {/* Header Controls */}
      <div className="flex justify-between items-center mb-6 print:hidden">
        <h3 className="text-lg font-semibold text-gray-900">Laporan Arus Kas Lengkap</h3>
        <div className="flex space-x-2">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </button>
          <button
            onClick={() => {/* TODO: Implement PDF export */}}
            className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            <Download className="w-4 h-4" />
            <span>PDF</span>
          </button>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Company Header */}
      <div className="text-center mb-6 print:mb-4">
        <h1 className="text-xl font-bold text-gray-900 mb-1">{companyInfo.name}</h1>
        <p className="text-gray-600 text-sm mb-1">{companyInfo.address}</p>
        <h2 className="text-lg font-semibold text-gray-800 mt-3">LAPORAN ARUS KAS</h2>
        <h3 className="text-base text-gray-700">(Metode Tidak Langsung)</h3>
        <p className="text-gray-600 text-sm">{companyInfo.period}</p>
        <p className="text-xs text-gray-500 mt-1">(Dinyatakan dalam Rupiah)</p>
      </div>

      {/* Cash Flow Statement Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b-2 border-gray-800">
              <th className="text-left py-2 font-semibold text-gray-900">KETERANGAN</th>
              <th className="text-right py-2 font-semibold text-gray-900 w-40">JUMLAH (IDR)</th>
            </tr>
          </thead>
          <tbody>
            {/* ARUS KAS DARI AKTIVITAS OPERASI */}
            <tr className="border-b border-gray-200">
              <td className="py-2 font-bold text-base text-gray-900">ARUS KAS DARI AKTIVITAS OPERASI</td>
              <td className="py-2 text-right"></td>
            </tr>
            <tr>
              <td className="py-1 pl-4 text-gray-700">Laba Bersih</td>
              <td className="py-1 text-right">{formatCurrency(operating.netIncome)}</td>
            </tr>

            {/* Penyesuaian */}
            <tr className="border-b border-gray-200">
              <td className="py-2 font-semibold text-gray-900 pt-3">Penyesuaian untuk menyelaraskan laba bersih:</td>
              <td className="py-2 text-right pt-3"></td>
            </tr>
            <tr>
              <td className="py-1 pl-6 text-gray-700">Beban Penyusutan</td>
              <td className="py-1 text-right">{formatCurrency(operating.adjustments.depreciation)}</td>
            </tr>
            <tr>
              <td className="py-1 pl-6 text-gray-700">Beban Amortisasi</td>
              <td className="py-1 text-right">{formatCurrency(operating.adjustments.amortization)}</td>
            </tr>
            <tr>
              <td className="py-1 pl-6 text-gray-700">Beban Piutang Ragu-ragu</td>
              <td className="py-1 text-right">{formatCurrency(operating.adjustments.badDebtExpense)}</td>
            </tr>

            {/* Perubahan modal kerja */}
            <tr className="border-b border-gray-200">
              <td className="py-2 font-semibold text-gray-900 pt-3">Perubahan dalam aset dan kewajiban operasi:</td>
              <td className="py-2 text-right pt-3"></td>
            </tr>
            <tr>
              <td className="py-1 pl-6 text-gray-700">Piutang Usaha</td>
              <td className="py-1 text-right">({formatCurrency(Math.abs(operating.workingCapitalChanges.accountsReceivable))})</td>
            </tr>
            <tr>
              <td className="py-1 pl-6 text-gray-700">Persediaan</td>
              <td className="py-1 text-right">({formatCurrency(Math.abs(operating.workingCapitalChanges.inventory))})</td>
            </tr>
            <tr>
              <td className="py-1 pl-6 text-gray-700">Beban Dibayar di Muka</td>
              <td className="py-1 text-right">({formatCurrency(Math.abs(operating.workingCapitalChanges.prepaidExpenses))})</td>
            </tr>
            <tr>
              <td className="py-1 pl-6 text-gray-700">Utang Usaha</td>
              <td className="py-1 text-right">{formatCurrency(operating.workingCapitalChanges.accountsPayable)}</td>
            </tr>
            <tr>
              <td className="py-1 pl-6 text-gray-700">Beban Terutang</td>
              <td className="py-1 text-right">{formatCurrency(operating.workingCapitalChanges.accruedExpenses)}</td>
            </tr>

            <tr className="border-t-2 border-gray-600">
              <td className="py-3 font-bold text-gray-900">KAS BERSIH DARI AKTIVITAS OPERASI</td>
              <td className="py-3 text-right font-bold text-green-600">{formatCurrency(operating.total)}</td>
            </tr>

            {/* ARUS KAS DARI AKTIVITAS INVESTASI */}
            <tr className="border-b border-gray-200">
              <td className="py-2 font-bold text-base text-gray-900 pt-6">ARUS KAS DARI AKTIVITAS INVESTASI</td>
              <td className="py-2 text-right pt-6"></td>
            </tr>
            <tr>
              <td className="py-1 pl-4 text-gray-700">Pembelian Peralatan</td>
              <td className="py-1 text-right">({formatCurrency(Math.abs(investing.equipmentPurchase))})</td>
            </tr>
            <tr>
              <td className="py-1 pl-4 text-gray-700">Pembelian Kendaraan</td>
              <td className="py-1 text-right">({formatCurrency(Math.abs(investing.vehiclePurchase))})</td>
            </tr>
            <tr>
              <td className="py-1 pl-4 text-gray-700">Penjualan Investasi</td>
              <td className="py-1 text-right">{formatCurrency(investing.investmentSales)}</td>
            </tr>

            <tr className="border-t-2 border-gray-600">
              <td className="py-3 font-bold text-gray-900">KAS BERSIH UNTUK AKTIVITAS INVESTASI</td>
              <td className="py-3 text-right font-bold text-red-600">({formatCurrency(Math.abs(investing.total))})</td>
            </tr>

            {/* ARUS KAS DARI AKTIVITAS PENDANAAN */}
            <tr className="border-b border-gray-200">
              <td className="py-2 font-bold text-base text-gray-900 pt-6">ARUS KAS DARI AKTIVITAS PENDANAAN</td>
              <td className="py-2 text-right pt-6"></td>
            </tr>
            <tr>
              <td className="py-1 pl-4 text-gray-700">Penerimaan Pinjaman Bank</td>
              <td className="py-1 text-right">{formatCurrency(financing.loanProceeds)}</td>
            </tr>
            <tr>
              <td className="py-1 pl-4 text-gray-700">Pembayaran Pinjaman Bank</td>
              <td className="py-1 text-right">({formatCurrency(Math.abs(financing.loanRepayments))})</td>
            </tr>
            <tr>
              <td className="py-1 pl-4 text-gray-700">Pembayaran Dividen</td>
              <td className="py-1 text-right">{formatCurrency(financing.dividendPayments)}</td>
            </tr>

            <tr className="border-t-2 border-gray-600">
              <td className="py-3 font-bold text-gray-900">KAS BERSIH DARI AKTIVITAS PENDANAAN</td>
              <td className="py-3 text-right font-bold text-blue-600">{formatCurrency(financing.total)}</td>
            </tr>

            {/* KENAIKAN BERSIH KAS */}
            <tr className="border-t-2 border-gray-800">
              <td className="py-3 font-bold text-base text-gray-900">KENAIKAN (PENURUNAN) BERSIH KAS</td>
              <td className="py-3 text-right font-bold text-base text-purple-600">{formatCurrency(data.cashFlow?.netCashChange || 0)}</td>
            </tr>

            {/* SALDO KAS */}
            <tr>
              <td className="py-2 font-semibold text-gray-900">KAS DAN SETARA KAS AWAL PERIODE</td>
              <td className="py-2 text-right font-semibold">{formatCurrency(beginningCash)}</td>
            </tr>

            <tr className="border-t-2 border-gray-800">
              <td className="py-3 font-bold text-base text-gray-900">KAS DAN SETARA KAS AKHIR PERIODE</td>
              <td className="py-3 text-right font-bold text-base text-emerald-600">{formatCurrency(endingCash)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Reconciliation Note */}
      <div className="mt-4 p-3 bg-green-50 rounded-lg">
        <h4 className="font-semibold text-green-800 mb-1 text-sm">Rekonsiliasi:</h4>
        <div className="text-sm text-green-700 space-y-1">
          <p><span className="font-medium">Aktivitas Operasi:</span> {formatCurrency(operating.total)}</p>
          <p><span className="font-medium">Aktivitas Investasi:</span> ({formatCurrency(Math.abs(investing.total))})</p>
          <p><span className="font-medium">Aktivitas Pendanaan:</span> {formatCurrency(financing.total)}</p>
          <p className="border-t pt-1 font-semibold"><span className="font-medium">Perubahan Kas Bersih:</span> {formatCurrency(data.cashFlow?.netCashChange || 0)}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 print:mt-6">
        <div className="flex justify-between text-xs text-gray-600">
          <div>
            <p>Disiapkan oleh:</p>
            <div className="mt-8 border-b border-gray-400 w-32"></div>
            <p className="mt-1">Bagian Keuangan</p>
          </div>
          <div>
            <p>Disetujui oleh:</p>
            <div className="mt-8 border-b border-gray-400 w-32"></div>
            <p className="mt-1">Direktur Keuangan</p>
          </div>
        </div>
        <div className="text-center mt-6 text-xs text-gray-500">
          <p>Laporan sesuai PSAK No. 2</p>
        </div>
      </div>
    </div>
  );
};

export default InlineCashFlowStatement;