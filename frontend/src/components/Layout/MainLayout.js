import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-[#1C1C1E]">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={handleSidebarClose} 
      />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header - seamlessly connected to sidebar */}
        <Header onMenuClick={handleMenuClick} />
        
        {/* Page content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#1C1C1E] p-6">
          {children}
        </main>
      </div>
      
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-200"
          onClick={handleSidebarClose}
        />
      )}
    </div>
  );
};

export default MainLayout;