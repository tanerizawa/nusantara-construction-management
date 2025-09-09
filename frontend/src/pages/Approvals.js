import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ApprovalDashboard from '../components/ApprovalDashboard';

const Approvals = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Sistem Persetujuan
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Kelola dan pantau proses persetujuan untuk RAB, Purchase Order, dan dokumen lainnya
          </p>
        </div>

        {/* Approval Dashboard Component */}
        <ApprovalDashboard />
      </div>
    </div>
  );
};

export default Approvals;
