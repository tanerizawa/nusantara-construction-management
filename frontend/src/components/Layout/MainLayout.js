import React, { useState } from 'react';
import Header from './Header';
import SidebarProfessional from './SidebarProfessional';

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header onMenuClick={handleMenuClick} />
      
      {/* Sidebar */}
      <SidebarProfessional 
        isOpen={sidebarOpen} 
        onClose={handleSidebarClose} 
      />
      
      {/* Main Content */}
      <main className={`transition-all duration-300 ease-in-out ${
        sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'
      } pt-16`}>
        <div className="p-4 lg:p-6">
          {children}
        </div>
      </main>
      
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={handleSidebarClose}
        />
      )}
    </div>
  );
};

export default MainLayout;
