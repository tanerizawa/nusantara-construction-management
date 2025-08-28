import React, { useState, useEffect } from 'react';
import { DataCard, Button } from '../DataStates';
import {
  TrendingUp,
  Calendar,
  Download,
  Filter,
  Users,
  Award,
  Clock,
  AlertCircle,
  Target,
  CheckCircle,
  FileText,
  Mail,
  Star,
  X
} from 'lucide-react';
import axios from 'axios';

const HRReports = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState({
    demographic: null,
    performance: null,
    training: null,
    attendance: null,
    compliance: null
  });
  const [selectedReport, setSelectedReport] = useState('demographic');
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [filters, setFilters] = useState({
    department: '',
    position: '',
    status: 'active'
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (employees.length > 0) {
      generateReports();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employees, dateRange, filters]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/manpower');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateReports = () => {
    const filteredEmployees = applyFilters(employees);
    
    setReports({
      demographic: generateDemographicReport(filteredEmployees),
      performance: generatePerformanceReport(filteredEmployees),
      training: generateTrainingReport(filteredEmployees),
      attendance: generateAttendanceReport(filteredEmployees),
      compliance: generateComplianceReport(filteredEmployees)
    });
  };

  const applyFilters = (data) => {
    return data.filter(emp => {
      if (filters.department && emp.department !== filters.department) return false;
      if (filters.position && emp.position !== filters.position) return false;
      if (filters.status && emp.status !== filters.status) return false;
      return true;
    });
  };

  const generateDemographicReport = (data) => {
    const departments = {};
    const positions = {};
    const ageGroups = { '18-25': 0, '26-35': 0, '36-45': 0, '46-55': 0, '55+': 0 };
    const genderDistribution = { male: 0, female: 0 };
    const tenureGroups = { '0-1': 0, '2-5': 0, '6-10': 0, '10+': 0 };

    data.forEach(emp => {
      // Department distribution
      departments[emp.department] = (departments[emp.department] || 0) + 1;
      
      // Position distribution
      positions[emp.position] = (positions[emp.position] || 0) + 1;
      
      // Age distribution
      const age = new Date().getFullYear() - new Date(emp.birthDate || '1990-01-01').getFullYear();
      if (age >= 18 && age <= 25) ageGroups['18-25']++;
      else if (age >= 26 && age <= 35) ageGroups['26-35']++;
      else if (age >= 36 && age <= 45) ageGroups['36-45']++;
      else if (age >= 46 && age <= 55) ageGroups['46-55']++;
      else ageGroups['55+']++;
      
      // Gender distribution
      genderDistribution[emp.gender?.toLowerCase() || 'male']++;
      
      // Tenure distribution
      const tenure = new Date().getFullYear() - new Date(emp.joinDate || '2023-01-01').getFullYear();
      if (tenure >= 0 && tenure <= 1) tenureGroups['0-1']++;
      else if (tenure >= 2 && tenure <= 5) tenureGroups['2-5']++;
      else if (tenure >= 6 && tenure <= 10) tenureGroups['6-10']++;
      else tenureGroups['10+']++;
    });

    return {
      totalEmployees: data.length,
      departments,
      positions,
      ageGroups,
      genderDistribution,
      tenureGroups,
      averageAge: data.length > 0 ? 
        data.reduce((sum, emp) => {
          const age = new Date().getFullYear() - new Date(emp.birthDate || '1990-01-01').getFullYear();
          return sum + age;
        }, 0) / data.length : 0
    };
  };

  const generatePerformanceReport = (data) => {
    const performanceDistribution = { excellent: 0, good: 0, average: 0, poor: 0 };
    const departmentPerformance = {};
    let totalScore = 0;
    let scoredEmployees = 0;

    data.forEach(emp => {
      const performance = emp.performance || {};
      const score = performance.overallScore || Math.floor(Math.random() * 40) + 60; // Mock data
      
      totalScore += score;
      scoredEmployees++;
      
      if (score >= 90) performanceDistribution.excellent++;
      else if (score >= 80) performanceDistribution.good++;
      else if (score >= 70) performanceDistribution.average++;
      else performanceDistribution.poor++;
      
      const dept = emp.department;
      if (!departmentPerformance[dept]) {
        departmentPerformance[dept] = { total: 0, count: 0 };
      }
      departmentPerformance[dept].total += score;
      departmentPerformance[dept].count++;
    });

    // Calculate department averages
    Object.keys(departmentPerformance).forEach(dept => {
      departmentPerformance[dept].average = 
        departmentPerformance[dept].total / departmentPerformance[dept].count;
    });

    return {
      averageScore: scoredEmployees > 0 ? totalScore / scoredEmployees : 0,
      performanceDistribution,
      departmentPerformance,
      topPerformers: data
        .map(emp => ({
          ...emp,
          score: emp.performance?.overallScore || Math.floor(Math.random() * 40) + 60
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)
    };
  };

  const generateTrainingReport = (data) => {
    const trainingCompletion = { completed: 0, inProgress: 0, pending: 0 };
    const skillsDistribution = {};
    const certificationStatus = { valid: 0, expiring: 0, expired: 0 };
    
    data.forEach(emp => {
      const training = emp.training || {};
      const status = training.status || 'pending';
      trainingCompletion[status] = (trainingCompletion[status] || 0) + 1;
      
      const skills = emp.skills || [];
      skills.forEach(skill => {
        skillsDistribution[skill] = (skillsDistribution[skill] || 0) + 1;
      });
      
      const certifications = emp.certifications || [];
      certifications.forEach(cert => {
        const expiryDate = new Date(cert.expiryDate || '2025-12-31');
        const today = new Date();
        const monthsUntilExpiry = (expiryDate - today) / (1000 * 60 * 60 * 24 * 30);
        
        if (monthsUntilExpiry < 0) certificationStatus.expired++;
        else if (monthsUntilExpiry < 3) certificationStatus.expiring++;
        else certificationStatus.valid++;
      });
    });

    return {
      trainingCompletion,
      skillsDistribution,
      certificationStatus,
      trainingHours: data.reduce((total, emp) => 
        total + (emp.training?.hoursCompleted || Math.floor(Math.random() * 50)), 0),
      averageTrainingHours: data.length > 0 ? 
        data.reduce((total, emp) => 
          total + (emp.training?.hoursCompleted || Math.floor(Math.random() * 50)), 0) / data.length : 0
    };
  };

  const generateAttendanceReport = (data) => {
    const attendanceRates = { excellent: 0, good: 0, average: 0, poor: 0 };
    let totalAttendance = 0;
    
    data.forEach(emp => {
      const attendance = emp.attendance?.rate || (Math.random() * 30 + 70); // Mock data
      totalAttendance += attendance;
      
      if (attendance >= 95) attendanceRates.excellent++;
      else if (attendance >= 85) attendanceRates.good++;
      else if (attendance >= 75) attendanceRates.average++;
      else attendanceRates.poor++;
    });

    return {
      averageAttendance: data.length > 0 ? totalAttendance / data.length : 0,
      attendanceRates,
      totalAbsences: Math.floor(Math.random() * 100) + 50,
      lateArrivals: Math.floor(Math.random() * 50) + 20
    };
  };

  const generateComplianceReport = (data) => {
    const safetyCompliance = { compliant: 0, nonCompliant: 0 };
    const documentStatus = { complete: 0, incomplete: 0, missing: 0 };
    
    data.forEach(emp => {
      const safety = emp.safety || {};
      if (safety.trainingCompleted && safety.certificationsValid) {
        safetyCompliance.compliant++;
      } else {
        safetyCompliance.nonCompliant++;
      }
      
      const documents = emp.documents || [];
      if (documents.length >= 5) documentStatus.complete++;
      else if (documents.length >= 2) documentStatus.incomplete++;
      else documentStatus.missing++;
    });

    return {
      safetyCompliance,
      documentStatus,
      complianceRate: data.length > 0 ? 
        (safetyCompliance.compliant + documentStatus.complete) / (data.length * 2) * 100 : 0
    };
  };

  const exportReport = async (reportType) => {
    try {
      const reportData = reports[reportType];
      const csvContent = generateCSV(reportData, reportType);
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  const generateCSV = (data, type) => {
    let csv = '';
    
    switch (type) {
      case 'demographic':
        csv = 'Category,Value\n';
        csv += `Total Employees,${data.totalEmployees}\n`;
        csv += `Average Age,${data.averageAge.toFixed(1)}\n`;
        csv += '\nDepartment Distribution\n';
        Object.entries(data.departments).forEach(([dept, count]) => {
          csv += `${dept},${count}\n`;
        });
        break;
      case 'performance':
        csv = 'Performance Level,Count\n';
        Object.entries(data.performanceDistribution).forEach(([level, count]) => {
          csv += `${level},${count}\n`;
        });
        break;
      default:
        csv = 'Report data not available in CSV format';
    }
    
    return csv;
  };

  const scheduleReport = () => {
    // Mock scheduling functionality
    alert('Report scheduled successfully! You will receive it weekly via email.');
  };

  const sendReport = () => {
    // Mock email functionality
    alert('Report sent to stakeholders successfully!');
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
          <h2 className="text-2xl font-bold text-gray-900">HR Reports & Analytics</h2>
          <p className="text-gray-600 mt-1">Comprehensive reporting and insights</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => exportReport(selectedReport)}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button
            onClick={scheduleReport}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Schedule
          </Button>
          <Button
            onClick={sendReport}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Mail className="w-4 h-4 mr-2" />
            Send Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <select
              value={filters.department}
              onChange={(e) => setFilters({...filters, department: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Finance">Finance</option>
              <option value="HR">HR</option>
              <option value="Marketing">Marketing</option>
              <option value="Operations">Operations</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="probation">Probation</option>
            </select>
          </div>

          <Button
            onClick={generateReports}
            className="bg-gray-600 hover:bg-gray-700 text-white"
          >
            <Filter className="w-4 h-4 mr-2" />
            Apply Filters
          </Button>
        </div>
      </div>

      {/* Report Navigation */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="flex overflow-x-auto">
          {[
            { id: 'demographic', label: 'Demographics', icon: Users },
            { id: 'performance', label: 'Performance', icon: TrendingUp },
            { id: 'training', label: 'Training', icon: Award },
            { id: 'attendance', label: 'Attendance', icon: Clock },
            { id: 'compliance', label: 'Compliance', icon: CheckCircle }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSelectedReport(id)}
              className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                selectedReport === id
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

      {/* Report Content */}
      <div className="space-y-6">
        {selectedReport === 'demographic' && reports.demographic && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <DataCard
                title="Total Employees"
                value={reports.demographic.totalEmployees}
                icon={Users}
                color="blue"
              />
              <DataCard
                title="Average Age"
                value={`${reports.demographic.averageAge.toFixed(1)} years`}
                icon={Calendar}
                color="green"
              />
              <DataCard
                title="Departments"
                value={Object.keys(reports.demographic.departments).length}
                icon={Target}
                color="purple"
              />
              <DataCard
                title="Positions"
                value={Object.keys(reports.demographic.positions).length}
                icon={Award}
                color="orange"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Department Distribution</h3>
                <div className="space-y-3">
                  {Object.entries(reports.demographic.departments).map(([dept, count]) => (
                    <div key={dept} className="flex justify-between items-center">
                      <span className="text-gray-700">{dept}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${(count / reports.demographic.totalEmployees) * 100}%`
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-8">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Age Distribution</h3>
                <div className="space-y-3">
                  {Object.entries(reports.demographic.ageGroups).map(([range, count]) => (
                    <div key={range} className="flex justify-between items-center">
                      <span className="text-gray-700">{range} years</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{
                              width: `${(count / reports.demographic.totalEmployees) * 100}%`
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-8">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedReport === 'performance' && reports.performance && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <DataCard
                title="Average Score"
                value={`${reports.performance.averageScore.toFixed(1)}%`}
                icon={TrendingUp}
                color="blue"
              />
              <DataCard
                title="Top Performers"
                value={reports.performance.performanceDistribution.excellent}
                icon={Star}
                color="yellow"
              />
              <DataCard
                title="Good Performance"
                value={reports.performance.performanceDistribution.good}
                icon={CheckCircle}
                color="green"
              />
              <DataCard
                title="Needs Improvement"
                value={reports.performance.performanceDistribution.poor}
                icon={AlertCircle}
                color="red"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Performance Distribution</h3>
                <div className="space-y-3">
                  {Object.entries(reports.performance.performanceDistribution).map(([level, count]) => (
                    <div key={level} className="flex justify-between items-center">
                      <span className="text-gray-700 capitalize">{level}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              level === 'excellent' ? 'bg-yellow-500' :
                              level === 'good' ? 'bg-green-500' :
                              level === 'average' ? 'bg-blue-500' : 'bg-red-500'
                            }`}
                            style={{
                              width: `${(count / employees.length) * 100}%`
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-8">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Top 10 Performers</h3>
                <div className="space-y-2">
                  {reports.performance.topPerformers.slice(0, 5).map((emp, index) => (
                    <div key={emp.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div>
                        <span className="font-medium">{emp.name}</span>
                        <span className="text-sm text-gray-500 ml-2">({emp.department})</span>
                      </div>
                      <span className="font-semibold text-blue-600">{emp.score}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedReport === 'training' && reports.training && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <DataCard
                title="Total Training Hours"
                value={reports.training.trainingHours}
                icon={Clock}
                color="blue"
              />
              <DataCard
                title="Avg Hours/Employee"
                value={`${reports.training.averageTrainingHours.toFixed(1)}h`}
                icon={Award}
                color="green"
              />
              <DataCard
                title="Completed Training"
                value={reports.training.trainingCompletion.completed}
                icon={CheckCircle}
                color="green"
              />
              <DataCard
                title="Pending Training"
                value={reports.training.trainingCompletion.pending}
                icon={Clock}
                color="yellow"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Training Status</h3>
                <div className="space-y-3">
                  {Object.entries(reports.training.trainingCompletion).map(([status, count]) => (
                    <div key={status} className="flex justify-between items-center">
                      <span className="text-gray-700 capitalize">{status.replace(/([A-Z])/g, ' $1')}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              status === 'completed' ? 'bg-green-500' :
                              status === 'inProgress' ? 'bg-blue-500' : 'bg-yellow-500'
                            }`}
                            style={{
                              width: `${(count / employees.length) * 100}%`
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-8">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Certification Status</h3>
                <div className="space-y-3">
                  {Object.entries(reports.training.certificationStatus).map(([status, count]) => (
                    <div key={status} className="flex justify-between items-center">
                      <span className="text-gray-700 capitalize">{status}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              status === 'valid' ? 'bg-green-500' :
                              status === 'expiring' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{
                              width: `${(count / Math.max(1, Object.values(reports.training.certificationStatus).reduce((a, b) => a + b, 0))) * 100}%`
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-8">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedReport === 'attendance' && reports.attendance && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <DataCard
                title="Average Attendance"
                value={`${reports.attendance.averageAttendance.toFixed(1)}%`}
                icon={CheckCircle}
                color="green"
              />
              <DataCard
                title="Total Absences"
                value={reports.attendance.totalAbsences}
                icon={X}
                color="red"
              />
              <DataCard
                title="Late Arrivals"
                value={reports.attendance.lateArrivals}
                icon={Clock}
                color="yellow"
              />
              <DataCard
                title="Excellent Attendance"
                value={reports.attendance.attendanceRates.excellent}
                icon={Star}
                color="blue"
              />
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Attendance Distribution</h3>
              <div className="space-y-3">
                {Object.entries(reports.attendance.attendanceRates).map(([rate, count]) => (
                  <div key={rate} className="flex justify-between items-center">
                    <span className="text-gray-700 capitalize">{rate} (
                      {rate === 'excellent' ? '95%+' :
                       rate === 'good' ? '85-94%' :
                       rate === 'average' ? '75-84%' : '<75%'}
                    )</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            rate === 'excellent' ? 'bg-green-500' :
                            rate === 'good' ? 'bg-blue-500' :
                            rate === 'average' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{
                            width: `${(count / employees.length) * 100}%`
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-8">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedReport === 'compliance' && reports.compliance && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <DataCard
                title="Overall Compliance"
                value={`${reports.compliance.complianceRate.toFixed(1)}%`}
                icon={CheckCircle}
                color="green"
              />
              <DataCard
                title="Safety Compliant"
                value={reports.compliance.safetyCompliance.compliant}
                icon={Award}
                color="blue"
              />
              <DataCard
                title="Documents Complete"
                value={reports.compliance.documentStatus.complete}
                icon={FileText}
                color="purple"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Safety Compliance</h3>
                <div className="space-y-3">
                  {Object.entries(reports.compliance.safetyCompliance).map(([status, count]) => (
                    <div key={status} className="flex justify-between items-center">
                      <span className="text-gray-700 capitalize">{status.replace(/([A-Z])/g, ' $1')}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              status === 'compliant' ? 'bg-green-500' : 'bg-red-500'
                            }`}
                            style={{
                              width: `${(count / employees.length) * 100}%`
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-8">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Document Status</h3>
                <div className="space-y-3">
                  {Object.entries(reports.compliance.documentStatus).map(([status, count]) => (
                    <div key={status} className="flex justify-between items-center">
                      <span className="text-gray-700 capitalize">{status}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              status === 'complete' ? 'bg-green-500' :
                              status === 'incomplete' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{
                              width: `${(count / employees.length) * 100}%`
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-8">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HRReports;
