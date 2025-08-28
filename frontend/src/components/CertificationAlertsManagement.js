import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from './DataStates';
import { Card, DataCard } from './DataStates';

function CertificationAlertsManagement() {
  const [certificationAlerts, setCertificationAlerts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [newAlert, setNewAlert] = useState({
    employeeId: '',
    certificationType: '',
    currentExpiryDate: '',
    alertDate: '',
    priority: 'medium',
    status: 'active',
    remindersSent: 0,
    renewalDeadline: '',
    renewalStatus: 'pending',
    notes: '',
    renewalCost: '',
    issuingAuthority: ''
  });

  const fetchCertificationAlerts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/manpower/certification-alerts', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          priority: priorityFilter !== 'all' ? priorityFilter : undefined,
          status: statusFilter !== 'all' ? statusFilter : undefined
        }
      });
      setCertificationAlerts(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching certification alerts:', error);
      setError('Failed to fetch certification alerts');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/manpower', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  useEffect(() => {
    fetchCertificationAlerts();
    fetchEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priorityFilter, statusFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const alertData = {
        ...newAlert,
        id: selectedAlert ? selectedAlert.id : `CERT-${Date.now()}`,
        createdDate: selectedAlert ? selectedAlert.createdDate : new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };

      if (selectedAlert) {
        await axios.put(`http://localhost:5001/api/manpower/certification-alerts/${selectedAlert.id}`, alertData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('http://localhost:5001/api/manpower/certification-alerts', alertData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      setShowForm(false);
      setSelectedAlert(null);
      resetForm();
      fetchCertificationAlerts();
    } catch (error) {
      console.error('Error saving certification alert:', error);
      setError('Failed to save certification alert');
    }
  };

  const resetForm = () => {
    setNewAlert({
      employeeId: '',
      certificationType: '',
      currentExpiryDate: '',
      alertDate: '',
      priority: 'medium',
      status: 'active',
      remindersSent: 0,
      renewalDeadline: '',
      renewalStatus: 'pending',
      notes: '',
      renewalCost: '',
      issuingAuthority: ''
    });
  };

  const editAlert = (alert) => {
    setSelectedAlert(alert);
    setNewAlert(alert);
    setShowForm(true);
  };

  const sendReminder = async (alertId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5001/api/manpower/certification-alerts/${alertId}/send-reminder`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCertificationAlerts();
    } catch (error) {
      console.error('Error sending reminder:', error);
      setError('Failed to send reminder');
    }
  };

  const markAsRenewed = async (alertId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5001/api/manpower/certification-alerts/${alertId}`, {
        renewalStatus: 'completed',
        status: 'resolved',
        lastUpdated: new Date().toISOString()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCertificationAlerts();
    } catch (error) {
      console.error('Error updating alert status:', error);
      setError('Failed to update alert status');
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
      expired: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getRenewalStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getEmployeeName = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? employee.name : employeeId;
  };

  const getDaysUntilExpiry = (expiryDate) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUrgencyIndicator = (daysUntilExpiry) => {
    if (daysUntilExpiry < 0) return { text: 'EXPIRED', color: 'text-red-600' };
    if (daysUntilExpiry <= 7) return { text: `${daysUntilExpiry} days`, color: 'text-red-600' };
    if (daysUntilExpiry <= 30) return { text: `${daysUntilExpiry} days`, color: 'text-orange-600' };
    if (daysUntilExpiry <= 90) return { text: `${daysUntilExpiry} days`, color: 'text-yellow-600' };
    return { text: `${daysUntilExpiry} days`, color: 'text-green-600' };
  };

  // Calculate statistics
  const totalAlerts = certificationAlerts.length;
  const activeAlerts = certificationAlerts.filter(alert => alert.status === 'active').length;
  const criticalAlerts = certificationAlerts.filter(alert => alert.priority === 'critical').length;
  const expiredCerts = certificationAlerts.filter(alert => {
    const daysUntilExpiry = getDaysUntilExpiry(alert.currentExpiryDate);
    return daysUntilExpiry < 0;
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
            onClick={fetchCertificationAlerts}
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
          <h1 className="text-2xl font-bold text-gray-900">Certification Alerts Management</h1>
          <p className="text-gray-600">Monitor and manage certification expiry notifications</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          Add Alert
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <DataCard
          title="Total Alerts"
          value={totalAlerts}
          icon="🔔"
          color="bg-blue-50 border-blue-200"
        />
        <DataCard
          title="Active Alerts"
          value={activeAlerts}
          icon="⚠️"
          color="bg-yellow-50 border-yellow-200"
        />
        <DataCard
          title="Critical"
          value={criticalAlerts}
          icon="🚨"
          color="bg-red-50 border-red-200"
        />
        <DataCard
          title="Expired"
          value={expiredCerts}
          icon="❌"
          color="bg-gray-50 border-gray-200"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Priority:</label>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {certificationAlerts.length === 0 ? (
          <Card className="text-center py-8">
            <p className="text-gray-500">No certification alerts found</p>
          </Card>
        ) : (
          certificationAlerts.map((alert) => {
            const daysUntilExpiry = getDaysUntilExpiry(alert.currentExpiryDate);
            const urgency = getUrgencyIndicator(daysUntilExpiry);
            
            return (
              <Card key={alert.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {getEmployeeName(alert.employeeId)}
                    </h3>
                    <p className="text-sm text-gray-600">{alert.certificationType}</p>
                    <p className="text-sm text-gray-600">
                      Issued by: {alert.issuingAuthority}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(alert.priority)}`}>
                      {alert.priority.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(alert.status)}`}>
                      {alert.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Current Expiry Date:</p>
                    <p className="text-sm text-gray-600">
                      {new Date(alert.currentExpiryDate).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Days Until Expiry:</p>
                    <p className={`text-sm font-semibold ${urgency.color}`}>
                      {urgency.text}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Renewal Status:</p>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getRenewalStatusColor(alert.renewalStatus)}`}>
                      {alert.renewalStatus.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>

                {alert.renewalDeadline && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Renewal Deadline:</p>
                      <p className="text-sm text-gray-600">
                        {new Date(alert.renewalDeadline).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    {alert.renewalCost && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Renewal Cost:</p>
                        <p className="text-sm text-gray-600">
                          Rp {parseFloat(alert.renewalCost).toLocaleString('id-ID')}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700">Reminders Sent:</p>
                  <p className="text-sm text-gray-600">{alert.remindersSent} times</p>
                </div>

                {alert.notes && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">Notes:</p>
                    <p className="text-sm text-gray-600">{alert.notes}</p>
                  </div>
                )}

                <div className="flex justify-end space-x-2">
                  {alert.status === 'active' && (
                    <>
                      <Button
                        onClick={() => sendReminder(alert.id)}
                        className="px-3 py-1 text-sm bg-orange-600 text-white hover:bg-orange-700"
                      >
                        Send Reminder
                      </Button>
                      <Button
                        onClick={() => markAsRenewed(alert.id)}
                        className="px-3 py-1 text-sm bg-green-600 text-white hover:bg-green-700"
                      >
                        Mark as Renewed
                      </Button>
                    </>
                  )}
                  <Button
                    onClick={() => editAlert(alert)}
                    className="px-3 py-1 text-sm bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Edit
                  </Button>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Alert Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedAlert ? 'Edit Certification Alert' : 'Add Certification Alert'}
                </h2>
                <Button
                  onClick={() => {
                    setShowForm(false);
                    setSelectedAlert(null);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Employee *
                    </label>
                    <select
                      value={newAlert.employeeId}
                      onChange={(e) => setNewAlert(prev => ({ ...prev, employeeId: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Employee</option>
                      {employees.map(employee => (
                        <option key={employee.id} value={employee.id}>
                          {employee.name} - {employee.position}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Certification Type *
                    </label>
                    <input
                      type="text"
                      value={newAlert.certificationType}
                      onChange={(e) => setNewAlert(prev => ({ ...prev, certificationType: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Safety Training Certificate"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Expiry Date *
                    </label>
                    <input
                      type="date"
                      value={newAlert.currentExpiryDate}
                      onChange={(e) => setNewAlert(prev => ({ ...prev, currentExpiryDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alert Date
                    </label>
                    <input
                      type="date"
                      value={newAlert.alertDate}
                      onChange={(e) => setNewAlert(prev => ({ ...prev, alertDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority *
                    </label>
                    <select
                      value={newAlert.priority}
                      onChange={(e) => setNewAlert(prev => ({ ...prev, priority: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={newAlert.status}
                      onChange={(e) => setNewAlert(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="resolved">Resolved</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Issuing Authority
                  </label>
                  <input
                    type="text"
                    value={newAlert.issuingAuthority}
                    onChange={(e) => setNewAlert(prev => ({ ...prev, issuingAuthority: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Organization that issued the certificate"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Renewal Deadline
                    </label>
                    <input
                      type="date"
                      value={newAlert.renewalDeadline}
                      onChange={(e) => setNewAlert(prev => ({ ...prev, renewalDeadline: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Renewal Cost
                    </label>
                    <input
                      type="number"
                      value={newAlert.renewalCost}
                      onChange={(e) => setNewAlert(prev => ({ ...prev, renewalCost: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Cost in IDR"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Renewal Status
                  </label>
                  <select
                    value={newAlert.renewalStatus}
                    onChange={(e) => setNewAlert(prev => ({ ...prev, renewalStatus: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={newAlert.notes}
                    onChange={(e) => setNewAlert(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Additional notes about the certification or renewal process"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setSelectedAlert(null);
                      resetForm();
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
                  >
                    {selectedAlert ? 'Update Alert' : 'Create Alert'}
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

export default CertificationAlertsManagement;
