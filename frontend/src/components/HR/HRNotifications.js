import React, { useState, useEffect } from 'react';
import { DataCard, Button } from '../DataStates';
import {
  Bell,
  Mail,
  Award,
  CheckCircle,
  Clock,
  BookOpen,
  Shield,
  Target,
  Send,
  Plus,
  Search,
  MoreVertical,
  Trash2,
  Eye,
  Settings
} from 'lucide-react';

const HRNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('notifications');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Mock notification data
  const mockNotifications = [
    {
      id: 1,
      type: 'training',
      title: 'Safety Training Reminder',
      message: 'Annual safety training is due for 15 employees. Please ensure completion by end of month.',
      recipients: ['EMP-001', 'EMP-003', 'EMP-005'],
      priority: 'high',
      status: 'sent',
      createdAt: '2024-08-28T10:00:00Z',
      sentAt: '2024-08-28T10:05:00Z',
      readCount: 2,
      totalRecipients: 15,
      category: 'compliance',
      automated: true
    },
    {
      id: 2,
      type: 'performance',
      title: 'Q3 Performance Review Due',
      message: 'Performance reviews for Q3 2024 are now open. Managers should complete reviews by September 15.',
      recipients: ['MGR-001', 'MGR-002', 'MGR-003'],
      priority: 'medium',
      status: 'scheduled',
      createdAt: '2024-08-27T15:30:00Z',
      scheduledFor: '2024-09-01T09:00:00Z',
      readCount: 0,
      totalRecipients: 8,
      category: 'performance',
      automated: false
    },
    {
      id: 3,
      type: 'payroll',
      title: 'Payslip Available',
      message: 'August 2024 payslips are now available for download in the employee portal.',
      recipients: 'all_employees',
      priority: 'low',
      status: 'sent',
      createdAt: '2024-08-25T08:00:00Z',
      sentAt: '2024-08-25T08:00:00Z',
      readCount: 45,
      totalRecipients: 50,
      category: 'payroll',
      automated: true
    },
    {
      id: 4,
      type: 'certification',
      title: 'Certificate Expiry Alert',
      message: 'PMP certification for Ahmad Rizki expires in 30 days. Renewal required.',
      recipients: ['EMP-003', 'MGR-001'],
      priority: 'high',
      status: 'sent',
      createdAt: '2024-08-26T14:00:00Z',
      sentAt: '2024-08-26T14:00:00Z',
      readCount: 1,
      totalRecipients: 2,
      category: 'compliance',
      automated: true
    },
    {
      id: 5,
      type: 'announcement',
      title: 'Company Holiday Notice',
      message: 'Office will be closed on August 31st for Independence Day celebration.',
      recipients: 'all_employees',
      priority: 'medium',
      status: 'draft',
      createdAt: '2024-08-28T16:00:00Z',
      readCount: 0,
      totalRecipients: 0,
      category: 'general',
      automated: false
    }
  ];

  // Mock notification templates
  const mockTemplates = [
    {
      id: 1,
      name: 'Training Reminder',
      type: 'training',
      subject: 'Training Completion Required',
      body: 'Dear {{employee_name}}, your {{training_name}} is due by {{due_date}}. Please complete it as soon as possible.',
      variables: ['employee_name', 'training_name', 'due_date'],
      category: 'compliance',
      usage: 25
    },
    {
      id: 2,
      name: 'Performance Review',
      type: 'performance',
      subject: 'Performance Review Available',
      body: 'Hello {{employee_name}}, your performance review for {{period}} is now available. Please review and provide feedback.',
      variables: ['employee_name', 'period'],
      category: 'performance',
      usage: 12
    },
    {
      id: 3,
      name: 'Welcome Message',
      type: 'onboarding',
      subject: 'Welcome to the Team!',
      body: 'Welcome {{employee_name}}! We are excited to have you join our {{department}} team. Your first day is {{start_date}}.',
      variables: ['employee_name', 'department', 'start_date'],
      category: 'onboarding',
      usage: 8
    },
    {
      id: 4,
      name: 'Certificate Expiry',
      type: 'certification',
      subject: 'Certificate Expiring Soon',
      body: 'Your {{certificate_name}} will expire on {{expiry_date}}. Please renew it before the deadline.',
      variables: ['certificate_name', 'expiry_date'],
      category: 'compliance',
      usage: 15
    }
  ];

  const [newNotification, setNewNotification] = useState({
    type: 'announcement',
    title: '',
    message: '',
    recipients: '',
    priority: 'medium',
    category: 'general',
    scheduledFor: ''
  });

  useEffect(() => {
    // Simulate API calls
    setTimeout(() => {
      setNotifications(mockNotifications);
      setTemplates(mockTemplates);
      setLoading(false);
    }, 1000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || notification.type === filterType;
    const matchesStatus = !filterStatus || notification.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'training': return BookOpen;
      case 'performance': return Target;
      case 'payroll': return Mail;
      case 'certification': return Award;
      case 'safety': return Shield;
      case 'announcement': return Bell;
      default: return Bell;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'sent': return 'text-green-600 bg-green-100';
      case 'scheduled': return 'text-blue-600 bg-blue-100';
      case 'draft': return 'text-gray-600 bg-gray-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const sendNotification = async (notificationId) => {
    try {
      setNotifications(notifications.map(notif =>
        notif.id === notificationId 
          ? { ...notif, status: 'sent', sentAt: new Date().toISOString() }
          : notif
      ));
      alert('Notification sent successfully!');
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      setNotifications(notifications.filter(notif => notif.id !== notificationId));
    }
  };

  const createNotification = async () => {
    try {
      const notification = {
        ...newNotification,
        id: Date.now(),
        status: newNotification.scheduledFor ? 'scheduled' : 'draft',
        createdAt: new Date().toISOString(),
        readCount: 0,
        totalRecipients: newNotification.recipients === 'all_employees' ? 50 : 
          newNotification.recipients.split(',').length,
        automated: false
      };
      
      setNotifications([notification, ...notifications]);
      setShowCreateModal(false);
      setNewNotification({
        type: 'announcement',
        title: '',
        message: '',
        recipients: '',
        priority: 'medium',
        category: 'general',
        scheduledFor: ''
      });
      
      alert('Notification created successfully!');
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  const stats = {
    total: notifications.length,
    sent: notifications.filter(n => n.status === 'sent').length,
    scheduled: notifications.filter(n => n.status === 'scheduled').length,
    draft: notifications.filter(n => n.status === 'draft').length,
    totalReads: notifications.reduce((sum, n) => sum + n.readCount, 0),
    avgReadRate: notifications.length > 0 ? 
      (notifications.reduce((sum, n) => sum + (n.readCount / (n.totalRecipients || 1)), 0) / notifications.length * 100).toFixed(1) : 0
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">HR Notifications</h2>
          <p className="text-gray-600 mt-1">Manage and send notifications to employees</p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Notification
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <DataCard
          title="Total Notifications"
          value={stats.total}
          icon={Bell}
          color="blue"
        />
        <DataCard
          title="Sent"
          value={stats.sent}
          icon={CheckCircle}
          color="green"
        />
        <DataCard
          title="Scheduled"
          value={stats.scheduled}
          icon={Clock}
          color="blue"
        />
        <DataCard
          title="Drafts"
          value={stats.draft}
          icon={Mail}
          color="gray"
        />
        <DataCard
          title="Total Reads"
          value={stats.totalReads}
          icon={Eye}
          color="purple"
        />
        <DataCard
          title="Avg Read Rate"
          value={`${stats.avgReadRate}%`}
          icon={Target}
          color="yellow"
        />
      </div>

      {/* Tabs */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="flex overflow-x-auto">
          {[
            { id: 'notifications', label: 'Notifications', count: notifications.length },
            { id: 'templates', label: 'Templates', count: templates.length },
            { id: 'analytics', label: 'Analytics', count: 0 },
            { id: 'settings', label: 'Settings', count: 0 }
          ].map(({ id, label, count }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                activeTab === id
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {label}
              {count > 0 && (
                <span className="ml-2 px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'notifications' && (
          <>
            {/* Filters */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search notifications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Types</option>
                  <option value="training">Training</option>
                  <option value="performance">Performance</option>
                  <option value="payroll">Payroll</option>
                  <option value="certification">Certification</option>
                  <option value="announcement">Announcement</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="sent">Sent</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
              {filteredNotifications.map((notification) => {
                const IconComponent = getNotificationIcon(notification.type);
                return (
                  <div key={notification.id} className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-blue-600" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{notification.title}</h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(notification.priority)}`}>
                              {notification.priority}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(notification.status)}`}>
                              {notification.status}
                            </span>
                            {notification.automated && (
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-600">
                                automated
                              </span>
                            )}
                          </div>
                          
                          <p className="text-gray-600 mb-3">{notification.message}</p>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Recipients:</span>
                              <span className="ml-1 font-medium">
                                {notification.recipients === 'all_employees' ? 'All Employees' : 
                                 Array.isArray(notification.recipients) ? notification.recipients.length : 
                                 notification.totalRecipients}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Read Rate:</span>
                              <span className="ml-1 font-medium">
                                {notification.totalRecipients > 0 ? 
                                  `${((notification.readCount / notification.totalRecipients) * 100).toFixed(0)}%` : 
                                  '0%'
                                } ({notification.readCount}/{notification.totalRecipients})
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Created:</span>
                              <span className="ml-1 font-medium">
                                {new Date(notification.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">
                                {notification.status === 'scheduled' ? 'Scheduled:' : 'Sent:'}
                              </span>
                              <span className="ml-1 font-medium">
                                {notification.status === 'scheduled' && notification.scheduledFor ? 
                                  new Date(notification.scheduledFor).toLocaleString() :
                                  notification.sentAt ? new Date(notification.sentAt).toLocaleString() : 
                                  'Not sent'
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        {notification.status === 'draft' && (
                          <Button
                            onClick={() => sendNotification(notification.id)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Send className="w-4 h-4 mr-1" />
                            Send
                          </Button>
                        )}
                        
                        <Button
                          onClick={() => alert('Notification details will be shown here')}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>

                        <Button
                          onClick={() => deleteNotification(notification.id)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredNotifications.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm || filterType || filterStatus 
                      ? 'Try adjusting your search or filter criteria'
                      : 'Create your first notification to get started'
                    }
                  </p>
                  {!searchTerm && !filterType && !filterStatus && (
                    <Button
                      onClick={() => setShowCreateModal(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Notification
                    </Button>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'templates' && (
          <div className="space-y-4">
            {templates.map((template) => (
              <div key={template.id} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-600 capitalize">
                        {template.type}
                      </span>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                        Used {template.usage} times
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-2">
                      <strong>Subject:</strong> {template.subject}
                    </p>
                    <p className="text-gray-600 mb-3">{template.body}</p>
                    
                    <div className="flex flex-wrap gap-1">
                      <span className="text-sm text-gray-500 mr-2">Variables:</span>
                      {template.variables.map((variable, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded">
                          {variable}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      Use Template
                    </Button>
                    <Button className="bg-gray-600 hover:bg-gray-700 text-white">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Notification Analytics</h3>
            <p className="text-gray-600">Detailed analytics and reporting will be available here</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Notification Settings</h3>
            <p className="text-gray-600">Configure notification preferences and automation rules</p>
          </div>
        )}
      </div>

      {/* Create Notification Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Create New Notification</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    value={newNotification.type}
                    onChange={(e) => setNewNotification({...newNotification, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="announcement">Announcement</option>
                    <option value="training">Training</option>
                    <option value="performance">Performance</option>
                    <option value="payroll">Payroll</option>
                    <option value="certification">Certification</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={newNotification.priority}
                    onChange={(e) => setNewNotification({...newNotification, priority: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={newNotification.title}
                  onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter notification title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={newNotification.message}
                  onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter notification message"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipients
                </label>
                <select
                  value={newNotification.recipients}
                  onChange={(e) => setNewNotification({...newNotification, recipients: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select recipients</option>
                  <option value="all_employees">All Employees</option>
                  <option value="managers">All Managers</option>
                  <option value="hr_team">HR Team</option>
                  <option value="custom">Custom List</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={newNotification.scheduledFor}
                  onChange={(e) => setNewNotification({...newNotification, scheduledFor: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <Button
                onClick={() => setShowCreateModal(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={createNotification}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!newNotification.title || !newNotification.message || !newNotification.recipients}
              >
                Create Notification
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HRNotifications;
