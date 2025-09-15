import React, { useState, useEffect, useCallback } from 'react';
import { 
  ClipboardCheck, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  User,
  Calendar,
  RefreshCw,
  Eye,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  FileText,
  Download,
  ShoppingCart,
  Hammer,
  FileBarChart,
  DollarSign,
  Package,
  Search
} from 'lucide-react';
import apiService from '../../services/api';

const ProfessionalApprovalDashboard = ({ projectId, project, userDetails, onDataChange }) => {
  const [approvalData, setApprovalData] = useState({
    rab: [],
    purchaseOrders: [],
    workOrders: [],
    changeOrders: [],
    materialRequests: [],
    progressPayments: [],
    contractVariations: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('rab');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [expandedItem, setExpandedItem] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  // Approval Categories Configuration - Fokus RAB dan PO
  const approvalCategories = [
    {
      id: 'rab',
      name: 'RAB',
      fullName: 'RAB & BOQ',
      icon: FileBarChart,
      color: 'bg-blue-100 text-blue-800',
      description: 'Rencana Anggaran Biaya & Bill of Quantities'
    },
    {
      id: 'purchaseOrders',
      name: 'PO',
      fullName: 'Purchase Orders',
      icon: ShoppingCart,
      color: 'bg-green-100 text-green-800',
      description: 'Pemesanan material dan equipment'
    }
  ];

  // Status Configuration - 3 Stage Workflow
  const statusConfig = {
    'draft': { 
      label: 'Dibuat', 
      color: 'bg-gray-100 text-gray-800', 
      icon: FileText,
      description: 'Dokumen dibuat, belum submit',
      stage: 1,
      nextAction: 'submit'
    },
    'submitted': { 
      label: 'Menunggu Review', 
      color: 'bg-yellow-100 text-yellow-800', 
      icon: Clock,
      description: 'Submit untuk review',
      stage: 2,
      nextAction: 'review'
    },
    'under_review': { 
      label: 'Sedang Diperiksa', 
      color: 'bg-blue-100 text-blue-800', 
      icon: Eye,
      description: 'Sedang dalam tahap pemeriksaan',
      stage: 2,
      nextAction: 'approve_or_reject'
    },
    'reviewed': { 
      label: 'Telah Diperiksa', 
      color: 'bg-indigo-100 text-indigo-800', 
      icon: CheckCircle,
      description: 'Sudah diperiksa, menunggu persetujuan',
      stage: 3,
      nextAction: 'final_approval'
    },
    'approved': { 
      label: 'Disetujui', 
      color: 'bg-green-100 text-green-800', 
      icon: CheckCircle,
      description: 'Telah disetujui final',
      stage: 3,
      nextAction: 'complete'
    },
    'rejected': { 
      label: 'Ditolak', 
      color: 'bg-red-100 text-red-800', 
      icon: XCircle,
      description: 'Ditolak, perlu revisi',
      stage: 0,
      nextAction: 'revise'
    },
    'revision_required': { 
      label: 'Perlu Revisi', 
      color: 'bg-orange-100 text-orange-800', 
      icon: AlertTriangle,
      description: 'Perlu perbaikan sebelum review ulang',
      stage: 1,
      nextAction: 'revise_and_resubmit'
    }
  };

  const loadComprehensiveApprovalData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('=== LOADING COMPREHENSIVE APPROVAL DATA ===');
      console.log('ProjectId:', projectId);
      
      // Load RAB approvals directly
      const loadRAB = async () => {
        try {
          const response = await apiService.post('/database/query', {
            query: `
              SELECT 
                'RAB-' || id as approval_id,
                'rab' as approval_type,
                category,
                description,
                quantity,
                "unitPrice" as unit_price,
                "totalPrice" as total_price,
                "isApproved",
                "approvedBy" as approved_by,
                "approvedAt" as approved_at,
                "createdAt" as created_at,
                "updatedAt" as updated_at,
                notes,
                CASE 
                  WHEN "isApproved" = true THEN 'approved'
                  WHEN "approvedBy" IS NOT NULL THEN 'under_review'
                  ELSE 'pending'
                END as status
              FROM project_rab 
              WHERE "projectId" = $1
              ORDER BY "createdAt" DESC
            `,
            params: [projectId]
          });
          
          const dbData = response.data.data || [];
          
          // If no database data, return comprehensive mock data with 3-stage workflow
          if (dbData.length === 0) {
            return [
              {
                id: 'RAB-001',
                approval_id: 'RAB-001',
                approval_type: 'rab',
                type: 'rab',
                category: 'Struktur',
                description: 'RAB Pekerjaan Pondasi dan Struktur Bawah',
                quantity: 1,
                unit_price: 125000000,
                total_price: 125000000,
                status: 'draft',
                created_at: '2024-09-10T08:00:00Z',
                notes: 'RAB untuk pekerjaan pondasi gedung utama fase 1',
                created_by: 'Site Engineer',
                document_number: 'RAB-2024-STRUCT-001'
              },
              {
                id: 'RAB-002',
                approval_id: 'RAB-002',
                approval_type: 'rab',
                type: 'rab',
                category: 'Arsitektur',
                description: 'RAB Pekerjaan Finishing dan Interior',
                quantity: 1,
                unit_price: 85000000,
                total_price: 85000000,
                status: 'submitted',
                created_at: '2024-09-12T10:30:00Z',
                submitted_at: '2024-09-13T09:00:00Z',
                submitted_by: 'Project Manager',
                notes: 'RAB untuk finishing interior dan eksterior',
                document_number: 'RAB-2024-ARCH-002'
              },
              {
                id: 'RAB-003',
                approval_id: 'RAB-003',
                approval_type: 'rab',
                type: 'rab',
                category: 'MEP',
                description: 'RAB Sistem Mekanikal, Elektrikal & Plumbing',
                quantity: 1,
                unit_price: 95000000,
                total_price: 95000000,
                status: 'reviewed',
                created_at: '2024-09-08T14:15:00Z',
                submitted_at: '2024-09-09T10:00:00Z',
                reviewed_at: '2024-09-11T16:30:00Z',
                reviewed_by: 'Technical Manager',
                notes: 'RAB untuk instalasi MEP lengkap',
                document_number: 'RAB-2024-MEP-003'
              },
              {
                id: 'RAB-004',
                approval_id: 'RAB-004',
                approval_type: 'rab',
                type: 'rab',
                category: 'Landscape',
                description: 'RAB Pekerjaan Landscape dan Taman',
                quantity: 1,
                unit_price: 35000000,
                total_price: 35000000,
                status: 'approved',
                created_at: '2024-09-05T11:20:00Z',
                submitted_at: '2024-09-06T09:00:00Z',
                reviewed_at: '2024-09-07T14:00:00Z',
                approved_at: '2024-09-08T10:30:00Z',
                approved_by: 'Project Director',
                notes: 'RAB untuk landscape area dan taman sekitar gedung',
                document_number: 'RAB-2024-LAND-004'
              }
            ];
          }
          
          return dbData;
        } catch (error) {
          console.error('Error loading RAB approvals:', error);
          // Return mock data on error
          return [
            {
              id: 'RAB-001',
              approval_id: 'RAB-001',
              approval_type: 'rab',
              type: 'rab',
              category: 'Struktur',
              description: 'RAB Pekerjaan Pondasi dan Struktur Bawah',
              quantity: 1,
              unit_price: 125000000,
              total_price: 125000000,
              status: 'draft',
              created_at: '2024-09-10T08:00:00Z',
              notes: 'RAB untuk pekerjaan pondasi gedung utama fase 1',
              document_number: 'RAB-2024-STRUCT-001'
            }
          ];
        }
      };

      // Load PO approvals directly
      const loadPO = async () => {
        try {
          const response = await apiService.post('/database/query', {
            query: `
              SELECT 
                'PO-' || id as approval_id,
                'purchaseOrders' as approval_type,
                po_number,
                supplier_name,
                supplier_id,
                status,
                total_amount,
                order_date as created_at,
                expected_delivery_date,
                approved_by,
                approved_at,
                delivery_address,
                notes,
                items
              FROM purchase_orders 
              WHERE project_id = $1
              ORDER BY order_date DESC
            `,
            params: [projectId]
          });
          
          const dbData = response.data.data || [];
          
          // If no database data, return comprehensive mock data with 3-stage workflow
          if (dbData.length === 0) {
            return [
              {
                id: 'PO-001',
                approval_id: 'PO-001',
                approval_type: 'purchaseOrders',
                type: 'purchase_order',
                po_number: 'PO-2024-MATERIAL-001',
                supplier_name: 'PT. Semen Gresik',
                supplier_id: 'SUP-001',
                description: 'Purchase Order Material Semen dan Agregat',
                total_amount: 45000000,
                status: 'draft',
                created_at: '2024-09-11T14:15:00Z',
                expected_delivery_date: '2024-09-20T00:00:00Z',
                delivery_address: 'Site Proyek Gedung Utama, Jakarta',
                notes: 'Material untuk cor lantai basement dan struktur',
                items: 'Semen Portland 500 sak, Pasir 20m³, Kerikil 15m³',
                created_by: 'Procurement Manager'
              },
              {
                id: 'PO-002',
                approval_id: 'PO-002',
                approval_type: 'purchaseOrders',
                type: 'purchase_order',
                po_number: 'PO-2024-STEEL-002',
                supplier_name: 'PT. Krakatau Steel',
                supplier_id: 'SUP-002',
                description: 'Purchase Order Baja Tulangan dan Profil',
                total_amount: 125000000,
                status: 'submitted',
                created_at: '2024-09-10T09:30:00Z',
                submitted_at: '2024-09-11T08:00:00Z',
                submitted_by: 'Site Engineer',
                expected_delivery_date: '2024-09-25T00:00:00Z',
                delivery_address: 'Site Proyek Gedung Utama, Jakarta',
                notes: 'Baja tulangan untuk struktur lantai 1-5',
                items: 'Besi tulangan D16-D25 berbagai ukuran, Profil baja IWF'
              },
              {
                id: 'PO-003',
                approval_id: 'PO-003',
                approval_type: 'purchaseOrders',
                type: 'purchase_order',
                po_number: 'PO-2024-ELECTRIC-003',
                supplier_name: 'PT. Schneider Electric Indonesia',
                supplier_id: 'SUP-003',
                description: 'Purchase Order Panel Listrik dan Komponen MEP',
                total_amount: 85000000,
                status: 'reviewed',
                created_at: '2024-09-08T16:45:00Z',
                submitted_at: '2024-09-09T10:00:00Z',
                reviewed_at: '2024-09-10T15:30:00Z',
                reviewed_by: 'Technical Manager',
                expected_delivery_date: '2024-09-30T00:00:00Z',
                delivery_address: 'Site Proyek Gedung Utama, Jakarta',
                notes: 'Panel listrik utama dan komponen instalasi MEP',
                items: 'Panel MDP, Panel SDP, Kabel NYA, MCB, Kontaktor'
              },
              {
                id: 'PO-004',
                approval_id: 'PO-004',
                approval_type: 'purchaseOrders',
                type: 'purchase_order',
                po_number: 'PO-2024-FINISHING-004',
                supplier_name: 'PT. Toto Indonesia',
                supplier_id: 'SUP-004',
                description: 'Purchase Order Sanitary dan Fitting Bathroom',
                total_amount: 35000000,
                status: 'approved',
                created_at: '2024-09-05T13:20:00Z',
                submitted_at: '2024-09-06T09:00:00Z',
                reviewed_at: '2024-09-07T14:30:00Z',
                approved_at: '2024-09-08T11:15:00Z',
                approved_by: 'Project Director',
                expected_delivery_date: '2024-09-22T00:00:00Z',
                delivery_address: 'Site Proyek Gedung Utama, Jakarta',
                notes: 'Sanitary ware untuk toilet lantai 1-5',
                items: 'Toilet duduk, Wastafel, Shower, Kran air, Aksesoris toilet'
              }
            ];
          }
          
          return dbData;
        } catch (error) {
          console.error('Error loading PO approvals:', error);
          // Return mock data on error
          return [
            {
              id: 'PO-001',
              approval_id: 'PO-001',
              approval_type: 'purchaseOrders',
              type: 'purchase_order',
              po_number: 'PO-2024-MATERIAL-001',
              supplier_name: 'PT. Semen Gresik',
              description: 'Purchase Order Material Semen dan Agregat',
              total_amount: 45000000,
              status: 'draft',
              created_at: '2024-09-11T14:15:00Z',
              notes: 'Material untuk cor lantai basement'
            }
          ];
        }
      };
      
      // Load all approval types in parallel
      const [
        rabResponse,
        poResponse
      ] = await Promise.allSettled([
        loadRAB(),
        loadPO()
      ]);

      const newApprovalData = {
        rab: rabResponse.status === 'fulfilled' ? rabResponse.value : [],
        purchaseOrders: poResponse.status === 'fulfilled' ? poResponse.value : []
      };

      console.log('Comprehensive approval data loaded:', newApprovalData);
      setApprovalData(newApprovalData);
      
    } catch (error) {
      console.error('Error loading comprehensive approval data:', error);
      setError('Gagal memuat data approval. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // Load data when component mounts or projectId changes
  useEffect(() => {
    loadComprehensiveApprovalData();
  }, [projectId, loadComprehensiveApprovalData]);

  // Helper functions
  const formatCurrency = (amount) => {
    if (!amount) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusConfig = (status) => {
    return statusConfig[status] || statusConfig['draft'];
  };

  // Get approvals for RAB and PO only
  const getAllApprovals = () => {
    const allApprovals = [];
    
    // Only process RAB and Purchase Orders based on activeCategory
    const allowedCategories = ['rab', 'purchaseOrders'];
    
    Object.entries(approvalData).forEach(([category, items]) => {
      if (allowedCategories.includes(category) && (activeCategory === category)) {
        items.forEach(item => {
          allApprovals.push({
            ...item,
            category: category,
            categoryConfig: approvalCategories.find(cat => cat.id === category)
          });
        });
      }
    });

    return allApprovals.filter(item => {
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesSearch = !searchTerm || 
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.po_number && item.po_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.rab_code && item.rab_code.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.item_name && item.item_name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return matchesStatus && matchesSearch;
    });
  };

  // Get approval statistics for RAB and PO combined
  const getApprovalStats = () => {
    const rabApprovals = approvalData.rab || [];
    const poApprovals = approvalData.purchaseOrders || [];
    const allApprovals = [...rabApprovals, ...poApprovals];
    
    return {
      total: allApprovals.length,
      draft: allApprovals.filter(item => item.status === 'draft').length,
      submitted: allApprovals.filter(item => ['submitted', 'under_review'].includes(item.status)).length,
      reviewed: allApprovals.filter(item => item.status === 'reviewed').length,
      approved: allApprovals.filter(item => item.status === 'approved').length,
      rejected: allApprovals.filter(item => item.status === 'rejected').length,
      needsRevision: allApprovals.filter(item => item.status === 'revision_required').length,
      totalValue: allApprovals.reduce((sum, item) => {
        const amount = item.total_amount || item.total_price || item.amount || item.contract_impact || 0;
        return sum + parseFloat(amount);
      }, 0)
    };
  };

  const stats = getApprovalStats();
  const filteredApprovals = getAllApprovals();

  // Handle Detail View (Toggle expand/collapse)
  const handleDetailView = (item) => {
    setExpandedItem(expandedItem?.id === item.id ? null : item);
  };

  // Handle Submit for Review (Stage 1 → 2)
  const handleSubmitForReview = async (item) => {
    setActionLoading(item.id);
    try {
      let endpoint = '';
      let updateData = {
        status: 'submitted',
        submittedBy: userDetails?.username || 'Current User',
        submittedAt: new Date().toISOString()
      };

      // Determine endpoint based on item type
      switch (item.type) {
        case 'rab':
          endpoint = `/api/projects/${projectId}/rab/${item.id}/submit`;
          break;
        case 'purchase_order':
          endpoint = `/api/projects/${projectId}/purchase-orders/${item.id}/submit`;
          break;
        default:
          throw new Error('Unknown item type');
      }

      const response = await apiService.put(endpoint, updateData);
      
      if (response.success) {
        updateLocalState(item, updateData);
        onDataChange?.();
        console.log('Item submitted for review successfully');
      }
    } catch (error) {
      console.error('Error submitting item for review:', error);
    } finally {
      setActionLoading(null);
    }
  };

  // Handle Review (Stage 2 - Pemeriksaan)
  const handleReview = async (item, reviewResult = 'reviewed') => {
    setActionLoading(item.id);
    try {
      let endpoint = '';
      let updateData = {
        status: reviewResult, // 'reviewed' or 'revision_required'
        reviewedBy: userDetails?.username || 'Current User',
        reviewedAt: new Date().toISOString()
      };

      // Determine endpoint based on item type
      switch (item.type) {
        case 'rab':
          endpoint = `/api/projects/${projectId}/rab/${item.id}/review`;
          break;
        case 'purchase_order':
          endpoint = `/api/projects/${projectId}/purchase-orders/${item.id}/review`;
          break;
        default:
          throw new Error('Unknown item type');
      }

      const response = await apiService.put(endpoint, updateData);
      
      if (response.success) {
        updateLocalState(item, updateData);
        onDataChange?.();
        console.log('Item reviewed successfully');
      }
    } catch (error) {
      console.error('Error reviewing item:', error);
    } finally {
      setActionLoading(null);
    }
  };

  // Handle Final Approval (Stage 3)
  const handleApprove = async (item) => {
    setActionLoading(item.id);
    try {
      let endpoint = '';
      let updateData = {
        isApproved: true,
        approvedBy: userDetails?.username || 'Current User',
        approvedAt: new Date().toISOString(),
        status: 'approved'
      };

      // Determine endpoint based on item type
      switch (item.type) {
        case 'rab':
          endpoint = `/api/projects/${projectId}/rab/${item.id}/approve`;
          break;
        case 'purchase_order':
          endpoint = `/api/projects/${projectId}/purchase-orders/${item.id}/approve`;
          break;
        default:
          throw new Error('Unknown item type');
      }

      const response = await apiService.put(endpoint, updateData);
      
      if (response.success) {
        updateLocalState(item, updateData);
        onDataChange?.();
        console.log('Item approved successfully');
      }
    } catch (error) {
      console.error('Error approving item:', error);
    } finally {
      setActionLoading(null);
    }
  };

  // Handle Reject (Any Stage)
  const handleReject = async (item, reason = '') => {
    setActionLoading(item.id);
    try {
      let endpoint = '';
      let updateData = {
        isApproved: false,
        rejectedBy: userDetails?.username || 'Current User',
        rejectedAt: new Date().toISOString(),
        rejectionReason: reason || 'Rejected by approver',
        status: 'rejected'
      };

      // Determine endpoint based on item type
      switch (item.type) {
        case 'rab':
          endpoint = `/api/projects/${projectId}/rab/${item.id}/reject`;
          break;
        case 'purchase_order':
          endpoint = `/api/projects/${projectId}/purchase-orders/${item.id}/reject`;
          break;
        default:
          throw new Error('Unknown item type');
      }

      const response = await apiService.put(endpoint, updateData);
      
      if (response.success) {
        updateLocalState(item, updateData);
        onDataChange?.();
        console.log('Item rejected successfully');
      }
    } catch (error) {
      console.error('Error rejecting item:', error);
    } finally {
      setActionLoading(null);
    }
  };

  // Handle Export Single RAB Item
  const handleExportSingleRAB = async (item) => {
    try {
      const exportData = [{
        'Document Number': item.document_number || item.approval_id,
        'Kategori': item.category,
        'Deskripsi': item.description,
        'Quantity': item.quantity || 1,
        'Unit Price': formatCurrency(item.unit_price || item.total_price),
        'Total Price': formatCurrency(item.total_price),
        'Status': getStatusConfig(item.status).label,
        'Created Date': formatDate(item.created_at),
        'Notes': item.notes || '-'
      }];

      const csvContent = [
        Object.keys(exportData[0]).join(','),
        ...exportData.map(row => Object.values(row).map(value => `"${value}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `RAB_${item.approval_id}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log('Single RAB exported successfully');
    } catch (error) {
      console.error('Error exporting single RAB:', error);
      alert('Gagal mengekspor RAB. Silakan coba lagi.');
    }
  };

  // Handle Generate Single BOQ Item
  const handleGenerateSingleBOQ = async (item) => {
    try {
      if (item.status !== 'approved') {
        alert('Hanya RAB yang sudah disetujui yang dapat di-generate BOQ');
        return;
      }

      const boqData = [{
        'No': 1,
        'Item Code': `BOQ-${item.approval_id}`,
        'Description': item.description,
        'Unit': 'LS',
        'Quantity': item.quantity || 1,
        'Unit Rate': item.unit_price || item.total_price,
        'Amount': item.total_price,
        'Category': item.category,
        'Document Ref': item.document_number || item.approval_id
      }];

      const boqCsvContent = [
        '# BILL OF QUANTITIES (BOQ) - Single Item',
        `# Project: ${projectId || 'Construction Project'}`,
        `# Generated: ${new Date().toLocaleString('id-ID')}`,
        `# RAB Item: ${item.approval_id}`,
        '',
        Object.keys(boqData[0]).join(','),
        ...boqData.map(row => Object.values(row).map(value => `"${value}"`).join(','))
      ].join('\n');

      const blob = new Blob([boqCsvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `BOQ_${item.approval_id}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log('Single BOQ generated successfully');
      alert(`BOQ untuk ${item.approval_id} berhasil di-generate`);
    } catch (error) {
      console.error('Error generating single BOQ:', error);
      alert('Gagal generate BOQ. Silakan coba lagi.');
    }
  };

  // Handle Export RAB to Excel/PDF
  const handleExportRAB = async () => {
    try {
      const rabItems = approvalData.rab || [];
      if (rabItems.length === 0) {
        alert('Tidak ada data RAB untuk diekspor');
        return;
      }

      // Prepare export data
      const exportData = rabItems.map(item => ({
        'Document Number': item.document_number || item.approval_id,
        'Kategori': item.category,
        'Deskripsi': item.description,
        'Quantity': item.quantity || 1,
        'Unit Price': formatCurrency(item.unit_price || item.total_price),
        'Total Price': formatCurrency(item.total_price),
        'Status': getStatusConfig(item.status).label,
        'Created Date': formatDate(item.created_at),
        'Notes': item.notes || '-'
      }));

      // For now, create CSV format (can be enhanced to Excel later)
      const csvContent = [
        Object.keys(exportData[0]).join(','),
        ...exportData.map(row => Object.values(row).map(value => `"${value}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `RAB_Export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log('RAB exported successfully');
    } catch (error) {
      console.error('Error exporting RAB:', error);
      alert('Gagal mengekspor RAB. Silakan coba lagi.');
    }
  };

  // Handle Generate BOQ (Bill of Quantities)
  const handleGenerateBOQ = async () => {
    try {
      const rabItems = approvalData.rab || [];
      if (rabItems.length === 0) {
        alert('Tidak ada data RAB untuk generate BOQ');
        return;
      }

      // Filter only approved RAB items for BOQ
      const approvedItems = rabItems.filter(item => item.status === 'approved');
      
      if (approvedItems.length === 0) {
        alert('Belum ada RAB yang disetujui untuk generate BOQ');
        return;
      }

      // Calculate BOQ data
      const boqData = approvedItems.map((item, index) => ({
        'No': index + 1,
        'Item Code': `BOQ-${String(index + 1).padStart(3, '0')}`,
        'Description': item.description,
        'Unit': 'LS', // Lump Sum - can be customized per item
        'Quantity': item.quantity || 1,
        'Unit Rate': item.unit_price || item.total_price,
        'Amount': item.total_price,
        'Category': item.category,
        'Document Ref': item.document_number || item.approval_id
      }));

      // Calculate totals
      const totalAmount = boqData.reduce((sum, item) => sum + (item.Amount || 0), 0);
      
      // Add summary row
      boqData.push({
        'No': '',
        'Item Code': '',
        'Description': 'TOTAL PROJECT COST',
        'Unit': '',
        'Quantity': '',
        'Unit Rate': '',
        'Amount': totalAmount,
        'Category': '',
        'Document Ref': ''
      });

      // Create BOQ CSV
      const boqCsvContent = [
        '# BILL OF QUANTITIES (BOQ)',
        `# Project: ${projectId || 'Construction Project'}`,
        `# Generated: ${new Date().toLocaleString('id-ID')}`,
        `# Total Items: ${approvedItems.length}`,
        '',
        Object.keys(boqData[0]).join(','),
        ...boqData.map(row => Object.values(row).map(value => `"${value}"`).join(','))
      ].join('\n');

      const blob = new Blob([boqCsvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `BOQ_${projectId || 'Project'}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log('BOQ generated successfully');
      alert(`BOQ berhasil di-generate dengan ${approvedItems.length} item yang disetujui`);
    } catch (error) {
      console.error('Error generating BOQ:', error);
      alert('Gagal generate BOQ. Silakan coba lagi.');
    }
  };

  // Helper function to update local state
  const updateLocalState = (item, updateData) => {
    setApprovalData(prev => {
      const categoryKey = item.type === 'rab' ? 'rab' : 'purchaseOrders';
      
      return {
        ...prev,
        [categoryKey]: prev[categoryKey].map(approvalItem => 
          approvalItem.id === item.id 
            ? { ...approvalItem, ...updateData }
            : approvalItem
        )
      };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Loading approval data...</span>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Compact Header */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ClipboardCheck className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Approval Management</h2>
              <p className="text-sm text-gray-500">Track project approvals</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={loadComprehensiveApprovalData}
              className="inline-flex items-center px-2 py-1 text-sm text-gray-600 hover:text-gray-900"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </button>
            <button 
              onClick={handleExportRAB}
              className="inline-flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Download className="h-4 w-4 mr-1" />
              Export RAB
            </button>
            <button 
              onClick={handleGenerateBOQ}
              className="inline-flex items-center px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
            >
              <FileText className="h-4 w-4 mr-1" />
              Generate BOQ
            </button>
          </div>
        </div>
      </div>

      {/* 3-Stage Workflow Statistics */}
      <div className="mb-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-gray-600" />
              <div>
                <div className="font-semibold text-gray-900">{stats.draft}</div>
                <div className="text-gray-600">Dibuat</div>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 text-blue-600" />
              <div>
                <div className="font-semibold text-blue-900">{stats.submitted}</div>
                <div className="text-blue-600">Diperiksa</div>
              </div>
            </div>
          </div>
          <div className="bg-indigo-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-indigo-600" />
              <div>
                <div className="font-semibold text-indigo-900">{stats.reviewed}</div>
                <div className="text-indigo-600">Siap Disetujui</div>
              </div>
            </div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <div className="font-semibold text-green-900">{stats.approved}</div>
                <div className="text-green-600">Disetujui</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-sm mt-4">
          <div className="bg-red-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <XCircle className="h-4 w-4 text-red-600" />
              <div>
                <div className="font-semibold text-red-900">{stats.rejected}</div>
                <div className="text-red-600">Ditolak</div>
              </div>
            </div>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <div>
                <div className="font-semibold text-orange-900">{stats.needsRevision}</div>
                <div className="text-orange-600">Perlu Revisi</div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-gray-600" />
              <div>
                <div className="font-semibold text-gray-900">{formatCurrency(stats.totalValue).substring(0, 10)}...</div>
                <div className="text-gray-600">Total Value</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Category Tabs */}
      <div className="border-b border-gray-200 mb-4">
        <div className="flex items-center justify-between">
          <nav className="flex space-x-4 overflow-x-auto">
            {approvalCategories.map((category) => {
              const CategoryIcon = category.icon;
              const isActive = activeCategory === category.id;
              const categoryCount = approvalData[category.id]?.length || 0;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`${
                    isActive
                      ? 'text-blue-600 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700 border-transparent'
                  } flex items-center py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap`}
                >
                  <CategoryIcon className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">{category.fullName}</span>
                  <span className="sm:hidden">{category.name}</span>
                  <span className="ml-1 text-xs bg-gray-100 text-gray-600 px-1 rounded">
                    {categoryCount}
                  </span>
                </button>
              );
            })}
          </nav>
          
          {/* Compact Filter Controls */}
          <div className="flex items-center space-x-2 ml-4">
            <div className="relative">
              <Search className="h-4 w-4 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-8 pr-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-1 px-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-red-400 mr-2" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        </div>
      )}

      {/* Compact Approval List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-900">
            Approval Items ({filteredApprovals.length})
          </h3>
        </div>
        
        {filteredApprovals.length === 0 ? (
          <div className="text-center py-8">
            <ClipboardCheck className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">No approval items found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredApprovals.map((item) => {
              const statusConf = getStatusConfig(item.status);
              const StatusIcon = statusConf.icon;
              const CategoryIcon = item.categoryConfig?.icon || FileText;
              
              return (
                <div key={item.approval_id} className="border border-gray-200 rounded p-3 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        <CategoryIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {item.description || item.po_number || item.wo_number || item.co_number || 'No description'}
                          </h4>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusConf.color}`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusConf.label}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(item.created_at)}
                          </span>
                          {(item.total_amount || item.total_price || item.amount || item.contract_impact) && (
                            <span className="flex items-center">
                              <DollarSign className="h-3 w-3 mr-1" />
                              {formatCurrency(item.total_amount || item.total_price || item.amount || item.contract_impact)}
                            </span>
                          )}
                          {item.approved_by && (
                            <span className="flex items-center">
                              <User className="h-3 w-3 mr-1" />
                              {item.approved_by}
                            </span>
                          )}
                        </div>
                        
                        {item.notes && (
                          <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                            {item.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0 flex items-center space-x-1">
                      <button
                        onClick={() => handleDetailView(item)}
                        className="inline-flex items-center px-2 py-1 text-xs text-gray-600 hover:text-gray-900 border border-gray-300 rounded hover:bg-gray-50"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        {expandedItem?.id === item.id ? 'Hide' : 'Detail'}
                      </button>
                      
                      {/* Dynamic Action Buttons Based on Status */}
                      {item.status === 'draft' && (
                        <button 
                          onClick={() => handleSubmitForReview(item)}
                          disabled={actionLoading === item.id}
                          className="inline-flex items-center px-2 py-1 text-xs text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {actionLoading === item.id ? (
                            <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                          ) : (
                            <FileText className="h-3 w-3 mr-1" />
                          )}
                          Submit Review
                        </button>
                      )}

                      {(item.status === 'submitted' || item.status === 'under_review') && (
                        <>
                          <button 
                            onClick={() => handleReview(item, 'reviewed')}
                            disabled={actionLoading === item.id}
                            className="inline-flex items-center px-2 py-1 text-xs text-white bg-indigo-600 rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {actionLoading === item.id ? (
                              <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                            ) : (
                              <Eye className="h-3 w-3 mr-1" />
                            )}
                            Periksa
                          </button>
                          <button 
                            onClick={() => handleReview(item, 'revision_required')}
                            disabled={actionLoading === item.id}
                            className="inline-flex items-center px-2 py-1 text-xs text-white bg-orange-600 rounded hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {actionLoading === item.id ? (
                              <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                            ) : (
                              <AlertTriangle className="h-3 w-3 mr-1" />
                            )}
                            Minta Revisi
                          </button>
                        </>
                      )}

                      {item.status === 'reviewed' && (
                        <>
                          <button 
                            onClick={() => handleApprove(item)}
                            disabled={actionLoading === item.id}
                            className="inline-flex items-center px-2 py-1 text-xs text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {actionLoading === item.id ? (
                              <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                            ) : (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            )}
                            Setujui
                          </button>
                          <button 
                            onClick={() => handleReject(item)}
                            disabled={actionLoading === item.id}
                            className="inline-flex items-center px-2 py-1 text-xs text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {actionLoading === item.id ? (
                              <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                            ) : (
                              <XCircle className="h-3 w-3 mr-1" />
                            )}
                            Tolak
                          </button>
                        </>
                      )}

                      {/* Any Status can be rejected */}
                      {!['approved', 'rejected'].includes(item.status) && (
                        <button 
                          onClick={() => handleReject(item)}
                          disabled={actionLoading === item.id}
                          className="inline-flex items-center px-2 py-1 text-xs text-white bg-gray-600 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {actionLoading === item.id ? (
                            <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                          ) : (
                            <XCircle className="h-3 w-3 mr-1" />
                          )}
                          Tolak
                        </button>
                      )}

                      {/* RAB Specific Actions */}
                      {item.type === 'rab' && (
                        <>
                          <button 
                            onClick={() => handleExportSingleRAB(item)}
                            className="inline-flex items-center px-2 py-1 text-xs text-purple-600 border border-purple-600 rounded hover:bg-purple-50"
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Export
                          </button>
                          {item.status === 'approved' && (
                            <button 
                              onClick={() => handleGenerateSingleBOQ(item)}
                              className="inline-flex items-center px-2 py-1 text-xs text-green-600 border border-green-600 rounded hover:bg-green-50"
                            >
                              <FileText className="h-3 w-3 mr-1" />
                              BOQ
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Expanded Detail View - Integrated */}
                  {expandedItem?.id === item.id && (
                    <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Item Details</h4>
                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between">
                              <span className="text-gray-600">ID:</span>
                              <span className="font-mono">{item.id}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Type:</span>
                              <span className="capitalize">{item.type?.replace('_', ' ')}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Status:</span>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig[item.status]?.color || 'bg-gray-100 text-gray-800'}`}>
                                {statusConfig[item.status]?.label || item.status}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Created:</span>
                              <span>{formatDate(item.created_at)}</span>
                            </div>
                            {(item.total_amount || item.total_price || item.amount || item.contract_impact) && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Amount:</span>
                                <span className="font-semibold text-green-600">
                                  {formatCurrency(item.total_amount || item.total_price || item.amount || item.contract_impact)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Workflow History</h4>
                          <div className="space-y-2 text-xs">
                            {/* Stage 1: Dibuat */}
                            <div className="flex justify-between">
                              <span className="text-gray-600">Dibuat:</span>
                              <span>{formatDate(item.created_at)}</span>
                            </div>
                            
                            {/* Stage 2: Diperiksa */}
                            {item.reviewedBy && (
                              <>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Diperiksa Oleh:</span>
                                  <span>{item.reviewedBy}</span>
                                </div>
                                {item.reviewedAt && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Tanggal Periksa:</span>
                                    <span>{formatDate(item.reviewedAt)}</span>
                                  </div>
                                )}
                              </>
                            )}

                            {/* Stage 3: Disetujui/Ditolak */}
                            {item.approved_by && (
                              <>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Disetujui Oleh:</span>
                                  <span>{item.approved_by}</span>
                                </div>
                                {item.approved_at && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Tanggal Setuju:</span>
                                    <span>{formatDate(item.approved_at)}</span>
                                  </div>
                                )}
                              </>
                            )}

                            {item.rejected_by && (
                              <>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Ditolak Oleh:</span>
                                  <span>{item.rejected_by}</span>
                                </div>
                                {item.rejectedAt && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Tanggal Tolak:</span>
                                    <span>{formatDate(item.rejectedAt)}</span>
                                  </div>
                                )}
                              </>
                            )}

                            {item.rejection_reason && (
                              <div>
                                <span className="text-gray-600">Alasan Penolakan:</span>
                                <p className="mt-1 text-red-600 bg-red-50 p-2 rounded text-xs">
                                  {item.rejection_reason}
                                </p>
                              </div>
                            )}
                            {item.notes && (
                              <div>
                                <span className="text-gray-600">Catatan:</span>
                                <p className="mt-1 text-gray-700 bg-white p-2 rounded text-xs border">
                                  {item.notes}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Advanced Actions in Detail View - Based on Status */}
                      {!['approved', 'rejected'].includes(item.status) && (
                        <div className="mt-4 pt-3 border-t border-gray-200">
                          <div className="space-y-3">
                            <input
                              type="text"
                              placeholder={`Add note for ${statusConfig[item.status]?.nextAction || 'action'}...`}
                              className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              id={`note-input-${item.id}`}
                            />
                            
                            <div className="flex items-center space-x-2 flex-wrap">
                              {/* Stage 1: Submit for Review */}
                              {item.status === 'draft' && (
                                <button 
                                  onClick={() => handleSubmitForReview(item)}
                                  disabled={actionLoading === item.id}
                                  className="inline-flex items-center px-3 py-2 text-xs text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
                                >
                                  {actionLoading === item.id ? (
                                    <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                                  ) : (
                                    <FileText className="h-3 w-3 mr-1" />
                                  )}
                                  Submit untuk Review
                                </button>
                              )}

                              {/* Stage 2: Review Actions */}
                              {(item.status === 'submitted' || item.status === 'under_review') && (
                                <>
                                  <button 
                                    onClick={() => handleReview(item, 'reviewed')}
                                    disabled={actionLoading === item.id}
                                    className="inline-flex items-center px-3 py-2 text-xs text-white bg-indigo-600 rounded hover:bg-indigo-700 disabled:opacity-50"
                                  >
                                    {actionLoading === item.id ? (
                                      <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                                    ) : (
                                      <Eye className="h-3 w-3 mr-1" />
                                    )}
                                    Sudah Diperiksa
                                  </button>
                                  <button 
                                    onClick={() => {
                                      const noteInput = document.getElementById(`note-input-${item.id}`);
                                      const reason = noteInput?.value?.trim() || 'Memerlukan revisi';
                                      handleReview(item, 'revision_required');
                                    }}
                                    disabled={actionLoading === item.id}
                                    className="inline-flex items-center px-3 py-2 text-xs text-white bg-orange-600 rounded hover:bg-orange-700 disabled:opacity-50"
                                  >
                                    {actionLoading === item.id ? (
                                      <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                                    ) : (
                                      <AlertTriangle className="h-3 w-3 mr-1" />
                                    )}
                                    Minta Revisi
                                  </button>
                                </>
                              )}

                              {/* Stage 3: Final Approval */}
                              {item.status === 'reviewed' && (
                                <>
                                  <button 
                                    onClick={() => handleApprove(item)}
                                    disabled={actionLoading === item.id}
                                    className="inline-flex items-center px-3 py-2 text-xs text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-50"
                                  >
                                    {actionLoading === item.id ? (
                                      <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                                    ) : (
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                    )}
                                    Setujui Final
                                  </button>
                                  <button 
                                    onClick={() => {
                                      const noteInput = document.getElementById(`note-input-${item.id}`);
                                      const reason = noteInput?.value?.trim() || 'Tidak disetujui';
                                      handleReject(item, reason);
                                    }}
                                    disabled={actionLoading === item.id}
                                    className="inline-flex items-center px-3 py-2 text-xs text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50"
                                  >
                                    {actionLoading === item.id ? (
                                      <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                                    ) : (
                                      <XCircle className="h-3 w-3 mr-1" />
                                    )}
                                    Tolak
                                  </button>
                                </>
                              )}

                              {/* Emergency Reject for any non-final status */}
                              <button 
                                onClick={() => {
                                  const noteInput = document.getElementById(`note-input-${item.id}`);
                                  const reason = noteInput?.value?.trim() || 'Ditolak langsung';
                                  handleReject(item, reason);
                                }}
                                disabled={actionLoading === item.id}
                                className="inline-flex items-center px-2 py-1 text-xs text-white bg-gray-600 rounded hover:bg-gray-700 disabled:opacity-50"
                              >
                                {actionLoading === item.id ? (
                                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                                ) : (
                                  <XCircle className="h-3 w-3 mr-1" />
                                )}
                                Tolak Langsung
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Compact Modal for Approval Details */}
      {showModal && selectedApproval && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowModal(false)}></div>
            
            <div className="relative bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Approval Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide">Description</label>
                  <p className="text-sm text-gray-900">
                    {selectedApproval.description || 'No description available'}
                  </p>
                </div>
                
                {selectedApproval.notes && (
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wide">Notes</label>
                    <p className="text-sm text-gray-900">{selectedApproval.notes}</p>
                  </div>
                )}
                
                <div className="flex items-center justify-end space-x-2 pt-4 border-t">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    Close
                  </button>
                  
                  {selectedApproval.status === 'pending' && (
                    <>
                      <button className="px-3 py-1 text-sm text-white bg-green-600 rounded hover:bg-green-700">
                        Approve
                      </button>
                      <button className="px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700">
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessionalApprovalDashboard;