import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Card } from './DataStates';
import {
  UserPlus,
  Calendar,
  Clock,
  Award,
  BookOpen,
  FileText,
  Send,
  CheckCircle,
  AlertCircle,
  Search
} from 'lucide-react';

function EmployeeQuickActions() {
  const [employees, setEmployees] = useState([]);
  const [quickStats, setQuickStats] = useState({
    newHires: 0,
    birthdays: 0,
    anniversaries: 0,
    onLeave: 0,
    pendingReviews: 0,
    expiringCerts: 0
  });
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [bulkAction, setBulkAction] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const [empResponse, reviewsResponse, alertsResponse] = await Promise.all([
        axios.get('http://localhost:5001/api/manpower', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5001/api/manpower/performance-reviews', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5001/api/manpower/certification-alerts', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const employeesData = empResponse.data;
      setEmployees(employeesData);

      // Calculate quick stats
      const today = new Date();
      const thisMonth = today.getMonth();
      const thisYear = today.getFullYear();

      const stats = {
        newHires: employeesData.filter(emp => {
          const joinDate = new Date(emp.joinDate);
          return joinDate.getMonth() === thisMonth && joinDate.getFullYear() === thisYear;
        }).length,
        birthdays: employeesData.filter(emp => {
          if (!emp.dateOfBirth) return false;
          const birthDate = new Date(emp.dateOfBirth);
          return birthDate.getMonth() === thisMonth;
        }).length,
        anniversaries: employeesData.filter(emp => {
          const joinDate = new Date(emp.joinDate);
          return joinDate.getMonth() === thisMonth && joinDate.getFullYear() !== thisYear;
        }).length,
        onLeave: employeesData.filter(emp => emp.status === 'on_leave').length,
        pendingReviews: reviewsResponse.data.filter(review => review.status === 'pending').length,
        expiringCerts: alertsResponse.data.filter(alert => {
          const daysUntilExpiry = Math.ceil((new Date(alert.currentExpiryDate) - new Date()) / (1000 * 60 * 60 * 24));
          return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
        }).length
      };

      setQuickStats(stats);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEmployeeSelect = (employeeId) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeId) 
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleSelectAll = () => {
    const filteredEmployees = employees.filter(emp => 
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (selectedEmployees.length === filteredEmployees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(filteredEmployees.map(emp => emp.id));
    }
  };

  const executeBulkAction = async () => {
    if (!bulkAction || selectedEmployees.length === 0) return;

    try {
      const token = localStorage.getItem('token');
      
      switch (bulkAction) {
        case 'send_reminder':
          // Send reminder to selected employees
          await axios.post('http://localhost:5001/api/manpower/bulk-reminder', {
            employeeIds: selectedEmployees,
            type: 'general_reminder'
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          alert(`Reminder sent to ${selectedEmployees.length} employees`);
          break;
          
        case 'schedule_review':
          // Schedule performance reviews
          await axios.post('http://localhost:5001/api/manpower/bulk-schedule-review', {
            employeeIds: selectedEmployees
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          alert(`Performance reviews scheduled for ${selectedEmployees.length} employees`);
          break;
          
        case 'assign_training':
          // This would open a modal to select training program
          alert(`Training assignment feature for ${selectedEmployees.length} employees (to be implemented)`);
          break;
          
        case 'export_data':
          // Export selected employee data
          const selectedData = employees.filter(emp => selectedEmployees.includes(emp.id));
          const dataStr = JSON.stringify(selectedData, null, 2);
          const dataBlob = new Blob([dataStr], {type: 'application/json'});
          const url = URL.createObjectURL(dataBlob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `selected-employees-${new Date().toISOString().split('T')[0]}.json`;
          link.click();
          URL.revokeObjectURL(url);
          break;
          
        default:
          break;
      }
      
      setSelectedEmployees([]);
      setBulkAction('');
    } catch (error) {
      console.error('Error executing bulk action:', error);
      alert('Failed to execute bulk action');
    }
  };

  const quickActions = [
    {
      title: 'Schedule Team Meeting',
      description: 'Create a meeting with selected team members',
      icon: Calendar,
      color: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
      action: () => alert('Team meeting scheduling feature (to be implemented)')
    },
    {
      title: 'Generate Reports',
      description: 'Create custom HR reports',
      icon: FileText,
      color: 'bg-green-50 text-green-600 hover:bg-green-100',
      action: () => alert('HR report generation feature (to be implemented)')
    },
    {
      title: 'Send Announcements',
      description: 'Broadcast message to all employees',
      icon: Send,
      color: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
      action: () => alert('Announcement system feature (to be implemented)')
    },
    {
      title: 'Backup Data',
      description: 'Create backup of HR data',
      icon: CheckCircle,
      color: 'bg-orange-50 text-orange-600 hover:bg-orange-100',
      action: () => {
        const allData = { employees, quickStats, timestamp: new Date().toISOString() };
        const dataStr = JSON.stringify(allData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `hr-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
      }
    }
  ];

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
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
          <h1 className="text-2xl font-bold text-gray-900">Employee Quick Actions</h1>
          <p className="text-gray-600">Fast access to common HR tasks and employee management</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center">
            <UserPlus className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-2xl font-bold text-blue-900">{quickStats.newHires}</p>
              <p className="text-sm text-blue-600">New Hires</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-2xl font-bold text-green-900">{quickStats.birthdays}</p>
              <p className="text-sm text-green-600">Birthdays</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-purple-50 border-purple-200">
          <div className="flex items-center">
            <Award className="w-8 h-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-2xl font-bold text-purple-900">{quickStats.anniversaries}</p>
              <p className="text-sm text-purple-600">Anniversaries</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-2xl font-bold text-yellow-900">{quickStats.onLeave}</p>
              <p className="text-sm text-yellow-600">On Leave</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-orange-50 border-orange-200">
          <div className="flex items-center">
            <BookOpen className="w-8 h-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-2xl font-bold text-orange-900">{quickStats.pendingReviews}</p>
              <p className="text-sm text-orange-600">Pending Reviews</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
            <div className="ml-3">
              <p className="text-2xl font-bold text-red-900">{quickStats.expiringCerts}</p>
              <p className="text-sm text-red-600">Expiring Certs</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Card key={index} className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={action.action}>
              <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-3`}>
                <action.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Employee Selection & Bulk Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Bulk Employee Actions</h2>
        
        {/* Search and Bulk Controls */}
        <div className="mb-4 flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <Button
            onClick={handleSelectAll}
            className="bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            {selectedEmployees.length === filteredEmployees.length ? 'Deselect All' : 'Select All'}
          </Button>

          <select
            value={bulkAction}
            onChange={(e) => setBulkAction(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Choose Bulk Action</option>
            <option value="send_reminder">Send Reminder</option>
            <option value="schedule_review">Schedule Review</option>
            <option value="assign_training">Assign Training</option>
            <option value="export_data">Export Data</option>
          </select>

          <Button
            onClick={executeBulkAction}
            disabled={!bulkAction || selectedEmployees.length === 0}
            className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Execute ({selectedEmployees.length})
          </Button>
        </div>

        {/* Employee List */}
        <Card className="divide-y divide-gray-200">
          {filteredEmployees.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No employees found matching your search.
            </div>
          ) : (
            filteredEmployees.map((employee) => (
              <div key={employee.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedEmployees.includes(employee.id)}
                    onChange={() => handleEmployeeSelect(employee.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-4"
                  />
                  
                  <div className="flex items-center flex-1">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-medium text-blue-600">
                        {employee.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{employee.name}</p>
                          <p className="text-sm text-gray-600">{employee.position} • {employee.department}</p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            employee.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : employee.status === 'on_leave'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {employee.status === 'active' ? 'Active' : 
                             employee.status === 'on_leave' ? 'On Leave' : 
                             employee.status}
                          </span>
                          
                          {employee.performance && (
                            <span className="text-sm text-gray-600">
                              ⭐ {employee.performance.toFixed(1)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </Card>
      </div>
    </div>
  );
}

export default EmployeeQuickActions;
