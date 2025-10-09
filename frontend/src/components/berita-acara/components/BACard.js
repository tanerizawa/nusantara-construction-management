import React from 'react';
import {
  Calendar,
  DollarSign,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { getStatusConfig, getBATypeConfig } from '../config/baStatusConfig';

/**
 * Komponen kartu individual untuk Berita Acara
 */
const BACard = ({ 
  ba, 
  onView, 
  onEdit, 
  onSubmit, 
  onDelete 
}) => {
  const statusConfig = getStatusConfig(ba.status);
  const typeConfig = getBATypeConfig(ba.baType);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* BA Number and Status Badges */}
          <div className="flex items-center space-x-3 mb-2">
            <h5 className="text-lg font-medium text-gray-900">{ba.baNumber}</h5>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
              {statusConfig.label}
            </span>
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {typeConfig.label}
            </span>
          </div>
          
          {/* Work Description */}
          <p className="text-gray-700 mb-2">{ba.workDescription}</p>
          
          {/* BA Details */}
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(ba.completionDate).toLocaleDateString('id-ID')}
            </div>
            <div>
              Progress: {ba.completionPercentage}%
            </div>
            {ba.paymentAmount && (
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 mr-1" />
                {new Intl.NumberFormat('id-ID', { 
                  style: 'currency', 
                  currency: 'IDR',
                  minimumFractionDigits: 0 
                }).format(ba.paymentAmount)}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => onView(ba)}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="View BA"
          >
            <Eye className="w-4 h-4" />
          </button>
          
          {ba.status === 'draft' && (
            <>
              <button
                onClick={() => onEdit(ba)}
                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                title="Edit BA"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onSubmit(ba.id)}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
              >
                Submit
              </button>
              <button
                onClick={() => onDelete(ba.id)}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                title="Delete BA"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}

          {ba.status === 'approved' && ba.paymentAuthorized && (
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
              ✓ Payment Ready
            </div>
          )}
        </div>
      </div>

      {/* Additional Info for Non-Draft Items */}
      {ba.status !== 'draft' && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4 text-sm">
            {ba.submittedAt && (
              <div>
                <span className="text-gray-500">Diajukan:</span>
                <span className="ml-2 text-gray-700">
                  {new Date(ba.submittedAt).toLocaleDateString('id-ID')}
                </span>
              </div>
            )}
            {ba.approvedAt && (
              <div>
                <span className="text-gray-500">Disetujui:</span>
                <span className="ml-2 text-gray-700">
                  {new Date(ba.approvedAt).toLocaleDateString('id-ID')} 
                  {ba.approvedBy && ` oleh ${ba.approvedBy}`}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BACard;
