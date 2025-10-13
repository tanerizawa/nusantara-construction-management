import React from 'react';
import {
  Calendar,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  Send,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { getStatusConfig, getBATypeConfig } from '../config/baStatusConfig';
import { formatCurrency, formatDate } from '../../../utils/formatters';

/**
 * Komponen kartu individual untuk Berita Acara
 * Dark theme with compact, modern design
 */
const BACard = ({ 
  ba, 
  onView, 
  onEdit, 
  onSubmit, 
  onDelete,
  onApprove,
  onReject
}) => {
  const statusConfig = getStatusConfig(ba.status);
  const typeConfig = getBATypeConfig(ba.baType);

  return (
    <div className="px-4 py-3 hover:bg-[#1C1C1E] transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* BA Number and Status Badges - Compact single line */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h5 className="text-sm font-semibold text-white">{ba.baNumber}</h5>
            <span 
              className="px-2 py-0.5 rounded text-xs font-medium"
              style={{
                backgroundColor: statusConfig.bgColor,
                color: statusConfig.color
              }}
            >
              {statusConfig.label}
            </span>
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-[#48484A] text-[#8E8E93]">
              {typeConfig.label}
            </span>
            {ba.status === 'approved' && ba.paymentAuthorized && (
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-[rgba(48,209,88,0.1)] text-[#30D158]">
                ✓ Payment Ready
              </span>
            )}
          </div>
          
          {/* Work Description - Compact */}
          <p className="text-sm text-[#8E8E93] mb-2 line-clamp-1">{ba.workDescription}</p>
          
          {/* BA Details - Compact inline */}
          <div className="flex items-center gap-4 text-xs text-[#98989D]">
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              <span>{formatDate(ba.completionDate)}</span>
            </div>
            <div>
              Progress: {ba.completionPercentage}%
            </div>
            {ba.paymentAmount && (
              <div className="flex items-center gap-1">
                <DollarSign size={12} />
                <span>{formatCurrency(ba.paymentAmount)}</span>
              </div>
            )}
          </div>

          {/* Additional Info for Non-Draft Items - Compact */}
          {ba.status !== 'draft' && (ba.submittedAt || ba.approvedAt) && (
            <div className="mt-2 pt-2 border-t border-[#38383A]">
              <div className="flex items-center gap-4 text-xs text-[#98989D]">
                {ba.submittedAt && (
                  <div>
                    Diajukan: <span className="text-[#8E8E93]">{formatDate(ba.submittedAt)}</span>
                  </div>
                )}
                {ba.approvedAt && (
                  <div>
                    Disetujui: <span className="text-[#8E8E93]">
                      {formatDate(ba.approvedAt)}
                      {ba.approvedBy && ` oleh ${ba.approvedBy}`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons - Compact */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => onView(ba)}
            className="p-1.5 text-[#8E8E93] hover:text-[#0A84FF] hover:bg-[#0A84FF]/10 rounded transition-colors"
            title="View BA"
          >
            <Eye size={14} />
          </button>
          
          {ba.status === 'draft' && (
            <>
              <button
                onClick={() => onEdit(ba)}
                className="p-1.5 text-[#8E8E93] hover:text-[#0A84FF] hover:bg-[#0A84FF]/10 rounded transition-colors"
                title="Edit BA"
              >
                <Edit size={14} />
              </button>
              <button
                onClick={() => onSubmit(ba.id)}
                className="bg-[#0A84FF] text-white px-2.5 py-1 rounded text-xs hover:bg-[#0A84FF]/90 transition-colors flex items-center gap-1"
              >
                <Send size={12} />
                Submit
              </button>
              <button
                onClick={() => onDelete(ba.id)}
                className="p-1.5 text-[#8E8E93] hover:text-[#FF3B30] hover:bg-[#FF3B30]/10 rounded transition-colors"
                title="Delete BA"
              >
                <Trash2 size={14} />
              </button>
            </>
          )}
          
          {ba.status === 'submitted' && onApprove && onReject && (
            <>
              <button
                onClick={() => onApprove(ba.id)}
                className="p-1.5 text-[#30D158] hover:bg-[#30D158]/10 rounded transition-colors"
                title="Approve BA"
              >
                <CheckCircle size={14} />
              </button>
              <button
                onClick={() => onReject(ba.id)}
                className="p-1.5 text-[#FF3B30] hover:bg-[#FF3B30]/10 rounded transition-colors"
                title="Reject BA"
              >
                <XCircle size={14} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BACard;
