/**
 * Auto-generate Photo Title
 * Format: {photoType}-{projectName}-{DD/MM/YYYY}-{HH:MM:SS}-{sequence}
 * Example: progress-ProyekGedung-13/10/2025-14:30:45-001
 */

const { sequelize } = require('../config/database');

/**
 * Generate auto title for photo
 * @param {string} photoType - Type of photo (progress, issue, etc)
 * @param {string} projectId - Project ID to get project name
 * @param {string} milestoneId - Milestone ID for sequence counting
 * @returns {Promise<string>} Generated title
 */
async function generatePhotoTitle(photoType, projectId, milestoneId) {
  try {
    // 1. Get project name
    const [project] = await sequelize.query(
      'SELECT name FROM projects WHERE id = :projectId LIMIT 1',
      {
        replacements: { projectId },
        type: sequelize.QueryTypes.SELECT
      }
    );

    const projectName = project?.name || 'Project';
    // Clean project name: remove spaces, special chars, keep max 20 chars
    const cleanProjectName = projectName
      .replace(/\s+/g, '')
      .replace(/[^a-zA-Z0-9]/g, '')
      .substring(0, 20);

    // 2. Get current date and time
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const dateStr = `${day}/${month}/${year}`;
    const timeStr = `${hours}:${minutes}:${seconds}`;

    // 3. Get sequence number (count of photos today with same type)
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const [countResult] = await sequelize.query(
      `SELECT COUNT(*) as count 
       FROM milestone_photos 
       WHERE milestone_id = :milestoneId 
       AND photo_type = :photoType 
       AND created_at >= :startOfDay 
       AND created_at < :endOfDay`,
      {
        replacements: {
          milestoneId,
          photoType,
          startOfDay,
          endOfDay
        },
        type: sequelize.QueryTypes.SELECT
      }
    );

    const sequence = (parseInt(countResult.count) + 1).toString().padStart(3, '0');

    // 4. Build title
    // Format: photoType-ProjectName-DD/MM/YYYY-HH:MM:SS-SEQ
    const title = `${photoType}-${cleanProjectName}-${dateStr}-${timeStr}-${sequence}`;

    console.log(`📝 Auto-generated title: ${title}`);
    return title;

  } catch (error) {
    console.error('Error generating photo title:', error);
    // Fallback to simple title
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    return `${photoType}-${dateStr}-${Date.now()}`;
  }
}

/**
 * Generate multiple titles for batch upload
 * @param {string} photoType
 * @param {string} projectId
 * @param {string} milestoneId
 * @param {number} count - Number of photos being uploaded
 * @returns {Promise<Array<string>>} Array of titles
 */
async function generatePhotoTitles(photoType, projectId, milestoneId, count) {
  const titles = [];
  
  // Get base info once
  const [project] = await sequelize.query(
    'SELECT name FROM projects WHERE id = :projectId LIMIT 1',
    {
      replacements: { projectId },
      type: sequelize.QueryTypes.SELECT
    }
  );

  const projectName = project?.name || 'Project';
  const cleanProjectName = projectName
    .replace(/\s+/g, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .substring(0, 20);

  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  const dateStr = `${day}/${month}/${year}`;
  const timeStr = `${hours}:${minutes}:${seconds}`;

  // Get current sequence
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  const [countResult] = await sequelize.query(
    `SELECT COUNT(*) as count 
     FROM milestone_photos 
     WHERE milestone_id = :milestoneId 
     AND photo_type = :photoType 
     AND created_at >= :startOfDay 
     AND created_at < :endOfDay`,
    {
      replacements: {
        milestoneId,
        photoType,
        startOfDay,
        endOfDay
      },
      type: sequelize.QueryTypes.SELECT
    }
  );

  let baseSequence = parseInt(countResult.count) + 1;

  // Generate titles for each photo
  for (let i = 0; i < count; i++) {
    const sequence = String(baseSequence + i).padStart(3, '0');
    const title = `${photoType}-${cleanProjectName}-${dateStr}-${timeStr}-${sequence}`;
    titles.push(title);
  }

  return titles;
}

module.exports = {
  generatePhotoTitle,
  generatePhotoTitles
};
