import React, { useState, useEffect } from 'react';
import { Calendar, Users, Clock, Award, AlertTriangle, CheckCircle, BookOpen } from 'lucide-react';
import axios from 'axios';

// UI Components
import Button from './ui/Button';
import Card, { KPICard } from './ui/Card';
import DataCard from './ui/DataCard';
import PageLoader from './ui/PageLoader';

/**
 * Training Management Component - Phase 4 Week 8
 * Advanced HR Features - Training Schedule Management
 */

const TrainingManagement = () => {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    fetchTrainings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, categoryFilter]);

  const fetchTrainings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (categoryFilter !== 'all') params.category = categoryFilter;

      const response = await axios.get('http://localhost:5001/api/manpower/training', {
        headers: { Authorization: `Bearer ${token}` },
        params
      });
      setTrainings(response.data || []);
    } catch (error) {
      console.error('Error fetching trainings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Safety': return <AlertTriangle size={20} className="text-red-600" />;
      case 'Management': return <Users size={20} className="text-blue-600" />;
      case 'Technical': return <BookOpen size={20} className="text-green-600" />;
      default: return <Award size={20} className="text-gray-600" />;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return <PageLoader size="lg" />;
  }

  const stats = {
    total: trainings.length,
    scheduled: trainings.filter(t => t.status === 'scheduled').length,
    completed: trainings.filter(t => t.status === 'completed').length,
    totalCost: trainings.reduce((sum, t) => sum + (t.cost || 0), 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Training Management</h1>
          <p className="text-gray-600">Kelola program pelatihan dan pengembangan karyawan</p>
        </div>
        <Button variant="primary" icon={<Calendar />}>
          Jadwalkan Training
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICard
          title="Total Program"
          value={stats.total}
          icon={<BookOpen />}
          trend={{ value: 12, direction: 'up', period: 'bulan ini' }}
        />
        <KPICard
          title="Terjadwal"
          value={stats.scheduled}
          icon={<Calendar />}
          trend={{ value: 3, direction: 'up', period: 'minggu ini' }}
        />
        <KPICard
          title="Selesai"
          value={stats.completed}
          icon={<CheckCircle />}
          trend={{ value: 85, direction: 'up', period: 'completion rate' }}
        />
        <KPICard
          title="Total Biaya"
          value={formatCurrency(stats.totalCost)}
          icon={<Award />}
          trend={{ value: 15, direction: 'down', period: 'vs budget' }}
        />
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Semua Status</option>
          <option value="scheduled">Terjadwal</option>
          <option value="ongoing">Berlangsung</option>
          <option value="completed">Selesai</option>
          <option value="cancelled">Dibatalkan</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Semua Kategori</option>
          <option value="Safety">Keselamatan</option>
          <option value="Management">Manajemen</option>
          <option value="Technical">Teknis</option>
        </select>
      </div>

      {/* Training Programs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {trainings.map((training) => (
          <Card key={training.id} className="hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                {getCategoryIcon(training.category)}
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900">{training.title}</h3>
                  <p className="text-sm text-gray-500">{training.category}</p>
                </div>
              </div>
              <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(training.status)}`}>
                {training.status === 'scheduled' ? 'Terjadwal' :
                 training.status === 'ongoing' ? 'Berlangsung' :
                 training.status === 'completed' ? 'Selesai' : 'Dibatalkan'}
              </span>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-gray-600">{training.description}</p>
              
              <div className="flex items-center text-sm text-gray-600">
                <Calendar size={16} className="mr-2" />
                <span>
                  {training.startDate === training.endDate 
                    ? formatDate(training.startDate)
                    : `${formatDate(training.startDate)} - ${formatDate(training.endDate)}`
                  }
                </span>
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <Clock size={16} className="mr-2" />
                <span>{training.duration} jam</span>
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <Users size={16} className="mr-2" />
                <span>{training.participants?.length || 0}/{training.maxParticipants} peserta</span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(training.cost)}
                </span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    Detail
                  </Button>
                  {training.status === 'scheduled' && (
                    <Button variant="primary" size="sm">
                      Kelola
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {trainings.length === 0 && (
        <DataCard
          title="Belum ada program training"
          subtitle="Mulai dengan menjadwalkan program pelatihan untuk karyawan"
          isEmpty
        />
      )}
    </div>
  );
};

export default TrainingManagement;
