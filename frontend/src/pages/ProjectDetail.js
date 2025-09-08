import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectAPI } from '../services/api';
import BudgetRAB from '../components/BudgetRAB';
import ProjectMilestones from '../components/ProjectMilestones';
import ProjectTeam from '../components/ProjectTeam';
import ProjectDocuments from '../components/ProjectDocuments';
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
  Calendar as CalendarIcon,
  RefreshCw,
  Share2,
  Clock,
  Calculator
} from 'lucide-react';

// Utility functions
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

const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const ProjectDetail = () => {
  const { id } = useParams();
  
  // Enhanced State Management
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [showQuickActions, setShowQuickActions] = useState(false);

  // Enhanced Data Fetching
  const fetchProject = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      const data = await projectAPI.getById(id);
      setProject(data.data || data);
      setError('');
    } catch (e) {
      setError('Proyek tidak ditemukan atau terjadi kesalahan.');
      console.error('Error fetching project:', e);
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  }, [id]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showQuickActions && !event.target.closest('.quick-actions-dropdown')) {
        setShowQuickActions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showQuickActions]);

  // Enhanced Helper Functions
  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency', 
      currency: 'IDR', 
      minimumFractionDigits: 0
    }).format(amount || 0);
  }, []);

  const formatDate = useCallback((date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('id-ID', {
      day: '2-digit', 
      month: 'short', 
      year: 'numeric'
    });
  }, []);

  // Safe render helper to prevent object rendering
  const safeRender = useCallback((value, fallback = '-') => {
    if (value === null || value === undefined) return fallback;
    if (typeof value === 'object') {
      console.warn('Attempting to render object directly:', value);
      return fallback;
    }
    return value;
  }, []);

  // Action Handler Functions
  const handleRefreshProject = async () => {
    await fetchProject(true);
  };

  const handlePrintProject = () => {
    window.print();
  };

  const handleExportData = async () => {
    try {
      const projectData = {
        ...project,
        exportDate: new Date().toISOString(),
        exportedBy: 'Current User'
      };
      
      const dataStr = JSON.stringify(projectData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `project_${project.name.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      console.log('Data proyek berhasil diekspor!');
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  const handleShareProject = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Proyek: ${project.name}`,
          text: project.description,
          url: window.location.href,
        });
      } else {
        // Fallback untuk browser yang tidak mendukung Web Share API
        await navigator.clipboard.writeText(window.location.href);
        console.log('Link proyek berhasil disalin ke clipboard!');
      }
    } catch (error) {
      console.error('Error sharing project:', error);
    }
  };

  const handleScheduleMeeting = () => {
    // Redirect ke aplikasi calendar atau form scheduling
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Meeting Proyek: ${encodeURIComponent(project.name)}&details=${encodeURIComponent('Meeting untuk membahas proyek: ' + (project.description || ''))}&location=${encodeURIComponent(project.location?.address || '')}`;
    window.open(calendarUrl, '_blank');
  };

  const handleArchiveProject = async () => {
    if (window.confirm('Apakah Anda yakin ingin mengarsipkan proyek ini? Proyek yang diarsipkan tidak dapat diakses dalam daftar proyek aktif.')) {
      try {
        await projectAPI.updateProject(id, { 
          ...project, 
          status: 'archived',
          archivedDate: new Date().toISOString()
        });
        console.log('Proyek berhasil diarsipkan!');
        // Redirect ke halaman projects setelah 2 detik
        setTimeout(() => {
          window.location.href = '/admin/projects';
        }, 2000);
      } catch (error) {
        console.error('Error archiving project:', error);
      }
    }
  };

  const getStatusInfo = useCallback((status) => {
    const statusMap = {
      completed: { 
        text: 'Selesai', 
        variant: 'success',
        icon: CheckCircle,
        bgClass: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800'
      },
      in_progress: { 
        text: 'Dalam Progress', 
        variant: 'primary',
        icon: Activity,
        bgClass: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
      },
      planning: { 
        text: 'Perencanaan', 
        variant: 'warning',
        icon: Clock,
        bgClass: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800'
      },
      on_hold: { 
        text: 'Tertunda', 
        variant: 'danger',
        icon: AlertCircle,
        bgClass: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'
      }
    };
    return statusMap[status] || statusMap.planning;
  }, []);

  // Enhanced computed values
  const projectStats = useMemo(() => {
    if (!project) return {};
    
    // Handle different budget data formats
    const contractValue = parseFloat(project?.budget?.total || project?.budget || 0);
    const actualCost = parseFloat(project?.actualCost || 0);
    const remaining = contractValue - actualCost;
    
    // Handle different progress data formats
    const percentage = typeof project?.progress === 'object' 
      ? (project.progress?.percentage || 0) 
      : (project?.progress || 0);
    
    // Calculate timeline
    const startDate = project.startDate || project.timeline?.startDate;
    const endDate = project.endDate || project.timeline?.endDate;
    const today = new Date();
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    
    let daysRemaining = null;
    let totalDays = null;
    let daysElapsed = null;
    
    if (start && end) {
      totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      daysRemaining = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
      daysElapsed = Math.ceil((today - start) / (1000 * 60 * 60 * 24));
    }
    
    return {
      contractValue,
      actualCost,
      remaining,
      percentage,
      budgetUsage: contractValue > 0 ? (actualCost / contractValue) * 100 : 0,
      isOverBudget: remaining < 0,
      daysRemaining,
      totalDays,
      daysElapsed,
      timelineProgress: totalDays > 0 ? Math.max(0, Math.min(100, (daysElapsed / totalDays) * 100)) : 0
    };
  }, [project]);

  // Enhanced Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="flex justify-between items-start">
              <div className="space-y-3">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-96"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-80"></div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced Error State
  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-12 w-12 text-red-500 dark:text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Proyek Tidak Ditemukan
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              {error || 'Proyek yang Anda cari tidak ditemukan atau telah dihapus.'}
            </p>
            <div className="flex gap-3 justify-center">
              <Link 
                to="/admin/projects" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Daftar Proyek
              </Link>
              <button 
                onClick={fetchProject}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Coba Lagi
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Enhanced Header */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-3 mb-4">
                  <Link 
                    to="/admin/projects" 
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 inline-flex items-center transition-colors flex-shrink-0 mt-1"
                  >
                    <ArrowLeft size={18} className="mr-1" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white tracking-tight break-words leading-tight">
                      {project.name}
                    </h1>
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusInfo(project.status).bgClass}`}>
                        <span className="mr-1">{React.createElement(getStatusInfo(project.status).icon, { size: 12 })}</span>
                        {getStatusInfo(project.status).text}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Project Meta */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-3 mb-6">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 min-w-0">
                    <Building size={14} className="mr-2 text-gray-400 flex-shrink-0" />
                    <span className="truncate font-medium">
                      {project.clientName || 'Klien belum diisi'}
                    </span>
                  </div>
                  
                  {/* Subsidiary Info */}
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 min-w-0">
                    <Building size={14} className="mr-2 text-blue-500 flex-shrink-0" />
                    <span className="truncate font-medium">
                      {project.subsidiaryInfo?.code} - {project.subsidiaryInfo?.name || project.subsidiary?.name || 'Subsidiary belum ditentukan'}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 min-w-0">
                    <Location size={14} className="mr-2 text-gray-400 flex-shrink-0" />
                    <span className="truncate">
                      {project.location?.city || project.location?.address || 'Lokasi belum diisi'}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 min-w-0 col-span-1 sm:col-span-2 lg:col-span-1">
                    <CalendarIcon size={14} className="mr-2 text-gray-400 flex-shrink-0" />
                    <span className="truncate">
                      {formatDate(project.startDate)} — {formatDate(project.endDate)}
                    </span>
                  </div>
                  {project.projectCode && (
                    <div className="flex items-center text-sm">
                      <span className="inline-flex items-center bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-lg font-mono text-xs max-w-full truncate">
                        {project.projectCode}
                      </span>
                    </div>
                  )}
                </div>

                {/* Progress & Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-blue-600 dark:text-blue-400 font-medium truncate">Progress</span>
                      <span className="text-xs font-bold text-blue-700 dark:text-blue-300 flex-shrink-0 ml-2">
                        {projectStats.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                      <div
                        className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${Math.min(projectStats.percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 min-w-0">
                    <div className="text-xs text-green-600 dark:text-green-400 font-medium mb-1 truncate">
                      Budget Terpakai
                    </div>
                    <div className="text-xs font-bold text-green-700 dark:text-green-300">
                      {projectStats.budgetUsage.toFixed(1)}%
                    </div>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 min-w-0">
                    <div className="text-xs text-purple-600 dark:text-purple-400 font-medium mb-1 truncate">
                      Nilai Kontrak
                    </div>
                    <div className="text-xs font-bold text-purple-700 dark:text-purple-300 break-words">
                      {formatCurrency(projectStats.contractValue)}
                    </div>
                  </div>

                  {projectStats.daysRemaining !== null && (
                    <div className={`rounded-lg p-3 min-w-0 ${
                      projectStats.daysRemaining > 30 ? 'bg-green-50 dark:bg-green-900/20' :
                      projectStats.daysRemaining > 7 ? 'bg-yellow-50 dark:bg-yellow-900/20' :
                      'bg-red-50 dark:bg-red-900/20'
                    }`}>
                      <div className={`text-xs font-medium mb-1 truncate ${
                        projectStats.daysRemaining > 30 ? 'text-green-600 dark:text-green-400' :
                        projectStats.daysRemaining > 7 ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-red-600 dark:text-red-400'
                      }`}>
                        Sisa Waktu
                      </div>
                      <div className={`text-xs font-bold break-words ${
                        projectStats.daysRemaining > 30 ? 'text-green-700 dark:text-green-300' :
                        projectStats.daysRemaining > 7 ? 'text-yellow-700 dark:text-yellow-300' :
                        'text-red-700 dark:text-red-300'
                      }`}>
                        {projectStats.daysRemaining > 0 ? `${projectStats.daysRemaining} hari` : 'Terlambat'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button 
                  onClick={handleRefreshProject}
                  disabled={loading || refreshing}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-xs font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw size={14} className={`mr-1.5 ${refreshing ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
                </button>
                <button 
                  onClick={handlePrintProject}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-xs font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <Printer size={14} className="mr-1.5" />
                  <span className="hidden sm:inline">Cetak</span>
                </button>
                <Link
                  to={`/admin/projects/${id}/edit`}
                  className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <Edit size={14} className="mr-1.5" />
                  <span className="hidden sm:inline">Edit</span>
                </Link>
                
                {/* Quick Actions Dropdown */}
                <div className="relative quick-actions-dropdown">
                  <button 
                    onClick={() => setShowQuickActions(!showQuickActions)}
                    className="inline-flex items-center px-2 py-2 border border-gray-300 dark:border-gray-600 text-xs font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <Share2 size={14} />
                  </button>
                  
                  {showQuickActions && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                      <div className="py-1">
                        <button 
                          onClick={handleShareProject}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                        >
                          <Share2 size={16} className="mr-3" />
                          Share Project
                        </button>
                        <button 
                          onClick={handleExportData}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                        >
                          <Upload size={16} className="mr-3" />
                          Export Data
                        </button>
                        <button 
                          onClick={handleScheduleMeeting}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                        >
                          <Calendar size={16} className="mr-3" />
                          Schedule Meeting
                        </button>
                        <hr className="my-1 border-gray-200 dark:border-gray-600" />
                        <button 
                          onClick={handleArchiveProject}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <AlertTriangle size={16} className="mr-3" />
                          Archive Project
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {[
                { id: 'overview', name: 'Overview', icon: Building },
                { id: 'budget', name: 'RAB', icon: Calculator },
                { id: 'milestones', name: 'Milestones', icon: Calendar },
                { id: 'team', name: 'Tim', icon: Users },
                { id: 'documents', name: 'Dokumen', icon: FileText },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Status & Progress Section - PRIORITAS TERTINGGI */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 overflow-hidden">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Activity className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
                    Status & Progress
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                      <div className={`text-2xl font-bold mb-1 ${
                        project.status === 'active' ? 'text-green-600' :
                        project.status === 'planning' ? 'text-blue-600' :
                        project.status === 'completed' ? 'text-emerald-600' :
                        project.status === 'on_hold' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {project.status === 'active' ? '🚧' :
                         project.status === 'planning' ? '📋' :
                         project.status === 'completed' ? '✅' :
                         project.status === 'on_hold' ? '⏸️' : '❌'}
                      </div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Status</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                        {project.status?.replace('_', ' ') || 'Planning'}
                      </p>
                    </div>
                    
                    <div className="text-center p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                      <div className={`text-2xl font-bold mb-1 ${
                        project.priority === 'urgent' ? 'text-red-600' :
                        project.priority === 'high' ? 'text-orange-600' :
                        project.priority === 'medium' ? 'text-blue-600' :
                        'text-gray-600'
                      }`}>
                        {project.priority === 'urgent' ? '🔴' :
                         project.priority === 'high' ? '🟠' :
                         project.priority === 'medium' ? '🔵' : '⚪'}
                      </div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Prioritas</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                        {project.priority || 'Medium'}
                      </p>
                    </div>

                    <div className="text-center p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                      <div className="text-2xl font-bold mb-1 text-purple-600">
                        {projectStats.percentage}%
                      </div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Progress</p>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${projectStats.percentage}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="text-center p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                      <div className="text-2xl font-bold mb-1 text-blue-600">
                        {formatCurrency(projectStats.contractValue)}
                      </div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Budget</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Nilai Kontrak
                      </p>
                    </div>
                  </div>

                  {/* Timeline Progress Bar */}
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Timeline Progress</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {projectStats.daysRemaining !== null ? (
                          projectStats.daysRemaining > 0 ? `${projectStats.daysRemaining} hari tersisa` : 
                          projectStats.daysRemaining === 0 ? 'Deadline hari ini' : 
                          `Terlambat ${Math.abs(projectStats.daysRemaining)} hari`
                        ) : 'Timeline belum ditentukan'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-300 ${
                          projectStats.timelineProgress > 100 ? 'bg-red-500' : 
                          projectStats.timelineProgress > 80 ? 'bg-yellow-500' : 
                          'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(projectStats.timelineProgress, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>{formatDate(project.startDate)}</span>
                      <span>{formatDate(project.endDate)}</span>
                    </div>
                  </div>
                </div>

                {/* Project Timeline - KEDUA PALING RELEVAN */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 overflow-hidden">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400" />
                    Timeline Proyek
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="min-w-0">
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Tanggal Mulai
                      </label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {formatDate(project.startDate)}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Tanggal Selesai
                      </label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {formatDate(project.endDate)}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Durasi Estimasi
                      </label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {projectStats.totalDays ? `${projectStats.totalDays} hari` : 'Belum dihitung'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Subsidiary Information - KETIGA (SIAPA YANG MENGERJAKAN) */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 overflow-hidden">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Building className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                    Anak Perusahaan Pelaksana
                  </h3>
                  {project.subsidiaryInfo ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="min-w-0">
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          Nama Perusahaan
                        </label>
                        <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white break-words">
                          {project.subsidiaryInfo.name}
                        </p>
                      </div>
                      <div className="min-w-0">
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          Kode Subsidiary
                        </label>
                        <p className="mt-1 text-sm font-mono bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-2 py-1 rounded text-center">
                          {project.subsidiaryInfo.code}
                        </p>
                      </div>
                      <div className="min-w-0">
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          Induk Perusahaan
                        </label>
                        <p className="mt-1 text-sm font-medium text-blue-600 dark:text-blue-400">
                          NUSANTARA GROUP
                        </p>
                      </div>
                      {project.subsidiaryInfo.specialization && (
                        <div className="min-w-0">
                          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            Spesialisasi
                          </label>
                          <p className="mt-1 text-sm text-gray-900 dark:text-white capitalize">
                            {project.subsidiaryInfo.specialization.replace('_', ' ')}
                          </p>
                        </div>
                      )}
                      {project.subsidiaryInfo.contactInfo && (
                        <>
                          <div className="min-w-0">
                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                              Telepon
                            </label>
                            <p className="mt-1 text-sm text-gray-900 dark:text-white">
                              {project.subsidiaryInfo.contactInfo.phone || '-'}
                            </p>
                          </div>
                          <div className="min-w-0">
                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                              Email
                            </label>
                            <p className="mt-1 text-sm text-blue-600 dark:text-blue-400 break-all">
                              {project.subsidiaryInfo.contactInfo.email || '-'}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <Building className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-sm">Subsidiary belum ditentukan untuk proyek ini</p>
                      <p className="text-xs mt-1">Hubungi administrator untuk menentukan subsidiary pelaksana</p>
                    </div>
                  )}
                </div>

                {/* Client Information - KEEMPAT (UNTUK SIAPA) */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 overflow-hidden">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Building className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
                    Informasi Klien
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="min-w-0">
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Nama Perusahaan
                      </label>
                      <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white break-words">
                        {project.clientName || 'Nama klien belum diisi'}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Kontak Person
                      </label>
                      <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white break-words">
                        {project.clientContact?.name || project.clientContact?.contactPerson || 'Belum diisi'}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Email
                      </label>
                      <p className="mt-1 text-sm text-blue-600 dark:text-blue-400 break-all">
                        {project.clientContact?.email || 'Email belum diisi'}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Telepon
                      </label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {project.clientContact?.phone || 'Telepon belum diisi'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Project Location - KELIMA (DIMANA) */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 overflow-hidden">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Location className="h-4 w-4 mr-2 text-red-600 dark:text-red-400" />
                    Lokasi Proyek
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="min-w-0">
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Alamat
                      </label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white break-words">
                        {project.location?.address || project.location?.street || 'Alamat belum diisi'}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Kota
                      </label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {project.location?.city || 'Kota belum diisi'}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Provinsi
                      </label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {project.location?.province || project.location?.country || 'Provinsi belum diisi'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Project Description - TERAKHIR (DETAIL) */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 overflow-hidden">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                    Deskripsi Proyek
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed break-words">
                    {project.description || 'Deskripsi proyek akan ditampilkan di sini. Proyek ini mencakup berbagai aspek pembangunan dan pengembangan infrastruktur sesuai dengan kebutuhan klien.'}
                  </p>
                </div>

                {/* Audit Information - NEW SECTION */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 overflow-hidden">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400" />
                    Audit Trail
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Created Information */}
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Proyek Dibuat
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {formatDateTime(project.createdAt)}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {project.createdByUser ? (
                              <>Dibuat oleh: <span className="font-medium">{project.createdByUser.fullName}</span>
                              {project.createdByUser.position && (
                                <span className="text-gray-400"> ({project.createdByUser.position})</span>
                              )}</>
                            ) : project.createdBy ? (
                              <>Dibuat oleh: <span className="font-medium">{project.createdBy}</span></>
                            ) : (
                              'Sistem otomatis'
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Updated Information */}
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                            <RefreshCw className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Terakhir Diubah
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {formatDateTime(project.updatedAt)}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {project.updatedByUser ? (
                              <>Diubah oleh: <span className="font-medium">{project.updatedByUser.fullName}</span>
                              {project.updatedByUser.position && (
                                <span className="text-gray-400"> ({project.updatedByUser.position})</span>
                              )}</>
                            ) : project.updatedBy ? (
                              <>Diubah oleh: <span className="font-medium">{project.updatedBy}</span></>
                            ) : project.createdAt === project.updatedAt ? (
                              'Belum pernah diubah'
                            ) : (
                              'Sistem otomatis'
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Audit Info */}
                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                          Kode Proyek
                        </p>
                        <p className="text-sm font-mono font-semibold text-gray-900 dark:text-white">
                          {project.id}
                        </p>
                      </div>
                      
                      <div className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                          Durasi Sejak Dibuat
                        </p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {(() => {
                            const created = new Date(project.createdAt);
                            const now = new Date();
                            const diffDays = Math.floor((now - created) / (1000 * 60 * 60 * 24));
                            
                            if (diffDays === 0) return 'Hari ini';
                            if (diffDays === 1) return '1 hari';
                            if (diffDays < 7) return `${diffDays} hari`;
                            if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu`;
                            if (diffDays < 365) return `${Math.floor(diffDays / 30)} bulan`;
                            return `${Math.floor(diffDays / 365)} tahun`;
                          })()}
                        </p>
                      </div>

                      <div className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                          Status Perubahan
                        </p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {project.createdAt === project.updatedAt ? (
                            <span className="text-green-600 dark:text-green-400">Original</span>
                          ) : (
                            <span className="text-blue-600 dark:text-blue-400">Modified</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'budget' && (
              <div className="p-6">
                <BudgetRAB 
                  project={project}
                  onUpdate={(updatedData) => {
                    setProject(prev => ({ ...prev, ...updatedData }));
                  }}
                />
              </div>
            )}

            {activeTab === 'milestones' && (
              <div className="p-6">
                <ProjectMilestones 
                  project={project}
                  onUpdate={(updatedData) => {
                    setProject(prev => ({ ...prev, ...updatedData }));
                  }}
                />
              </div>
            )}

            {activeTab === 'team' && (
              <div className="p-6">
                <ProjectTeam 
                  project={project}
                  onUpdate={(updatedData) => {
                    setProject(prev => ({ ...prev, ...updatedData }));
                  }}
                />
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="p-6">
                <ProjectDocuments 
                  project={project}
                  onUpdate={(updatedData) => {
                    setProject(prev => ({ ...prev, ...updatedData }));
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
