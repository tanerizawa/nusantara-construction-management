import React from 'react';
import { X, Printer, Download } from 'lucide-react';

const DetailedCashFlowStatement = ({ 
  isOpen, 
  onClose, 
  data, 
  companyInfo = {
    name: "PT. NUSANTARA KONSTRUKSI",
    address: "Jakarta, Indonesia",
    period: "Untuk Tahun yang Berakhir 31 Desember 2024"
  }
}) => {
  if (!isOpen || !data) return null;

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
    landPurchase: 0,
    investmentSales: 1245000,
    total: data.cashFlow?.investingCashFlow || 0
  };

  const financing = {
    loanProceeds: 5000000,
    loanRepayments: -2500000,
    dividendPayments: 0,
    capitalContribution: 0,
    total: data.cashFlow?.financingCashFlow || 0
  };

  const beginningCash = 15000000;
  const endingCash = beginningCash + (data.cashFlow?.netCashChange || 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header Controls */}
        <div className="flex justify-between items-center p-6 border-b print:hidden">
          <h2 className="text-xl font-semibold text-gray-900">Laporan Arus Kas (Cash Flow Statement)</h2>
          <div className="flex space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
            <button
              onClick={() => {/* TODO: Implement PDF export */}}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Report Content */}
        <div className="p-8 print:p-0">
          {/* Company Header */}
          <div className="text-center mb-8 print:mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{companyInfo.name}</h1>
            <p className="text-gray-600 mb-1">{companyInfo.address}</p>
            <h2 className="text-xl font-semibold text-gray-800 mt-4">LAPORAN ARUS KAS</h2>
            <h3 className="text-lg text-gray-700">(Metode Tidak Langsung)</h3>
            <p className="text-gray-600">{companyInfo.period}</p>
            <p className="text-sm text-gray-500 mt-2">(Dinyatakan dalam Rupiah, kecuali dinyatakan lain)</p>
          </div>

          {/* Cash Flow Statement Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-800">
                  <th className="text-left py-3 font-semibold text-gray-900">KETERANGAN</th>
                  <th className="text-right py-3 font-semibold text-gray-900 w-48">JUMLAH (IDR)</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {/* ARUS KAS DARI AKTIVITAS OPERASI */}
                <tr className="border-b border-gray-200">
                  <td className="py-3 font-bold text-lg text-gray-900">ARUS KAS DARI AKTIVITAS OPERASI</td>
                  <td className="py-3 text-right"></td>
                </tr>
                <tr>
                  <td className="py-2 pl-4 text-gray-700">Laba Bersih</td>
                  <td className="py-2 text-right">{formatCurrency(operating.netIncome)}</td>
                </tr>

                {/* Penyesuaian untuk menyelaraskan laba bersih */}
                <tr className="border-b border-gray-200">
                  <td className="py-3 font-semibold text-gray-900 pt-4">Penyesuaian untuk menyelaraskan laba bersih dengan kas bersih yang diperoleh dari aktivitas operasi:</td>
                  <td className="py-3 text-right pt-4"></td>
                </tr>
                <tr>
                  <td className="py-2 pl-8 text-gray-700">Beban Penyusutan</td>
                  <td className="py-2 text-right">{formatCurrency(operating.adjustments.depreciation)}</td>
                </tr>
                <tr>
                  <td className="py-2 pl-8 text-gray-700">Beban Amortisasi</td>
                  <td className="py-2 text-right">{formatCurrency(operating.adjustments.amortization)}</td>
                </tr>
                <tr>
                  <td className="py-2 pl-8 text-gray-700">Beban Piutang Ragu-ragu</td>
                  <td className="py-2 text-right">{formatCurrency(operating.adjustments.badDebtExpense)}</td>
                </tr>

                {/* Perubahan dalam aset dan kewajiban operasi */}
                <tr className="border-b border-gray-200">
                  <td className="py-3 font-semibold text-gray-900 pt-4">Perubahan dalam aset dan kewajiban operasi:</td>
                  <td className="py-3 text-right pt-4"></td>
                </tr>
                <tr>
                  <td className="py-2 pl-8 text-gray-700">Piutang Usaha</td>
                  <td className="py-2 text-right">({formatCurrency(Math.abs(operating.workingCapitalChanges.accountsReceivable))})</td>
                </tr>
                <tr>
                  <td className="py-2 pl-8 text-gray-700">Persediaan</td>
                  <td className="py-2 text-right">({formatCurrency(Math.abs(operating.workingCapitalChanges.inventory))})</td>
                </tr>
                <tr>
                  <td className="py-2 pl-8 text-gray-700">Beban Dibayar di Muka</td>
                  <td className="py-2 text-right">({formatCurrency(Math.abs(operating.workingCapitalChanges.prepaidExpenses))})</td>
                </tr>
                <tr>
                  <td className="py-2 pl-8 text-gray-700">Utang Usaha</td>
                  <td className="py-2 text-right">{formatCurrency(operating.workingCapitalChanges.accountsPayable)}</td>
                </tr>
                <tr>
                  <td className="py-2 pl-8 text-gray-700">Beban yang Masih Harus Dibayar</td>
                  <td className="py-2 text-right">{formatCurrency(operating.workingCapitalChanges.accruedExpenses)}</td>
                </tr>

                <tr className="border-t-2 border-gray-600">
                  <td className="py-4 font-bold text-gray-900">KAS BERSIH YANG DIPEROLEH DARI AKTIVITAS OPERASI</td>
                  <td className="py-4 text-right font-bold text-green-600">{formatCurrency(operating.total)}</td>
                </tr>

                {/* ARUS KAS DARI AKTIVITAS INVESTASI */}
                <tr className="border-b border-gray-200">
                  <td className="py-3 font-bold text-lg text-gray-900 pt-8">ARUS KAS DARI AKTIVITAS INVESTASI</td>
                  <td className="py-3 text-right pt-8"></td>
                </tr>
                <tr>
                  <td className="py-2 pl-4 text-gray-700">Pembelian Peralatan</td>
                  <td className="py-2 text-right">({formatCurrency(Math.abs(investing.equipmentPurchase))})</td>
                </tr>
                <tr>
                  <td className="py-2 pl-4 text-gray-700">Pembelian Kendaraan</td>
                  <td className="py-2 text-right">({formatCurrency(Math.abs(investing.vehiclePurchase))})</td>
                </tr>
                <tr>
                  <td className="py-2 pl-4 text-gray-700">Penjualan Investasi</td>
                  <td className="py-2 text-right">{formatCurrency(investing.investmentSales)}</td>
                </tr>

                <tr className="border-t-2 border-gray-600">
                  <td className="py-4 font-bold text-gray-900">KAS BERSIH YANG DIGUNAKAN UNTUK AKTIVITAS INVESTASI</td>
                  <td className="py-4 text-right font-bold text-red-600">({formatCurrency(Math.abs(investing.total))})</td>
                </tr>

                {/* ARUS KAS DARI AKTIVITAS PENDANAAN */}
                <tr className="border-b border-gray-200">
                  <td className="py-3 font-bold text-lg text-gray-900 pt-8">ARUS KAS DARI AKTIVITAS PENDANAAN</td>
                  <td className="py-3 text-right pt-8"></td>
                </tr>
                <tr>
                  <td className="py-2 pl-4 text-gray-700">Penerimaan Pinjaman Bank</td>
                  <td className="py-2 text-right">{formatCurrency(financing.loanProceeds)}</td>
                </tr>
                <tr>
                  <td className="py-2 pl-4 text-gray-700">Pembayaran Pinjaman Bank</td>
                  <td className="py-2 text-right">({formatCurrency(Math.abs(financing.loanRepayments))})</td>
                </tr>
                <tr>
                  <td className="py-2 pl-4 text-gray-700">Pembayaran Dividen</td>
                  <td className="py-2 text-right">{formatCurrency(financing.dividendPayments)}</td>
                </tr>

                <tr className="border-t-2 border-gray-600">
                  <td className="py-4 font-bold text-gray-900">KAS BERSIH YANG DIPEROLEH DARI AKTIVITAS PENDANAAN</td>
                  <td className="py-4 text-right font-bold text-blue-600">{formatCurrency(financing.total)}</td>
                </tr>

                {/* KENAIKAN (PENURUNAN) BERSIH KAS */}
                <tr className="border-t-2 border-gray-800">
                  <td className="py-4 font-bold text-lg text-gray-900">KENAIKAN (PENURUNAN) BERSIH KAS DAN SETARA KAS</td>
                  <td className="py-4 text-right font-bold text-lg text-purple-600">{formatCurrency(data.cashFlow?.netCashChange || 0)}</td>
                </tr>

                {/* SALDO KAS */}
                <tr>
                  <td className="py-3 font-semibold text-gray-900">KAS DAN SETARA KAS AWAL PERIODE</td>
                  <td className="py-3 text-right font-semibold">{formatCurrency(beginningCash)}</td>
                </tr>

                <tr className="border-t-2 border-gray-800">
                  <td className="py-4 font-bold text-lg text-gray-900">KAS DAN SETARA KAS AKHIR PERIODE</td>
                  <td className="py-4 text-right font-bold text-lg text-emerald-600">{formatCurrency(endingCash)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Reconciliation Note */}
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">Rekonsiliasi:</h4>
            <div className="text-sm text-green-700 space-y-1">
              <p><span className="font-medium">Aktivitas Operasi:</span> {formatCurrency(operating.total)}</p>
              <p><span className="font-medium">Aktivitas Investasi:</span> ({formatCurrency(Math.abs(investing.total))})</p>
              <p><span className="font-medium">Aktivitas Pendanaan:</span> {formatCurrency(financing.total)}</p>
              <p className="border-t pt-1 font-semibold"><span className="font-medium">Perubahan Kas Bersih:</span> {formatCurrency(data.cashFlow?.netCashChange || 0)}</p>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Catatan Tambahan:</h4>
            <div className="text-sm text-gray-700 space-y-1">
              <p>• Kas dan setara kas terdiri dari kas di bank dan deposito jangka pendek</p>
              <p>• Tidak ada transaksi investasi dan pendanaan non-kas yang signifikan</p>
              <p>• Bunga yang dibayar sebesar {formatCurrency(300000)} diklasifikasikan sebagai aktivitas operasi</p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 print:mt-8">
            <div className="flex justify-between text-sm text-gray-600">
              <div>
                <p>Disiapkan oleh:</p>
                <div className="mt-12 border-b border-gray-400 w-48"></div>
                <p className="mt-2">Bagian Keuangan</p>
              </div>
              <div>
                <p>Disetujui oleh:</p>
                <div className="mt-12 border-b border-gray-400 w-48"></div>
                <p className="mt-2">Direktur Keuangan</p>
              </div>
            </div>
            <div className="text-center mt-8 text-xs text-gray-500">
              <p>Laporan ini dibuat sesuai dengan Pernyataan Standar Akuntansi Keuangan (PSAK) No. 2</p>
              <p>Dicetak pada: {new Date().toLocaleDateString('id-ID', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .fixed {
            position: static !important;
          }
          .fixed > div {
            visibility: visible !important;
            position: static !important;
            background: white !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            max-width: none !important;
            max-height: none !important;
            overflow: visible !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:p-0 {
            padding: 0 !important;
          }
          .print\\:mb-6 {
            margin-bottom: 1.5rem !important;
          }
          .print\\:mt-8 {
            margin-top: 2rem !important;
          }
          @page {
            margin: 1in;
            size: A4;
          }
        }
      `}</style>
    </div>
  );
};

export default DetailedCashFlowStatement;