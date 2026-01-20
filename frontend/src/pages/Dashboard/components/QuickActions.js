import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardCheck, Camera, Upload, BarChart3 } from 'lucide-react';

/**
 * Quick Links component with dark-matte styling
 */
const QuickLinks = () => {
  const navigate = useNavigate();

  const links = [
    { 
      icon: ClipboardCheck, 
      text: 'Absensi Hari Ini', 
      subtext: 'Validasi clock in/out tim lapangan',
      gradient: 'from-[#0ea5e9] to-[#2563eb]',
      path: '/attendance'
    },
    { 
      icon: Camera, 
      text: 'Dokumentasi Kegiatan', 
      subtext: 'Unggah berita acara dan foto lapangan',
      gradient: 'from-[#34d399] to-[#22c55e]',
      path: '/projects'
    },
    { 
      icon: Upload, 
      text: 'Kelola Proyek', 
      subtext: 'Lihat dan kelola semua proyek aktif',
      gradient: 'from-[#f97316] to-[#f43f5e]',
      path: '/projects'
    },
    { 
      icon: BarChart3, 
      text: 'Lihat Analitik', 
      subtext: 'Buka analitik keuangan & operasional',
      gradient: 'from-[#a855f7] to-[#ec4899]',
      path: '/analytics'
    }
  ];
  
  return (
    <div className="xl:col-span-1 rounded-3xl border border-white/5 bg-[#0b0f19]/85 p-6 shadow-[0_25px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
        <span className="text-[10px] uppercase tracking-[0.4em] text-white/40">Cepat</span>
      </div>
      <p className="mt-1 text-xs text-white/50">Jalankan modul utama hanya dengan satu klik</p>
      <div className="mt-4 space-y-3">
        {links.map((link) => (
          <button 
            key={link.text}
            onClick={() => navigate(link.path)}
            className="group relative w-full overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-4 text-left transition hover:-translate-y-0.5 hover:border-white/20"
          >
            <div className={`pointer-events-none absolute inset-0 bg-gradient-to-r ${link.gradient} opacity-0 transition duration-300 group-hover:opacity-30`} />
            <div className="relative flex items-start justify-between gap-4">
              <div className="space-y-0.5">
                <p className="text-sm font-semibold text-white break-words">{link.text}</p>
                <p className="text-xs text-white/60 break-words">{link.subtext}</p>
              </div>
              <div className="flex items-center gap-2 text-white/70 transition group-hover:text-white">
                <link.icon className="h-5 w-5" />
                <span className="text-base transition group-hover:translate-x-1">↗</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickLinks;
