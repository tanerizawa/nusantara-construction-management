import React from 'react';
import { Printer, Download, X } from 'lucide-react';

const InlineIncomeStatement = ({ 
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

  return (
    <div className="bg-white rounded-lg shadow-lg border-2 border-blue-200 p-6 mb-6 print:shadow-none print:border-none">
      {/* Header Controls */}
      <div className="flex justify-between items-center mb-6 print:hidden">
        <h3 className="text-lg font-semibold text-gray-900">Laporan Laba Rugi Lengkap</h3>
        <div className="flex space-x-2">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak</span>
          </button>
          <button
            onClick={() => {/* TODO: Implement PDF export */}}
            className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            <Download className="w-4 h-4" />
            <span>Unduh PDF</span>
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
        <h2 className="text-lg font-semibold text-gray-800 mt-3">LAPORAN LABA RUGI</h2>
        <p className="text-gray-600 text-sm">{companyInfo.period}</p>
        <p className="text-xs text-gray-500 mt-1">(Dinyatakan dalam Rupiah)</p>
      </div>

      {/* Income Statement Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b-2 border-gray-800">
              <th className="text-left py-2 font-semibold text-gray-900">KETERANGAN</th>
              <th className="text-right py-2 font-semibold text-gray-900 w-40">JUMLAH (IDR)</th>
            </tr>
          </thead>
          <tbody>
            {/* PENDAPATAN */}
            <tr className="border-b border-gray-200">
              <td className="py-2 font-semibold text-gray-900">PENDAPATAN USAHA</td>
              <td className="py-2 text-right"></td>
            </tr>
            <tr>
              <td className="py-1 pl-4 text-gray-700">Pendapatan Proyek</td>
              <td className="py-1 text-right">{formatCurrency(data.breakdown?.income?.categories?.['Project Payment'] || 0)}</td>
            </tr>
            <tr>
              <td className="py-1 pl-4 text-gray-700">Pendapatan Milestone</td>
              <td className="py-1 text-right">{formatCurrency(data.breakdown?.income?.categories?.['Milestone Payment'] || 0)}</td>
            </tr>
            <tr>
              <td className="py-1 pl-4 text-gray-700">Pendapatan Konsultasi</td>
              <td className="py-1 text-right">{formatCurrency(data.breakdown?.income?.categories?.['Consultation Fee'] || 0)}</td>
            </tr>
            <tr className="border-t border-gray-300">
              <td className="py-2 font-semibold text-gray-900">TOTAL PENDAPATAN USAHA</td>
              <td className="py-2 text-right font-semibold border-t border-gray-300">{formatCurrency(data.incomeStatement?.revenue || 0)}</td>
            </tr>

            {/* BEBAN POKOK PENJUALAN */}
            <tr className="border-b border-gray-200">
              <td className="py-2 font-semibold text-gray-900 pt-4">BEBAN POKOK PENJUALAN</td>
              <td className="py-2 text-right pt-4"></td>
            </tr>
            <tr>
              <td className="py-1 pl-4 text-gray-700">Beban Material</td>
              <td className="py-1 text-right">{formatCurrency(data.breakdown?.expense?.categories?.['Material Purchase'] || 0)}</td>
            </tr>
            <tr>
              <td className="py-1 pl-4 text-gray-700">Beban Subkontraktor</td>
              <td className="py-1 text-right">{formatCurrency(data.breakdown?.expense?.categories?.['Subcontractor Fee'] || 0)}</td>
            </tr>
            <tr className="border-t border-gray-300">
              <td className="py-2 font-semibold text-gray-900">TOTAL BEBAN POKOK PENJUALAN</td>
              <td className="py-2 text-right font-semibold border-t border-gray-300">({formatCurrency(data.incomeStatement?.directCosts || 0)})</td>
            </tr>

            {/* LABA KOTOR */}
            <tr className="border-t-2 border-gray-600">
              <td className="py-2 font-bold text-gray-900">LABA KOTOR</td>
              <td className="py-2 text-right font-bold text-blue-600">{formatCurrency(data.incomeStatement?.grossProfit || 0)}</td>
            </tr>

            {/* BEBAN OPERASIONAL */}
            <tr className="border-b border-gray-200">
              <td className="py-2 font-semibold text-gray-900 pt-4">BEBAN OPERASIONAL</td>
              <td className="py-2 text-right pt-4"></td>
            </tr>
            <tr>
              <td className="py-1 pl-4 text-gray-700">Beban Sewa Peralatan</td>
              <td className="py-1 text-right">{formatCurrency(data.breakdown?.expense?.categories?.['Equipment Rental'] || 0)}</td>
            </tr>
            <tr>
              <td className="py-1 pl-4 text-gray-700">Beban Kantor</td>
              <td className="py-1 text-right">{formatCurrency(data.breakdown?.expense?.categories?.['Office Expenses'] || 0)}</td>
            </tr>
            <tr>
              <td className="py-1 pl-4 text-gray-700">Beban Pemeliharaan Kendaraan</td>
              <td className="py-1 text-right">{formatCurrency(data.breakdown?.expense?.categories?.['Vehicle Maintenance'] || 0)}</td>
            </tr>
            <tr>
              <td className="py-1 pl-4 text-gray-700">Beban Administrasi & Umum</td>
              <td className="py-1 text-right">{formatCurrency(8000000)}</td>
            </tr>
            <tr className="border-t border-gray-300">
              <td className="py-2 font-semibold text-gray-900">TOTAL BEBAN OPERASIONAL</td>
              <td className="py-2 text-right font-semibold border-t border-gray-300">({formatCurrency(data.incomeStatement?.indirectCosts || 0)})</td>
            </tr>

            {/* LABA BERSIH */}
            <tr className="border-t-2 border-gray-800">
              <td className="py-3 font-bold text-lg text-gray-900">LABA BERSIH TAHUN BERJALAN</td>
              <td className="py-3 text-right font-bold text-lg text-emerald-600">{formatCurrency(data.incomeStatement?.netIncome || 0)}</td>
            </tr>
          </tbody>
        </table>
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
          <p>Laporan sesuai Pernyataan Standar Akuntansi Keuangan (PSAK)</p>
        </div>
      </div>
    </div>
  );
};

export default InlineIncomeStatement;
