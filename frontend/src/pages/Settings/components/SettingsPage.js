import React, { useState, useEffect } from 'react';
import { ArrowLeft, Settings as SettingsIcon } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSettingsSections } from '../hooks';
import PageHeader from './PageHeader';
import QuickActions from './QuickActions';
import SettingsSections from './SettingsSections';
import SystemInfoCard from './SystemInfoCard';
import ConstructionAlert from './ConstructionAlert';
import DatabaseManagement from '../../../components/settings/DatabaseManagement';
import { UserManagementPage } from './UserManagement';
import NotificationSettings from './NotificationSettings';
import SecuritySettings from './SecuritySettings';
import ProfileSettings from './ProfileSettings';

/**
 * Settings Page Component
 * Main component for the settings page that orchestrates the display of different settings sections
 * @returns {JSX.Element} Settings page UI
 */
const SettingsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedSection, setSelectedSection, getSectionById } = useSettingsSections();
  const [showDatabaseSection, setShowDatabaseSection] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [showSecuritySettings, setShowSecuritySettings] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);

  // Handle URL-based routing
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/settings/users')) {
      setShowUserManagement(true);
      setShowDatabaseSection(false);
      setShowNotificationSettings(false);
      setShowSecuritySettings(false);
      setShowProfileSettings(false);
    } else if (path.includes('/settings/database')) {
      setShowDatabaseSection(true);
      setShowUserManagement(false);
      setShowNotificationSettings(false);
      setShowSecuritySettings(false);
      setShowProfileSettings(false);
    } else if (path.includes('/settings/notifications')) {
      setShowNotificationSettings(true);
      setShowDatabaseSection(false);
      setShowUserManagement(false);
      setShowSecuritySettings(false);
      setShowProfileSettings(false);
    } else if (path.includes('/settings/security')) {
      setShowSecuritySettings(true);
      setShowDatabaseSection(false);
      setShowUserManagement(false);
      setShowNotificationSettings(false);
      setShowProfileSettings(false);
    } else if (path.includes('/settings/profile')) {
      setShowProfileSettings(true);
      setShowDatabaseSection(false);
      setShowUserManagement(false);
      setShowNotificationSettings(false);
      setShowSecuritySettings(false);
    } else {
      setShowDatabaseSection(false);
      setShowUserManagement(false);
      setShowNotificationSettings(false);
      setShowSecuritySettings(false);
      setShowProfileSettings(false);
    }
  }, [location.pathname]);

  // Handle returning to main settings view
  const handleBackToSettings = () => {
    navigate('/settings');
    setSelectedSection(null);
    setShowDatabaseSection(false);
    setShowUserManagement(false);
    setShowNotificationSettings(false);
    setShowSecuritySettings(false);
    setShowProfileSettings(false);
  };

  // Special case for database management section
  const handleDatabaseSection = () => {
    navigate('/settings/database');
  };

  // Special case for user management section
  const handleUserManagementSection = () => {
    navigate('/settings/users');
  };

  // Special case for notification settings section
  const handleNotificationSection = () => {
    navigate('/settings/notifications');
  };

  // Special case for security settings section
  const handleSecuritySection = () => {
    navigate('/settings/security');
  };

  // Special case for profile settings section
  const handleProfileSection = () => {
    navigate('/settings/profile');
  };

  // Render the selected section or section listing
  const renderContent = () => {
    // If user management section is selected
    if (showUserManagement) {
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
          <UserManagementPage />
        </div>
      );
    }

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

    // If notification settings section is selected
    if (showNotificationSettings) {
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
          <NotificationSettings />
        </div>
      );
    }

    // If security settings section is selected
    if (showSecuritySettings) {
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
          <SecuritySettings />
        </div>
      );
    }

    // If profile settings section is selected
    if (showProfileSettings) {
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
          <ProfileSettings />
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
            } else if (id === 'users') {
              handleUserManagementSection();
            } else if (id === 'notifications') {
              handleNotificationSection();
            } else if (id === 'security') {
              handleSecuritySection();
            } else if (id === 'profile') {
              handleProfileSection();
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