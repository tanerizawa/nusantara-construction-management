import React from 'react';
import { 
  ShoppingCart, 
  Users, 
  FileText, 
  Truck, 
  Receipt, 
  CheckCircle, 
  AlertTriangle,
  Clock
} from 'lucide-react';
import { getAvailableActions, getWorkflowStatusBadge } from '../utils/workflowLogic';
import { getItemTypeConfig } from '../config/rabCategories';

/**
 * RABItemActions Component
 * Displays available actions for RAB item based on its type and workflow status
 */
const RABItemActions = ({ 
  item, 
  onActionExecute, 
  loading = false 
}) => {
  const availableActions = getAvailableActions(item);
  const statusBadge = getWorkflowStatusBadge(item);
  const itemTypeConfig = getItemTypeConfig(item.itemType);

  const getActionIcon = (iconName) => {
    const icons = {
      ShoppingCart: ShoppingCart,
      Users: Users,
      FileText: FileText,
      Truck: Truck,
      Receipt: Receipt,
      CheckCircle: CheckCircle,
      AlertTriangle: AlertTriangle,
      Clock: Clock
    };
    return icons[iconName] || Clock;
  };

  const getActionButtonClass = (actionType) => {
    const baseClass = "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all duration-200";
    
    switch(actionType) {
      case 'primary':
        return `${baseClass} bg-[#0A84FF]/20 text-[#0A84FF] hover:bg-[#0A84FF]/30`;
      case 'success':
        return `${baseClass} bg-[#30D158]/20 text-[#30D158] hover:bg-[#30D158]/30`;
      case 'info':
        return `${baseClass} bg-[#5AC8FA]/20 text-[#5AC8FA] hover:bg-[#5AC8FA]/30`;
      case 'purple':
        return `${baseClass} bg-[#AF52DE]/20 text-[#AF52DE] hover:bg-[#AF52DE]/30`;
      case 'yellow':
        return `${baseClass} bg-[#FFD60A]/20 text-[#FFD60A] hover:bg-[#FFD60A]/30`;
      case 'gray':
        return `${baseClass} bg-[#8E8E93]/20 text-[#8E8E93] hover:bg-[#8E8E93]/30`;
      case 'warning':
        return `${baseClass} bg-[#FF9F0A]/20 text-[#FF9F0A] hover:bg-[#FF9F0A]/30`;
      default:
        return `${baseClass} bg-[#48484A]/20 text-white hover:bg-[#48484A]/30`;
    }
  };

  const getStatusBadgeClass = (color) => {
    const baseClass = "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium";
    
    switch(color) {
      case 'green':
        return `${baseClass} bg-[#30D158]/20 text-[#30D158]`;
      case 'blue':
        return `${baseClass} bg-[#0A84FF]/20 text-[#0A84FF]`;
      case 'purple':
        return `${baseClass} bg-[#AF52DE]/20 text-[#AF52DE]`;
      case 'yellow':
        return `${baseClass} bg-[#FFD60A]/20 text-[#FFD60A]`;
      case 'orange':
        return `${baseClass} bg-[#FF9F0A]/20 text-[#FF9F0A]`;
      case 'indigo':
        return `${baseClass} bg-[#5856D6]/20 text-[#5856D6]`;
      case 'gray':
      default:
        return `${baseClass} bg-[#8E8E93]/20 text-[#8E8E93]`;
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Item Type & Status - Simplified */}
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <span className={getStatusBadgeClass(statusBadge.color)}>
          {statusBadge.label}
        </span>
      </div>

      {/* Workflow Actions - Compact */}
      {availableActions.length > 0 && (
        <div className="flex items-center gap-1 flex-wrap justify-center">
          {availableActions.map((action) => {
            const Icon = getActionIcon(action.icon);
            
            return (
              <button
                key={action.id}
                onClick={() => onActionExecute(action.id, item)}
                disabled={action.disabled || loading}
                className={getActionButtonClass(action.type)}
                title={action.description || action.label}
              >
                <Icon className="w-3 h-3" />
                <span className="hidden md:inline">{action.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RABItemActions;