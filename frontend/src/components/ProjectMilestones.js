import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Target,
  Flag,
  Users,
  DollarSign
} from 'lucide-react';
import { projectAPI } from '../services/api';

const ProjectMilestones = ({ project, onUpdate }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState(null);
  
  // Enhanced milestones with integrated data
  const [milestones, setMilestones] = useState([]);

  // Load milestones from database
  useEffect(() => {
    const loadMilestones = async () => {
      try {
        const response = await projectAPI.getMilestones(project.id);
        if (response.data && response.data.length > 0) {
          // Map backend data to frontend format
          const mappedMilestones = response.data.map(item => ({
            id: item.id,
            name: item.title || '', // Map backend title to frontend name
            description: item.description || '',
            targetDate: item.targetDate ? item.targetDate.split('T')[0] : '', // Format date for input
            actualDate: item.completedDate ? item.completedDate.split('T')[0] : null,
            status: item.status || 'pending',
            progress: parseInt(item.progress) || 0,
            budget: parseFloat(item.budget) || 0,
            actualCost: parseFloat(item.actualCost) || 0,
            deliverables: item.deliverables ? (typeof item.deliverables === 'string' ? JSON.parse(item.deliverables) : item.deliverables) : [''],
            assignedTeam: item.assignedTo ? [item.assignedTo] : [],
            dependencies: item.dependencies ? (typeof item.dependencies === 'string' ? JSON.parse(item.dependencies) : item.dependencies) : [],
            notes: item.notes || '',
            priority: item.priority || 'medium',
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
          }));
          setMilestones(mappedMilestones);
        } else {
          // Set empty array if no milestones exist
          setMilestones([]);
        }
      } catch (error) {
        console.error('Error loading milestones:', error);
        // Set empty array on error
        setMilestones([]);
      }
    };

    loadMilestones();
  }, [project.id]);

  // Database operations
  const saveMilestone = async (milestoneData) => {
    try {
      // Map frontend fields to backend fields
      const milestoneItemData = {
        title: milestoneData.name || milestoneData.title,
        description: milestoneData.description,
        targetDate: milestoneData.targetDate,
        assignedTo: milestoneData.assignedTeam?.[0] || null,
        priority: milestoneData.priority || 'medium',
        notes: milestoneData.notes || '',
        createdBy: 'current_user' // Should get from auth context
      };

      let updatedMilestones;

      if (editingMilestone) {
        // Update existing milestone
        await projectAPI.updateMilestone(project.id, editingMilestone.id, milestoneItemData);
        
        const updatedMilestone = { 
          ...milestoneData, 
          id: editingMilestone.id, 
          updatedAt: new Date().toISOString() 
        };
        setMilestones(prev => prev.map(milestone => 
          milestone.id === editingMilestone.id ? updatedMilestone : milestone
        ));
        
        updatedMilestones = milestones.map(m => 
          m.id === editingMilestone.id ? updatedMilestone : m
        );
        
        setEditingMilestone(null);
        alert('Milestone berhasil diperbarui!');
      } else {
        // Create new milestone
        const response = await projectAPI.createMilestone(project.id, milestoneItemData);
        
        const newMilestone = { 
          ...milestoneData, // Keep original form data for display
          id: response.data.id || `MS${Date.now()}`,
          createdAt: new Date().toISOString()
        };
        setMilestones(prev => [...prev, newMilestone]);
        
        updatedMilestones = [...milestones, newMilestone];
        
        alert('Milestone berhasil ditambahkan!');
      }
      
      setShowAddForm(false);
      
      // Update project with new milestones
      onUpdate({ 
        milestones: updatedMilestones,
        timeline: {
          ...project.timeline,
          milestones: updatedMilestones,
          updatedAt: new Date().toISOString()
        }
      });
      
    } catch (error) {
      console.error('Error saving milestone:', error);
      alert('Gagal menyimpan milestone. Silakan coba lagi.');
    }
  };

  const deleteMilestone = async (milestoneId) => {
    if (!window.confirm('Yakin ingin menghapus milestone ini?')) return;
    
    try {
      // Real data - call API
      await projectAPI.deleteMilestone(project.id, milestoneId);
      
      const updatedMilestones = milestones.filter(milestone => milestone.id !== milestoneId);
      setMilestones(updatedMilestones);
      
      // Update project milestones
      onUpdate({ 
        milestones: updatedMilestones,
        timeline: {
          ...project.timeline,
          milestones: updatedMilestones,
          updatedAt: new Date().toISOString()
        }
      });
      
      alert('Milestone berhasil dihapus!');
      
    } catch (error) {
      console.error('Error deleting milestone:', error);
      alert('Gagal menghapus milestone. Silakan coba lagi.');
    }
  };

  const updateMilestoneProgress = async (milestoneId, progress) => {
    try {
      const milestone = milestones.find(m => m.id === milestoneId);
      if (!milestone) {
        console.error('Milestone not found:', milestoneId);
        alert('Milestone tidak ditemukan. Silakan refresh halaman.');
        return;
      }

      const updatedData = { 
        title: milestone.name || milestone.title,
        description: milestone.description,
        targetDate: milestone.targetDate,
        progress,
        status: progress === 100 ? 'completed' : progress > 0 ? 'in_progress' : 'pending',
        assignedTo: milestone.assignedTeam?.[0] || null,
        priority: milestone.priority || 'medium',
        notes: milestone.notes || ''
      };

      // Update milestone in database
      await projectAPI.updateMilestone(project.id, milestoneId, updatedData);
      
      setMilestones(prev => prev.map(m => 
        m.id === milestoneId ? { ...milestone, ...updatedData } : m
      ));
      
      // Update project milestones
      onUpdate({ milestones: milestones });
      
    } catch (error) {
      console.error('Error updating milestone progress:', error);
      alert('Error updating milestone progress. Please try again.');
    }
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const total = milestones.length;
    const completed = milestones.filter(m => m.status === 'completed').length;
    const inProgress = milestones.filter(m => m.status === 'in_progress').length;
    const overdue = milestones.filter(m => {
      if (m.status === 'completed') return false;
      return new Date(m.targetDate) < new Date();
    }).length;
    
    const totalBudget = milestones.reduce((sum, m) => sum + m.budget, 0);
    const totalActualCost = milestones.reduce((sum, m) => sum + m.actualCost, 0);
    const progressWeighted = milestones.reduce((sum, m) => sum + (m.progress * m.budget), 0) / totalBudget;
    
    return {
      total,
      completed,
      inProgress,
      overdue,
      completionRate: (completed / total) * 100,
      totalBudget,
      totalActualCost,
      progressWeighted: progressWeighted || 0
    };
  }, [milestones]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      completed: { color: 'green', icon: CheckCircle, text: 'Selesai' },
      in_progress: { color: 'blue', icon: Clock, text: 'Berlangsung' },
      pending: { color: 'gray', icon: AlertCircle, text: 'Pending' },
      overdue: { color: 'red', icon: AlertCircle, text: 'Terlambat' }
    };
    return statusMap[status] || statusMap.pending;
  };

  const isOverdue = (milestone) => {
    if (milestone.status === 'completed') return false;
    return new Date(milestone.targetDate) < new Date();
  };

  const MilestoneForm = ({ milestone, onSave, onCancel }) => {
    const [formData, setFormData] = useState(milestone || {
      name: '',
      description: '',
      targetDate: '',
      budget: 0,
      deliverables: [''],
      assignedTeam: [],
      dependencies: [],
      notes: ''
    });

    // Ensure deliverables is always an array
    React.useEffect(() => {
      if (milestone) {
        setFormData({
          ...milestone,
          deliverables: milestone.deliverables || [''],
          assignedTeam: milestone.assignedTeam || [],
          dependencies: milestone.dependencies || []
        });
      }
    }, [milestone]);

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave({
        ...formData,
        id: milestone?.id || Date.now(),
        status: milestone?.status || 'pending',
        progress: milestone?.progress || 0,
        actualCost: milestone?.actualCost || 0,
        actualDate: milestone?.actualDate || null
      });
    };

    const updateDeliverable = (index, value) => {
      const currentDeliverables = formData.deliverables || [''];
      const newDeliverables = [...currentDeliverables];
      newDeliverables[index] = value;
      setFormData({ ...formData, deliverables: newDeliverables });
    };

    const addDeliverable = () => {
      const currentDeliverables = formData.deliverables || [];
      setFormData({ 
        ...formData, 
        deliverables: [...currentDeliverables, ''] 
      });
    };

    const removeDeliverable = (index) => {
      const currentDeliverables = formData.deliverables || [];
      const newDeliverables = currentDeliverables.filter((_, i) => i !== index);
      setFormData({ ...formData, deliverables: newDeliverables });
    };

    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
        style={{
          zIndex: 9999,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div 
          className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto"
          style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            maxWidth: '672px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}
        >
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">
              {milestone ? 'Edit Milestone' : 'Tambah Milestone'}
            </h3>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nama Milestone</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Deskripsi</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Target Tanggal</label>
                <input
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Budget</label>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) || 0 })}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Deliverables</label>
              {(formData.deliverables || []).map((deliverable, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={deliverable}
                    onChange={(e) => updateDeliverable(index, e.target.value)}
                    className="flex-1 border rounded-lg px-3 py-2"
                    placeholder="Deliverable item"
                  />
                  <button
                    type="button"
                    onClick={() => removeDeliverable(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addDeliverable}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
              >
                <Plus size={16} />
                Tambah Deliverable
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Catatan</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                rows={2}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                {milestone ? 'Update' : 'Tambah'}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const handleSaveMilestone = (milestoneData) => {
    if (editingMilestone) {
      setMilestones(items => items.map(item => 
        item.id === editingMilestone.id ? milestoneData : item
      ));
      setEditingMilestone(null);
    } else {
      setMilestones(items => [...items, milestoneData]);
      setShowAddForm(false);
    }
  };

  const handleDeleteMilestone = (milestoneId) => {
    deleteMilestone(milestoneId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">Project Milestones</h3>
          <p className="text-gray-600">Kelola tonggak pencapaian proyek</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={16} />
          Tambah Milestone
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <Target size={20} />
            <span className="font-medium">Total Milestone</span>
          </div>
          <div className="text-2xl font-bold text-blue-700">{stats.total}</div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <CheckCircle size={20} />
            <span className="font-medium">Selesai</span>
          </div>
          <div className="text-2xl font-bold text-green-700">
            {stats.completed} ({stats.completionRate.toFixed(0)}%)
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-600 mb-2">
            <Clock size={20} />
            <span className="font-medium">Berlangsung</span>
          </div>
          <div className="text-2xl font-bold text-yellow-700">{stats.inProgress}</div>
        </div>

        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-red-600 mb-2">
            <AlertCircle size={20} />
            <span className="font-medium">Terlambat</span>
          </div>
          <div className="text-2xl font-bold text-red-700">{stats.overdue}</div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-white rounded-lg border p-6">
        <h4 className="font-semibold mb-4">Progress Overview</h4>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Progress Keseluruhan</span>
              <span>{stats.progressWeighted.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${stats.progressWeighted}%` }}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div>
              <span className="text-sm text-gray-600">Total Budget Milestone</span>
              <div className="text-lg font-semibold">{formatCurrency(stats.totalBudget)}</div>
            </div>
            <div>
              <span className="text-sm text-gray-600">Actual Cost</span>
              <div className="text-lg font-semibold">{formatCurrency(stats.totalActualCost)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Milestones Timeline */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="p-4 border-b">
          <h4 className="font-semibold">Timeline Milestone</h4>
        </div>
        
        <div className="divide-y divide-gray-200">
          {milestones.map((milestone, index) => {
            const statusInfo = getStatusInfo(isOverdue(milestone) ? 'overdue' : milestone.status);
            const Icon = statusInfo.icon;
            
            return (
              <div key={milestone.id} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full bg-${statusInfo.color}-100 flex items-center justify-center`}>
                      <Icon size={20} className={`text-${statusInfo.color}-600`} />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="text-lg font-semibold text-gray-900">
                          {milestone.name}
                        </h5>
                        <p className="text-gray-600 mt-1">{milestone.description}</p>
                        
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            Target: {formatDate(milestone.targetDate)}
                          </div>
                          {milestone.actualDate && (
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              Actual: {formatDate(milestone.actualDate)}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <DollarSign size={14} />
                            Budget: {formatCurrency(milestone.budget)}
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span>Progress</span>
                            <span>{milestone.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`bg-${statusInfo.color}-600 h-2 rounded-full transition-all duration-300`}
                              style={{ width: `${milestone.progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Deliverables */}
                        {milestone.deliverables && milestone.deliverables.length > 0 && (
                          <div className="mt-4">
                            <h6 className="text-sm font-medium text-gray-900 mb-2">Deliverables:</h6>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {milestone.deliverables.map((deliverable, i) => (
                                <li key={i} className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                                  {deliverable}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {milestone.notes && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">{milestone.notes}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium bg-${statusInfo.color}-100 text-${statusInfo.color}-800`}>
                          {statusInfo.text}
                        </span>
                        <button
                          onClick={() => setEditingMilestone(milestone)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteMilestone(milestone.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Progress Update */}
                    {milestone.status !== 'completed' && (
                      <div className="mt-4 flex items-center gap-2">
                        <label className="text-sm font-medium">Update Progress:</label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={milestone.progress}
                          onChange={(e) => updateMilestoneProgress(milestone.id, parseInt(e.target.value))}
                          className="flex-1 max-w-xs"
                        />
                        <span className="text-sm font-mono w-12">{milestone.progress}%</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Connection Line */}
                {index < milestones.length - 1 && (
                  <div className="ml-5 mt-4 h-8 w-0.5 bg-gray-200" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Forms */}
      {showAddForm && (
        <MilestoneForm
          onSave={handleSaveMilestone}
          onCancel={() => setShowAddForm(false)}
        />
      )}
      
      {editingMilestone && (
        <MilestoneForm
          milestone={editingMilestone}
          onSave={handleSaveMilestone}
          onCancel={() => setEditingMilestone(null)}
        />
      )}
    </div>
  );
};

export default ProjectMilestones;
