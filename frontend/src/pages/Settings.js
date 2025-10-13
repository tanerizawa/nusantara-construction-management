import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Bell,
  Globe,
  Palette,
  Database,
  Users,
  Wrench,
  Info,
  Construction,
  ArrowLeft,
  CheckCircle,
  Clock
} from 'lucide-react';
import DatabaseManagement from '../components/settings/DatabaseManagement';

const Settings = () => {
  const [selectedSection, setSelectedSection] = useState(null);

  const settingSections = [
    {
      title: 'Profil Pengguna',
      icon: User,
      description: 'Kelola informasi profil dan preferensi akun',
      status: 'coming-soon',
      color: '#0A84FF'
    },
    {
      title: 'Keamanan',
      icon: Shield,
      description: 'Pengaturan password, autentikasi dua faktor',
      status: 'coming-soon',
      color: '#FF453A'
    },
    {
      title: 'Notifikasi',
      icon: Bell,
      description: 'Atur preferensi notifikasi email dan push',
      status: 'coming-soon',
      color: '#FF9F0A'
    },
    {
      title: 'Bahasa & Lokalisasi',
      icon: Globe,
      description: 'Pilih bahasa dan format regional',
      status: 'coming-soon',
      color: '#30D158'
    },
    {
      title: 'Tema & Tampilan',
      icon: Palette,
      description: 'Kustomisasi tema dan layout aplikasi',
      status: 'coming-soon',
      color: '#BF5AF2'
    },
    {
      title: 'Database Management',
      icon: Database,
      description: 'Kelola database, backup, restore, dan testing',
      status: 'available',
      component: 'database',
      color: '#0A84FF'
    },
    {
      title: 'Manajemen Tim',
      icon: Users,
      description: 'Pengaturan tim dan permisi akses',
      status: 'coming-soon',
      color: '#64D2FF'
    },
    {
      title: 'Integrasi Sistem',
      icon: Wrench,
      description: 'Konfigurasi API dan integrasi pihak ketiga',
      status: 'coming-soon',
      color: '#FF9F0A'
    }
  ];

  const handleSectionClick = (section) => {
    if (section.status === 'available' && section.component) {
      setSelectedSection(section.component);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'coming-soon':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1" style={{
            backgroundColor: 'rgba(255, 159, 10, 0.1)',
            color: '#FF9F0A'
          }}>
            <Clock className="h-3 w-3" />
            Segera Hadir
          </span>
        );
      case 'available':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1" style={{
            backgroundColor: 'rgba(48, 209, 88, 0.1)',
            color: '#30D158'
          }}>
            <CheckCircle className="h-3 w-3" />
            Tersedia
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium" style={{
            backgroundColor: 'rgba(152, 152, 157, 0.1)',
            color: '#98989D'
          }}>
            Dalam Pengembangan
          </span>
        );
    }
  };

  // Jika ada section yang dipilih, tampilkan komponennya
  if (selectedSection === 'database') {
    return (
      <div className="min-h-screen p-6" style={{ backgroundColor: '#1C1C1E' }}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => setSelectedSection(null)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg mb-4 transition-colors"
              style={{
                backgroundColor: '#2C2C2E',
                border: '1px solid #38383A',
                color: '#FFFFFF'
              }}
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Pengaturan
            </button>
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(10, 132, 255, 0.1)' }}>
                <Database className="h-8 w-8" style={{ color: '#0A84FF' }} />
              </div>
              <h1 className="text-3xl font-bold" style={{ color: '#FFFFFF' }}>
                Database Management
              </h1>
            </div>
            <p style={{ color: '#98989D' }}>
              Kelola database, backup, restore, dan buat database baru untuk testing
            </p>
          </div>
          <DatabaseManagement />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#1C1C1E' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(10, 132, 255, 0.1)' }}>
              <SettingsIcon className="h-8 w-8" style={{ color: '#0A84FF' }} />
            </div>
            <h1 className="text-3xl font-bold" style={{ color: '#FFFFFF' }}>
              Pengaturan Sistem
            </h1>
          </div>
          <p style={{ color: '#98989D' }}>
            Kelola pengaturan aplikasi dan preferensi sistem Nusantara Construction Management
          </p>
        </div>

        {/* Under Construction Alert */}
        <div className="rounded-xl p-6 mb-8 flex items-start gap-4" style={{ 
          backgroundColor: 'rgba(10, 132, 255, 0.1)',
          border: '1px solid rgba(10, 132, 255, 0.2)'
        }}>
          <Construction className="h-6 w-6 flex-shrink-0" style={{ color: '#0A84FF' }} />
          <div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: '#FFFFFF' }}>
              Halaman Sedang Dalam Pengembangan
            </h3>
            <p className="text-sm" style={{ color: '#98989D' }}>
              Fitur pengaturan sistem sedang dalam tahap pengembangan. 
              Fitur-fitur di bawah ini akan segera tersedia dalam update mendatang.
            </p>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {settingSections.map((section, index) => {
            const IconComponent = section.icon;
            const isDisabled = section.status === 'coming-soon';
            
            return (
              <div
                key={index}
                className="rounded-xl transition-all duration-300 hover:border-opacity-100"
                style={{
                  backgroundColor: '#2C2C2E',
                  border: '1px solid #38383A',
                  opacity: isDisabled ? 0.7 : 1,
                  cursor: isDisabled ? 'not-allowed' : 'pointer'
                }}
                onClick={() => !isDisabled && handleSectionClick(section)}
              >
                {/* Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-lg" style={{ backgroundColor: `${section.color}15` }}>
                      <IconComponent className="h-6 w-6" style={{ color: section.color }} />
                    </div>
                    {getStatusBadge(section.status)}
                  </div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: '#FFFFFF' }}>
                    {section.title}
                  </h3>
                  <p className="text-sm" style={{ color: '#98989D' }}>
                    {section.description}
                  </p>
                </div>
                
                {/* Footer Button */}
                <div className="p-6 pt-0">
                  <button
                    disabled={isDisabled}
                    className="w-full px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                    style={{
                      backgroundColor: isDisabled ? '#38383A' : 'transparent',
                      border: `1px solid ${isDisabled ? '#48484A' : section.color}`,
                      color: isDisabled ? '#636366' : section.color,
                      cursor: isDisabled ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {isDisabled ? 'Segera Hadir' : 'Buka Pengaturan'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* System Information */}
        <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: '#2C2C2E', border: '1px solid #38383A' }}>
          <div className="flex items-center gap-2 mb-4">
            <Info className="h-5 w-5" style={{ color: '#0A84FF' }} />
            <h2 className="text-xl font-semibold" style={{ color: '#FFFFFF' }}>
              Informasi Sistem
            </h2>
          </div>
          <div className="h-px mb-4" style={{ backgroundColor: '#38383A' }}></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-sm mb-1" style={{ color: '#98989D' }}>
                Versi Aplikasi
              </p>
              <p className="text-lg font-bold" style={{ color: '#FFFFFF' }}>
                2.1.0
              </p>
            </div>
            <div>
              <p className="text-sm mb-1" style={{ color: '#98989D' }}>
                Lingkungan
              </p>
              <p className="text-lg font-bold" style={{ color: '#FFFFFF' }}>
                Development
              </p>
            </div>
            <div>
              <p className="text-sm mb-1" style={{ color: '#98989D' }}>
                Terakhir Update
              </p>
              <p className="text-lg font-bold" style={{ color: '#FFFFFF' }}>
                10 September 2025
              </p>
            </div>
            <div>
              <p className="text-sm mb-1" style={{ color: '#98989D' }}>
                Pengembang
              </p>
              <p className="text-lg font-bold" style={{ color: '#FFFFFF' }}>
                Nusantara Group
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl p-6" style={{ backgroundColor: '#2C2C2E', border: '1px solid #38383A' }}>
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#FFFFFF' }}>
            Aksi Cepat
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              disabled
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors text-sm font-medium"
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #38383A',
                color: '#636366',
                cursor: 'not-allowed'
              }}
            >
              <Database className="h-4 w-4" />
              Backup Data
            </button>
            <button
              disabled
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors text-sm font-medium"
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #38383A',
                color: '#636366',
                cursor: 'not-allowed'
              }}
            >
              <Shield className="h-4 w-4" />
              Audit Log
            </button>
            <button
              disabled
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors text-sm font-medium"
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #38383A',
                color: '#636366',
                cursor: 'not-allowed'
              }}
            >
              <Wrench className="h-4 w-4" />
              Diagnostik Sistem
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
