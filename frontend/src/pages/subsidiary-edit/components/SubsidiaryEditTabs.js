import React from 'react';
import { Building, Shield, DollarSign, Users } from 'lucide-react';
import { formConfig } from '../config/formConfig';

const SubsidiaryEditTabs = ({ activeTab, onTabChange, hasErrors = {} }) => {
  const getTabIcon = (iconName) => {
    const icons = {
      Building,
      Shield,
      DollarSign,
      Users
    };
    return icons[iconName] || Building;
  };

  const getTabStatus = (tabId) => {
    // Check if tab has any errors
    const tabErrors = Object.keys(hasErrors).filter(field => {
      switch (tabId) {
        case 'basic':
          return ['name', 'code', 'email', 'phone', 'establishedYear', 'employeeCount'].includes(field);
        case 'legal':
          return ['companyRegistrationNumber', 'taxIdentificationNumber'].includes(field);
        case 'financial':
          return ['authorizedCapital', 'paidUpCapital'].includes(field);
        case 'governance':
          return false; // No specific validation errors for governance tab
        default:
          return false;
      }
    });
    
    return tabErrors.length > 0 ? 'error' : 'default';
  };

  return (
    <div className="border-b border-[#38383A] mb-6">
      <nav className="flex space-x-8">
        {formConfig.tabs.map((tab) => {
          const Icon = getTabIcon(tab.icon);
          const isActive = activeTab === tab.id;
          const status = getTabStatus(tab.id);
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-150 ${
                isActive
                  ? 'border-[#0A84FF] text-[#0A84FF]'
                  : status === 'error'
                  ? 'border-transparent text-[#FF453A] hover:text-[#FF453A]/80'
                  : 'border-transparent text-[#8E8E93] hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 mr-2 ${
                status === 'error' ? 'text-[#FF453A]' : ''
              }`} />
              {tab.label}
              {status === 'error' && (
                <div className="w-2 h-2 bg-[#FF453A] rounded-full ml-2" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default SubsidiaryEditTabs;