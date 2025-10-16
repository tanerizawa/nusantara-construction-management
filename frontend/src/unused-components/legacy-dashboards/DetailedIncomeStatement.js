import React from 'react';
import { X, Printer, Download } from 'lucide-react';

const DetailedIncomeStatement = ({ 
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header Controls */}
        <div className="flex justify-between items-center p-6 border-b print:hidden">
          <h2 className="text-xl font-semibold text-gray-900">Laporan Laba Rugi (Income Statement)</h2>
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
            <h2 className="text-xl font-semibold text-gray-800 mt-4">LAPORAN LABA RUGI</h2>
            <p className="text-gray-600">{companyInfo.period}</p>
            <p className="text-sm text-gray-500 mt-2">(Dinyatakan dalam Rupiah, kecuali dinyatakan lain)</p>
          </div>

          {/* Income Statement Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-800">
                  <th className="text-left py-3 font-semibold text-gray-900">KETERANGAN</th>
                  <th className="text-right py-3 font-semibold text-gray-900 w-48">JUMLAH (IDR)</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {/* PENDAPATAN (REVENUE) */}
                <tr className="border-b border-gray-200">
                  <td className="py-3 font-semibold text-gray-900">PENDAPATAN USAHA</td>
                  <td className="py-3 text-right"></td>
                </tr>
                <tr>
                  <td className="py-2 pl-4 text-gray-700">Pendapatan Proyek</td>
                  <td className="py-2 text-right">{formatCurrency(data.breakdown?.income?.categories?.['Project Payment'] || 0)}</td>
                </tr>
                <tr>
                  <td className="py-2 pl-4 text-gray-700">Pendapatan Milestone</td>
                  <td className="py-2 text-right">{formatCurrency(data.breakdown?.income?.categories?.['Milestone Payment'] || 0)}</td>
                </tr>
                <tr>
                  <td className="py-2 pl-4 text-gray-700">Pendapatan Konsultasi</td>
                  <td className="py-2 text-right">{formatCurrency(data.breakdown?.income?.categories?.['Consultation Fee'] || 0)}</td>
                </tr>
                <tr className="border-t border-gray-300">
                  <td className="py-3 font-semibold text-gray-900">TOTAL PENDAPATAN USAHA</td>
                  <td className="py-3 text-right font-semibold border-t border-gray-300">{formatCurrency(data.incomeStatement?.revenue || 0)}</td>
                </tr>

                {/* BEBAN POKOK PENJUALAN (COST OF GOODS SOLD) */}
                <tr className="border-b border-gray-200">
                  <td className="py-3 font-semibold text-gray-900 pt-6">BEBAN POKOK PENJUALAN</td>
                  <td className="py-3 text-right pt-6"></td>
                </tr>
                <tr>
                  <td className="py-2 pl-4 text-gray-700">Beban Material</td>
                  <td className="py-2 text-right">{formatCurrency(data.breakdown?.expense?.categories?.['Material Purchase'] || 0)}</td>
                </tr>
                <tr>
                  <td className="py-2 pl-4 text-gray-700">Beban Subkontraktor</td>
                  <td className="py-2 text-right">{formatCurrency(data.breakdown?.expense?.categories?.['Subcontractor Fee'] || 0)}</td>
                </tr>
                <tr className="border-t border-gray-300">
                  <td className="py-3 font-semibold text-gray-900">TOTAL BEBAN POKOK PENJUALAN</td>
                  <td className="py-3 text-right font-semibold border-t border-gray-300">({formatCurrency(data.incomeStatement?.directCosts || 0)})</td>
                </tr>

                {/* LABA KOTOR (GROSS PROFIT) */}
                <tr className="border-t-2 border-gray-600">
                  <td className="py-3 font-bold text-gray-900">LABA KOTOR</td>
                  <td className="py-3 text-right font-bold text-blue-600">{formatCurrency(data.incomeStatement?.grossProfit || 0)}</td>
                </tr>

                {/* BEBAN OPERASIONAL (OPERATING EXPENSES) */}
                <tr className="border-b border-gray-200">
                  <td className="py-3 font-semibold text-gray-900 pt-6">BEBAN OPERASIONAL</td>
                  <td className="py-3 text-right pt-6"></td>
                </tr>
                <tr>
                  <td className="py-2 pl-4 text-gray-700">Beban Sewa Peralatan</td>
                  <td className="py-2 text-right">{formatCurrency(data.breakdown?.expense?.categories?.['Equipment Rental'] || 0)}</td>
                </tr>
                <tr>
                  <td className="py-2 pl-4 text-gray-700">Beban Kantor</td>
                  <td className="py-2 text-right">{formatCurrency(data.breakdown?.expense?.categories?.['Office Expenses'] || 0)}</td>
                </tr>
                <tr>
                  <td className="py-2 pl-4 text-gray-700">Beban Pemeliharaan Kendaraan</td>
                  <td className="py-2 text-right">{formatCurrency(data.breakdown?.expense?.categories?.['Vehicle Maintenance'] || 0)}</td>
                </tr>
                <tr>
                  <td className="py-2 pl-4 text-gray-700">Beban Depresiasi</td>
                  <td className="py-2 text-right">{formatCurrency(5000000)}</td>
                </tr>
                <tr>
                  <td className="py-2 pl-4 text-gray-700">Beban Administrasi & Umum</td>
                  <td className="py-2 text-right">{formatCurrency(3000000)}</td>
                </tr>
                <tr className="border-t border-gray-300">
                  <td className="py-3 font-semibold text-gray-900">TOTAL BEBAN OPERASIONAL</td>
                  <td className="py-3 text-right font-semibold border-t border-gray-300">({formatCurrency(data.incomeStatement?.indirectCosts || 0)})</td>
                </tr>

                {/* LABA OPERASIONAL */}
                <tr className="border-t border-gray-600">
                  <td className="py-3 font-semibold text-gray-900">LABA OPERASIONAL</td>
                  <td className="py-3 text-right font-semibold text-green-600">{formatCurrency((data.incomeStatement?.grossProfit || 0) - (data.incomeStatement?.indirectCosts || 0))}</td>
                </tr>

                {/* PENDAPATAN DAN BEBAN NON OPERASIONAL */}
                <tr className="border-b border-gray-200">
                  <td className="py-3 font-semibold text-gray-900 pt-6">PENDAPATAN (BEBAN) NON OPERASIONAL</td>
                  <td className="py-3 text-right pt-6"></td>
                </tr>
                <tr>
                  <td className="py-2 pl-4 text-gray-700">Pendapatan Bunga</td>
                  <td className="py-2 text-right">{formatCurrency(500000)}</td>
                </tr>
                <tr>
                  <td className="py-2 pl-4 text-gray-700">Beban Bunga</td>
                  <td className="py-2 text-right">({formatCurrency(300000)})</td>
                </tr>
                <tr>
                  <td className="py-2 pl-4 text-gray-700">Lain-lain</td>
                  <td className="py-2 text-right">{formatCurrency(0)}</td>
                </tr>
                <tr className="border-t border-gray-300">
                  <td className="py-3 font-semibold text-gray-900">TOTAL PENDAPATAN (BEBAN) NON OPERASIONAL</td>
                  <td className="py-3 text-right font-semibold border-t border-gray-300">{formatCurrency(200000)}</td>
                </tr>

                {/* LABA SEBELUM PAJAK */}
                <tr className="border-t border-gray-600">
                  <td className="py-3 font-semibold text-gray-900">LABA SEBELUM PAJAK</td>
                  <td className="py-3 text-right font-semibold">{formatCurrency((data.incomeStatement?.netIncome || 0) + 300000)}</td>
                </tr>

                {/* BEBAN PAJAK */}
                <tr>
                  <td className="py-2 pl-4 text-gray-700">Beban Pajak Penghasilan</td>
                  <td className="py-2 text-right">({formatCurrency(300000)})</td>
                </tr>

                {/* LABA BERSIH */}
                <tr className="border-t-2 border-gray-800">
                  <td className="py-4 font-bold text-lg text-gray-900">LABA BERSIH TAHUN BERJALAN</td>
                  <td className="py-4 text-right font-bold text-lg text-emerald-600">{formatCurrency(data.incomeStatement?.netIncome || 0)}</td>
                </tr>
              </tbody>
            </table>
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
              <p>Laporan ini dibuat sesuai dengan Pernyataan Standar Akuntansi Keuangan (PSAK)</p>
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
          .print\\:block {
            visibility: visible !important;
            display: block !important;
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

export default DetailedIncomeStatement;