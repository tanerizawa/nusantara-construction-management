/**
 * System Metrics Component
 * Displays real-time system health and perf      console.log('💚 Processed Health:', healthData);
     const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-green-400 bg-green-900/30 border border-green-700/50';
      case 'warning': return 'text-yellow-400 bg-yellow-900/30 border border-yellow-700/50';
      case 'critical': return 'text-red-400 bg-red-900/30 border border-red-700/50';
      default: return 'text-gray-400 bg-gray-900/30 border border-gray-700/50';
    }
  };

  const getProgressColor = (value) => {
    if (value < 50) return 'bg-green-500';
    if (value < 75) return 'bg-yellow-500';
    return 'bg-red-500';g('📈 Processed Metrics History:', metricsHistory);

      // Use health data for current metrics
      setMetrics({
        cpu: healthData.cpu || { usage: 0, cores: 0, loadAverage: [0, 0, 0] },
        memory: healthData.memory || { total: 0, used: 0, free: 0, usagePercent: 0, totalBytes: 0, usedBytes: 0 },
        disk: healthData.disk || { total: 0, used: 0, free: 0, usagePercent: 0, totalBytes: 0, usedBytes: 0 },
        database: {
          activeConnections: healthData.database?.activeConnections || 0,
          maxConnections: healthData.database?.maxConnections || 100,
          databaseSize: healthData.database?.databaseSize || healthData.database?.sizeBytes ? (healthData.database.sizeBytes / (1024 * 1024)).toFixed(2) : 0,
          status: healthData.database?.status || 'unknown'
        },
        process: healthData.process || null
      });
      
      console.log('📊 Database metrics set:', {
        activeConnections: healthData.database?.activeConnections,
        maxConnections: healthData.database?.maxConnections,
        databaseSize: healthData.database?.databaseSize,
        sizeBytes: healthData.database?.sizeBytes
      });rics
 */

import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { monitoringApi } from '../../../services/operationalApi';
import { 
  Activity, Cpu, HardDrive, Database, AlertTriangle, 
  Info, RefreshCw, Clock, Server, MemoryStick 
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const SystemMetrics = () => {
  const [metrics, setMetrics] = useState({
    cpu: { usage: 0, cores: 0, model: 'Loading...' },
    memory: { total: 0, used: 0, free: 0, usagePercent: 0 },
    disk: { total: 0, used: 0, free: 0, usagePercent: 0 },
    database: { connections: 0, size: '0 MB' }
  });
  const [health, setHealth] = useState({ status: 'checking', uptime: 0 });
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [cpuHistory, setCpuHistory] = useState([]);
  const [memoryHistory, setMemoryHistory] = useState([]);
  const [timeLabels, setTimeLabels] = useState([]);

  // Fetch data
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      console.log('🔄 Fetching system metrics...');
      
      const [healthRes, metricsHistoryRes, alertsRes] = await Promise.all([
        monitoringApi.getHealth(),
        monitoringApi.getMetrics(),
        monitoringApi.getAlerts()
      ]);

      console.log('✅ Health Response:', healthRes);
      console.log('📊 Metrics History Response:', metricsHistoryRes);
      console.log('⚠️ Alerts Response:', alertsRes);

      // Handle nested data structure
      const healthData = healthRes.data?.data || healthRes.data || healthRes;
      const metricsHistory = metricsHistoryRes.data?.data || metricsHistoryRes.data || metricsHistoryRes;
      const alertsData = alertsRes.data?.data || alertsRes.data || alertsRes;

      console.log('� Processed Health:', healthData);
      console.log('� Processed Metrics History:', metricsHistory);

      // Use health data for current metrics
      setMetrics({
        cpu: healthData.cpu || { usage: 0, cores: 0, loadAverage: [0, 0, 0] },
        memory: healthData.memory || { total: 0, used: 0, free: 0, usagePercent: 0, totalBytes: 0, usedBytes: 0 },
        disk: healthData.disk || { total: 0, used: 0, free: 0, usagePercent: 0, totalBytes: 0, usedBytes: 0 },
        database: healthData.database || { activeConnections: 0, maxConnections: 0, databaseSize: 0 },
        process: healthData.process || null
      });
      
      setHealth({
        status: healthData.status || 'checking',
        message: healthData.message || 'System health check in progress...',
        timestamp: healthData.timestamp,
        uptime: healthData.uptime
      });
      
      setAlerts(alertsData?.alerts || alertsData || []);

      // Update history for charts
      const now = new Date().toLocaleTimeString();
      setCpuHistory(prev => [...prev.slice(-19), healthData.cpu?.usage || 0]);
      setMemoryHistory(prev => [...prev.slice(-19), healthData.memory?.usagePercent || 0]);
      setTimeLabels(prev => [...prev.slice(-19), now]);
      setLastUpdate(new Date());

      setLoading(false);
    } catch (error) {
      console.error('❌ Error fetching system metrics:', error);
      console.error('Error response:', error.response?.data);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      case 'warning': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
      case 'critical': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30';
    }
  };

  const getProgressColor = (value) => {
    if (value < 50) return 'bg-green-500 dark:bg-green-600';
    if (value < 80) return 'bg-yellow-500 dark:bg-yellow-600';
    return 'bg-red-500 dark:bg-red-600';
  };

  // Safe number formatter
  const safeFixed = (value, decimals = 2) => {
    if (value === null || value === undefined || isNaN(value)) return '0';
    return Number(value).toFixed(decimals);
  };

  // Safe percentage formatter
  const safePercent = (value) => {
    return safeFixed(value || 0, 1);
  };

  // Safe GB formatter
  const safeGB = (bytes) => {
    if (!bytes) return '0.00';
    return safeFixed(bytes / 1024 / 1024 / 1024, 2);
  };

  // Safe MB formatter
  const safeMB = (bytes) => {
    if (!bytes) return '0.00';
    return safeFixed(bytes / 1024 / 1024, 2);
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          color: '#9CA3AF',
          callback: function(value) {
            return value + '%';
          }
        },
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
          borderColor: 'rgba(75, 85, 99, 0.5)'
        }
      },
      x: {
        display: false,
        grid: {
          color: 'rgba(75, 85, 99, 0.3)'
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  const cpuChartData = {
    labels: timeLabels,
    datasets: [
      {
        label: 'CPU Usage',
        data: cpuHistory,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const memoryChartData = {
    labels: timeLabels,
    datasets: [
      {
        label: 'Memory Usage',
        data: memoryHistory,
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Last Update */}
      {lastUpdate && (
        <div className="flex items-center justify-between px-4 py-2 bg-[#2C2C2E] rounded-lg border border-gray-700">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Clock className="h-4 w-4" />
            <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <RefreshCw className="h-3 w-3 animate-spin" />
            <span>Auto-refresh every 5s</span>
          </div>
        </div>
      )}

      {/* Health Status */}
      {health && (
        <div className={`p-4 rounded-lg border-2 ${
          health.status === 'healthy' 
            ? 'border-green-500 bg-green-900/20' 
            : health.status === 'warning' 
            ? 'border-yellow-500 bg-yellow-900/20'
            : 'border-red-500 bg-red-900/20'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Activity className={`h-6 w-6 ${
                health.status === 'healthy' 
                  ? 'text-green-400' 
                  : health.status === 'warning'
                  ? 'text-yellow-400'
                  : 'text-red-400'
              }`} />
              <div>
                <h3 className="text-lg font-semibold text-white">System Status</h3>
                <p className={`text-sm ${
                  health.status === 'healthy' 
                    ? 'text-green-400' 
                    : health.status === 'warning'
                    ? 'text-yellow-400'
                    : 'text-red-400'
                }`}>
                  {health.message || 'Checking system health...'}
                </p>
              </div>
            </div>
            <span className={`px-4 py-2 rounded-full font-semibold ${getStatusColor(health.status)}`}>
              {health.status ? health.status.toUpperCase() : 'CHECKING'}
            </span>
          </div>
        </div>
      )}

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="bg-red-900/20 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-400">Active Alerts ({alerts.length})</h3>
              <div className="mt-2 space-y-1">
                {alerts.slice(0, 3).map((alert, idx) => (
                  <p key={idx} className="text-sm text-red-400">
                    • {alert.message}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* CPU Card */}
          <div className="bg-[#2C2C2E] rounded-lg shadow-md hover:shadow-lg transition-all p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Cpu className="h-5 w-5 text-blue-400" />
                <h3 className="font-semibold text-white">CPU</h3>
              </div>
              <span className="text-2xl font-bold text-white">
                {safePercent(metrics?.cpu?.usage)}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
              <div 
                className={`h-2 rounded-full ${getProgressColor(metrics?.cpu?.usage || 0)}`}
                style={{ width: `${metrics?.cpu?.usage || 0}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-400">
              {metrics?.cpu?.cores || 0} cores • {safeFixed(metrics?.cpu?.loadAverage?.[0], 2)} load avg
            </p>
          </div>

          {/* Memory Card */}
          <div className="bg-[#2C2C2E] rounded-lg shadow-md hover:shadow-lg transition-all p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <MemoryStick className="h-5 w-5 text-purple-400" />
                <h3 className="font-semibold text-white">Memory</h3>
                <div className="group relative">
                  <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                    <p className="font-semibold mb-1">Active Memory</p>
                    <p className="mb-2">Shows actual used memory (excludes cache/buffers which are reclaimable).</p>
                    <p className="text-gray-300">Cache: {metrics?.memory?.cache || '0 GB'}</p>
                    <p className="text-gray-300">Available: {metrics?.memory?.available || '0 GB'}</p>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              </div>
              <span className="text-2xl font-bold text-white">
                {safePercent(metrics?.memory?.usagePercent)}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
              <div 
                className={`h-2 rounded-full ${getProgressColor(metrics?.memory?.usagePercent || 0)}`}
                style={{ width: `${metrics?.memory?.usagePercent || 0}%` }}
              ></div>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Active: {safeGB(metrics?.memory?.usedBytes)} GB / {safeGB(metrics?.memory?.totalBytes)} GB
              </p>
              {metrics?.memory?.availablePercent && (
                <p className="text-xs text-green-600 dark:text-green-400">
                  Available: {metrics.memory.available || safeGB(metrics.memory.availableBytes)} ({safePercent(metrics.memory.availablePercent)}%)
                </p>
              )}
              {metrics?.memory?.cache && (
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  Cache: {metrics.memory.cache || safeGB(metrics.memory.cacheBytes)}
                </p>
              )}
            </div>
          </div>

          {/* Disk Card */}
          <div className="bg-[#2C2C2E] rounded-lg shadow-md hover:shadow-lg transition-all p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <HardDrive className="h-5 w-5 text-green-400" />
                <h3 className="font-semibold text-white">Disk</h3>
              </div>
              <span className="text-2xl font-bold text-white">
                {safePercent(metrics?.disk?.usagePercent)}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
              <div 
                className={`h-2 rounded-full ${getProgressColor(metrics?.disk?.usagePercent || 0)}`}
                style={{ width: `${metrics?.disk?.usagePercent || 0}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-400">
              {safeGB(metrics?.disk?.usedBytes)} GB / {safeGB(metrics?.disk?.totalBytes)} GB free
            </p>
          </div>

          {/* Database Card */}
          <div className="bg-[#2C2C2E] rounded-lg shadow-md hover:shadow-lg transition-all p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-yellow-400" />
                <h3 className="font-semibold text-white">Database</h3>
              </div>
              <span className="text-2xl font-bold text-white">
                {metrics?.database?.activeConnections || 0}
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-400">
                Active: {metrics?.database?.activeConnections || 0} / {metrics?.database?.maxConnections || 0}
              </p>
              <p className="text-xs text-gray-400">
                Size: {safeMB(metrics?.database?.databaseSize)} MB
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CPU Chart */}
        <div className="bg-[#2C2C2E] rounded-lg shadow-md hover:shadow-lg transition-all p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">CPU Usage History</h3>
            <span className="text-xs text-gray-400">Last 20 readings</span>
          </div>
          <div className="h-64">
            <Line data={cpuChartData} options={chartOptions} />
          </div>
        </div>

        {/* Memory Chart */}
        <div className="bg-[#2C2C2E] rounded-lg shadow-md hover:shadow-lg transition-all p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Memory Usage History</h3>
            <span className="text-xs text-gray-400">Last 20 readings</span>
          </div>
          <div className="h-64">
            <Line data={memoryChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Process Info */}
      {metrics?.process && (
        <div className="bg-[#2C2C2E] rounded-lg shadow-md hover:shadow-lg transition-all p-6 border border-gray-700">
          <div className="flex items-center space-x-2 mb-4">
            <Server className="h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Process Information</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-400">Uptime</p>
              <p className="text-lg font-semibold text-white">
                {Math.floor((metrics?.process?.uptime || 0) / 3600)}h {Math.floor(((metrics?.process?.uptime || 0) % 3600) / 60)}m
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">PID</p>
              <p className="text-lg font-semibold text-white">{metrics?.process?.pid || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Memory (RSS)</p>
              <p className="text-lg font-semibold text-white">
                {safeMB(metrics?.process?.memory?.rss)} MB
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Node Version</p>
              <p className="text-lg font-semibold text-white">{metrics?.process?.nodeVersion || '-'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemMetrics;
