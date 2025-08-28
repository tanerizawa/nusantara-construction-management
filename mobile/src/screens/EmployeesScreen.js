import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useOffline } from '../context/OfflineContext';
import { useAuth } from '../context/AuthContext';

export default function EmployeesScreen({ navigation }) {
  const { user } = useAuth();
  const { isConnected, getEmployees, cacheEmployeeData } = useOffline();
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const departments = ['All', 'Construction', 'Engineering', 'Operations', 'Quality Assurance'];

  useEffect(() => {
    loadEmployees();
  }, [isConnected]);

  useEffect(() => {
    filterEmployees();
  }, [employees, searchTerm, selectedDepartment]);

  const loadEmployees = async () => {
    try {
      if (isConnected) {
        // Mock API call - replace with actual API
        const mockEmployees = [
          {
            id: 1,
            employeeId: 'EMP-001',
            name: 'Budi Santoso',
            position: 'Site Manager',
            department: 'Construction',
            email: 'budi.santoso@ykgroup.com',
            phone: '08123456789',
            status: 'active',
            performance: 4.5,
            attendance: 95,
            profileImage: null,
            location: 'Jakarta',
            joinDate: '2023-01-15',
            currentProject: 'Modern Office Complex'
          },
          {
            id: 2,
            employeeId: 'EMP-002',
            name: 'Sari Dewi',
            position: 'Project Engineer',
            department: 'Engineering',
            email: 'sari.dewi@ykgroup.com',
            phone: '08123456790',
            status: 'active',
            performance: 4.8,
            attendance: 98,
            profileImage: null,
            location: 'Jakarta',
            joinDate: '2023-03-20',
            currentProject: 'Residential Villa Development'
          },
          {
            id: 3,
            employeeId: 'EMP-003',
            name: 'Ahmad Rizki',
            position: 'Heavy Equipment Operator',
            department: 'Operations',
            email: 'ahmad.rizki@ykgroup.com',
            phone: '08123456791',
            status: 'active',
            performance: 4.2,
            attendance: 92,
            profileImage: null,
            location: 'Bekasi',
            joinDate: '2022-11-10',
            currentProject: 'Industrial Complex'
          },
          {
            id: 4,
            employeeId: 'EMP-004',
            name: 'Rina Sari',
            position: 'Quality Inspector',
            department: 'Quality Assurance',
            email: 'rina.sari@ykgroup.com',
            phone: '08123456792',
            status: 'active',
            performance: 4.6,
            attendance: 97,
            profileImage: null,
            location: 'Jakarta',
            joinDate: '2023-06-01',
            currentProject: 'Warehouse Complex'
          },
          {
            id: 5,
            employeeId: 'EMP-005',
            name: 'Tono Wijaya',
            position: 'Construction Worker',
            department: 'Construction',
            email: 'tono.wijaya@ykgroup.com',
            phone: '08123456793',
            status: 'on_leave',
            performance: 4.0,
            attendance: 89,
            profileImage: null,
            location: 'Tangerang',
            joinDate: '2024-01-15',
            currentProject: null
          }
        ];

        setEmployees(mockEmployees);
        await cacheEmployeeData(mockEmployees);
      } else {
        // Load from offline storage
        const offlineEmployees = getEmployees();
        if (offlineEmployees) {
          setEmployees(offlineEmployees);
        }
      }
    } catch (error) {
      console.error('Error loading employees:', error);
      Alert.alert('Error', 'Failed to load employee data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterEmployees = () => {
    let filtered = employees;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.position.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by department
    if (selectedDepartment && selectedDepartment !== 'All') {
      filtered = filtered.filter(emp => emp.department === selectedDepartment);
    }

    setFilteredEmployees(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadEmployees();
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

  const getPerformanceColor = (score) => {
    if (score >= 4.5) return '#10B981';
    if (score >= 4.0) return '#3B82F6';
    if (score >= 3.5) return '#F59E0B';
    return '#EF4444';
  };

  const EmployeeCard = ({ employee }) => {
    const statusColors = getStatusColor(employee.status);
    
    return (
      <TouchableOpacity
        style={styles.employeeCard}
        onPress={() => navigation.navigate('EmployeeDetail', { employee })}
      >
        {/* Avatar and Basic Info */}
        <View style={styles.employeeHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {employee.name.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
          <View style={styles.employeeInfo}>
            <Text style={styles.employeeName}>{employee.name}</Text>
            <Text style={styles.employeePosition}>{employee.position}</Text>
            <Text style={styles.employeeId}>{employee.employeeId}</Text>
          </View>
          <View style={styles.employeeStatus}>
            <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
              <Text style={[styles.statusText, { color: statusColors.text }]}>
                {employee.status === 'on_leave' ? 'On Leave' : 
                 employee.status === 'active' ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.employeeStats}>
          <View style={styles.statItem}>
            <Ionicons name="location-outline" size={14} color="#6B7280" />
            <Text style={styles.statText}>{employee.location}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="briefcase-outline" size={14} color="#6B7280" />
            <Text style={styles.statText}>{employee.department}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="star" size={14} color={getPerformanceColor(employee.performance)} />
            <Text style={styles.statText}>{employee.performance}/5</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="checkmark-circle" size={14} color="#10B981" />
            <Text style={styles.statText}>{employee.attendance}%</Text>
          </View>
        </View>

        {/* Current Project */}
        {employee.currentProject && (
          <View style={styles.projectInfo}>
            <Ionicons name="construct-outline" size={14} color="#3B82F6" />
            <Text style={styles.projectText}>{employee.currentProject}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="people-outline" size={48} color="#6B7280" />
        <Text style={styles.loadingText}>Loading employees...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search and Filter Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search employees..."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Ionicons name="filter-outline" size={20} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      {/* Active Filters */}
      {selectedDepartment && selectedDepartment !== 'All' && (
        <View style={styles.activeFilters}>
          <View style={styles.filterChip}>
            <Text style={styles.filterChipText}>{selectedDepartment}</Text>
            <TouchableOpacity onPress={() => setSelectedDepartment('')}>
              <Ionicons name="close" size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Results Summary */}
      <View style={styles.resultsSummary}>
        <Text style={styles.resultsText}>
          {filteredEmployees.length} employee{filteredEmployees.length !== 1 ? 's' : ''} found
        </Text>
        {!isConnected && (
          <View style={styles.offlineIndicator}>
            <Ionicons name="cloud-offline" size={14} color="#F59E0B" />
            <Text style={styles.offlineText}>Offline</Text>
          </View>
        )}
      </View>

      {/* Employee List */}
      <ScrollView
        style={styles.employeeList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredEmployees.map((employee) => (
          <EmployeeCard key={employee.id} employee={employee} />
        ))}
        
        {filteredEmployees.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyText}>No employees found</Text>
            <Text style={styles.emptySubtext}>
              Try adjusting your search or filter criteria
            </Text>
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Filter Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Filter Employees</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Text style={styles.modalDone}>Done</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.filterSectionTitle}>Department</Text>
            {departments.map((dept) => (
              <TouchableOpacity
                key={dept}
                style={styles.filterOption}
                onPress={() => setSelectedDepartment(dept === 'All' ? '' : dept)}
              >
                <Text style={styles.filterOptionText}>{dept}</Text>
                {((dept === 'All' && !selectedDepartment) || selectedDepartment === dept) && (
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
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#1F2937',
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeFilters: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF5FF',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  filterChipText: {
    fontSize: 14,
    color: '#1D4ED8',
  },
  resultsSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  resultsText: {
    fontSize: 14,
    color: '#6B7280',
  },
  offlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  offlineText: {
    fontSize: 12,
    color: '#F59E0B',
  },
  employeeList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  employeeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  employeeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  employeePosition: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  employeeId: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  employeeStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  employeeStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#6B7280',
  },
  projectInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EBF5FF',
    borderRadius: 8,
    padding: 8,
  },
  projectText: {
    fontSize: 12,
    color: '#1D4ED8',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
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
  modalDone: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  filterOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  filterOptionText: {
    fontSize: 16,
    color: '#1F2937',
  },
});
