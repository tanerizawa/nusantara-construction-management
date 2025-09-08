import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  UserCheck, 
  Search,
  Calendar,
  Award,
  Clock,
  BarChart3,
  TrendingUp,
  Phone,
  Mail,
  Eye,
  MoreVertical,
  CheckCircle,
  X,
  BookOpen,
  Shield,
  Target,
  Bell,
  FileText,
  Settings,
  Brain,
  MessageCircle,
  UserPlus,
  LayoutDashboard,
  AlertTriangle
} from 'lucide-react';
import { employeeAPI } from '../services/api';
import TrainingManagement from '../components/TrainingManagement';
import SafetyComplianceManagement from '../components/SafetyComplianceManagement';
import PerformanceEvaluationManagement from '../components/PerformanceEvaluationManagement';
import CertificationAlertsManagement from '../components/CertificationAlertsManagement';
import EmployeeQuickActions from '../components/EmployeeQuickActions';
import EmployeeDashboard from '../components/EmployeeDashboard';
import HRReports from '../components/HR/HRReports';
import HRWorkflow from '../components/HR/HRWorkflow';
import EmployeeSelfService from '../components/HR/EmployeeSelfService';
import HRNotifications from '../components/HR/HRNotifications';
import HRPredictiveAnalytics from '../components/AI/HRPredictiveAnalytics';
import HRChatbot from '../components/AI/HRChatbot';
import SmartEmployeeMatching from '../components/AI/SmartEmployeeMatching';

const Manpower = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await employeeAPI.getAll();
        console.log('Manpower API Response:', response);
        
        // Backend returns data array directly or with data property
        const employeeData = response.data || response;
        setEmployees(Array.isArray(employeeData) ? employeeData : []);
      } catch (error) {
        console.error('Error fetching employees:', error);
        setError(error.message || 'Failed to fetch employee data');
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50';
      case 'inactive': return 'text-gray-600 bg-gray-50';
      case 'on_leave': return 'text-yellow-600 bg-yellow-50';
      case 'terminated': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPerformanceColor = (performance) => {
    if (performance >= 4.5) return 'text-green-600';
    if (performance >= 4.0) return 'text-blue-600';
    if (performance >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === '' || emp.department === roleFilter;
    const matchesStatus = statusFilter === '' || emp.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = {
    total: employees.length,
    active: employees.filter(e => e.status === 'active').length,
    onLeave: employees.filter(e => e.status === 'on_leave').length,
    avgPerformance: employees.reduce((sum, e) => sum + e.performance, 0) / employees.length || 0,
    avgAttendance: employees.reduce((sum, e) => sum + e.attendance, 0) / employees.length || 0,
    totalOvertimeHours: employees.reduce((sum, e) => sum + e.overtimeHours, 0)
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manpower Management</h1>
          <p className="text-gray-600 mt-1">Manage employees, attendance, dan performance</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <BarChart3 className="h-4 w-4" />
            Reports
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Employee
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <UserCheck className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">On Leave</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.onLeave}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Performance</p>
              <p className="text-2xl font-bold text-blue-600">{stats.avgPerformance.toFixed(1)}/5</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Award className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Attendance</p>
              <p className="text-2xl font-bold text-green-600">{stats.avgAttendance.toFixed(0)}%</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total OT Hours</p>
              <p className="text-2xl font-bold text-orange-600">{stats.totalOvertimeHours}h</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Departments</option>
            <option value="Construction">Construction</option>
            <option value="Engineering">Engineering</option>
            <option value="Operations">Operations</option>
            <option value="Quality Assurance">Quality Assurance</option>
          </select>

          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="on_leave">On Leave</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Optimized Tabs - Construction Industry Focus */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 inline mr-1" />
              Overview & Dashboard
            </button>
            <button
              onClick={() => setActiveTab('employee-management')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'employee-management'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users className="w-4 h-4 inline mr-1" />
              Employee Management
            </button>
            <button
              onClick={() => setActiveTab('performance')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'performance'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-1" />
              Performance & Evaluation
            </button>
            <button
              onClick={() => setActiveTab('training')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'training'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <BookOpen className="w-4 h-4 inline mr-1" />
              Training Management
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-1" />
              Analytics & Reports
            </button>
            <button
              onClick={() => setActiveTab('quickactions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'quickactions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Settings className="w-4 h-4 inline mr-1" />
              Quick Actions
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Manpower Overview & Dashboard</h3>
                <div className="flex space-x-2">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    <FileText className="w-4 h-4 inline mr-1" />
                    Generate Report
                  </button>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                    <Users className="w-4 h-4 inline mr-1" />
                    Quick Add Employee
                  </button>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  <strong>Construction Industry Focus:</strong> Use dedicated submenu for detailed operations - 
                  Attendance & Payroll, Safety & K3 Management, Training & Certifications available in sidebar.
                </p>
              </div>

              {/* Quick Access Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">Employee Directory</h4>
                      <p className="text-sm text-gray-600">Access complete workforce</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    View All Employees
                  </button>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">Performance Review</h4>
                      <p className="text-sm text-gray-600">Evaluate & track progress</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                  <button className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
                    Start Evaluation
                  </button>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">Training Programs</h4>
                      <p className="text-sm text-gray-600">Schedule & manage training</p>
                    </div>
                    <BookOpen className="w-8 h-8 text-purple-600" />
                  </div>
                  <button className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors">
                    Training Manager
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'employee-management' && (
            <div className="space-y-4">{filteredEmployees.map((employee) => (
                <div key={employee.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xl font-bold text-blue-600">
                          {employee.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{employee.name}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                            {employee.status.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-1">{employee.position} • {employee.department}</p>
                        <p className="text-sm text-gray-500">{employee.employeeId}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => setSelectedEmployee(employee)}
                        className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm"
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4">
                    <div>
                      <p className="text-sm text-gray-600">Current Project</p>
                      <p className="font-medium text-gray-900">{employee.projectName || 'Not Assigned'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Performance</p>
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${getPerformanceColor(employee.performance)}`}>
                          {employee.performance}/5
                        </span>
                        <Award className="h-4 w-4 text-yellow-500" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Attendance</p>
                      <p className="font-medium text-green-600">{employee.attendance}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">OT Hours (Month)</p>
                      <p className="font-medium text-orange-600">{employee.overtimeHours}h</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-sm text-gray-600">Contact</p>
                      <div className="flex items-center gap-2 text-gray-900">
                        <Mail className="h-4 w-4" />
                        <span className="text-sm">{employee.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-900 mt-1">
                        <Phone className="h-4 w-4" />
                        <span className="text-sm">{employee.phone}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Skills</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {employee.skills.slice(0, 3).map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                            {typeof skill === 'string' ? skill : skill.name}
                          </span>
                        ))}
                        {employee.skills.length > 3 && (
                          <span className="px-2 py-1 bg-gray-50 text-gray-700 text-xs rounded">
                            +{employee.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Certifications</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {employee.certifications.slice(0, 2).map((cert, index) => (
                          <span key={index} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded">
                            {cert}
                          </span>
                        ))}
                        {employee.certifications.length > 2 && (
                          <span className="px-2 py-1 bg-gray-50 text-gray-700 text-xs rounded">
                            +{employee.certifications.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Performance & Evaluation Management</h3>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  <TrendingUp className="w-4 h-4 inline mr-1" />
                  Start New Evaluation
                </button>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h4 className="text-md font-medium text-gray-900 mb-4">Performance Overview</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">87%</div>
                    <div className="text-sm text-gray-600">Avg Performance Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">23</div>
                    <div className="text-sm text-gray-600">Pending Reviews</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">45</div>
                    <div className="text-sm text-gray-600">Completed Q4</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'training' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Training Management</h3>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                  <BookOpen className="w-4 h-4 inline mr-1" />
                  Schedule Training
                </button>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h4 className="text-md font-medium text-gray-900 mb-4">Training Programs</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900">K3 Safety Training</h5>
                    <p className="text-sm text-gray-600 mt-1">Next session: Dec 15, 2024</p>
                    <div className="mt-2 flex justify-between text-sm">
                      <span>Enrolled: 15/20</span>
                      <span className="text-green-600">75% completion</span>
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900">Technical Skills</h5>
                    <p className="text-sm text-gray-600 mt-1">Next session: Dec 20, 2024</p>
                    <div className="mt-2 flex justify-between text-sm">
                      <span>Enrolled: 8/15</span>
                      <span className="text-blue-600">53% completion</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Analytics & Reports</h3>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                  <BarChart3 className="w-4 h-4 inline mr-1" />
                  Export Analytics
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Workforce Analytics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Productivity</span>
                      <span className="text-sm font-medium text-green-600">↑ 12%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Safety Compliance</span>
                      <span className="text-sm font-medium text-green-600">96%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Training Completion</span>
                      <span className="text-sm font-medium text-blue-600">87%</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h4 className="text-md font-medium text-gray-900 mb-4">AI Insights</h4>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <span className="text-gray-600">Predicted turnover risk:</span>
                      <span className="ml-2 text-yellow-600 font-medium">3 employees</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Skill gap analysis:</span>
                      <span className="ml-2 text-red-600 font-medium">Critical: Welding</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Optimal team size:</span>
                      <span className="ml-2 text-green-600 font-medium">+5 for Q1</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'quickactions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Quick Actions & Tools</h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="p-6 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <UserPlus className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <span className="text-sm font-medium block">Add Employee</span>
                  <span className="text-xs text-gray-500">Quick onboarding</span>
                </button>
                
                <button className="p-6 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Calendar className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <span className="text-sm font-medium block">Schedule Meeting</span>
                  <span className="text-xs text-gray-500">Team coordination</span>
                </button>
                
                <button className="p-6 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <span className="text-sm font-medium block">Generate Report</span>
                  <span className="text-xs text-gray-500">Instant reports</span>
                </button>
                
                <button className="p-6 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Shield className="w-8 h-8 mx-auto mb-2 text-red-600" />
                  <span className="text-sm font-medium block">Safety Alert</span>
                  <span className="text-xs text-gray-500">Emergency protocols</span>
                </button>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm">
                  <strong>Note:</strong> For detailed operations, use dedicated submenu items:
                  <br />• Attendance & Payroll (sidebar submenu)
                  <br />• Safety & K3 Management (sidebar submenu)  
                  <br />• Training & Certifications (sidebar submenu)
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Employee Detail Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-blue-600">
                      {selectedEmployee.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedEmployee.name}</h3>
                    <p className="text-gray-600">{selectedEmployee.position} • {selectedEmployee.employeeId}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedEmployee(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Employee Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Employee Information</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-600">Department</label>
                      <p className="text-gray-900">{selectedEmployee.department}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Join Date</label>
                      <p className="text-gray-900">{selectedEmployee.joinDate}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Current Project</label>
                      <p className="text-gray-900">{selectedEmployee.projectName || 'Not Assigned'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Last Login</label>
                      <p className="text-gray-900">{selectedEmployee.lastLogin}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-600">Performance Rating</label>
                      <p className={`text-lg font-semibold ${getPerformanceColor(selectedEmployee.performance)}`}>
                        {selectedEmployee.performance}/5
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Attendance Rate</label>
                      <p className="text-lg font-semibold text-green-600">{selectedEmployee.attendance}%</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Monthly Overtime</label>
                      <p className="text-lg font-semibold text-orange-600">{selectedEmployee.overtimeHours} hours</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Monthly Salary</label>
                      <p className="text-lg font-semibold text-gray-900">
                        Rp {selectedEmployee.salary.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills & Certifications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedEmployee.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
                        {typeof skill === 'string' ? skill : skill.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Certifications</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedEmployee.certifications.map((cert, index) => (
                      <span key={index} className="px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <Mail className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="text-gray-900">{selectedEmployee.email}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <Phone className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="text-gray-900">{selectedEmployee.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Add New Employee</h3>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Add Employee Form</h3>
                <p className="text-gray-600">Employee registration form akan ditampilkan di sini</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Manpower;
