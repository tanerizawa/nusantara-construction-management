import { 
  Building2, 
  Users, 
  Award, 
  Shield,
  Briefcase,
  Target,
  Zap,
  Star,
  TrendingUp,
  Clock,
  DollarSign,
  Globe
} from 'lucide-react';

// Company statistics data
export const COMPANY_STATS = [
  { 
    number: '75+', 
    label: 'Proyek Selesai', 
    icon: Building2,
    description: 'Proyek infrastruktur dan konstruksi',
    color: 'from-blue-400 to-blue-600'
  },
  { 
    number: '15+', 
    label: 'Tahun Pengalaman', 
    icon: Clock,
    description: 'Melayani pembangunan infrastruktur',
    color: 'from-green-400 to-green-600'
  },
  { 
    number: '100%', 
    label: 'Tingkat Kepuasan', 
    icon: Star,
    description: 'Klien yang memberikan rating 5 bintang',
    color: 'from-purple-400 to-purple-600'
  },
  { 
    number: 'A+', 
    label: 'Rating Kualitas', 
    icon: Shield,
    description: 'Standar mutu dan keselamatan kerja',
    color: 'from-orange-400 to-orange-600'
  }
];

// Services data
export const SERVICES_DATA = [
  {
    title: 'Konstruksi Sipil',
    description: 'Pembangunan infrastruktur jalan, jembatan, dan fasilitas umum dengan teknologi modern dan standar internasional',
    icon: Building2,
    projects: ['Jalan Raya & Highways', 'Jembatan & Flyover', 'Sistem Drainase', 'Irigasi & Water Management'],
    image: '/images/services/sipil.svg',
    imageJpg: '/images/services/sipil.jpg',
    imageWebp: '/images/services/sipil.webp',
    stats: { projects: '45+', experience: '15 tahun' }
  },
  {
    title: 'Bangunan Gedung',
    description: 'Konstruksi gedung perkantoran, sekolah, dan fasilitas publik dengan desain arsitektur yang fungsional',
    icon: Briefcase,
    projects: ['Gedung Perkantoran', 'Fasilitas Pendidikan', 'Fasilitas Kesehatan', 'Balai Serbaguna'],
    image: '/images/services/gedung.svg',
    imageJpg: '/images/services/gedung.jpg',
    imageWebp: '/images/services/gedung.webp',
    stats: { projects: '30+', experience: '12 tahun' }
  },
  {
    title: 'Proyek Pemerintah',
    description: 'Spesialisasi dalam tender pemerintah, penunjukan langsung dan pengadaan infrastruktur publik',
    icon: Target,
    projects: ['Tender Pemerintah', 'Penunjukan Langsung', 'Pengadaan Infrastruktur', 'Fasilitas Publik'],
    image: '/images/services/pemerintah.svg',
    imageJpg: '/images/services/pemerintah.jpg',
    imageWebp: '/images/services/pemerintah.webp',
    stats: { projects: '60+', experience: '15 tahun' }
  }
];

// Clients data
export const CLIENTS_DATA = [
  { name: 'Pemkab Karawang', short: 'PK', logo: '/images/clients/pemkab.svg' },
  { name: 'LPSE Karawang', short: 'LPSE', logo: '/images/clients/lpse.svg' },
  { name: 'KADIN Karawang', short: 'KADIN', logo: '/images/clients/kadin.svg' },
  { name: 'BUMD Karawang', short: 'BUMD', logo: '/images/clients/bumd.svg' }
];

// Testimonials data
export const TESTIMONIALS_DATA = [
  {
    name: 'Ir. Bambang Suryadi',
    role: 'Pejabat Pembuat Komitmen',
    company: 'Dinas PUPR',
    quote: 'Nusantara Group menunjukkan profesionalisme dan ketepatan waktu yang luar biasa. Kualitas pekerjaan sangat memuaskan dan sesuai spesifikasi teknis yang ketat.',
    rating: 5,
    project: 'Pembangunan Jalan Raya Karawang Timur'
  },
  {
    name: 'Drs. Ahmad Hidayat, M.Si',
    role: 'Kepala Dinas Pendidikan',
    company: 'Pemkab Karawang',
    quote: 'Pembangunan gedung sekolah yang dikerjakan sangat berkualitas. Material yang digunakan berkualitas tinggi dan pengerjaan sesuai timeline yang disepakati.',
    rating: 5,
    project: 'Pembangunan SMAN 5 Karawang'
  },
  {
    name: 'Ir. Siti Nurhayati',
    role: 'Project Manager',
    company: 'PT Karawang Industrial Estate',
    quote: 'Sangat terkesan dengan manajemen proyek yang profesional. Tim teknis sangat kompeten dan komunikasi berjalan lancar selama pengerjaan proyek.',
    rating: 5,
    project: 'Infrastruktur Kawasan Industri'
  }
];

// About section data
export const ABOUT_DATA = {
  title: 'Tentang Nusantara Group',
  subtitle: 'Membangun Masa Depan Indonesia',
  description: 'PT Nusantara Group didirikan dengan visi menjadi perusahaan konstruksi terdepan di Indonesia. Dengan pengalaman lebih dari 15 tahun, kami telah menyelesaikan berbagai proyek infrastruktur dan bangunan gedung yang berkualitas tinggi.',
  values: [
    {
      title: 'Kualitas Terjamin',
      description: 'Standar internasional dalam setiap proyek',
      icon: Shield
    },
    {
      title: 'Tepat Waktu',
      description: 'Komitmen terhadap timeline yang disepakati',
      icon: Clock
    },
    {
      title: 'Profesional',
      description: 'Tim berpengalaman dan bersertifikat',
      icon: Award
    },
    {
      title: 'Inovasi',
      description: 'Teknologi konstruksi modern dan berkelanjutan',
      icon: Zap
    }
  ],
  certifications: [
    'ISO 9001:2015 - Quality Management',
    'SMK3 - Sistem Manajemen Keselamatan Kerja',
    'SIUJK - Surat Izin Usaha Jasa Konstruksi',
    'SBU - Sertifikat Badan Usaha'
  ]
};

// Why choose us data
export const WHY_CHOOSE_US_DATA = [
  {
    title: 'Pengalaman Terpercaya',
    description: 'Lebih dari 15 tahun pengalaman dalam industri konstruksi dengan track record yang solid',
    icon: Award,
    stats: '75+ Proyek Selesai'
  },
  {
    title: 'Tim Profesional',
    description: 'Tenaga ahli bersertifikat dan berpengalaman dalam bidang konstruksi dan manajemen proyek',
    icon: Users,
    stats: '50+ Ahli Konstruksi'
  },
  {
    title: 'Teknologi Modern',
    description: 'Menggunakan teknologi konstruksi terkini untuk efisiensi dan kualitas hasil yang optimal',
    icon: Zap,
    stats: 'Tech-Enabled'
  },
  {
    title: 'Jaminan Kualitas',
    description: 'Komitmen pada standar kualitas internasional dengan sistem manajemen yang tersertifikasi',
    icon: Shield,
    stats: 'ISO 9001:2015'
  }
];
