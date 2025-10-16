import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building } from 'lucide-react';

/**
 * Header component for Subsidiary Create page
 * @returns {JSX.Element} Header UI
 */
const PageHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-4 mb-8">
      <button
        onClick={() => navigate('/subsidiaries')}
        className="flex items-center gap-2 transition-colors"
        style={{ color: "#98989D" }}
        onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
        onMouseLeave={(e) => e.currentTarget.style.color = '#98989D'}
      >
        <ArrowLeft size={20} />
        Kembali
      </button>
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3" style={{ color: "#FFFFFF" }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{
            background: 'linear-gradient(135deg, #0A84FF 0%, #0066CC 100%)'
          }}>
            <Building className="w-6 h-6 text-white" />
          </div>
          Tambah Anak Usaha Baru
        </h1>
        <p className="mt-2" style={{ color: "#98989D" }}>Daftarkan anak usaha baru Nusantara Group</p>
      </div>
    </div>
  );
};

export default PageHeader;