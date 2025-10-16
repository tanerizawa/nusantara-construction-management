import React from 'react';
import { ArrowLeft, FileText } from 'lucide-react';
import WorkOrdersNotImplemented from '../workflow/purchase-orders/views/WorkOrdersNotImplemented';

const CreateWorkOrder = ({ projectId, project, selectedRABItems = [], onBack, onSave }) => {
  return (
    <WorkOrdersNotImplemented onBack={onBack} />
  );
};

export default CreateWorkOrder;