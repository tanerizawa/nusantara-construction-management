/**
 * Sample Data Generator for Fixed Assets
 * Phase 10: Fixed Asset Management & Depreciation
 * Creates realistic fixed asset data for construction industry testing
 */

const { sequelize } = require('./config/database');

async function createFixedAssetSampleData() {
  console.log('🏗️  Creating Fixed Asset & Depreciation Sample Data...');
  
  try {
    // Fixed Assets data
    const fixedAssets = [
      {
        id: 'ASSET-001',
        asset_code: 'EXC-001',
        asset_name: 'Excavator CAT 320D',
        asset_category: 'HEAVY_EQUIPMENT',
        asset_type: 'EXCAVATOR',
        description: 'Heavy-duty excavator for construction projects',
        purchase_price: 2500000000,
        purchase_date: '2023-01-15',
        supplier: 'PT Trakindo Utama',
        invoice_number: 'INV-CAT-2023-001',
        depreciation_method: 'STRAIGHT_LINE',
        useful_life: 10,
        salvage_value: 250000000,
        depreciation_start_date: '2023-01-15',
        accumulated_depreciation: 520833333,
        net_book_value: 1979166667,
        location: 'Site A - Jakarta Timur',
        department: 'Construction Operations',
        responsible_person: 'Ahmad Wijaya',
        cost_center: 'CC-OPS-001',
        status: 'ACTIVE',
        condition: 'GOOD',
        serial_number: 'CAT320D2023001',
        model_number: '320D',
        manufacturer: 'Caterpillar Inc.',
        last_maintenance_date: '2025-06-15',
        next_maintenance_date: '2025-12-15',
        maintenance_costs: 125000000,
        subsidiary_id: 'SUB-001',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'ASSET-002',
        asset_code: 'CRN-001',
        asset_name: 'Tower Crane Liebherr 250EC-B',
        asset_category: 'HEAVY_EQUIPMENT',
        asset_type: 'CRANE',
        description: 'Tower crane for high-rise construction',
        purchase_price: 5000000000,
        purchase_date: '2022-06-10',
        supplier: 'PT Liebherr Indonesia',
        invoice_number: 'INV-LBR-2022-015',
        depreciation_method: 'STRAIGHT_LINE',
        useful_life: 15,
        salvage_value: 500000000,
        depreciation_start_date: '2022-06-10',
        accumulated_depreciation: 1166666667,
        net_book_value: 3833333333,
        location: 'Site B - Bekasi',
        department: 'Construction Operations',
        responsible_person: 'Budi Santoso',
        cost_center: 'CC-EQP-001',
        status: 'ACTIVE',
        condition: 'EXCELLENT',
        serial_number: 'LBR250EC2022001',
        model_number: '250EC-B',
        manufacturer: 'Liebherr',
        last_maintenance_date: '2025-08-01',
        next_maintenance_date: '2025-11-01',
        maintenance_costs: 200000000,
        subsidiary_id: 'SUB-001',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'ASSET-003',
        asset_code: 'TRK-001',
        asset_name: 'Dump Truck Mitsubishi Fuso',
        asset_category: 'VEHICLES',
        asset_type: 'DUMP_TRUCK',
        description: 'Heavy-duty dump truck for material transport',
        purchase_price: 1500000000,
        purchase_date: '2021-03-20',
        supplier: 'PT Mitsubishi Motors',
        invoice_number: 'INV-MIT-2021-078',
        depreciation_method: 'DECLINING_BALANCE',
        useful_life: 8,
        salvage_value: 150000000,
        depreciation_start_date: '2021-03-20',
        accumulated_depreciation: 937500000,
        net_book_value: 562500000,
        location: 'Head Office - Jakarta',
        department: 'Logistics',
        responsible_person: 'Siti Nurhaliza',
        cost_center: 'CC-OPS-001',
        status: 'ACTIVE',
        condition: 'FAIR',
        serial_number: 'FUSODT2021001',
        model_number: 'FV517H4',
        manufacturer: 'Mitsubishi Fuso',
        last_maintenance_date: '2025-07-10',
        next_maintenance_date: '2025-10-10',
        maintenance_costs: 85000000,
        subsidiary_id: 'SUB-001',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'ASSET-004',
        asset_code: 'CMX-001',
        asset_name: 'Concrete Mixer Truck Hino',
        asset_category: 'HEAVY_EQUIPMENT',
        asset_type: 'CONCRETE_MIXER',
        description: 'Mobile concrete mixer for on-site concrete delivery',
        purchase_price: 2200000000,
        purchase_date: '2023-08-12',
        supplier: 'PT Hino Motors Indonesia',
        invoice_number: 'INV-HIN-2023-092',
        depreciation_method: 'UNITS_OF_PRODUCTION',
        useful_life: 12,
        salvage_value: 220000000,
        depreciation_start_date: '2023-08-12',
        accumulated_depreciation: 165000000,
        net_book_value: 2035000000,
        location: 'Site C - Tangerang',
        department: 'Construction Operations',
        responsible_person: 'Eko Prasetyo',
        cost_center: 'CC-EQP-001',
        status: 'ACTIVE',
        condition: 'GOOD',
        serial_number: 'HINOCMX2023001',
        model_number: 'FM 260 TI',
        manufacturer: 'Hino Motors',
        last_maintenance_date: '2025-08-20',
        next_maintenance_date: '2025-11-20',
        maintenance_costs: 45000000,
        subsidiary_id: 'SUB-001',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'ASSET-005',
        asset_code: 'BLD-001',
        asset_name: 'Head Office Building',
        asset_category: 'BUILDINGS',
        asset_type: 'OFFICE_BUILDING',
        description: 'Main office building complex',
        purchase_price: 15000000000,
        purchase_date: '2020-01-01',
        supplier: 'PT Properti Prima',
        invoice_number: 'INV-PPR-2020-001',
        depreciation_method: 'STRAIGHT_LINE',
        useful_life: 25,
        salvage_value: 1500000000,
        depreciation_start_date: '2020-01-01',
        accumulated_depreciation: 3240000000,
        net_book_value: 11760000000,
        location: 'Jl. Sudirman Jakarta Pusat',
        department: 'Administration',
        responsible_person: 'Dewi Sartika',
        cost_center: 'CC-ADM-001',
        status: 'ACTIVE',
        condition: 'EXCELLENT',
        serial_number: 'BLD-OFFICE-001',
        model_number: 'N/A',
        manufacturer: 'N/A',
        last_maintenance_date: '2025-06-01',
        next_maintenance_date: '2026-06-01',
        maintenance_costs: 180000000,
        subsidiary_id: 'SUB-001',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    // Depreciation History data
    const depreciationHistory = [
      {
        id: 'DEPR-001',
        asset_id: 'ASSET-001',
        depreciation_date: '2023-12-31',
        depreciation_amount: 225000000,
        accumulated_depreciation: 225000000,
        net_book_value: 2275000000,
        depreciation_method: 'STRAIGHT_LINE',
        journal_entry_id: 'JE-DEPR-2023-001',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'DEPR-002',
        asset_id: 'ASSET-001',
        depreciation_date: '2024-12-31',
        depreciation_amount: 225000000,
        accumulated_depreciation: 450000000,
        net_book_value: 2050000000,
        depreciation_method: 'STRAIGHT_LINE',
        journal_entry_id: 'JE-DEPR-2024-001',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'DEPR-003',
        asset_id: 'ASSET-002',
        depreciation_date: '2022-12-31',
        depreciation_amount: 183333333,
        accumulated_depreciation: 183333333,
        net_book_value: 4816666667,
        depreciation_method: 'STRAIGHT_LINE',
        journal_entry_id: 'JE-DEPR-2022-002',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'DEPR-004',
        asset_id: 'ASSET-005',
        depreciation_date: '2024-12-31',
        depreciation_amount: 540000000,
        accumulated_depreciation: 2700000000,
        net_book_value: 12300000000,
        depreciation_method: 'STRAIGHT_LINE',
        journal_entry_id: 'JE-DEPR-2024-005',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    // Asset Maintenance Records
    const maintenanceRecords = [
      {
        id: 'MAINT-001',
        asset_id: 'ASSET-001',
        maintenance_date: '2025-06-15',
        maintenance_type: 'ROUTINE',
        description: 'Regular maintenance, oil change, and filter replacement',
        cost: 25000000,
        technician: 'Ahmad Sudirman',
        vendor: 'PT Service Heavy Equipment',
        next_maintenance_date: '2025-12-15',
        status: 'COMPLETED',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'MAINT-002',
        asset_id: 'ASSET-001',
        maintenance_date: '2025-03-15',
        maintenance_type: 'MAJOR',
        description: 'Engine overhaul and hydraulic system repair',
        cost: 75000000,
        technician: 'Budi Santoso',
        vendor: 'PT Service Heavy Equipment',
        next_maintenance_date: '2025-06-15',
        status: 'COMPLETED',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'MAINT-003',
        asset_id: 'ASSET-002',
        maintenance_date: '2025-08-01',
        maintenance_type: 'ROUTINE',
        description: 'Tower crane inspection and lubrication',
        cost: 35000000,
        technician: 'Eko Prasetyo',
        vendor: 'PT Liebherr Service',
        next_maintenance_date: '2025-11-01',
        status: 'COMPLETED',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    // Asset Disposal Records (for testing)
    const assetDisposals = [
      {
        id: 'DISP-001',
        asset_id: 'ASSET-OLD-001',
        asset_code: 'EXC-OLD-001',
        disposal_date: '2025-05-15',
        disposal_method: 'SALE',
        disposal_price: 800000000,
        disposal_costs: 25000000,
        buyer_information: 'PT Construction Partner',
        final_net_book_value: 750000000,
        gain_loss_on_disposal: 25000000,
        disposal_reason: 'End of useful life, replacement with newer model',
        authorized_by: 'Finance Director',
        document_number: 'DISP-2025-001',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    console.log('📊 Creating fixed asset tables...');
    
    // Delete existing data if any
    try {
      await sequelize.query('DELETE FROM asset_disposals WHERE 1=1');
      await sequelize.query('DELETE FROM maintenance_records WHERE 1=1');
      await sequelize.query('DELETE FROM depreciation_history WHERE 1=1');
      await sequelize.query('DELETE FROM fixed_assets WHERE 1=1');
      console.log('🗑️  Cleared existing Phase 10 data');
    } catch (error) {
      console.log('⚠️  Tables might not exist yet, continuing...');
    }

    // Create fixed_assets table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS fixed_assets (
        id VARCHAR(255) PRIMARY KEY,
        asset_code VARCHAR(50) UNIQUE NOT NULL,
        asset_name VARCHAR(255) NOT NULL,
        asset_category VARCHAR(50) NOT NULL,
        asset_type VARCHAR(50),
        description TEXT,
        purchase_price DECIMAL(15,2) NOT NULL,
        purchase_date DATE NOT NULL,
        supplier VARCHAR(255),
        invoice_number VARCHAR(100),
        depreciation_method VARCHAR(50) DEFAULT 'STRAIGHT_LINE',
        useful_life INT NOT NULL,
        salvage_value DECIMAL(15,2) DEFAULT 0,
        depreciation_start_date DATE,
        accumulated_depreciation DECIMAL(15,2) DEFAULT 0,
        net_book_value DECIMAL(15,2),
        location VARCHAR(255),
        department VARCHAR(255),
        responsible_person VARCHAR(255),
        cost_center VARCHAR(255),
        status VARCHAR(50) DEFAULT 'ACTIVE',
        condition VARCHAR(50) DEFAULT 'GOOD',
        serial_number VARCHAR(100),
        model_number VARCHAR(100),
        manufacturer VARCHAR(255),
        last_maintenance_date DATE,
        next_maintenance_date DATE,
        maintenance_costs DECIMAL(15,2) DEFAULT 0,
        subsidiary_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create depreciation_history table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS depreciation_history (
        id VARCHAR(255) PRIMARY KEY,
        asset_id VARCHAR(255) NOT NULL,
        depreciation_date DATE NOT NULL,
        depreciation_amount DECIMAL(15,2) NOT NULL,
        accumulated_depreciation DECIMAL(15,2) NOT NULL,
        net_book_value DECIMAL(15,2) NOT NULL,
        depreciation_method VARCHAR(50),
        journal_entry_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (asset_id) REFERENCES fixed_assets(id)
      )
    `);

    // Create maintenance_records table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS maintenance_records (
        id VARCHAR(255) PRIMARY KEY,
        asset_id VARCHAR(255) NOT NULL,
        maintenance_date DATE NOT NULL,
        maintenance_type VARCHAR(50) NOT NULL,
        description TEXT,
        cost DECIMAL(15,2) NOT NULL,
        technician VARCHAR(255),
        vendor VARCHAR(255),
        next_maintenance_date DATE,
        status VARCHAR(50) DEFAULT 'SCHEDULED',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (asset_id) REFERENCES fixed_assets(id)
      )
    `);

    // Create asset_disposals table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS asset_disposals (
        id VARCHAR(255) PRIMARY KEY,
        asset_id VARCHAR(255) NOT NULL,
        asset_code VARCHAR(50),
        disposal_date DATE NOT NULL,
        disposal_method VARCHAR(50) NOT NULL,
        disposal_price DECIMAL(15,2) DEFAULT 0,
        disposal_costs DECIMAL(15,2) DEFAULT 0,
        buyer_information TEXT,
        final_net_book_value DECIMAL(15,2),
        gain_loss_on_disposal DECIMAL(15,2),
        disposal_reason TEXT,
        authorized_by VARCHAR(255),
        document_number VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert fixed assets
    for (const asset of fixedAssets) {
      await sequelize.query(`
        INSERT INTO fixed_assets 
        (id, asset_code, asset_name, asset_category, asset_type, description, purchase_price, purchase_date, supplier, invoice_number, depreciation_method, useful_life, salvage_value, depreciation_start_date, accumulated_depreciation, net_book_value, location, department, responsible_person, cost_center, status, condition, serial_number, model_number, manufacturer, last_maintenance_date, next_maintenance_date, maintenance_costs, subsidiary_id, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, {
        replacements: [
          asset.id, asset.asset_code, asset.asset_name, asset.asset_category, asset.asset_type,
          asset.description, asset.purchase_price, asset.purchase_date, asset.supplier,
          asset.invoice_number, asset.depreciation_method, asset.useful_life, asset.salvage_value,
          asset.depreciation_start_date, asset.accumulated_depreciation, asset.net_book_value,
          asset.location, asset.department, asset.responsible_person, asset.cost_center,
          asset.status, asset.condition, asset.serial_number, asset.model_number,
          asset.manufacturer, asset.last_maintenance_date, asset.next_maintenance_date,
          asset.maintenance_costs, asset.subsidiary_id, asset.created_at, asset.updated_at
        ]
      });
    }

    // Insert depreciation history
    for (const depr of depreciationHistory) {
      await sequelize.query(`
        INSERT INTO depreciation_history 
        (id, asset_id, depreciation_date, depreciation_amount, accumulated_depreciation, net_book_value, depreciation_method, journal_entry_id, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, {
        replacements: [
          depr.id, depr.asset_id, depr.depreciation_date, depr.depreciation_amount,
          depr.accumulated_depreciation, depr.net_book_value, depr.depreciation_method,
          depr.journal_entry_id, depr.created_at, depr.updated_at
        ]
      });
    }

    // Insert maintenance records
    for (const maint of maintenanceRecords) {
      await sequelize.query(`
        INSERT INTO maintenance_records 
        (id, asset_id, maintenance_date, maintenance_type, description, cost, technician, vendor, next_maintenance_date, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, {
        replacements: [
          maint.id, maint.asset_id, maint.maintenance_date, maint.maintenance_type,
          maint.description, maint.cost, maint.technician, maint.vendor,
          maint.next_maintenance_date, maint.status, maint.created_at, maint.updated_at
        ]
      });
    }

    // Insert asset disposals
    for (const disposal of assetDisposals) {
      await sequelize.query(`
        INSERT INTO asset_disposals 
        (id, asset_id, asset_code, disposal_date, disposal_method, disposal_price, disposal_costs, buyer_information, final_net_book_value, gain_loss_on_disposal, disposal_reason, authorized_by, document_number, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, {
        replacements: [
          disposal.id, disposal.asset_id, disposal.asset_code, disposal.disposal_date,
          disposal.disposal_method, disposal.disposal_price, disposal.disposal_costs,
          disposal.buyer_information, disposal.final_net_book_value, disposal.gain_loss_on_disposal,
          disposal.disposal_reason, disposal.authorized_by, disposal.document_number,
          disposal.created_at, disposal.updated_at
        ]
      });
    }

    console.log('✅ Phase 10 Sample Data Created Successfully!');
    console.log(`🏗️  Created ${fixedAssets.length} fixed assets`);
    console.log(`📊 Created ${depreciationHistory.length} depreciation records`);
    console.log(`🔧 Created ${maintenanceRecords.length} maintenance records`);
    console.log(`🗑️  Created ${assetDisposals.length} disposal records`);
    
    // Display summary
    console.log('\n📈 Phase 10 Data Summary:');
    console.log('Fixed Assets:');
    fixedAssets.forEach(asset => {
      console.log(`  • ${asset.asset_code}: ${asset.asset_name} (${asset.asset_category}) - Value: ${(asset.net_book_value/1000000).toFixed(0)}M IDR`);
    });
    
    const totalOriginalValue = fixedAssets.reduce((sum, asset) => sum + asset.purchase_price, 0);
    const totalNetBookValue = fixedAssets.reduce((sum, asset) => sum + asset.net_book_value, 0);
    const totalDepreciation = fixedAssets.reduce((sum, asset) => sum + asset.accumulated_depreciation, 0);
    
    console.log(`\n💰 Financial Summary:`);
    console.log(`   Total Original Cost: ${(totalOriginalValue/1000000000).toFixed(1)} Billion IDR`);
    console.log(`   Total Net Book Value: ${(totalNetBookValue/1000000000).toFixed(1)} Billion IDR`);
    console.log(`   Total Accumulated Depreciation: ${(totalDepreciation/1000000000).toFixed(1)} Billion IDR`);

    return {
      success: true,
      message: 'Phase 10 sample data created successfully',
      data: {
        fixedAssets: fixedAssets.length,
        depreciationHistory: depreciationHistory.length,
        maintenanceRecords: maintenanceRecords.length,
        assetDisposals: assetDisposals.length
      }
    };

  } catch (error) {
    console.error('❌ Error creating Phase 10 sample data:', error);
    return {
      success: false,
      message: 'Error creating Phase 10 sample data',
      error: error.message
    };
  }
}

// Run the sample data creation
if (require.main === module) {
  createFixedAssetSampleData()
    .then(result => {
      console.log('\n🎉 Phase 10 Sample Data Creation Complete!');
      console.log(result);
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Failed to create Phase 10 sample data:', error);
      process.exit(1);
    });
}

module.exports = { createFixedAssetSampleData };
