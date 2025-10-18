const cron = require('node-cron');
const backupService = require('../services/backupService');

/**
 * Backup Scheduler
 * Manages scheduled backup operations
 */

let dailyBackupJob = null;
let cleanupJob = null;

/**
 * Start daily backup job
 * Runs every day at 2:00 AM
 */
function startDailyBackup() {
  if (dailyBackupJob) {
    console.log('Daily backup job already running');
    return;
  }
  
  // Schedule: Every day at 2:00 AM
  dailyBackupJob = cron.schedule('0 2 * * *', async () => {
    console.log('=== Starting scheduled daily backup ===');
    
    try {
      const result = await backupService.createBackup({
        backupType: 'FULL',
        triggeredBy: 'SYSTEM',
        triggeredByUsername: 'scheduler',
        retentionDays: 30
      });
      
      console.log('Daily backup completed successfully');
      console.log(`Backup ID: ${result.backup.id}`);
      console.log(`File: ${result.backup.fileName}`);
      console.log(`Size: ${result.backup.fileSize} bytes`);
      console.log(`Duration: ${result.backup.duration}s`);
      console.log(`Verified: ${result.verified}`);
    } catch (error) {
      console.error('Daily backup failed:', error);
    }
  }, {
    scheduled: true,
    timezone: process.env.TZ || 'Asia/Jakarta'
  });
  
  console.log('Daily backup job scheduled (2:00 AM daily)');
}

/**
 * Start weekly cleanup job
 * Runs every Sunday at 3:00 AM
 */
function startWeeklyCleanup() {
  if (cleanupJob) {
    console.log('Weekly cleanup job already running');
    return;
  }
  
  // Schedule: Every Sunday at 3:00 AM
  cleanupJob = cron.schedule('0 3 * * 0', async () => {
    console.log('=== Starting scheduled backup cleanup ===');
    
    try {
      const result = await backupService.cleanupOldBackups();
      
      console.log('Backup cleanup completed successfully');
      console.log(`Deleted: ${result.deletedCount} backups`);
      console.log(`Freed: ${result.freedSpace} bytes`);
    } catch (error) {
      console.error('Backup cleanup failed:', error);
    }
  }, {
    scheduled: true,
    timezone: process.env.TZ || 'Asia/Jakarta'
  });
  
  console.log('Weekly cleanup job scheduled (Sunday 3:00 AM)');
}

/**
 * Stop daily backup job
 */
function stopDailyBackup() {
  if (dailyBackupJob) {
    dailyBackupJob.stop();
    dailyBackupJob = null;
    console.log('Daily backup job stopped');
  }
}

/**
 * Stop weekly cleanup job
 */
function stopWeeklyCleanup() {
  if (cleanupJob) {
    cleanupJob.stop();
    cleanupJob = null;
    console.log('Weekly cleanup job stopped');
  }
}

/**
 * Start all scheduled jobs
 */
function startAllJobs() {
  console.log('Starting backup scheduler...');
  startDailyBackup();
  startWeeklyCleanup();
  console.log('All backup jobs started');
}

/**
 * Stop all scheduled jobs
 */
function stopAllJobs() {
  console.log('Stopping backup scheduler...');
  stopDailyBackup();
  stopWeeklyCleanup();
  console.log('All backup jobs stopped');
}

/**
 * Get job status
 */
function getJobStatus() {
  return {
    dailyBackup: {
      running: dailyBackupJob !== null,
      schedule: '0 2 * * *',
      description: 'Daily backup at 2:00 AM'
    },
    weeklyCleanup: {
      running: cleanupJob !== null,
      schedule: '0 3 * * 0',
      description: 'Weekly cleanup on Sunday at 3:00 AM'
    }
  };
}

module.exports = {
  startDailyBackup,
  startWeeklyCleanup,
  stopDailyBackup,
  stopWeeklyCleanup,
  startAllJobs,
  stopAllJobs,
  getJobStatus
};
