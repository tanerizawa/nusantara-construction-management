import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { useOffline } from '../context/OfflineContext';
import { useNotification } from '../context/NotificationContext';

const { width } = Dimensions.get('window');

export default function DashboardScreen({ navigation }) {
  const { user } = useAuth();
  const { isConnected, offlineData } = useOffline();
  const { unreadCount, sendHRNotification } = useNotification();
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    todayStats: {
      checkedIn: true,
      checkInTime: '08:30',
      workingHours: '7h 45m',
      breakTime: '45m'
    },
    quickStats: {
      leaveBalance: 8,
      pendingRequests: 2,
      upcomingTraining: 1,
      performanceScore: 4.5
    },
    recentActivity: [
      { id: 1, type: 'check_in', message: 'Checked in at 08:30 AM', time: '2 hours ago' },
      { id: 2, type: 'leave_approved', message: 'Leave request approved', time: '1 day ago' },
      { id: 3, type: 'training', message: 'Completed Safety Training', time: '3 days ago' }
    ],
    aiInsights: [
      {
        id: 1,
        title: 'Performance Trending Up',
        message: 'Your performance has improved by 12% this quarter',
        type: 'positive',
        icon: 'trending-up'
      },
      {
        id: 2,
        title: 'Training Recommendation',
        message: 'AI suggests Leadership Development course',
        type: 'info',
        icon: 'school'
      }
    ]
  });

  useEffect(() => {
    loadDashboardData();
    
    // Send welcome notification for demo
    setTimeout(() => {
      sendHRNotification('ai_insight', 'Welcome to YK Group HR Mobile! 🎉');
    }, 2000);
  }, []);

  const loadDashboardData = async () => {
    // In real app, fetch from API or offline storage
    setRefreshing(false);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const QuickActionCard = ({ icon, title, subtitle, onPress, color = '#3B82F6' }) => (
    <TouchableOpacity style={styles.quickActionCard} onPress={onPress}>
      <View style={[styles.quickActionIcon, { backgroundColor: color }]}>
        <Ionicons name={icon} size={24} color="#FFFFFF" />
      </View>
      <Text style={styles.quickActionTitle}>{title}</Text>
      <Text style={styles.quickActionSubtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );

  const StatCard = ({ title, value, subtitle, icon, color }) => (
    <View style={styles.statCard}>
      <View style={styles.statHeader}>
        <Ionicons name={icon} size={20} color={color} />
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <Text style={styles.statValue}>{value}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <LinearGradient colors={['#3B82F6', '#1D4ED8']} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.userInfo}>
            <Text style={styles.greeting}>{getGreeting()},</Text>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
            <Text style={styles.userRole}>{user?.position} • {user?.department}</Text>
          </View>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
            {unreadCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Connection Status */}
        {!isConnected && (
          <View style={styles.offlineIndicator}>
            <Ionicons name="cloud-offline-outline" size={16} color="#FFFFFF" />
            <Text style={styles.offlineText}>Offline Mode</Text>
          </View>
        )}
      </LinearGradient>

      {/* Today's Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Activity</Text>
        <View style={styles.todayCard}>
          <View style={styles.todayHeader}>
            <Ionicons 
              name={dashboardData.todayStats.checkedIn ? "checkmark-circle" : "time-outline"} 
              size={24} 
              color={dashboardData.todayStats.checkedIn ? "#10B981" : "#F59E0B"} 
            />
            <Text style={styles.todayStatus}>
              {dashboardData.todayStats.checkedIn ? 'Checked In' : 'Not Checked In'}
            </Text>
          </View>
          <View style={styles.todayStats}>
            <View style={styles.todayStat}>
              <Text style={styles.todayStatValue}>{dashboardData.todayStats.checkInTime}</Text>
              <Text style={styles.todayStatLabel}>Check In</Text>
            </View>
            <View style={styles.todayStat}>
              <Text style={styles.todayStatValue}>{dashboardData.todayStats.workingHours}</Text>
              <Text style={styles.todayStatLabel}>Working Hours</Text>
            </View>
            <View style={styles.todayStat}>
              <Text style={styles.todayStatValue}>{dashboardData.todayStats.breakTime}</Text>
              <Text style={styles.todayStatLabel}>Break Time</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <QuickActionCard
            icon="people-outline"
            title="Employees"
            subtitle="View team"
            onPress={() => navigation.navigate('Employees')}
            color="#3B82F6"
          />
          <QuickActionCard
            icon="time-outline"
            title="Attendance"
            subtitle="Check in/out"
            onPress={() => navigation.navigate('Attendance')}
            color="#10B981"
          />
          <QuickActionCard
            icon="chatbubble-outline"
            title="AI Assistant"
            subtitle="Get help"
            onPress={() => navigation.navigate('AI Assistant')}
            color="#8B5CF6"
          />
          <QuickActionCard
            icon="analytics-outline"
            title="Analytics"
            subtitle="AI insights"
            onPress={() => navigation.navigate('AIAnalytics')}
            color="#F59E0B"
          />
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Stats</Text>
        <View style={styles.statsGrid}>
          <StatCard
            title="Leave Balance"
            value={dashboardData.quickStats.leaveBalance}
            subtitle="days remaining"
            icon="calendar-outline"
            color="#10B981"
          />
          <StatCard
            title="Pending Requests"
            value={dashboardData.quickStats.pendingRequests}
            subtitle="need approval"
            icon="hourglass-outline"
            color="#F59E0B"
          />
          <StatCard
            title="Training"
            value={dashboardData.quickStats.upcomingTraining}
            subtitle="upcoming courses"
            icon="school-outline"
            color="#8B5CF6"
          />
          <StatCard
            title="Performance"
            value={`${dashboardData.quickStats.performanceScore}/5`}
            subtitle="this quarter"
            icon="star-outline"
            color="#EF4444"
          />
        </View>
      </View>

      {/* AI Insights */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🤖 AI Insights</Text>
        {dashboardData.aiInsights.map((insight) => (
          <View key={insight.id} style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <Ionicons 
                name={insight.icon} 
                size={20} 
                color={insight.type === 'positive' ? '#10B981' : '#3B82F6'} 
              />
              <Text style={styles.insightTitle}>{insight.title}</Text>
            </View>
            <Text style={styles.insightMessage}>{insight.message}</Text>
          </View>
        ))}
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {dashboardData.recentActivity.map((activity) => (
          <View key={activity.id} style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Ionicons 
                name={
                  activity.type === 'check_in' ? 'time' :
                  activity.type === 'leave_approved' ? 'checkmark-circle' :
                  'school'
                } 
                size={16} 
                color="#6B7280" 
              />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityMessage}>{activity.message}</Text>
              <Text style={styles.activityTime}>{activity.time}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Spacer for bottom tab */}
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 4,
  },
  userRole: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  offlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 16,
    gap: 6,
  },
  offlineText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  todayCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  todayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  todayStatus: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  todayStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  todayStat: {
    alignItems: 'center',
  },
  todayStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  todayStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: (width - 64) / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: (width - 64) / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  insightCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  insightMessage: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  activityItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityMessage: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  activityTime: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  bottomSpacer: {
    height: 100,
  },
});
