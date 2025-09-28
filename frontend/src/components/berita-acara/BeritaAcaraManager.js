import React, { useState, useEffect } from 'react';
import {
  FileText,
  Calendar,
  CheckCircle,
  Clock,
  User,
  AlertTriangle,
  DollarSign,
  Upload,
  Eye,
  Edit,
  Trash2,
  Download,
  Camera,
  FileImage,
  Plus
} from 'lucide-react';

const BeritaAcaraManager = ({ projectId, project, activeBA, onBAChange }) => {
  const [baList, setBaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedBA, setSelectedBA] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'form', 'view'

  useEffect(() => {
    fetchBeritaAcaraList();
  }, [projectId]);

  const fetchBeritaAcaraList = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/berita-acara`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBaList(data.data || []);
      } else {
        setError('Failed to load Berita Acara data');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      'draft': { 
        label: 'Draft', 
        color: 'bg-gray-100 text-gray-800',
        icon: FileText,
        description: 'Masih dalam tahap penyusunan'
      },
      'submitted': { 
        label: 'Diajukan', 
        color: 'bg-blue-100 text-blue-800',
        icon: Clock,
        description: 'Menunggu review dari klien'
      },
      'client_review': { 
        label: 'Review Klien', 
        color: 'bg-yellow-100 text-yellow-800',
        icon: User,
        description: 'Sedang direview oleh klien'
      },
      'approved': { 
        label: 'Disetujui', 
        color: 'bg-green-100 text-green-800',
        icon: CheckCircle,
        description: 'BA telah disetujui, siap untuk pembayaran'
      },
      'rejected': { 
        label: 'Ditolak', 
        color: 'bg-red-100 text-red-800',
        icon: AlertTriangle,
        description: 'BA ditolak, perlu revisi'
      }
    };
    return configs[status] || configs.draft;
  };

  const getBATypeConfig = (type) => {
    const types = {
      'partial': { label: 'Sebagian', description: 'BA untuk pekerjaan sebagian' },
      'provisional': { label: 'Sementara', description: 'BA sementara untuk handover awal' },
      'final': { label: 'Final', description: 'BA final untuk serah terima proyek' }
    };
    return types[type] || types.partial;
  };

  const handleCreateBA = () => {
    setSelectedBA(null);
    setViewMode('form');
    setShowCreateForm(true);
  };

  const handleEditBA = (ba) => {
    setSelectedBA(ba);
    setViewMode('form');
    setShowCreateForm(true);
  };

  const handleViewBA = (ba) => {
    setSelectedBA(ba);
    setViewMode('view');
  };

  const handleSubmitBA = async (baId) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/berita-acara/${baId}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          submittedBy: localStorage.getItem('username') || 'current_user'
        })
      });

      if (response.ok) {
        await fetchBeritaAcaraList();
        if (onBAChange) onBAChange();
        alert('Berita Acara berhasil diajukan untuk review!');
      }
    } catch (error) {
      console.error('Error submitting BA:', error);
      alert('Gagal mengajukan Berita Acara');
    }
  };

  const handleDeleteBA = async (baId) => {
    if (!window.confirm('Yakin ingin menghapus Berita Acara ini?')) return;

    try {
      const response = await fetch(`/api/projects/${projectId}/berita-acara/${baId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        await fetchBeritaAcaraList();
        if (onBAChange) onBAChange();
        alert('Berita Acara berhasil dihapus');
      }
    } catch (error) {
      console.error('Error deleting BA:', error);
      alert('Gagal menghapus Berita Acara');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading Berita Acara...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-red-700 font-medium">Error</span>
        </div>
        <p className="text-red-600 text-sm mt-1">{error}</p>
      </div>
    );
  }

  // Render form or view mode
  if (viewMode === 'form') {
    return (
      <BeritaAcaraForm
        projectId={projectId}
        project={project}
        beritaAcara={selectedBA}
        onSave={() => {
          fetchBeritaAcaraList();
          setViewMode('list');
          setShowCreateForm(false);
          if (onBAChange) onBAChange();
        }}
        onCancel={() => {
          setViewMode('list');
          setShowCreateForm(false);
        }}
      />
    );
  }

  if (viewMode === 'view') {
    return (
      <BeritaAcaraViewer
        beritaAcara={selectedBA}
        project={project}
        onEdit={() => {
          setViewMode('form');
        }}
        onBack={() => {
          setViewMode('list');
        }}
      />
    );
  }

  // Main list view
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Berita Acara Management</h3>
          <p className="text-sm text-gray-600 mt-1">
            Kelola Berita Acara untuk milestone dan pembayaran proyek
          </p>
        </div>
        <button
          onClick={handleCreateBA}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Buat BA Baru</span>
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total BA</p>
              <p className="text-2xl font-bold text-gray-900">{baList.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {baList.filter(ba => ['draft', 'submitted', 'client_review'].includes(ba.status)).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Disetujui</p>
              <p className="text-2xl font-bold text-gray-900">
                {baList.filter(ba => ba.status === 'approved').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-emerald-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Siap Bayar</p>
              <p className="text-2xl font-bold text-gray-900">
                {baList.filter(ba => ba.status === 'approved' && ba.paymentAuthorized).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* BA List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-lg font-medium text-gray-900">Daftar Berita Acara</h4>
        </div>
        <div className="divide-y divide-gray-200">
          {baList.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Belum ada Berita Acara yang dibuat</p>
              <button
                onClick={handleCreateBA}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Buat BA Pertama
              </button>
            </div>
          ) : (
            baList.map((ba) => {
              const statusConfig = getStatusConfig(ba.status);
              const typeConfig = getBATypeConfig(ba.baType);
              const StatusIcon = statusConfig.icon;

              return (
                <div key={ba.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h5 className="text-lg font-medium text-gray-900">{ba.baNumber}</h5>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                          {statusConfig.label}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {typeConfig.label}
                        </span>
                      </div>
                      
                      <p className="text-gray-700 mb-2">{ba.workDescription}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(ba.completionDate).toLocaleDateString('id-ID')}
                        </div>
                        <div>
                          Progress: {ba.completionPercentage}%
                        </div>
                        {ba.paymentAmount && (
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />
                            {new Intl.NumberFormat('id-ID', { 
                              style: 'currency', 
                              currency: 'IDR',
                              minimumFractionDigits: 0 
                            }).format(ba.paymentAmount)}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleViewBA(ba)}
                        className="p-2 text-gray-400 hover:text-gray-600"
                        title="View BA"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      {ba.status === 'draft' && (
                        <>
                          <button
                            onClick={() => handleEditBA(ba)}
                            className="p-2 text-gray-400 hover:text-blue-600"
                            title="Edit BA"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleSubmitBA(ba.id)}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                          >
                            Submit
                          </button>
                          <button
                            onClick={() => handleDeleteBA(ba.id)}
                            className="p-2 text-gray-400 hover:text-red-600"
                            title="Delete BA"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      {ba.status === 'approved' && ba.paymentAuthorized && (
                        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                          ✓ Payment Ready
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Additional info for non-draft items */}
                  {ba.status !== 'draft' && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {ba.submittedAt && (
                          <div>
                            <span className="text-gray-500">Diajukan:</span>
                            <span className="ml-2 text-gray-700">
                              {new Date(ba.submittedAt).toLocaleDateString('id-ID')}
                            </span>
                          </div>
                        )}
                        {ba.approvedAt && (
                          <div>
                            <span className="text-gray-500">Disetujui:</span>
                            <span className="ml-2 text-gray-700">
                              {new Date(ba.approvedAt).toLocaleDateString('id-ID')} 
                              {ba.approvedBy && ` oleh ${ba.approvedBy}`}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

// Placeholder components - would be implemented separately
const BeritaAcaraForm = ({ projectId, project, beritaAcara, onSave, onCancel }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">
        {beritaAcara ? 'Edit Berita Acara' : 'Buat Berita Acara Baru'}
      </h3>
      <p className="text-gray-600 mb-4">Form implementation would go here...</p>
      <div className="flex space-x-3">
        <button
          onClick={onSave}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Simpan
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
        >
          Batal
        </button>
      </div>
    </div>
  );
};

const BeritaAcaraViewer = ({ beritaAcara, project, onEdit, onBack }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">View Berita Acara</h3>
      <p className="text-gray-600 mb-4">BA viewer implementation would go here...</p>
      <div className="flex space-x-3">
        <button
          onClick={onEdit}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Edit
        </button>
        <button
          onClick={onBack}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
        >
          Kembali
        </button>
      </div>
    </div>
  );
};

export default BeritaAcaraManager;