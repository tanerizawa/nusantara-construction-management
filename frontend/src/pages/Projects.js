import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Download, 
  RefreshCw,
  AlertTriangle,
  Building,
  Clock,
  CheckCircle
} from 'lucide-react';
import { projectAPI } from '../services/api';

// Enhanced UI Components  
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ProjectTable } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { Pagination } from '../components/ui/Pagination';

const Projects = () => {
  const navigate = useNavigate();
  
  // Enhanced State Management
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  
  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // View & UI States
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [showFilters, setShowFilters] = useState(false);
  
  // Modal States
  const [showCreate, setShowCreate] = useState(false);
  
  // Pagination States
  const [page, setPage] = useState(1);
  const pageSize = 12;
  const [serverPagination, setServerPagination] = useState({ 
    current: 1, 
    total: 1, 
    count: 0 
  });
  
  // Create Project Form States
  const [createProjectLoading, setCreateProjectLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    city: 'Karawang',
    province: 'Jawa Barat',
    value: '',
    priority: 'medium',
    description: ''
  });

  // Enhanced Effects with Optimized Dependencies
  const fetchProjects = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      const params = {
        q: searchTerm || undefined,
        status: statusFilter || undefined,
        priority: priorityFilter || undefined,
        sort: sortBy,
        order: sortOrder,
        limit: pageSize,
        page
      };
      
      const response = await projectAPI.getAll(params);
      console.log('Projects API Response:', response);
      const data = response.data || [];
      const pagination = response.pagination || { 
        current: page, 
        total: 1, 
        count: data.length 
      };
      
      setProjects(data);
      setServerPagination({
        current: parseInt(pagination.current || 1, 10),
        total: parseInt(pagination.total || 1, 10),
        count: parseInt(pagination.count || data.length || 0, 10)
      });
    } catch (error) {
      console.error('Error fetching projects:', error);
      
      // Use mock data as fallback for demo
      const mockProjects = [
        {
          id: "PRJ001",
          projectCode: "YK-2024-001", 
          name: "Pembangunan Gedung Perkantoran PT. Maju Bersama",
          description: "Pembangunan gedung perkantoran 10 lantai dengan luas total 5000 m² di Jakarta Selatan",
          client: { company: "PT. Maju Bersama" },
          location: { city: "Jakarta Selatan", province: "DKI Jakarta" },
          status: "in_progress",
          progress: { percentage: 65 },
          budget: { contractValue: 15000000000 },
          timeline: { startDate: "2024-01-15", endDate: "2024-12-15" }
        },
        {
          id: "PRJ002",
          projectCode: "YK-2024-002",
          name: "Renovasi Pabrik PT. Industri Jaya", 
          description: "Renovasi dan ekspansi pabrik tekstil dengan penambahan area produksi seluas 2000 m²",
          client: { company: "PT. Industri Jaya" },
          location: { city: "Bogor", province: "Jawa Barat" },
          status: "in_progress",
          progress: { percentage: 45 },
          budget: { contractValue: 8500000000 },
          timeline: { startDate: "2024-03-01", endDate: "2024-10-31" }
        },
        {
          id: "PRJ003",
          projectCode: "YK-2024-003",
          name: "Pembangunan Perumahan Green Valley",
          description: "Pembangunan perumahan cluster dengan 50 unit rumah type 45 dan 36",
          client: { company: "PT. Green Valley Property" },
          location: { city: "Bekasi", province: "Jawa Barat" },
          status: "in_progress", 
          progress: { percentage: 30 },
          budget: { contractValue: 25000000000 },
          timeline: { startDate: "2024-02-01", endDate: "2025-01-31" }
        }
      ];
      
      console.log('Using mock projects data');
      setProjects(mockProjects);
      setServerPagination({ current: 1, total: 1, count: mockProjects.length });
      setError('Using demo data - API connection failed');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [searchTerm, statusFilter, priorityFilter, sortBy, sortOrder, page, pageSize]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Reset to first page when filters change - prevent infinite loop
  useEffect(() => {
    // Only reset page if we're not already on page 1
    setPage(prevPage => prevPage === 1 ? 1 : 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, statusFilter, priorityFilter, sortBy, sortOrder]);

  // Utility Functions
  const formatCurrency = useCallback((amount) => {
    if (amount >= 1000000000) {
      return `Rp ${(amount / 1000000000).toFixed(1)}B`;
    } else if (amount >= 1000000) {
      return `Rp ${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `Rp ${(amount / 1000).toFixed(1)}K`;
    }
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount || 0);
  }, []);

  const formatDate = useCallback((dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short', 
      year: 'numeric'
    }) : '-';
  }, []);

  const getStatusInfo = useCallback((status) => {
    const statusMap = {
      completed: { 
        text: 'Selesai', 
        variant: 'success',
        icon: CheckCircle,
        color: 'text-green-600 dark:text-green-400'
      },
      in_progress: { 
        text: 'Berlangsung', 
        variant: 'primary',
        icon: Clock,
        color: 'text-blue-600 dark:text-blue-400'
      },
      planning: { 
        text: 'Perencanaan', 
        variant: 'warning',
        icon: Calendar,
        color: 'text-yellow-600 dark:text-yellow-400'
      },
      on_hold: { 
        text: 'Ditunda', 
        variant: 'danger',
        icon: AlertTriangle,
        color: 'text-red-600 dark:text-red-400'
      }
    };
    return statusMap[status] || statusMap.planning;
  }, []);

  // Enhanced Action Handlers
  const handleCreateProject = useCallback(async (e) => {
    e.preventDefault();
    setCreateProjectLoading(true);
    try {
      const now = new Date();
      const end = new Date(now);
      end.setMonth(end.getMonth() + 3);
      
      const body = {
        name: formData.name || `Proyek Baru ${now.getFullYear()}`,
        description: formData.description || 'Proyek konstruksi di Karawang',
        priority: formData.priority,
        client: {
          company: formData.company || 'Perusahaan Karawang',
          contactPerson: 'Contact Person',
          phone: '+62-0000-0000',
          email: 'info@example.com',
          address: `${formData.city}, ${formData.province}`
        },
        location: {
          address: `${formData.city}, ${formData.province}`,
          city: formData.city,
          province: formData.province
        },
        timeline: {
          startDate: now.toISOString().slice(0,10),
          endDate: end.toISOString().slice(0,10),
          duration: 3,
          unit: 'months'
        },
        budget: {
          total: Number(formData.value || 1000000000),
          currency: 'IDR'
        }
      };
      
      const res = await projectAPI.create(body);
      const created = res.data.data || res.data;
      setProjects([created, ...projects]);
      setShowCreate(false);
      setFormData({
        name: '',
        company: '',
        city: 'Karawang',
        province: 'Jawa Barat',
        value: '',
        priority: 'medium',
        description: ''
      });
      setPage(1);
    } catch (err) {
      console.error('Gagal membuat proyek:', err);
      setError('Failed to create project. Please try again.');
    } finally {
      setCreateProjectLoading(false);
    }
  }, [formData, projects]);

  const handleRefresh = useCallback(() => {
    fetchProjects(true);
  }, [fetchProjects]);

  const handleFormChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleViewModeToggle = useCallback(() => {
    setViewMode(prev => prev === 'grid' ? 'table' : 'grid');
  }, []);

  // Computed Values
  const filteredProjects = useMemo(() => projects, [projects]);
  const pagedProjects = useMemo(() => projects, [projects]);
  const totalPages = useMemo(() => Math.max(1, serverPagination.total), [serverPagination.total]);
  const hasProjects = useMemo(() => filteredProjects.length > 0, [filteredProjects.length]);

  // Error State
  if (error && !projects.length) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-2">Error Loading Projects</h3>
          <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
          <Button 
            onClick={() => { setError(null); fetchProjects(); }}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Loading State
  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          {/* Header Skeleton */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96"></div>
            </div>
            <div className="flex gap-3">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            </div>
          </div>
          
          {/* Filters Skeleton */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                <div className="h-10 bg-gray-200 dark:bg-gray-600 rounded w-64"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-600 rounded w-40"></div>
              </div>
              <div className="flex gap-3">
                <div className="h-10 bg-gray-200 dark:bg-gray-600 rounded w-24"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-600 rounded w-32"></div>
              </div>
            </div>
          </div>
          
          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(pageSize)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
                    </div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-16"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-2/3"></div>
                  </div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Enhanced Header with Statistics */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Manajemen Proyek
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Kelola proyek-proyek YK Construction di Karawang dan sekitarnya
          </p>
          
          {/* Quick Stats */}
          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {serverPagination.count} total proyek
              </span>
            </div>
            {error && (
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">Error loading data</span>
              </div>
            )}
            {refreshing && (
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span className="text-sm">Refreshing...</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button
            onClick={() => setShowCreate(true)}
            variant="primary"
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Proyek Baru
          </Button>
        </div>
      </div>

      {/* Enhanced Filters & Search */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari proyek, klien, atau lokasi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-slate-800 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-slate-800 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Semua Status</option>
              <option value="planning">Perencanaan</option>
              <option value="in_progress">Berlangsung</option>
              <option value="completed">Selesai</option>
              <option value="on_hold">Ditunda</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-slate-800 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Semua Prioritas</option>
              <option value="critical">Kritis</option>
              <option value="high">Tinggi</option>
              <option value="medium">Sedang</option>
              <option value="low">Rendah</option>
            </select>
          </div>
          
          {/* View Controls */}
          <div className="flex items-center gap-3">
            <Button
              onClick={handleViewModeToggle}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              {viewMode === 'grid' ? (
                <>
                  <List className="h-4 w-4" />
                  Table
                </>
              ) : (
                <>
                  <Grid className="h-4 w-4" />
                  Grid
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        
        {/* Advanced Filters Toggle */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400"
          >
            <Filter className="h-4 w-4" />
            {showFilters ? 'Sembunyikan Filter' : 'Filter Lanjutan'}
          </Button>
          
          {showFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-slate-800 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="name">Urutkan: Nama</option>
                <option value="createdAt">Urutkan: Tanggal Dibuat</option>
                <option value="startDate">Urutkan: Tanggal Mulai</option>
                <option value="budget">Urutkan: Budget</option>
              </select>
              
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-slate-800 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="asc">A-Z / Lama-Baru</option>
                <option value="desc">Z-A / Baru-Lama</option>
              </select>
              
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('');
                  setPriorityFilter('');
                  setSortBy('name');
                  setSortOrder('asc');
                }}
                variant="outline"
                size="sm"
              >
                Reset Filter
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Enhanced Projects Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pagedProjects.map((project) => {
            const statusInfo = getStatusInfo(project.status);
            
            return (
              <Card 
                key={project.id} 
                className="group hover:shadow-lg transition-all duration-200 cursor-pointer
                           bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700"
                onClick={() => navigate(`/admin/projects/${project.id}`)}
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 
                                     group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {project.projectCode || 'No Code'}
                      </p>
                    </div>
                    
                    <Badge variant={statusInfo.variant} className="ml-3 flex-shrink-0">
                      {statusInfo.text}
                    </Badge>
                  </div>

                  {/* Client Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Building className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{project.client?.company || 'No Client'}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">
                        {project.location?.city || 'No City'}, {project.location?.province || 'No Province'}
                      </span>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{formatDate(project.timeline?.startDate)}</span>
                    </div>
                    <span>—</span>
                    <span>{formatDate(project.timeline?.endDate)}</span>
                  </div>

                  {/* Budget */}
                  <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <DollarSign className="h-4 w-4 mr-1" />
                      <span>Budget</span>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(
                        project.budget?.contractValue || 
                        project.budget?.approvedBudget || 
                        project.budget?.total || 0
                      )}
                    </span>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Progress</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {project.progress?.percentage || 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          (project.progress?.percentage || 0) >= 90 ? 'bg-green-500' :
                          (project.progress?.percentage || 0) >= 70 ? 'bg-blue-500' :
                          (project.progress?.percentage || 0) >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${project.progress?.percentage || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        /* Enhanced Table View */
        <Card className="p-0 overflow-hidden">
          <ProjectTable 
            projects={pagedProjects}
            onEdit={(project) => console.log('Edit project:', project)}
            onDelete={(project) => console.log('Delete project:', project)}
          />
        </Card>
      )}      {/* Enhanced Empty State */}
      {!hasProjects && (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 mx-auto mb-6 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
              <Building className="h-12 w-12 text-blue-500 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {searchTerm || statusFilter || priorityFilter ? 'Tidak ada proyek ditemukan' : 'Belum ada proyek'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm || statusFilter || priorityFilter ? 
                'Coba ubah filter pencarian atau buat proyek baru' : 
                'Mulai dengan membuat proyek konstruksi pertama Anda'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {(searchTerm || statusFilter || priorityFilter) && (
                <Button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('');
                    setPriorityFilter('');
                  }}
                  variant="outline"
                >
                  Reset Filter
                </Button>
              )}
              <Button
                onClick={() => setShowCreate(true)}
                variant="primary"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Buat Proyek Baru
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Enhanced Pagination */}
      {hasProjects && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Menampilkan {((page - 1) * pageSize) + 1} - {Math.min(page * pageSize, serverPagination.count)} 
            dari {serverPagination.count} proyek
          </div>
          
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            showInfo={false}
            totalItems={serverPagination.count}
            itemsPerPage={pageSize}
          />
        </div>
      )}

      {/* Enhanced Create Project Modal */}
      <Modal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        title="Buat Proyek Baru"
        size="xl"
      >
        <form onSubmit={handleCreateProject} className="space-y-6">
          {/* Project Basic Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              Informasi Dasar Proyek
            </h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nama Proyek *
              </label>
              <input 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-slate-800 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           placeholder-gray-500 dark:placeholder-gray-400"
                value={formData.name} 
                onChange={(e) => handleFormChange('name', e.target.value)} 
                placeholder="Contoh: Pembangunan Gudang Distribusi KIIC" 
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Deskripsi Proyek
              </label>
              <textarea 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-slate-800 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           placeholder-gray-500 dark:placeholder-gray-400"
                rows={3}
                value={formData.description} 
                onChange={(e) => handleFormChange('description', e.target.value)} 
                placeholder="Deskripsi singkat tentang proyek konstruksi..." 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Prioritas Proyek
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-slate-800 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.priority}
                onChange={(e) => handleFormChange('priority', e.target.value)}
              >
                <option value="low">Rendah</option>
                <option value="medium">Sedang</option>
                <option value="high">Tinggi</option>
                <option value="critical">Kritis</option>
              </select>
            </div>
          </div>

          {/* Client Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              Informasi Klien
            </h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nama Perusahaan/Klien *
              </label>
              <input 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-slate-800 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           placeholder-gray-500 dark:placeholder-gray-400"
                value={formData.company} 
                onChange={(e) => handleFormChange('company', e.target.value)} 
                placeholder="Contoh: PT. Kawasan Industri Indotaisei" 
                required
              />
            </div>
          </div>

          {/* Location Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              Lokasi Proyek
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Kota/Kabupaten *
                </label>
                <input 
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-white dark:bg-slate-800 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             placeholder-gray-500 dark:placeholder-gray-400"
                  value={formData.city} 
                  onChange={(e) => handleFormChange('city', e.target.value)} 
                  placeholder="Karawang" 
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Provinsi *
                </label>
                <input 
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-white dark:bg-slate-800 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             placeholder-gray-500 dark:placeholder-gray-400"
                  value={formData.province} 
                  onChange={(e) => handleFormChange('province', e.target.value)} 
                  placeholder="Jawa Barat" 
                  required
                />
              </div>
            </div>
          </div>

          {/* Budget Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              Anggaran Proyek
            </h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nilai Kontrak/Budget (IDR) *
              </label>
              <input 
                type="number" 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-slate-800 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           placeholder-gray-500 dark:placeholder-gray-400"
                value={formData.value} 
                onChange={(e) => handleFormChange('value', e.target.value)} 
                placeholder="5000000000" 
                min="0"
                required
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Masukkan nilai dalam Rupiah (tanpa titik atau koma)
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowCreate(false)}
              disabled={createProjectLoading}
            >
              Batal
            </Button>
            <Button 
              type="submit" 
              variant="primary"
              disabled={createProjectLoading}
              className="flex items-center gap-2"
            >
              {createProjectLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Buat Proyek
                </>
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Projects;
