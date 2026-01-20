import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  Check, 
  CheckCheck,
  Trash2, 
  Filter, 
  Search, 
  RefreshCw, 
  Settings,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Info,
  Zap,
  FileText,
  Calendar,
  Users,
  Building2,
  Wallet,
  ChevronDown,
  ExternalLink,
  MoreVertical,
  Archive,
  BellOff
} from 'lucide-react';
import { apiClient } from '../../services/api';
import './NotificationsPage.css';

/**
 * NotificationsPage Component
 * Comprehensive notification center with advanced features
 */
const NotificationsPage = () => {
  const navigate = useNavigate();
  
  // State
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('all'); // all, unread, read
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 15;
  
  // Selection
  const [selectedIds, setSelectedIds] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Categories for filtering
  const categories = [
    { value: 'all', label: 'Semua Kategori', icon: Bell },
    { value: 'approval', label: 'Persetujuan', icon: FileText },
    { value: 'project', label: 'Proyek', icon: Building2 },
    { value: 'finance', label: 'Keuangan', icon: Wallet },
    { value: 'attendance', label: 'Kehadiran', icon: Calendar },
    { value: 'hr', label: 'SDM', icon: Users },
    { value: 'system', label: 'Sistem', icon: Settings },
  ];

  // Fetch notifications
  const fetchNotifications = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const params = {
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
        unreadOnly: statusFilter === 'unread'
      };

      const response = await apiClient.get('/notifications', { params });
      const data = response.data?.data || response.data || {};
      
      let notificationList = [];
      
      // Handle approval notifications format
      if (Array.isArray(data.notifications)) {
        notificationList = data.notifications.map(n => ({
          id: n.id,
          title: n.subject || n.title || 'Notifikasi',
          message: n.message,
          type: n.notificationType || n.notification_type || n.type || 'info',
          category: getCategoryFromType(n.notificationType || n.notification_type || n.type),
          status: n.status,
          read: n.status !== 'pending' && n.status !== 'unread',
          priority: n.priority || 'normal',
          createdAt: n.created_at || n.createdAt,
          readAt: n.read_at || n.readAt,
          metadata: n.metadata || {},
          actionUrl: n.action_url || n.actionUrl,
          instanceId: n.instanceId || n.instance_id,
          stepId: n.stepId || n.step_id
        }));
      }

      // If empty, add welcome/system notifications
      if (notificationList.length === 0 && currentPage === 1 && statusFilter === 'all') {
        notificationList = getDefaultNotifications();
      }

      setNotifications(notificationList);
      setTotalCount(data.total || notificationList.length);
      
      // Cache in localStorage
      localStorage.setItem('notifications_cache', JSON.stringify({
        data: notificationList,
        timestamp: Date.now()
      }));

    } catch (err) {
      console.error('Error fetching notifications:', err);
      
      // Try to load from cache
      const cached = localStorage.getItem('notifications_cache');
      if (cached) {
        const { data: cachedData } = JSON.parse(cached);
        setNotifications(cachedData);
        setTotalCount(cachedData.length);
      } else {
        setNotifications(getDefaultNotifications());
        setTotalCount(0);
      }
      
      setError('Gagal memuat notifikasi. Menampilkan data tersimpan.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentPage, statusFilter, itemsPerPage]);

  // Get category from notification type
  const getCategoryFromType = (type) => {
    if (!type) return 'system';
    const typeStr = type.toLowerCase();
    
    if (typeStr.includes('approval') || typeStr.includes('rab') || typeStr.includes('po')) return 'approval';
    if (typeStr.includes('project') || typeStr.includes('milestone')) return 'project';
    if (typeStr.includes('finance') || typeStr.includes('payment') || typeStr.includes('invoice')) return 'finance';
    if (typeStr.includes('attendance') || typeStr.includes('leave') || typeStr.includes('clock')) return 'attendance';
    if (typeStr.includes('hr') || typeStr.includes('employee')) return 'hr';
    
    return 'system';
  };

  // Default/welcome notifications when empty
  const getDefaultNotifications = () => [
    {
      id: 'welcome-1',
      title: 'Selamat Datang di Nusantara Group!',
      message: 'Terima kasih telah bergabung. Notifikasi penting akan muncul di sini.',
      type: 'info',
      category: 'system',
      status: 'read',
      read: true,
      priority: 'normal',
      createdAt: new Date().toISOString(),
      isSystem: true
    },
    {
      id: 'tip-1',
      title: 'Tips: Atur Preferensi Notifikasi',
      message: 'Kunjungi Pengaturan > Notifikasi untuk mengatur jenis notifikasi yang ingin Anda terima.',
      type: 'info',
      category: 'system',
      status: 'read',
      read: true,
      priority: 'low',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      isSystem: true,
      actionUrl: '/settings/notifications'
    }
  ];

  // Initial load
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Listen for real-time notifications
  useEffect(() => {
    const handleNewNotification = (event) => {
      const notification = event.detail;
      setNotifications(prev => [{
        ...notification,
        id: notification.id || Date.now(),
        createdAt: notification.timestamp || new Date().toISOString(),
        read: false
      }, ...prev]);
    };

    window.addEventListener('nusantara-notification', handleNewNotification);
    return () => window.removeEventListener('nusantara-notification', handleNewNotification);
  }, []);

  // Mark as read
  const markAsRead = async (id) => {
    try {
      await apiClient.put(`/notifications/${id}/read`);
    } catch (e) {
      // Continue even if API fails
    }

    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true, status: 'read', readAt: new Date().toISOString() } : n)
    );
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await apiClient.put('/notifications/mark-all-read');
    } catch (e) {
      // Continue even if API fails
    }

    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true, status: 'read', readAt: new Date().toISOString() }))
    );
    setSelectedIds([]);
  };

  // Delete notification
  const deleteNotification = async (id) => {
    try {
      await apiClient.delete(`/notifications/${id}`);
    } catch (e) {
      // Continue even if API fails
    }

    setNotifications(prev => prev.filter(n => n.id !== id));
    setSelectedIds(prev => prev.filter(i => i !== id));
  };

  // Bulk delete
  const deleteSelected = async () => {
    if (selectedIds.length === 0) return;
    
    if (!window.confirm(`Hapus ${selectedIds.length} notifikasi terpilih?`)) return;

    for (const id of selectedIds) {
      try {
        await apiClient.delete(`/notifications/${id}`);
      } catch (e) {
        // Continue
      }
    }

    setNotifications(prev => prev.filter(n => !selectedIds.includes(n.id)));
    setSelectedIds([]);
  };

  // Mark selected as read
  const markSelectedAsRead = async () => {
    for (const id of selectedIds) {
      await markAsRead(id);
    }
    setSelectedIds([]);
  };

  // Handle notification click
  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }

    // Navigate based on type/action
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      return;
    }

    const type = notification.type?.toLowerCase() || '';
    
    if (type.includes('approval') || type.includes('rab')) {
      navigate('/approvals');
    } else if (type.includes('project')) {
      navigate('/projects');
    } else if (type.includes('leave')) {
      navigate('/attendance/leave-request');
    } else if (type.includes('attendance') || type.includes('clock')) {
      navigate('/attendance');
    }
  };

  // Toggle selection
  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Select all visible
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredNotifications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredNotifications.map(n => n.id));
    }
  };

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      // Status filter
      if (statusFilter === 'unread' && n.read) return false;
      if (statusFilter === 'read' && !n.read) return false;
      
      // Category filter
      if (categoryFilter !== 'all' && n.category !== categoryFilter) return false;
      
      // Search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          n.title?.toLowerCase().includes(query) ||
          n.message?.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
  }, [notifications, statusFilter, categoryFilter, searchQuery]);

  // Stats
  const unreadCount = notifications.filter(n => !n.read).length;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // Get notification icon
  const getNotificationIcon = (type, category) => {
    const iconClass = "notification-type-icon";
    
    if (type?.includes('approved') || type?.includes('success') || type?.includes('completed')) {
      return <CheckCircle2 className={`${iconClass} success`} />;
    }
    if (type?.includes('rejected') || type?.includes('error')) {
      return <XCircle className={`${iconClass} error`} />;
    }
    if (type?.includes('warning') || type?.includes('escalation')) {
      return <AlertCircle className={`${iconClass} warning`} />;
    }
    if (type?.includes('approval') || type?.includes('request')) {
      return <FileText className={`${iconClass} approval`} />;
    }
    
    // By category
    switch (category) {
      case 'approval': return <FileText className={`${iconClass} approval`} />;
      case 'project': return <Building2 className={`${iconClass} project`} />;
      case 'finance': return <Wallet className={`${iconClass} finance`} />;
      case 'attendance': return <Calendar className={`${iconClass} attendance`} />;
      case 'hr': return <Users className={`${iconClass} hr`} />;
      default: return <Bell className={`${iconClass} system`} />;
    }
  };

  // Get priority badge
  const getPriorityBadge = (priority) => {
    if (!priority || priority === 'normal') return null;
    
    const colors = {
      urgent: 'badge-urgent',
      high: 'badge-high',
      low: 'badge-low'
    };
    
    const labels = {
      urgent: 'Mendesak',
      high: 'Penting',
      low: 'Rendah'
    };
    
    return (
      <span className={`priority-badge ${colors[priority]}`}>
        {labels[priority]}
      </span>
    );
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return 'Baru saja';
    if (diffMin < 60) return `${diffMin} menit lalu`;
    if (diffHour < 24) return `${diffHour} jam lalu`;
    if (diffDay < 7) return `${diffDay} hari lalu`;
    
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  return (
    <div className="notifications-page">
      {/* Header */}
      <div className="notifications-header">
        <div className="header-left">
          <div className="header-title">
            <Bell className="header-icon" />
            <h1>Notifikasi</h1>
            {unreadCount > 0 && (
              <span className="unread-count-badge">{unreadCount}</span>
            )}
          </div>
          <p className="header-subtitle">
            Kelola semua notifikasi dan pemberitahuan Anda
          </p>
        </div>
        
        <div className="header-actions">
          <button
            className="btn-icon"
            onClick={() => fetchNotifications(true)}
            disabled={refreshing}
            title="Refresh"
          >
            <RefreshCw className={refreshing ? 'spinning' : ''} size={20} />
          </button>
          <button
            className="btn-icon"
            onClick={() => navigate('/settings/notifications')}
            title="Pengaturan Notifikasi"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="notifications-stats">
        <div className="stat-card">
          <div className="stat-icon total">
            <Bell size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{notifications.length}</span>
            <span className="stat-label">Total</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon unread">
            <AlertCircle size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{unreadCount}</span>
            <span className="stat-label">Belum Dibaca</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon read">
            <CheckCircle2 size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{notifications.length - unreadCount}</span>
            <span className="stat-label">Sudah Dibaca</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="notifications-toolbar">
        {/* Search */}
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Cari notifikasi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter Toggle */}
        <button
          className={`btn-filter ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={18} />
          <span>Filter</span>
          <ChevronDown size={16} className={showFilters ? 'rotated' : ''} />
        </button>

        {/* Quick Actions */}
        <div className="toolbar-actions">
          {unreadCount > 0 && (
            <button className="btn-secondary" onClick={markAllAsRead}>
              <CheckCheck size={18} />
              <span>Tandai Semua Dibaca</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <label>Status</label>
            <div className="filter-buttons">
              {[
                { value: 'all', label: 'Semua' },
                { value: 'unread', label: 'Belum Dibaca' },
                { value: 'read', label: 'Sudah Dibaca' }
              ].map(option => (
                <button
                  key={option.value}
                  className={`filter-btn ${statusFilter === option.value ? 'active' : ''}`}
                  onClick={() => { setStatusFilter(option.value); setCurrentPage(1); }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label>Kategori</label>
            <div className="filter-buttons category-filters">
              {categories.map(cat => (
                <button
                  key={cat.value}
                  className={`filter-btn ${categoryFilter === cat.value ? 'active' : ''}`}
                  onClick={() => { setCategoryFilter(cat.value); setCurrentPage(1); }}
                >
                  <cat.icon size={14} />
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="bulk-actions-bar">
          <span className="selection-count">
            {selectedIds.length} notifikasi terpilih
          </span>
          <div className="bulk-buttons">
            <button className="btn-bulk" onClick={markSelectedAsRead}>
              <Check size={16} />
              <span>Tandai Dibaca</span>
            </button>
            <button className="btn-bulk danger" onClick={deleteSelected}>
              <Trash2 size={16} />
              <span>Hapus</span>
            </button>
            <button className="btn-bulk" onClick={() => setSelectedIds([])}>
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="error-banner">
          <AlertCircle size={18} />
          <span>{error}</span>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {/* Notification List */}
      <div className="notifications-list-container">
        {loading ? (
          <div className="loading-state">
            <RefreshCw className="spinning" size={32} />
            <p>Memuat notifikasi...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-illustration">
              <BellOff size={64} />
            </div>
            <h3>
              {searchQuery 
                ? 'Tidak ada hasil' 
                : statusFilter === 'unread' 
                  ? 'Semua sudah dibaca!' 
                  : 'Belum ada notifikasi'}
            </h3>
            <p>
              {searchQuery 
                ? 'Coba kata kunci lain atau hapus filter'
                : statusFilter === 'unread'
                  ? 'Anda sudah membaca semua notifikasi. Bagus!'
                  : 'Notifikasi baru akan muncul di sini'}
            </p>
            {(searchQuery || statusFilter !== 'all' || categoryFilter !== 'all') && (
              <button 
                className="btn-secondary"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setCategoryFilter('all');
                }}
              >
                Reset Filter
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Select All Header */}
            <div className="list-header">
              <label className="checkbox-wrapper">
                <input
                  type="checkbox"
                  checked={selectedIds.length === filteredNotifications.length && filteredNotifications.length > 0}
                  onChange={toggleSelectAll}
                />
                <span className="checkmark"></span>
                <span className="label-text">Pilih Semua ({filteredNotifications.length})</span>
              </label>
            </div>

            {/* Notifications */}
            <div className="notifications-list">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-card ${!notification.read ? 'unread' : ''} ${selectedIds.includes(notification.id) ? 'selected' : ''}`}
                >
                  {/* Checkbox */}
                  <label 
                    className="checkbox-wrapper"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(notification.id)}
                      onChange={() => toggleSelect(notification.id)}
                    />
                    <span className="checkmark"></span>
                  </label>

                  {/* Icon */}
                  <div className="notification-icon-wrapper">
                    {getNotificationIcon(notification.type, notification.category)}
                    {!notification.read && <span className="unread-indicator" />}
                  </div>

                  {/* Content */}
                  <div 
                    className="notification-content"
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="notification-header">
                      <h4 className="notification-title">
                        {notification.title}
                      </h4>
                      {getPriorityBadge(notification.priority)}
                    </div>
                    
                    <p className="notification-message">
                      {notification.message}
                    </p>
                    
                    <div className="notification-meta">
                      <span className="notification-time">
                        <Clock size={12} />
                        {formatTimestamp(notification.createdAt)}
                      </span>
                      {notification.category && notification.category !== 'system' && (
                        <span className={`notification-category cat-${notification.category}`}>
                          {categories.find(c => c.value === notification.category)?.label || notification.category}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="notification-actions">
                    {!notification.read && (
                      <button
                        className="action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.id);
                        }}
                        title="Tandai dibaca"
                      >
                        <Check size={16} />
                      </button>
                    )}
                    {notification.actionUrl && (
                      <button
                        className="action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(notification.actionUrl);
                        }}
                        title="Buka"
                      >
                        <ExternalLink size={16} />
                      </button>
                    )}
                    <button
                      className="action-btn delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      title="Hapus"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <span className="pagination-info">
                  Halaman {currentPage} dari {totalPages}
                </span>
                <div className="pagination-buttons">
                  <button
                    className="btn-page"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  >
                    Sebelumnya
                  </button>
                  <button
                    className="btn-page"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  >
                    Selanjutnya
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
