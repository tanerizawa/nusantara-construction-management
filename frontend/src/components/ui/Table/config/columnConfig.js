// Column types and configurations for specialized tables

export const PROJECT_TABLE_COLUMNS = [
  {
    key: 'project',
    title: 'Proyek',
    sortable: true,
    filterable: true,
    render: (value, item) => ({
      type: 'project',
      data: {
        name: item?.name,
        client: item?.client?.company || item?.clientName,
        location: item?.location,
        status: item?.status
      }
    })
  },
  {
    key: 'budget',
    title: 'Anggaran',
    align: 'right',
    sortable: true,
    render: (value, item) => ({
      type: 'currency',
      data: item?.budget?.contractValue || item?.budget?.total || item?.budget || 0
    })
  },
  {
    key: 'progress',
    title: 'Progress',
    align: 'center',
    sortable: true,
    render: (value, item) => ({
      type: 'progress',
      data: {
        percentage: item?.progress?.percentage || item?.progress || 0,
        status: item?.status
      }
    })
  },
  {
    key: 'timeline',
    title: 'Timeline',
    sortable: true,
    render: (value, item) => ({
      type: 'timeline',
      data: {
        startDate: item?.timeline?.startDate || item?.startDate,
        endDate: item?.timeline?.endDate || item?.endDate
      }
    })
  },
  {
    key: 'actions',
    title: 'Aksi',
    width: '120px',
    render: (value, item) => ({
      type: 'actions',
      data: [
        { key: 'view', label: 'Lihat', icon: 'Eye' },
        { key: 'edit', label: 'Edit', icon: 'Edit' },
        { key: 'delete', label: 'Hapus', icon: 'Trash2', variant: 'danger' }
      ]
    })
  }
];

export const INVENTORY_TABLE_COLUMNS = [
  {
    key: 'item',
    title: 'Item',
    sortable: true,
    filterable: true,
    render: (value, item) => ({
      type: 'inventory_item',
      data: {
        name: item?.name,
        code: item?.code,
        category: item?.category,
        image: item?.image
      }
    })
  },
  {
    key: 'stock',
    title: 'Stok',
    align: 'center',
    sortable: true,
    render: (value, item) => ({
      type: 'stock',
      data: {
        current: item?.stock?.current || 0,
        minimum: item?.stock?.minimum || 0,
        unit: item?.unit
      }
    })
  },
  {
    key: 'price',
    title: 'Harga',
    align: 'right',
    sortable: true,
    render: (value, item) => ({
      type: 'currency',
      data: item?.price || 0
    })
  },
  {
    key: 'location',
    title: 'Lokasi',
    sortable: true,
    filterable: true,
    render: (value, item) => ({
      type: 'location',
      data: item?.location
    })
  },
  {
    key: 'status',
    title: 'Status',
    align: 'center',
    sortable: true,
    filterable: true,
    render: (value, item) => ({
      type: 'inventory_status',
      data: item?.status
    })
  }
];

export const FINANCIAL_TABLE_COLUMNS = [
  {
    key: 'transaction',
    title: 'Transaksi',
    sortable: true,
    filterable: true,
    render: (value, item) => ({
      type: 'transaction',
      data: {
        reference: item?.reference,
        description: item?.description,
        date: item?.date
      }
    })
  },
  {
    key: 'amount',
    title: 'Jumlah',
    align: 'right',
    sortable: true,
    render: (value, item) => ({
      type: 'financial_amount',
      data: {
        amount: item?.amount,
        type: item?.type // 'debit' or 'credit'
      }
    })
  },
  {
    key: 'account',
    title: 'Akun',
    sortable: true,
    filterable: true,
    render: (value, item) => ({
      type: 'account',
      data: {
        code: item?.account?.code,
        name: item?.account?.name
      }
    })
  },
  {
    key: 'status',
    title: 'Status',
    align: 'center',
    sortable: true,
    filterable: true,
    render: (value, item) => ({
      type: 'financial_status',
      data: item?.status
    })
  }
];

export const USER_TABLE_COLUMNS = [
  {
    key: 'user',
    title: 'Pengguna',
    sortable: true,
    filterable: true,
    render: (value, item) => ({
      type: 'user',
      data: {
        fullName: item?.profile?.fullName || item?.username,
        email: item?.email,
        username: item?.username,
        role: item?.role,
        avatar: item?.profile?.avatar
      }
    })
  },
  {
    key: 'role',
    title: 'Role',
    sortable: true,
    filterable: true,
    render: (value, item) => ({
      type: 'user_role',
      data: item?.role
    })
  },
  {
    key: 'position',
    title: 'Posisi',
    sortable: true,
    render: (value, item) => ({
      type: 'text',
      data: item?.profile?.position || '-'
    })
  },
  {
    key: 'joinDate',
    title: 'Bergabung',
    sortable: true,
    render: (value, item) => ({
      type: 'date',
      data: item?.profile?.joinDate
    })
  },
  {
    key: 'status',
    title: 'Status',
    align: 'center',
    sortable: true,
    filterable: true,
    render: (value, item) => ({
      type: 'user_status',
      data: item?.profile?.isActive
    })
  }
];

// Badge configurations for different data types
export const BADGE_CONFIGS = {
  status: {
    planning: { color: 'bg-yellow-100 text-yellow-800', text: 'Perencanaan' },
    'in-progress': { color: 'bg-blue-100 text-blue-800', text: 'Berlangsung' },
    completed: { color: 'bg-green-100 text-green-800', text: 'Selesai' },
    'on-hold': { color: 'bg-gray-100 text-gray-800', text: 'Ditunda' },
    cancelled: { color: 'bg-red-100 text-red-800', text: 'Dibatalkan' }
  },
  
  priority: {
    low: { color: 'bg-gray-100 text-gray-800', text: 'Rendah' },
    medium: { color: 'bg-yellow-100 text-yellow-800', text: 'Sedang' },
    high: { color: 'bg-orange-100 text-orange-800', text: 'Tinggi' },
    urgent: { color: 'bg-red-100 text-red-800', text: 'Mendesak' }
  },
  
  userRole: {
    admin: { color: 'bg-red-100 text-red-800', text: 'Administrator' },
    project_manager: { color: 'bg-blue-100 text-blue-800', text: 'Project Manager' },
    finance_manager: { color: 'bg-green-100 text-green-800', text: 'Finance Manager' },
    inventory_manager: { color: 'bg-purple-100 text-purple-800', text: 'Inventory Manager' },
    hr_manager: { color: 'bg-yellow-100 text-yellow-800', text: 'HR Manager' },
    supervisor: { color: 'bg-gray-100 text-gray-800', text: 'Supervisor' }
  },
  
  inventoryStatus: {
    available: { color: 'bg-green-100 text-green-800', text: 'Tersedia' },
    'low-stock': { color: 'bg-yellow-100 text-yellow-800', text: 'Stok Rendah' },
    'out-of-stock': { color: 'bg-red-100 text-red-800', text: 'Habis' },
    reserved: { color: 'bg-blue-100 text-blue-800', text: 'Dipesan' },
    discontinued: { color: 'bg-gray-100 text-gray-800', text: 'Dihentikan' }
  },
  
  financialStatus: {
    pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Menunggu' },
    approved: { color: 'bg-green-100 text-green-800', text: 'Disetujui' },
    rejected: { color: 'bg-red-100 text-red-800', text: 'Ditolak' },
    paid: { color: 'bg-blue-100 text-blue-800', text: 'Dibayar' },
    overdue: { color: 'bg-red-100 text-red-800', text: 'Terlambat' }
  }
};

export const ACTION_CONFIGS = {
  view: { label: 'Lihat', icon: 'Eye', variant: 'primary' },
  edit: { label: 'Edit', icon: 'Edit', variant: 'secondary' },
  delete: { label: 'Hapus', icon: 'Trash2', variant: 'danger' },
  duplicate: { label: 'Duplikat', icon: 'Copy', variant: 'secondary' },
  archive: { label: 'Arsip', icon: 'Archive', variant: 'warning' },
  restore: { label: 'Pulihkan', icon: 'RotateCcw', variant: 'success' },
  download: { label: 'Unduh', icon: 'Download', variant: 'secondary' },
  share: { label: 'Bagikan', icon: 'Share', variant: 'secondary' }
};

// Standard column configurations for export compatibility
export const DEFAULT_COLUMNS = [
  { id: 'id', header: 'ID', accessorKey: 'id' },
  { id: 'name', header: 'Name', accessorKey: 'name' },
  { id: 'description', header: 'Description', accessorKey: 'description' },
  { id: 'createdAt', header: 'Created At', accessorKey: 'createdAt' },
  { id: 'updatedAt', header: 'Updated At', accessorKey: 'updatedAt' }
];

export const PROJECT_COLUMNS = PROJECT_TABLE_COLUMNS;
export const INVENTORY_COLUMNS = INVENTORY_TABLE_COLUMNS;
export const FINANCIAL_COLUMNS = FINANCIAL_TABLE_COLUMNS;
export const USER_COLUMNS = USER_TABLE_COLUMNS;
export const REPORT_COLUMNS = [
  {
    key: 'report',
    title: 'Laporan',
    sortable: true,
    render: (value, item) => ({
      type: 'report',
      data: {
        title: item?.title,
        type: item?.type,
        date: item?.date
      }
    })
  },
  {
    key: 'period',
    title: 'Periode',
    sortable: true,
    render: (value, item) => ({
      type: 'date_range',
      data: {
        startDate: item?.period?.startDate,
        endDate: item?.period?.endDate
      }
    })
  },
  {
    key: 'author',
    title: 'Pembuat',
    sortable: true,
    render: (value, item) => ({
      type: 'user',
      data: item?.author
    })
  },
  {
    key: 'status',
    title: 'Status',
    align: 'center',
    sortable: true,
    render: (value, item) => ({
      type: 'badge',
      data: item?.status
    })
  },
  {
    key: 'actions',
    title: 'Aksi',
    width: '100px',
    render: (value, item) => ({
      type: 'actions',
      data: [
        { key: 'view', label: 'Lihat', icon: 'Eye' },
        { key: 'download', label: 'Unduh', icon: 'Download' }
      ]
    })
  }
];