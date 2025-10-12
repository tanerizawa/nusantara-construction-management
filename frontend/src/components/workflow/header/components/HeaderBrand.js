import React from 'react';
import { Building2 } from 'lucide-react';

/**
 * HeaderBrand Component
 * Displays logo and project name
 * 
 * @param {object} project - Project data
 */
export const HeaderBrand = ({ project }) => {
  return (
    <div className="flex items-center space-x-4">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gradient-to-br from-[#0A84FF] to-[#5E5CE6] rounded-lg flex items-center justify-center">
          <Building2 size={20} className="text-white" />
        </div>
        <span className="text-white font-semibold text-lg hidden sm:block">
          Nusantara
        </span>
      </div>

      {/* Divider */}
      <div className="h-6 w-px bg-[#38383A]" />

      {/* Project Name */}
      <div className="flex items-center space-x-2">
        <span className="text-[#8E8E93] text-sm hidden md:inline">Project:</span>
        <span className="text-white font-medium text-sm truncate max-w-xs lg:max-w-md">
          {project?.name || 'Loading...'}
        </span>
      </div>
    </div>
  );
};

export default HeaderBrand;
