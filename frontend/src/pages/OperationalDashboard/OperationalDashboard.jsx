/**
 * Operational Dashboard - Main Page
 * Comprehensive dashboard for system monitoring, security, audit, and backup management
 */

import React, { useState } from 'react';
import { 
  Activity, Database, FileText, Shield, 
  BarChart3, Server, Lock, Archive 
} from 'lucide-react';
import SystemMetrics from './components/SystemMetrics';
import BackupManager from './components/BackupManager';
import AuditLogViewer from './components/AuditLogViewer';
import SecuritySessions from './components/SecuritySessions';

const OperationalDashboard = () => {
  const [activeTab, setActiveTab] = useState('metrics');

  const tabs = [
    {
      id: 'metrics',
      name: 'System Metrics',
      icon: Activity,
      component: SystemMetrics,
      description: 'Real-time system health and performance monitoring'
    },
    {
      id: 'backup',
      name: 'Backup Manager',
      icon: Database,
      component: BackupManager,
      description: 'Database backup and restore operations'
    },
    {
      id: 'audit',
      name: 'Audit Trail',
      icon: FileText,
      component: AuditLogViewer,
      description: 'Complete audit log and activity tracking'
    },
    {
      id: 'security',
      name: 'Security',
      icon: Shield,
      component: SecuritySessions,
      description: 'User sessions and login history'
    }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || SystemMetrics;

  return (
    <div className="min-h-screen bg-[#1C1C1E]">
      {/* Header */}
      <div className="bg-[#2C2C2E] shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-500 rounded-lg p-3">
                <Server className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Operational Dashboard</h1>
                <p className="text-sm text-gray-400 mt-1">
                  System monitoring, security, audit trail, and backup management
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 px-4 py-2 bg-green-900/30 rounded-lg border border-green-700/50">
                <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-400">System Operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-[#2C2C2E] shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors
                    ${isActive
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                    }
                  `}
                >
                  <Icon
                    className={`
                      -ml-0.5 mr-2 h-5 w-5
                      ${isActive ? 'text-blue-400' : 'text-gray-500 group-hover:text-gray-400'}
                    `}
                  />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Description */}
      <div className="bg-blue-900/20 border-b border-blue-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <p className="text-sm text-blue-300">
            {tabs.find(tab => tab.id === activeTab)?.description}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ActiveComponent />
      </div>

      {/* Footer */}
      <div className="bg-[#2C2C2E] border-t border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-900/30 rounded-lg p-2">
                <Activity className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">System Health</p>
                <p className="text-sm font-semibold text-white">Monitoring Active</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="bg-green-900/30 rounded-lg p-2">
                <Database className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Daily Backups</p>
                <p className="text-sm font-semibold text-white">Automated (2 AM)</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="bg-purple-900/30 rounded-lg p-2">
                <FileText className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Audit Trail</p>
                <p className="text-sm font-semibold text-white">Complete Logging</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="bg-yellow-900/30 rounded-lg p-2">
                <Shield className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Security</p>
                <p className="text-sm font-semibold text-white">Session Tracking</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Lock className="h-5 w-5 text-gray-500" />
                <p className="text-sm text-gray-400">
                  Enterprise-grade operational systems • Production-ready monitoring
                </p>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Archive className="h-4 w-4" />
                <span>Last updated: {new Date().toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperationalDashboard;
