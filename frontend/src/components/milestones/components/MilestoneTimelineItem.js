import React from 'react';
import { Edit, Trash2, Calendar, DollarSign } from 'lucide-react';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { getStatusInfo, isOverdue } from '../config/statusConfig';

const MilestoneTimelineItem = ({ 
  milestone, 
  index, 
  isLast,
  onEdit, 
  onDelete,
  onProgressUpdate 
}) => {
  const statusInfo = getStatusInfo(isOverdue(milestone) ? 'overdue' : milestone.status);
  const Icon = statusInfo.icon;

  return (
    <div className="p-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className={`w-10 h-10 rounded-full bg-${statusInfo.color}-100 flex items-center justify-center`}>
            <Icon size={20} className={`text-${statusInfo.color}-600`} />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h5 className="text-lg font-semibold text-gray-900">
                {milestone.name}
              </h5>
              <p className="text-gray-600 mt-1">{milestone.description}</p>
              
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  Target: {formatDate(milestone.targetDate)}
                </div>
                {milestone.actualDate && (
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    Actual: {formatDate(milestone.actualDate)}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <DollarSign size={14} />
                  Budget: {formatCurrency(milestone.budget)}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>{milestone.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`bg-${statusInfo.color}-600 h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${milestone.progress}%` }}
                  />
                </div>
              </div>

              {/* Deliverables */}
              {milestone.deliverables && milestone.deliverables.length > 0 && (
                <div className="mt-4">
                  <h6 className="text-sm font-medium text-gray-900 mb-2">Deliverables:</h6>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {milestone.deliverables.map((deliverable, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                        {deliverable}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {milestone.notes && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{milestone.notes}</p>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 ml-4">
              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium bg-${statusInfo.color}-100 text-${statusInfo.color}-800`}>
                {statusInfo.text}
              </span>
              <button
                onClick={onEdit}
                className="text-blue-600 hover:text-blue-800"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={onDelete}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          {/* Progress Update */}
          {milestone.status !== 'completed' && (
            <div className="mt-4 flex items-center gap-2">
              <label className="text-sm font-medium">Update Progress:</label>
              <input
                type="range"
                min="0"
                max="100"
                value={milestone.progress}
                onChange={(e) => onProgressUpdate(milestone.id, parseInt(e.target.value))}
                className="flex-1 max-w-xs"
              />
              <span className="text-sm font-mono w-12">{milestone.progress}%</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Connection Line */}
      {!isLast && (
        <div className="ml-5 mt-4 h-8 w-0.5 bg-gray-200" />
      )}
    </div>
  );
};

export default MilestoneTimelineItem;
