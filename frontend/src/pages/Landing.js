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
  Zap
} from 'lucide-react';
import axios from 'axios';

const Landing = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const clients = [
    { name: 'Pemkab Karawang', short: 'PK' },
    { name: 'LPSE Karawang', short: 'LPSE' },
    { name: 'KADIN Karawang', short: 'KADIN' },
    { name: 'BUMD Karawang', short: 'BUMD' },
  ];
  const testimonials = [
    {
      name: 'Ir. Bambang Suryadi',
      role: 'Pejabat Pembuat Komitmen',
      company: 'Dinas PUPR',
      quote: 'YK menunjukkan profesionalisme dan ketepatan waktu. Kualitas pekerjaan memuaskan dan sesuai spesifikasi.',
    },
    {
      name: 'Diana Sari',
      role: 'Facility Manager',
      company: 'PT. Maju Bersama',
      quote: 'Tim responsif, komunikasi jelas, dan hasil rapi. Rekomendasi untuk proyek skala menengah-besar di Karawang.',
    },
  ];

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '-';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  // Data perusahaan
  const companyStats = [
    { number: stats?.completed || '25+', label: 'Proyek Selesai', icon: CheckCircle },
    { number: '15+', label: 'Tahun Pengalaman', icon: Award },
    { number: '100+', label: 'Klien Puas', icon: Users },
    { number: 'ISO', label: 'Standar Mutu', icon: Shield }
  ];

  const services = [
    {
      title: 'Konstruksi Sipil',
      description: 'Pembangunan infrastruktur jalan, jembatan, dan fasilitas umum',
      icon: Building2,
      projects: ['Jalan Raya', 'Jembatan', 'Drainase', 'Irigasi']
    },
    {
      title: 'Bangunan Gedung',
      description: 'Konstruksi gedung perkantoran, sekolah, dan fasilitas publik',
      icon: Briefcase,
      projects: ['Gedung Perkantoran', 'Sekolah', 'Puskesmas', 'Balai Desa']
    },
    {
      title: 'Proyek Pemerintah',
      description: 'Penunjukan langsung dan lelang proyek Kabupaten Karawang',
      icon: Target,
      projects: ['Tender Pemerintah', 'Penunjukan Langsung', 'Pengadaan Barang']
    }
  ];

  // Fetch dynamic data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, projectsRes] = await Promise.all([
          axios.get('/projects/stats/overview'),
          axios.get('/projects', { params: { limit: 3, page: 1 } })
        ]);

        const s = statsRes?.data?.data || null;
        setStats(s);

        const list = (projectsRes?.data?.data || projectsRes?.data || []).slice(0, 3);
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
    <div className="min-h-screen bg-white">
      {/* Navigation */}
  <nav className="bg-white/90 backdrop-blur shadow-sm fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 size={24} className="text-white" />
              </div>
              <div className="ml-3">
                <div className="text-xl font-extrabold text-gray-900 tracking-tight">YK Construction</div>
                <div className="text-xs text-gray-500">Karawang</div>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-700 hover:text-blue-600 font-medium">Beranda</a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 font-medium">Tentang</a>
              <a href="#services" className="text-gray-700 hover:text-blue-600 font-medium">Layanan</a>
              <a href="#projects" className="text-gray-700 hover:text-blue-600 font-medium">Proyek</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 font-medium">Kontak</a>
              <Link 
                to="/admin" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Portal Admin
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-blue-600"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
                <a href="#home" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Beranda</a>
                <a href="#about" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Tentang</a>
                <a href="#services" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Layanan</a>
                <a href="#projects" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Proyek</a>
                <a href="#contact" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Kontak</a>
                <Link 
                  to="/admin" 
                  className="block px-3 py-2 bg-blue-600 text-white rounded-lg mt-2"
                >
                  Portal Admin
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative pt-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 overflow-hidden">
        {/* subtle pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{ backgroundImage: 'url(/hero-pattern.svg)', backgroundRepeat: 'repeat' }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
                Membangun Karawang
                <span className="text-blue-600"> dengan Standar Profesional</span>
              </h1>
              <p className="text-lg lg:text-xl text-gray-600 mb-8 leading-relaxed">
                Perusahaan kontraktor berizin dan berpengalaman di Kabupaten Karawang. Fokus pada proyek konstruksi sipil, infrastruktur, dan bangunan gedung untuk pemerintah dan swasta.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="#contact" 
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center justify-center"
                >
                  Konsultasi Gratis
                  <ArrowRight size={20} className="ml-2" />
                </a>
                <a 
                  href="#projects" 
                  className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center justify-center"
                >
                  Lihat Proyek Kami
                </a>
              </div>

              {/* Trust badges */}
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-600">
                <div className="bg-white/70 border border-gray-100 rounded-md py-2 px-3 text-center">LPSE Karawang</div>
                <div className="bg-white/70 border border-gray-100 rounded-md py-2 px-3 text-center">KADIN Karawang</div>
                <div className="bg-white/70 border border-gray-100 rounded-md py-2 px-3 text-center">ISO 9001</div>
                <div className="bg-white/70 border border-gray-100 rounded-md py-2 px-3 text-center">SMK3</div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-blue-600 rounded-2xl p-8 text-white">
                <div className="grid grid-cols-2 gap-6">
                  {companyStats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                      <div key={index} className="text-center">
                        <IconComponent size={32} className="mx-auto mb-2 text-blue-200" />
                        <div className="text-3xl font-extrabold">{stat.number}</div>
                        <div className="text-blue-200 text-sm">{stat.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title mb-4">Tentang YK Construction</h2>
            <p className="section-subtitle">
              Berdiri sejak 2009 di Karawang, kami menjadi mitra tepercaya pemerintah daerah dan industri dalam pembangunan infrastruktur, fasilitas publik, dan bangunan komersial.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award size={32} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Berpengalaman</h3>
              <p className="text-gray-600">
                Lebih dari 15 tahun pengalaman dalam industri konstruksi dengan track record yang solid.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield size={32} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Terpercaya</h3>
              <p className="text-gray-600">
                Dipercaya oleh Pemerintah Kabupaten Karawang untuk berbagai proyek strategis.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap size={32} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Inovatif</h3>
              <p className="text-gray-600">
                Menggunakan teknologi terkini dan metode konstruksi modern untuk hasil optimal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
  <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title mb-4">Layanan Kami</h2>
            <p className="section-subtitle">
              Solusi end-to-end: perencanaan, desain, konstruksi, hingga serah terima. Berfokus pada kualitas, keselamatan, dan ketepatan waktu.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                    <IconComponent size={24} className="text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{service.title}</h3>
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  <div className="space-y-2">
                    {service.projects.map((project, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-500">
                        <CheckCircle size={16} className="text-green-500 mr-2" />
                        {project}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Clients & Partners */}
      <section id="clients" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="section-title mb-3">Klien & Mitra</h2>
            <p className="section-subtitle">Dipercaya institusi pemerintah dan swasta di Karawang.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {clients.map((c) => (
              <div key={c.name} className="border border-gray-200 rounded-xl py-6 px-4 bg-white text-center hover:shadow-sm transition-shadow">
                <div className="mx-auto w-12 h-12 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-extrabold mb-2">
                  {c.short}
                </div>
                <div className="text-sm font-medium text-gray-700">{c.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title mb-4">Proyek Terbaru</h2>
            <p className="section-subtitle">Cuplikan proyek yang sedang dan telah kami kerjakan.</p>
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {recentProjects.map((p) => (
                <div key={p.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className="h-40 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                    <Building2 size={40} className="text-blue-600" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        p.status === 'completed' ? 'bg-green-100 text-green-800' :
                        p.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {p.status === 'completed' ? 'Selesai' : p.status === 'in_progress' ? 'Dalam Progres' : 'Perencanaan'}
                      </span>
                      <span className="text-sm text-gray-500">{new Date(p.timeline?.startDate || Date.now()).getFullYear()}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{p.name || p.title}</h3>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin size={16} className="mr-1" />
                      {p.location?.city || 'Karawang'}, {p.location?.province || 'Jawa Barat'}
                    </div>
                    <div className="text-sm text-gray-600 mb-1">Nilai Kontrak</div>
                    <div className="text-lg font-bold text-blue-600">{formatCurrency(p.budget?.contractValue || p.budget?.approvedBudget || p.budget?.total)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title mb-3">Apa Kata Klien</h2>
            <p className="section-subtitle">Umpan balik dari pemilik pekerjaan dan perusahaan di Karawang.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <p className="text-gray-700 leading-relaxed">“{t.quote}”</p>
                <div className="mt-4">
                  <div className="font-semibold text-gray-900">{t.name}</div>
                  <div className="text-sm text-gray-500">{t.role} — {t.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Download / Contact */}
      <section id="cta" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-10 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-extrabold">Siap memulai proyek di Karawang?</h3>
              <p className="text-blue-100 mt-2">Hubungi kami atau unduh company profile untuk informasi layanan dan portofolio.</p>
            </div>
            <div className="flex gap-3">
              <a href="#contact" className="bg-white text-blue-700 font-medium px-5 py-3 rounded-lg hover:bg-blue-50 transition-colors">Hubungi Kami</a>
              <a href="/company-profile-yk.pdf" className="bg-transparent border border-white/70 text-white font-medium px-5 py-3 rounded-lg hover:bg-white/10 transition-colors" target="_blank" rel="noreferrer">Unduh Company Profile</a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title mb-4">Hubungi Kami</h2>
            <p className="section-subtitle">Siap membantu mewujudkan proyek konstruksi Anda di Karawang dan sekitarnya.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Informasi Kontak</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <MapPin size={24} className="text-blue-600 mr-4 mt-1" />
                  <div>
                    <div className="font-semibold text-gray-900">Alamat Kantor</div>
                    <div className="text-gray-600">
                      Jl. Ahmad Yani No. 123<br />
                      Karawang Barat, Kabupaten Karawang<br />
                      Jawa Barat 41311
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone size={24} className="text-blue-600 mr-4 mt-1" />
                  <div>
                    <div className="font-semibold text-gray-900">Telepon</div>
                    <div className="text-gray-600">
                      +62 267 8654321<br />
                      +62 812 9876 5432
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail size={24} className="text-blue-600 mr-4 mt-1" />
                  <div>
                    <div className="font-semibold text-gray-900">Email</div>
                    <div className="text-gray-600">
                      info@ykconstruction.co.id<br />
                      project@ykconstruction.co.id
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <Calendar size={24} className="text-blue-600 mr-4 mt-1" />
                  <div>
                    <div className="font-semibold text-gray-900">Jam Operasional</div>
                    <div className="text-gray-600">
                      Senin - Jumat: 08:00 - 17:00<br />
                      Sabtu: 08:00 - 12:00
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Kirim Pesan</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="Nama lengkap Anda"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subjek</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Subjek pesan"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pesan</label>
                  <textarea 
                    rows="5" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Tulis pesan Anda..."
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Kirim Pesan
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
  <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Building2 size={24} className="text-white" />
                </div>
                <div className="ml-3">
      <div className="text-xl font-extrabold">YK Construction</div>
                  <div className="text-sm text-gray-400">Karawang</div>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                Membangun infrastruktur dan fasilitas berkualitas untuk kemajuan Kabupaten Karawang.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Layanan</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Konstruksi Sipil</li>
                <li>Bangunan Gedung</li>
                <li>Proyek Pemerintah</li>
                <li>Konsultasi Teknis</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Kontak</h4>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center">
                  <MapPin size={16} className="mr-2" />
                  Karawang, Jawa Barat
                </div>
                <div className="flex items-center">
                  <Phone size={16} className="mr-2" />
                  +62 267 8654321
                </div>
                <div className="flex items-center">
                  <Mail size={16} className="mr-2" />
                  info@ykconstruction.co.id
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} YK Construction. Semua hak cipta dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
