import React, { useState } from 'react';
import { ArrowLeft, Settings as SettingsIcon } from 'lucide-react';
import { useSettingsSections } from '../hooks';
import PageHeader from './PageHeader';
import QuickActions from './QuickActions';
import SettingsSections from './SettingsSections';
import SystemInfoCard from './SystemInfoCard';
import ConstructionAlert from './ConstructionAlert';
import DatabaseManagement from '../../../components/settings/DatabaseManagement';

/**
 * Settings Page Component
 * Main component for the settings page that orchestrates the display of different settings sections
 * @returns {JSX.Element} Settings page UI
 */
const SettingsPage = () => {
  const { selectedSection, setSelectedSection, getSectionById } = useSettingsSections();
  const [showDatabaseSection, setShowDatabaseSection] = useState(false);

  // Handle returning to main settings view
  const handleBackToSettings = () => {
    setSelectedSection(null);
    setShowDatabaseSection(false);
  };

  // Special case for database management section
  const handleDatabaseSection = () => {
    setShowDatabaseSection(true);
  };

  // Render the selected section or section listing
  const renderContent = () => {
    // If database management section is selected
    if (showDatabaseSection) {
      return (
        <div className="mt-4">
          <div className="mb-4">
            <button 
              onClick={handleBackToSettings}
              className="flex items-center text-blue-500 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Kembali ke Pengaturan
            </button>
          </div>
          <DatabaseManagement />
        </div>
      );
    }

    // If a section is selected (for future implementation)
    if (selectedSection) {
      const section = getSectionById(selectedSection);
      if (section.id === 'database') {
        // This will never execute due to the special case above
        // but keeping for completeness
        handleDatabaseSection();
        return null;
      }

      // For other sections that are under construction
      return (
        <div className="mt-4">
          <div className="mb-4">
            <button 
              onClick={handleBackToSettings}
              className="flex items-center text-blue-500 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Kembali ke Pengaturan
            </button>
          </div>
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#FFFFFF' }}>{section.title}</h2>
          <ConstructionAlert />
        </div>
      );
    }

    // Main settings dashboard
    return (
      <>
        <QuickActions />
        <SettingsSections 
          selectedSection={selectedSection} 
          onSectionSelect={(id) => {
            if (id === 'database') {
              handleDatabaseSection();
            } else {
              setSelectedSection(id);
            }
          }} 
        />
        <div className="mt-8">
          <SystemInfoCard />
        </div>
      </>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader 
        icon={<SettingsIcon className="h-6 w-6" />}
        title="Pengaturan Sistem"
        subtitle="Kelola konfigurasi dan pengaturan aplikasi"
      />
      
      {renderContent()}
    </div>
  );
};

export default SettingsPage;