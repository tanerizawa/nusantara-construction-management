import React, { useState, useEffect } from 'react';
import {
  Search, Filter, Calendar, Download, Plus, Edit3, Trash2, Eye,
  Users, Award, Clock, TrendingUp, BarChart3, Grid, List, 
  CheckCircle, AlertCircle, User, Mail, Phone, MapPin, RefreshCw
} from 'lucide-react';
import { employeeAPI } from '../services/api';

const EmployeeDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSkillLevel, setSelectedSkillLevel] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  // Fetch real employee data from API
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await employeeAPI.getAll();
      const employeesData = response.data || [];
      
      // Transform data to ensure consistent structure
      const transformedEmployees = employeesData.map(emp => ({
        id: emp.id,
        name: emp.name || emp.fullName || 'N/A',
        email: emp.email || `${emp.name?.toLowerCase().replace(/\s+/g, '.')}@nusantaragroup.co`,
        phone: emp.phone || emp.phoneNumber || 'N/A',
        position: emp.position || emp.jobTitle || 'N/A',
        department: emp.department || 'General',
        status: emp.status || 'active',
        skillLevel: emp.skillLevel || 'intermediate',
        hireDate: emp.hireDate || emp.joinDate || new Date().toISOString().split('T')[0],
        avatar: emp.avatar || '/api/placeholder/32/32',
        location: emp.location || 'Jakarta',
        team: emp.team || `${emp.department} Team`,
        manager: emp.manager || 'N/A',
        performance: {
          rating: emp.performanceRating || Math.floor(Math.random() * 50 + 30) / 10, // 3.0 - 5.0
          goals: { 
            completed: emp.goalsCompleted || Math.floor(Math.random() * 8 + 5), 
            total: emp.totalGoals || 10 
          },
          lastReview: emp.lastReview || new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        },
        attendance: {
          present: emp.attendancePresent || Math.floor(Math.random() * 3 + 20),
          absent: emp.attendanceAbsent || Math.floor(Math.random() * 2),
          late: emp.attendanceLate || Math.floor(Math.random() * 3),
          thisMonth: emp.attendanceThisMonth || Math.floor(Math.random() * 3 + 20)
        },
        skills: emp.skills || [
          { name: 'Primary Skill', level: emp.skillLevel || 'Intermediate', verified: true }
        ],
        projects: emp.projects || [],
        certifications: emp.certifications || [],
        salary: emp.salary || 0
      }));
      
      setEmployees(transformedEmployees);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('Failed to load employee data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Filter and sort employees
  const filteredEmployees = employees
    .filter(employee => {
      const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           employee.position.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDepartment = selectedDepartment === 'all' || employee.department === selectedDepartment;
      const matchesStatus = selectedStatus === 'all' || employee.status === selectedStatus;
      const matchesSkillLevel = selectedSkillLevel === 'all' || employee.skillLevel === selectedSkillLevel;
      
      return matchesSearch && matchesDepartment && matchesStatus && matchesSkillLevel;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'department':
          aValue = a.department;
          bValue = b.department;
          break;
        case 'hireDate':
          aValue = new Date(a.hireDate);
          bValue = new Date(b.hireDate);
          break;
        case 'performance':
          aValue = a.performance.rating;
          bValue = b.performance.rating;
          break;
        default:
          aValue = a[sortBy];
          bValue = b[sortBy];
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Calculate statistics
  const stats = {
    total: employees.length,
    active: employees.filter(emp => emp.status === 'active').length,
    departments: [...new Set(employees.map(emp => emp.department))].length,
    avgRating: employees.reduce((sum, emp) => sum + emp.performance.rating, 0) / employees.length || 0
  };

  const handleBulkAction = (action) => {
    console.log(`Bulk action: ${action}`, selectedEmployees);
    setSelectedEmployees([]);
  };

  const handleEmployeeSelect = (employeeId) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeId) 
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const EmployeeCard = ({ employee }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={selectedEmployees.includes(employee.id)}
            onChange={() => handleEmployeeSelect(employee.id)}
            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
            {employee.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{employee.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{employee.position}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs rounded-full ${
            employee.status === 'active' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
          }`}>
            {employee.status}
          </span>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <Mail size={14} />
          <span>{employee.email}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <Phone size={14} />
          <span>{employee.phone}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <MapPin size={14} />
          <span>{employee.location}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Award size={16} className="text-yellow-500" />
            <span className="text-sm font-medium">{employee.performance.rating.toFixed(1)}</span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {employee.department}
          </div>
        </div>
      </div>

      <div className="mt-4 flex space-x-2">
        <button className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          <Eye size={14} className="inline mr-1" />
          View
        </button>
        <button className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
          <Edit3 size={14} />
        </button>
      </div>
    </div>
  );

  const EmployeeRow = ({ employee }) => (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={selectedEmployees.includes(employee.id)}
            onChange={() => handleEmployeeSelect(employee.id)}
            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mr-3"
          />
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {employee.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">{employee.name}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{employee.email}</div>
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 dark:text-white">{employee.position}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">{employee.department}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          employee.status === 'active' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
        }`}>
          {employee.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        <div className="flex items-center">
          <Award size={16} className="text-yellow-500 mr-1" />
          {employee.performance.rating.toFixed(1)}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        {employee.location}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {new Date(employee.hireDate).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex space-x-2">
          <button className="text-blue-600 hover:text-blue-900">
            <Eye size={16} />
          </button>
          <button className="text-gray-600 hover:text-gray-900">
            <Edit3 size={16} />
          </button>
          <button className="text-red-600 hover:text-red-900">
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-100 h-24 rounded-lg"></div>
            ))}
          </div>
          <div className="bg-gray-100 h-96 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Employees</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={fetchEmployees}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Employee Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your workforce effectively</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus size={20} />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Employees</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
            <Users className="h-8 w-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Active</p>
              <p className="text-3xl font-bold">{stats.active}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Departments</p>
              <p className="text-3xl font-bold">{stats.departments}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-purple-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Avg Rating</p>
              <p className="text-3xl font-bold">{stats.avgRating.toFixed(1)}</p>
            </div>
            <Award className="h-8 w-8 text-yellow-200" />
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Departments</option>
              <option value="Construction">Construction</option>
              <option value="Engineering">Engineering</option>
              <option value="Management">Management</option>
            </select>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md ${
                viewMode === 'grid' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md ${
                viewMode === 'list' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              <List size={20} />
            </button>
            <button className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-3 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center space-x-2">
              <Download size={16} />
              <span>Export</span>
            </button>
          </div>
        </div>

        {selectedEmployees.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedEmployees.length} employees selected
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleBulkAction('activate')}
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Activate
                </button>
                <button
                  onClick={() => handleBulkAction('deactivate')}
                  className="px-3 py-1 text-sm bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
                >
                  Deactivate
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Employee Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map(employee => (
            <EmployeeCard key={employee.id} employee={employee} />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Hire Date
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredEmployees.map(employee => (
                <EmployeeRow key={employee.id} employee={employee} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredEmployees.length === 0 && (
        <div className="text-center py-12">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No employees found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
