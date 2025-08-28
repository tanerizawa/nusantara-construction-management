import React, { useState, useEffect } from 'react';
import { DataCard, Button } from '../DataStates';
import {
  Play,
  Pause,
  Plus,
  Edit2,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  Bell,
  Calendar,
  Mail,
  FileText,
  Zap,
  Activity,
  Search
} from 'lucide-react';

const HRWorkflow = () => {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // Mock workflow data
  const mockWorkflows = [
    {
      id: 1,
      name: 'New Employee Onboarding',
      description: 'Automated onboarding process for new hires',
      category: 'onboarding',
      status: 'active',
      trigger: 'employee_created',
      steps: [
        { id: 1, name: 'Send Welcome Email', type: 'email', delay: 0, completed: true },
        { id: 2, name: 'Create IT Accounts', type: 'task', delay: 1, completed: true },
        { id: 3, name: 'Schedule Orientation', type: 'calendar', delay: 2, completed: false },
        { id: 4, name: 'Assign Buddy', type: 'assignment', delay: 3, completed: false },
        { id: 5, name: 'Send Handbook', type: 'document', delay: 5, completed: false }
      ],
      executions: 15,
      successRate: 93.3,
      lastRun: '2024-01-15T10:30:00Z',
      createdBy: 'HR Team',
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 2,
      name: 'Performance Review Cycle',
      description: 'Quarterly performance review automation',
      category: 'performance',
      status: 'active',
      trigger: 'scheduled',
      schedule: '0 9 1 */3 *', // First day of every quarter at 9 AM
      steps: [
        { id: 1, name: 'Notify Managers', type: 'notification', delay: 0, completed: true },
        { id: 2, name: 'Send Review Forms', type: 'form', delay: 1, completed: true },
        { id: 3, name: 'Remind Completion', type: 'reminder', delay: 7, completed: false },
        { id: 4, name: 'Compile Results', type: 'data', delay: 14, completed: false },
        { id: 5, name: 'Schedule Meetings', type: 'calendar', delay: 16, completed: false }
      ],
      executions: 4,
      successRate: 100,
      lastRun: '2024-01-01T09:00:00Z',
      nextRun: '2024-04-01T09:00:00Z',
      createdBy: 'Performance Team',
      createdAt: '2023-12-01T00:00:00Z'
    },
    {
      id: 3,
      name: 'Training Reminder System',
      description: 'Automated training completion reminders',
      category: 'training',
      status: 'active',
      trigger: 'training_due',
      steps: [
        { id: 1, name: 'Check Training Status', type: 'check', delay: 0, completed: true },
        { id: 2, name: 'Send Initial Reminder', type: 'email', delay: 7, completed: true },
        { id: 3, name: 'Escalate to Manager', type: 'escalation', delay: 14, completed: false },
        { id: 4, name: 'Final Notice', type: 'notification', delay: 21, completed: false }
      ],
      executions: 28,
      successRate: 85.7,
      lastRun: '2024-01-14T08:00:00Z',
      createdBy: 'Training Team',
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 4,
      name: 'Exit Interview Process',
      description: 'Streamlined employee exit process',
      category: 'offboarding',
      status: 'paused',
      trigger: 'employee_resignation',
      steps: [
        { id: 1, name: 'Schedule Exit Interview', type: 'calendar', delay: 0, completed: false },
        { id: 2, name: 'Asset Return Checklist', type: 'checklist', delay: 1, completed: false },
        { id: 3, name: 'IT Account Deactivation', type: 'task', delay: 5, completed: false },
        { id: 4, name: 'Final Payroll Processing', type: 'payroll', delay: 7, completed: false }
      ],
      executions: 3,
      successRate: 66.7,
      lastRun: '2024-01-10T14:00:00Z',
      createdBy: 'HR Team',
      createdAt: '2023-11-15T00:00:00Z'
    }
  ];

  const [newWorkflow, setNewWorkflow] = useState({
    name: '',
    description: '',
    category: 'onboarding',
    trigger: 'manual',
    schedule: '',
    steps: []
  });

  useEffect(() => {
    fetchWorkflows();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchWorkflows = async () => {
    try {
      setLoading(true);
      // In a real app, this would be an API call
      // const response = await axios.get('http://localhost:5000/api/workflows');
      setWorkflows(mockWorkflows);
    } catch (error) {
      console.error('Error fetching workflows:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || workflow.category === filterCategory;
    const matchesTab = activeTab === 'all' || workflow.status === activeTab;
    
    return matchesSearch && matchesCategory && matchesTab;
  });

  const toggleWorkflowStatus = async (workflowId) => {
    try {
      const workflow = workflows.find(w => w.id === workflowId);
      const newStatus = workflow.status === 'active' ? 'paused' : 'active';
      
      setWorkflows(workflows.map(w => 
        w.id === workflowId ? { ...w, status: newStatus } : w
      ));
      
      // In a real app, make API call
      // await axios.patch(`http://localhost:5000/api/workflows/${workflowId}`, { status: newStatus });
    } catch (error) {
      console.error('Error updating workflow status:', error);
    }
  };

  const executeWorkflow = async (workflowId) => {
    try {
      // In a real app, make API call to execute workflow
      // await axios.post(`http://localhost:5000/api/workflows/${workflowId}/execute`);
      
      setWorkflows(workflows.map(w => 
        w.id === workflowId ? { 
          ...w, 
          executions: w.executions + 1,
          lastRun: new Date().toISOString()
        } : w
      ));
      
      alert('Workflow executed successfully!');
    } catch (error) {
      console.error('Error executing workflow:', error);
    }
  };

  const deleteWorkflow = async (workflowId) => {
    if (window.confirm('Are you sure you want to delete this workflow?')) {
      try {
        setWorkflows(workflows.filter(w => w.id !== workflowId));
        // In a real app, make API call
        // await axios.delete(`http://localhost:5000/api/workflows/${workflowId}`);
      } catch (error) {
        console.error('Error deleting workflow:', error);
      }
    }
  };

  const addStep = () => {
    const newStep = {
      id: Date.now(),
      name: '',
      type: 'email',
      delay: 0,
      completed: false
    };
    setNewWorkflow({
      ...newWorkflow,
      steps: [...newWorkflow.steps, newStep]
    });
  };

  const updateStep = (stepId, field, value) => {
    setNewWorkflow({
      ...newWorkflow,
      steps: newWorkflow.steps.map(step =>
        step.id === stepId ? { ...step, [field]: value } : step
      )
    });
  };

  const removeStep = (stepId) => {
    setNewWorkflow({
      ...newWorkflow,
      steps: newWorkflow.steps.filter(step => step.id !== stepId)
    });
  };

  const createWorkflow = async () => {
    try {
      const workflow = {
        ...newWorkflow,
        id: Date.now(),
        status: 'active',
        executions: 0,
        successRate: 0,
        createdBy: 'Current User',
        createdAt: new Date().toISOString()
      };
      
      setWorkflows([...workflows, workflow]);
      setShowCreateModal(false);
      setNewWorkflow({
        name: '',
        description: '',
        category: 'onboarding',
        trigger: 'manual',
        schedule: '',
        steps: []
      });
      
      // In a real app, make API call
      // await axios.post('http://localhost:5000/api/workflows', workflow);
    } catch (error) {
      console.error('Error creating workflow:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'paused': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStepTypeIcon = (type) => {
    switch (type) {
      case 'email': return Mail;
      case 'notification': return Bell;
      case 'calendar': return Calendar;
      case 'task': return CheckCircle;
      case 'form': return FileText;
      case 'check': return Activity;
      case 'reminder': return Clock;
      case 'escalation': return AlertCircle;
      case 'assignment': return Users;
      case 'document': return FileText;
      case 'checklist': return CheckCircle;
      case 'payroll': return FileText;
      case 'data': return Activity;
      default: return Activity;
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
          <h2 className="text-2xl font-bold text-gray-900">HR Workflow Automation</h2>
          <p className="text-gray-600 mt-1">Automate and streamline HR processes</p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Workflow
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DataCard
          title="Total Workflows"
          value={workflows.length}
          icon={Zap}
          color="blue"
        />
        <DataCard
          title="Active Workflows"
          value={workflows.filter(w => w.status === 'active').length}
          icon={Play}
          color="green"
        />
        <DataCard
          title="Total Executions"
          value={workflows.reduce((sum, w) => sum + w.executions, 0)}
          icon={Activity}
          color="purple"
        />
        <DataCard
          title="Avg Success Rate"
          value={`${workflows.length > 0 ? 
            (workflows.reduce((sum, w) => sum + w.successRate, 0) / workflows.length).toFixed(1) : 0}%`}
          icon={CheckCircle}
          color="green"
        />
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search workflows..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            <option value="onboarding">Onboarding</option>
            <option value="performance">Performance</option>
            <option value="training">Training</option>
            <option value="offboarding">Offboarding</option>
            <option value="compliance">Compliance</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="flex overflow-x-auto">
          {[
            { id: 'all', label: 'All Workflows', count: workflows.length },
            { id: 'active', label: 'Active', count: workflows.filter(w => w.status === 'active').length },
            { id: 'paused', label: 'Paused', count: workflows.filter(w => w.status === 'paused').length }
          ].map(({ id, label, count }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                activeTab === id
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {label}
              <span className="ml-2 px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                {count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Workflows List */}
      <div className="space-y-4">
        {filteredWorkflows.map((workflow) => (
          <div key={workflow.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{workflow.name}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(workflow.status)}`}>
                      {workflow.status}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-600 capitalize">
                      {workflow.category}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{workflow.description}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="text-sm">
                      <span className="text-gray-500">Executions:</span>
                      <span className="ml-1 font-medium">{workflow.executions}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Success Rate:</span>
                      <span className="ml-1 font-medium">{workflow.successRate}%</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Last Run:</span>
                      <span className="ml-1 font-medium">
                        {new Date(workflow.lastRun).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Created By:</span>
                      <span className="ml-1 font-medium">{workflow.createdBy}</span>
                    </div>
                  </div>

                  {/* Workflow Steps Preview */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-gray-700">Steps:</span>
                      <span className="text-xs text-gray-500">
                        {workflow.steps.filter(s => s.completed).length} of {workflow.steps.length} completed
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {workflow.steps.slice(0, 5).map((step, index) => {
                        const StepIcon = getStepTypeIcon(step.type);
                        return (
                          <div
                            key={step.id}
                            className={`flex items-center gap-1 px-2 py-1 text-xs rounded-full ${
                              step.completed 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            <StepIcon className="w-3 h-3" />
                            {step.name}
                            {step.completed && <CheckCircle className="w-3 h-3" />}
                          </div>
                        );
                      })}
                      {workflow.steps.length > 5 && (
                        <span className="px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded-full">
                          +{workflow.steps.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Button
                    onClick={() => executeWorkflow(workflow.id)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    disabled={workflow.status !== 'active'}
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Run
                  </Button>
                  
                  <Button
                    onClick={() => toggleWorkflowStatus(workflow.id)}
                    className={`${
                      workflow.status === 'active'
                        ? 'bg-yellow-600 hover:bg-yellow-700'
                        : 'bg-green-600 hover:bg-green-700'
                    } text-white`}
                  >
                    {workflow.status === 'active' ? (
                      <>
                        <Pause className="w-4 h-4 mr-1" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-1" />
                        Resume
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={() => alert('Edit functionality coming soon!')}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Edit2 className="w-4 h-4 mr-1" />
                    Edit
                  </Button>

                  <Button
                    onClick={() => deleteWorkflow(workflow.id)}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredWorkflows.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No workflows found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterCategory 
                ? 'Try adjusting your search or filter criteria'
                : 'Create your first workflow to automate HR processes'
              }
            </p>
            {!searchTerm && !filterCategory && (
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Workflow
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Create Workflow Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Create New Workflow</h3>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Workflow Name
                  </label>
                  <input
                    type="text"
                    value={newWorkflow.name}
                    onChange={(e) => setNewWorkflow({...newWorkflow, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter workflow name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={newWorkflow.category}
                    onChange={(e) => setNewWorkflow({...newWorkflow, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="onboarding">Onboarding</option>
                    <option value="performance">Performance</option>
                    <option value="training">Training</option>
                    <option value="offboarding">Offboarding</option>
                    <option value="compliance">Compliance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newWorkflow.description}
                  onChange={(e) => setNewWorkflow({...newWorkflow, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe what this workflow does"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trigger
                  </label>
                  <select
                    value={newWorkflow.trigger}
                    onChange={(e) => setNewWorkflow({...newWorkflow, trigger: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="manual">Manual</option>
                    <option value="employee_created">New Employee</option>
                    <option value="employee_resignation">Employee Resignation</option>
                    <option value="training_due">Training Due</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>

                {newWorkflow.trigger === 'scheduled' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Schedule (Cron)
                    </label>
                    <input
                      type="text"
                      value={newWorkflow.schedule}
                      onChange={(e) => setNewWorkflow({...newWorkflow, schedule: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0 9 * * 1 (Every Monday at 9 AM)"
                    />
                  </div>
                )}
              </div>

              {/* Workflow Steps */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Workflow Steps
                  </label>
                  <Button
                    onClick={addStep}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Step
                  </Button>
                </div>

                <div className="space-y-3">
                  {newWorkflow.steps.map((step, index) => (
                    <div key={step.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                        {index + 1}
                      </span>
                      
                      <input
                        type="text"
                        value={step.name}
                        onChange={(e) => updateStep(step.id, 'name', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                        placeholder="Step name"
                      />
                      
                      <select
                        value={step.type}
                        onChange={(e) => updateStep(step.id, 'type', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="email">Email</option>
                        <option value="notification">Notification</option>
                        <option value="calendar">Calendar</option>
                        <option value="task">Task</option>
                        <option value="form">Form</option>
                        <option value="reminder">Reminder</option>
                        <option value="escalation">Escalation</option>
                      </select>
                      
                      <input
                        type="number"
                        value={step.delay}
                        onChange={(e) => updateStep(step.id, 'delay', parseInt(e.target.value))}
                        className="w-20 px-3 py-2 border border-gray-300 rounded-md text-sm"
                        placeholder="Days"
                        min="0"
                      />
                      
                      <Button
                        onClick={() => removeStep(step.id)}
                        className="bg-red-600 hover:bg-red-700 text-white text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <Button
                onClick={() => setShowCreateModal(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={createWorkflow}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!newWorkflow.name || !newWorkflow.description}
              >
                Create Workflow
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HRWorkflow;
