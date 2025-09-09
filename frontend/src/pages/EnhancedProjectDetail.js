import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { projectAPI } from '../services/api';
import BudgetRAB from '../components/BudgetRAB';
import ProjectMilestones from '../components/ProjectMilestones';
import ProjectTeam from '../components/ProjectTeam';
import ProjectDocuments from '../components/ProjectDocuments';

// Import integrated workflow components
import { 
  ProjectRABWorkflow,
  ProjectPurchaseOrders,
  ProjectApprovalStatus,
  ProjectBudgetMonitoring,
  ProjectWorkflowSidebar
} from '../components/workflow';

import { 
  ArrowLeft, 
  Edit, 
  Printer, 
  Calendar, 
  DollarSign, 
  Building, 
  Users, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Activity,
  Upload,
  MapPin as Location,
  RefreshCw,
  Share2,
  Clock,
  Calculator,
  ShoppingCart,
  TrendingUp,
  ClipboardCheck,
  PlayCircle,
  BarChart3
} from 'lucide-react';

// Enhanced utility functions
const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return 'Rp 0';
  const numericAmount = parseFloat(amount);
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numericAmount);
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State management
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Enhanced state for integrated workflow
  const [workflowData, setWorkflowData] = useState({
    rabStatus: null,
    approvalStatus: null,
    purchaseOrders: [],
    budgetSummary: null,
    currentStage: 'planning'
  });

  // Enhanced tab configuration with workflow integration
  const tabConfig = useMemo(() => [
    {
      id: 'overview',
      label: 'Ringkasan Proyek',
      icon: Building,
      description: 'Informasi umum dan status proyek'
    },
    {
      id: 'rab-workflow',
      label: 'RAB & BOQ',
      icon: Calculator,
      description: 'Rencana Anggaran Biaya dan Bill of Quantity',
      badge: workflowData.rabStatus?.pendingApproval || 0
    },
    {
      id: 'approval-status',
      label: 'Status Approval',
      icon: CheckCircle,
      description: 'Tracking dan manajemen approval workflow',
      badge: workflowData.approvalStatus?.pending || 0
    },
    {
      id: 'purchase-orders',
      label: 'Purchase Orders',
      icon: ShoppingCart,
      description: 'Manajemen Purchase Order dan procurement',
      badge: workflowData.purchaseOrders?.filter(po => po.status === 'pending').length || 0
    },
    {
      id: 'budget-monitoring',
      label: 'Budget Monitoring',
      icon: BarChart3,
      description: 'Real-time budget tracking dan cost control'
    },
    {
      id: 'team',
      label: 'Tim Proyek',
      icon: Users,
      description: 'Manajemen tim dan manpower'
    },
    {
      id: 'documents',
      label: 'Dokumen',
      icon: FileText,
      description: 'File dan dokumen proyek'
    },
    {
      id: 'milestones',
      label: 'Milestone',
      icon: Calendar,
      description: 'Timeline dan pencapaian proyek'
    }
  ], [workflowData]);

  // Fetch project data with workflow information
  const fetchProject = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      // Fetch project data
      const projectResponse = await projectAPI.getProject(id);
      setProject(projectResponse.data);

      // Mock workflow data for now - replace with actual API calls when backend is ready
      const mockWorkflowData = {
        rabStatus: {
          pendingApproval: 0,
          data: []
        },
        approvalStatus: {
          pending: 0,
          data: []
        },
        purchaseOrders: [],
        budgetSummary: {
          totalBudget: projectResponse.data.totalBudget || 0,
          approvedAmount: 0,
          committedAmount: 0,
          actualSpent: 0
        },
        currentStage: 'planning'
      };

      setWorkflowData(mockWorkflowData);

    } catch (err) {
      console.error('Error fetching project:', err);
      setError('Gagal memuat detail proyek');
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Enhanced status indicator with workflow awareness
  const getProjectStatusDetails = useMemo(() => {
    if (!project) return { color: 'gray', label: 'Unknown', description: '' };

    const stage = workflowData.currentStage;
    const statusMap = {
      'planning': { 
        color: 'blue', 
        label: 'Perencanaan', 
        description: 'Sedang menyusun RAB dan rencana kerja',
        icon: PlayCircle
      },
      'rab-approval': { 
        color: 'yellow', 
        label: 'Menunggu Persetujuan RAB', 
        description: 'RAB sedang dalam proses approval',
        icon: Clock
      },
      'procurement-planning': { 
        color: 'orange', 
        label: 'Perencanaan Pengadaan', 
        description: 'Menyiapkan purchase orders',
        icon: ShoppingCart
      },
      'po-approval': { 
        color: 'purple', 
        label: 'Approval PO', 
        description: 'Purchase orders menunggu persetujuan',
        icon: ClipboardCheck
      },
      'execution': { 
        color: 'green', 
        label: 'Eksekusi', 
        description: 'Proyek sedang berjalan',
        icon: Activity
      },
      'completion': { 
        color: 'gray', 
        label: 'Selesai', 
        description: 'Proyek telah diselesaikan',
        icon: CheckCircle
      }
    };

    return statusMap[stage] || statusMap['planning'];
  }, [project, workflowData.currentStage]);

  // Action handlers
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handleRefreshProject = async () => {
    await fetchProject(true);
  };

  // Effect hooks
  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id, fetchProject]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-gray-600">Memuat detail proyek...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => fetchProject()}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  // Not found state
  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Proyek Tidak Ditemukan</h2>
          <p className="text-gray-600 mb-4">Proyek dengan ID {id} tidak ditemukan.</p>
          <Link
            to="/projects"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Kembali ke Daftar Proyek
          </Link>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Workflow Sidebar */}
      <ProjectWorkflowSidebar 
        projectId={id}
        project={project} 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onActionTrigger={(actionType) => {
          switch(actionType) {
            case 'create-rab':
              setActiveTab('rab-workflow');
              break;
            case 'create-po':
              setActiveTab('purchase-orders');
              break;
            case 'add-approval':
              setActiveTab('approval-status');
              break;
            case 'assign-team':
              setActiveTab('team');
              break;
            default:
              break;
          }
        }}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Enhanced Header with Workflow Status */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/projects"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Kembali ke Proyek
              </Link>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
                <div className="flex items-center space-x-4 mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    getProjectStatusDetails.color === 'green' ? 'bg-green-100 text-green-800' :
                    getProjectStatusDetails.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                    getProjectStatusDetails.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                    getProjectStatusDetails.color === 'red' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {getProjectStatusDetails.label}
                  </span>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Location className="h-4 w-4 mr-1" />
                    {project.location}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(project.startDate)} - {formatDate(project.endDate)}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefreshProject}
                className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
              
              <button
                onClick={() => window.print()}
                className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </button>
              
              <Link
                to={`/projects/${id}/edit`}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Proyek
              </Link>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="h-full overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <ProjectOverview project={project} workflowData={workflowData} />
          )}
          
          {activeTab === 'rab-workflow' && (
            <ProjectRABWorkflow projectId={id} project={project} onDataChange={fetchProject} />
          )}
          
          {activeTab === 'approval-status' && (
            <ProjectApprovalStatus projectId={id} project={project} onDataChange={fetchProject} />
          )}
          
          {activeTab === 'purchase-orders' && (
            <ProjectPurchaseOrders projectId={id} project={project} onDataChange={fetchProject} />
          )}
          
          {activeTab === 'budget-monitoring' && (
            <ProjectBudgetMonitoring projectId={id} project={project} onDataChange={fetchProject} />
          )}
          
          {activeTab === 'milestones' && (
            <ProjectMilestones projectId={id} project={project} onUpdate={fetchProject} />
          )}
          
          {activeTab === 'team' && (
            <ProjectTeam projectId={id} project={project} onUpdate={fetchProject} />
          )}
          
          {activeTab === 'documents' && (
            <ProjectDocuments projectId={id} project={project} onUpdate={fetchProject} />
          )}
        </div>
      </div>
    </div>
  );
};

// Enhanced Project Overview Component
const ProjectOverview = ({ project, workflowData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Project Info Cards */}
      <div className="lg:col-span-2 space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Informasi Proyek</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">Kode Proyek</label>
              <p className="font-medium">{project.id}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Lokasi</label>
              <p className="font-medium">{project.location || '-'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Tanggal Mulai</label>
              <p className="font-medium">{formatDate(project.startDate)}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Target Selesai</label>
              <p className="font-medium">{formatDate(project.endDate)}</p>
            </div>
          </div>
        </div>

        {/* Workflow Progress */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Progress Workflow</h3>
          <WorkflowProgressIndicator workflowData={workflowData} />
        </div>

        {/* Description */}
        {project.description && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Deskripsi Proyek</h3>
            <p className="text-gray-700 leading-relaxed">{project.description}</p>
          </div>
        )}
      </div>

      {/* Sidebar Info */}
      <div className="space-y-6">
        {/* Financial Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Ringkasan Keuangan</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Budget</span>
              <span className="font-medium">{formatCurrency(project.totalBudget)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">RAB Approved</span>
              <span className="font-medium">{formatCurrency(workflowData.budgetSummary?.approvedAmount || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">PO Committed</span>
              <span className="font-medium">{formatCurrency(workflowData.budgetSummary?.committedAmount || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Actual Spent</span>
              <span className="font-medium text-blue-600">{formatCurrency(workflowData.budgetSummary?.actualSpent || 0)}</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Status Cepat</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">RAB Items</span>
              <span className="font-medium">{project.rabItems?.length || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Pending Approvals</span>
              <span className="font-medium text-yellow-600">{workflowData.approvalStatus?.pending || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Active POs</span>
              <span className="font-medium">{workflowData.purchaseOrders?.length || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Team Members</span>
              <span className="font-medium">{project.teamMembers?.length || 0}</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Aktivitas Terbaru</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Proyek dibuat</p>
                <p className="text-xs text-gray-500">{formatDate(project.createdAt)}</p>
              </div>
            </div>
            {project.updatedAt && project.updatedAt !== project.createdAt && (
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Pembaruan terakhir</p>
                  <p className="text-xs text-gray-500">{formatDate(project.updatedAt)}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Workflow Progress Indicator Component
const WorkflowProgressIndicator = ({ workflowData }) => {
  const stages = [
    { id: 'planning', label: 'Perencanaan', completed: true },
    { id: 'rab-approval', label: 'Approval RAB', completed: workflowData.rabStatus?.approved || false },
    { id: 'procurement', label: 'Pengadaan', completed: workflowData.purchaseOrders?.some(po => po.status === 'approved') || false },
    { id: 'execution', label: 'Eksekusi', completed: false },
    { id: 'completion', label: 'Selesai', completed: false }
  ];

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="flex items-center space-x-4">
        {stages.map((stage, index) => (
          <React.Fragment key={stage.id}>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              stage.completed ? 'bg-green-500 text-white' : 
              workflowData.currentStage === stage.id ? 'bg-blue-500 text-white' :
              'bg-gray-300 text-gray-600'
            }`}>
              {stage.completed ? (
                <CheckCircle className="h-6 w-6" />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>
            {index < stages.length - 1 && (
              <div className={`flex-1 h-2 rounded ${
                stage.completed ? 'bg-green-300' : 'bg-gray-300'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Stage labels */}
      <div className="grid grid-cols-5 gap-2 text-center">
        {stages.map((stage) => (
          <div key={stage.id} className="text-xs">
            <p className={`font-medium ${
              stage.completed ? 'text-green-600' :
              workflowData.currentStage === stage.id ? 'text-blue-600' :
              'text-gray-500'
            }`}>
              {stage.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectDetail;
