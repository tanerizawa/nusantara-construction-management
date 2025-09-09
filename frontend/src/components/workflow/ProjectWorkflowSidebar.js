import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Users, 
  DollarSign, 
  ShoppingCart,
  BarChart3,
  CheckCircle,
  Clock,
  AlertTriangle,
  Plus,
  Filter,
  Search,
  ArrowRight,
  Activity,
  Briefcase,
  Calculator,
  Target,
  TrendingUp,
  Bell,
  MessageSquare,
  Calendar,
  FileCheck,
  User,
  ChevronRight,
  Home,
  FolderOpen,
  Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProjectWorkflowSidebar = ({ projectId, project, activeTab, onTabChange, onActionTrigger }) => {
  const navigate = useNavigate();
  const [workflowData, setWorkflowData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkflowData();
    fetchNotifications();
  }, [projectId]);

  const fetchWorkflowData = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/workflow-status`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setWorkflowData(data.data);
      }
    } catch (error) {
      console.error('Error fetching workflow data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/notifications`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in_progress': return Activity;
      case 'pending': return Clock;
      case 'overdue': return AlertTriangle;
      default: return Clock;
    }
  };

  const workflowTabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: Home,
      description: 'Project summary'
    },
    {
      id: 'rab',
      label: 'RAB Management',
      icon: Calculator,
      description: 'Budget & cost estimation',
      badge: workflowData?.rab?.pendingApproval || 0
    },
    {
      id: 'approvals',
      label: 'Approval Flow',
      icon: CheckCircle,
      description: 'Approval tracking',
      badge: workflowData?.approvals?.pending || 0
    },
    {
      id: 'purchase-orders',
      label: 'Purchase Orders',
      icon: ShoppingCart,
      description: 'PO management',
      badge: workflowData?.purchaseOrders?.pending || 0
    },
    {
      id: 'budget',
      label: 'Budget Monitor',
      icon: BarChart3,
      description: 'Budget tracking'
    },
    {
      id: 'manpower',
      label: 'Manpower',
      icon: Users,
      description: 'Team management'
    }
  ];

  const quickActions = [
    {
      id: 'create-rab',
      label: 'Create RAB',
      icon: Calculator,
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => onActionTrigger('create-rab')
    },
    {
      id: 'create-po',
      label: 'Create PO',
      icon: ShoppingCart,
      color: 'bg-green-500 hover:bg-green-600',
      action: () => onActionTrigger('create-po')
    },
    {
      id: 'add-approval',
      label: 'Add Approval',
      icon: FileCheck,
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => onActionTrigger('add-approval')
    },
    {
      id: 'assign-team',
      label: 'Assign Team',
      icon: User,
      color: 'bg-orange-500 hover:bg-orange-600',
      action: () => onActionTrigger('assign-team')
    }
  ];

  if (loading) {
    return (
      <div className="w-80 bg-white border-r border-gray-200 h-full">
        <div className="p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-full flex flex-col">
      {/* Project Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-medium text-gray-900 truncate">{project?.name}</h2>
            <p className="text-xs text-gray-500 truncate">{project?.location}</p>
          </div>
        </div>
        
        {/* Project Progress */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Progress</span>
            <span>{workflowData?.progress || 0}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${workflowData?.progress || 0}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-3">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Workflow Navigation
          </h3>
          
          <div className="space-y-1">
            {workflowTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${isActive ? 'text-blue-900' : 'text-gray-900'}`}>
                        {tab.label}
                      </p>
                      <p className={`text-xs ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                        {tab.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {tab.badge > 0 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {tab.badge}
                      </span>
                    )}
                    <ChevronRight className={`h-3 w-3 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-3 border-t border-gray-200">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Quick Actions
          </h3>
          
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              
              return (
                <button
                  key={action.id}
                  onClick={action.action}
                  className={`flex flex-col items-center p-3 rounded-lg text-white transition-colors ${action.color}`}
                >
                  <Icon className="h-5 w-5 mb-1" />
                  <span className="text-xs font-medium">{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Workflow Status */}
        <div className="p-3 border-t border-gray-200">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Current Status
          </h3>
          
          <div className="space-y-3">
            {workflowData?.currentTasks?.map((task, index) => {
              const StatusIcon = getStatusIcon(task.status);
              
              return (
                <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                  <div className={`p-1 rounded-full ${getStatusColor(task.status)}`}>
                    <StatusIcon className="h-3 w-3" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
                    <p className="text-xs text-gray-500">{task.assignee}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Notifications
              </h3>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {notifications.length}
              </span>
            </div>
            
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {notifications.slice(0, 3).map((notification, index) => (
                <div key={index} className="flex items-start space-x-2 p-2 rounded-lg hover:bg-gray-50">
                  <Bell className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-900 line-clamp-2">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.timeAgo}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {notifications.length > 3 && (
              <button className="w-full mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium">
                View all notifications
              </button>
            )}
          </div>
        )}

        {/* Key Metrics */}
        <div className="p-3 border-t border-gray-200">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Key Metrics
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-gray-700">Budget Used</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {workflowData?.budget?.usedPercentage || 0}%
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-700">Timeline</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {workflowData?.timeline?.status || 'On Track'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-purple-500" />
                <span className="text-sm text-gray-700">Team Size</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {workflowData?.team?.activeMembers || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => navigate('/projects')}
            className="flex items-center justify-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FolderOpen className="h-4 w-4 mr-1" />
            All Projects
          </button>
          
          <button className="flex items-center justify-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
            <Settings className="h-4 w-4 mr-1" />
            Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectWorkflowSidebar;
