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
    <div className="mb-6">
      <div className="flex items-center gap-4 mb-4">
        <Link 
          to={`/admin/projects/${projectId}`}
          className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium 
                   text-[#0A84FF] hover:text-[#0A84FF]/80 hover:bg-[#0A84FF]/10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Kembali
        </Link>
      </div>
      
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-white">
          Edit Proyek: {projectName}
        </h1>
      </div>
    </div>
  );
};

export default PageHeader;