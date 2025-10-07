import React from 'react';
import { ShoppingCart, CheckCircle, Clock, XCircle, DollarSign } from 'lucide-react';
import { formatCurrency } from '../../../../utils/formatters';

/**
 * PO Summary Component
 * Displays summary statistics for purchase orders
 */
const POSummary = ({ purchaseOrders }) => {
  // Calculate statistics
  const stats = React.useMemo(() => {
    if (!purchaseOrders || !Array.isArray(purchaseOrders)) {
      return {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        totalValue: 0
      };
    }
    
    return purchaseOrders.reduce((acc, po) => {
      const value = parseFloat(po.totalAmount || po.total_amount) || 0;
      const status = po.status?.toLowerCase() || 'pending';
      
      acc.total++;
      acc.totalValue += value;
      
      if (status === 'pending' || status === 'draft') {
        acc.pending++;
      } else if (status === 'approved') {
        acc.approved++;
      } else if (status === 'rejected') {
        acc.rejected++;
      }
      
      return acc;
    }, {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      totalValue: 0
    });
  }, [purchaseOrders]);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {/* Total POs */}
      <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total PO</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <ShoppingCart className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>
      
      {/* Pending POs */}
      <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Menunggu</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
            <Clock className="w-6 h-6 text-yellow-600" />
          </div>
        </div>
      </div>
      
      {/* Approved POs */}
      <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Disetujui</p>
            <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>
      
      {/* Rejected POs */}
      <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Ditolak</p>
            <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
          </div>
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>
      
      {/* Total Value */}
      <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Nilai</p>
            <p className="text-lg font-bold text-gray-900" title={formatCurrency(stats.totalValue)}>
              {formatCurrency(stats.totalValue, true)}
            </p>
          </div>
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSummary;
