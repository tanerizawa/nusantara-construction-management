import React from 'react';
import { Eye } from 'lucide-react';
import { getStatusColor, getStatusIcon, formatCurrency, formatDate } from '../utils/poUtils';

/**
 * Purchase Order Card Component
 */
const POCard = ({ po, onView }) => {
  const StatusIcon = getStatusIcon(po.status);
  
  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center space-x-3 mb-2">
            <StatusIcon className={`h-5 w-5 ${getStatusColor(po.status).split(' ')[0]}`} />
            <h3 className="text-lg font-medium text-gray-900">{po.poNumber}</h3>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(po.status)}`}>
              {po.status}
            </span>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">Supplier</p>
              <p className="font-medium">{po.supplierName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="font-medium text-green-600">{formatCurrency(po.totalAmount)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Order Date</p>
              <p className="font-medium">{formatDate(po.orderDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Project</p>
              <p className="font-medium">{po.projectName || '-'}</p>
            </div>
          </div>

          {/* Items Preview */}
          <div className="bg-gray-50 rounded p-3 mb-4">
            <p className="text-sm text-gray-600 font-medium mb-1">Items ({po.items?.length || 0})</p>
            <div className="flex flex-wrap gap-1">
              {po.items?.slice(0, 3).map((item, index) => (
                <span key={index} className="inline-flex px-2 py-1 text-xs bg-white rounded border">
                  {item.itemName}
                </span>
              ))}
              {po.items?.length > 3 && (
                <span className="inline-flex px-2 py-1 text-xs bg-gray-200 rounded">
                  +{po.items.length - 3} lainnya
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onView(po)}
              className="flex items-center px-3 py-1 text-sm border rounded hover:bg-gray-50"
            >
              <Eye className="h-4 w-4 mr-1" />
              Lihat Detail
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POCard;