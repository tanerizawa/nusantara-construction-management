import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  AlertTriangle,
  DollarSign,
  FileText,
  ShoppingCart,
  Calendar,
  BarChart3,
  Users,
  Settings,
  Home,
  FolderOpen
} from 'lucide-react';

const ProjectWorkflowSidebar = ({ projectId, project, activeTab, onTabChange, onActionTrigger }) => {
  const [workflowData, setWorkflowData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkflowData();
    fetchNotifications();
  }, [projectId]);

  const fetchWorkflowData = async () => {
    try {
      setWorkflowData({
        currentStage: 'planning',
        rab: { pendingApproval: 0 },
        approvals: { pending: 0 },
        purchaseOrders: { pending: 0 }
      });
    } catch (error) {
      console.error('Error fetching workflow data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      setNotifications([]);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const workflowTabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: Home,
      description: 'Project Overview & Summary'
    },
    {
      id: 'rab-workflow',
      label: 'RAB Management',
      icon: DollarSign,
      description: 'Rencana Anggaran Biaya'
    },
    {
      id: 'approval-status',
      label: 'Approval Status',
      icon: CheckCircle,
      description: 'Document Approvals'
    },
    {
      id: 'purchase-orders',
      label: 'Purchase Orders',
      icon: ShoppingCart,
      description: 'Procurement Management'
    },
    {
      id: 'budget-monitoring',
      label: 'Budget Monitoring',
      icon: BarChart3,
      description: 'Financial Tracking'
    },
    {
      id: 'team',
      label: 'Team Management',
      icon: Users,
      description: 'Human Resources'
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: FileText,
      description: 'Project Documents'
    }
  ];

  const handleTabClick = (tabId) => {
    onTabChange(tabId);
  };

  const urgentNotifications = notifications.filter(n => n.urgent);

  if (loading) {
    return (
      <div className="p-4 h-fit">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Project Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold mb-1 truncate">
          {project?.name || 'Project Details'}
        </h2>
        <p className="text-sm text-gray-600 line-clamp-2">
          {typeof project?.location === 'object' && project?.location ? 
            `${project.location.address || ''}, ${project.location.city || ''}, ${project.location.province || ''}`.replace(/^,\s*|,\s*$|,\s*,/g, '').trim() || 'Project Location'
            : project?.location || 'Project Location'
          }
        </p>
        <div className="mt-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            PLANNING
          </span>
        </div>
      </div>

      {/* Urgent Notifications */}
      {urgentNotifications.length > 0 && (
        <div className="p-3 bg-red-50 border-b border-red-200">
          <div className="flex items-center text-red-800 font-medium text-sm mb-2">
            <AlertTriangle size={16} className="mr-2" />
            Urgent Actions
          </div>
          {urgentNotifications.map(notification => (
            <div key={notification.id} className="text-red-700 text-xs mb-1">
              • {notification.message}
            </div>
          ))}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex-1 overflow-y-auto">
        {workflowTabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 transition-colors border-l-3 ${
                isActive 
                  ? 'bg-blue-50 text-blue-700 border-blue-500 font-medium' 
                  : 'text-gray-700 border-transparent hover:text-gray-900'
              }`}
            >
              <div className="flex items-center min-w-0 flex-1">
                <div className="flex-shrink-0 mr-3">
                  <IconComponent size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">
                    {tab.label}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {tab.description}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="p-3 border-t border-gray-200 space-y-2">
        <button
          className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          onClick={() => onActionTrigger?.('open-files')}
        >
          <FolderOpen size={16} className="mr-2" />
          Project Files
        </button>
        <button
          className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          onClick={() => onActionTrigger?.('generate-report')}
        >
          <BarChart3 size={16} className="mr-2" />
          Generate Report
        </button>
      </div>
    </div>
  );
};

export default ProjectWorkflowSidebar;
