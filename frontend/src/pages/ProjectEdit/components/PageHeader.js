import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * PageHeader component for the ProjectEdit page
 * 
 * @param {object} props - Component props
 * @param {string} props.projectId - The ID of the project
 * @param {string} props.projectName - The name of the project
 * @returns {JSX.Element} PageHeader component
 */
const PageHeader = ({ projectId, projectName }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-6">
        <Link 
          to={`/admin/projects/${projectId}`}
          style={{
            backgroundColor: '#1C1C1E',
            border: '1px solid #38383A'
          }}
          className="inline-flex items-center px-4 py-2.5 rounded-lg text-sm font-medium text-white hover:bg-[#2C2C2E] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Link>
      </div>
      
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Edit Proyek
        </h1>
        <p className="text-[#8E8E93]">
          {projectName}
        </p>
      </div>
    </div>
  );
};

export default PageHeader;