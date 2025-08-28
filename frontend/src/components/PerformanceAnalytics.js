import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Target,
  TrendingUp,
  TrendingDown,
  Star,
  BarChart3,
  Calendar,
  Filter,
  Download,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

const PerformanceAnalytics = () => {
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('quarterly');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [activeView, setActiveView] = useState('overview');

  useEffect(() => {
    // Mock performance data
    const mockPerformanceData = [
    {
      id: 1,
      employeeId: 'EMP-001',
      name: 'Budi Santoso',
      department: 'Construction',
      position: 'Site Manager',
      overallScore: 92,
      technicalSkills: 95,
      leadership: 88,
      communication: 90,
      projectCompletion: 94,
      qualityRating: 93,
      teamwork: 87,
      innovationScore: 85,
      goals: {
        completed: 8,
        inProgress: 2,
        total: 10
      },
      trend: 'up',
      lastReview: '2025-07-15',
      nextReview: '2025-10-15'
    },
    {
      id: 2,
      employeeId: 'EMP-002',
      name: 'Sari Dewi',
      department: 'Engineering',
      position: 'Project Engineer',
      overallScore: 88,
      technicalSkills: 92,
      leadership: 82,
      communication: 89,
      projectCompletion: 91,
      qualityRating: 88,
      teamwork: 90,
      innovationScore: 87,
      goals: {
        completed: 7,
        inProgress: 3,
        total: 10
      },
      trend: 'stable',
      lastReview: '2025-07-10',
      nextReview: '2025-10-10'
    },
    {
      id: 3,
      employeeId: 'EMP-003',
      name: 'Ahmad Rizki',
      department: 'Operations',
      position: 'Heavy Equipment Operator',
      overallScore: 85,
      technicalSkills: 90,
      leadership: 78,
      communication: 82,
      projectCompletion: 87,
      qualityRating: 85,
      teamwork: 88,
      innovationScore: 80,
      goals: {
        completed: 6,
        inProgress: 2,
        total: 8
      },
      trend: 'up',
      lastReview: '2025-07-20',
      nextReview: '2025-10-20'
    }
    ];

    // Simulate API call
    setTimeout(() => {
      setPerformanceData(mockPerformanceData);
      setLoading(false);
    }, 1000);
  }, []);

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 80) return 'text-yellow-600 bg-yellow-50';
    if (score >= 70) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <div className="h-4 w-4 bg-gray-400 rounded-full"></div>;
    }
  };

  const filteredData = performanceData.filter(emp => {
    const matchesDepartment = departmentFilter === '' || emp.department === departmentFilter;
    return matchesDepartment;
  });

  const avgPerformance = filteredData.reduce((sum, emp) => sum + emp.overallScore, 0) / filteredData.length || 0;
  const topPerformers = filteredData.filter(emp => emp.overallScore >= 90).length;
  const totalGoalsCompleted = filteredData.reduce((sum, emp) => sum + emp.goals.completed, 0);
  const totalGoals = filteredData.reduce((sum, emp) => sum + emp.goals.total, 0);

  const departmentPerformance = [
    { department: 'Construction', avgScore: 92, employees: 15 },
    { department: 'Engineering', avgScore: 88, employees: 12 },
    { department: 'Operations', avgScore: 85, employees: 20 },
    { department: 'Quality Assurance', avgScore: 90, employees: 8 }
  ];

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
          <h1 className="text-2xl font-bold text-gray-900">Performance Analytics</h1>
          <p className="text-gray-600 mt-1">Track and analyze employee performance metrics</p>
        </div>
        <div className="flex gap-3">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="h-4 w-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Performance Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Performance</p>
              <p className="text-2xl font-bold text-blue-600">{avgPerformance.toFixed(1)}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Top Performers</p>
              <p className="text-2xl font-bold text-green-600">{topPerformers}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <Star className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Goals Completion</p>
              <p className="text-2xl font-bold text-purple-600">{((totalGoalsCompleted/totalGoals)*100).toFixed(0)}%</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Reviews Due</p>
              <p className="text-2xl font-bold text-orange-600">5</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Department Filter */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
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

      {/* Performance Views */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveView('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeView === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Performance Overview
            </button>
            <button
              onClick={() => setActiveView('department')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeView === 'department'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Department Analysis
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeView === 'overview' && (
            <div className="space-y-6">
              {/* Individual Performance Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredData.map((employee) => (
                  <div key={employee.id} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-gray-900">{employee.name}</h3>
                        <p className="text-sm text-gray-600">{employee.position}</p>
                        <p className="text-xs text-gray-500">{employee.department}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(employee.overallScore)}`}>
                          {employee.overallScore}
                        </span>
                        {getTrendIcon(employee.trend)}
                      </div>
                    </div>

                    {/* Skill Breakdown */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Technical Skills</span>
                        <span className="text-sm font-medium">{employee.technicalSkills}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${employee.technicalSkills}%` }}
                        ></div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Leadership</span>
                        <span className="text-sm font-medium">{employee.leadership}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${employee.leadership}%` }}
                        ></div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Communication</span>
                        <span className="text-sm font-medium">{employee.communication}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${employee.communication}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Goals Progress */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Goals Progress</span>
                        <span className="text-sm font-medium">
                          {employee.goals.completed}/{employee.goals.total}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {Array.from({ length: employee.goals.total }).map((_, index) => (
                          <div 
                            key={index}
                            className={`h-2 flex-1 rounded ${
                              index < employee.goals.completed ? 'bg-green-500' : 'bg-gray-200'
                            }`}
                          ></div>
                        ))}
                      </div>
                    </div>

                    {/* Review Info */}
                    <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        Next Review: {new Date(employee.nextReview).toLocaleDateString()}
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeView === 'department' && (
            <div className="space-y-6">
              {/* Department Performance Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {departmentPerformance.map((dept, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-gray-900">{dept.department}</h3>
                        <p className="text-sm text-gray-600">{dept.employees} employees</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Avg Score</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(dept.avgScore)}`}>
                        {dept.avgScore}
                      </span>
                    </div>
                    
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${dept.avgScore}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Performance Distribution */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Distribution</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <p className="font-bold text-2xl text-green-600">{filteredData.filter(emp => emp.overallScore >= 90).length}</p>
                    <p className="text-sm text-gray-600">Excellent (90-100)</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Award className="h-8 w-8 text-blue-600" />
                    </div>
                    <p className="font-bold text-2xl text-blue-600">{filteredData.filter(emp => emp.overallScore >= 80 && emp.overallScore < 90).length}</p>
                    <p className="text-sm text-gray-600">Good (80-89)</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <AlertTriangle className="h-8 w-8 text-yellow-600" />
                    </div>
                    <p className="font-bold text-2xl text-yellow-600">{filteredData.filter(emp => emp.overallScore >= 70 && emp.overallScore < 80).length}</p>
                    <p className="text-sm text-gray-600">Average (70-79)</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <TrendingDown className="h-8 w-8 text-red-600" />
                    </div>
                    <p className="font-bold text-2xl text-red-600">{filteredData.filter(emp => emp.overallScore < 70).length}</p>
                    <p className="text-sm text-gray-600">Needs Improvement (&lt;70)</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerformanceAnalytics;
