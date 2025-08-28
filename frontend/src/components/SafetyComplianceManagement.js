import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from './DataStates';
import { Card, DataCard } from './DataStates';

function SafetyComplianceManagement() {
  const [safetyIncidents, setSafetyIncidents] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newIncident, setNewIncident] = useState({
    id: '',
    date: new Date().toISOString().split('T')[0],
    reportedBy: '',
    involvedEmployees: [],
    incidentType: 'workplace_injury',
    severity: 'low',
    location: '',
    description: '',
    immediateActions: '',
    preventiveActions: '',
    status: 'under_investigation',
    investigationReport: '',
    closureDate: ''
  });

  const fetchSafetyIncidents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/manpower/safety-incidents', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          status: statusFilter !== 'all' ? statusFilter : undefined,
          severity: severityFilter !== 'all' ? severityFilter : undefined
        }
      });
      setSafetyIncidents(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching safety incidents:', error);
      setError('Failed to fetch safety incidents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSafetyIncidents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, severityFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const incidentData = {
        ...newIncident,
        id: `INC-${Date.now()}`,
        reportDate: new Date().toISOString()
      };

      await axios.post('http://localhost:5001/api/manpower/safety-incidents', incidentData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setShowForm(false);
      setNewIncident({
        id: '',
        date: new Date().toISOString().split('T')[0],
        reportedBy: '',
        involvedEmployees: [],
        incidentType: 'workplace_injury',
        severity: 'low',
        location: '',
        description: '',
        immediateActions: '',
        preventiveActions: '',
        status: 'under_investigation',
        investigationReport: '',
        closureDate: ''
      });
      fetchSafetyIncidents();
    } catch (error) {
      console.error('Error creating safety incident:', error);
      setError('Failed to create safety incident');
    }
  };

  const getIncidentTypeLabel = (type) => {
    const types = {
      workplace_injury: 'Workplace Injury',
      near_miss: 'Near Miss',
      equipment_damage: 'Equipment Damage',
      environmental: 'Environmental',
      security: 'Security',
      other: 'Other'
    };
    return types[type] || type;
  };

  const getSeverityColor = (severity) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800',
      critical: 'bg-red-600 text-white'
    };
    return colors[severity] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    const colors = {
      under_investigation: 'bg-blue-100 text-blue-800',
      pending_action: 'bg-orange-100 text-orange-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // Calculate statistics
  const totalIncidents = safetyIncidents.length;
  const openIncidents = safetyIncidents.filter(incident => 
    ['under_investigation', 'pending_action'].includes(incident.status)
  ).length;
  const criticalIncidents = safetyIncidents.filter(incident => 
    incident.severity === 'critical'
  ).length;
  const thisMonthIncidents = safetyIncidents.filter(incident => {
    const incidentDate = new Date(incident.date);
    const now = new Date();
    return incidentDate.getMonth() === now.getMonth() && 
           incidentDate.getFullYear() === now.getFullYear();
  }).length;

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
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
            onClick={fetchSafetyIncidents}
            className="mt-2 bg-red-600 text-white hover:bg-red-700"
          >
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
          <h1 className="text-2xl font-bold text-gray-900">Safety Compliance Management</h1>
          <p className="text-gray-600">Track and manage workplace safety incidents</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          Report Incident
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <DataCard
          title="Total Incidents"
          value={totalIncidents}
          icon="📊"
          color="bg-blue-50 border-blue-200"
        />
        <DataCard
          title="Open Cases"
          value={openIncidents}
          icon="⚠️"
          color="bg-orange-50 border-orange-200"
        />
        <DataCard
          title="Critical Incidents"
          value={criticalIncidents}
          icon="🚨"
          color="bg-red-50 border-red-200"
        />
        <DataCard
          title="This Month"
          value={thisMonthIncidents}
          icon="📅"
          color="bg-green-50 border-green-200"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="under_investigation">Under Investigation</option>
            <option value="pending_action">Pending Action</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Severity:</label>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Severity</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      {/* Incidents List */}
      <div className="space-y-4">
        {safetyIncidents.length === 0 ? (
          <Card className="text-center py-8">
            <p className="text-gray-500">No safety incidents found</p>
          </Card>
        ) : (
          safetyIncidents.map((incident) => (
            <Card key={incident.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {incident.id}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Reported on {new Date(incident.date).toLocaleDateString('id-ID')}
                    {incident.reportedBy && ` by ${incident.reportedBy}`}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(incident.severity)}`}>
                    {incident.severity.toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(incident.status)}`}>
                    {incident.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Type:</p>
                  <p className="text-sm text-gray-600">{getIncidentTypeLabel(incident.incidentType)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Location:</p>
                  <p className="text-sm text-gray-600">{incident.location}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-1">Description:</p>
                <p className="text-sm text-gray-600">{incident.description}</p>
              </div>

              {incident.involvedEmployees?.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">Involved Employees:</p>
                  <div className="flex flex-wrap gap-1">
                    {incident.involvedEmployees.map((empId, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {empId}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {incident.immediateActions && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">Immediate Actions:</p>
                  <p className="text-sm text-gray-600">{incident.immediateActions}</p>
                </div>
              )}

              {incident.preventiveActions && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">Preventive Actions:</p>
                  <p className="text-sm text-gray-600">{incident.preventiveActions}</p>
                </div>
              )}

              {incident.investigationReport && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">Investigation Report:</p>
                  <p className="text-sm text-gray-600">{incident.investigationReport}</p>
                </div>
              )}

              {incident.closureDate && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Closed on:</p>
                  <p className="text-sm text-gray-600">
                    {new Date(incident.closureDate).toLocaleDateString('id-ID')}
                  </p>
                </div>
              )}
            </Card>
          ))
        )}
      </div>

      {/* New Incident Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Report Safety Incident</h2>
                <Button
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Incident Date *
                    </label>
                    <input
                      type="date"
                      value={newIncident.date}
                      onChange={(e) => setNewIncident(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reported By
                    </label>
                    <input
                      type="text"
                      value={newIncident.reportedBy}
                      onChange={(e) => setNewIncident(prev => ({ ...prev, reportedBy: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Reporter name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Incident Type *
                    </label>
                    <select
                      value={newIncident.incidentType}
                      onChange={(e) => setNewIncident(prev => ({ ...prev, incidentType: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="workplace_injury">Workplace Injury</option>
                      <option value="near_miss">Near Miss</option>
                      <option value="equipment_damage">Equipment Damage</option>
                      <option value="environmental">Environmental</option>
                      <option value="security">Security</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Severity *
                    </label>
                    <select
                      value={newIncident.severity}
                      onChange={(e) => setNewIncident(prev => ({ ...prev, severity: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={newIncident.location}
                    onChange={(e) => setNewIncident(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Incident location"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={newIncident.description}
                    onChange={(e) => setNewIncident(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Detailed description of the incident"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Immediate Actions Taken
                  </label>
                  <textarea
                    value={newIncident.immediateActions}
                    onChange={(e) => setNewIncident(prev => ({ ...prev, immediateActions: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={2}
                    placeholder="Actions taken immediately after the incident"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preventive Actions
                  </label>
                  <textarea
                    value={newIncident.preventiveActions}
                    onChange={(e) => setNewIncident(prev => ({ ...prev, preventiveActions: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={2}
                    placeholder="Actions to prevent similar incidents"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Report Incident
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SafetyComplianceManagement;
