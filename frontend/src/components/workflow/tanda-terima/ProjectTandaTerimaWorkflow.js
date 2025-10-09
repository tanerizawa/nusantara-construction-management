import React from 'react';
import TandaTerimaManager from '../../tanda-terima/TandaTerimaManager';

/**
 * ProjectTandaTerimaWorkflow
 * Wrapper component for Tanda Terima in workflow sidebar
 */
const ProjectTandaTerimaWorkflow = ({ projectId, project, onDataChange }) => {
  return (
    <TandaTerimaManager 
      projectId={projectId} 
      project={project} 
      onReceiptChange={onDataChange}
    />
  );
};

export default ProjectTandaTerimaWorkflow;
