import React from 'react';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * LoadingState component for displaying loading or error states
 * 
 * @param {object} props - Component props
 * @param {boolean} props.loading - Whether the component is in a loading state
 * @param {string} props.error - Error message to display if there is an error
 * @returns {JSX.Element|null} LoadingState component or null if not loading or error
 */
const LoadingState = ({ loading, error }) => {
  if (loading) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A84FF] mx-auto mb-4"></div>
          <p className="text-[#8E8E93]">Memuat data proyek...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-[#FF3B30]/10 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-[#FF3B30]" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Terjadi Kesalahan</h2>
          <p className="text-[#8E8E93] mb-6">{error}</p>
          <Link 
            to="/admin/projects" 
            className="inline-flex items-center px-4 py-2.5 bg-[#0A84FF] text-white rounded-lg hover:bg-[#0A84FF]/90 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Daftar Proyek
          </Link>
        </div>
      </div>
    );
  }

  return null;
};

export default LoadingState;