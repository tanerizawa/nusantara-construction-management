import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  Plus, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Send,
  Edit,
  Trash2,
  Download,
  Upload
} from 'lucide-react';

const ProjectRABWorkflow = ({ projectId, project, onDataChange }) => {
  const [rabItems, setRABItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState(null);

  useEffect(() => {
    fetchRABData();
  }, [projectId]);

  const fetchRABData = async () => {
    try {
      setLoading(true);
      
      // Fetch RAB items and approval status
      const [rabResponse, approvalResponse] = await Promise.allSettled([
        fetch(`/api/projects/${projectId}/rab`),
        fetch(`/api/approval/rab/${projectId}/status`)
      ]);

      if (rabResponse.status === 'fulfilled') {
        const rabData = await rabResponse.value.json();
        setRABItems(rabData.data || []);
      }

      if (approvalResponse.status === 'fulfilled') {
        const approvalData = await approvalResponse.value.json();
        setApprovalStatus(approvalData.data);
      }

    } catch (error) {
      console.error('Error fetching RAB data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForApproval = async () => {
    try {
      const response = await fetch(`/api/approval/rab/${projectId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        await fetchRABData();
        if (onDataChange) onDataChange();
        alert('RAB berhasil disubmit untuk approval');
      }
    } catch (error) {
      console.error('Error submitting RAB:', error);
      alert('Gagal submit RAB untuk approval');
    }
  };

  const calculateTotal = () => {
    return rabItems.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">RAB Management</h2>
          <p className="text-gray-600">Rencana Anggaran Biaya untuk {project.name}</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Approval Status Indicator */}
          {approvalStatus && (
            <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              approvalStatus.status === 'approved' ? 'bg-green-100 text-green-800' :
              approvalStatus.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              approvalStatus.status === 'rejected' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {approvalStatus.status === 'approved' && <CheckCircle className="h-4 w-4 mr-1" />}
              {approvalStatus.status === 'pending' && <Clock className="h-4 w-4 mr-1" />}
              {approvalStatus.status === 'rejected' && <AlertTriangle className="h-4 w-4 mr-1" />}
              {approvalStatus.status === 'approved' ? 'Disetujui' :
               approvalStatus.status === 'pending' ? 'Menunggu Approval' :
               approvalStatus.status === 'rejected' ? 'Ditolak' : 'Draft'}
            </div>
          )}

          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah Item RAB
          </button>
        </div>
      </div>

      {/* RAB Summary Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{rabItems.length}</div>
            <div className="text-sm text-gray-600">Total Items</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{formatCurrency(calculateTotal())}</div>
            <div className="text-sm text-gray-600">Total RAB</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {approvalStatus?.currentStep || '-'}
            </div>
            <div className="text-sm text-gray-600">Current Step</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {approvalStatus?.progress || '0'}%
            </div>
            <div className="text-sm text-gray-600">Approval Progress</div>
          </div>
        </div>
      </div>

      {/* RAB Items Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Daftar Item RAB</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deskripsi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Satuan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Harga Satuan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rabItems.map((item, index) => (
                <tr key={item.id || index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.category}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {item.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.unit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(item.quantity * item.unitPrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      item.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.isApproved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {rabItems.length === 0 && (
          <div className="text-center py-12">
            <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada item RAB</h3>
            <p className="text-gray-600 mb-4">Mulai dengan menambahkan item RAB pertama</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Tambah Item RAB
            </button>
          </div>
        )}
      </div>

      {/* Workflow Actions */}
      {rabItems.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Workflow Actions</h3>
          <div className="flex items-center space-x-4">
            {!approvalStatus?.submitted && (
              <button
                onClick={handleSubmitForApproval}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Send className="h-4 w-4 mr-2" />
                Submit untuk Approval
              </button>
            )}
            
            <button className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
              <Download className="h-4 w-4 mr-2" />
              Export RAB
            </button>

            <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              <FileText className="h-4 w-4 mr-2" />
              Generate BOQ
            </button>
          </div>
        </div>
      )}

      {/* Approval Timeline */}
      {approvalStatus?.timeline && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Approval Timeline</h3>
          <div className="space-y-4">
            {approvalStatus.timeline.map((step, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className={`flex-shrink-0 w-4 h-4 rounded-full mt-1 ${
                  step.completed ? 'bg-green-500' : 
                  step.active ? 'bg-blue-500' : 'bg-gray-300'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{step.stepName}</p>
                    <p className="text-sm text-gray-500">{step.date}</p>
                  </div>
                  {step.approver && (
                    <p className="text-sm text-gray-600">by {step.approver}</p>
                  )}
                  {step.comments && (
                    <p className="text-sm text-gray-600 mt-1">{step.comments}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectRABWorkflow;
