// Phase 2: Data Mapper Utilities
// Transforms mockup data format to database format

const fs = require('fs');
const path = require('path');

class MockupDataMapper {
  constructor() {
    this.mockupDataPath = path.join(__dirname, '../data');
    this.errors = [];
    this.warnings = [];
  }

  // User data transformation
  transformUsers(mockupUsers) {
    console.log('🔄 Transforming users data...');
    
    if (!mockupUsers || !mockupUsers.users) {
      throw new Error('Invalid users data structure');
    }

    return mockupUsers.users.map(user => {
      try {
        const transformed = {
          id: user.id,
          username: user.username,
          email: user.email,
          password: user.password, // Already hashed in mockup
          role: user.role,
          profile: {
            fullName: user.profile?.fullName || '',
            position: user.profile?.position || '',
            phone: user.profile?.phone || '',
            avatar: user.profile?.avatar || '',
            department: user.profile?.department || '',
            joinDate: user.profile?.joinDate || new Date().toISOString().split('T')[0]
          },
          permissions: Array.isArray(user.permissions) ? user.permissions : [],
          isActive: user.profile?.isActive !== false,
          lastLogin: null,
          loginAttempts: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        // Validate required fields
        if (!transformed.username || !transformed.email) {
          this.errors.push(`User ${user.id}: Missing required fields`);
          return null;
        }

        return transformed;
      } catch (error) {
        this.errors.push(`User ${user.id}: Transformation error - ${error.message}`);
        return null;
      }
    }).filter(user => user !== null);
  }

  // Project data transformation
  transformProjects(mockupProjects) {
    console.log('🔄 Transforming projects data...');
    
    if (!mockupProjects || !mockupProjects.projects) {
      throw new Error('Invalid projects data structure');
    }

    return mockupProjects.projects.map(project => {
      try {
        const transformed = {
          id: project.id,
          projectCode: project.projectCode || `PRJ-${Date.now()}`,
          name: project.name,
          description: project.description || '',
          clientName: project.client?.company || 'Unknown Client',
          clientContact: {
            contactPerson: project.client?.contactPerson || '',
            phone: project.client?.phone || '',
            email: project.client?.email || '',
            address: project.client?.address || ''
          },
          location: project.location || {},
          timeline: project.timeline || {},
          status: project.status || 'planning',
          phase: project.phase || 'planning',
          progress: project.progress || { percentage: 0 },
          budget: parseFloat(project.budget?.contractValue || project.budget?.approvedBudget || 0),
          actualCost: parseFloat(project.budget?.actualCost || 0),
          startDate: project.timeline?.startDate || null,
          endDate: project.timeline?.endDate || null,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        // Validate required fields
        if (!transformed.name || !transformed.clientName) {
          this.errors.push(`Project ${project.id}: Missing required fields`);
          return null;
        }

        // Validate budget
        if (transformed.budget < 0) {
          this.warnings.push(`Project ${project.id}: Invalid budget value`);
          transformed.budget = 0;
        }

        return transformed;
      } catch (error) {
        this.errors.push(`Project ${project.id}: Transformation error - ${error.message}`);
        return null;
      }
    }).filter(project => project !== null);
  }

  // Finance data transformation  
  transformFinance(mockupFinance) {
    console.log('🔄 Transforming finance data...');
    
    if (!Array.isArray(mockupFinance)) {
      throw new Error('Finance data should be an array');
    }

    return mockupFinance.map((transaction, index) => {
      try {
        const transformed = {
          id: transaction.id || `FIN-${Date.now()}-${index}`,
          type: transaction.type === 'Pemasukan' ? 'income' : 'expense',
          category: this.mapFinanceCategory(transaction.type, transaction.desc),
          amount: parseFloat(transaction.amount || 0),
          description: transaction.desc || '',
          date: transaction.date || new Date().toISOString().split('T')[0],
          projectId: this.extractProjectFromDescription(transaction.desc),
          status: 'completed',
          reference: null,
          metadata: {
            originalType: transaction.type,
            importedFrom: 'mockup'
          },
          createdAt: new Date(),
          updatedAt: new Date()
        };

        // Validate amount
        if (transformed.amount <= 0) {
          this.errors.push(`Finance ${transaction.id}: Invalid amount`);
          return null;
        }

        return transformed;
      } catch (error) {
        this.errors.push(`Finance ${transaction.id}: Transformation error - ${error.message}`);
        return null;
      }
    }).filter(transaction => transaction !== null);
  }

  // Inventory data transformation
  transformInventory(mockupInventory) {
    console.log('🔄 Transforming inventory data...');
    
    // Handle both array format and object format
    const inventoryArray = Array.isArray(mockupInventory) ? mockupInventory : 
                          (mockupInventory.inventory || []);
    
    if (!Array.isArray(inventoryArray)) {
      throw new Error('Invalid inventory data structure - expected array');
    }

    return inventoryArray.map(item => {
      try {
        const transformed = {
          id: item.id,
          itemCode: item.itemCode || item.id,
          name: item.name,
          category: item.category || 'general',
          subcategory: item.subcategory || '',
          brand: item.brand || '',
          unit: item.unit || 'pcs',
          specification: item.description || item.specification || '',
          
          // Stock information - handle both formats
          currentStock: parseInt(item.quantity?.current || item.stock?.available || 0),
          reservedStock: parseInt(item.quantity?.reserved || item.stock?.reserved || 0),
          minimumStock: parseInt(item.quantity?.minimum || item.stock?.minimum || 0),
          maximumStock: parseInt(item.quantity?.maximum || item.stock?.maximum || 999999),
          
          // Location information
          location: item.location || {},
          
          // Supplier information
          primarySupplier: item.supplier?.primary || null,
          alternativeSuppliers: item.supplier?.secondary || [],
          
          // Pricing information
          lastPurchasePrice: parseFloat(item.pricing?.lastPurchase || 0),
          averagePrice: parseFloat(item.pricing?.average || 0),
          
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        // Validate required fields
        if (!transformed.name || !transformed.itemCode) {
          this.errors.push(`Inventory ${item.id}: Missing required fields`);
          return null;
        }

        return transformed;
      } catch (error) {
        this.errors.push(`Inventory ${item.id}: Transformation error - ${error.message}`);
        return null;
      }
    }).filter(item => item !== null);
  }

  // Helper methods
  mapFinanceCategory(type, description) {
    const desc = description.toLowerCase();
    
    if (type === 'Pemasukan') {
      if (desc.includes('termin')) return 'project_payment';
      if (desc.includes('bonus')) return 'bonus';
      return 'income_other';
    } else {
      if (desc.includes('besi') || desc.includes('semen') || desc.includes('material')) return 'materials';
      if (desc.includes('gaji') || desc.includes('salary')) return 'salary';
      if (desc.includes('alat')) return 'equipment';
      return 'expense_other';
    }
  }

  extractProjectFromDescription(description) {
    // Try to extract project reference from description
    const projectMatch = description.match(/proyek\s+(\w+)/i) || description.match(/PRJ[_-]?(\d+)/i);
    return projectMatch ? projectMatch[1] : null;
  }

  // Load and transform all mockup data
  async transformAllData() {
    const results = {
      users: [],
      projects: [],
      finance: [],
      inventory: [],
      errors: [],
      warnings: []
    };

    try {
      // Load mockup data files
      const usersData = JSON.parse(fs.readFileSync(path.join(this.mockupDataPath, 'users.json'), 'utf8'));
      const projectsData = JSON.parse(fs.readFileSync(path.join(this.mockupDataPath, 'projects.json'), 'utf8'));
      const financeData = JSON.parse(fs.readFileSync(path.join(this.mockupDataPath, 'finance.json'), 'utf8'));
      const inventoryData = JSON.parse(fs.readFileSync(path.join(this.mockupDataPath, 'inventory.json'), 'utf8'));

      // Transform data
      results.users = this.transformUsers(usersData);
      results.projects = this.transformProjects(projectsData);
      results.finance = this.transformFinance(financeData);
      results.inventory = this.transformInventory(inventoryData);

      // Collect errors and warnings
      results.errors = this.errors;
      results.warnings = this.warnings;

      // Summary
      console.log('\n📊 Transformation Summary:');
      console.log(`✅ Users: ${results.users.length} transformed`);
      console.log(`✅ Projects: ${results.projects.length} transformed`);
      console.log(`✅ Finance: ${results.finance.length} transformed`);
      console.log(`✅ Inventory: ${results.inventory.length} transformed`);
      console.log(`⚠️ Warnings: ${results.warnings.length}`);
      console.log(`❌ Errors: ${results.errors.length}`);

      return results;
    } catch (error) {
      console.error('❌ Transformation failed:', error.message);
      throw error;
    }
  }

  // Save transformed data to files
  async saveTransformedData(data, outputDir = './transformed-data') {
    // Create output directory
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Save each dataset
    fs.writeFileSync(
      path.join(outputDir, 'users.json'),
      JSON.stringify(data.users, null, 2)
    );

    fs.writeFileSync(
      path.join(outputDir, 'projects.json'),
      JSON.stringify(data.projects, null, 2)
    );

    fs.writeFileSync(
      path.join(outputDir, 'finance.json'),
      JSON.stringify(data.finance, null, 2)
    );

    fs.writeFileSync(
      path.join(outputDir, 'inventory.json'),
      JSON.stringify(data.inventory, null, 2)
    );

    // Save transformation report
    const report = {
      transformedAt: new Date().toISOString(),
      summary: {
        users: data.users.length,
        projects: data.projects.length,
        finance: data.finance.length,
        inventory: data.inventory.length
      },
      errors: data.errors,
      warnings: data.warnings
    };

    fs.writeFileSync(
      path.join(outputDir, 'transformation-report.json'),
      JSON.stringify(report, null, 2)
    );

    console.log(`💾 Transformed data saved to: ${outputDir}`);
  }
}

// Export for use as module
module.exports = MockupDataMapper;

// CLI usage
if (require.main === module) {
  const mapper = new MockupDataMapper();
  
  mapper.transformAllData()
    .then(data => {
      return mapper.saveTransformedData(data);
    })
    .then(() => {
      console.log('✅ Data transformation completed successfully!');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Data transformation failed:', error.message);
      process.exit(1);
    });
}
