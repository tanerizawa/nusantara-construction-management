'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Hash passwords
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    // Insert users
    await queryInterface.bulkInsert('users', [
      {
        id: 'USR001',
        username: 'admin',
        email: 'admin@ykconstruction.com',
        password: hashedPassword,
        role: 'admin',
        profile: JSON.stringify({
          fullName: 'Budi Santoso',
          position: 'IT Administrator',
          phone: '+62812-3456-7890',
          avatar: '/avatars/admin.jpg',
          department: 'IT',
          joinDate: '2024-01-15',
          isActive: true
        }),
        permissions: JSON.stringify(['all']),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'USR002',
        username: 'project_manager1',
        email: 'pm1@ykconstruction.com',
        password: hashedPassword,
        role: 'project_manager',
        profile: JSON.stringify({
          fullName: 'Sari Wijayanti',
          position: 'Senior Project Manager',
          phone: '+62813-2345-6789',
          avatar: '/avatars/pm1.jpg',
          department: 'Projects',
          joinDate: '2024-02-01',
          isActive: true
        }),
        permissions: JSON.stringify(['projects_access', 'team_management']),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'USR003',
        username: 'finance_manager',
        email: 'finance@ykconstruction.com',
        password: hashedPassword,
        role: 'finance_manager',
        profile: JSON.stringify({
          fullName: 'Ahmad Fauzi',
          position: 'Finance Manager',
          phone: '+62814-3456-7890',
          avatar: '/avatars/fm.jpg',
          department: 'Finance',
          joinDate: '2024-01-20',
          isActive: true
        }),
        permissions: JSON.stringify(['finance_access', 'reports_access']),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Insert projects
    await queryInterface.bulkInsert('projects', [
      {
        id: 'PRJ001',
        name: 'Pembangunan Gedung Perkantoran Plaza Menteng',
        description: 'Proyek pembangunan gedung perkantoran 15 lantai di kawasan Menteng dengan total luas 5000 m²',
        client_name: 'PT Menteng Development',
        client_contact: JSON.stringify({
          person: 'Ir. Bambang Sutrisno',
          phone: '+62811-2233-4455',
          email: 'bambang@mentengdev.com'
        }),
        location: JSON.stringify({
          address: 'Jl. Menteng Raya No. 45, Jakarta Pusat',
          coordinates: { lat: -6.1944, lng: 106.8229 }
        }),
        budget: 15000000000,
        actual_cost: 8500000000,
        status: 'active',
        priority: 'high',
        progress: 65,
        start_date: '2024-03-01',
        end_date: '2025-02-28',
        estimated_duration: 365,
        project_manager_id: 'USR002',
        team: JSON.stringify([
          { id: 'USR002', role: 'Project Manager' },
          { id: 'EMP001', role: 'Site Engineer', name: 'Dedi Kurniawan' },
          { id: 'EMP002', role: 'Safety Officer', name: 'Rini Sari' }
        ]),
        milestones: JSON.stringify([
          { id: 1, name: 'Persiapan Lahan', status: 'completed', date: '2024-03-15' },
          { id: 2, name: 'Pondasi', status: 'completed', date: '2024-05-01' },
          { id: 3, name: 'Struktur Lantai 1-5', status: 'completed', date: '2024-07-15' },
          { id: 4, name: 'Struktur Lantai 6-10', status: 'in_progress', date: '2024-10-01' },
          { id: 5, name: 'Struktur Lantai 11-15', status: 'pending', date: '2024-12-15' },
          { id: 6, name: 'Finishing', status: 'pending', date: '2025-02-01' }
        ]),
        tags: JSON.stringify(['commercial', 'high-rise', 'jakarta']),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'PRJ002',
        name: 'Renovasi Pabrik Tekstil Bandung',
        description: 'Renovasi dan modernisasi pabrik tekstil di Bandung seluas 2500 m²',
        client_name: 'PT Tekstil Nusantara',
        client_contact: JSON.stringify({
          person: 'Hj. Siti Aminah',
          phone: '+62822-3344-5566',
          email: 'siti@tekstilnusantara.com'
        }),
        location: JSON.stringify({
          address: 'Jl. Industri Raya No. 123, Bandung',
          coordinates: { lat: -6.9175, lng: 107.6191 }
        }),
        budget: 5000000000,
        actual_cost: 2800000000,
        status: 'active',
        priority: 'medium',
        progress: 45,
        start_date: '2024-04-15',
        end_date: '2024-12-31',
        estimated_duration: 260,
        project_manager_id: 'USR002',
        team: JSON.stringify([
          { id: 'USR002', role: 'Project Manager' },
          { id: 'EMP003', role: 'Civil Engineer', name: 'Andi Wijaya' },
          { id: 'EMP004', role: 'Electrical Engineer', name: 'Linda Sari' }
        ]),
        milestones: JSON.stringify([
          { id: 1, name: 'Survey dan Perencanaan', status: 'completed', date: '2024-04-30' },
          { id: 2, name: 'Demolisi Area Lama', status: 'completed', date: '2024-06-15' },
          { id: 3, name: 'Konstruksi Baru', status: 'in_progress', date: '2024-09-30' },
          { id: 4, name: 'Instalasi Mesin', status: 'pending', date: '2024-11-30' },
          { id: 5, name: 'Testing dan Commissioning', status: 'pending', date: '2024-12-15' }
        ]),
        tags: JSON.stringify(['industrial', 'renovation', 'bandung']),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('projects', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
};
