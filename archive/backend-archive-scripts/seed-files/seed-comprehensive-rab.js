const { Sequelize } = require('sequelize');
require('dotenv').config();

// Database connection
const sequelize = new Sequelize(
  process.env.DB_NAME || 'yk_construction_dev',
  process.env.DB_USERNAME || 'postgres', 
  process.env.DB_PASSWORD || 'dev_password',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false
  }
);

/**
 * Comprehensive RAB Generator for NUSANTARA GROUP Projects
 * Creates realistic RAB samples based on project types and construction best practices
 */

// RAB Categories with detailed subcategories
const rabCategories = {
  // A. PEKERJAAN PERSIAPAN
  preparation: {
    name: 'Pekerjaan Persiapan',
    items: [
      'Mobilisasi dan Demobilisasi',
      'Pagar Pengaman Proyek',
      'Kantor dan Gudang Sementara',
      'Papan Nama Proyek',
      'Bongkar Bangunan Lama',
      'Pembersihan Lahan',
      'Direksi Kit',
      'Pengukuran dan Pematokan'
    ]
  },
  
  // B. PEKERJAAN TANAH
  earthwork: {
    name: 'Pekerjaan Tanah',
    items: [
      'Galian Tanah Pondasi',
      'Galian Tanah Saluran',
      'Timbunan Tanah Pilihan',
      'Pemadatan Tanah',
      'Urugan Pasir Bawah Pondasi',
      'Urugan Sirtu Jalan Kerja',
      'Dewatering/Pompa Air'
    ]
  },
  
  // C. PEKERJAAN PONDASI
  foundation: {
    name: 'Pekerjaan Pondasi',
    items: [
      'Pondasi Bore Pile D30cm',
      'Pondasi Bore Pile D40cm',
      'Pondasi Foot Plat',
      'Pile Cap',
      'Sloof Beton Bertulang',
      'Dinding Penahan Tanah',
      'Pondasi Batu Kali',
      'Waterproofing Pondasi'
    ]
  },
  
  // D. PEKERJAAN STRUKTUR
  structure: {
    name: 'Pekerjaan Struktur',
    items: [
      'Kolom Beton Bertulang',
      'Balok Beton Bertulang',
      'Pelat Lantai Beton',
      'Tangga Beton Bertulang',
      'Cor Lantai Kerja',
      'Dinding Geser/Shear Wall',
      'Struktur Baja',
      'Bekisting dan Perancah'
    ]
  },
  
  // E. PEKERJAAN ARSITEKTUR
  architecture: {
    name: 'Pekerjaan Arsitektur',
    items: [
      'Dinding Bata Merah',
      'Dinding Hebel/Bata Ringan',
      'Plesteran dan Acian',
      'Pengecatan Dinding',
      'Keramik Lantai 60x60',
      'Keramik Dinding 30x30',
      'Pintu dan Jendela',
      'Plafon Gypsum',
      'Atap Genteng Metal',
      'Partisi Toilet'
    ]
  },
  
  // F. PEKERJAAN MEKANIKAL
  mechanical: {
    name: 'Pekerjaan Mekanikal',
    items: [
      'Instalasi Pipa Air Bersih',
      'Instalasi Pipa Air Kotor',
      'Instalasi Pipa Air Hujan',
      'Pompa Air',
      'Septic Tank',
      'Bak Kontrol',
      'Fire Hydrant System',
      'Sprinkler System',
      'HVAC Central',
      'Exhaust Fan'
    ]
  },
  
  // G. PEKERJAAN ELEKTRIKAL
  electrical: {
    name: 'Pekerjaan Elektrikal',
    items: [
      'Panel Listrik Utama',
      'Panel Sub Distribusi',
      'Instalasi Kabel Power',
      'Instalasi Lampu LED',
      'Stop Kontak dan Saklar',
      'Grounding System',
      'Lightning Rod',
      'CCTV System',
      'Sound System',
      'Access Control',
      'Fire Alarm System',
      'Emergency Lighting'
    ]
  },
  
  // H. PEKERJAAN LANSEKAP
  landscape: {
    name: 'Pekerjaan Lansekap',
    items: [
      'Taman dan Tanaman Hias',
      'Sistem Irigasi Taman',
      'Paving Block',
      'Curbing Beton',
      'Gazebo',
      'Playground Equipment',
      'Lampu Taman'
    ]
  },
  
  // I. PEKERJAAN KHUSUS
  specialty: {
    name: 'Pekerjaan Khusus',
    items: [
      'Lift Passenger',
      'Escalator',
      'Genset',
      'Transformer',
      'Server Room',
      'Kitchen Equipment',
      'Medical Equipment',
      'Laboratory Equipment'
    ]
  }
};

// Project-specific RAB templates based on project types
const projectTypeRAB = {
  // INDUSTRIAL PROJECTS
  industrial: {
    categories: ['preparation', 'earthwork', 'foundation', 'structure', 'architecture', 'mechanical', 'electrical'],
    multipliers: {
      preparation: 0.05,  // 5% of total
      earthwork: 0.08,    // 8% of total
      foundation: 0.15,   // 15% of total
      structure: 0.35,    // 35% of total
      architecture: 0.20, // 20% of total
      mechanical: 0.10,   // 10% of total
      electrical: 0.07    // 7% of total
    },
    specialItems: [
      'Crane Rail System',
      'Industrial Flooring Heavy Duty',
      'Loading Dock',
      'Overhead Crane',
      'Fire Protection Foam System'
    ]
  },
  
  // COMMERCIAL PROJECTS
  commercial: {
    categories: ['preparation', 'earthwork', 'foundation', 'structure', 'architecture', 'mechanical', 'electrical', 'specialty'],
    multipliers: {
      preparation: 0.04,
      earthwork: 0.06,
      foundation: 0.12,
      structure: 0.30,
      architecture: 0.25,
      mechanical: 0.08,
      electrical: 0.10,
      specialty: 0.05
    },
    specialItems: [
      'Escalator 2 Lantai',
      'Lift Passenger 8 Orang',
      'Fire Alarm Addressable',
      'CCTV IP Camera 4MP',
      'Sound System BGM'
    ]
  },
  
  // RESIDENTIAL PROJECTS
  residential: {
    categories: ['preparation', 'earthwork', 'foundation', 'structure', 'architecture', 'mechanical', 'electrical', 'landscape'],
    multipliers: {
      preparation: 0.03,
      earthwork: 0.05,
      foundation: 0.10,
      structure: 0.25,
      architecture: 0.35,
      mechanical: 0.08,
      electrical: 0.08,
      landscape: 0.06
    },
    specialItems: [
      'Carport',
      'Pagar Rumah',
      'Taman Depan',
      'Water Heater Solar'
    ]
  },
  
  // INFRASTRUCTURE PROJECTS
  infrastructure: {
    categories: ['preparation', 'earthwork', 'foundation', 'structure', 'architecture', 'mechanical', 'electrical'],
    multipliers: {
      preparation: 0.06,
      earthwork: 0.20,
      foundation: 0.25,
      structure: 0.30,
      architecture: 0.10,
      mechanical: 0.05,
      electrical: 0.04
    },
    specialItems: [
      'Expansion Joint',
      'Bridge Bearing',
      'Guardrail',
      'Street Lighting',
      'Traffic Light System'
    ]
  },
  
  // HEALTHCARE PROJECTS
  healthcare: {
    categories: ['preparation', 'earthwork', 'foundation', 'structure', 'architecture', 'mechanical', 'electrical', 'specialty'],
    multipliers: {
      preparation: 0.04,
      earthwork: 0.05,
      foundation: 0.10,
      structure: 0.25,
      architecture: 0.25,
      mechanical: 0.12,
      electrical: 0.12,
      specialty: 0.07
    },
    specialItems: [
      'Medical Gas System',
      'Operating Room Equipment',
      'Clean Room HVAC',
      'X-Ray Room Shielding',
      'Nurse Call System'
    ]
  }
};

// Unit prices (in Rupiah) - realistic 2025 prices
const unitPrices = {
  // PERSIAPAN
  'Mobilisasi dan Demobilisasi': { unit: 'ls', price: 25000000 },
  'Pagar Pengaman Proyek': { unit: 'm1', price: 185000 },
  'Kantor dan Gudang Sementara': { unit: 'm2', price: 850000 },
  'Papan Nama Proyek': { unit: 'unit', price: 2500000 },
  'Bongkar Bangunan Lama': { unit: 'm2', price: 125000 },
  'Pembersihan Lahan': { unit: 'm2', price: 8500 },
  'Direksi Kit': { unit: 'ls', price: 15000000 },
  'Pengukuran dan Pematokan': { unit: 'm2', price: 2500 },
  
  // TANAH
  'Galian Tanah Pondasi': { unit: 'm3', price: 65000 },
  'Galian Tanah Saluran': { unit: 'm3', price: 55000 },
  'Timbunan Tanah Pilihan': { unit: 'm3', price: 75000 },
  'Pemadatan Tanah': { unit: 'm3', price: 35000 },
  'Urugan Pasir Bawah Pondasi': { unit: 'm3', price: 385000 },
  'Urugan Sirtu Jalan Kerja': { unit: 'm3', price: 285000 },
  'Dewatering/Pompa Air': { unit: 'ls', price: 8500000 },
  
  // PONDASI
  'Pondasi Bore Pile D30cm': { unit: 'm1', price: 485000 },
  'Pondasi Bore Pile D40cm': { unit: 'm1', price: 685000 },
  'Pondasi Foot Plat': { unit: 'm3', price: 2850000 },
  'Pile Cap': { unit: 'm3', price: 2650000 },
  'Sloof Beton Bertulang': { unit: 'm3', price: 2750000 },
  'Dinding Penahan Tanah': { unit: 'm3', price: 2950000 },
  'Pondasi Batu Kali': { unit: 'm3', price: 850000 },
  'Waterproofing Pondasi': { unit: 'm2', price: 125000 },
  
  // STRUKTUR
  'Kolom Beton Bertulang': { unit: 'm3', price: 3250000 },
  'Balok Beton Bertulang': { unit: 'm3', price: 3150000 },
  'Pelat Lantai Beton': { unit: 'm3', price: 2950000 },
  'Tangga Beton Bertulang': { unit: 'm3', price: 3450000 },
  'Cor Lantai Kerja': { unit: 'm3', price: 1250000 },
  'Dinding Geser/Shear Wall': { unit: 'm3', price: 3350000 },
  'Struktur Baja': { unit: 'kg', price: 18500 },
  'Bekisting dan Perancah': { unit: 'm2', price: 185000 },
  
  // ARSITEKTUR
  'Dinding Bata Merah': { unit: 'm2', price: 185000 },
  'Dinding Hebel/Bata Ringan': { unit: 'm2', price: 225000 },
  'Plesteran dan Acian': { unit: 'm2', price: 45000 },
  'Pengecatan Dinding': { unit: 'm2', price: 28000 },
  'Keramik Lantai 60x60': { unit: 'm2', price: 285000 },
  'Keramik Dinding 30x30': { unit: 'm2', price: 185000 },
  'Pintu dan Jendela': { unit: 'm2', price: 1850000 },
  'Plafon Gypsum': { unit: 'm2', price: 185000 },
  'Atap Genteng Metal': { unit: 'm2', price: 285000 },
  'Partisi Toilet': { unit: 'm2', price: 485000 },
  
  // MEKANIKAL
  'Instalasi Pipa Air Bersih': { unit: 'titik', price: 285000 },
  'Instalasi Pipa Air Kotor': { unit: 'titik', price: 385000 },
  'Instalasi Pipa Air Hujan': { unit: 'm1', price: 125000 },
  'Pompa Air': { unit: 'unit', price: 8500000 },
  'Septic Tank': { unit: 'unit', price: 12500000 },
  'Bak Kontrol': { unit: 'unit', price: 1850000 },
  'Fire Hydrant System': { unit: 'titik', price: 8500000 },
  'Sprinkler System': { unit: 'titik', price: 485000 },
  'HVAC Central': { unit: 'pk', price: 25000000 },
  'Exhaust Fan': { unit: 'unit', price: 1250000 },
  
  // ELEKTRIKAL
  'Panel Listrik Utama': { unit: 'unit', price: 45000000 },
  'Panel Sub Distribusi': { unit: 'unit', price: 18500000 },
  'Instalasi Kabel Power': { unit: 'titik', price: 385000 },
  'Instalasi Lampu LED': { unit: 'titik', price: 485000 },
  'Stop Kontak dan Saklar': { unit: 'titik', price: 185000 },
  'Grounding System': { unit: 'titik', price: 1250000 },
  'Lightning Rod': { unit: 'unit', price: 8500000 },
  'CCTV System': { unit: 'titik', price: 4850000 },
  'Sound System': { unit: 'zone', price: 8500000 },
  'Access Control': { unit: 'titik', price: 6850000 },
  'Fire Alarm System': { unit: 'titik', price: 2850000 },
  'Emergency Lighting': { unit: 'titik', price: 685000 },
  
  // LANSEKAP
  'Taman dan Tanaman Hias': { unit: 'm2', price: 185000 },
  'Sistem Irigasi Taman': { unit: 'm2', price: 85000 },
  'Paving Block': { unit: 'm2', price: 185000 },
  'Curbing Beton': { unit: 'm1', price: 125000 },
  'Gazebo': { unit: 'unit', price: 25000000 },
  'Playground Equipment': { unit: 'set', price: 85000000 },
  'Lampu Taman': { unit: 'unit', price: 1850000 },
  
  // KHUSUS
  'Lift Passenger': { unit: 'unit', price: 485000000 },
  'Escalator': { unit: 'unit', price: 785000000 },
  'Genset': { unit: 'kva', price: 18500000 },
  'Transformer': { unit: 'kva', price: 28500000 },
  'Server Room': { unit: 'ls', price: 185000000 },
  'Kitchen Equipment': { unit: 'ls', price: 125000000 },
  'Medical Equipment': { unit: 'ls', price: 285000000 },
  'Laboratory Equipment': { unit: 'ls', price: 185000000 },
  
  // SPECIAL ITEMS
  'Crane Rail System': { unit: 'm1', price: 2850000 },
  'Industrial Flooring Heavy Duty': { unit: 'm2', price: 485000 },
  'Loading Dock': { unit: 'unit', price: 85000000 },
  'Overhead Crane': { unit: 'unit', price: 485000000 },
  'Fire Protection Foam System': { unit: 'ls', price: 125000000 },
  'Escalator 2 Lantai': { unit: 'unit', price: 785000000 },
  'Lift Passenger 8 Orang': { unit: 'unit', price: 485000000 },
  'Fire Alarm Addressable': { unit: 'ls', price: 85000000 },
  'CCTV IP Camera 4MP': { unit: 'unit', price: 8500000 },
  'Sound System BGM': { unit: 'ls', price: 45000000 },
  'Carport': { unit: 'm2', price: 1850000 },
  'Pagar Rumah': { unit: 'm1', price: 485000 },
  'Taman Depan': { unit: 'm2', price: 185000 },
  'Water Heater Solar': { unit: 'unit', price: 18500000 },
  'Expansion Joint': { unit: 'm1', price: 1850000 },
  'Bridge Bearing': { unit: 'unit', price: 28500000 },
  'Guardrail': { unit: 'm1', price: 485000 },
  'Street Lighting': { unit: 'unit', price: 8500000 },
  'Traffic Light System': { unit: 'set', price: 185000000 },
  'Medical Gas System': { unit: 'ls', price: 185000000 },
  'Operating Room Equipment': { unit: 'ls', price: 485000000 },
  'Clean Room HVAC': { unit: 'ls', price: 285000000 },
  'X-Ray Room Shielding': { unit: 'm2', price: 2850000 },
  'Nurse Call System': { unit: 'ls', price: 85000000 }
};

// Function to determine project type from name and tags
function determineProjectType(projectName, tags) {
  const name = projectName.toLowerCase();
  const tagsList = Array.isArray(tags) ? tags : [];
  
  if (name.includes('industrial') || name.includes('pabrik') || name.includes('manufaktur') || tagsList.includes('industrial')) {
    return 'industrial';
  }
  if (name.includes('mall') || name.includes('plaza') || name.includes('office') || name.includes('perkantoran') || tagsList.includes('commercial')) {
    return 'commercial';
  }
  if (name.includes('perumahan') || name.includes('residence') || name.includes('villa') || tagsList.includes('residential')) {
    return 'residential';
  }
  if (name.includes('jembatan') || name.includes('jalan') || name.includes('infrastruktur') || tagsList.includes('infrastructure')) {
    return 'infrastructure';
  }
  if (name.includes('rumah sakit') || name.includes('hospital') || name.includes('klinik') || tagsList.includes('healthcare')) {
    return 'healthcare';
  }
  
  // Default to commercial for mixed projects
  return 'commercial';
}

// Function to calculate realistic quantities based on project budget and area
function calculateQuantities(projectBudget, projectType, item) {
  const baseBudget = 1000000000; // 1 Miliar base
  const scaleFactor = projectBudget / baseBudget;
  
  // Base quantities per billion budget
  const baseQuantities = {
    // PERSIAPAN
    'Mobilisasi dan Demobilisasi': 1,
    'Pagar Pengaman Proyek': Math.round(200 * scaleFactor),
    'Kantor dan Gudang Sementara': Math.round(50 * scaleFactor),
    'Papan Nama Proyek': Math.round(2 * scaleFactor) || 1,
    'Bongkar Bangunan Lama': Math.round(100 * scaleFactor),
    'Pembersihan Lahan': Math.round(500 * scaleFactor),
    'Direksi Kit': 1,
    'Pengukuran dan Pematokan': Math.round(500 * scaleFactor),
    
    // TANAH
    'Galian Tanah Pondasi': Math.round(150 * scaleFactor),
    'Galian Tanah Saluran': Math.round(75 * scaleFactor),
    'Timbunan Tanah Pilihan': Math.round(200 * scaleFactor),
    'Pemadatan Tanah': Math.round(300 * scaleFactor),
    'Urugan Pasir Bawah Pondasi': Math.round(50 * scaleFactor),
    'Urugan Sirtu Jalan Kerja': Math.round(100 * scaleFactor),
    'Dewatering/Pompa Air': 1,
    
    // PONDASI
    'Pondasi Bore Pile D30cm': Math.round(100 * scaleFactor),
    'Pondasi Bore Pile D40cm': Math.round(50 * scaleFactor),
    'Pondasi Foot Plat': Math.round(25 * scaleFactor),
    'Pile Cap': Math.round(20 * scaleFactor),
    'Sloof Beton Bertulang': Math.round(30 * scaleFactor),
    'Dinding Penahan Tanah': Math.round(15 * scaleFactor),
    'Pondasi Batu Kali': Math.round(40 * scaleFactor),
    'Waterproofing Pondasi': Math.round(200 * scaleFactor),
    
    // STRUKTUR
    'Kolom Beton Bertulang': Math.round(50 * scaleFactor),
    'Balok Beton Bertulang': Math.round(60 * scaleFactor),
    'Pelat Lantai Beton': Math.round(150 * scaleFactor),
    'Tangga Beton Bertulang': Math.round(8 * scaleFactor),
    'Cor Lantai Kerja': Math.round(100 * scaleFactor),
    'Dinding Geser/Shear Wall': Math.round(25 * scaleFactor),
    'Struktur Baja': Math.round(5000 * scaleFactor),
    'Bekisting dan Perancah': Math.round(500 * scaleFactor),
    
    // ARSITEKTUR
    'Dinding Bata Merah': Math.round(800 * scaleFactor),
    'Dinding Hebel/Bata Ringan': Math.round(400 * scaleFactor),
    'Plesteran dan Acian': Math.round(1200 * scaleFactor),
    'Pengecatan Dinding': Math.round(1200 * scaleFactor),
    'Keramik Lantai 60x60': Math.round(500 * scaleFactor),
    'Keramik Dinding 30x30': Math.round(200 * scaleFactor),
    'Pintu dan Jendela': Math.round(100 * scaleFactor),
    'Plafon Gypsum': Math.round(500 * scaleFactor),
    'Atap Genteng Metal': Math.round(600 * scaleFactor),
    'Partisi Toilet': Math.round(50 * scaleFactor),
    
    // MEKANIKAL
    'Instalasi Pipa Air Bersih': Math.round(30 * scaleFactor),
    'Instalasi Pipa Air Kotor': Math.round(25 * scaleFactor),
    'Instalasi Pipa Air Hujan': Math.round(100 * scaleFactor),
    'Pompa Air': Math.round(2 * scaleFactor) || 1,
    'Septic Tank': Math.round(1 * scaleFactor) || 1,
    'Bak Kontrol': Math.round(5 * scaleFactor),
    'Fire Hydrant System': Math.round(4 * scaleFactor),
    'Sprinkler System': Math.round(20 * scaleFactor),
    'HVAC Central': Math.round(10 * scaleFactor),
    'Exhaust Fan': Math.round(8 * scaleFactor),
    
    // ELEKTRIKAL
    'Panel Listrik Utama': 1,
    'Panel Sub Distribusi': Math.round(3 * scaleFactor),
    'Instalasi Kabel Power': Math.round(50 * scaleFactor),
    'Instalasi Lampu LED': Math.round(80 * scaleFactor),
    'Stop Kontak dan Saklar': Math.round(100 * scaleFactor),
    'Grounding System': Math.round(10 * scaleFactor),
    'Lightning Rod': Math.round(2 * scaleFactor) || 1,
    'CCTV System': Math.round(12 * scaleFactor),
    'Sound System': Math.round(4 * scaleFactor),
    'Access Control': Math.round(6 * scaleFactor),
    'Fire Alarm System': Math.round(20 * scaleFactor),
    'Emergency Lighting': Math.round(15 * scaleFactor),
    
    // LANSEKAP
    'Taman dan Tanaman Hias': Math.round(200 * scaleFactor),
    'Sistem Irigasi Taman': Math.round(200 * scaleFactor),
    'Paving Block': Math.round(300 * scaleFactor),
    'Curbing Beton': Math.round(150 * scaleFactor),
    'Gazebo': Math.round(1 * scaleFactor) || 1,
    'Playground Equipment': Math.round(1 * scaleFactor) || 1,
    'Lampu Taman': Math.round(10 * scaleFactor),
    
    // KHUSUS
    'Lift Passenger': Math.round(1 * scaleFactor) || 1,
    'Escalator': Math.round(1 * scaleFactor) || 1,
    'Genset': Math.round(250 * scaleFactor),
    'Transformer': Math.round(500 * scaleFactor),
    'Server Room': 1,
    'Kitchen Equipment': 1,
    'Medical Equipment': 1,
    'Laboratory Equipment': 1
  };
  
  return baseQuantities[item] || Math.round(10 * scaleFactor);
}

// Function to generate RAB for a project
function generateProjectRAB(project) {
  const projectType = determineProjectType(project.name, project.tags);
  const template = projectTypeRAB[projectType];
  const totalBudget = parseFloat(project.budget || 0);
  
  console.log(`\n🏗️  Generating RAB for: ${project.name}`);
  console.log(`   📊 Project Type: ${projectType.toUpperCase()}`);
  console.log(`   💰 Budget: Rp ${(totalBudget / 1000000000).toFixed(1)} Miliar`);
  
  const rabItems = [];
  let itemNumber = 1;
  
  // Generate main categories
  template.categories.forEach(categoryKey => {
    const category = rabCategories[categoryKey];
    const categoryBudget = totalBudget * template.multipliers[categoryKey];
    
    console.log(`   📋 ${category.name}: Rp ${(categoryBudget / 1000000).toFixed(1)} Juta`);
    
    // Select subset of items from category based on project type and budget
    const itemCount = Math.min(category.items.length, Math.max(3, Math.floor(category.items.length * 0.7)));
    const selectedItems = category.items.slice(0, itemCount);
    
    selectedItems.forEach(itemName => {
      const unitPrice = unitPrices[itemName];
      if (unitPrice) {
        const quantity = calculateQuantities(totalBudget, projectType, itemName);
        const subtotal = quantity * unitPrice.price;
        
        rabItems.push({
          id: `RAB-${project.id}-${String(itemNumber).padStart(3, '0')}`,
          projectId: project.id,
          category: category.name,
          itemName: itemName,
          description: `${itemName} sesuai spesifikasi teknis dan SNI`,
          unit: unitPrice.unit,
          quantity: quantity,
          unitPrice: unitPrice.price,
          subtotal: subtotal,
          notes: `Termasuk material, upah, dan alat`,
          isApproved: Math.random() > 0.3, // 70% approved
          approvedBy: Math.random() > 0.3 ? 'Site Manager' : null,
          approvedDate: Math.random() > 0.3 ? new Date() : null,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        itemNumber++;
      }
    });
  });
  
  // Add special items for project type
  if (template.specialItems) {
    template.specialItems.forEach(itemName => {
      const unitPrice = unitPrices[itemName];
      if (unitPrice) {
        const quantity = calculateQuantities(totalBudget, projectType, itemName);
        const subtotal = quantity * unitPrice.price;
        
        rabItems.push({
          id: `RAB-${project.id}-${String(itemNumber).padStart(3, '0')}`,
          projectId: project.id,
          category: 'Pekerjaan Khusus',
          itemName: itemName,
          description: `${itemName} sesuai kebutuhan proyek`,
          unit: unitPrice.unit,
          quantity: quantity,
          unitPrice: unitPrice.price,
          subtotal: subtotal,
          notes: `Item khusus untuk proyek ${projectType}`,
          isApproved: Math.random() > 0.5, // 50% approved for special items
          approvedBy: Math.random() > 0.5 ? 'Project Manager' : null,
          approvedDate: Math.random() > 0.5 ? new Date() : null,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        itemNumber++;
      }
    });
  }
  
  const totalRAB = rabItems.reduce((sum, item) => sum + item.subtotal, 0);
  const approvedItems = rabItems.filter(item => item.isApproved);
  const approvedTotal = approvedItems.reduce((sum, item) => sum + item.subtotal, 0);
  
  console.log(`   ✅ Generated ${rabItems.length} RAB items`);
  console.log(`   💰 Total RAB: Rp ${(totalRAB / 1000000000).toFixed(2)} Miliar`);
  console.log(`   ✅ Approved: ${approvedItems.length}/${rabItems.length} items (Rp ${(approvedTotal / 1000000000).toFixed(2)} Miliar)`);
  
  return rabItems;
}

// Function to seed RAB data
async function seedRABData() {
  try {
    console.log('🚀 Starting RAB Data Generation...');
    
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    // Get all projects
    const [projects] = await sequelize.query(`
      SELECT id, name, budget, tags, client_name 
      FROM projects 
      WHERE budget > 0 
      ORDER BY budget DESC
    `);
    
    console.log(`📊 Found ${projects.length} projects for RAB generation`);
    
    // Clear existing RAB data
    await sequelize.query('DELETE FROM project_rab_items WHERE 1=1');
    console.log('🗑️  Cleared existing RAB data');
    
    let totalRABItems = 0;
    let totalRABValue = 0;
    
    // Generate RAB for each project
    for (const project of projects) {
      const rabItems = generateProjectRAB(project);
      
      if (rabItems.length > 0) {
        // Insert RAB items
        const insertQuery = `
          INSERT INTO project_rab_items 
          (id, project_id, category, item_name, description, unit, quantity, unit_price, subtotal, notes, is_approved, approved_by, approved_date, created_at, updated_at)
          VALUES ${rabItems.map(() => '(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)').join(',')}
        `;
        
        const values = rabItems.flatMap(item => [
          item.id,
          item.projectId,
          item.category,
          item.itemName,
          item.description,
          item.unit,
          item.quantity,
          item.unitPrice,
          item.subtotal,
          item.notes,
          item.isApproved,
          item.approvedBy,
          item.approvedDate,
          item.createdAt,
          item.updatedAt
        ]);
        
        await sequelize.query(insertQuery, { replacements: values });
        
        totalRABItems += rabItems.length;
        totalRABValue += rabItems.reduce((sum, item) => sum + item.subtotal, 0);
      }
    }
    
    console.log('\n🎉 RAB DATA GENERATION COMPLETED!');
    console.log(`📊 SUMMARY:`);
    console.log(`   🏗️  Projects processed: ${projects.length}`);
    console.log(`   📋 Total RAB items: ${totalRABItems}`);
    console.log(`   💰 Total RAB value: Rp ${(totalRABValue / 1000000000000).toFixed(2)} Triliun`);
    console.log(`   📈 Average RAB per project: Rp ${(totalRABValue / projects.length / 1000000000).toFixed(1)} Miliar`);
    
    // Generate summary by project type
    const projectTypeSummary = {};
    for (const project of projects) {
      const projectType = determineProjectType(project.name, project.tags);
      if (!projectTypeSummary[projectType]) {
        projectTypeSummary[projectType] = { count: 0, totalBudget: 0 };
      }
      projectTypeSummary[projectType].count++;
      projectTypeSummary[projectType].totalBudget += parseFloat(project.budget || 0);
    }
    
    console.log('\n📈 PROJECT TYPE DISTRIBUTION:');
    Object.entries(projectTypeSummary).forEach(([type, data]) => {
      console.log(`   ${type.toUpperCase()}: ${data.count} projects - Rp ${(data.totalBudget / 1000000000000).toFixed(2)} Triliun`);
    });
    
  } catch (error) {
    console.error('❌ Error generating RAB data:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Export functions
module.exports = {
  seedRABData,
  generateProjectRAB,
  rabCategories,
  projectTypeRAB,
  unitPrices
};

// Run seeder if called directly
if (require.main === module) {
  seedRABData()
    .then(() => {
      console.log('✅ RAB generation completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ RAB generation failed:', error);
      process.exit(1);
    });
}
