import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './SidebarSimple';

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const handleMenuClick = () => {
    // On mobile, toggle sidebar open/close
    // On desktop, toggle sidebar expanded/collapsed
    if (window.innerWidth < 1024) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setSidebarExpanded(!sidebarExpanded);
    }
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen || sidebarExpanded} 
        onClose={handleSidebarClose} 
      />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header onMenuClick={handleMenuClick} />
        
        {/* Page content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      
      {/* Mobile sidebar overlay */}
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