import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectAPI } from '../services/api';
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
  Clock
} from 'lucide-react';

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
    
    const contractValue = project?.budget?.contractValue || project?.budget?.approvedBudget || project?.budget?.total || 0;
    const actualCost = project?.budget?.actualCost || 0;
    const remaining = project?.budget?.remaining ?? (contractValue && actualCost ? (contractValue - actualCost) : null);
    const percentage = typeof project?.progress === 'number' ? project.progress : (project?.progress?.percentage || 0);
    
    return {
      contractValue,
      actualCost,
      remaining,
      percentage,
      budgetUsage: contractValue > 0 ? (actualCost / contractValue) * 100 : 0,
      isOverBudget: remaining < 0,
      daysRemaining: project.timeline?.endDate ? 
        Math.ceil((new Date(project.timeline.endDate) - new Date()) / (1000 * 60 * 60 * 24)) : null
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
                      {project.client?.company || 'Tidak ada klien'}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 min-w-0">
                    <Location size={14} className="mr-2 text-gray-400 flex-shrink-0" />
                    <span className="truncate">
                      {project.location?.city}, {project.location?.province}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 min-w-0 col-span-1 sm:col-span-2 lg:col-span-1">
                    <CalendarIcon size={14} className="mr-2 text-gray-400 flex-shrink-0" />
                    <span className="truncate">
                      {formatDate(project.timeline?.startDate)} — {formatDate(project.timeline?.endDate)}
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
                  onClick={() => fetchProject(true)}
                  disabled={loading || refreshing}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-xs font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw size={14} className={`mr-1.5 ${refreshing ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
                </button>
                <button 
                  onClick={() => window.print()}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-xs font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <Printer size={14} className="mr-1.5" />
                  <span className="hidden sm:inline">Cetak</span>
                </button>
                <button 
                  onClick={() => {/* Edit functionality will be implemented */}}
                  className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <Edit size={14} className="mr-1.5" />
                  <span className="hidden sm:inline">Edit</span>
                </button>
                
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
                        <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700">
                          <Share2 size={16} className="mr-3" />
                          Share Project
                        </button>
                        <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700">
                          <Upload size={16} className="mr-3" />
                          Export Data
                        </button>
                        <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700">
                          <Calendar size={16} className="mr-3" />
                          Schedule Meeting
                        </button>
                        <hr className="my-1 border-gray-200 dark:border-gray-600" />
                        <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
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
                { id: 'budget', name: 'Budget', icon: DollarSign },
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
                {/* Project Description */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 overflow-hidden">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                    Deskripsi Proyek
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed break-words">
                    {project.description || 'Deskripsi proyek akan ditampilkan di sini. Proyek ini mencakup berbagai aspek pembangunan dan pengembangan infrastruktur sesuai dengan kebutuhan klien.'}
                  </p>
                </div>

                {/* Client Information */}
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
                        {project.client?.company || 'PT. Contoh Perusahaan'}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Kontak Person
                      </label>
                      <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white break-words">
                        {project.client?.contactPerson || 'John Doe'}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Email
                      </label>
                      <p className="mt-1 text-sm text-blue-600 dark:text-blue-400 break-all">
                        {project.client?.email || 'contact@contohperusahaan.com'}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Telepon
                      </label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {project.client?.phone || '+62 21 1234 5678'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Project Location */}
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
                        {project.location?.address || 'Jl. Contoh No. 123'}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Kota
                      </label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {project.location?.city || 'Jakarta'}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Provinsi
                      </label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {project.location?.province || 'DKI Jakarta'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Project Timeline */}
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
                        {formatDate(project.timeline?.startDate)}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Tanggal Selesai
                      </label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {formatDate(project.timeline?.endDate)}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Durasi
                      </label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {project.timeline?.duration || 'Belum ditentukan'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'budget' && (
              <div className="space-y-6">
                {/* Budget Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-700 p-4 overflow-hidden">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center">
                        <DollarSign className="h-4 w-4 mr-1.5" />
                        Nilai Kontrak
                      </h4>
                    </div>
                    <p className="text-xl font-bold text-green-700 dark:text-green-300 break-words">
                      {formatCurrency(projectStats.contractValue)}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      Total anggaran yang disetujui
                    </p>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700 p-4 overflow-hidden">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center">
                        <Activity className="h-4 w-4 mr-1.5" />
                        Biaya Aktual
                      </h4>
                    </div>
                    <p className="text-xl font-bold text-blue-700 dark:text-blue-300 break-words">
                      {formatCurrency(projectStats.actualCost)}
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      {projectStats.budgetUsage.toFixed(1)}% dari budget terpakai
                    </p>
                  </div>

                  <div className={`rounded-xl border p-4 overflow-hidden ${
                    projectStats.isOverBudget 
                      ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700' 
                      : 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-700'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className={`text-sm font-medium flex items-center ${
                        projectStats.isOverBudget 
                          ? 'text-red-600 dark:text-red-400' 
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        <AlertTriangle className="h-4 w-4 mr-1.5" />
                        Sisa Budget
                      </h4>
                    </div>
                    <p className={`text-xl font-bold break-words ${
                      projectStats.isOverBudget 
                        ? 'text-red-700 dark:text-red-300' 
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {formatCurrency(Math.abs(projectStats.remaining || 0))}
                    </p>
                    <p className={`text-xs mt-1 ${
                      projectStats.isOverBudget 
                        ? 'text-red-600 dark:text-red-400' 
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {projectStats.isOverBudget ? 'Over budget!' : 'Budget tersisa'}
                    </p>
                  </div>
                </div>

                {/* Budget Progress Bar */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 overflow-hidden">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
                    Progress Anggaran
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Penggunaan Budget</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {projectStats.budgetUsage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ease-out ${
                          projectStats.budgetUsage > 100 
                            ? 'bg-red-500 dark:bg-red-400' 
                            : projectStats.budgetUsage > 80 
                              ? 'bg-yellow-500 dark:bg-yellow-400' 
                              : 'bg-green-500 dark:bg-green-400'
                        }`}
                        style={{ width: `${Math.min(projectStats.budgetUsage, 100)}%` }}
                      ></div>
                    </div>
                    {projectStats.budgetUsage > 100 && (
                      <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                        <span className="text-sm text-red-700 dark:text-red-300">
                          Peringatan: Budget telah melebihi batas yang disetujui
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Budget Breakdown */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 overflow-hidden">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                    Rincian Anggaran
                  </h3>
                  <div className="space-y-3">
                    {/* Mock budget breakdown data */}
                    {[
                      { category: 'Material', amount: projectStats.contractValue * 0.4, percentage: 40 },
                      { category: 'Tenaga Kerja', amount: projectStats.contractValue * 0.35, percentage: 35 },
                      { category: 'Peralatan', amount: projectStats.contractValue * 0.15, percentage: 15 },
                      { category: 'Overhead', amount: projectStats.contractValue * 0.1, percentage: 10 }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{item.category}</p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="text-sm text-gray-600 dark:text-gray-400">{item.percentage}%</span>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(item.amount)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'milestones' && (
              <div className="space-y-6">
                {/* Timeline Progress */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 overflow-hidden">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400" />
                    Timeline Milestone
                  </h3>
                  
                  {/* Progress Overview */}
                  <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Progress Keseluruhan</span>
                      <span className="text-sm font-bold text-blue-800 dark:text-blue-200">{projectStats.percentage}%</span>
                    </div>
                    <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                      <div
                        className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${Math.min(projectStats.percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Mock milestones data */}
                  <div className="space-y-4">
                    {[
                      { 
                        id: 1, 
                        title: 'Perencanaan & Desain', 
                        status: 'completed', 
                        date: '2025-01-15', 
                        description: 'Finalisasi desain dan perencanaan teknis',
                        progress: 100
                      },
                      { 
                        id: 2, 
                        title: 'Persiapan Lokasi', 
                        status: 'completed', 
                        date: '2025-02-01', 
                        description: 'Pembersihan dan persiapan area konstruksi',
                        progress: 100
                      },
                      { 
                        id: 3, 
                        title: 'Fase Konstruksi 1', 
                        status: 'in_progress', 
                        date: '2025-03-15', 
                        description: 'Pondasi dan struktur dasar',
                        progress: 65
                      },
                      { 
                        id: 4, 
                        title: 'Fase Konstruksi 2', 
                        status: 'planning', 
                        date: '2025-05-01', 
                        description: 'Dinding dan atap',
                        progress: 0
                      },
                      { 
                        id: 5, 
                        title: 'Finishing & QC', 
                        status: 'planning', 
                        date: '2025-06-15', 
                        description: 'Penyelesaian akhir dan quality control',
                        progress: 0
                      }
                    ].map((milestone, index) => (
                      <div key={milestone.id} className="relative">
                        {/* Connecting line */}
                        {index !== 4 && (
                          <div className="absolute left-5 top-10 w-0.5 h-12 bg-gray-200 dark:bg-gray-600"></div>
                        )}
                        
                        <div className="flex items-start gap-4">
                          {/* Status Icon */}
                          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                            milestone.status === 'completed' 
                              ? 'bg-green-100 dark:bg-green-900/20 border-green-500 text-green-600 dark:text-green-400'
                              : milestone.status === 'in_progress'
                                ? 'bg-blue-100 dark:bg-blue-900/20 border-blue-500 text-blue-600 dark:text-blue-400'
                                : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-400'
                          }`}>
                            {milestone.status === 'completed' && <CheckCircle size={20} />}
                            {milestone.status === 'in_progress' && <Activity size={20} />}
                            {milestone.status === 'planning' && <Clock size={20} />}
                          </div>

                          {/* Milestone Content */}
                          <div className="flex-1 min-w-0 pb-6">
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="text-sm font-semibold text-gray-900 dark:text-white break-words">
                                  {milestone.title}
                                </h4>
                                <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                                  {formatDate(milestone.date)}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 break-words">
                                {milestone.description}
                              </p>
                              
                              {/* Progress bar for current milestone */}
                              {milestone.status === 'in_progress' && (
                                <div className="space-y-1">
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs text-blue-600 dark:text-blue-400">Progress</span>
                                    <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                                      {milestone.progress}%
                                    </span>
                                  </div>
                                  <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-1.5">
                                    <div
                                      className="bg-blue-600 dark:bg-blue-400 h-1.5 rounded-full transition-all duration-300"
                                      style={{ width: `${milestone.progress}%` }}
                                    ></div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Critical Path & Dependencies */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 overflow-hidden">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2 text-orange-600 dark:text-orange-400" />
                    Critical Path & Risiko
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                          Fase Konstruksi 1 - Risiko Keterlambatan
                        </p>
                        <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1 break-words">
                          Cuaca dan supply material dapat mempengaruhi timeline
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                      <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                          Dependencies Teridentifikasi
                        </p>
                        <p className="text-xs text-blue-700 dark:text-blue-400 mt-1 break-words">
                          Fase 2 bergantung pada completion Fase 1 (95% minimum)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'team' && (
              <div className="space-y-6">
                {/* Team Overview */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 overflow-hidden">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Users className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                    Tim Proyek
                  </h3>
                  
                  {/* Team Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-700">
                      <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">Total Anggota</div>
                      <div className="text-lg font-bold text-blue-700 dark:text-blue-300">12</div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-700">
                      <div className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">Aktif</div>
                      <div className="text-lg font-bold text-green-700 dark:text-green-300">10</div>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 border border-orange-200 dark:border-orange-700">
                      <div className="text-xs text-orange-600 dark:text-orange-400 font-medium mb-1">Roles</div>
                      <div className="text-lg font-bold text-orange-700 dark:text-orange-300">6</div>
                    </div>
                  </div>

                  {/* Team Members */}
                  <div className="space-y-3">
                    {/* Project Manager */}
                    <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                          PM
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="min-w-0 flex-1">
                              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                                Ahmad Yani
                              </h4>
                              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                                Project Manager
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                10+ tahun pengalaman manajemen proyek konstruksi
                              </p>
                            </div>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700 flex-shrink-0 ml-2">
                              Lead
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Technical Team */}
                    {[
                      { name: 'Budi Santoso', role: 'Site Engineer', dept: 'Engineering', avatar: 'BS', status: 'active' },
                      { name: 'Siti Maharani', role: 'Architect', dept: 'Design', avatar: 'SM', status: 'active' },
                      { name: 'Rizki Pratama', role: 'Quantity Surveyor', dept: 'Cost Control', avatar: 'RP', status: 'active' },
                      { name: 'Dewi Lestari', role: 'Safety Officer', dept: 'HSE', avatar: 'DL', status: 'active' },
                      { name: 'Andi Wijaya', role: 'Foreman', dept: 'Construction', avatar: 'AW', status: 'active' }
                    ].map((member, index) => (
                      <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-gray-600 dark:bg-gray-500 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                            {member.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="min-w-0 flex-1">
                                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                                  {member.name}
                                </h4>
                                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                                  {member.role}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                  {member.dept}
                                </p>
                              </div>
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700 flex-shrink-0 ml-2">
                                {member.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Organizational Chart */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 overflow-hidden">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Building className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
                    Struktur Tim
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                      <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2">Management</h4>
                      <ul className="space-y-1 text-xs text-blue-600 dark:text-blue-400">
                        <li>• Project Manager</li>
                        <li>• Assistant PM</li>
                      </ul>
                    </div>
                    
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
                      <h4 className="text-sm font-semibold text-green-700 dark:text-green-300 mb-2">Technical</h4>
                      <ul className="space-y-1 text-xs text-green-600 dark:text-green-400">
                        <li>• Site Engineer</li>
                        <li>• Architect</li>
                        <li>• QS Engineer</li>
                      </ul>
                    </div>
                    
                    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-700">
                      <h4 className="text-sm font-semibold text-orange-700 dark:text-orange-300 mb-2">Operations</h4>
                      <ul className="space-y-1 text-xs text-orange-600 dark:text-orange-400">
                        <li>• Safety Officer</li>
                        <li>• Foreman</li>
                        <li>• Workers</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Team Performance */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 overflow-hidden">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Activity className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400" />
                    Performance Tim
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-600 dark:text-gray-400">Produktivitas</span>
                          <span className="text-xs font-semibold text-gray-900 dark:text-white">85%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-green-500 dark:bg-green-400 h-2 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-600 dark:text-gray-400">Kehadiran</span>
                          <span className="text-xs font-semibold text-gray-900 dark:text-white">92%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-blue-500 dark:bg-blue-400 h-2 rounded-full" style={{ width: '92%' }}></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-600 dark:text-gray-400">Safety Score</span>
                          <span className="text-xs font-semibold text-gray-900 dark:text-white">98%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-green-500 dark:bg-green-400 h-2 rounded-full" style={{ width: '98%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-600 dark:text-gray-400">Quality Rating</span>
                          <span className="text-xs font-semibold text-gray-900 dark:text-white">88%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-yellow-500 dark:bg-yellow-400 h-2 rounded-full" style={{ width: '88%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-4">
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400" />
                      Dokumen Proyek
                    </h3>
                    <button className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors">
                      <Upload className="h-3 w-3 mr-1.5" />
                      Upload
                    </button>
                  </div>
                  
                  <div className="text-center py-8">
                    <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <FileText className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Belum Ada Dokumen
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
                      Upload dokumen proyek seperti kontrak dan laporan.
                    </p>
                    <button className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors">
                      <Upload className="h-3 w-3 mr-1.5" />
                      Upload Dokumen
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
