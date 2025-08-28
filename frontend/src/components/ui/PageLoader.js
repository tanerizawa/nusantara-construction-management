import React from 'react';

const PageLoader = ({ 
  size = 'md', 
  text = 'Memuat...', 
  fullPage = false 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };

  const containerClasses = fullPage
    ? 'fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50'
    : 'flex items-center justify-center py-12';

  return (
    <div className={containerClasses}>
      <div className="text-center">
        <div className={`${sizeClasses[size]} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto`}></div>
        {text && (
          <p className="mt-4 text-sm text-gray-600">{text}</p>
        )}
      </div>
    </div>
  );
};

export default PageLoader;
