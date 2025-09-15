import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectAPI } from '../services/api';
import ProjectMilestones from '../components/ProjectMilestones';
import ProjectTeam from '../components/ProjectTeam';
import ProjectDocuments from '../components/ProjectDocuments';

// Import integrated workflow components
import {
  ProjectRABWorkflow,
  ProjectBudgetMonitoring,
  ProjectWorkflowSidebar,
  ProjectPurchaseOrders,
  ProfessionalApprovalDashboard
} from '../components/workflow';import { 
  Building, 
  Users, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  Calendar, 
  DollarSign, 
  Clock,
  Calculator,
  ShoppingCart,
  BarChart3,
  MapPin as Location,
  Activity,
  PlayCircle
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

// Calculate project stage based on sequential workflow logic
const calculateProjectStage = (projectData) => {
  // Stage 1: Planning - Always start here
  if (!projectData || projectData.status === 'draft' || projectData.status === 'pending') {
    return 'planning';
  }

  // Stage 2: RAB Approval - Only after planning is complete
  const hasRABItems = projectData.rabItems && projectData.rabItems.length > 0;
  const hasApprovedRAB = projectData.rabItems?.some(item => item.status === 'approved');
  
  if (hasRABItems && !hasApprovedRAB) {
    return 'rab-approval';
  }

  // Stage 3: Procurement - Only after RAB is approved
  if (hasApprovedRAB) {
    const hasPurchaseOrders = projectData.purchaseOrders && projectData.purchaseOrders.length > 0;
    const hasApprovedPO = projectData.purchaseOrders?.some(po => po.status === 'approved');
    
    if (!hasPurchaseOrders || !hasApprovedPO) {
      return 'procurement';
    }

    // Stage 4: Execution - Only after procurement is complete
    if (hasApprovedPO && projectData.status === 'active') {
      return 'execution';
    }
  }

  // Stage 5: Completion - Only when project is truly completed
  if (projectData.status === 'completed') {
    return 'completion';
  }

  // Default fallback - if no conditions met, stay in planning
  return 'planning';
};

const ProjectDetail = () => {
  const { id } = useParams();
  
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

      console.log('=== FETCH PROJECT ===');
      console.log('Project ID from params:', id);

      // Fetch project data using correct method name
      const projectResponse = await projectAPI.getById(id);
      console.log('Project API Response:', projectResponse);
      const projectData = projectResponse.data;
      console.log('Project Data:', projectData);
      setProject(projectData);

      // Enhanced workflow data integration - replace with actual API calls when backend is ready
      const enhancedWorkflowData = {
        rabStatus: {
          pendingApproval: projectData.rabItems?.filter(item => item.status === 'pending').length || 0,
          approved: projectData.rabItems?.some(item => item.status === 'approved') || false,
          data: projectData.rabItems || []
        },
        approvalStatus: {
          pending: projectData.pendingApprovals?.length || 0,
          data: projectData.approvalHistory || []
        },
        purchaseOrders: projectData.purchaseOrders || [],
        budgetSummary: {
          totalBudget: parseFloat(projectData.totalBudget) || 0,
          approvedAmount: projectData.rabItems?.reduce((sum, item) => 
            item.status === 'approved' ? sum + (parseFloat(item.amount) || 0) : sum, 0) || 0,
          committedAmount: projectData.purchaseOrders?.reduce((sum, po) => 
            po.status === 'approved' ? sum + (parseFloat(po.amount) || 0) : sum, 0) || 0,
          actualSpent: projectData.actualExpenses?.reduce((sum, expense) => 
            sum + (parseFloat(expense.amount) || 0), 0) || 0
        },
        currentStage: projectData.currentStage || calculateProjectStage(projectData)
      };

      setWorkflowData(enhancedWorkflowData);

    } catch (err) {
      console.error('Error fetching project:', err);
      setError('Gagal memuat detail proyek');
    } finally {
      setLoading(false);
    }
  }, [id]);

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
      {/* Workflow Sidebar - Fixed width */}
      <div className="w-72 flex-shrink-0 border-r border-gray-200 bg-white shadow-sm">
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
      </div>

      {/* Main Content - Constrained width */}
      <div className="flex-1 min-w-0 overflow-hidden">
        {/* Content Area */}
        <div className="h-full overflow-y-auto p-4 md:p-6 max-w-6xl mx-auto">
          {activeTab === 'overview' && project && (
            <ProjectOverview project={project} workflowData={workflowData} />
          )}
          
          {activeTab === 'rab-workflow' && project && (
            <>
              {console.log('=== PROJECT DETAIL RAB TAB RENDERED ===')}
              {console.log('Project ID:', id)}
              {console.log('Project Object:', project)}
              {console.log('Project ID from object:', project?.id)}
              {console.log('Project name:', project?.name)}
              {console.log('RAB Items:', project?.rabItems)}
              <ProjectRABWorkflow projectId={id} project={project} onDataChange={fetchProject} />
            </>
          )}
          
          {activeTab === 'approval-status' && project && (
            <ProfessionalApprovalDashboard projectId={id} project={project} onDataChange={fetchProject} />
          )}
          
          {activeTab === 'purchase-orders' && project && (
            <ProjectPurchaseOrders projectId={id} project={project} onDataChange={fetchProject} />
          )}
          
          {activeTab === 'budget-monitoring' && project && (
            <ProjectBudgetMonitoring projectId={id} project={project} onDataChange={fetchProject} />
          )}
          
          {activeTab === 'milestones' && project && (
            <ProjectMilestones projectId={id} project={project} onUpdate={fetchProject} />
          )}
          
          {activeTab === 'team' && project && (
            <ProjectTeam projectId={id} project={project} onUpdate={fetchProject} />
          )}
          
          {activeTab === 'documents' && project && (
            <ProjectDocuments projectId={id} project={project} onUpdate={fetchProject} />
          )}
        </div>
      </div>
    </div>
  );
};

// Enhanced Project Overview Component with real database integration
const ProjectOverview = ({ project, workflowData }) => {
  // Safety check - if project is null/undefined, show loading or error state
  if (!project) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data proyek...</p>
        </div>
      </div>
    );
  }

  // Calculate budget utilization
  const calculateBudgetUtilization = () => {
    const totalBudget = parseFloat(project?.totalBudget) || 0;
    const actualSpent = parseFloat(workflowData?.budgetSummary?.actualSpent) || 0;
    
    if (totalBudget === 0) return 0;
    return Math.round((actualSpent / totalBudget) * 100);
  };

  const budgetUtilization = calculateBudgetUtilization();

  return (
    <div className="space-y-6">
      {/* Project Stats Cards - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Budget Card */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 md:p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <DollarSign className="h-5 w-5 md:h-6 md:w-6" />
            </div>
            <span className="text-lg md:text-xl font-bold">{budgetUtilization}%</span>
          </div>
          <h3 className="text-sm md:text-base font-medium">Budget Terpakai</h3>
          <p className="text-xs md:text-sm opacity-90 mt-1 truncate">
            {formatCurrency(workflowData.budgetSummary?.actualSpent || 0)}
          </p>
        </div>

        {/* Team Card */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 md:p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <Users className="h-5 w-5 md:h-6 md:w-6" />
            </div>
            <span className="text-2xl md:text-3xl font-bold">{project.teamMembers?.length || 0}</span>
          </div>
          <h3 className="text-sm md:text-base font-medium">Anggota Tim</h3>
          <p className="text-xs md:text-sm opacity-90 mt-1">Tim Aktif</p>
        </div>

        {/* Documents Card */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 md:p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <FileText className="h-5 w-5 md:h-6 md:w-6" />
            </div>
            <span className="text-2xl md:text-3xl font-bold">{project.documents?.length || 0}</span>
          </div>
          <h3 className="text-sm md:text-base font-medium">Dokumen</h3>
          <p className="text-xs md:text-sm opacity-90 mt-1">File Terlampir</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Building className="h-5 w-5 mr-2 text-blue-600" />
                Informasi Proyek
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Nama Proyek</label>
                    <h2 className="text-xl font-bold text-gray-900 break-words word-wrap">
                      {project.name || project.title || 'Nama proyek tidak tersedia'}
                    </h2>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Kode Proyek</label>
                    <p className="text-base font-semibold text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                      {project.code || project.id || '-'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Jenis Proyek</label>
                    <p className="text-base text-gray-900">
                      {project.type || project.category || 'Konstruksi Umum'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Klien</label>
                    <div className="text-base text-gray-900">
                      {(() => {
                        if (typeof project.client === 'object' && project.client) {
                          // Handle object client data
                          if (project.client.company) {
                            return (
                              <div className="space-y-1">
                                <p className="font-medium break-words">{project.client.company}</p>
                                {project.client.pic && (
                                  <p className="text-sm text-gray-600">PIC: {project.client.pic}</p>
                                )}
                                {project.client.email && (
                                  <p className="text-sm text-gray-600">Email: {project.client.email}</p>
                                )}
                                {project.client.phone && (
                                  <p className="text-sm text-gray-600">Telepon: {project.client.phone}</p>
                                )}
                              </div>
                            );
                          } else {
                            return project.client.name || 'Klien tidak diketahui';
                          }
                        }
                        // Handle string client data
                        return project.client || project.clientName || '-';
                      })()}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Lokasi Proyek</label>
                    <div className="flex items-start space-x-2">
                      <Location className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <p className="text-base text-gray-900 break-words word-wrap leading-relaxed">
                        {typeof project.location === 'object' && project.location ? 
                          [
                            project.location.address,
                            project.location.city,
                            project.location.state,
                            project.location.country
                          ].filter(Boolean).join(', ') || 'Lokasi belum ditentukan'
                          : project.location || 'Lokasi belum ditentukan'
                        }
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Durasi Proyek</label>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <p className="text-base text-gray-900">
                        {project.startDate && project.endDate ? (
                          <>
                            {formatDate(project.startDate)} - {formatDate(project.endDate)}
                            <span className="ml-2 text-sm text-gray-500">
                              ({Math.ceil((new Date(project.endDate) - new Date(project.startDate)) / (1000 * 60 * 60 * 24))} hari)
                            </span>
                          </>
                        ) : 'Tanggal belum ditentukan'}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Status Saat Ini</label>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        project.status === 'active' ? 'bg-green-100 text-green-800' :
                        project.status === 'planning' ? 'bg-blue-100 text-blue-800' :
                        project.status === 'on-hold' ? 'bg-yellow-100 text-yellow-800' :
                        project.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {project.status === 'active' ? 'Aktif' :
                         project.status === 'planning' ? 'Perencanaan' :
                         project.status === 'on-hold' ? 'Ditunda' :
                         project.status === 'completed' ? 'Selesai' :
                         'Tidak Diketahui'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Project Description */}
          {project.description && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Deskripsi Proyek</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
                  {project.description}
                </p>
              </div>
            </div>
          )}

          {/* Workflow Stages - Project Flow Route */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                Alur Tahapan Proyek
              </h3>
            </div>
            <div className="p-6">
              <WorkflowStagesCard workflowData={workflowData} project={project} />
            </div>
          </div>
        </div>

        {/* Right Column - Summary Cards */}
        <div className="space-y-6">
          {/* Financial Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-blue-50 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                Ringkasan Keuangan
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">Total Budget</span>
                  <span className="text-lg font-bold text-gray-900">
                    {formatCurrency(project.totalBudget)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">RAB Approved</span>
                  <span className="text-base font-semibold text-blue-700">
                    {formatCurrency(workflowData.budgetSummary?.approvedAmount || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">PO Committed</span>
                  <span className="text-base font-semibold text-yellow-700">
                    {formatCurrency(workflowData.budgetSummary?.committedAmount || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">Actual Spent</span>
                  <span className="text-base font-semibold text-green-700">
                    {formatCurrency(workflowData.budgetSummary?.actualSpent || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
                Statistik Cepat
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calculator className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">RAB Items</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    {project.rabItems?.length || 0}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Clock className="h-4 w-4 text-yellow-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Pending Approvals</span>
                  </div>
                  <span className="text-lg font-bold text-yellow-600">
                    {workflowData.approvalStatus?.pending || 0}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <ShoppingCart className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Active POs</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">
                    {workflowData.purchaseOrders?.filter(po => po.status === 'active').length || 0}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Users className="h-4 w-4 text-purple-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Team Members</span>
                  </div>
                  <span className="text-lg font-bold text-purple-600">
                    {project.teamMembers?.length || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Activity className="h-5 w-5 mr-2 text-blue-600" />
                Aktivitas Terbaru
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">Proyek dibuat</p>
                    <p className="text-xs text-gray-500 truncate">
                      {formatDate(project.createdAt)}
                    </p>
                  </div>
                </div>
                
                {project.updatedAt && project.updatedAt !== project.createdAt && (
                  <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">Pembaruan terakhir</p>
                      <p className="text-xs text-gray-500 truncate">
                        {formatDate(project.updatedAt)}
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Add more recent activities from database if available */}
                {project.recentActivities?.slice(0, 3).map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      activity.type === 'approval' ? 'bg-yellow-500' :
                      activity.type === 'completion' ? 'bg-green-500' :
                      activity.type === 'update' ? 'bg-blue-500' :
                      'bg-gray-500'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500">Tidak ada aktivitas terbaru</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Workflow Stages Card Component (without progress indicators)
const WorkflowStagesCard = ({ workflowData, project }) => {
  // Calculate stages based on real project data with proper sequential logic
  const getStageStatus = () => {
    // Stage completion must follow sequential order
    const planning_completed = project.status !== 'draft' && project.status !== 'pending';
    
    const rabItems_exist = project.rabItems && project.rabItems.length > 0;
    const rab_approved = rabItems_exist && workflowData.rabStatus?.approved;
    const rab_completed = planning_completed && rab_approved;
    
    const po_exist = workflowData.purchaseOrders && workflowData.purchaseOrders.length > 0;
    const po_approved = workflowData.purchaseOrders?.some(po => po.status === 'approved');
    const procurement_completed = rab_completed && po_approved;
    
    const execution_completed = procurement_completed && (project.status === 'active' || project.status === 'completed');
    const completion_completed = execution_completed && project.status === 'completed';

    const stages = [
      { 
        id: 'planning', 
        label: 'Perencanaan', 
        completed: planning_completed,
        icon: PlayCircle,
        description: 'Setup awal proyek dan persiapan dokumen'
      },
      { 
        id: 'rab-approval', 
        label: 'Approval RAB', 
        completed: rab_completed,
        icon: Calculator,
        description: 'Persetujuan Rencana Anggaran Biaya'
      },
      { 
        id: 'procurement', 
        label: 'Pengadaan', 
        completed: procurement_completed,
        icon: ShoppingCart,
        description: 'Proses pembelian dan pengadaan material'
      },
      { 
        id: 'execution', 
        label: 'Eksekusi', 
        completed: execution_completed,
        icon: Activity,
        description: 'Pelaksanaan pekerjaan konstruksi'
      },
      { 
        id: 'completion', 
        label: 'Selesai', 
        completed: completion_completed,
        icon: CheckCircle,
        description: 'Penyelesaian dan serah terima proyek'
      }
    ];

    return stages;
  };

  const stages = getStageStatus();
  const currentStageIndex = stages.findIndex(stage => 
    !stage.completed && (workflowData.currentStage === stage.id || 
    (workflowData.currentStage === 'planning' && stage.id === 'planning'))
  );

  return (
    <div className="space-y-4">
      {/* Progress Line */}
      <div className="relative">
        {/* Background line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        
        {/* Stages */}
        <div className="space-y-6">
          {stages.map((stage, index) => {
            const IconComponent = stage.icon;
            const isActive = currentStageIndex === index;
            const isCompleted = stage.completed;
            
            return (
              <div key={stage.id} className="relative flex items-start">
                {/* Stage Indicator */}
                <div className={`
                  relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-4 transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-green-500 border-green-200 text-white shadow-lg' 
                      : isActive 
                      ? 'bg-blue-500 border-blue-200 text-white shadow-lg' 
                      : 'bg-white border-gray-300 text-gray-400'
                  }
                `}>
                  {isCompleted ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <IconComponent className="h-6 w-6" />
                  )}
                </div>

                {/* Stage Content */}
                <div className="ml-4 flex-1 min-w-0">
                  <div className={`
                    p-4 rounded-lg border transition-all duration-300 ${
                      isCompleted 
                        ? 'bg-green-50 border-green-200' 
                        : isActive 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'bg-gray-50 border-gray-200'
                    }
                  `}>
                    <div className="flex items-center justify-between mb-2">
                      <h5 className={`font-semibold ${
                        isCompleted 
                          ? 'text-green-800' 
                          : isActive 
                          ? 'text-blue-800' 
                          : 'text-gray-600'
                      }`}>
                        {stage.label}
                      </h5>
                      
                      <div className="flex items-center space-x-2">
                        {isCompleted && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Selesai
                          </span>
                        )}
                        {isActive && !isCompleted && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Sedang Berjalan
                          </span>
                        )}
                        {!isCompleted && !isActive && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            Menunggu
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Stage Description */}
                    <p className="text-sm text-gray-600 mb-2">{stage.description}</p>
                    
                    {/* Stage Details */}
                    <div className="text-xs text-gray-500">
                      {stage.id === 'planning' && (
                        <p>
                          {project.status === 'draft' || project.status === 'pending' 
                            ? 'Belum dimulai - perlu setup awal' 
                            : 'Tahap perencanaan selesai'}
                        </p>
                      )}
                      {stage.id === 'rab-approval' && (
                        <p>
                          {project.rabItems?.length > 0 
                            ? `${project.rabItems.length} item RAB - ${workflowData.rabStatus?.approved ? 'Sudah disetujui' : 'Menunggu persetujuan'}`
                            : 'Belum ada item RAB'}
                        </p>
                      )}
                      {stage.id === 'procurement' && (
                        <p>
                          {workflowData.purchaseOrders?.length > 0 
                            ? `${workflowData.purchaseOrders.length} PO - ${workflowData.purchaseOrders?.some(po => po.status === 'approved') ? 'Ada yang disetujui' : 'Menunggu persetujuan'}`
                            : 'Belum ada Purchase Order'}
                        </p>
                      )}
                      {stage.id === 'execution' && (
                        <p>
                          {isCompleted ? 'Eksekusi selesai' : 
                           isActive ? 'Dalam tahap pelaksanaan' : 
                           'Menunggu procurement selesai'}
                        </p>
                      )}
                      {stage.id === 'completion' && (
                        <p>
                          {isCompleted ? 'Proyek telah selesai' : 'Menunggu eksekusi selesai'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
