import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Eye, Download, MessageCircle, FileText, Calendar, 
  DollarSign, CheckCircle, AlertCircle, User,
  Bell, Settings, LogOut
} from 'lucide-react';
import Button from './ui/Button';
import Card, { KPICard, DataCard } from './ui/Card';
import { BudgetChart, MilestoneChart, ProgressBudgetChart } from './ui/Chart';
import { Alert } from './ui/Alert';
import PageLoader from './ui/PageLoader';

/**
 * Client Portal Component - Phase 2 Week 4
 * Apple HIG compliant client interface for project monitoring
 */

const ClientPortal = ({ projectId, clientId }) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/client/projects/${projectId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Client-ID': clientId
          }
        });
        setProject(response.data);

        // Fetch notifications
        try {
          const notifResponse = await axios.get(`/api/client/notifications`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Client-ID': clientId
            }
          });
          setNotifications(notifResponse.data || []);
        } catch (error) {
          console.error('Failed to fetch notifications:', error);
        }

        // Fetch messages
        try {
          const msgResponse = await axios.get(`/api/client/messages/${projectId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Client-ID': clientId
            }
          });
          setMessages(msgResponse.data || []);
        } catch (error) {
          console.error('Failed to fetch messages:', error);
        }
      } catch (error) {
        console.error('Failed to fetch project data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (projectId) {
      loadData();
    }
  }, [projectId, clientId]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return '-';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <PageLoader size="lg" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Alert variant="error" title="Proyek tidak ditemukan" />
      </div>
    );
  }

  const contractValue = project.budget?.contractValue || 0;
  const actualCost = project.budget?.actualCost || 0;
  const progress = project.progress?.percentage || 0;

  const tabs = [
    { id: 'overview', label: 'Ringkasan', icon: Eye },
    { id: 'progress', label: 'Progress', icon: CheckCircle },
    { id: 'budget', label: 'Budget', icon: DollarSign },
    { id: 'documents', label: 'Dokumen', icon: FileText },
    { id: 'messages', label: 'Komunikasi', icon: MessageCircle }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
              <p className="text-gray-600">{project.location?.address}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell size={16} className="mr-1.5" />
                Notifikasi ({notifications.length})
              </Button>
              <Button variant="outline" size="sm">
                <Settings size={16} className="mr-1.5" />
                Pengaturan
              </Button>
              <Button variant="outline" size="sm">
                <LogOut size={16} className="mr-1.5" />
                Keluar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon size={16} className="mr-1.5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Project Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <KPICard
                title="Nilai Kontrak"
                value={formatCurrency(contractValue)}
                icon={DollarSign}
                color="blue"
              />
              <KPICard
                title="Progress Fisik"
                value={`${progress}%`}
                icon={CheckCircle}
                color="green"
              />
              <KPICard
                title="Milestone"
                value={`${project.milestones?.filter(m => m.completed).length || 0}/${project.milestones?.length || 0}`}
                icon={Calendar}
                color="purple"
              />
              <KPICard
                title="Status"
                value={project.status === 'in_progress' ? 'Berlangsung' : 
                       project.status === 'completed' ? 'Selesai' : 'Planning'}
                icon={AlertCircle}
                color="orange"
              />
            </div>

            {/* Progress & Budget Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ProgressBudgetChart
                progress={progress}
                budgetUsed={actualCost}
                contractValue={contractValue}
                timeline={project.timeline}
              />
              <MilestoneChart
                milestones={project.milestones || []}
                projectTimeline={project.timeline}
              />
            </div>

            {/* Recent Updates */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Terbaru</h3>
              <div className="space-y-4">
                {project.updates?.slice(0, 5).map((update, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{update.title}</p>
                      <p className="text-sm text-gray-600">{update.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(update.date)}</p>
                    </div>
                  </div>
                )) || (
                  <DataCard
                    title="Belum ada update"
                    subtitle="Update proyek akan ditampilkan di sini"
                    isEmpty
                  />
                )}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="space-y-6">
            <MilestoneChart
              milestones={project.milestones || []}
              projectTimeline={project.timeline}
            />
            
            {/* Detailed Progress */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Detail Progress</h3>
              <div className="space-y-4">
                {project.progressDetails?.map((detail, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-gray-900">{detail.phase}</h4>
                      <span className="text-sm font-medium text-blue-600">{detail.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${detail.percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600">{detail.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Target: {formatDate(detail.targetDate)}
                    </p>
                  </div>
                )) || (
                  <DataCard
                    title="Detail progress belum tersedia"
                    subtitle="Informasi detail akan diperbarui oleh tim konstruksi"
                    isEmpty
                  />
                )}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'budget' && (
          <div className="space-y-6">
            <BudgetChart
              projectId={projectId}
              contractValue={contractValue}
              actualCost={actualCost}
              costBreakdown={project.costBreakdown || []}
              showProjections={true}
            />
            
            {/* Payment Schedule */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Jadwal Pembayaran</h3>
              <div className="space-y-3">
                {project.paymentSchedule?.map((payment, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Termin {payment.term}</p>
                      <p className="text-sm text-gray-600">{payment.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(payment.amount)}</p>
                      <p className="text-xs text-gray-500">{formatDate(payment.dueDate)}</p>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        payment.status === 'paid' ? 'bg-green-100 text-green-800' :
                        payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {payment.status === 'paid' ? 'Lunas' :
                         payment.status === 'pending' ? 'Pending' : 'Belum Jatuh Tempo'}
                      </span>
                    </div>
                  </div>
                )) || (
                  <DataCard
                    title="Jadwal pembayaran belum tersedia"
                    subtitle="Informasi pembayaran akan diperbarui"
                    isEmpty
                  />
                )}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-6">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Dokumen Proyek</h3>
              <div className="space-y-3">
                {project.documents?.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <FileText size={20} className="text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{doc.name}</p>
                        <p className="text-sm text-gray-600">{doc.type} • {doc.size}</p>
                        <p className="text-xs text-gray-500">Diupload: {formatDate(doc.uploadDate)}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download size={16} className="mr-1.5" />
                      Download
                    </Button>
                  </div>
                )) || (
                  <DataCard
                    title="Belum ada dokumen"
                    subtitle="Dokumen proyek akan ditampilkan di sini"
                    isEmpty
                  />
                )}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="space-y-6">
            <Card>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Komunikasi</h3>
                <Button size="sm">
                  <MessageCircle size={16} className="mr-1.5" />
                  Pesan Baru
                </Button>
              </div>
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User size={16} className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <p className="font-medium text-gray-900">{message.sender}</p>
                        <p className="text-xs text-gray-500">{formatDate(message.date)}</p>
                      </div>
                      <p className="text-sm text-gray-600">{message.content}</p>
                    </div>
                  </div>
                )) || (
                  <DataCard
                    title="Belum ada pesan"
                    subtitle="Komunikasi dengan tim konstruksi akan ditampilkan di sini"
                    isEmpty
                  />
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientPortal;
