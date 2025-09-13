import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Chip,
  Alert,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Settings as SettingsIcon,
  AccountCircle as AccountIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Language as LanguageIcon,
  Palette as PaletteIcon,
  Storage as StorageIcon,
  Group as GroupIcon,
  Build as BuildIcon,
  Info as InfoIcon,
  Construction as ConstructionIcon
} from '@mui/icons-material';
import DatabaseManagement from '../components/settings/DatabaseManagement';

const Settings = () => {
  const [selectedSection, setSelectedSection] = useState(null);

  const settingSections = [
    {
      title: 'Profil Pengguna',
      icon: AccountIcon,
      description: 'Kelola informasi profil dan preferensi akun',
      status: 'coming-soon'
    },
    {
      title: 'Keamanan',
      icon: SecurityIcon,
      description: 'Pengaturan password, autentikasi dua faktor',
      status: 'coming-soon'
    },
    {
      title: 'Notifikasi',
      icon: NotificationsIcon,
      description: 'Atur preferensi notifikasi email dan push',
      status: 'coming-soon'
    },
    {
      title: 'Bahasa & Lokalisasi',
      icon: LanguageIcon,
      description: 'Pilih bahasa dan format regional',
      status: 'coming-soon'
    },
    {
      title: 'Tema & Tampilan',
      icon: PaletteIcon,
      description: 'Kustomisasi tema dan layout aplikasi',
      status: 'coming-soon'
    },
    {
      title: 'Database Management',
      icon: StorageIcon,
      description: 'Kelola database, backup, restore, dan testing',
      status: 'available',
      component: 'database'
    },
    {
      title: 'Manajemen Tim',
      icon: GroupIcon,
      description: 'Pengaturan tim dan permisi akses',
      status: 'coming-soon'
    },
    {
      title: 'Integrasi Sistem',
      icon: BuildIcon,
      description: 'Konfigurasi API dan integrasi pihak ketiga',
      status: 'coming-soon'
    }
  ];

  const handleSectionClick = (section) => {
    if (section.status === 'available' && section.component) {
      setSelectedSection(section.component);
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'coming-soon':
        return <Chip label="Segera Hadir" color="warning" size="small" />;
      case 'available':
        return <Chip label="Tersedia" color="success" size="small" />;
      default:
        return <Chip label="Dalam Pengembangan" color="default" size="small" />;
    }
  };

  // Jika ada section yang dipilih, tampilkan komponennya
  if (selectedSection === 'database') {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Button 
            onClick={() => setSelectedSection(null)} 
            sx={{ mb: 2 }}
            variant="outlined"
          >
            ← Kembali ke Pengaturan
          </Button>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
              <StorageIcon />
            </Avatar>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Database Management
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Kelola database, backup, restore, dan buat database baru untuk testing
          </Typography>
        </Box>
        <DatabaseManagement />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
            <SettingsIcon />
          </Avatar>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Pengaturan Sistem
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Kelola pengaturan aplikasi dan preferensi sistem Nusantara Construction Management
        </Typography>
      </Box>

      {/* Under Construction Alert */}
      <Alert 
        severity="info" 
        icon={<ConstructionIcon />}
        sx={{ mb: 4 }}
      >
        <Typography variant="h6" gutterBottom>
          Halaman Sedang Dalam Pengembangan
        </Typography>
        <Typography variant="body2">
          Fitur pengaturan sistem sedang dalam tahap pengembangan. 
          Fitur-fitur di bawah ini akan segera tersedia dalam update mendatang.
        </Typography>
      </Alert>

      {/* Settings Sections */}
      <Grid container spacing={3}>
        {settingSections.map((section, index) => {
          const IconComponent = section.icon;
          return (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  },
                  opacity: section.status === 'coming-soon' ? 0.7 : 1
                }}
              >
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: 'secondary.main' }}>
                      <IconComponent />
                    </Avatar>
                  }
                  action={getStatusChip(section.status)}
                  title={section.title}
                  titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {section.description}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Button 
                      variant="outlined" 
                      size="small"
                      disabled={section.status === 'coming-soon'}
                      fullWidth
                      onClick={() => handleSectionClick(section)}
                    >
                      {section.status === 'coming-soon' ? 'Segera Hadir' : 'Buka Pengaturan'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* System Information */}
      <Paper sx={{ mt: 4, p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <InfoIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" fontWeight="bold">
            Informasi Sistem
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" color="text.secondary">
              Versi Aplikasi
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              2.1.0
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" color="text.secondary">
              Lingkungan
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              Development
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" color="text.secondary">
              Terakhir Update
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              10 September 2025
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" color="text.secondary">
              Pengembang
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              Nusantara Group
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Quick Actions */}
      <Paper sx={{ mt: 3, p: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Aksi Cepat
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Button 
              variant="outlined" 
              fullWidth 
              startIcon={<StorageIcon />}
              disabled
            >
              Backup Data
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button 
              variant="outlined" 
              fullWidth 
              startIcon={<SecurityIcon />}
              disabled
            >
              Audit Log
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button 
              variant="outlined" 
              fullWidth 
              startIcon={<BuildIcon />}
              disabled
            >
              Diagnostik Sistem
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Settings;
