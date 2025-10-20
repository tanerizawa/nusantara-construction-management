import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardCheck, Camera, Upload, BarChart3 } from 'lucide-react';

/**
 * Quick Links component - Revised for Attendance & Documentation
 * @returns {JSX.Element} Quick links UI
 */
const QuickLinks = () => {
  const navigate = useNavigate();

  const links = [
    { 
      icon: ClipboardCheck, 
      text: 'Absensi Hari Ini', 
      color: '[#0A84FF]',
      path: '/attendance'
    },
    { 
      icon: Camera, 
      text: 'Dokumentasi Kegiatan', 
      color: '[#30D158]',
      path: '/berita-acara'
    },
    { 
      icon: Upload, 
      text: 'Upload Progress Foto', 
      color: '[#FF9F0A]',
      path: '/projects'
    },
    { 
      icon: BarChart3, 
      text: 'Lihat Laporan', 
      color: '[#64D2FF]',
      path: '/reports'
    }
  ];
  
  return (
    <div className="bg-[#2C2C2E] border border-[#38383A] p-6 rounded-xl hover:border-[#48484A] transition-colors">
      <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
      <div className="space-y-3">
        {links.map((link, index) => (
          <button 
            key={index}
            onClick={() => navigate(link.path)}
            className="w-full flex items-center justify-between p-3 text-left border border-[#38383A] rounded-lg hover:bg-[#3A3A3C] hover:border-[#48484A] transition-colors duration-150 group"
          >
            <div className="flex items-center">
              <link.icon className={`h-5 w-5 text-${link.color} mr-3 group-hover:scale-110 transition-transform`} />
              <span className="font-medium text-white">{link.text}</span>
            </div>
            <div className="text-[#98989D] group-hover:text-[#0A84FF] group-hover:translate-x-1 transition-all">→</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickLinks;