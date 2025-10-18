/**
 * System Metrics Component
 * Displays real-time system health and performance metrics
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
import { Activity, Cpu, HardDrive, Database, AlertTriangle } from 'lucide-react';

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
      const [metricsRes, healthRes, alertsRes] = await Promise.all([
        monitoringApi.getMetrics(),
        monitoringApi.getHealth(),
        monitoringApi.getAlerts()
      ]);

      setMetrics(metricsRes.data);
      setHealth(healthRes.data);
      setAlerts(alertsRes.data?.alerts || []);

      // Update history for charts
      const now = new Date().toLocaleTimeString();
      setCpuHistory(prev => [...prev.slice(-19), metricsRes.data.cpu.usage]);
      setMemoryHistory(prev => [...prev.slice(-19), metricsRes.data.memory.usagePercent]);
      setTimeLabels(prev => [...prev.slice(-19), now]);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching system metrics:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getProgressColor = (value) => {
    if (value < 50) return 'bg-green-500';
    if (value < 80) return 'bg-yellow-500';
    return 'bg-red-500';
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
        intersect: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      },
      x: {
        display: false
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
      {/* Health Status */}
      {health && (
        <div className={`p-4 rounded-lg border-2 ${
          health.status === 'healthy' 
            ? 'border-green-500 bg-green-50' 
            : health.status === 'warning' 
            ? 'border-yellow-500 bg-yellow-50'
            : 'border-red-500 bg-red-50'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Activity className={`h-6 w-6 ${
                health.status === 'healthy' 
                  ? 'text-green-600' 
                  : health.status === 'warning'
                  ? 'text-yellow-600'
                  : 'text-red-600'
              }`} />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
                <p className={`text-sm ${
                  health.status === 'healthy' 
                    ? 'text-green-700' 
                    : health.status === 'warning'
                    ? 'text-yellow-700'
                    : 'text-red-700'
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
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Active Alerts ({alerts.length})</h3>
              <div className="mt-2 space-y-1">
                {alerts.slice(0, 3).map((alert, idx) => (
                  <p key={idx} className="text-sm text-red-700">
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
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Cpu className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold text-gray-900">CPU</h3>
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {safePercent(metrics?.cpu?.usage)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div 
                className={`h-2 rounded-full ${getProgressColor(metrics?.cpu?.usage || 0)}`}
                style={{ width: `${metrics?.cpu?.usage || 0}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500">
              {metrics?.cpu?.cores || 0} cores • {safeFixed(metrics?.cpu?.loadAverage?.[0], 2)} load avg
            </p>
          </div>

          {/* Memory Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-purple-500" />
                <h3 className="font-semibold text-gray-900">Memory</h3>
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {safePercent(metrics?.memory?.usagePercent)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div 
                className={`h-2 rounded-full ${getProgressColor(metrics?.memory?.usagePercent || 0)}`}
                style={{ width: `${metrics?.memory?.usagePercent || 0}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500">
              {safeGB(metrics?.memory?.usedBytes)} GB / {safeGB(metrics?.memory?.totalBytes)} GB
            </p>
          </div>

          {/* Disk Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <HardDrive className="h-5 w-5 text-green-500" />
                <h3 className="font-semibold text-gray-900">Disk</h3>
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {safePercent(metrics?.disk?.usagePercent)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div 
                className={`h-2 rounded-full ${getProgressColor(metrics?.disk?.usagePercent || 0)}`}
                style={{ width: `${metrics?.disk?.usagePercent || 0}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500">
              {safeGB(metrics?.disk?.usedBytes)} GB / {safeGB(metrics?.disk?.totalBytes)} GB
            </p>
          </div>

          {/* Database Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-yellow-500" />
                <h3 className="font-semibold text-gray-900">Database</h3>
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {metrics?.database?.activeConnections || 0}
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500">
                Active: {metrics?.database?.activeConnections || 0} / {metrics?.database?.maxConnections || 0}
              </p>
              <p className="text-xs text-gray-500">
                Size: {safeMB(metrics?.database?.databaseSize)} MB
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CPU Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">CPU Usage History</h3>
          <div className="h-64">
            <Line data={cpuChartData} options={chartOptions} />
          </div>
        </div>

        {/* Memory Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Memory Usage History</h3>
          <div className="h-64">
            <Line data={memoryChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Process Info */}
      {metrics?.process && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Process Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Uptime</p>
              <p className="text-lg font-semibold text-gray-900">
                {Math.floor((metrics?.process?.uptime || 0) / 3600)}h {Math.floor(((metrics?.process?.uptime || 0) % 3600) / 60)}m
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">PID</p>
              <p className="text-lg font-semibold text-gray-900">{metrics?.process?.pid || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Memory (RSS)</p>
              <p className="text-lg font-semibold text-gray-900">
                {safeMB(metrics?.process?.memory?.rss)} MB
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Node Version</p>
              <p className="text-lg font-semibold text-gray-900">{metrics?.process?.nodeVersion || '-'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemMetrics;
