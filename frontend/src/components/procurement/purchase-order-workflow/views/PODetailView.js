import React from 'react';
import { Download } from 'lucide-react';
import { formatCurrency, formatDate, formatNumber } from '../utils/poUtils';
import { COMPANY_INFO, PO_TERMS, APPROVAL_ROLES, PO_ITEM_HEADERS } from '../config/poConfig';

/**
 * Purchase Order Detail View Component
 */
const PODetailView = ({ po, onBack }) => {
  const printPO = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header Actions - Hide on print */}
      <div className="flex items-center justify-between mb-6 print:hidden">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Purchase Order Official</h2>
          <p className="text-gray-600">PO Number: {po.poNumber}</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={printPO}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Print/Download
          </button>
          <button
            onClick={onBack}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Kembali
          </button>
        </div>
      </div>

      {/* Official PO Document */}
      <div className="bg-white border rounded-lg shadow-lg print:shadow-none print:border-none">
        {/* Company Letterhead */}
        <POLetterhead po={po} />

        {/* Vendor and Project Information */}
        <div className="p-8">
          <VendorProjectInfo po={po} />

          {/* Items Table */}
          <POItemsTable po={po} />

          {/* Terms and Conditions */}
          <POTermsConditions po={po} />

          {/* Approval Signatures */}
          <POApprovalSignatures po={po} />

          {/* Footer */}
          <POFooter />
        </div>
      </div>
    </div>
  );
};

/**
 * Company Letterhead Component
 */
const POLetterhead = ({ po }) => {
  return (
    <div className="border-b-2 border-blue-600 p-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-600 mb-2">{COMPANY_INFO.name}</h1>
          <p className="text-lg font-semibold text-gray-800 mb-1">{COMPANY_INFO.subtitle}</p>
          <div className="text-sm text-gray-600 space-y-1">
            <p>{COMPANY_INFO.address}</p>
            <p>Telp: {COMPANY_INFO.phone} | Fax: {COMPANY_INFO.fax}</p>
            <p>Email: {COMPANY_INFO.email} | Website: {COMPANY_INFO.website}</p>
            <p>NPWP: {COMPANY_INFO.npwp}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h2 className="text-xl font-bold text-blue-600 mb-2">PURCHASE ORDER</h2>
            <div className="text-sm space-y-1">
              <p><span className="font-medium">No. PO:</span> {po.poNumber}</p>
              <p><span className="font-medium">Tanggal:</span> {formatDate(po.orderDate)}</p>
              <p><span className="font-medium">Status:</span> 
                <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded ${
                  po.status === 'approved' ? 'bg-green-100 text-green-800' :
                  po.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  po.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {po.status?.toUpperCase()}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Vendor and Project Information Component
 */
const VendorProjectInfo = ({ po }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
      {/* Vendor Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
          KEPADA SUPPLIER:
        </h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="font-semibold text-lg text-gray-800 mb-2">{po.supplierName}</p>
          <p className="text-sm text-gray-600">Supplier ID: {po.supplierId}</p>
          <div className="mt-3 text-sm text-gray-600">
            <p>Alamat: {po.supplierAddress || '[Alamat Supplier]'}</p>
            <p>Telp: {po.supplierContact || '[No. Telepon]'}</p>
            <p>Email: [Email Supplier]</p>
          </div>
        </div>
      </div>

      {/* Project Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
          INFORMASI PROYEK:
        </h3>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="font-semibold text-lg text-blue-800 mb-2">{po.projectName || 'Nama Proyek'}</p>
          <div className="text-sm text-gray-700 space-y-1">
            <p><span className="font-medium">Kode Proyek:</span> {po.projectId || '-'}</p>
            <p><span className="font-medium">Lokasi:</span> {po.deliveryAddress || 'Karawang, Jawa Barat'}</p>
            <p><span className="font-medium">Target Pengiriman:</span> {po.expectedDeliveryDate ? 
              formatDate(po.expectedDeliveryDate) : '-'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * PO Items Table Component
 */
const POItemsTable = ({ po }) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
        DETAIL ITEM PEMESANAN:
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              {PO_ITEM_HEADERS.map((header) => (
                <th 
                  key={header.key}
                  className={`border border-gray-300 px-4 py-3 text-${header.align} text-sm font-semibold`}
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {po.items?.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-3 text-center">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-3 font-medium">{item.itemName}</td>
                <td className="border border-gray-300 px-4 py-3 text-sm text-gray-600">
                  {item.description || '-'}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center">
                  {formatNumber(item.quantity)}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center">{item.unit || 'Unit'}</td>
                <td className="border border-gray-300 px-4 py-3 text-right">
                  {formatCurrency(item.unitPrice)}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-right font-medium">
                  {formatCurrency(item.totalPrice)}
                </td>
              </tr>
            ))}
            {/* Summary Row */}
            <tr className="bg-gray-50 font-semibold">
              <td colSpan="6" className="border border-gray-300 px-4 py-3 text-right">
                TOTAL KESELURUHAN:
              </td>
              <td className="border border-gray-300 px-4 py-3 text-right text-lg text-blue-600">
                {formatCurrency(po.totalAmount)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

/**
 * Terms and Conditions Component
 */
const POTermsConditions = ({ po }) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
        SYARAT DAN KETENTUAN:
      </h3>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="text-sm text-gray-700 space-y-2">
          {PO_TERMS.map((term, index) => (
            <p key={index}>• {term}</p>
          ))}
          {po.notes && (
            <p className="mt-3 font-medium">• Catatan Khusus: {po.notes}</p>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Approval Signatures Component
 */
const POApprovalSignatures = ({ po }) => {
  return (
    <div className="border-t-2 border-gray-200 pt-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-6 text-center">
        PERSETUJUAN PURCHASE ORDER
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {APPROVAL_ROLES.map((role, index) => (
          <ApprovalSignatureBox 
            key={index}
            role={role}
            po={po}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * Individual Approval Signature Box
 */
const ApprovalSignatureBox = ({ role, po }) => {
  const getColorClasses = (color) => {
    switch (color) {
      case 'blue':
        return 'border-blue-300 bg-blue-50 text-blue-800 border-blue-300 text-blue-500';
      case 'green':
        return 'border-green-300 bg-green-50 text-green-800 border-green-300 text-green-500';
      default:
        return 'border-gray-300 bg-gray-50 text-gray-800 border-gray-300 text-gray-500';
    }
  };

  const colorClasses = getColorClasses(role.color);
  const [borderColor, bgColor, textColor, borderTopColor, placeholderColor] = colorClasses.split(' ');

  return (
    <div className="text-center">
      <div className={`border-2 border-dashed ${borderColor} rounded-lg p-6 h-32 flex flex-col justify-between ${bgColor}`}>
        <div>
          <p className={`font-semibold ${textColor} mb-2`}>{role.role}</p>
          <p className={`text-sm ${textColor.replace('800', '600')}`}>{role.title}</p>
        </div>
        <div className={`border-t ${borderTopColor} pt-2`}>
          <p className={`text-xs ${placeholderColor}`}>Tanda Tangan & Nama</p>
        </div>
      </div>
      <div className="mt-3 text-sm">
        <p className="font-medium">
          {role.role === 'DISETUJUI OLEH' ? (po.approvedBy || '[Nama General Manager]') : `[Nama ${role.title}]`}
        </p>
        <p className="text-gray-600">
          Tanggal: {
            role.role === 'DISETUJUI OLEH' && po.approvedAt ? 
              formatDate(po.approvedAt) :
            role.role === 'DIBUAT OLEH' ?
              formatDate(po.createdAt || po.orderDate) :
              '_______________'
          }
        </p>
      </div>
    </div>
  );
};

/**
 * PO Footer Component
 */
const POFooter = () => {
  return (
    <div className="text-center text-xs text-gray-500 mt-8 pt-4 border-t border-gray-200">
      <p>Dokumen ini dibuat secara elektronik dan sah tanpa tanda tangan basah</p>
      <p>PT Nusantara Group - Sistem Manajemen Konstruksi v1.0</p>
      <p>Dicetak pada: {new Date().toLocaleString('id-ID')}</p>
    </div>
  );
};

export default PODetailView;