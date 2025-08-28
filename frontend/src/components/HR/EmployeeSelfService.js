import React, { useState, useEffect } from 'react';
import { DataCard, Button } from '../DataStates';
import {
  User,
  Calendar,
  BookOpen,
  Award,
  Clock,
  FileText,
  Download,
  Upload,
  Bell,
  Eye,
  Edit,
  Save,
  Plus,
  CheckCircle,
  Target,
  TrendingUp
} from 'lucide-react';

const EmployeeSelfService = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [employee, setEmployee] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [timeOffRequests, setTimeOffRequests] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [payslips, setPayslips] = useState([]);
  const [documents, setDocuments] = useState([]);

  // Mock current employee data (in real app, this would come from auth context)
  const mockEmployeeData = {
    id: 1,
    employeeId: 'EMP-001',
    name: 'Budi Santoso',
    position: 'Site Manager',
    department: 'Construction',
    email: 'budi.santoso@ykgroup.com',
    phone: '08123456789',
    address: 'Jl. Merdeka No. 123, Jakarta',
    joinDate: '2023-01-15',
    birthDate: '1985-03-20',
    emergencyContact: {
      name: 'Siti Santoso',
      relationship: 'Spouse',
      phone: '08123456788'
    },
    manager: 'Ahmad Rahman',
    status: 'active',
    salary: 15000000,
    currentProject: 'PRJ-2025-001',
    projectName: 'Pembangunan Rumah Tinggal Jl. Mawar',
    skills: ['Project Management', 'Construction Safety', 'Team Leadership'],
    certifications: [
      { name: 'PMP', issueDate: '2023-01-01', expiryDate: '2026-01-01' },
      { name: 'OSHA 30', issueDate: '2023-06-01', expiryDate: '2025-06-01' }
    ],
    performance: {
      overall: 4.5,
      goals: [
        { id: 1, title: 'Complete Project Phase 1', progress: 85, deadline: '2024-09-30' },
        { id: 2, title: 'Team Training Completion', progress: 100, deadline: '2024-08-31' },
        { id: 3, title: 'Safety Compliance', progress: 90, deadline: '2024-12-31' }
      ]
    },
    attendance: {
      rate: 95,
      totalDays: 22,
      presentDays: 21,
      absentDays: 1,
      lateDays: 2
    },
    leaveBalance: {
      annual: 12,
      sick: 8,
      personal: 3
    }
  };

  const mockNotifications = [
    {
      id: 1,
      type: 'training',
      title: 'New Training Available',
      message: 'Safety Training Module 3 is now available',
      date: '2024-08-28',
      read: false
    },
    {
      id: 2,
      type: 'payroll',
      title: 'Payslip Available',
      message: 'Your August 2024 payslip is ready for download',
      date: '2024-08-25',
      read: false
    },
    {
      id: 3,
      type: 'performance',
      title: 'Performance Review Due',
      message: 'Q3 2024 performance review is due next week',
      date: '2024-08-20',
      read: true
    }
  ];

  const mockTimeOffRequests = [
    {
      id: 1,
      type: 'Annual Leave',
      startDate: '2024-09-15',
      endDate: '2024-09-17',
      days: 3,
      reason: 'Family vacation',
      status: 'approved',
      appliedDate: '2024-08-15'
    },
    {
      id: 2,
      type: 'Sick Leave',
      startDate: '2024-08-10',
      endDate: '2024-08-10',
      days: 1,
      reason: 'Medical appointment',
      status: 'approved',
      appliedDate: '2024-08-09'
    }
  ];

  const mockTrainings = [
    {
      id: 1,
      title: 'Advanced Project Management',
      provider: 'Internal Training',
      status: 'completed',
      completionDate: '2024-07-15',
      certificate: true,
      progress: 100
    },
    {
      id: 2,
      title: 'Safety Training Module 3',
      provider: 'Safety Department',
      status: 'in_progress',
      progress: 65,
      deadline: '2024-09-30'
    },
    {
      id: 3,
      title: 'Leadership Development',
      provider: 'External Provider',
      status: 'assigned',
      progress: 0,
      deadline: '2024-12-31'
    }
  ];

  const mockPayslips = [
    {
      id: 1,
      month: 'August 2024',
      grossSalary: 15000000,
      deductions: 2250000,
      netSalary: 12750000,
      downloadUrl: '#'
    },
    {
      id: 2,
      month: 'July 2024',
      grossSalary: 15000000,
      deductions: 2250000,
      netSalary: 12750000,
      downloadUrl: '#'
    }
  ];

  const mockDocuments = [
    {
      id: 1,
      name: 'Employment Contract',
      type: 'Contract',
      uploadDate: '2023-01-15',
      status: 'approved'
    },
    {
      id: 2,
      name: 'PMP Certificate',
      type: 'Certification',
      uploadDate: '2023-02-01',
      status: 'approved'
    },
    {
      id: 3,
      name: 'Medical Certificate',
      type: 'Medical',
      uploadDate: '2024-08-10',
      status: 'pending'
    }
  ];

  useEffect(() => {
    // Simulate API calls
    setTimeout(() => {
      setEmployee(mockEmployeeData);
      setNotifications(mockNotifications);
      setTimeOffRequests(mockTimeOffRequests);
      setTrainings(mockTrainings);
      setPayslips(mockPayslips);
      setDocuments(mockDocuments);
      setLoading(false);
    }, 1000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleProfileUpdate = () => {
    // In real app, this would make API call
    setEditMode(false);
    alert('Profile updated successfully!');
  };

  const handleTimeOffRequest = () => {
    // In real app, this would open time off request form
    alert('Time off request form will open here');
  };

  const markNotificationRead = (notificationId) => {
    setNotifications(notifications.map(notif =>
      notif.id === notificationId ? { ...notif, read: true } : notif
    ));
  };

  const downloadDocument = (docName) => {
    // In real app, this would download the actual document
    alert(`Downloading ${docName}...`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'assigned': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'training': return BookOpen;
      case 'payroll': return FileText;
      case 'performance': return Target;
      default: return Bell;
    }
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
          <h2 className="text-2xl font-bold text-gray-900">Employee Self-Service Portal</h2>
          <p className="text-gray-600 mt-1">Welcome back, {employee.name}!</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="w-6 h-6 text-gray-600" />
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </div>
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold text-blue-600">
              {employee.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DataCard
          title="Attendance Rate"
          value={`${employee.attendance.rate}%`}
          icon={CheckCircle}
          color="green"
        />
        <DataCard
          title="Performance Rating"
          value={`${employee.performance.overall}/5`}
          icon={TrendingUp}
          color="blue"
        />
        <DataCard
          title="Annual Leave Left"
          value={employee.leaveBalance.annual}
          icon={Calendar}
          color="purple"
        />
        <DataCard
          title="Trainings Completed"
          value={trainings.filter(t => t.status === 'completed').length}
          icon={Award}
          color="yellow"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="flex overflow-x-auto">
          {[
            { id: 'profile', label: 'My Profile', icon: User },
            { id: 'attendance', label: 'Attendance', icon: Clock },
            { id: 'timeoff', label: 'Time Off', icon: Calendar },
            { id: 'training', label: 'Training', icon: BookOpen },
            { id: 'performance', label: 'Performance', icon: Target },
            { id: 'payroll', label: 'Payroll', icon: FileText },
            { id: 'documents', label: 'Documents', icon: Upload }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                activeSection === id
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-6">
        {activeSection === 'profile' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <Button
                onClick={() => editMode ? handleProfileUpdate() : setEditMode(true)}
                className={`${editMode ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
              >
                {editMode ? (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </>
                )}
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={employee.name}
                      onChange={(e) => setEmployee({...employee, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{employee.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employee ID
                  </label>
                  <p className="text-gray-900">{employee.employeeId}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position
                  </label>
                  <p className="text-gray-900">{employee.position}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <p className="text-gray-900">{employee.department}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Manager
                  </label>
                  <p className="text-gray-900">{employee.manager}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  {editMode ? (
                    <input
                      type="email"
                      value={employee.email}
                      onChange={(e) => setEmployee({...employee, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{employee.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  {editMode ? (
                    <input
                      type="tel"
                      value={employee.phone}
                      onChange={(e) => setEmployee({...employee, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{employee.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  {editMode ? (
                    <textarea
                      value={employee.address}
                      onChange={(e) => setEmployee({...employee, address: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{employee.address}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Join Date
                  </label>
                  <p className="text-gray-900">{employee.joinDate}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-md font-semibold text-gray-900 mb-4">Emergency Contact</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Name
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={employee.emergencyContact.name}
                      onChange={(e) => setEmployee({
                        ...employee,
                        emergencyContact: {...employee.emergencyContact, name: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{employee.emergencyContact.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Relationship
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={employee.emergencyContact.relationship}
                      onChange={(e) => setEmployee({
                        ...employee,
                        emergencyContact: {...employee.emergencyContact, relationship: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{employee.emergencyContact.relationship}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  {editMode ? (
                    <input
                      type="tel"
                      value={employee.emergencyContact.phone}
                      onChange={(e) => setEmployee({
                        ...employee,
                        emergencyContact: {...employee.emergencyContact, phone: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{employee.emergencyContact.phone}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'attendance' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Attendance Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{employee.attendance.totalDays}</p>
                  <p className="text-sm text-gray-600">Total Working Days</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{employee.attendance.presentDays}</p>
                  <p className="text-sm text-gray-600">Present Days</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">{employee.attendance.absentDays}</p>
                  <p className="text-sm text-gray-600">Absent Days</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-600">{employee.attendance.lateDays}</p>
                  <p className="text-sm text-gray-600">Late Arrivals</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'timeoff' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Time Off Requests</h3>
                <Button
                  onClick={handleTimeOffRequest}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Request Time Off
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{employee.leaveBalance.annual}</p>
                  <p className="text-sm text-gray-600">Annual Leave</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{employee.leaveBalance.sick}</p>
                  <p className="text-sm text-gray-600">Sick Leave</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">{employee.leaveBalance.personal}</p>
                  <p className="text-sm text-gray-600">Personal Leave</p>
                </div>
              </div>

              <div className="space-y-4">
                {timeOffRequests.map((request) => (
                  <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{request.type}</h4>
                        <p className="text-sm text-gray-600">
                          {request.startDate} to {request.endDate} ({request.days} days)
                        </p>
                        <p className="text-sm text-gray-500">{request.reason}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'training' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">My Training Programs</h3>
            <div className="space-y-4">
              {trainings.map((training) => (
                <div key={training.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{training.title}</h4>
                      <p className="text-sm text-gray-600">{training.provider}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(training.status)}`}>
                      {training.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Progress</span>
                      <span className="text-sm font-medium">{training.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${training.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {training.deadline && (
                    <p className="text-sm text-gray-500 mt-2">
                      Deadline: {training.deadline}
                    </p>
                  )}
                  
                  {training.certificate && training.status === 'completed' && (
                    <Button
                      onClick={() => downloadDocument(`${training.title} Certificate`)}
                      className="mt-2 bg-green-600 hover:bg-green-700 text-white text-sm"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download Certificate
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'performance' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Performance Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-3xl font-bold text-blue-600">{employee.performance.overall}</p>
                  <p className="text-sm text-gray-600">Overall Rating</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-3xl font-bold text-green-600">
                    {employee.performance.goals.filter(g => g.progress === 100).length}
                  </p>
                  <p className="text-sm text-gray-600">Goals Completed</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <p className="text-3xl font-bold text-yellow-600">
                    {employee.performance.goals.filter(g => g.progress < 100).length}
                  </p>
                  <p className="text-sm text-gray-600">Goals In Progress</p>
                </div>
              </div>

              <h4 className="font-medium mb-4">Current Goals</h4>
              <div className="space-y-4">
                {employee.performance.goals.map((goal) => (
                  <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium">{goal.title}</h5>
                      <span className="text-sm text-gray-500">Due: {goal.deadline}</span>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">Progress</span>
                        <span className="text-sm font-medium">{goal.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            goal.progress === 100 ? 'bg-green-600' : 'bg-blue-600'
                          }`}
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'payroll' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Payroll Information</h3>
            <div className="space-y-4">
              {payslips.map((payslip) => (
                <div key={payslip.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{payslip.month}</h4>
                      <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
                        <div>
                          <span className="text-gray-600">Gross: </span>
                          <span className="font-medium">Rp {payslip.grossSalary.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Deductions: </span>
                          <span className="font-medium">Rp {payslip.deductions.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Net: </span>
                          <span className="font-medium text-green-600">Rp {payslip.netSalary.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => downloadDocument(`Payslip ${payslip.month}`)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'documents' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">My Documents</h3>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </div>
            
            <div className="space-y-4">
              {documents.map((doc) => (
                <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{doc.name}</h4>
                      <p className="text-sm text-gray-600">{doc.type} • Uploaded: {doc.uploadDate}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(doc.status)}`}>
                        {doc.status}
                      </span>
                      <Button
                        onClick={() => downloadDocument(doc.name)}
                        className="bg-gray-600 hover:bg-gray-700 text-white"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Notifications Panel */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Notifications</h3>
        <div className="space-y-3">
          {notifications.slice(0, 5).map((notification) => {
            const IconComponent = getNotificationIcon(notification.type);
            return (
              <div
                key={notification.id}
                className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer ${
                  notification.read ? 'bg-gray-50' : 'bg-blue-50'
                }`}
                onClick={() => markNotificationRead(notification.id)}
              >
                <IconComponent className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className={`font-medium ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                    {notification.title}
                  </h4>
                  <p className="text-sm text-gray-600">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{notification.date}</p>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EmployeeSelfService;
