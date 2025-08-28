import React from 'react';
import Button from './Button';

const DataCard = ({ 
  title, 
  description, 
  icon: Icon, 
  isEmpty = false,
  action,
  actionText = 'Tambah',
  children,
  ...restProps
}) => {
  if (isEmpty) {
    return (
      <div className="card text-center py-12" {...restProps}>
        <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          {Icon && <Icon size={24} className="text-gray-400" />}
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 mb-6">{description}</p>
        {action && (
          <Button variant="primary" onClick={action}>
            {actionText}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="card" {...restProps}>
      {Icon && (
        <div className="flex items-center mb-4">
          <div className="p-2 bg-blue-50 rounded-lg mr-3">
            <Icon size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{title}</h3>
            {description && <p className="text-sm text-gray-500">{description}</p>}
          </div>
        </div>
      )}
      {children}
    </div>
  );
};

export default DataCard;
