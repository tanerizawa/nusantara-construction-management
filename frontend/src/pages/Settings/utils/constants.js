import {
  User,
  Shield,
  Bell,
  Globe,
  Palette,
  Database,
  Users,
  Wrench
} from 'lucide-react';

/**
 * Settings sections configuration
 */
export const SETTINGS_SECTIONS = [
  {
    id: 'profile',
    title: 'Profil Pengguna',
    icon: User,
    description: 'Kelola informasi profil dan preferensi akun',
    status: 'coming-soon',
    color: '#0A84FF',
    path: '/settings/profile',
    favorite: false
  },
  {
    id: 'security',
    title: 'Keamanan',
    icon: Shield,
    description: 'Pengaturan password, autentikasi dua faktor',
    status: 'coming-soon',
    color: '#FF453A',
    path: '/settings/security',
    favorite: false
  },
  {
    id: 'notifications',
    title: 'Notifikasi',
    icon: Bell,
    description: 'Atur preferensi notifikasi email dan push',
    status: 'coming-soon',
    color: '#FF9F0A',
    path: '/settings/notifications',
    favorite: false
  },
  {
    id: 'localization',
    title: 'Bahasa & Lokalisasi',
    icon: Globe,
    description: 'Pilih bahasa dan format regional',
    status: 'coming-soon',
    color: '#30D158',
    path: '/settings/localization',
    favorite: false
  },
  {
    id: 'theme',
    title: 'Tema & Tampilan',
    icon: Palette,
    description: 'Kustomisasi tema dan layout aplikasi',
    status: 'coming-soon',
    color: '#BF5AF2',
    path: '/settings/theme',
    favorite: false
  },
  {
    id: 'database',
    title: 'Database Management',
    icon: Database,
    description: 'Kelola database, backup, restore, dan testing',
    status: 'available',
    color: '#0A84FF',
    path: '/settings/database',
    favorite: true
  },
  {
    id: 'team',
    title: 'Manajemen Tim',
    icon: Users,
    description: 'Pengaturan tim dan permisi akses',
    status: 'coming-soon',
    color: '#64D2FF',
    path: '/settings/team',
    favorite: false
  },
  {
    id: 'integrations',
    title: 'Integrasi Sistem',
    icon: Wrench,
    description: 'Konfigurasi API dan integrasi pihak ketiga',
    status: 'coming-soon',
    color: '#FF9F0A',
    path: '/settings/integrations',
    favorite: false
  }
];

/**
 * System information
 */
export const SYSTEM_INFO = {
  version: '2.1.0',
  environment: 'Development',
  lastUpdate: '10 September 2025',
  developer: 'Nusantara Group'
};

/**
 * Quick actions configuration
 */
export const QUICK_ACTIONS = [
  {
    label: 'Backup Data',
    icon: Database,
    disabled: true
  },
  {
    label: 'Audit Log',
    icon: Shield,
    disabled: true
  },
  {
    label: 'Diagnostik Sistem',
    icon: Wrench,
    disabled: true
  }
];