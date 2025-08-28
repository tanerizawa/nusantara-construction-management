import React from 'react';

export const DataLoader = ({ height = 'h-64' }) => (
  <div className={`flex items-center justify-center ${height}`}>
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
  </div>
);

export const DataEmpty = ({
  icon: Icon,
  title = 'Tidak ada data',
  description = 'Belum ada data untuk ditampilkan',
}) => (
  <div className="text-center py-12">
    <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center">
      {Icon ? <Icon size={32} className="text-gray-400" /> : null}
    </div>
    <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
    <p className="mt-2 text-gray-600">{description}</p>
  </div>
);

export const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  className = '', 
  disabled = false 
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
  >
    {children}
  </button>
);

export const Card = ({ children, className = '' }) => (
  <div className={`bg-white shadow rounded-lg ${className}`}>
    {children}
  </div>
);

export const DataCard = ({ 
  title, 
  value, 
  icon, 
  color = 'bg-gray-50 border-gray-200' 
}) => (
  <Card className={`p-6 ${color}`}>
    <div className="flex items-center">
      <div className="flex-shrink-0">
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="ml-5 w-0 flex-1">
        <dl>
          <dt className="text-sm font-medium text-gray-500 truncate">
            {title}
          </dt>
          <dd className="text-lg font-medium text-gray-900">
            {value}
          </dd>
        </dl>
      </div>
    </div>
  </Card>
);

// Use named exports only to keep bundle lean and lints happy
export default undefined;
