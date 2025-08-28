import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
  Modal,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { useOffline } from '../context/OfflineContext';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

export default function EmployeeDetailScreen({ navigation }) {
  const route = useRoute();
  const { employee: routeEmployee } = route.params || {};
  const { user } = useAuth();
  const { isConnected } = useOffline();
  const [employee, setEmployee] = useState(routeEmployee);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (routeEmployee) {
      loadEmployeeDetails(routeEmployee.id);
    }
  }, [routeEmployee]);

  const loadEmployeeDetails = async (employeeId) => {
    try {
      setLoading(true);
      
      // Mock detailed employee data - replace with actual API
      const detailedEmployee = {
        ...routeEmployee,
        fullAddress: 'Jl. Sudirman No. 45, Jakarta Selatan 12190',
        emergencyContact: {
          name: 'Sari Santoso',
          relationship: 'Spouse',
          phone: '08123456788'
        },
        skills: ['Project Management', 'Construction Safety', 'Team Leadership', 'Quality Control'],
        certifications: ['PMP', 'OSHA 30-Hour', 'First Aid', 'Crane Operator'],
        education: 'S1 Civil Engineering - Universitas Indonesia',
        workHistory: [
          {
            position: 'Site Manager',
            company: 'YK Group',
            startDate: '2023-01-15',
            endDate: null,
            description: 'Leading construction projects and managing site operations'
          },
          {
            position: 'Assistant Site Manager',
            company: 'ABC Construction',
            startDate: '2021-03-01',
            endDate: '2022-12-31',
            description: 'Assisted in managing construction sites and coordinating teams'
          }
        ],
        recentProjects: [
          {
            id: 1,
            name: 'Modern Office Complex',
            role: 'Site Manager',
            status: 'In Progress',
            progress: 75,
            startDate: '2024-06-01',
            endDate: '2025-01-31'
          },
          {
            id: 2,
            name: 'Residential Villa Development',
            role: 'Site Supervisor',
            status: 'Completed',
            progress: 100,
            startDate: '2024-01-15',
            endDate: '2024-05-30'
          }
        ],
        performanceHistory: [
          { month: 'Nov 2024', score: 4.6, projects: 2, attendance: 96 },
          { month: 'Oct 2024', score: 4.4, projects: 1, attendance: 94 },
          { month: 'Sep 2024', score: 4.7, projects: 2, attendance: 98 },
          { month: 'Aug 2024', score: 4.3, projects: 1, attendance: 92 }
        ],
        attendanceStats: {
          thisMonth: { present: 18, absent: 2, late: 1, early: 0 },
          lastMonth: { present: 22, absent: 0, late: 2, early: 0 },
          totalHours: 168,
          overtime: 12
        }
      };

      setEmployee(detailedEmployee);
    } catch (error) {
      console.error('Error loading employee details:', error);
      Alert.alert('Error', 'Failed to load employee details');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadEmployeeDetails(employee.id);
  };

  const handleCall = (phoneNumber) => {
    Alert.alert(
      'Call Employee',
      `Call ${employee.name} at ${phoneNumber}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => console.log('Calling:', phoneNumber) }
      ]
    );
  };

  const handleEmail = (email) => {
    Alert.alert(
      'Send Email',
      `Send email to ${employee.name} at ${email}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Email', onPress: () => console.log('Emailing:', email) }
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return { bg: '#DCFCE7', text: '#166534' };
      case 'on_leave':
        return { bg: '#FEF3C7', text: '#92400E' };
      case 'inactive':
        return { bg: '#F3F4F6', text: '#6B7280' };
      default:
        return { bg: '#F3F4F6', text: '#6B7280' };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Present';
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const StatCard = ({ icon, label, value, color = '#3B82F6', subtitle }) => (
    <View style={styles.statCard}>
      <Ionicons name={icon} size={24} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  const TabButton = ({ id, label, icon, active, onPress }) => (
    <TouchableOpacity
      style={[styles.tabButton, active && styles.activeTabButton]}
      onPress={onPress}
    >
      <Ionicons 
        name={icon} 
        size={16} 
        color={active ? '#3B82F6' : '#6B7280'} 
      />
      <Text style={[
        styles.tabButtonText,
        active && styles.activeTabButtonText
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  if (!employee) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="person-outline" size={48} color="#6B7280" />
        <Text style={styles.loadingText}>Loading employee details...</Text>
      </View>
    );
  }

  const statusColors = getStatusColor(employee.status);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              {employee.profileImage ? (
                <Image source={{ uri: employee.profileImage }} style={styles.avatar} />
              ) : (
                <View style={styles.placeholderAvatar}>
                  <Text style={styles.avatarText}>
                    {employee.name.split(' ').map(n => n[0]).join('')}
                  </Text>
                </View>
              )}
            </View>
            
            <View style={styles.profileInfo}>
              <Text style={styles.employeeName}>{employee.name}</Text>
              <Text style={styles.employeePosition}>{employee.position}</Text>
              <Text style={styles.employeeId}>{employee.employeeId}</Text>
              
              <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
                <Text style={[styles.statusText, { color: statusColors.text }]}>
                  {employee.status === 'on_leave' ? 'On Leave' : 
                   employee.status === 'active' ? 'Active' : 'Inactive'}
                </Text>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleCall(employee.phone)}
            >
              <Ionicons name="call" size={20} color="#3B82F6" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleEmail(employee.email)}
            >
              <Ionicons name="mail" size={20} color="#3B82F6" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setShowContactModal(true)}
            >
              <Ionicons name="information-circle" size={20} color="#3B82F6" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statsGrid}>
            <StatCard
              icon="star"
              label="Performance"
              value={`${employee.performance}/5`}
              color="#F59E0B"
            />
            <StatCard
              icon="checkmark-circle"
              label="Attendance"
              value={`${employee.attendance}%`}
              color="#10B981"
            />
            <StatCard
              icon="time"
              label="Experience"
              value={employee.totalExperience}
              color="#8B5CF6"
            />
            <StatCard
              icon="construct"
              label="Projects"
              value={employee.completedProjects}
              color="#3B82F6"
            />
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TabButton
              id="overview"
              label="Overview"
              icon="person-outline"
              active={activeTab === 'overview'}
              onPress={() => setActiveTab('overview')}
            />
            <TabButton
              id="projects"
              label="Projects"
              icon="construct-outline"
              active={activeTab === 'projects'}
              onPress={() => setActiveTab('projects')}
            />
            <TabButton
              id="performance"
              label="Performance"
              icon="trending-up-outline"
              active={activeTab === 'performance'}
              onPress={() => setActiveTab('performance')}
            />
            <TabButton
              id="attendance"
              label="Attendance"
              icon="calendar-outline"
              active={activeTab === 'attendance'}
              onPress={() => setActiveTab('attendance')}
            />
          </ScrollView>
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === 'overview' && (
            <View>
              {/* Contact Information */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Contact Information</Text>
                <View style={styles.sectionContent}>
                  <View style={styles.infoRow}>
                    <Ionicons name="mail-outline" size={16} color="#6B7280" />
                    <Text style={styles.infoLabel}>Email:</Text>
                    <Text style={styles.infoValue}>{employee.email}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Ionicons name="call-outline" size={16} color="#6B7280" />
                    <Text style={styles.infoLabel}>Phone:</Text>
                    <Text style={styles.infoValue}>{employee.phone}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Ionicons name="location-outline" size={16} color="#6B7280" />
                    <Text style={styles.infoLabel}>Location:</Text>
                    <Text style={styles.infoValue}>{employee.location}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Ionicons name="home-outline" size={16} color="#6B7280" />
                    <Text style={styles.infoLabel}>Address:</Text>
                    <Text style={styles.infoValue}>{employee.fullAddress}</Text>
                  </View>
                </View>
              </View>

              {/* Work Information */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Work Information</Text>
                <View style={styles.sectionContent}>
                  <View style={styles.infoRow}>
                    <Ionicons name="business-outline" size={16} color="#6B7280" />
                    <Text style={styles.infoLabel}>Department:</Text>
                    <Text style={styles.infoValue}>{employee.department}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                    <Text style={styles.infoLabel}>Join Date:</Text>
                    <Text style={styles.infoValue}>{formatDate(employee.joinDate)}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Ionicons name="school-outline" size={16} color="#6B7280" />
                    <Text style={styles.infoLabel}>Education:</Text>
                    <Text style={styles.infoValue}>{employee.education}</Text>
                  </View>
                </View>
              </View>

              {/* Skills */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Skills & Certifications</Text>
                <View style={styles.sectionContent}>
                  <Text style={styles.subsectionTitle}>Skills</Text>
                  <View style={styles.tagsContainer}>
                    {employee.skills?.map((skill, index) => (
                      <View key={index} style={styles.skillTag}>
                        <Text style={styles.skillTagText}>{skill}</Text>
                      </View>
                    ))}
                  </View>
                  
                  <Text style={styles.subsectionTitle}>Certifications</Text>
                  <View style={styles.tagsContainer}>
                    {employee.certifications?.map((cert, index) => (
                      <View key={index} style={styles.certTag}>
                        <Text style={styles.certTagText}>{cert}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          )}

          {activeTab === 'projects' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Projects</Text>
              {employee.recentProjects?.map((project) => (
                <View key={project.id} style={styles.projectCard}>
                  <View style={styles.projectHeader}>
                    <Text style={styles.projectName}>{project.name}</Text>
                    <View style={[
                      styles.projectStatusBadge,
                      project.status === 'Completed' 
                        ? { backgroundColor: '#DCFCE7' }
                        : { backgroundColor: '#DBEAFE' }
                    ]}>
                      <Text style={[
                        styles.projectStatusText,
                        project.status === 'Completed' 
                          ? { color: '#166534' }
                          : { color: '#1D4ED8' }
                      ]}>
                        {project.status}
                      </Text>
                    </View>
                  </View>
                  
                  <Text style={styles.projectRole}>Role: {project.role}</Text>
                  
                  <View style={styles.projectProgress}>
                    <View style={styles.progressInfo}>
                      <Text style={styles.progressLabel}>Progress</Text>
                      <Text style={styles.progressValue}>{project.progress}%</Text>
                    </View>
                    <View style={styles.progressBar}>
                      <View 
                        style={[
                          styles.progressFill,
                          { width: `${project.progress}%` }
                        ]} 
                      />
                    </View>
                  </View>
                  
                  <View style={styles.projectDates}>
                    <Text style={styles.projectDate}>
                      {formatDate(project.startDate)} - {formatDate(project.endDate)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {activeTab === 'performance' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Performance History</Text>
              {employee.performanceHistory?.map((record, index) => (
                <View key={index} style={styles.performanceCard}>
                  <View style={styles.performanceHeader}>
                    <Text style={styles.performanceMonth}>{record.month}</Text>
                    <View style={styles.performanceScore}>
                      <Ionicons name="star" size={16} color="#F59E0B" />
                      <Text style={styles.performanceScoreText}>{record.score}/5</Text>
                    </View>
                  </View>
                  
                  <View style={styles.performanceStats}>
                    <View style={styles.performanceStat}>
                      <Text style={styles.performanceStatValue}>{record.projects}</Text>
                      <Text style={styles.performanceStatLabel}>Projects</Text>
                    </View>
                    <View style={styles.performanceStat}>
                      <Text style={styles.performanceStatValue}>{record.attendance}%</Text>
                      <Text style={styles.performanceStatLabel}>Attendance</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

          {activeTab === 'attendance' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Attendance Summary</Text>
              
              <View style={styles.attendanceCard}>
                <Text style={styles.attendanceCardTitle}>This Month</Text>
                <View style={styles.attendanceStats}>
                  <View style={styles.attendanceStat}>
                    <Text style={styles.attendanceStatValue}>
                      {employee.attendanceStats?.thisMonth.present}
                    </Text>
                    <Text style={styles.attendanceStatLabel}>Present</Text>
                  </View>
                  <View style={styles.attendanceStat}>
                    <Text style={styles.attendanceStatValue}>
                      {employee.attendanceStats?.thisMonth.absent}
                    </Text>
                    <Text style={styles.attendanceStatLabel}>Absent</Text>
                  </View>
                  <View style={styles.attendanceStat}>
                    <Text style={styles.attendanceStatValue}>
                      {employee.attendanceStats?.thisMonth.late}
                    </Text>
                    <Text style={styles.attendanceStatLabel}>Late</Text>
                  </View>
                  <View style={styles.attendanceStat}>
                    <Text style={styles.attendanceStatValue}>
                      {employee.attendanceStats?.totalHours}h
                    </Text>
                    <Text style={styles.attendanceStatLabel}>Total Hours</Text>
                  </View>
                </View>
              </View>

              <View style={styles.attendanceCard}>
                <Text style={styles.attendanceCardTitle}>Last Month</Text>
                <View style={styles.attendanceStats}>
                  <View style={styles.attendanceStat}>
                    <Text style={styles.attendanceStatValue}>
                      {employee.attendanceStats?.lastMonth.present}
                    </Text>
                    <Text style={styles.attendanceStatLabel}>Present</Text>
                  </View>
                  <View style={styles.attendanceStat}>
                    <Text style={styles.attendanceStatValue}>
                      {employee.attendanceStats?.lastMonth.absent}
                    </Text>
                    <Text style={styles.attendanceStatLabel}>Absent</Text>
                  </View>
                  <View style={styles.attendanceStat}>
                    <Text style={styles.attendanceStatValue}>
                      {employee.attendanceStats?.lastMonth.late}
                    </Text>
                    <Text style={styles.attendanceStatLabel}>Late</Text>
                  </View>
                  <View style={styles.attendanceStat}>
                    <Text style={styles.attendanceStatValue}>
                      {employee.attendanceStats?.overtime}h
                    </Text>
                    <Text style={styles.attendanceStatLabel}>Overtime</Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Contact Modal */}
      <Modal
        visible={showContactModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowContactModal(false)}>
              <Text style={styles.modalCancel}>Close</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Contact Information</Text>
            <View style={{ width: 50 }} />
          </View>

          <View style={styles.modalContent}>
            <View style={styles.contactSection}>
              <Text style={styles.contactSectionTitle}>Employee Contact</Text>
              <TouchableOpacity 
                style={styles.contactItem}
                onPress={() => handleCall(employee.phone)}
              >
                <Ionicons name="call" size={20} color="#3B82F6" />
                <View style={styles.contactInfo}>
                  <Text style={styles.contactLabel}>Phone</Text>
                  <Text style={styles.contactValue}>{employee.phone}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#6B7280" />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.contactItem}
                onPress={() => handleEmail(employee.email)}
              >
                <Ionicons name="mail" size={20} color="#3B82F6" />
                <View style={styles.contactInfo}>
                  <Text style={styles.contactLabel}>Email</Text>
                  <Text style={styles.contactValue}>{employee.email}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {employee.emergencyContact && (
              <View style={styles.contactSection}>
                <Text style={styles.contactSectionTitle}>Emergency Contact</Text>
                <TouchableOpacity 
                  style={styles.contactItem}
                  onPress={() => handleCall(employee.emergencyContact.phone)}
                >
                  <Ionicons name="call" size={20} color="#EF4444" />
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactLabel}>
                      {employee.emergencyContact.name} ({employee.emergencyContact.relationship})
                    </Text>
                    <Text style={styles.contactValue}>{employee.emergencyContact.phone}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#6B7280" />
                </TouchableOpacity>
              </View>
            )}
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
  scrollContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  headerContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 24,
    marginBottom: 16,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  placeholderAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  employeePosition: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 2,
  },
  employeeId: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EBF5FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: (width - 48) / 2,
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
  statSubtitle: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 2,
    textAlign: 'center',
  },
  tabsContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  activeTabButton: {
    backgroundColor: '#EBF5FF',
  },
  tabButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  activeTabButtonText: {
    color: '#3B82F6',
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  sectionContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    minWidth: 60,
  },
  infoValue: {
    fontSize: 14,
    color: '#1F2937',
    flex: 1,
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  skillTag: {
    backgroundColor: '#EBF5FF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  skillTagText: {
    fontSize: 12,
    color: '#1D4ED8',
    fontWeight: '500',
  },
  certTag: {
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  certTagText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
  },
  projectCard: {
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
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  projectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    marginRight: 12,
  },
  projectStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  projectStatusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  projectRole: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  projectProgress: {
    marginBottom: 8,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  progressValue: {
    fontSize: 12,
    color: '#1F2937',
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
  },
  projectDates: {
    marginTop: 8,
  },
  projectDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  performanceCard: {
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
  performanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  performanceMonth: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  performanceScore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  performanceScoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  performanceStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  performanceStat: {
    alignItems: 'center',
  },
  performanceStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  performanceStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
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
  attendanceCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  attendanceStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  attendanceStat: {
    alignItems: 'center',
    flex: 1,
  },
  attendanceStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  attendanceStatLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
    textAlign: 'center',
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
  modalContent: {
    flex: 1,
    padding: 16,
  },
  contactSection: {
    marginBottom: 32,
  },
  contactSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 14,
    color: '#6B7280',
  },
});
