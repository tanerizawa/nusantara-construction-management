/**
 * File konstanta bahasa Indonesia untuk seluruh aplikasi
 * Semua teks yang ditampilkan ke pengguna harus didefinisikan di sini
 */

// Umum
export const common = {
  loading: 'Memuat...',
  error: 'Terjadi kesalahan',
  save: 'Simpan',
  cancel: 'Batal',
  confirm: 'Konfirmasi',
  back: 'Kembali',
  next: 'Lanjut',
  add: 'Tambah',
  edit: 'Edit',
  delete: 'Hapus',
  search: 'Cari',
  filter: 'Filter',
  reset: 'Reset',
  download: 'Unduh',
  upload: 'Unggah',
  view: 'Lihat',
  more: 'Selengkapnya',
  create: 'Buat',
  update: 'Perbarui',
  success: 'Berhasil',
  warning: 'Peringatan',
  info: 'Informasi'
};

// Status
export const status = {
  active: 'Aktif',
  inactive: 'Nonaktif',
  pending: 'Menunggu',
  completed: 'Selesai',
  rejected: 'Ditolak',
  approved: 'Disetujui',
  canceled: 'Dibatalkan',
  inProgress: 'Berlangsung',
  onHold: 'Ditunda',
  draft: 'Draf',
  published: 'Dipublikasikan',
  archived: 'Diarsipkan',
  suspended: 'Ditangguhkan',
  lowStock: 'Stok Rendah',
  outOfStock: 'Habis',
  reserved: 'Dipesan',
  discontinued: 'Dihentikan',
  paid: 'Dibayar',
  overdue: 'Terlambat'
};

// Peran Pengguna
export const roles = {
  admin: 'Administrator',
  projectManager: 'Manajer Proyek',
  financeManager: 'Manajer Keuangan',
  inventoryManager: 'Manajer Inventaris',
  hrManager: 'Manajer SDM',
  supervisor: 'Supervisor'
};

// Halaman Dashboard
export const dashboard = {
  title: 'Dashboard',
  welcome: 'Selamat datang',
  summary: 'Ringkasan',
  recentActivity: 'Aktivitas Terbaru',
  quickActions: 'Aksi Cepat',
  statistics: 'Statistik',
  performance: 'Performa'
};

// Halaman Analytics
export const analytics = {
  title: 'Dashboard Analitik',
  subtitle: 'Analitik komprehensif dan pelaporan untuk proyek konstruksi Anda',
  chartTitles: {
    projectPerformance: 'Performa Proyek',
    budgetAllocation: 'Alokasi Anggaran',
    resourceUtilization: 'Pemanfaatan Sumber Daya',
    timeline: 'Linimasa Proyek'
  }
};

// Halaman Users
export const users = {
  title: 'Manajemen Pengguna',
  subtitle: 'Kelola akun dan hak akses tim proyek',
  newUser: 'Pengguna Baru',
  searchPlaceholder: 'Cari berdasarkan username, email, atau nama...',
  allRoles: 'Semua Peran',
  userCount: '{count} pengguna',
  tableHeaders: {
    user: 'Pengguna',
    role: 'Peran',
    position: 'Posisi',
    joinDate: 'Bergabung',
    status: 'Status'
  },
  stats: {
    totalUsers: 'Total Pengguna',
    activeUsers: 'Pengguna Aktif',
    administrators: 'Administrator',
    managers: 'Manajer'
  },
  emptyState: {
    title: 'Belum ada pengguna',
    subtitle: 'Mulai dengan menambahkan pengguna baru'
  },
  noResults: {
    title: 'Tidak ada pengguna yang ditemukan',
    subtitle: 'Coba ubah filter pencarian Anda'
  }
};

// Halaman Approvals
export const approvals = {
  title: 'Dashboard Persetujuan',
  subtitle: 'Kelola alur kerja dan hierarki persetujuan',
  stats: {
    pending: 'Menunggu Persetujuan',
    approved: 'Disetujui',
    rejected: 'Ditolak'
  },
  workflowList: {
    title: 'Alur Kerja Memerlukan Tindakan Anda',
    emptyState: 'Tidak ada alur kerja yang memerlukan tindakan Anda',
    requestedBy: 'Diminta oleh',
    unknown: 'Tidak diketahui'
  },
  activityHistory: {
    title: 'Aktivitas Terbaru',
    headers: {
      workflow: 'Alur Kerja',
      date: 'Tanggal',
      action: 'Aksi',
      user: 'Pengguna'
    },
    actions: {
      approved: 'Disetujui',
      rejected: 'Ditolak',
      delegated: 'Didelegasikan',
      submitted: 'Diajukan',
      reviewed: 'Ditinjau'
    }
  },
  actions: {
    approve: 'Setujui',
    reject: 'Tolak',
    delegate: 'Delegasikan'
  }
};

// Halaman Proyek
export const projects = {
  title: 'Proyek',
  newProject: 'Proyek Baru',
  tableHeaders: {
    project: 'Proyek',
    budget: 'Anggaran',
    progress: 'Progress',
    timeline: 'Timeline',
    actions: 'Aksi'
  }
};

// Komponen UI
export const ui = {
  emptyState: {
    noData: 'Belum ada data',
    noDataDesc: 'Data akan ditampilkan di sini setelah Anda menambahkan item pertama.',
    addData: 'Tambah Data',
    noResults: 'Tidak ada hasil ditemukan',
    noResultsDesc: 'Coba ubah filter atau kata kunci pencarian Anda.',
    clearSearch: 'Hapus Pencarian',
    resetFilter: 'Reset Filter',
    error: 'Terjadi kesalahan',
    errorDesc: 'Terjadi kesalahan saat memuat data. Silakan coba lagi.',
    retry: 'Coba Lagi'
  },
  table: {
    actions: {
      view: 'Lihat',
      edit: 'Edit',
      delete: 'Hapus',
      duplicate: 'Duplikat',
      archive: 'Arsip',
      restore: 'Pulihkan',
      download: 'Unduh',
      share: 'Bagikan'
    }
  },
  pagination: {
    showing: 'Menampilkan',
    to: 'hingga',
    of: 'dari',
    items: 'item',
    page: 'Halaman',
    perPage: 'per halaman'
  }
};

// Pesan Error
export const errors = {
  required: 'Wajib diisi',
  invalidEmail: 'Format email tidak valid',
  invalidPhone: 'Format nomor telepon tidak valid',
  minLength: 'Minimal {length} karakter',
  maxLength: 'Maksimal {length} karakter',
  passwordMismatch: 'Password tidak cocok',
  serverError: 'Terjadi kesalahan pada server',
  networkError: 'Koneksi terputus. Periksa koneksi internet Anda.',
  unauthorized: 'Anda tidak memiliki akses ke halaman ini',
  sessionExpired: 'Sesi Anda telah berakhir. Silakan login kembali.'
};