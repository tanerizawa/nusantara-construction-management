import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  Award, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  CheckCircle,
  ArrowRight,
  Menu,
  X,
  Briefcase,
  Target,
  Shield,
  Zap,
  Star,
  TrendingUp,
  Clock,
  DollarSign,
  Globe,
  Linkedin,
  Instagram,
  Send,
  Play
} from 'lucide-react';
import { apiClient } from '../services/api';

const Landing = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  
  const clients = [
    { name: 'Pemkab Karawang', short: 'PK', logo: '/clients/pemkab.png' },
    { name: 'LPSE Karawang', short: 'LPSE', logo: '/clients/lpse.png' },
    { name: 'KADIN Karawang', short: 'KADIN', logo: '/clients/kadin.png' },
    { name: 'BUMD Karawang', short: 'BUMD', logo: '/clients/bumd.png' },
  ];
  
  const testimonials = [
    {
      name: 'Ir. Bambang Suryadi',
      role: 'Pejabat Pembuat Komitmen',
      company: 'Dinas PUPR',
      quote: 'Nusantara Group menunjukkan profesionalisme dan ketepatan waktu yang luar biasa. Kualitas pekerjaan sangat memuaskan dan sesuai spesifikasi teknis yang ketat.',
      rating: 5,
      avatar: '/avatars/bambang.jpg',
      project: 'Pembangunan Jembatan Citarum'
    },
    {
      name: 'Diana Sari, S.T.',
      role: 'Facility Manager',
      company: 'PT. Maju Bersama',
      quote: 'Tim yang sangat responsif, komunikasi yang jelas dan transparan, serta hasil akhir yang rapi. Sangat merekomendasikan untuk proyek skala menengah hingga besar di Karawang.',
      rating: 5,
      avatar: '/avatars/diana.jpg',
      project: 'Renovasi Pabrik Industrial'
    },
    {
      name: 'Drs. Ahmad Fauzi',
      role: 'Kepala Dinas',
      company: 'Dinas Pekerjaan Umum',
      quote: 'Pengalaman kerja sama yang sangat positif. Manajemen proyek yang baik, timeline yang konsisten, dan hasil yang sesuai harapan masyarakat Karawang.',
      rating: 5,
      avatar: '/avatars/ahmad.jpg',
      project: 'Infrastruktur Jalan Raya'
    }
  ];

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '-';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  // Data perusahaan dengan desain yang lebih menarik
  const companyStats = [
    { 
      number: (stats && stats.completed) ? stats.completed : '25+', 
      label: 'Proyek Selesai', 
      icon: CheckCircle,
      description: 'Proyek berhasil diselesaikan tepat waktu',
      color: 'from-green-400 to-green-600'
    },
    { 
      number: '15+', 
      label: 'Tahun Pengalaman', 
      icon: Award,
      description: 'Pengalaman dalam industri konstruksi',
      color: 'from-blue-400 to-blue-600'
    },
    { 
      number: '100+', 
      label: 'Klien Puas', 
      icon: Users,
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

  const services = [
    {
      title: 'Konstruksi Sipil',
      description: 'Pembangunan infrastruktur jalan, jembatan, dan fasilitas umum dengan teknologi modern dan standar internasional',
      icon: Building2,
      projects: ['Jalan Raya & Highways', 'Jembatan & Flyover', 'Sistem Drainase', 'Irigasi & Water Management'],
      image: '/services/sipil.jpg',
      stats: { projects: '45+', experience: '15 tahun' }
    },
    {
      title: 'Bangunan Gedung',
      description: 'Konstruksi gedung perkantoran, sekolah, dan fasilitas publik dengan desain arsitektur yang fungsional',
      icon: Briefcase,
      projects: ['Gedung Perkantoran', 'Fasilitas Pendidikan', 'Fasilitas Kesehatan', 'Balai Serbaguna'],
      image: '/services/gedung.jpg',
      stats: { projects: '30+', experience: '12 tahun' }
    },
    {
      title: 'Proyek Pemerintah',
      description: 'Spesialisasi dalam tender pemerintah, penunjukan langsung dan pengadaan infrastruktur publik',
      icon: Target,
      projects: ['Tender Pemerintah', 'Penunjukan Langsung', 'Pengadaan Infrastruktur', 'Fasilitas Publik'],
      image: '/services/pemerintah.jpg',
      stats: { projects: '60+', experience: '15 tahun' }
    }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Smooth scroll behavior
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  // Fetch dynamic data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, projectsRes] = await Promise.all([
          apiClient.get('/projects/stats/overview'),
          apiClient.get('/projects', { params: { limit: 3, page: 1 } })
        ]);

        const s = statsRes?.data?.data || null;
        setStats(s);

        const projectsData = projectsRes?.data?.data || projectsRes?.data || [];
        const list = Array.isArray(projectsData) ? projectsData.slice(0, 3) : [];
        setRecentProjects(list);
      } catch (e) {
        // fallback dummy when API not reachable
        setRecentProjects([
          { id: 'D1', name: 'Pembangunan Drainase Perumahan', location: { city: 'Karawang', province: 'Jawa Barat' }, status: 'completed', timeline: { startDate: '2024-01-01', endDate: '2024-06-01' }, budget: { contractValue: 3500000000 } },
          { id: 'D2', name: 'Perbaikan Jalan Desa Ciampel', location: { city: 'Karawang', province: 'Jawa Barat' }, status: 'in_progress', timeline: { startDate: '2024-03-01', endDate: '2024-10-01' }, budget: { contractValue: 1800000000 } },
          { id: 'D3', name: 'Renovasi Puskesmas Telukjambe', location: { city: 'Karawang', province: 'Jawa Barat' }, status: 'planning', timeline: { startDate: '2024-09-01', endDate: '2025-02-01' }, budget: { contractValue: 2200000000 } }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navigation - Enhanced with glassmorphism */}
      <nav className="bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-100 fixed w-full top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo - Enhanced */}
            <div className="flex items-center group">
              <div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                <Building2 size={28} className="text-white" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-black text-gray-900 tracking-tight">NUSANTARA GROUP</div>
                <div className="text-sm font-medium text-blue-600 -mt-1">Karawang Construction Excellence</div>
              </div>
            </div>

            {/* Desktop Menu - Enhanced */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-700 hover:text-blue-600 font-semibold transition-colors duration-300 relative group">
                Beranda
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 font-semibold transition-colors duration-300 relative group">
                Tentang
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#services" className="text-gray-700 hover:text-blue-600 font-semibold transition-colors duration-300 relative group">
                Layanan
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#projects" className="text-gray-700 hover:text-blue-600 font-semibold transition-colors duration-300 relative group">
                Proyek
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 font-semibold transition-colors duration-300 relative group">
                Kontak
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <Link 
                to="/login" 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transform"
              >
                Login
              </Link>
            </div>

            {/* Mobile menu button - Enhanced */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-blue-600 p-2 rounded-xl hover:bg-gray-100 transition-all duration-300"
              >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu - Enhanced */}
          {isMenuOpen && (
            <div className="md:hidden bg-white/95 backdrop-blur-lg border-t border-gray-100">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <a href="#home" className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 font-semibold">Beranda</a>
                <a href="#about" className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 font-semibold">Tentang</a>
                <a href="#services" className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 font-semibold">Layanan</a>
                <a href="#projects" className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 font-semibold">Proyek</a>
                <a href="#contact" className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 font-semibold">Kontak</a>
                <Link 
                  to="/login" 
                  className="block px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl mt-4 font-semibold text-center"
                >
                  Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section - Completely Redesigned */}
      <section id="home" className="relative pt-20 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden flex items-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-yellow-400 to-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        {/* Hero Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Hero Content */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-blue-200 text-blue-700 font-semibold text-sm shadow-lg">
                <Star className="w-4 h-4 mr-2 text-yellow-500" />
                #1 Kontraktor Terpercaya di Karawang
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-black text-gray-900 tracking-tight leading-tight">
                Membangun
                <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Masa Depan
                </span>
                <span className="block text-4xl lg:text-5xl text-gray-700 font-bold">
                  Karawang Bersama
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-2xl">
                Perusahaan kontraktor profesional dengan <span className="font-bold text-blue-600">15+ tahun pengalaman</span> 
                di Kabupaten Karawang. Spesialisasi konstruksi sipil, infrastruktur, dan bangunan gedung 
                dengan standar internasional.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="#contact" 
                  className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 inline-flex items-center justify-center font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transform"
                >
                  <span>Konsultasi Gratis</span>
                  <ArrowRight size={24} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </a>
                <a 
                  href="#projects" 
                  className="group bg-white/90 backdrop-blur-sm border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-2xl hover:bg-white hover:border-blue-300 transition-all duration-300 inline-flex items-center justify-center font-bold text-lg shadow-lg hover:shadow-xl"
                >
                  <Play size={20} className="mr-2" />
                  <span>Lihat Portofolio</span>
                </a>
              </div>

              {/* Trust badges - Enhanced */}
              <div className="pt-8">
                <p className="text-sm text-gray-500 mb-4 font-semibold">Dipercaya oleh:</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {['LPSE Karawang', 'KADIN Karawang', 'ISO 9001:2015', 'SMK3 Certified'].map((badge, index) => (
                    <div key={index} className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl py-3 px-4 text-center hover:shadow-lg transition-all duration-300 hover:scale-105 transform">
                      <div className="text-sm font-bold text-gray-700">{badge}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Hero Stats Card - Redesigned */}
            <div className="relative">
              <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-500 transform hover:scale-105">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Pencapaian Kami</h3>
                  <p className="text-gray-600">Rekam jejak yang membanggakan</p>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  {Array.isArray(companyStats) && companyStats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                      <div key={index} className="text-center group">
                        <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <IconComponent size={28} className="text-white" />
                        </div>
                        <div className="text-3xl font-black text-gray-900 mb-1">{stat.number}</div>
                        <div className="text-sm font-bold text-gray-700 mb-1">{stat.label}</div>
                        <div className="text-xs text-gray-500">{stat.description}</div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-60"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-br from-green-400 to-blue-500 rounded-full opacity-60"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section - Enhanced */}
      <section id="about" className="py-24 bg-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-semibold text-sm mb-6">
              <Building2 className="w-4 h-4 mr-2" />
              Tentang Perusahaan
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 tracking-tight">
              Mengapa Memilih 
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                NUSANTARA GROUP?
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Berdiri sejak 2009 di Karawang, kami telah menjadi mitra tepercaya pemerintah daerah dan industri 
              dalam pembangunan infrastruktur, fasilitas publik, dan bangunan komersial dengan standar kualitas internasional.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {[
              {
                icon: Award,
                title: 'Pengalaman Terpercaya',
                description: 'Lebih dari 15 tahun pengalaman dalam industri konstruksi dengan track record yang solid dan reputasi yang terjaga.',
                stats: '15+ Tahun',
                color: 'from-blue-500 to-blue-600',
                features: ['Manajemen Proyek Profesional', 'Tim Ahli Bersertifikat', 'Track Record Terbukti']
              },
              {
                icon: Shield,
                title: 'Standar Kualitas Tinggi',
                description: 'Dipercaya oleh Pemerintah Kabupaten Karawang untuk berbagai proyek strategis dengan standar mutu internasional.',
                stats: 'ISO 9001:2015',
                color: 'from-green-500 to-green-600',
                features: ['Sertifikasi ISO 9001:2015', 'SMK3 Compliance', 'Quality Assurance']
              },
              {
                icon: Zap,
                title: 'Teknologi & Inovasi',
                description: 'Menggunakan teknologi terkini dan metode konstruksi modern untuk hasil optimal dan efisiensi maksimal.',
                stats: '100% Digital',
                color: 'from-purple-500 to-purple-600',
                features: ['Building Information Modeling', 'Digital Project Management', 'Modern Equipment']
              }
            ].map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="group relative">
                  <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 h-full">
                    {/* Icon with gradient */}
                    <div className={`w-20 h-20 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent size={36} className="text-white" />
                    </div>
                    
                    {/* Stats badge */}
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-bold text-sm mb-4">
                      {item.stats}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {item.description}
                    </p>
                    
                    {/* Features list */}
                    <ul className="space-y-2">
                      {item.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-600">
                          <CheckCircle size={16} className="text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-indigo-600/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Additional stats row */}
          <div className="mt-20 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-100">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { number: '25+', label: 'Proyek Aktif', icon: TrendingUp },
                { number: '100+', label: 'Klien Puas', icon: Users },
                { number: '₹50M+', label: 'Total Kontrak', icon: DollarSign },
                { number: '24/7', label: 'Support', icon: Clock }
              ].map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="group">
                    <IconComponent size={24} className="mx-auto mb-2 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                    <div className="text-3xl font-black text-gray-900 mb-1">{stat.number}</div>
                    <div className="text-sm font-semibold text-gray-600">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section - Enhanced */}
      <section id="projects" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-50 border border-purple-200 text-purple-700 font-semibold text-sm mb-6">
              <Building2 className="w-4 h-4 mr-2" />
              Portofolio Proyek
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 tracking-tight">
              Proyek
              <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Terbaru Kami
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cuplikan proyek yang sedang dan telah kami kerjakan dengan standar kualitas terbaik
            </p>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Building2 size={24} className="text-blue-600" />
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {Array.isArray(recentProjects) && recentProjects.map((project, index) => (
                <div key={project.id} className="group relative">
                  <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
                    {/* Project image */}
                    <div className="h-56 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 flex items-center justify-center relative overflow-hidden">
                      <Building2 size={48} className="text-blue-600 z-10" />
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* Status badge */}
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                          project.status === 'completed' ? 'bg-green-100 text-green-800' :
                          project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {project.status === 'completed' ? 'Selesai' : 
                           project.status === 'in_progress' ? 'Dalam Progres' : 'Perencanaan'}
                        </span>
                      </div>
                      
                      {/* Year badge */}
                      <div className="absolute top-4 right-4">
                        <span className="bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full text-xs font-bold">
                          {new Date(project.timeline?.startDate || Date.now()).getFullYear()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                        {project.name || project.title}
                      </h3>
                      
                      <div className="flex items-center text-sm text-gray-600 mb-4">
                        <MapPin size={16} className="mr-2 text-gray-400" />
                        {project.location?.city || 'Karawang'}, {project.location?.province || 'Jawa Barat'}
                      </div>
                      
                      <div className="border-t border-gray-100 pt-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm text-gray-500 mb-1">Nilai Kontrak</div>
                            <div className="text-lg font-bold text-blue-600">
                              {formatCurrency(project.budget?.contractValue || project.budget?.approvedBudget || project.budget?.total)}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-500 mb-1">Timeline</div>
                            <div className="text-sm font-semibold text-gray-700">
                              {Math.ceil((new Date(project.timeline?.endDate) - new Date(project.timeline?.startDate)) / (1000 * 60 * 60 * 24 * 30))} bulan
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* CTA for more projects */}
          <div className="text-center mt-16">
            <Link 
              to="/admin"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              Lihat Semua Proyek
              <ArrowRight size={20} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials - Modern Carousel Design */}
      <section id="testimonials" className="py-24 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold text-sm mb-6">
              <Star className="w-4 h-4 mr-2 text-yellow-400" />
              Testimoni Klien
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 tracking-tight">
              Apa Kata
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Klien Kami?
              </span>
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Kepuasan dan kepercayaan klien adalah prioritas utama kami
            </p>
          </div>

          {/* Testimonial Carousel */}
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
              <div className="text-center">
                {/* Rating stars */}
                <div className="flex justify-center mb-6">
                  {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                    <Star key={i} size={24} className="text-yellow-400 fill-current" />
                  ))}
                </div>
                
                {/* Quote */}
                <blockquote className="text-xl lg:text-2xl text-white leading-relaxed mb-8 font-medium italic">
                  "{testimonials[activeTestimonial].quote}"
                </blockquote>
                
                {/* Author info */}
                <div className="flex items-center justify-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {testimonials[activeTestimonial].name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="text-left">
                    <div className="text-lg font-bold text-white">{testimonials[activeTestimonial].name}</div>
                    <div className="text-blue-200 font-medium">{testimonials[activeTestimonial].role}</div>
                    <div className="text-blue-300 text-sm">{testimonials[activeTestimonial].company}</div>
                  </div>
                </div>
                
                {/* Project badge */}
                <div className="mt-6">
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 font-semibold text-sm">
                    <Building2 className="w-4 h-4 mr-2" />
                    {testimonials[activeTestimonial].project}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Navigation dots */}
            <div className="flex justify-center space-x-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    activeTestimonial === index 
                      ? 'bg-white scale-125' 
                      : 'bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          </div>
          
          {/* Trust indicators */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { number: '5.0', label: 'Rating Rata-rata', icon: Star, color: 'text-yellow-400' },
              { number: '100+', label: 'Review Positif', icon: Users, color: 'text-green-400' },
              { number: '98%', label: 'Repeat Clients', icon: TrendingUp, color: 'text-blue-400' }
            ].map((metric, index) => {
              const IconComponent = metric.icon;
              return (
                <div key={index} className="text-center group">
                  <IconComponent size={32} className={`mx-auto mb-3 ${metric.color} group-hover:scale-110 transition-transform duration-300`} />
                  <div className="text-3xl font-black text-white mb-1">{metric.number}</div>
                  <div className="text-blue-200 font-semibold">{metric.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-50 border border-green-200 text-green-700 font-semibold text-sm mb-6">
              <Phone className="w-4 h-4 mr-2" />
              Hubungi Kami
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 tracking-tight">
              Siap Memulai
              <span className="block bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Proyek Anda?
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tim ahli kami siap membantu mewujudkan proyek konstruksi impian Anda di Karawang dan sekitarnya
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div className="space-y-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-8">Informasi Kontak</h3>
              
              {[
                {
                  icon: MapPin,
                  title: 'Alamat Kantor',
                  content: ['Jl. Ahmad Yani No. 123', 'Karawang Barat, Kabupaten Karawang', 'Jawa Barat 41311'],
                  color: 'from-blue-500 to-blue-600'
                },
                {
                  icon: Phone,
                  title: 'Telepon',
                  content: ['+62 267 8654321', '+62 812 9876 5432'],
                  color: 'from-green-500 to-green-600'
                },
                {
                  icon: Mail,
                  title: 'Email',
                  content: ['info@nusantaragroup.co.id', 'project@nusantaragroup.co.id'],
                  color: 'from-purple-500 to-purple-600'
                },
                {
                  icon: Calendar,
                  title: 'Jam Operasional',
                  content: ['Senin - Jumat: 08:00 - 17:00', 'Sabtu: 08:00 - 12:00'],
                  color: 'from-orange-500 to-orange-600'
                }
              ].map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div key={index} className="flex items-start group">
                    <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mr-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent size={24} className="text-white" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-900 mb-2">{item.title}</div>
                      <div className="text-gray-600 space-y-1">
                        {item.content.map((line, idx) => (
                          <div key={idx}>{line}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Contact Form */}
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
              <h3 className="text-3xl font-bold text-gray-900 mb-8">Kirim Pesan</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Nama Lengkap</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-300 font-medium"
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Email Address</label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-300 font-medium"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Subjek</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-300 font-medium"
                    placeholder="Subjek pesan Anda"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Pesan</label>
                  <textarea 
                    rows="6" 
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-300 font-medium resize-none"
                    placeholder="Deskripsikan proyek atau pertanyaan Anda..."
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center justify-center"
                >
                  <Send size={20} className="mr-2" />
                  Kirim Pesan
                </button>
              </form>
            </div>
          </div>
          
          {/* CTA Download */}
          <div className="mt-20">
            <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-12 text-white text-center shadow-2xl">
              <h3 className="text-3xl lg:text-4xl font-black mb-4">Butuh Informasi Lengkap?</h3>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Unduh company profile kami untuk mendapatkan informasi detail layanan, portofolio, dan sertifikasi perusahaan
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/company-profile-nusantara-group.pdf" 
                  className="bg-white/20 backdrop-blur-sm border border-white/30 text-white font-bold px-8 py-4 rounded-xl hover:bg-white/30 transition-all duration-300 inline-flex items-center justify-center"
                  target="_blank" 
                  rel="noreferrer"
                >
                  <Globe className="mr-2" size={20} />
                  Company Profile
                </a>
                <a 
                  href="#contact" 
                  className="bg-white text-blue-700 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-all duration-300 inline-flex items-center justify-center"
                >
                  <Phone className="mr-2" size={20} />
                  Hubungi Sekarang
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <Building2 size={28} className="text-white" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-black">NUSANTARA GROUP</div>
                  <div className="text-sm text-gray-400">Karawang Construction Excellence</div>
                </div>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed max-w-md">
                Membangun infrastruktur dan fasilitas berkualitas untuk kemajuan Kabupaten Karawang 
                dengan standar internasional dan komitmen terhadap kepuasan klien.
              </p>
              
              {/* Social Media */}
              <div className="flex space-x-4">
                {[
                  { icon: Linkedin, href: '#', label: 'LinkedIn' },
                  { icon: Instagram, href: '#', label: 'Instagram' },
                  { icon: Globe, href: '#', label: 'Website' }
                ].map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <a 
                      key={index}
                      href={social.href}
                      className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-blue-600 transition-colors duration-300 group"
                      aria-label={social.label}
                    >
                      <IconComponent size={20} className="group-hover:scale-110 transition-transform duration-300" />
                    </a>
                  );
                })}
              </div>
            </div>
            
            {/* Services */}
            <div>
              <h4 className="text-lg font-bold mb-6">Layanan Kami</h4>
              <ul className="space-y-3 text-gray-400">
                {['Konstruksi Sipil', 'Bangunan Gedung', 'Proyek Pemerintah', 'Konsultasi Teknis', 'Manajemen Proyek'].map((service, index) => (
                  <li key={index} className="hover:text-white transition-colors duration-300 cursor-pointer">
                    {service}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-bold mb-6">Kontak</h4>
              <div className="space-y-4 text-gray-400">
                <div className="flex items-start">
                  <MapPin size={18} className="mr-3 mt-1 flex-shrink-0" />
                  <div className="text-sm">
                    Jl. Ahmad Yani No. 123<br />
                    Karawang Barat, Jawa Barat
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone size={18} className="mr-3 flex-shrink-0" />
                  <div className="text-sm">+62 267 8654321</div>
                </div>
                <div className="flex items-center">
                  <Mail size={18} className="mr-3 flex-shrink-0" />
                  <div className="text-sm">info@nusantaragroup.co.id</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} NUSANTARA GROUP. Semua hak cipta dilindungi.
            </p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
