import React, { useState, useEffect } from 'react';
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Users,
  Target,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Star,
  ArrowRight,
  Eye,
  Download,
  Filter,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

const HRPredictiveAnalytics = () => {
  const [activeTab, setActiveTab] = useState('turnover');
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState('6months');
  const [selectedModel, setSelectedModel] = useState('ensemble');

  // Mock AI/ML prediction data
  const [predictionData, setPredictionData] = useState({
    turnoverPredictions: [
      {
        employeeId: 'EMP-001',
        name: 'Budi Santoso',
        department: 'Construction',
        position: 'Site Manager',
        riskScore: 78,
        riskLevel: 'high',
        factors: [
          { factor: 'Low recent performance scores', weight: 25 },
          { factor: 'Decreased engagement in meetings', weight: 20 },
          { factor: 'No recent training completion', weight: 18 },
          { factor: 'High overtime hours', weight: 15 }
        ],
        recommendations: [
          'Schedule one-on-one career development discussion',
          'Offer additional training opportunities',
          'Review workload and project assignments'
        ],
        predictedAction: 'likely_to_leave',
        timeframe: '3-6 months',
        confidence: 82
      },
      {
        employeeId: 'EMP-002',
        name: 'Sari Dewi',
        department: 'Engineering',
        position: 'Project Engineer',
        riskScore: 45,
        riskLevel: 'medium',
        factors: [
          { factor: 'Consistent performance but no growth', weight: 22 },
          { factor: 'Limited cross-departmental collaboration', weight: 18 },
          { factor: 'Average engagement scores', weight: 15 }
        ],
        recommendations: [
          'Provide mentorship opportunities',
          'Assign challenging projects',
          'Consider promotion path discussion'
        ],
        predictedAction: 'monitor',
        timeframe: '6-12 months',
        confidence: 67
      },
      {
        employeeId: 'EMP-003',
        name: 'Ahmad Rizki',
        department: 'Operations',
        position: 'Heavy Equipment Operator',
        riskScore: 23,
        riskLevel: 'low',
        factors: [
          { factor: 'High job satisfaction scores', weight: 30 },
          { factor: 'Strong peer relationships', weight: 25 },
          { factor: 'Regular skill development', weight: 20 }
        ],
        recommendations: [
          'Continue current engagement strategies',
          'Consider for leadership development',
          'Potential internal trainer candidate'
        ],
        predictedAction: 'retain',
        timeframe: '12+ months',
        confidence: 91
      }
    ],
    performanceInsights: {
      trends: {
        overallPerformance: {
          current: 4.2,
          trend: 'increasing',
          change: '+0.3',
          prediction: 4.4
        },
        topPerformers: [
          { name: 'Sari Dewi', score: 4.8, trend: 'stable' },
          { name: 'Rina Sari', score: 4.6, trend: 'increasing' },
          { name: 'Budi Santoso', score: 4.5, trend: 'decreasing' }
        ],
        performanceFactors: [
          { factor: 'Training Completion', impact: 35, correlation: 0.82 },
          { factor: 'Project Complexity', impact: 28, correlation: 0.74 },
          { factor: 'Team Collaboration', impact: 22, correlation: 0.69 },
          { factor: 'Work-Life Balance', impact: 15, correlation: 0.58 }
        ]
      },
      predictions: [
        {
          employee: 'EMP-004',
          name: 'Rina Sari',
          currentScore: 4.6,
          predictedScore: 4.8,
          confidence: 85,
          recommendations: ['Continue current trajectory', 'Consider advanced training']
        },
        {
          employee: 'EMP-005',
          name: 'Tono Wijaya',
          currentScore: 4.0,
          predictedScore: 4.3,
          confidence: 78,
          recommendations: ['Provide additional mentoring', 'Focus on skill development']
        }
      ]
    },
    trainingRecommendations: [
      {
        employeeId: 'EMP-001',
        name: 'Budi Santoso',
        skillGaps: ['Leadership', 'Digital Tools', 'Communication'],
        recommendedCourses: [
          {
            title: 'Advanced Project Leadership',
            provider: 'Construction Academy',
            duration: '3 weeks',
            relevanceScore: 92,
            expectedImpact: 'High performance improvement'
          },
          {
            title: 'Digital Construction Management',
            provider: 'TechBuild Institute',
            duration: '2 weeks',
            relevanceScore: 88,
            expectedImpact: 'Increased efficiency'
          }
        ],
        priority: 'high',
        aiConfidence: 87
      },
      {
        employeeId: 'EMP-002',
        name: 'Sari Dewi',
        skillGaps: ['Advanced CAD', 'Project Management', 'Team Leadership'],
        recommendedCourses: [
          {
            title: 'Advanced AutoCAD & 3D Modeling',
            provider: 'Engineering Pro',
            duration: '4 weeks',
            relevanceScore: 94,
            expectedImpact: 'Technical skill enhancement'
          }
        ],
        priority: 'medium',
        aiConfidence: 82
      }
    ],
    workforceForecasting: {
      departmentNeeds: [
        {
          department: 'Construction',
          currentHeadcount: 15,
          predictedNeed: 18,
          timeframe: 'Q4 2025',
          confidence: 89,
          reasoning: 'Projected increase in residential projects'
        },
        {
          department: 'Engineering',
          currentHeadcount: 8,
          predictedNeed: 10,
          timeframe: 'Q1 2026',
          confidence: 76,
          reasoning: 'Growing demand for complex structural designs'
        }
      ],
      skillDemand: [
        { skill: 'BIM Software', demand: 'High', growth: '+45%' },
        { skill: 'Green Building', demand: 'Growing', growth: '+32%' },
        { skill: 'Project Management', demand: 'Stable', growth: '+12%' }
      ]
    }
  });

  const refreshPredictions = () => {
    setLoading(true);
    // Simulate AI model refresh
    setTimeout(() => {
      setLoading(false);
      // Update predictions with slight variations
    }, 2000);
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-red-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            AI-Powered HR Analytics
          </h2>
          <p className="text-gray-600 mt-1">
            Machine learning insights for predictive HR management
          </p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="ensemble">Ensemble Model</option>
            <option value="neural">Neural Network</option>
            <option value="random_forest">Random Forest</option>
          </select>
          <button
            onClick={refreshPredictions}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Updating...' : 'Refresh AI Models'}
          </button>
        </div>
      </div>

      {/* AI Model Status */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Zap className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">AI Model Status</h3>
              <p className="text-gray-600">
                Last updated: {new Date().toLocaleString()} • Model accuracy: 87.3%
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-green-600 font-medium">Models Active</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('turnover')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'turnover'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <TrendingDown className="w-4 h-4 inline mr-1" />
            Turnover Prediction
          </button>
          <button
            onClick={() => setActiveTab('performance')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'performance'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-1" />
            Performance Insights
          </button>
          <button
            onClick={() => setActiveTab('training')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'training'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Target className="w-4 h-4 inline mr-1" />
            Training AI
          </button>
          <button
            onClick={() => setActiveTab('forecasting')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'forecasting'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Calendar className="w-4 h-4 inline mr-1" />
            Workforce Forecasting
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'turnover' && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">High Risk Employees</p>
                    <p className="text-2xl font-bold text-red-600">
                      {predictionData.turnoverPredictions.filter(p => p.riskLevel === 'high').length}
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Medium Risk</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {predictionData.turnoverPredictions.filter(p => p.riskLevel === 'medium').length}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Low Risk</p>
                    <p className="text-2xl font-bold text-green-600">
                      {predictionData.turnoverPredictions.filter(p => p.riskLevel === 'low').length}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg Confidence</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {Math.round(predictionData.turnoverPredictions.reduce((sum, p) => sum + p.confidence, 0) / predictionData.turnoverPredictions.length)}%
                    </p>
                  </div>
                  <Brain className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Employee Risk Analysis */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Employee Turnover Risk Analysis</h3>
                <p className="text-gray-600 mt-1">AI-powered predictions based on behavior patterns and performance data</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {predictionData.turnoverPredictions.map((prediction, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-blue-600">
                              {prediction.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">{prediction.name}</h4>
                            <p className="text-gray-600">{prediction.position} • {prediction.department}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(prediction.riskLevel)}`}>
                            {prediction.riskLevel.toUpperCase()} RISK
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Risk Score: <span className={`font-semibold ${getScoreColor(prediction.riskScore)}`}>
                              {prediction.riskScore}%
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Risk Factors */}
                        <div>
                          <h5 className="text-sm font-medium text-gray-900 mb-3">Key Risk Factors</h5>
                          <div className="space-y-2">
                            {prediction.factors.map((factor, idx) => (
                              <div key={idx} className="flex justify-between items-center">
                                <span className="text-sm text-gray-700">{factor.factor}</span>
                                <span className="text-sm font-medium text-gray-900">{factor.weight}%</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Recommendations */}
                        <div>
                          <h5 className="text-sm font-medium text-gray-900 mb-3">AI Recommendations</h5>
                          <div className="space-y-2">
                            {prediction.recommendations.map((rec, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <ArrowRight className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-gray-700">{rec}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Prediction Details */}
                        <div>
                          <h5 className="text-sm font-medium text-gray-900 mb-3">Prediction Details</h5>
                          <div className="space-y-2">
                            <div>
                              <span className="text-sm text-gray-600">Predicted Action: </span>
                              <span className="text-sm font-medium text-gray-900">
                                {prediction.predictedAction.replace('_', ' ')}
                              </span>
                            </div>
                            <div>
                              <span className="text-sm text-gray-600">Timeframe: </span>
                              <span className="text-sm font-medium text-gray-900">{prediction.timeframe}</span>
                            </div>
                            <div>
                              <span className="text-sm text-gray-600">AI Confidence: </span>
                              <span className="text-sm font-medium text-purple-600">{prediction.confidence}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-6">
            {/* Performance Trends */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Performance Trend</h3>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-3xl font-bold text-blue-600">
                      {predictionData.performanceInsights.trends.overallPerformance.current}
                    </p>
                    <p className="text-sm text-gray-600">Current Average</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-green-600">
                      <TrendingUp className="h-4 w-4" />
                      <span className="font-medium">
                        {predictionData.performanceInsights.trends.overallPerformance.change}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">vs last quarter</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">AI Prediction (Next Quarter)</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {predictionData.performanceInsights.trends.overallPerformance.prediction}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
                <div className="space-y-3">
                  {predictionData.performanceInsights.trends.topPerformers.map((performer, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{performer.name}</p>
                        <p className="text-sm text-gray-600">Score: {performer.score}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {performer.trend === 'increasing' && <TrendingUp className="h-4 w-4 text-green-600" />}
                        {performer.trend === 'decreasing' && <TrendingDown className="h-4 w-4 text-red-600" />}
                        {performer.trend === 'stable' && <Activity className="h-4 w-4 text-blue-600" />}
                        <Star className="h-4 w-4 text-yellow-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Performance Factor Analysis */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Performance Factor Analysis</h3>
              <p className="text-gray-600 mb-6">Machine learning analysis of factors affecting employee performance</p>
              <div className="space-y-4">
                {predictionData.performanceInsights.trends.performanceFactors.map((factor, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{factor.factor}</h4>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">
                          Impact: <span className="font-medium text-purple-600">{factor.impact}%</span>
                        </span>
                        <span className="text-sm text-gray-600">
                          Correlation: <span className="font-medium text-blue-600">{factor.correlation}</span>
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${factor.impact}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Individual Performance Predictions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Individual Performance Predictions</h3>
              <div className="space-y-4">
                {predictionData.performanceInsights.predictions.map((pred, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{pred.name}</h4>
                        <p className="text-sm text-gray-600">{pred.employee}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">AI Confidence: {pred.confidence}%</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-sm text-gray-600">Current Score</p>
                        <p className="text-xl font-bold text-blue-600">{pred.currentScore}</p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-3">
                        <p className="text-sm text-gray-600">Predicted Score</p>
                        <p className="text-xl font-bold text-purple-600">{pred.predictedScore}</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3">
                        <p className="text-sm text-gray-600">Improvement</p>
                        <p className="text-xl font-bold text-green-600">
                          +{(pred.predictedScore - pred.currentScore).toFixed(1)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-900 mb-2">AI Recommendations:</p>
                      <div className="flex flex-wrap gap-2">
                        {pred.recommendations.map((rec, idx) => (
                          <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                            {rec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'training' && (
          <div className="space-y-6">
            {/* Training AI Overview */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">AI-Powered Training Recommendations</h3>
              <p className="text-gray-600 mb-6">
                Machine learning analysis of skill gaps and personalized training suggestions
              </p>
              
              <div className="space-y-6">
                {predictionData.trainingRecommendations.map((employee, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">
                            {employee.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{employee.name}</h4>
                          <p className="text-gray-600">{employee.employeeId}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          employee.priority === 'high' ? 'bg-red-50 text-red-700' :
                          employee.priority === 'medium' ? 'bg-yellow-50 text-yellow-700' :
                          'bg-green-50 text-green-700'
                        }`}>
                          {employee.priority.toUpperCase()} PRIORITY
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">AI Confidence</p>
                          <p className="text-lg font-bold text-purple-600">{employee.aiConfidence}%</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Skill Gaps */}
                      <div>
                        <h5 className="text-sm font-medium text-gray-900 mb-3">Identified Skill Gaps</h5>
                        <div className="flex flex-wrap gap-2">
                          {employee.skillGaps.map((skill, idx) => (
                            <span key={idx} className="px-3 py-1 bg-red-50 text-red-700 text-sm rounded-full border border-red-200">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Recommended Courses */}
                      <div>
                        <h5 className="text-sm font-medium text-gray-900 mb-3">AI-Recommended Courses</h5>
                        <div className="space-y-3">
                          {employee.recommendedCourses.map((course, idx) => (
                            <div key={idx} className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-start justify-between mb-2">
                                <h6 className="font-medium text-gray-900">{course.title}</h6>
                                <span className="text-sm font-medium text-purple-600">
                                  {course.relevanceScore}% match
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-1">{course.provider} • {course.duration}</p>
                              <p className="text-sm text-blue-600">{course.expectedImpact}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'forecasting' && (
          <div className="space-y-6">
            {/* Workforce Forecasting */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Hiring Forecast</h3>
                <div className="space-y-4">
                  {predictionData.workforceForecasting.departmentNeeds.map((dept, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">{dept.department}</h4>
                        <span className="text-sm font-medium text-purple-600">
                          {dept.confidence}% confidence
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-blue-600">{dept.currentHeadcount}</p>
                          <p className="text-sm text-gray-600">Current</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-green-600">{dept.predictedNeed}</p>
                          <p className="text-sm text-gray-600">Predicted</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-purple-600">
                            +{dept.predictedNeed - dept.currentHeadcount}
                          </p>
                          <p className="text-sm text-gray-600">Need to Hire</p>
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Timeframe: {dept.timeframe}</p>
                        <p className="text-sm text-gray-700 mt-1">{dept.reasoning}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Skill Demand Forecast</h3>
                <div className="space-y-4">
                  {predictionData.workforceForecasting.skillDemand.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{skill.skill}</h4>
                        <p className="text-sm text-gray-600">Market demand level</p>
                      </div>
                      <div className="text-right">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          skill.demand === 'High' ? 'bg-red-50 text-red-700' :
                          skill.demand === 'Growing' ? 'bg-yellow-50 text-yellow-700' :
                          'bg-green-50 text-green-700'
                        }`}>
                          {skill.demand}
                        </div>
                        <p className="text-sm font-medium text-purple-600 mt-1">{skill.growth}</p>
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

export default HRPredictiveAnalytics;
