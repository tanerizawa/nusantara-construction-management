import React from 'react';
import { formatCurrency } from '../utils';
import StatusBadge from './StatusBadge';

/**
 * Component for displaying tax data in a table
 * @param {Object} props Component props
 * @param {Array} props.taxes Array of tax data
 * @param {boolean} props.compact Whether to use compact mode
 * @returns {JSX.Element} Tax table UI
 */
const TaxTable = ({ taxes, compact }) => {
  return (
    <div className={`card overflow-hidden ${compact ? 'density-compact' : ''}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="table-header">Tanggal</th>
              <th className="table-header">Jenis Pajak</th>
              <th className="table-header">Deskripsi</th>
              <th className="table-header">Jumlah</th>
              <th className="table-header">Periode</th>
              <th className="table-header">Jatuh Tempo</th>
              <th className="table-header">Status</th>
              <th className="table-header">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {taxes.map((tax) => (
              <tr key={tax.id} className="hover:bg-gray-50">
                <td className="table-cell">
                  {new Date(tax.date).toLocaleDateString('id-ID')}
                </td>
                <td className="table-cell">
                  <span className="font-medium text-blue-600">{tax.type}</span>
                </td>
                <td className="table-cell">
                  <div className="font-medium text-gray-900">
                    {tax.desc || tax.description}
                  </div>
                  {tax.reference && (
                    <div className="text-sm text-gray-500">
                      Ref: {tax.reference}
                    </div>
                  )}
                </td>
                <td className="table-cell">
                  <span className="font-bold text-gray-900">
                    {formatCurrency(tax.amount)}
                  </span>
                </td>
                <td className="table-cell">
                  {tax.period || '-'}
                </td>
                <td className="table-cell">
                  {tax.dueDate ? new Date(tax.dueDate).toLocaleDateString('id-ID') : '-'}
                </td>
                <td className="table-cell">
                  <StatusBadge status={tax.status || 'pending'} />
                </td>
                <td className="table-cell">
                  <div className="flex space-x-2">
                    {tax.status !== 'paid' && (
                      <button className="text-green-600 hover:text-green-900 text-sm">Bayar</button>
                    )}
                    <button className="text-blue-600 hover:text-blue-900 text-sm">Edit</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaxTable;