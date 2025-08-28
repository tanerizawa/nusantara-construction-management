import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Card, DataCard } from './DataStates';
import {
  BarChart3,
  TrendingUp,
  Users,
  Award,
  Shield,
  BookOpen,
  AlertTriangle,
  PieChart,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';

function HRAnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState({
    overview: {
      totalEmployees: 0,
      activeTrainings: 0,
      pendingReviews: 0,
      safetyIncidents: 0,
      expiringCerts: 0
    },
    employeeMetrics: {
      departmentBreakdown: [],
      performanceDistribution: [],
      attendanceRate: 0,
      turnoverRate: 0
    },
    trainingMetrics: {
      completionRate: 0,
      avgCost: 0,
      upcomingTrainings: 0,
      categoryBreakdown: []
    },
    safetyMetrics: {
      incidentTrend: [],
      severityBreakdown: [],
      mtbf: 0, // Mean Time Between Failures
      safetyScore: 0
    },
    performanceMetrics: {
      avgRating: 0,
      topPerformers: [],
      improvementNeeded: [],
      goalCompletion: 0
    }
  });
  const [dateRange, setDateRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = async () => {
    try {
      setRefreshing(true);
      const token = localStorage.getItem('token');
      
      // Fetch all data in parallel
      const [employees, trainings, reviews, incidents, alerts] = await Promise.all([
        axios.get('http://localhost:5001/api/manpower', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5001/api/manpower/training', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5001/api/manpower/performance-reviews', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5001/api/manpower/safety-incidents', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5001/api/manpower/certification-alerts', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      // Process and calculate analytics
      const processedData = processAnalyticsData({
        employees: employees.data,
        trainings: trainings.data,
        reviews: reviews.data,
        incidents: incidents.data,
        alerts: alerts.data
      });

      setAnalyticsData(processedData);
      setError(null);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError('Failed to fetch analytics data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const processAnalyticsData = (rawData) => {
    const { employees, trainings, reviews, incidents, alerts } = rawData;

    // Calculate overview metrics
    const overview = {
      totalEmployees: employees.length,
      activeTrainings: trainings.filter(t => t.status === 'ongoing').length,
      pendingReviews: reviews.filter(r => r.status === 'pending').length,
      safetyIncidents: incidents.length,
      expiringCerts: alerts.filter(a => {
        const daysUntilExpiry = Math.ceil((new Date(a.currentExpiryDate) - new Date()) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
      }).length
    };

    // Calculate employee metrics
    const departmentBreakdown = employees.reduce((acc, emp) => {
      const dept = emp.department || 'Unknown';
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {});

    const performanceDistribution = employees.reduce((acc, emp) => {
      const rating = emp.performance || 0;
      if (rating >= 4.5) acc.excellent = (acc.excellent || 0) + 1;
      else if (rating >= 3.5) acc.good = (acc.good || 0) + 1;
      else if (rating >= 2.5) acc.average = (acc.average || 0) + 1;
      else acc.poor = (acc.poor || 0) + 1;
      return acc;
    }, {});

    // Calculate training metrics
    const completedTrainings = trainings.filter(t => t.status === 'completed').length;
    const completionRate = trainings.length > 0 ? (completedTrainings / trainings.length) * 100 : 0;
    
    const avgCost = trainings.length > 0 
      ? trainings.reduce((sum, t) => sum + (parseFloat(t.cost) || 0), 0) / trainings.length 
      : 0;

    const categoryBreakdown = trainings.reduce((acc, t) => {
      const category = t.category || 'Other';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    // Calculate safety metrics
    const severityBreakdown = incidents.reduce((acc, inc) => {
      const severity = inc.severity || 'unknown';
      acc[severity] = (acc[severity] || 0) + 1;
      return acc;
    }, {});

    const criticalIncidents = incidents.filter(inc => inc.severity === 'critical').length;
    const safetyScore = Math.max(0, 100 - (criticalIncidents * 10) - (incidents.length * 2));

    // Calculate performance metrics
    const avgRating = employees.length > 0
      ? employees.reduce((sum, emp) => sum + (emp.performance || 0), 0) / employees.length
      : 0;

    const topPerformers = employees
      .filter(emp => emp.performance >= 4.5)
      .sort((a, b) => b.performance - a.performance)
      .slice(0, 5);

    const improvementNeeded = employees
      .filter(emp => emp.performance < 3.0)
      .sort((a, b) => a.performance - b.performance)
      .slice(0, 5);

    return {
      overview,
      employeeMetrics: {
        departmentBreakdown: Object.entries(departmentBreakdown).map(([name, value]) => ({ name, value })),
        performanceDistribution: Object.entries(performanceDistribution).map(([name, value]) => ({ name, value })),
        attendanceRate: employees.length > 0 ? employees.reduce((sum, emp) => sum + (emp.attendance || 0), 0) / employees.length : 0,
        turnoverRate: 5.2 // Mock data - would be calculated from historical data
      },
      trainingMetrics: {
        completionRate,
        avgCost,
        upcomingTrainings: trainings.filter(t => t.status === 'scheduled').length,
        categoryBreakdown: Object.entries(categoryBreakdown).map(([name, value]) => ({ name, value }))
      },
      safetyMetrics: {
        incidentTrend: incidents.slice(-6).map((inc, index) => ({ month: `Month ${index + 1}`, incidents: 1 })),
        severityBreakdown: Object.entries(severityBreakdown).map(([name, value]) => ({ name, value })),
        mtbf: incidents.length > 0 ? Math.round(365 / incidents.length) : 365,
        safetyScore
      },
      performanceMetrics: {
        avgRating,
        topPerformers,
        improvementNeeded,
        goalCompletion: reviews.length > 0 ? 
          reviews.reduce((sum, r) => sum + (r.overallRating || 0), 0) / reviews.length * 20 : 0
      }
    };
  };

  const exportData = () => {
    const dataToExport = {
      generatedAt: new Date().toISOString(),
      dateRange,
      analytics: analyticsData
    };
    
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hr-analytics-${dateRange}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    fetchAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <Button 
            onClick={fetchAnalytics}
            className="mt-2 bg-red-600 text-white hover:bg-red-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">HR Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive insights into human resources performance</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
          <Button
            onClick={fetchAnalytics}
            disabled={refreshing}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={exportData}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <DataCard
          title="Total Employees"
          value={analyticsData.overview.totalEmployees}
          icon={<Users className="w-6 h-6" />}
          color="bg-blue-50 border-blue-200"
        />
        <DataCard
          title="Active Trainings"
          value={analyticsData.overview.activeTrainings}
          icon={<BookOpen className="w-6 h-6" />}
          color="bg-green-50 border-green-200"
        />
        <DataCard
          title="Pending Reviews"
          value={analyticsData.overview.pendingReviews}
          icon={<Award className="w-6 h-6" />}
          color="bg-yellow-50 border-yellow-200"
        />
        <DataCard
          title="Safety Incidents"
          value={analyticsData.overview.safetyIncidents}
          icon={<Shield className="w-6 h-6" />}
          color="bg-red-50 border-red-200"
        />
        <DataCard
          title="Expiring Certs"
          value={analyticsData.overview.expiringCerts}
          icon={<AlertTriangle className="w-6 h-6" />}
          color="bg-orange-50 border-orange-200"
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Department Breakdown */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <PieChart className="w-5 h-5 mr-2" />
            Department Distribution
          </h3>
          <div className="space-y-3">
            {analyticsData.employeeMetrics.departmentBreakdown.map((dept, index) => (
              <div key={dept.name} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{dept.name}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(dept.value / analyticsData.overview.totalEmployees) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8">{dept.value}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Performance Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Performance Distribution
          </h3>
          <div className="space-y-3">
            {analyticsData.employeeMetrics.performanceDistribution.map((perf, index) => {
              const colors = {
                excellent: 'bg-green-500',
                good: 'bg-blue-500',
                average: 'bg-yellow-500',
                poor: 'bg-red-500'
              };
              return (
                <div key={perf.name} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 capitalize">{perf.name}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${colors[perf.name]} h-2 rounded-full`}
                        style={{ width: `${(perf.value / analyticsData.overview.totalEmployees) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">{perf.value}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Training Analytics */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            Training Analytics
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-600 font-medium">Completion Rate</p>
                <p className="text-2xl font-bold text-blue-900">{analyticsData.trainingMetrics.completionRate.toFixed(1)}%</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-green-600 font-medium">Avg Cost</p>
                <p className="text-2xl font-bold text-green-900">Rp {analyticsData.trainingMetrics.avgCost.toLocaleString('id-ID')}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Training Categories</p>
              <div className="space-y-2">
                {analyticsData.trainingMetrics.categoryBreakdown.map((cat, index) => (
                  <div key={cat.name} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{cat.name}</span>
                    <span className="font-medium">{cat.value} programs</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Safety Metrics */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Safety Metrics
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-green-600 font-medium">Safety Score</p>
                <p className="text-2xl font-bold text-green-900">{analyticsData.safetyMetrics.safetyScore}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-600 font-medium">MTBF (days)</p>
                <p className="text-2xl font-bold text-blue-900">{analyticsData.safetyMetrics.mtbf}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Incident Severity</p>
              <div className="space-y-2">
                {analyticsData.safetyMetrics.severityBreakdown.map((sev, index) => {
                  const colors = {
                    low: 'text-green-600',
                    medium: 'text-yellow-600',
                    high: 'text-orange-600',
                    critical: 'text-red-600'
                  };
                  return (
                    <div key={sev.name} className="flex items-center justify-between text-sm">
                      <span className={colors[sev.name] || 'text-gray-600'}>{sev.name}</span>
                      <span className="font-medium">{sev.value} incidents</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>

      </div>

      {/* Top Performers & Improvement Needed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Performers */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Top Performers
          </h3>
          <div className="space-y-3">
            {analyticsData.performanceMetrics.topPerformers.length > 0 ? (
              analyticsData.performanceMetrics.topPerformers.map((emp, index) => (
                <div key={emp.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{emp.name}</p>
                    <p className="text-sm text-gray-600">{emp.position}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{emp.performance?.toFixed(1)}/5.0</p>
                    <p className="text-xs text-gray-500">#{index + 1}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No top performers data available</p>
            )}
          </div>
        </Card>

        {/* Improvement Needed */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Needs Improvement
          </h3>
          <div className="space-y-3">
            {analyticsData.performanceMetrics.improvementNeeded.length > 0 ? (
              analyticsData.performanceMetrics.improvementNeeded.map((emp, index) => (
                <div key={emp.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{emp.name}</p>
                    <p className="text-sm text-gray-600">{emp.position}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-orange-600">{emp.performance?.toFixed(1)}/5.0</p>
                    <p className="text-xs text-gray-500">Action needed</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">All employees performing well!</p>
            )}
          </div>
        </Card>

      </div>

      {/* Key Metrics Summary */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Performance Indicators</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{analyticsData.performanceMetrics.avgRating.toFixed(1)}</p>
            <p className="text-sm text-gray-600">Average Performance Rating</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{analyticsData.employeeMetrics.attendanceRate.toFixed(1)}%</p>
            <p className="text-sm text-gray-600">Average Attendance Rate</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">{analyticsData.trainingMetrics.completionRate.toFixed(1)}%</p>
            <p className="text-sm text-gray-600">Training Completion Rate</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-orange-600">{analyticsData.employeeMetrics.turnoverRate}%</p>
            <p className="text-sm text-gray-600">Annual Turnover Rate</p>
          </div>
        </div>
      </Card>

    </div>
  );
}

export default HRAnalyticsDashboard;
