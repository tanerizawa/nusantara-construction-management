import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  Circle, 
  AlertTriangle,
  Plus,
  Edit3,
  Trash2,
  Target,
  TrendingUp
} from 'lucide-react';

const ProjectMilestoneManager = ({ projectId, projectTimeline }) => {
  const [milestones, setMilestones] = useState([
    { 
      id: 1, 
      name: 'Project Initiation', 
      description: 'Kick-off meeting and initial planning',
      targetDate: '2024-01-15', 
      actualDate: '2024-01-15',
      status: 'completed',
      progress: 100,
      dependencies: [],
      critical: true
    },
    { 
      id: 2, 
      name: 'Foundation Complete', 
      description: 'Foundation work completion',
      targetDate: '2024-02-28', 
      actualDate: null,
      status: 'in_progress',
      progress: 65,
      dependencies: [1],
      critical: true
    },
    { 
      id: 3, 
      name: 'Structure Framework', 
      description: 'Main structure framework completion',
      targetDate: '2024-04-15', 
      actualDate: null,
      status: 'pending',
      progress: 0,
      dependencies: [2],
      critical: true
    },
    { 
      id: 4, 
      name: 'MEP Installation', 
      description: 'Mechanical, Electrical, and Plumbing installation',
      targetDate: '2024-06-30', 
      actualDate: null,
      status: 'pending',
      progress: 0,
      dependencies: [3],
      critical: false
    },
    { 
      id: 5, 
      name: 'Final Inspection', 
      description: 'Final quality inspection and handover',
      targetDate: '2024-08-15', 
      actualDate: null,
      status: 'pending',
      progress: 0,
      dependencies: [4],
      critical: true
    }
  ]);

  const [newMilestone, setNewMilestone] = useState({
    name: '',
    description: '',
    targetDate: '',
    critical: false,
    dependencies: []
  });

  // Calculate milestone stats
  const completedMilestones = milestones.filter(m => m.status === 'completed').length;
  const totalMilestones = milestones.length;
  const overallProgress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;
  const criticalPath = milestones.filter(m => m.critical);
  const delayedMilestones = milestones.filter(m => {
    if (m.status === 'completed') return false;
    const today = new Date();
    const targetDate = new Date(m.targetDate);
    return targetDate < today;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short', 
      year: 'numeric'
    });
  };

  const getStatusIcon = (status, progress) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'delayed':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-green-100 text-green-800',
      in_progress: 'bg-blue-100 text-blue-800',
      delayed: 'bg-red-100 text-red-800',
      pending: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || colors.pending;
  };

  const addMilestone = () => {
    if (!newMilestone.name || !newMilestone.targetDate) return;

    const milestone = {
      id: Date.now(),
      ...newMilestone,
      status: 'pending',
      progress: 0,
      actualDate: null
    };

    setMilestones([...milestones, milestone]);
    setNewMilestone({
      name: '',
      description: '',
      targetDate: '',
      critical: false,
      dependencies: []
    });
  };

  const updateMilestoneStatus = (id, status, progress = null) => {
    setMilestones(milestones.map(m => 
      m.id === id 
        ? { 
            ...m, 
            status, 
            progress: progress !== null ? progress : (status === 'completed' ? 100 : m.progress),
            actualDate: status === 'completed' ? new Date().toISOString().split('T')[0] : null
          }
        : m
    ));
  };

  const deleteMilestone = (id) => {
    setMilestones(milestones.filter(m => m.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Milestone Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Milestones</p>
              <p className="text-2xl font-bold text-gray-900">{totalMilestones}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{completedMilestones}</p>
              <p className="text-sm text-gray-500">{overallProgress.toFixed(1)}% progress</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Critical Path</p>
              <p className="text-2xl font-bold text-orange-600">{criticalPath.length}</p>
              <p className="text-sm text-gray-500">Critical milestones</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Delayed</p>
              <p className="text-2xl font-bold text-red-600">{delayedMilestones.length}</p>
              <p className="text-sm text-gray-500">Need attention</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Milestone Timeline */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Project Timeline</h3>
        </div>
        
        <div className="p-6">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>
            
            <div className="space-y-6">
              {milestones.map((milestone, index) => {
                const isDelayed = new Date(milestone.targetDate) < new Date() && milestone.status !== 'completed';
                
                return (
                  <div key={milestone.id} className="relative flex items-start space-x-4">
                    {/* Timeline Dot */}
                    <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                      milestone.status === 'completed' 
                        ? 'bg-green-100 border-green-600' 
                        : milestone.status === 'in_progress'
                        ? 'bg-blue-100 border-blue-600'
                        : isDelayed
                        ? 'bg-red-100 border-red-600'
                        : 'bg-gray-100 border-gray-300'
                    }`}>
                      {getStatusIcon(isDelayed && milestone.status !== 'completed' ? 'delayed' : milestone.status)}
                    </div>

                    {/* Milestone Content */}
                    <div className="flex-1 min-w-0">
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <h4 className="text-lg font-medium text-gray-900">{milestone.name}</h4>
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(isDelayed && milestone.status !== 'completed' ? 'delayed' : milestone.status)}`}>
                                {isDelayed && milestone.status !== 'completed' ? 'Delayed' : milestone.status.replace('_', ' ')}
                              </span>
                              {milestone.critical && (
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                                  Critical
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                            
                            <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>Target: {formatDate(milestone.targetDate)}</span>
                              </div>
                              {milestone.actualDate && (
                                <div className="flex items-center space-x-1">
                                  <CheckCircle className="w-4 h-4" />
                                  <span>Completed: {formatDate(milestone.actualDate)}</span>
                                </div>
                              )}
                            </div>

                            {/* Progress Bar */}
                            {milestone.status !== 'pending' && (
                              <div className="mt-3">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm text-gray-600">Progress</span>
                                  <span className="text-sm text-gray-900">{milestone.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full ${
                                      milestone.status === 'completed' ? 'bg-green-600' : 'bg-blue-600'
                                    }`}
                                    style={{ width: `${milestone.progress}%` }}
                                  ></div>
                                </div>
                              </div>
                            )}

                            {/* Dependencies */}
                            {milestone.dependencies.length > 0 && (
                              <div className="mt-3">
                                <span className="text-sm text-gray-600">Dependencies: </span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {milestone.dependencies.map(depId => {
                                    const dep = milestones.find(m => m.id === depId);
                                    return dep ? (
                                      <span key={depId} className={`inline-flex px-2 py-1 text-xs rounded ${
                                        dep.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                      }`}>
                                        {dep.name}
                                      </span>
                                    ) : null;
                                  })}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center space-x-2 ml-4">
                            {milestone.status !== 'completed' && (
                              <>
                                <button
                                  onClick={() => updateMilestoneStatus(milestone.id, 'in_progress', 50)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Start milestone"
                                >
                                  <Clock className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => updateMilestoneStatus(milestone.id, 'completed')}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  title="Mark as completed"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => console.log('Edit milestone:', milestone.id)}
                              className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                              title="Edit milestone"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteMilestone(milestone.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete milestone"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Add New Milestone */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Milestone</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Milestone Name
            </label>
            <input
              type="text"
              value={newMilestone.name}
              onChange={(e) => setNewMilestone({ ...newMilestone, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter milestone name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Date
            </label>
            <input
              type="date"
              value={newMilestone.targetDate}
              onChange={(e) => setNewMilestone({ ...newMilestone, targetDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={newMilestone.description}
            onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Milestone description..."
          />
        </div>
        <div className="mt-4 flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={newMilestone.critical}
              onChange={(e) => setNewMilestone({ ...newMilestone, critical: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Critical Path</span>
          </label>
          <button
            onClick={addMilestone}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Milestone</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectMilestoneManager;
