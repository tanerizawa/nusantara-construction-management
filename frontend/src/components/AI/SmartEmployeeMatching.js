import React, { useState } from 'react';
import {
  Cpu,
  TrendingUp,
  Users,
  Target,
  Clock,
  Award,
  Brain,
  Zap,
  BarChart3,
  Activity,
  AlertTriangle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Calendar,
  MapPin,
  Star,
  Briefcase,
  GraduationCap,
  Heart,
  DollarSign,
  RefreshCw
} from 'lucide-react';

const SmartEmployeeMatching = () => {
  const [selectedProject, setSelectedProject] = useState('');
  const [matchingCriteria, setMatchingCriteria] = useState({
    skills: true,
    experience: true,
    availability: true,
    performance: true,
    location: false,
    workload: true
  });
  const [loading, setLoading] = useState(false);

  // Mock projects and employee data
  const [projects] = useState([
    {
      id: 'PRJ-2025-004',
      name: 'Modern Office Complex - Downtown',
      type: 'Commercial Construction',
      duration: '8 months',
      budget: 2500000000,
      startDate: '2025-09-15',
      location: 'Jakarta Pusat',
      urgency: 'high',
      requiredSkills: ['Project Management', 'Commercial Construction', 'Team Leadership', 'Safety Management'],
      teamSize: 12,
      complexity: 'high'
    },
    {
      id: 'PRJ-2025-005',
      name: 'Residential Villa Development',
      type: 'Residential Construction',
      duration: '6 months',
      budget: 1200000000,
      startDate: '2025-10-01',
      location: 'Tangerang',
      urgency: 'medium',
      requiredSkills: ['Residential Construction', 'Quality Control', 'Material Management'],
      teamSize: 8,
      complexity: 'medium'
    }
  ]);

  const [employeeMatches, setEmployeeMatches] = useState([
    {
      employeeId: 'EMP-001',
      name: 'Budi Santoso',
      position: 'Site Manager',
      department: 'Construction',
      matchScore: 94,
      availability: 'Available',
      currentWorkload: 75,
      location: 'Jakarta',
      experience: 8,
      performance: 4.5,
      skills: ['Project Management', 'Construction Safety', 'Team Leadership', 'Commercial Construction'],
      certifications: ['PMP', 'OSHA 30'],
      recentProjects: ['High-rise Apartment', 'Shopping Mall'],
      strengths: [
        'Excellent project management skills',
        'Strong safety record',
        'Proven commercial construction experience'
      ],
      concerns: [
        'High current workload (75%)',
        'May need additional support for this project size'
      ],
      aiRecommendation: 'Highly recommended - best overall match',
      estimatedImpact: 'High positive impact on project success',
      riskFactors: ['Workload management'],
      suggestedRole: 'Project Manager'
    },
    {
      employeeId: 'EMP-002',
      name: 'Sari Dewi',
      position: 'Project Engineer',
      department: 'Engineering',
      matchScore: 87,
      availability: 'Available',
      currentWorkload: 60,
      location: 'Jakarta',
      experience: 5,
      performance: 4.8,
      skills: ['AutoCAD', 'Structural Analysis', 'Quality Control', 'Commercial Construction'],
      certifications: ['Professional Engineer', 'ISO 9001'],
      recentProjects: ['Office Building', 'Warehouse Complex'],
      strengths: [
        'Exceptional technical skills',
        'High performance rating',
        'Experience with similar projects'
      ],
      concerns: [
        'Limited team leadership experience',
        'Relatively new to large-scale projects'
      ],
      aiRecommendation: 'Recommended - excellent technical fit',
      estimatedImpact: 'Medium-high positive impact',
      riskFactors: ['Leadership experience gap'],
      suggestedRole: 'Technical Lead'
    },
    {
      employeeId: 'EMP-006',
      name: 'Indra Wijaya',
      position: 'Construction Supervisor',
      department: 'Construction',
      matchScore: 78,
      availability: 'Partially Available',
      currentWorkload: 85,
      location: 'Bekasi',
      experience: 12,
      performance: 4.3,
      skills: ['Team Supervision', 'Quality Control', 'Safety Management', 'Commercial Construction'],
      certifications: ['Construction Safety', 'Quality Management'],
      recentProjects: ['Industrial Facility', 'Retail Complex'],
      strengths: [
        'Extensive experience',
        'Strong safety management',
        'Good team supervision skills'
      ],
      concerns: [
        'High current workload (85%)',
        'Location distance may affect availability',
        'Lower performance rating'
      ],
      aiRecommendation: 'Conditional - consider workload adjustment',
      estimatedImpact: 'Medium positive impact',
      riskFactors: ['Workload conflict', 'Geographic distance'],
      suggestedRole: 'Site Supervisor'
    },
    {
      employeeId: 'EMP-007',
      name: 'Maya Sari',
      position: 'Quality Inspector',
      department: 'Quality Assurance',
      matchScore: 72,
      availability: 'Available',
      currentWorkload: 45,
      location: 'Jakarta',
      experience: 4,
      performance: 4.6,
      skills: ['Quality Testing', 'Documentation', 'Compliance', 'Material Testing'],
      certifications: ['QA Inspector', 'Material Testing', 'ISO 9001'],
      recentProjects: ['Residential Complex', 'Office Building'],
      strengths: [
        'High performance rating',
        'Low current workload',
        'Strong quality focus'
      ],
      concerns: [
        'Limited commercial construction experience',
        'May need additional training for project complexity'
      ],
      aiRecommendation: 'Good fit with development potential',
      estimatedImpact: 'Medium positive impact',
      riskFactors: ['Experience level'],
      suggestedRole: 'Quality Control Lead'
    }
  ]);

  const runMatching = () => {
    if (!selectedProject) return;
    
    setLoading(true);
    // Simulate AI matching process
    setTimeout(() => {
      // Re-sort employees based on updated criteria
      const updatedMatches = [...employeeMatches].sort((a, b) => {
        let scoreA = a.matchScore;
        let scoreB = b.matchScore;
        
        if (matchingCriteria.performance) {
          scoreA += a.performance * 5;
          scoreB += b.performance * 5;
        }
        
        if (matchingCriteria.availability) {
          scoreA += a.availability === 'Available' ? 10 : -10;
          scoreB += b.availability === 'Available' ? 10 : -10;
        }
        
        if (matchingCriteria.workload) {
          scoreA += (100 - a.currentWorkload) * 0.2;
          scoreB += (100 - b.currentWorkload) * 0.2;
        }
        
        return scoreB - scoreA;
      });
      
      setEmployeeMatches(updatedMatches);
      setLoading(false);
    }, 2000);
  };

  const getMatchScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 80) return 'text-blue-600 bg-blue-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case 'Available': return 'text-green-600 bg-green-50';
      case 'Partially Available': return 'text-yellow-600 bg-yellow-50';
      case 'Unavailable': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getWorkloadColor = (workload) => {
    if (workload >= 90) return 'text-red-600';
    if (workload >= 75) return 'text-yellow-600';
    if (workload >= 50) return 'text-blue-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Cpu className="h-6 w-6 text-blue-600" />
            Smart Employee Matching
          </h2>
          <p className="text-gray-600 mt-1">
            AI-powered employee-to-project matching based on skills, performance, and availability
          </p>
        </div>
        <button
          onClick={runMatching}
          disabled={!selectedProject || loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Running AI Match...' : 'Run Smart Match'}
        </button>
      </div>

      {/* Project Selection */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Project</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project.id)}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedProject === project.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">{project.name}</h4>
                  <p className="text-sm text-gray-600">{project.id}</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  project.urgency === 'high' ? 'bg-red-100 text-red-700' :
                  project.urgency === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {project.urgency.toUpperCase()}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Type:</p>
                  <p className="font-medium">{project.type}</p>
                </div>
                <div>
                  <p className="text-gray-600">Duration:</p>
                  <p className="font-medium">{project.duration}</p>
                </div>
                <div>
                  <p className="text-gray-600">Team Size:</p>
                  <p className="font-medium">{project.teamSize} members</p>
                </div>
                <div>
                  <p className="text-gray-600">Location:</p>
                  <p className="font-medium">
                    {typeof project.location === 'object' && project.location ? 
                      `${project.location.address || ''}, ${project.location.city || ''}, ${project.location.state || ''}`.replace(/^,\s*|,\s*$|,\s*,/g, '').trim() || 'Location not specified'
                      : project.location || 'Location not specified'
                    }
                  </p>
                </div>
              </div>
              
              <div className="mt-3">
                <p className="text-gray-600 text-sm mb-2">Required Skills:</p>
                <div className="flex flex-wrap gap-1">
                  {project.requiredSkills.slice(0, 3).map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                      {skill}
                    </span>
                  ))}
                  {project.requiredSkills.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      +{project.requiredSkills.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Matching Criteria */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Matching Criteria</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(matchingCriteria).map(([key, value]) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => setMatchingCriteria(prev => ({
                  ...prev,
                  [key]: e.target.checked
                }))}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Employee Matches */}
      {selectedProject && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">AI Employee Matches</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Brain className="h-4 w-4" />
                Machine Learning Analysis
              </div>
            </div>
            <p className="text-gray-600 mt-1">
              Employees ranked by AI compatibility score for {projects.find(p => p.id === selectedProject)?.name}
            </p>
          </div>
          
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <RefreshCw className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">AI Processing...</h3>
                <p className="text-gray-600">Analyzing employee compatibility and generating matches</p>
              </div>
            ) : (
              <div className="space-y-6">
                {employeeMatches.map((employee, index) => (
                  <div key={employee.employeeId} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-lg font-bold text-blue-600">
                              {employee.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-white">#{index + 1}</span>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{employee.name}</h4>
                          <p className="text-gray-600">{employee.position} • {employee.department}</p>
                          <p className="text-sm text-gray-500">{employee.employeeId}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-bold ${getMatchScoreColor(employee.matchScore)}`}>
                          {employee.matchScore}% Match
                        </div>
                        <p className="text-sm text-gray-600 mt-1">AI Compatibility Score</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                      {/* Key Metrics */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-gray-600">Availability:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(employee.availability)}`}>
                            {employee.availability}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-blue-600" />
                          <span className="text-sm text-gray-600">Workload:</span>
                          <span className={`font-medium ${getWorkloadColor(employee.currentWorkload)}`}>
                            {employee.currentWorkload}%
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-600" />
                          <span className="text-sm text-gray-600">Location:</span>
                          <span className="font-medium">{employee.location}</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-purple-600" />
                          <span className="text-sm text-gray-600">Experience:</span>
                          <span className="font-medium">{employee.experience} years</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm text-gray-600">Performance:</span>
                          <span className="font-medium text-green-600">{employee.performance}/5</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-blue-600" />
                          <span className="text-sm text-gray-600">Role:</span>
                          <span className="font-medium">{employee.suggestedRole}</span>
                        </div>
                      </div>

                      {/* Skills Match */}
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Skill Match:</p>
                        <div className="space-y-1">
                          {employee.skills.slice(0, 4).map((skill, idx) => {
                            const skillName = typeof skill === 'string' ? skill : skill.name;
                            const isRequired = projects.find(p => p.id === selectedProject)?.requiredSkills.includes(skillName);
                            return (
                              <div key={idx} className="flex items-center gap-2">
                                {isRequired ? (
                                  <CheckCircle className="h-3 w-3 text-green-600" />
                                ) : (
                                  <div className="h-3 w-3 rounded-full bg-gray-300"></div>
                                )}
                                <span className={`text-xs ${isRequired ? 'text-green-700 font-medium' : 'text-gray-600'}`}>
                                  {skillName}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* AI Recommendation */}
                      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Brain className="h-4 w-4 text-purple-600" />
                          <span className="text-sm font-medium text-purple-900">AI Insight</span>
                        </div>
                        <p className="text-xs text-purple-800">{employee.aiRecommendation}</p>
                      </div>
                    </div>

                    {/* Detailed Analysis */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-200">
                      <div>
                        <h5 className="text-sm font-medium text-green-900 mb-2">Strengths</h5>
                        <div className="space-y-1">
                          {employee.strengths.map((strength, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <ArrowUp className="h-3 w-3 text-green-600 mt-1 flex-shrink-0" />
                              <span className="text-xs text-green-700">{strength}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h5 className="text-sm font-medium text-yellow-900 mb-2">Considerations</h5>
                        <div className="space-y-1">
                          {employee.concerns.map((concern, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <AlertTriangle className="h-3 w-3 text-yellow-600 mt-1 flex-shrink-0" />
                              <span className="text-xs text-yellow-700">{concern}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h5 className="text-sm font-medium text-blue-900 mb-2">Impact Prediction</h5>
                        <div className="space-y-2">
                          <p className="text-xs text-blue-800">{employee.estimatedImpact}</p>
                          <div className="flex flex-wrap gap-1">
                            {employee.riskFactors.map((risk, idx) => (
                              <span key={idx} className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                                {risk}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartEmployeeMatching;
