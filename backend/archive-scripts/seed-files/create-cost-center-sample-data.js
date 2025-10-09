/**
 * Sample Data Generator for Cost Centers and Project Costing
 * Phase 9: Cost Center Management & Project Costing
 * Creates realistic cost center and project costing data for testing
 */

const { sequelize } = require('./config/database');

async function createCostCenterSampleData() {
  console.log('🏗️  Creating Cost Center & Project Costing Sample Data...');
  
  try {
    // Cost Centers data
    const costCenters = [
      {
        id: 'CC-ADM-001',
        cost_center_code: 'CC-ADM-001',
        cost_center_name: 'Administration',
        cost_center_type: 'ADMINISTRATIVE',
        budget_limit: 500000000,
        actual_costs: 425000000,
        is_active: true,
        description: 'General administration and management costs',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'CC-OPS-001',
        cost_center_code: 'CC-OPS-001',
        cost_center_name: 'Operations',
        cost_center_type: 'OPERATIONAL',
        budget_limit: 2000000000,
        actual_costs: 1850000000,
        is_active: true,
        description: 'Main operations for construction activities',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'CC-PRJ-001',
        cost_center_code: 'CC-PRJ-001',
        cost_center_name: 'Project Alpha',
        cost_center_type: 'PROJECT_SPECIFIC',
        budget_limit: 3000000000,
        actual_costs: 2750000000,
        is_active: true,
        description: 'Dedicated cost center for Project Alpha construction',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'CC-EQP-001',
        cost_center_code: 'CC-EQP-001',
        cost_center_name: 'Equipment Management',
        cost_center_type: 'EQUIPMENT',
        budget_limit: 1500000000,
        actual_costs: 1200000000,
        is_active: true,
        description: 'Heavy equipment and machinery management',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'CC-MAT-001',
        cost_center_code: 'CC-MAT-001',
        cost_center_name: 'Material Procurement',
        cost_center_type: 'MATERIAL_PROCUREMENT',
        budget_limit: 2500000000,
        actual_costs: 2100000000,
        is_active: true,
        description: 'Construction materials procurement and inventory',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    // Cost Allocations data
    const costAllocations = [
      {
        id: 'ALLOC-001',
        cost_center_id: 'CC-OPS-001',
        project_id: 'PROJ-001',
        allocation_amount: 750000000,
        allocation_type: 'DIRECT_LABOR',
        allocation_basis: 'Labor hours worked',
        description: 'Labor cost allocation for Q3 construction work',
        effective_date: '2025-09-01',
        status: 'ACTIVE',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'ALLOC-002',
        cost_center_id: 'CC-EQP-001',
        project_id: 'PROJ-001',
        allocation_amount: 400000000,
        allocation_type: 'EQUIPMENT_USAGE',
        allocation_basis: 'Equipment hours utilized',
        description: 'Heavy equipment allocation for foundation work',
        effective_date: '2025-09-01',
        status: 'ACTIVE',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'ALLOC-003',
        cost_center_id: 'CC-MAT-001',
        project_id: 'PROJ-001',
        allocation_amount: 850000000,
        allocation_type: 'DIRECT_MATERIAL',
        allocation_basis: 'Material quantity used',
        description: 'Construction materials allocation',
        effective_date: '2025-09-01',
        status: 'ACTIVE',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 'ALLOC-004',
        cost_center_id: 'CC-ADM-001',
        project_id: 'PROJ-001',
        allocation_amount: 125000000,
        allocation_type: 'OVERHEAD_ALLOCATION',
        allocation_basis: 'Percentage of direct costs',
        description: 'Administrative overhead allocation',
        effective_date: '2025-09-01',
        status: 'ACTIVE',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    // Project Costing Structure data
    const projectCostingStructures = [
      {
        id: 'PCS-PROJ-001',
        project_id: 'PROJ-001',
        project_name: 'Construction Project Alpha',
        project_type: 'CONSTRUCTION',
        total_budget: 5000000000,
        actual_costs: 2500000000,
        start_date: '2025-01-01',
        end_date: '2025-12-31',
        completion_percent: 50,
        cost_breakdown: JSON.stringify({
          directCosts: {
            materials: { percentage: 40, amount: 2000000000, actual: 850000000 },
            labor: { percentage: 30, amount: 1500000000, actual: 675000000 },
            equipment: { percentage: 15, amount: 750000000, actual: 425000000 },
            subcontractors: { percentage: 10, amount: 500000000, actual: 300000000 }
          },
          indirectCosts: {
            overhead: { percentage: 3, amount: 150000000, actual: 125000000 },
            administration: { percentage: 1.5, amount: 75000000, actual: 75000000 },
            insurance: { percentage: 0.5, amount: 25000000, actual: 50000000 }
          }
        }),
        resource_requirements: JSON.stringify({
          manpower: {
            projectManager: { quantity: 1, dailyRate: 2000000, totalDays: 180, actualDays: 90 },
            siteEngineer: { quantity: 2, dailyRate: 1500000, totalDays: 180, actualDays: 90 },
            foreman: { quantity: 3, dailyRate: 800000, totalDays: 180, actualDays: 90 },
            workers: { quantity: 20, dailyRate: 400000, totalDays: 160, actualDays: 80 },
            technicians: { quantity: 5, dailyRate: 600000, totalDays: 150, actualDays: 75 }
          },
          equipment: {
            excavator: { quantity: 2, dailyRate: 3000000, totalDays: 60, actualDays: 30 },
            crane: { quantity: 1, dailyRate: 5000000, totalDays: 90, actualDays: 45 },
            concreteMixer: { quantity: 3, dailyRate: 1500000, totalDays: 120, actualDays: 60 },
            trucks: { quantity: 5, dailyRate: 800000, totalDays: 150, actualDays: 75 }
          }
        }),
        profitability_metrics: JSON.stringify({
          plannedMargin: 1000000000,
          actualMargin: 500000000,
          marginPercent: 16.67,
          roi: 25,
          costPerformanceIndex: 1.2,
          schedulePerformanceIndex: 1.0
        }),
        risk_factors: JSON.stringify([
          { factor: 'Weather Delays', probability: 0.3, impact: 'MEDIUM' },
          { factor: 'Material Price Fluctuation', probability: 0.4, impact: 'HIGH' },
          { factor: 'Labor Shortage', probability: 0.2, impact: 'MEDIUM' }
        ]),
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    // Create data using raw SQL since we might not have models
    console.log('📊 Creating cost centers...');
    
    // Delete existing data if any
    try {
      await sequelize.query('DELETE FROM cost_allocations WHERE 1=1');
      await sequelize.query('DELETE FROM project_costing_structures WHERE 1=1'); 
      await sequelize.query('DELETE FROM cost_centers WHERE 1=1');
      console.log('🗑️  Cleared existing Phase 9 data');
    } catch (error) {
      console.log('⚠️  Tables might not exist yet, continuing...');
    }

    // Create cost centers table if not exists
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS cost_centers (
        id VARCHAR(255) PRIMARY KEY,
        cost_center_code VARCHAR(50) UNIQUE NOT NULL,
        cost_center_name VARCHAR(255) NOT NULL,
        cost_center_type VARCHAR(50) NOT NULL,
        budget_limit DECIMAL(15,2) DEFAULT 0,
        actual_costs DECIMAL(15,2) DEFAULT 0,
        allocated_costs DECIMAL(15,2) DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        parent_cost_center_id VARCHAR(255),
        description TEXT,
        subsidiary_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (parent_cost_center_id) REFERENCES cost_centers(id)
      )
    `);

    // Create cost allocations table if not exists
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS cost_allocations (
        id VARCHAR(255) PRIMARY KEY,
        cost_center_id VARCHAR(255) NOT NULL,
        project_id VARCHAR(255),
        allocation_amount DECIMAL(15,2) NOT NULL,
        allocation_type VARCHAR(50) NOT NULL,
        allocation_basis VARCHAR(255),
        description TEXT,
        effective_date DATE,
        journal_entry_id VARCHAR(255),
        status VARCHAR(20) DEFAULT 'ACTIVE',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (cost_center_id) REFERENCES cost_centers(id)
      )
    `);

    // Create project costing structures table if not exists
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS project_costing_structures (
        id VARCHAR(255) PRIMARY KEY,
        project_id VARCHAR(255) UNIQUE NOT NULL,
        project_name VARCHAR(255) NOT NULL,
        project_type VARCHAR(50) DEFAULT 'CONSTRUCTION',
        total_budget DECIMAL(15,2) NOT NULL,
        actual_costs DECIMAL(15,2) DEFAULT 0,
        start_date DATE,
        end_date DATE,
        completion_percent DECIMAL(5,2) DEFAULT 0,
        cost_breakdown JSON,
        resource_requirements JSON,
        profitability_metrics JSON,
        risk_factors JSON,
        subsidiary_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert cost centers
    for (const costCenter of costCenters) {
      await sequelize.query(`
        INSERT INTO cost_centers 
        (id, cost_center_code, cost_center_name, cost_center_type, budget_limit, actual_costs, is_active, description, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, {
        replacements: [
          costCenter.id,
          costCenter.cost_center_code,
          costCenter.cost_center_name,
          costCenter.cost_center_type,
          costCenter.budget_limit,
          costCenter.actual_costs,
          costCenter.is_active,
          costCenter.description,
          costCenter.created_at,
          costCenter.updated_at
        ]
      });
    }

    // Insert cost allocations
    for (const allocation of costAllocations) {
      await sequelize.query(`
        INSERT INTO cost_allocations 
        (id, cost_center_id, project_id, allocation_amount, allocation_type, allocation_basis, description, effective_date, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, {
        replacements: [
          allocation.id,
          allocation.cost_center_id,
          allocation.project_id,
          allocation.allocation_amount,
          allocation.allocation_type,
          allocation.allocation_basis,
          allocation.description,
          allocation.effective_date,
          allocation.status,
          allocation.created_at,
          allocation.updated_at
        ]
      });
    }

    // Insert project costing structures
    for (const projectCosting of projectCostingStructures) {
      await sequelize.query(`
        INSERT INTO project_costing_structures 
        (id, project_id, project_name, project_type, total_budget, actual_costs, start_date, end_date, completion_percent, cost_breakdown, resource_requirements, profitability_metrics, risk_factors, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, {
        replacements: [
          projectCosting.id,
          projectCosting.project_id,
          projectCosting.project_name,
          projectCosting.project_type,
          projectCosting.total_budget,
          projectCosting.actual_costs,
          projectCosting.start_date,
          projectCosting.end_date,
          projectCosting.completion_percent,
          projectCosting.cost_breakdown,
          projectCosting.resource_requirements,
          projectCosting.profitability_metrics,
          projectCosting.risk_factors,
          projectCosting.created_at,
          projectCosting.updated_at
        ]
      });
    }

    console.log('✅ Phase 9 Sample Data Created Successfully!');
    console.log(`📊 Created ${costCenters.length} cost centers`);
    console.log(`🔄 Created ${costAllocations.length} cost allocations`);
    console.log(`🏗️  Created ${projectCostingStructures.length} project costing structures`);
    
    // Display summary
    console.log('\n📈 Phase 9 Data Summary:');
    console.log('Cost Centers:');
    costCenters.forEach(cc => {
      console.log(`  • ${cc.cost_center_code}: ${cc.cost_center_name} (${cc.cost_center_type}) - Budget: ${(cc.budget_limit/1000000).toFixed(0)}M IDR`);
    });
    
    console.log('\nCost Allocations:');
    costAllocations.forEach(alloc => {
      console.log(`  • ${alloc.cost_center_id} → ${alloc.project_id}: ${(alloc.allocation_amount/1000000).toFixed(0)}M IDR (${alloc.allocation_type})`);
    });

    return {
      success: true,
      message: 'Phase 9 sample data created successfully',
      data: {
        costCenters: costCenters.length,
        costAllocations: costAllocations.length,
        projectCostingStructures: projectCostingStructures.length
      }
    };

  } catch (error) {
    console.error('❌ Error creating Phase 9 sample data:', error);
    return {
      success: false,
      message: 'Error creating Phase 9 sample data',
      error: error.message
    };
  }
}

// Run the sample data creation
if (require.main === module) {
  createCostCenterSampleData()
    .then(result => {
      console.log('\n🎉 Phase 9 Sample Data Creation Complete!');
      console.log(result);
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Failed to create Phase 9 sample data:', error);
      process.exit(1);
    });
}

module.exports = { createCostCenterSampleData };
