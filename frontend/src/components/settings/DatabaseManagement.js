import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Grid,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  LinearProgress,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Storage as StorageIcon,
  Backup as BackupIcon,
  Restore as RestoreIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  CheckCircle as SuccessIcon,
  Storage as DatabaseIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { API_URL } from '../../utils/config';

const DatabaseManagement = () => {
  const [databaseStatus, setDatabaseStatus] = useState(null);
  const [databases, setDatabases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);
  const [databasesLoading, setDatabasesLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(null);
  const [newDbName, setNewDbName] = useState('');
  const [copyStructure, setCopyStructure] = useState(true);
  const [backupProgress, setBackupProgress] = useState(0);
  const [restoreFile, setRestoreFile] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    fetchDatabaseStatus();
    fetchDatabases();
    
    // Auto refresh every 30 seconds if enabled
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchDatabaseStatus();
        fetchDatabases();
      }, 30000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const fetchDatabaseStatus = async (retryCount = 0) => {
    setStatusLoading(true);
    try {
      const response = await fetch(`${API_URL}/database/status`);
      if (response.ok) {
        const data = await response.json();
        setDatabaseStatus(data.success ? data.data : null);
      } else {
        const errorData = await response.json();
        setDatabaseStatus(errorData.data || null);
        if (!response.ok && retryCount === 0) {
          addAlert('warning', 'Koneksi database bermasalah, status mungkin tidak akurat');
        }
      }
    } catch (error) {
      if (retryCount < 2) {
        // Retry up to 2 times
        setTimeout(() => fetchDatabaseStatus(retryCount + 1), 2000);
        return;
      }
      addAlert('error', 'Gagal mengambil status database: ' + error.message);
      setDatabaseStatus(null);
    } finally {
      setStatusLoading(false);
    }
  };

  const fetchDatabases = async (retryCount = 0) => {
    setDatabasesLoading(true);
    try {
      const response = await fetch(`${API_URL}/database/list`);
      const data = await response.json();
      if (data.success) {
        setDatabases(data.data || []);
      } else {
        throw new Error(data.message || 'Failed to fetch databases');
      }
    } catch (error) {
      if (retryCount < 2) {
        // Retry up to 2 times
        setTimeout(() => fetchDatabases(retryCount + 1), 2000);
        return;
      }
      addAlert('error', 'Gagal mengambil daftar database: ' + error.message);
    } finally {
      setDatabasesLoading(false);
    }
  };

  const addAlert = (severity, message) => {
    const newAlert = { 
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, 
      severity, 
      message 
    };
    setAlerts(prev => [...prev, newAlert]);
    setTimeout(() => {
      setAlerts(prev => prev.filter(alert => alert.id !== newAlert.id));
    }, 5000);
  };

  const handleCreateDatabase = async () => {
    if (!newDbName.trim()) {
      addAlert('warning', 'Nama database tidak boleh kosong');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/database/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          databaseName: newDbName.trim(),
          copyStructure: copyStructure
        })
      });
      const data = await response.json();
      
      if (data.success) {
        addAlert('success', data.message || `Database '${newDbName}' berhasil dibuat`);
        setNewDbName('');
        setCopyStructure(true); // Reset to default
        setOpenDialog(null);
        fetchDatabases();
      } else {
        addAlert('error', data.message || 'Gagal membuat database');
      }
    } catch (error) {
      addAlert('error', 'Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchDatabase = async (dbName) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/database/switch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ databaseName: dbName })
      });
      const data = await response.json();
      
      if (data.success) {
        addAlert('success', `Database '${dbName}' berhasil ditest dan dapat digunakan`);
        addAlert('info', 'Untuk switch permanen, restart aplikasi dengan database ini di environment variables');
        setOpenDialog(null);
        fetchDatabaseStatus();
      } else {
        addAlert('error', data.message || 'Gagal test database connection');
      }
    } catch (error) {
      addAlert('error', 'Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDatabase = async (dbName) => {
    if (dbName === 'nusantara_construction') {
      addAlert('error', 'Database utama tidak dapat dihapus');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/database/drop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ databaseName: dbName })
      });
      const data = await response.json();
      
      if (data.success) {
        addAlert('success', `Database '${dbName}' berhasil dihapus`);
        fetchDatabases();
      } else {
        addAlert('error', data.message || 'Gagal menghapus database');
      }
    } catch (error) {
      addAlert('error', 'Error: ' + error.message);
    } finally {
      setLoading(false);
      setOpenDialog(null);
    }
  };

  const handleBackupDatabase = async (dbName = 'nusantara_construction') => {
    setLoading(true);
    setBackupProgress(0);

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setBackupProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch(`${API_URL}/database/backup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ databaseName: dbName })
      });

      clearInterval(progressInterval);
      setBackupProgress(100);

      const data = await response.json();

      if (data.success) {
        addAlert('success', data.message);
        if (data.data?.backupDatabaseName) {
          addAlert('info', `Backup database created: ${data.data.backupDatabaseName}`);
          // Refresh database list to show backup database
          fetchDatabases();
        }
      } else {
        addAlert('error', data.message || 'Backup failed');
      }
    } catch (error) {
      addAlert('error', 'Error: ' + error.message);
    } finally {
      setLoading(false);
      setBackupProgress(0);
    }
  };

  const handleRestoreDatabase = async (targetDbName, backupDbName) => {
    if (!targetDbName || !backupDbName) {
      addAlert('warning', 'Target database dan backup database harus dipilih');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/database/restore`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          databaseName: targetDbName,
          backupSource: backupDbName
        })
      });
      const data = await response.json();
      
      if (data.success) {
        addAlert('success', data.message);
        setOpenDialog(null);
        fetchDatabaseStatus();
        fetchDatabases();
      } else {
        addAlert('error', data.message || 'Gagal melakukan restore');
      }
    } catch (error) {
      addAlert('error', 'Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderDatabaseCard = (db, index = 0) => {
    const isMainDatabase = db.name === 'nusantara_construction';
    
    return (
      <Card key={`${db.name}-${index}`} sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="h6">
                  {db.name}
                </Typography>
                {isMainDatabase && (
                  <Chip label="Database Aktif" color="primary" size="small" />
                )}
              </Box>
              <Typography variant="body2" color="text.secondary">
                Owner: {db.owner || 'N/A'} • Size: {db.size || 'N/A'} • Tables: {db.tableCount || 0}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {!isMainDatabase && (
                <Tooltip title="Set sebagai Database Aktif">
                  <IconButton
                    size="small"
                    color="success"
                    onClick={() => setOpenDialog({ type: 'switch', dbName: db.name })}
                    disabled={loading}
                  >
                    <StorageIcon />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="Backup Database">
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => handleBackupDatabase(db.name)}
                  disabled={loading}
                >
                  <BackupIcon />
                </IconButton>
              </Tooltip>
              {!isMainDatabase && (
                <Tooltip title="Hapus Database">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => setOpenDialog({ type: 'delete', dbName: db.name })}
                    disabled={loading}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box>
      {/* Alerts */}
      {alerts.map(alert => (
        <Alert key={alert.id} severity={alert.severity} sx={{ mb: 2 }}>
          {alert.message}
        </Alert>
      ))}

      {/* Database Status */}
      <Card sx={{ mb: 3 }}>
        <CardHeader
          avatar={<DatabaseIcon />}
          title="Status Database"
          action={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                    size="small"
                  />
                }
                label="Auto Refresh"
                sx={{ mr: 1 }}
              />
              <IconButton onClick={fetchDatabaseStatus} disabled={statusLoading}>
                <RefreshIcon />
              </IconButton>
            </Box>
          }
        />
        <CardContent>
          {statusLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : databaseStatus ? (
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Status Koneksi
                </Typography>
                <Chip 
                  label={databaseStatus.status === 'connected' ? 'Terhubung' : 'Terputus'}
                  color={databaseStatus.status === 'connected' ? 'success' : 'error'}
                  size="small"
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Database Aktif
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {databaseStatus.currentDatabase || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Total Tabel
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {databaseStatus.tableCount || '0'}
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Database Size
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {databaseStatus.databaseSize || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Versi PostgreSQL
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {databaseStatus.version ? databaseStatus.version.split(' ')[1] : 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Host Server
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {databaseStatus.host || 'N/A'}
                </Typography>
              </Grid>
              {databaseStatus.timestamp && (
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">
                    Terakhir diperbarui: {new Date(databaseStatus.timestamp).toLocaleString('id-ID')}
                  </Typography>
                </Grid>
              )}
            </Grid>
          ) : (
            <Alert severity="error">
              Tidak dapat terhubung ke database
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog({ type: 'create' })}
            disabled={loading}
          >
            Buat Database Baru
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<BackupIcon />}
            onClick={() => handleBackupDatabase()}
            disabled={loading}
          >
            Backup Database
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<RestoreIcon />}
            onClick={() => setOpenDialog({ type: 'restore' })}
            disabled={loading}
          >
            Restore Database
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => { 
              fetchDatabaseStatus(); 
              fetchDatabases(); 
              addAlert('info', 'Data diperbarui');
            }}
            disabled={loading || statusLoading || databasesLoading}
          >
            {(statusLoading || databasesLoading) ? 'Memperbarui...' : 'Refresh Data'}
          </Button>
        </Grid>
      </Grid>

      {/* Progress Bar */}
      {loading && backupProgress > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" gutterBottom>
            Progress Backup: {backupProgress}%
          </Typography>
          <LinearProgress variant="determinate" value={backupProgress} />
        </Box>
      )}

      {/* Databases List */}
      <Card>
        <CardHeader
          title="Daftar Database"
          action={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip label={`${databases.length} Database`} color="primary" />
              <IconButton onClick={fetchDatabases} disabled={databasesLoading} size="small">
                <RefreshIcon />
              </IconButton>
            </Box>
          }
        />
        <CardContent>
          {/* Info Alert */}
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Database Management:</strong><br/>
              • <strong>nusantara_construction</strong>: Database utama aplikasi (aktif)<br/>
              • <strong>Database lain</strong>: Database testing/development yang dapat dibuat<br/>
              • <strong>System databases</strong> (postgres, templates) disembunyikan untuk keamanan<br/>
              • Klik icon database untuk set sebagai database aktif (testing)
            </Typography>
          </Alert>
          
          {databasesLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : databases.length > 0 ? (
            databases.map((db, index) => renderDatabaseCard(db, index))
          ) : (
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Tidak ada database ditemukan
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      
      {/* Create Database Dialog */}
      <Dialog open={openDialog?.type === 'create'} onClose={() => setOpenDialog(null)}>
        <DialogTitle>Buat Database Baru</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nama Database"
            fullWidth
            variant="outlined"
            value={newDbName}
            onChange={(e) => setNewDbName(e.target.value)}
            helperText="Nama database harus unik dan tidak mengandung spasi"
          />
          <FormControlLabel
            control={
              <Switch
                checked={copyStructure}
                onChange={(e) => setCopyStructure(e.target.checked)}
                color="primary"
              />
            }
            label="Salin struktur tabel dari database utama"
            sx={{ mt: 2 }}
          />
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
            {copyStructure 
              ? "Database baru akan memiliki struktur tabel yang sama dengan database utama tetapi tanpa data. Siap untuk demo dan testing." 
              : "Database baru akan kosong tanpa tabel. Cocok untuk import data atau setup manual."
            }
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(null)}>Batal</Button>
          <Button onClick={handleCreateDatabase} disabled={loading} variant="contained">
            {loading ? <CircularProgress size={20} /> : 'Buat Database'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Switch Database Dialog */}
      <Dialog open={openDialog?.type === 'switch'} onClose={() => setOpenDialog(null)}>
        <DialogTitle>Switch Database Aktif</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Switch Database:</strong><br/>
              Ini akan test koneksi ke database "{openDialog?.dbName}" dan menandainya sebagai database yang dapat digunakan.
              Untuk switch permanen, perlu restart aplikasi.
            </Typography>
          </Alert>
          <Typography>
            Apakah Anda yakin ingin set "{openDialog?.dbName}" sebagai database aktif?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(null)}>Batal</Button>
          <Button 
            onClick={() => handleSwitchDatabase(openDialog?.dbName)} 
            disabled={loading} 
            color="success" 
            variant="contained"
          >
            {loading ? <CircularProgress size={20} /> : 'Switch Database'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Database Dialog */}
      <Dialog open={openDialog?.type === 'delete'} onClose={() => setOpenDialog(null)}>
        <DialogTitle>Konfirmasi Hapus Database</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Peringatan:</strong> Tindakan ini tidak dapat dibatalkan!
            </Typography>
          </Alert>
          <Typography>
            Apakah Anda yakin ingin menghapus database "{openDialog?.dbName}"?
            Semua data akan hilang permanen.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(null)}>Batal</Button>
          <Button 
            onClick={() => handleDeleteDatabase(openDialog?.dbName)} 
            disabled={loading} 
            color="error" 
            variant="contained"
          >
            {loading ? <CircularProgress size={20} /> : 'Hapus Database'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Restore Database Dialog */}
      <Dialog open={openDialog?.type === 'restore'} onClose={() => setOpenDialog(null)}>
        <DialogTitle>Restore Database</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              Restore akan mengganti seluruh data database saat ini dengan data dari backup file.
            </Typography>
          </Alert>
          <input
            type="file"
            accept=".sql,.backup"
            onChange={(e) => setRestoreFile(e.target.files[0])}
            style={{ width: '100%', padding: '10px', marginTop: '10px' }}
          />
          {restoreFile && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              File dipilih: {restoreFile.name}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(null)}>Batal</Button>
          <Button 
            onClick={handleRestoreDatabase} 
            disabled={loading || !restoreFile} 
            color="warning" 
            variant="contained"
          >
            {loading ? <CircularProgress size={20} /> : 'Restore Database'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DatabaseManagement;