import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { useOffline } from '../context/OfflineContext';
import { useAuth } from '../context/AuthContext';

export default function AttendanceScreen({ navigation }) {
  const { user } = useAuth();
  const { isConnected, getAttendanceData, queueAttendanceUpdate } = useOffline();
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);
  const [todayData, setTodayData] = useState(null);
  const [weeklyStats, setWeeklyStats] = useState({});
  const [showCalendar, setShowCalendar] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    loadAttendanceData();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [selectedDate, isConnected]);

  const loadAttendanceData = async () => {
    try {
      // Mock attendance data - replace with actual API
      const mockData = [
        {
          id: 1,
          date: '2024-12-13',
          checkIn: '08:15:00',
          checkOut: '17:30:00',
          breakStart: '12:00:00',
          breakEnd: '13:00:00',
          workHours: 8.25,
          overtime: 0.5,
          location: 'YK Group Office',
          status: 'present',
          notes: null
        },
        {
          id: 2,
          date: '2024-12-12',
          checkIn: '08:00:00',
          checkOut: '17:00:00',
          breakStart: '12:00:00',
          breakEnd: '13:00:00',
          workHours: 8.0,
          overtime: 0,
          location: 'YK Group Office',
          status: 'present',
          notes: null
        },
        {
          id: 3,
          date: '2024-12-11',
          checkIn: '08:30:00',
          checkOut: '17:15:00',
          breakStart: '12:00:00',
          breakEnd: '13:00:00',
          workHours: 7.75,
          overtime: 0,
          location: 'Project Site A',
          status: 'present',
          notes: 'Site visit'
        },
        {
          id: 4,
          date: '2024-12-10',
          checkIn: null,
          checkOut: null,
          breakStart: null,
          breakEnd: null,
          workHours: 0,
          overtime: 0,
          location: null,
          status: 'absent',
          notes: 'Sick leave'
        },
        {
          id: 5,
          date: '2024-12-09',
          checkIn: '07:45:00',
          checkOut: '18:00:00',
          breakStart: '12:00:00',
          breakEnd: '13:00:00',
          workHours: 9.25,
          overtime: 1.25,
          location: 'YK Group Office',
          status: 'present',
          notes: 'Project deadline'
        }
      ];

      setAttendanceData(mockData);
      
      // Set today's data
      const today = new Date().toISOString().split('T')[0];
      const todayRecord = mockData.find(record => record.date === today);
      setTodayData(todayRecord);
      
      if (todayRecord) {
        setCheckedIn(!!todayRecord.checkIn);
        setCheckedOut(!!todayRecord.checkOut);
      }

      // Calculate weekly stats
      const thisWeek = mockData.filter(record => {
        const recordDate = new Date(record.date);
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        return recordDate >= weekStart;
      });

      const stats = {
        totalHours: thisWeek.reduce((sum, record) => sum + record.workHours, 0),
        overtime: thisWeek.reduce((sum, record) => sum + record.overtime, 0),
        daysPresent: thisWeek.filter(record => record.status === 'present').length,
        daysAbsent: thisWeek.filter(record => record.status === 'absent').length
      };
      setWeeklyStats(stats);

    } catch (error) {
      console.error('Error loading attendance data:', error);
      Alert.alert('Error', 'Failed to load attendance data');
    } finally {
      setRefreshing(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      const now = new Date();
      const timeString = now.toTimeString().split(' ')[0];
      const today = now.toISOString().split('T')[0];

      const newRecord = {
        id: Date.now(),
        date: today,
        checkIn: timeString,
        checkOut: null,
        breakStart: null,
        breakEnd: null,
        workHours: 0,
        overtime: 0,
        location: 'YK Group Office',
        status: 'present',
        notes: null
      };

      if (isConnected) {
        // Mock API call - replace with actual API
        console.log('Sending check-in to server:', newRecord);
      } else {
        // Queue for offline sync
        await queueAttendanceUpdate('checkin', newRecord);
      }

      setCheckedIn(true);
      setTodayData(newRecord);
      Alert.alert('Success', `Checked in at ${timeString}`);
      
    } catch (error) {
      console.error('Error checking in:', error);
      Alert.alert('Error', 'Failed to check in');
    }
  };

  const handleCheckOut = async () => {
    try {
      const now = new Date();
      const timeString = now.toTimeString().split(' ')[0];
      
      if (!todayData) {
        Alert.alert('Error', 'No check-in record found for today');
        return;
      }

      const checkInTime = new Date(`${todayData.date}T${todayData.checkIn}`);
      const checkOutTime = new Date(`${todayData.date}T${timeString}`);
      const workHours = (checkOutTime - checkInTime) / (1000 * 60 * 60) - 1; // Subtract 1 hour for break

      const updatedRecord = {
        ...todayData,
        checkOut: timeString,
        workHours: Math.max(0, workHours),
        overtime: Math.max(0, workHours - 8)
      };

      if (isConnected) {
        // Mock API call - replace with actual API
        console.log('Sending check-out to server:', updatedRecord);
      } else {
        // Queue for offline sync
        await queueAttendanceUpdate('checkout', updatedRecord);
      }

      setCheckedOut(true);
      setTodayData(updatedRecord);
      Alert.alert('Success', `Checked out at ${timeString}`);
      
    } catch (error) {
      console.error('Error checking out:', error);
      Alert.alert('Error', 'Failed to check out');
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadAttendanceData();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return { bg: '#DCFCE7', text: '#166534', icon: 'checkmark-circle' };
      case 'absent':
        return { bg: '#FEE2E2', text: '#DC2626', icon: 'close-circle' };
      case 'late':
        return { bg: '#FEF3C7', text: '#92400E', icon: 'time' };
      default:
        return { bg: '#F3F4F6', text: '#6B7280', icon: 'help-circle' };
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '--:--';
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getCalendarMarkedDates = () => {
    const marked = {};
    attendanceData.forEach(record => {
      const status = record.status;
      let color = '#10B981'; // present
      if (status === 'absent') color = '#EF4444';
      if (status === 'late') color = '#F59E0B';

      marked[record.date] = {
        marked: true,
        dotColor: color,
        selectedColor: record.date === selectedDate ? '#3B82F6' : undefined,
        selected: record.date === selectedDate
      };
    });
    return marked;
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Current Time and Date */}
        <View style={styles.timeContainer}>
          <Text style={styles.currentTime}>
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          <Text style={styles.currentDate}>
            {currentTime.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>
          {!isConnected && (
            <View style={styles.offlineIndicator}>
              <Ionicons name="cloud-offline" size={16} color="#F59E0B" />
              <Text style={styles.offlineText}>Offline Mode</Text>
            </View>
          )}
        </View>

        {/* Check In/Out Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.checkInButton,
              checkedIn && styles.disabledButton
            ]}
            onPress={handleCheckIn}
            disabled={checkedIn}
          >
            <Ionicons 
              name={checkedIn ? "checkmark-circle" : "log-in-outline"} 
              size={24} 
              color={checkedIn ? "#6B7280" : "#FFFFFF"} 
            />
            <Text style={[styles.actionButtonText, checkedIn && styles.disabledButtonText]}>
              {checkedIn ? `Checked In (${formatTime(todayData?.checkIn)})` : 'Check In'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.checkOutButton,
              (!checkedIn || checkedOut) && styles.disabledButton
            ]}
            onPress={handleCheckOut}
            disabled={!checkedIn || checkedOut}
          >
            <Ionicons 
              name={checkedOut ? "checkmark-circle" : "log-out-outline"} 
              size={24} 
              color={(!checkedIn || checkedOut) ? "#6B7280" : "#FFFFFF"} 
            />
            <Text style={[styles.actionButtonText, (!checkedIn || checkedOut) && styles.disabledButtonText]}>
              {checkedOut ? `Checked Out (${formatTime(todayData?.checkOut)})` : 'Check Out'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Today's Summary */}
        {todayData && (
          <View style={styles.todayContainer}>
            <Text style={styles.sectionTitle}>Today's Summary</Text>
            <View style={styles.todayCard}>
              <View style={styles.todayStats}>
                <View style={styles.todayStat}>
                  <Ionicons name="time-outline" size={20} color="#3B82F6" />
                  <View>
                    <Text style={styles.todayStatValue}>
                      {todayData.workHours.toFixed(1)}h
                    </Text>
                    <Text style={styles.todayStatLabel}>Work Hours</Text>
                  </View>
                </View>
                <View style={styles.todayStat}>
                  <Ionicons name="trending-up-outline" size={20} color="#F59E0B" />
                  <View>
                    <Text style={styles.todayStatValue}>
                      {todayData.overtime.toFixed(1)}h
                    </Text>
                    <Text style={styles.todayStatLabel}>Overtime</Text>
                  </View>
                </View>
                <View style={styles.todayStat}>
                  <Ionicons name="location-outline" size={20} color="#10B981" />
                  <View>
                    <Text style={styles.todayStatValue} numberOfLines={1}>
                      {todayData.location || 'Not set'}
                    </Text>
                    <Text style={styles.todayStatLabel}>Location</Text>
                  </View>
                </View>
              </View>
              {todayData.notes && (
                <View style={styles.notesContainer}>
                  <Text style={styles.notesLabel}>Notes:</Text>
                  <Text style={styles.notesText}>{todayData.notes}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Weekly Stats */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>This Week</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="time" size={24} color="#3B82F6" />
              <Text style={styles.statValue}>{weeklyStats.totalHours?.toFixed(1) || '0'}h</Text>
              <Text style={styles.statLabel}>Total Hours</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="trending-up" size={24} color="#F59E0B" />
              <Text style={styles.statValue}>{weeklyStats.overtime?.toFixed(1) || '0'}h</Text>
              <Text style={styles.statLabel}>Overtime</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="checkmark-circle" size={24} color="#10B981" />
              <Text style={styles.statValue}>{weeklyStats.daysPresent || 0}</Text>
              <Text style={styles.statLabel}>Days Present</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="close-circle" size={24} color="#EF4444" />
              <Text style={styles.statValue}>{weeklyStats.daysAbsent || 0}</Text>
              <Text style={styles.statLabel}>Days Absent</Text>
            </View>
          </View>
        </View>

        {/* Calendar Toggle */}
        <TouchableOpacity
          style={styles.calendarToggle}
          onPress={() => setShowCalendar(!showCalendar)}
        >
          <Ionicons name="calendar-outline" size={20} color="#3B82F6" />
          <Text style={styles.calendarToggleText}>
            {showCalendar ? 'Hide Calendar' : 'Show Calendar'}
          </Text>
          <Ionicons 
            name={showCalendar ? "chevron-up" : "chevron-down"} 
            size={20} 
            color="#6B7280" 
          />
        </TouchableOpacity>

        {/* Calendar */}
        {showCalendar && (
          <View style={styles.calendarContainer}>
            <Calendar
              current={selectedDate}
              onDayPress={(day) => setSelectedDate(day.dateString)}
              markingType="dot"
              markedDates={getCalendarMarkedDates()}
              theme={{
                backgroundColor: '#FFFFFF',
                calendarBackground: '#FFFFFF',
                textSectionTitleColor: '#6B7280',
                selectedDayBackgroundColor: '#3B82F6',
                selectedDayTextColor: '#FFFFFF',
                todayTextColor: '#3B82F6',
                dayTextColor: '#1F2937',
                textDisabledColor: '#D1D5DB',
                arrowColor: '#3B82F6',
                monthTextColor: '#1F2937',
                indicatorColor: '#3B82F6',
                textDayFontWeight: '500',
                textMonthFontWeight: '600',
                textDayHeaderFontWeight: '600',
                textDayFontSize: 16,
                textMonthFontSize: 18,
                textDayHeaderFontSize: 14,
              }}
            />
          </View>
        )}

        {/* Recent Attendance */}
        <View style={styles.recentContainer}>
          <Text style={styles.sectionTitle}>Recent Attendance</Text>
          {attendanceData.slice(0, 7).map((record) => {
            const statusColors = getStatusColor(record.status);
            return (
              <View key={record.id} style={styles.attendanceCard}>
                <View style={styles.attendanceHeader}>
                  <View style={styles.attendanceDate}>
                    <Text style={styles.attendanceDateText}>
                      {formatDate(record.date)}
                    </Text>
                    <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
                      <Ionicons 
                        name={statusColors.icon} 
                        size={12} 
                        color={statusColors.text} 
                      />
                      <Text style={[styles.statusText, { color: statusColors.text }]}>
                        {record.status}
                      </Text>
                    </View>
                  </View>
                </View>
                
                {record.status === 'present' && (
                  <View style={styles.attendanceDetails}>
                    <View style={styles.attendanceTime}>
                      <Text style={styles.timeLabel}>In:</Text>
                      <Text style={styles.timeValue}>{formatTime(record.checkIn)}</Text>
                    </View>
                    <View style={styles.attendanceTime}>
                      <Text style={styles.timeLabel}>Out:</Text>
                      <Text style={styles.timeValue}>{formatTime(record.checkOut)}</Text>
                    </View>
                    <View style={styles.attendanceTime}>
                      <Text style={styles.timeLabel}>Hours:</Text>
                      <Text style={styles.timeValue}>{record.workHours.toFixed(1)}h</Text>
                    </View>
                    {record.overtime > 0 && (
                      <View style={styles.attendanceTime}>
                        <Text style={styles.timeLabel}>OT:</Text>
                        <Text style={[styles.timeValue, { color: '#F59E0B' }]}>
                          +{record.overtime.toFixed(1)}h
                        </Text>
                      </View>
                    )}
                  </View>
                )}
                
                {record.notes && (
                  <View style={styles.recordNotes}>
                    <Text style={styles.recordNotesText}>{record.notes}</Text>
                  </View>
                )}
                
                {record.location && (
                  <View style={styles.locationInfo}>
                    <Ionicons name="location-outline" size={12} color="#6B7280" />
                    <Text style={styles.locationText}>{record.location}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContainer: {
    flex: 1,
  },
  timeContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  currentTime: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  currentDate: {
    fontSize: 16,
    color: '#6B7280',
  },
  offlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
  },
  offlineText: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '500',
  },
  actionContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  checkInButton: {
    backgroundColor: '#10B981',
  },
  checkOutButton: {
    backgroundColor: '#EF4444',
  },
  disabledButton: {
    backgroundColor: '#F3F4F6',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButtonText: {
    color: '#6B7280',
  },
  todayContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  todayCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  todayStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  todayStat: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  todayStatValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  todayStatLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  notesContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  notesLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: '#1F2937',
  },
  statsContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  calendarToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  calendarToggleText: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '500',
  },
  calendarContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recentContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  attendanceCard: {
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
  attendanceHeader: {
    marginBottom: 8,
  },
  attendanceDate: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  attendanceDateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  attendanceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  attendanceTime: {
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  timeValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  recordNotes: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  recordNotesText: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#6B7280',
  },
  bottomSpacer: {
    height: 32,
  },
});
