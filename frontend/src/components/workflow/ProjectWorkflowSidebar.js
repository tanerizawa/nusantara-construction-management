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
  FolderOpen,
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react';

const ProjectWorkflowSidebar = ({ projectId, project, activeTab, onTabChange, onActionTrigger }) => {
  const [workflowData, setWorkflowData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

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
    <div className={`h-full flex flex-col transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      {/* Collapse Toggle Header */}
      <div className="p-3 border-b border-gray-200 flex items-center justify-between">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold truncate">
            {project?.name || 'Project Details'}
          </h2>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 text-gray-600" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          )}
        </button>
      </div>

      {/* Project Info - Only show when expanded */}
      {!isCollapsed && (
        <div className="px-4 py-2 border-b border-gray-200">
          <div className="text-sm text-gray-600">
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
          
          {/* Urgent Notifications - Compact */}
          {urgentNotifications.length > 0 && (
            <div className="mt-2 bg-red-50 border border-red-200 rounded-lg p-2">
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                <span className="text-xs text-red-700 font-medium">
                  {urgentNotifications.length} urgent item(s)
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex-1 overflow-y-auto">
        {workflowTabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <div key={tab.id} className="relative group">
              <button
                onClick={() => handleTabClick(tab.id)}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2 py-4' : 'px-4 py-3'} text-left hover:bg-gray-50 transition-colors border-l-3 ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700 border-blue-500 font-medium' 
                    : 'text-gray-700 border-transparent hover:text-gray-900'
                }`}
                title={isCollapsed ? `${tab.label} - ${tab.description}` : undefined}
              >
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'min-w-0 flex-1'}`}>
                  <div className="flex-shrink-0">
                    <IconComponent size={isCollapsed ? 20 : 18} />
                  </div>
                  {!isCollapsed && (
                    <div className="min-w-0 flex-1 ml-3">
                      <div className="text-sm font-medium truncate">
                        {tab.label}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {tab.description}
                      </div>
                    </div>
                  )}
                </div>
              </button>
              
              {/* Tooltip for collapsed mode */}
              {isCollapsed && (
                <div className="absolute left-full top-0 ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  <div className="font-medium">{tab.label}</div>
                  <div className="text-xs text-gray-300">{tab.description}</div>
                  <div className="absolute top-3 -left-1 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className={`border-t border-gray-200 ${isCollapsed ? 'p-2' : 'p-3'}`}>
        {!isCollapsed ? (
          <div className="space-y-2">
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
        ) : (
          <div className="space-y-2">
            <div className="relative group">
              <button
                className="w-full flex items-center justify-center p-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => onActionTrigger?.('open-files')}
                title="Project Files"
              >
                <FolderOpen size={16} />
              </button>
              <div className="absolute left-full top-0 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                Project Files
                <div className="absolute top-2 -left-1 w-2 h-2 bg-gray-900 transform rotate-45"></div>
              </div>
            </div>
            <div className="relative group">
              <button
                className="w-full flex items-center justify-center p-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => onActionTrigger?.('generate-report')}
                title="Generate Report"
              >
                <BarChart3 size={16} />
              </button>
              <div className="absolute left-full top-0 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                Generate Report
                <div className="absolute top-2 -left-1 w-2 h-2 bg-gray-900 transform rotate-45"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectWorkflowSidebar;