import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Clock, 
  DollarSign, 
  Eye,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BarChart3,
  Search,
  Edit3
} from 'lucide-react';

const AttendancePayroll = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [payrollData, setPayrollData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('attendance');
  const [selectedMonth, setSelectedMonth] = useState('2025-08');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  useEffect(() => {
    const mockAttendanceData = [
      {
        id: 1,
        employeeId: 'EMP-001',
        name: 'Budi Santoso',
        department: 'Construction',
        position: 'Site Manager',
        workingDays: 26,
        presentDays: 24,
        lateDays: 2,
        absentDays: 1,
        overtimeHours: 15,
        attendanceRate: 92.3,
        status: 'Active'
      },
      {
        id: 2,
        employeeId: 'EMP-002',
        name: 'Siti Rahmawati',
        department: 'Finance',
        position: 'Accounting Staff',
        workingDays: 25,
        presentDays: 25,
        lateDays: 0,
        absentDays: 0,
        overtimeHours: 8,
        attendanceRate: 100.0,
        status: 'Active'
      },
      {
        id: 3,
        employeeId: 'EMP-003',
        name: 'Ahmad Wijaya',
        department: 'HR',
        position: 'HR Specialist',
        workingDays: 24,
        presentDays: 22,
        lateDays: 1,
        absentDays: 2,
        overtimeHours: 12,
        attendanceRate: 91.7,
        status: 'Active'
      }
    ];

    const mockPayrollData = [
      {
        id: 1,
        employeeId: 'EMP-001',
        name: 'Budi Santoso',
        department: 'Construction',
        position: 'Site Manager',
        basicSalary: 15000000,
        allowances: 2500000,
        overtime: 750000,
        overtimePay: 750000,
        deductions: 500000,
        netSalary: 17750000,
        taxDeduction: 1200000,
        status: 'Paid',
        payDate: '2024-07-31'
      },
      {
        id: 2,
        employeeId: 'EMP-002',
        name: 'Siti Rahmawati',
        department: 'Finance',
        position: 'Accounting Staff',
        basicSalary: 8000000,
        allowances: 1200000,
        overtime: 400000,
        overtimePay: 400000,
        deductions: 300000,
        netSalary: 9300000,
        taxDeduction: 800000,
        status: 'Paid',
        payDate: '2024-07-31'
      },
      {
        id: 3,
        employeeId: 'EMP-003',
        name: 'Ahmad Wijaya',
        department: 'HR',
        position: 'HR Specialist',
        basicSalary: 10000000,
        allowances: 1500000,
        overtime: 600000,
        overtimePay: 600000,
        deductions: 400000,
        netSalary: 11700000,
        taxDeduction: 950000,
        status: 'Pending',
        payDate: '2024-08-01'
      }
    ];

    // Simulate data fetching
    setTimeout(() => {
      setAttendanceData(mockAttendanceData);
      setPayrollData(mockPayrollData);
      setLoading(false);
    }, 500);
  }, []);

  const getAttendanceColor = (rate) => {
    if (rate >= 95) return 'text-green-600';
    if (rate >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'processed': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'failed': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const filteredAttendance = attendanceData.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === '' || emp.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const filteredPayroll = payrollData.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === '' || emp.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const attendanceStats = {
    totalEmployees: attendanceData.length,
    avgAttendanceRate: attendanceData.reduce((sum, emp) => sum + emp.attendanceRate, 0) / attendanceData.length || 0,
    totalOvertimeHours: attendanceData.reduce((sum, emp) => sum + emp.overtimeHours, 0),
    totalAbsentDays: attendanceData.reduce((sum, emp) => sum + emp.absentDays, 0)
  };

  const payrollStats = {
    totalPayroll: payrollData.reduce((sum, emp) => sum + emp.netSalary, 0),
    processedPayroll: payrollData.filter(emp => emp.status === 'processed').length,
    pendingPayroll: payrollData.filter(emp => emp.status === 'pending').length,
    totalTaxDeduction: payrollData.reduce((sum, emp) => sum + emp.taxDeduction, 0)
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
          <h1 className="text-2xl font-bold text-gray-900">Attendance & Payroll</h1>
          <p className="text-gray-600 mt-1">Manage employee attendance dan payroll processing</p>
        </div>
        <div className="flex gap-3">
          <select 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="2025-08">August 2025</option>
            <option value="2025-07">July 2025</option>
            <option value="2025-06">June 2025</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Upload className="h-4 w-4" />
            Import
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      {activeTab === 'attendance' ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900">{attendanceStats.totalEmployees}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Attendance</p>
                <p className="text-2xl font-bold text-green-600">{attendanceStats.avgAttendanceRate.toFixed(1)}%</p>
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
                <p className="text-2xl font-bold text-orange-600">{attendanceStats.totalOvertimeHours}h</p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Absent Days</p>
                <p className="text-2xl font-bold text-red-600">{attendanceStats.totalAbsentDays}</p>
              </div>
              <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Payroll</p>
                <p className="text-2xl font-bold text-gray-900">Rp {(payrollStats.totalPayroll / 1000000000).toFixed(1)}B</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Processed</p>
                <p className="text-2xl font-bold text-green-600">{payrollStats.processedPayroll}</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{payrollStats.pendingPayroll}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tax Deduction</p>
                <p className="text-2xl font-bold text-purple-600">Rp {(payrollStats.totalTaxDeduction / 1000000).toFixed(0)}M</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      )}

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
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Departments</option>
            <option value="Construction">Construction</option>
            <option value="Engineering">Engineering</option>
            <option value="Operations">Operations</option>
            <option value="Quality Assurance">Quality Assurance</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('attendance')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'attendance'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Attendance Tracking
            </button>
            <button
              onClick={() => setActiveTab('payroll')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'payroll'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Payroll Management
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'attendance' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm">Employee</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm">Department</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm">Working Days</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm">Present Days</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm">Late Days</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm">Absent Days</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm">OT Hours</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm">Attendance Rate</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredAttendance.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div>
                          <div className="font-medium text-gray-900">{employee.name}</div>
                          <div className="text-sm text-gray-500">{employee.employeeId}</div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-700">{employee.department}</td>
                      <td className="py-4 px-6 text-gray-900 text-center">{employee.workingDays}</td>
                      <td className="py-4 px-6 text-green-600 text-center font-medium">{employee.presentDays}</td>
                      <td className="py-4 px-6 text-yellow-600 text-center font-medium">{employee.lateDays}</td>
                      <td className="py-4 px-6 text-red-600 text-center font-medium">{employee.absentDays}</td>
                      <td className="py-4 px-6 text-orange-600 text-center font-medium">{employee.overtimeHours}h</td>
                      <td className="py-4 px-6 text-center">
                        <span className={`font-medium ${getAttendanceColor(employee.attendanceRate)}`}>
                          {employee.attendanceRate.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                            <Edit3 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'payroll' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm">Employee</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm">Department</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm">Basic Salary</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm">OT Pay</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm">Allowances</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm">Deductions</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm">Net Salary</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm">Status</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-600 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredPayroll.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div>
                          <div className="font-medium text-gray-900">{employee.name}</div>
                          <div className="text-sm text-gray-500">{employee.employeeId}</div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-700">{employee.department}</td>
                      <td className="py-4 px-6 text-gray-900">Rp {(employee.basicSalary / 1000000).toFixed(1)}M</td>
                      <td className="py-4 px-6 text-orange-600">Rp {(employee.overtimePay / 1000000).toFixed(2)}M</td>
                      <td className="py-4 px-6 text-green-600">Rp {(employee.allowances / 1000000).toFixed(1)}M</td>
                      <td className="py-4 px-6 text-red-600">Rp {(employee.deductions / 1000000).toFixed(2)}M</td>
                      <td className="py-4 px-6 font-bold text-gray-900">Rp {(employee.netSalary / 1000000).toFixed(2)}M</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                          {employee.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                            <Edit3 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendancePayroll;
