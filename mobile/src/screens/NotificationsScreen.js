import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Modal,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { useOffline } from '../context/OfflineContext';

export default function NotificationsScreen({ navigation }) {
  const { user } = useAuth();
  const { isConnected } = useOffline();
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    clearNotification,
    clearAllNotifications
  } = useNotification();
  
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const filters = [
    { key: 'all', label: 'All', icon: 'notifications-outline' },
    { key: 'leave', label: 'Leave', icon: 'calendar-outline' },
    { key: 'performance', label: 'Performance', icon: 'trending-up-outline' },
    { key: 'training', label: 'Training', icon: 'school-outline' },
    { key: 'ai', label: 'AI Insights', icon: 'sparkles-outline' },
    { key: 'system', label: 'System', icon: 'settings-outline' }
  ];

  useEffect(() => {
    filterNotifications();
  }, [notifications, selectedFilter]);

  const filterNotifications = () => {
    let filtered = notifications;
    
    if (selectedFilter !== 'all') {
      filtered = notifications.filter(notification => 
        notification.type === selectedFilter
      );
    }
    
    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    setFilteredNotifications(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Mock refresh - in real app, this would fetch latest notifications
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleNotificationPress = async (notification) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }
    setSelectedNotification(notification);
    
    // Handle notification actions
    switch (notification.type) {
      case 'leave':
        if (notification.action) {
          // Navigate to leave management
          navigation.navigate('Dashboard');
        }
        break;
      case 'performance':
        if (notification.action) {
          // Navigate to performance section
          navigation.navigate('Profile');
        }
        break;
      case 'training':
        if (notification.action) {
          // Navigate to training section
          Alert.alert('Training', 'Training module will be available soon');
        }
        break;
      case 'ai':
        if (notification.action) {
          // Navigate to AI assistant
          navigation.navigate('AIAssistant');
        }
        break;
      default:
        break;
    }
  };

  const handleMarkAllAsRead = () => {
    Alert.alert(
      'Mark All as Read',
      'This will mark all notifications as read. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Mark All Read', onPress: markAllAsRead }
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Notifications',
      'This will permanently delete all notifications. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive',
          onPress: clearAllNotifications 
        }
      ]
    );
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'leave':
        return { name: 'calendar', color: '#3B82F6' };
      case 'performance':
        return { name: 'trending-up', color: '#10B981' };
      case 'training':
        return { name: 'school', color: '#F59E0B' };
      case 'ai':
        return { name: 'sparkles', color: '#8B5CF6' };
      case 'system':
        return { name: 'settings', color: '#6B7280' };
      default:
        return { name: 'notifications', color: '#3B82F6' };
    }
  };

  const getNotificationPriority = (priority) => {
    switch (priority) {
      case 'high':
        return { bg: '#FEE2E2', border: '#FCA5A5', text: '#DC2626' };
      case 'medium':
        return { bg: '#FEF3C7', border: '#FCD34D', text: '#D97706' };
      case 'low':
        return { bg: '#DBEAFE', border: '#93C5FD', text: '#2563EB' };
      default:
        return { bg: '#F3F4F6', border: '#D1D5DB', text: '#6B7280' };
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return time.toLocaleDateString();
  };

  const NotificationCard = ({ notification }) => {
    const icon = getNotificationIcon(notification.type);
    const priority = getNotificationPriority(notification.priority);
    
    return (
      <TouchableOpacity
        style={[
          styles.notificationCard,
          !notification.read && styles.unreadCard,
          notification.priority === 'high' && styles.highPriorityCard
        ]}
        onPress={() => handleNotificationPress(notification)}
      >
        <View style={styles.notificationHeader}>
          <View style={[styles.notificationIcon, { backgroundColor: icon.color + '20' }]}>
            <Ionicons name={icon.name} size={20} color={icon.color} />
          </View>
          
          <View style={styles.notificationContent}>
            <View style={styles.notificationTitleRow}>
              <Text style={[
                styles.notificationTitle,
                !notification.read && styles.unreadTitle
              ]}>
                {notification.title}
              </Text>
              {notification.priority !== 'low' && (
                <View style={[
                  styles.priorityBadge,
                  { 
                    backgroundColor: priority.bg,
                    borderColor: priority.border 
                  }
                ]}>
                  <Text style={[styles.priorityText, { color: priority.text }]}>
                    {notification.priority}
                  </Text>
                </View>
              )}
            </View>
            
            <Text style={styles.notificationBody} numberOfLines={2}>
              {notification.body}
            </Text>
            
            <View style={styles.notificationFooter}>
              <Text style={styles.notificationTime}>
                {formatTimeAgo(notification.timestamp)}
              </Text>
              
              {!notification.read && (
                <View style={styles.unreadDot} />
              )}
              
              {notification.action && (
                <Text style={styles.actionText}>Tap to view</Text>
              )}
            </View>
          </View>
          
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => clearNotification(notification.id)}
          >
            <Ionicons name="close" size={16} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowFilterModal(true)}
          >
            <Ionicons name="filter-outline" size={20} color="#3B82F6" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleMarkAllAsRead}
            disabled={unreadCount === 0}
          >
            <Ionicons 
              name="checkmark-done-outline" 
              size={20} 
              color={unreadCount > 0 ? "#10B981" : "#9CA3AF"} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Chips */}
      <ScrollView 
        horizontal 
        style={styles.filtersContainer}
        showsHorizontalScrollIndicator={false}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterChip,
              selectedFilter === filter.key && styles.activeFilterChip
            ]}
            onPress={() => setSelectedFilter(filter.key)}
          >
            <Ionicons 
              name={filter.icon} 
              size={16} 
              color={selectedFilter === filter.key ? "#FFFFFF" : "#6B7280"} 
            />
            <Text style={[
              styles.filterChipText,
              selectedFilter === filter.key && styles.activeFilterChipText
            ]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Offline Indicator */}
      {!isConnected && (
        <View style={styles.offlineContainer}>
          <Ionicons name="cloud-offline" size={16} color="#F59E0B" />
          <Text style={styles.offlineText}>
            Showing cached notifications. New notifications will appear when online.
          </Text>
        </View>
      )}

      {/* Notifications List */}
      <ScrollView
        style={styles.notificationsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredNotifications.length > 0 ? (
          <>
            {filteredNotifications.map((notification) => (
              <NotificationCard key={notification.id} notification={notification} />
            ))}
            
            {/* Clear All Button */}
            {filteredNotifications.length > 0 && (
              <TouchableOpacity 
                style={styles.clearAllButton}
                onPress={handleClearAll}
              >
                <Ionicons name="trash-outline" size={16} color="#EF4444" />
                <Text style={styles.clearAllText}>Clear All Notifications</Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No notifications</Text>
            <Text style={styles.emptySubtitle}>
              {selectedFilter === 'all' 
                ? "You're all caught up! New notifications will appear here."
                : `No ${selectedFilter} notifications found.`
              }
            </Text>
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowFilterModal(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Filter Notifications</Text>
            <TouchableOpacity onPress={() => setShowFilterModal(false)}>
              <Text style={styles.modalDone}>Done</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.key}
                style={styles.filterOption}
                onPress={() => {
                  setSelectedFilter(filter.key);
                  setShowFilterModal(false);
                }}
              >
                <View style={styles.filterOptionLeft}>
                  <Ionicons name={filter.icon} size={20} color="#6B7280" />
                  <Text style={styles.filterOptionText}>{filter.label}</Text>
                </View>
                {selectedFilter === filter.key && (
                  <Ionicons name="checkmark" size={20} color="#3B82F6" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  unreadBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    padding: 8,
  },
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  activeFilterChip: {
    backgroundColor: '#3B82F6',
  },
  filterChipText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  activeFilterChipText: {
    color: '#FFFFFF',
  },
  offlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#FDE68A',
  },
  offlineText: {
    flex: 1,
    fontSize: 12,
    color: '#92400E',
  },
  notificationsList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  notificationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  highPriorityCard: {
    borderLeftColor: '#EF4444',
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    color: '#1F2937',
    flex: 1,
    marginRight: 8,
  },
  unreadTitle: {
    fontWeight: '600',
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  notificationBody: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3B82F6',
  },
  actionText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '500',
  },
  deleteButton: {
    padding: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  clearAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  clearAllText: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '500',
  },
  bottomSpacer: {
    height: 32,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalCancel: {
    fontSize: 16,
    color: '#6B7280',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  modalDone: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  filterOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  filterOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  filterOptionText: {
    fontSize: 16,
    color: '#1F2937',
  },
});
