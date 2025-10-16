import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Edit, Building, Shield, DollarSign, Users, Trash2
} from 'lucide-react';
import { subsidiaryAPI } from '../../../services/api';

// Tab Components
import BasicInfoView from './components/tabs/BasicInfoView';
import LegalInfoView from './components/tabs/LegalInfoView';
import FinancialInfoView from './components/tabs/FinancialInfoView';
import GovernanceView from './components/tabs/GovernanceView';

/**
 * Subsidiary Detail Page - TABS VERSION
 * Matching structure with SubsidiaryEdit page
 * Tabs: Informasi Dasar, Informasi Legal, Informasi Keuangan, Tata Kelola
 */
const SubsidiaryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subsidiary, setSubsidiary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');

  // Fetch subsidiary data
  useEffect(() => {
    fetchSubsidiary();
  }, [id]);

  const fetchSubsidiary = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await subsidiaryAPI.getById(id);
      
      if (response.success) {
        setSubsidiary(response.data);
      } else {
        setError(response.error || 'Failed to load subsidiary');
      }
    } catch (err) {
      console.error('Error fetching subsidiary:', err);
      setError('Gagal memuat data subsidiary');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/subsidiaries');
  };

  const handleEdit = () => {
    navigate(`/subsidiaries/${id}/edit`);
  };

  const handleDelete = async () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus subsidiary ini?')) {
      try {
        const response = await subsidiaryAPI.delete(id);
        if (response.success) {
          navigate('/subsidiaries');
        } else {
          alert('Gagal menghapus subsidiary');
        }
      } catch (err) {
        console.error('Error deleting subsidiary:', err);
        alert('Terjadi kesalahan saat menghapus subsidiary');
      }
    }
  };

  // Tab configuration
  const tabs = [
    { id: 'basic', label: 'Informasi Dasar', icon: Building },
    { id: 'legal', label: 'Informasi Legal', icon: Shield },
    { id: 'financial', label: 'Informasi Keuangan', icon: DollarSign },
    { id: 'governance', label: 'Tata Kelola', icon: Users }
  ];

  // Render tab content
  const renderTabContent = () => {
    if (!subsidiary) return null;

    switch (activeTab) {
      case 'basic':
        return <BasicInfoView subsidiary={subsidiary} />;
      case 'legal':
        return <LegalInfoView subsidiary={subsidiary} />;
      case 'financial':
        return <FinancialInfoView subsidiary={subsidiary} />;
      case 'governance':
        return <GovernanceView subsidiary={subsidiary} />;
      default:
        return <BasicInfoView subsidiary={subsidiary} />;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1C1C1E]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A84FF] mx-auto mb-4"></div>
          <p className="text-[#8E8E93]">Memuat data subsidiary...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !subsidiary) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1C1C1E]">
        <div className="text-center">
          <Building className="h-16 w-16 text-[#636366] mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Subsidiary Tidak Ditemukan</h2>
          <p className="text-[#8E8E93] mb-6">{error || 'Data subsidiary yang Anda cari tidak tersedia.'}</p>
          <button
            onClick={handleBack}
            className="bg-[#0A84FF] text-white px-4 py-2 rounded-lg hover:bg-[#0A84FF]/90 transition-colors"
          >
            Kembali ke Daftar
          </button>
        </div>
      </div>
    );
  }

  // Main content
  return (
    <div className="min-h-screen bg-[#1C1C1E] py-8">
      <div className="max-w-6xl mx-auto px-6 space-y-6">
        {/* Header */}
        <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="p-2 bg-[#1C1C1E] border border-[#38383A] rounded-lg hover:bg-[#38383A] transition-colors"
                title="Kembali"
              >
                <ArrowLeft className="h-5 w-5 text-white" />
              </button>
              
              {/* Logo */}
              <div className="w-16 h-16 bg-[#1C1C1E] border border-[#38383A] rounded-lg overflow-hidden flex items-center justify-center">
                {subsidiary.logo ? (
                  <img
                    src={`${window.location.origin}/uploads/${subsidiary.logo}`}
                    alt={`${subsidiary.name} logo`}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      // Fallback to initials if image fails to load
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className="w-full h-full flex items-center justify-center text-xl font-bold text-[#0A84FF]"
                  style={{ display: subsidiary.logo ? 'none' : 'flex' }}
                >
                  {subsidiary.name.substring(0, 2).toUpperCase()}
                </div>
              </div>
              
              <div>
                <h1 className="text-2xl font-bold text-white">{subsidiary.name}</h1>
                <p className="text-sm text-[#8E8E93] mt-1">
                  Kode: <span className="font-mono text-[#0A84FF]">{subsidiary.code}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleEdit}
                className="flex items-center px-4 py-2 bg-[#0A84FF] text-white rounded-lg hover:bg-[#0A84FF]/90 transition-colors"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center px-4 py-2 bg-[#FF453A] text-white rounded-lg hover:bg-[#FF453A]/90 transition-colors"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Hapus
              </button>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg">
          <div className="border-b border-[#38383A] px-6">
            <nav className="flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-150 ${
                      isActive
                        ? 'border-[#0A84FF] text-[#0A84FF]'
                        : 'border-transparent text-[#8E8E93] hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubsidiaryDetail;
