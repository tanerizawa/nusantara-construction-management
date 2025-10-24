/**
 * Fixed Asset Management Service
 * Phase 10: Fixed Asset Management & Depreciation
 * 
 * Handles asset registration, depreciation calculation, maintenance tracking,
 * asset disposal, and integration with accounting systems for construction industry
 */

const { models } = require('../models');
const { FixedAsset } = models;

class FixedAssetService {
  constructor() {
    this.assetCategories = {
      HEAVY_EQUIPMENT: 'Heavy Equipment',
      VEHICLES: 'Vehicles',
      BUILDINGS: 'Buildings',
      OFFICE_EQUIPMENT: 'Office Equipment',
      TOOLS_MACHINERY: 'Tools & Machinery',
      LAND: 'Land',
      INFRASTRUCTURE: 'Infrastructure',
      COMPUTERS_IT: 'Computers & IT Equipment'
    };

    this.depreciationMethods = {
      STRAIGHT_LINE: 'Straight Line',
      DECLINING_BALANCE: 'Declining Balance',
      DOUBLE_DECLINING: 'Double Declining Balance',
      UNITS_OF_PRODUCTION: 'Units of Production',
      SUM_OF_YEARS_DIGITS: 'Sum of Years Digits'
    };

    this.assetStatus = {
      ACTIVE: 'Active',
      UNDER_MAINTENANCE: 'Under Maintenance',
      IDLE: 'Idle',
      DISPOSED: 'Disposed',
      WRITTEN_OFF: 'Written Off',
      LEASED_OUT: 'Leased Out'
    };
  }

  /**
   * Get list of assets with filtering and pagination
   */
  async getAssetList(filters = {}, page = 1, limit = 50) {
    try {
      const { Op } = require('sequelize');
      const offset = (page - 1) * limit;
      
      // Build where conditions
      const whereConditions = {};
      
      if (filters.category) {
        whereConditions.asset_category = filters.category;
      }
      
      if (filters.status) {
        whereConditions.status = filters.status;
      }
      
      if (filters.search) {
        whereConditions[Op.or] = [
          { asset_name: { [Op.iLike]: `%${filters.search}%` } },
          { asset_code: { [Op.iLike]: `%${filters.search}%` } }
        ];
      }

      const { count, rows: assets } = await FixedAsset.findAndCountAll({
        where: whereConditions,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });

      return {
        success: true,
        data: assets.map(asset => ({
          id: asset.id,
          assetCode: asset.asset_code,
          assetName: asset.asset_name,
          assetCategory: asset.asset_category,
          assetType: asset.asset_type,
          description: asset.description,
          purchasePrice: parseFloat(asset.purchase_price),
          purchaseDate: asset.purchase_date,
          supplier: asset.supplier,
          invoiceNumber: asset.invoice_number,
          depreciationMethod: asset.depreciation_method,
          usefulLife: asset.useful_life,
          salvageValue: parseFloat(asset.salvage_value || 0),
          status: asset.status,
          condition: asset.condition,
          location: asset.location,
          department: asset.department,
          responsiblePerson: asset.responsible_person,
          costCenter: asset.cost_center,
          serialNumber: asset.serial_number,
          modelNumber: asset.model_number,
          manufacturer: asset.manufacturer,
          netBookValue: parseFloat(asset.book_value || asset.purchase_price),
          accumulatedDepreciation: parseFloat(asset.accumulated_depreciation || 0),
          lastMaintenanceDate: asset.last_maintenance_date,
          nextMaintenanceDate: asset.next_maintenance_date,
          maintenanceCost: parseFloat(asset.maintenance_cost || 0),
          depreciationStartDate: asset.depreciation_start_date
        })),
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: limit,
          hasNextPage: page < Math.ceil(count / limit),
          hasPrevPage: page > 1
        }
      };

    } catch (error) {
      console.error('Error getting asset list:', error);
      return {
        success: false,
        message: 'Error retrieving asset list',
        error: error.message
      };
    }
  }

  /**
   * Register new fixed asset
   */
  async registerAsset(assetData) {
    try {
      // Generate asset code if not provided
      const assetCode = assetData.asset_code || `AST-${Date.now()}`;
      
      // Calculate book value (initial = purchase price)
      const purchasePrice = parseFloat(assetData.purchase_price);
      const salvageValue = parseFloat(assetData.salvage_value || 0);
      
      const newAsset = await FixedAsset.create({
        asset_code: assetCode,
        asset_name: assetData.asset_name,
        asset_category: assetData.asset_category,
        asset_type: assetData.asset_type,
        description: assetData.description,
        
        // Financial Information
        purchase_price: purchasePrice,
        purchase_date: new Date(assetData.purchase_date),
        supplier: assetData.supplier,
        invoice_number: assetData.invoice_number,
        
        // Depreciation Settings
        depreciation_method: assetData.depreciation_method || 'STRAIGHT_LINE',
        useful_life: parseInt(assetData.useful_life || 5), // in years
        salvage_value: salvageValue,
        depreciation_start_date: assetData.depreciation_start_date || new Date(assetData.purchase_date),
        
        // Location & Assignment
        location: assetData.location,
        department: assetData.department,
        responsible_person: assetData.responsible_person,
        cost_center: assetData.cost_center,
        
        // Status & Tracking
        status: 'ACTIVE',
        condition: assetData.condition || 'GOOD',
        serial_number: assetData.serial_number,
        model_number: assetData.model_number,
        manufacturer: assetData.manufacturer,
        
        // Initial book value calculation
        book_value: purchasePrice,
        accumulated_depreciation: 0,
        maintenance_cost: 0,
        
        subsidiary_id: assetData.subsidiary_id,
        
        // Maintenance dates if provided
        last_maintenance_date: assetData.last_maintenance_date ? 
          new Date(assetData.last_maintenance_date) : null,
        next_maintenance_date: assetData.next_maintenance_date ? 
          new Date(assetData.next_maintenance_date) : null
      });

      return {
        success: true,
        message: 'Fixed asset registered successfully',
        data: {
          id: newAsset.id,
          assetCode: newAsset.asset_code,
          assetName: newAsset.asset_name,
          assetCategory: newAsset.asset_category,
          assetType: newAsset.asset_type,
          purchasePrice: parseFloat(newAsset.purchase_price),
          purchaseDate: newAsset.purchase_date,
          status: newAsset.status,
          condition: newAsset.condition,
          location: newAsset.location,
          department: newAsset.department,
          bookValue: parseFloat(newAsset.book_value),
          accumulatedDepreciation: parseFloat(newAsset.accumulated_depreciation)
        }
      };

    } catch (error) {
      console.error('Error registering asset:', error);
      return {
        success: false,
        message: 'Error registering fixed asset',
        error: error.message
      };
    }
  }

  /**
   * Delete fixed asset
   */
  async deleteAsset(assetId) {
    try {
      const asset = await FixedAsset.findByPk(assetId);
      
      if (!asset) {
        return {
          success: false,
          message: 'Asset not found'
        };
      }

      await asset.destroy();

      return {
        success: true,
        message: 'Asset deleted successfully',
        data: {
          id: assetId,
          assetName: asset.asset_name,
          assetCode: asset.asset_code
        }
      };

    } catch (error) {
      console.error('Error deleting asset:', error);
      return {
        success: false,
        message: 'Error deleting asset',
        error: error.message
      };
    }
  }

  /**
   * Calculate depreciation for an asset up to a specific date
   */
  calculateDepreciation(asset, asOfDate = new Date()) {
    try {
      const depreciableAmount = asset.purchasePrice - asset.salvageValue;
      const startDate = new Date(asset.depreciationStartDate);
      const monthsElapsed = this.getMonthsDifference(startDate, asOfDate);
      let accumulatedDepreciation = 0;
      let netBookValue = asset.purchasePrice;

      switch (asset.depreciationMethod) {
        case 'STRAIGHT_LINE':
          const monthlyDepreciation = depreciableAmount / (asset.usefulLife * 12);
          accumulatedDepreciation = Math.min(monthlyDepreciation * monthsElapsed, depreciableAmount);
          break;

        case 'DECLINING_BALANCE':
          const rate = 1 / asset.usefulLife;
          let currentValue = asset.purchasePrice;
          for (let i = 0; i < monthsElapsed; i++) {
            const monthlyDepr = currentValue * rate / 12;
            accumulatedDepreciation += monthlyDepr;
            currentValue -= monthlyDepr;
            if (currentValue <= asset.salvageValue) {
              accumulatedDepreciation = depreciableAmount;
              break;
            }
          }
          break;

        case 'DOUBLE_DECLINING':
          const doubleRate = 2 / asset.usefulLife;
          let currentVal = asset.purchasePrice;
          for (let i = 0; i < monthsElapsed; i++) {
            const monthlyDepr = currentVal * doubleRate / 12;
            accumulatedDepreciation += monthlyDepr;
            currentVal -= monthlyDepr;
            if (currentVal <= asset.salvageValue) {
              accumulatedDepreciation = depreciableAmount;
              break;
            }
          }
          break;

        case 'UNITS_OF_PRODUCTION':
          // This would require usage data - using simplified calculation
          const usageRate = 0.8; // Assume 80% usage rate
          const productionDepreciation = depreciableAmount * usageRate * (monthsElapsed / (asset.usefulLife * 12));
          accumulatedDepreciation = Math.min(productionDepreciation, depreciableAmount);
          break;

        default:
          // Default to straight line
          const defaultMonthly = depreciableAmount / (asset.usefulLife * 12);
          accumulatedDepreciation = Math.min(defaultMonthly * monthsElapsed, depreciableAmount);
      }

      netBookValue = asset.purchasePrice - accumulatedDepreciation;

      return {
        asOfDate: asOfDate,
        accumulatedDepreciation: Math.round(accumulatedDepreciation),
        netBookValue: Math.round(netBookValue),
        depreciationExpense: Math.round(accumulatedDepreciation - (asset.accumulatedDepreciation || 0)),
        monthsElapsed: monthsElapsed,
        remainingLife: Math.max(0, (asset.usefulLife * 12) - monthsElapsed)
      };

    } catch (error) {
      console.error('Error calculating depreciation:', error);
      return {
        accumulatedDepreciation: asset.accumulatedDepreciation || 0,
        netBookValue: asset.netBookValue || asset.purchasePrice,
        depreciationExpense: 0
      };
    }
  }

  /**
   * Generate depreciation schedule for an asset
   */
  generateDepreciationSchedule(asset) {
    const schedule = [];
    const depreciableAmount = asset.purchasePrice - asset.salvageValue;
    const startDate = new Date(asset.depreciationStartDate);
    
    for (let year = 1; year <= asset.usefulLife; year++) {
      const endOfYear = new Date(startDate.getFullYear() + year, startDate.getMonth(), startDate.getDate());
      const depreciation = this.calculateDepreciation(asset, endOfYear);
      
      schedule.push({
        year: year,
        endDate: endOfYear,
        depreciationExpense: year === 1 ? 
          depreciation.accumulatedDepreciation : 
          depreciation.accumulatedDepreciation - (schedule[year-2]?.accumulatedDepreciation || 0),
        accumulatedDepreciation: depreciation.accumulatedDepreciation,
        netBookValue: depreciation.netBookValue
      });
    }

    return schedule;
  }

  /**
   * Update existing asset
   */
  async updateAsset(assetId, updateData) {
    try {
      // Find the asset first
      const asset = await FixedAsset.findByPk(assetId);
      
      if (!asset) {
        return {
          success: false,
          message: 'Asset not found',
          error: 'Asset with given ID does not exist'
        };
      }

      // Update the asset with new data
      await asset.update({
        asset_code: updateData.asset_code || asset.asset_code,
        asset_name: updateData.asset_name || asset.asset_name,
        asset_category: updateData.asset_category || asset.asset_category,
        asset_type: updateData.asset_type || asset.asset_type,
        description: updateData.description !== undefined ? updateData.description : asset.description,
        
        // Financial Information
        purchase_price: updateData.purchase_price !== undefined ? parseFloat(updateData.purchase_price) : asset.purchase_price,
        purchase_date: updateData.purchase_date || asset.purchase_date,
        supplier: updateData.supplier !== undefined ? updateData.supplier : asset.supplier,
        invoice_number: updateData.invoice_number !== undefined ? updateData.invoice_number : asset.invoice_number,
        
        // Depreciation
        depreciation_method: updateData.depreciation_method || asset.depreciation_method,
        useful_life: updateData.useful_life !== undefined ? parseInt(updateData.useful_life) : asset.useful_life,
        salvage_value: updateData.salvage_value !== undefined ? parseFloat(updateData.salvage_value) : asset.salvage_value,
        
        // Location & Assignment
        location: updateData.location !== undefined ? updateData.location : asset.location,
        department: updateData.department !== undefined ? updateData.department : asset.department,
        responsible_person: updateData.responsible_person !== undefined ? updateData.responsible_person : asset.responsible_person,
        cost_center: updateData.cost_center !== undefined ? updateData.cost_center : asset.cost_center,
        
        // Status & Tracking
        status: updateData.status || asset.status,
        condition: updateData.condition || asset.condition,
        serial_number: updateData.serial_number !== undefined ? updateData.serial_number : asset.serial_number,
        model_number: updateData.model_number !== undefined ? updateData.model_number : asset.model_number,
        manufacturer: updateData.manufacturer !== undefined ? updateData.manufacturer : asset.manufacturer
      });

      // Reload to get updated data
      await asset.reload();

      // Return formatted data
      const formattedAsset = {
        id: asset.id,
        assetCode: asset.asset_code,
        assetName: asset.asset_name,
        assetCategory: asset.asset_category,
        assetType: asset.asset_type,
        description: asset.description,
        purchasePrice: parseFloat(asset.purchase_price),
        purchaseDate: asset.purchase_date,
        supplier: asset.supplier,
        invoiceNumber: asset.invoice_number,
        depreciationMethod: asset.depreciation_method,
        usefulLife: asset.useful_life,
        salvageValue: parseFloat(asset.salvage_value),
        location: asset.location,
        department: asset.department,
        responsiblePerson: asset.responsible_person,
        costCenter: asset.cost_center,
        status: asset.status,
        condition: asset.condition,
        serialNumber: asset.serial_number,
        modelNumber: asset.model_number,
        manufacturer: asset.manufacturer,
        updatedAt: asset.updatedAt
      };

      return {
        success: true,
        message: 'Asset updated successfully',
        data: formattedAsset
      };

    } catch (error) {
      console.error('Error updating asset:', error);
      return {
        success: false,
        message: 'Error updating asset',
        error: error.message
      };
    }
  }

  /**
   * Process asset disposal
   */
  async disposeAsset(assetId, disposalData) {
    try {
      // Calculate final depreciation
      const disposalDate = new Date(disposalData.disposal_date);
      const finalDepreciation = this.calculateDepreciation(
        { ...disposalData.asset }, 
        disposalDate
      );

      const disposalPrice = parseFloat(disposalData.disposal_price || 0);
      const gainLoss = disposalPrice - finalDepreciation.netBookValue;

      const disposal = {
        id: `DISP-${Date.now()}`,
        assetId: assetId,
        disposalDate: disposalDate,
        disposalMethod: disposalData.disposal_method, // SALE, SCRAP, DONATION, TRADE_IN
        disposalPrice: disposalPrice,
        disposalCosts: parseFloat(disposalData.disposal_costs || 0),
        buyerInformation: disposalData.buyer_information,
        
        // Financial Impact
        finalNetBookValue: finalDepreciation.netBookValue,
        gainLossOnDisposal: gainLoss,
        netProceeds: disposalPrice - parseFloat(disposalData.disposal_costs || 0),
        
        // Documentation
        disposalReason: disposalData.disposal_reason,
        authorizedBy: disposalData.authorized_by,
        documentNumber: disposalData.document_number,
        
        createdAt: new Date()
      };

      // Generate journal entries for disposal
      const journalEntries = this.generateDisposalJournalEntries(disposal, finalDepreciation);

      return {
        success: true,
        message: 'Asset disposal processed successfully',
        data: {
          disposal: disposal,
          finalDepreciation: finalDepreciation,
          journalEntries: journalEntries,
          financialImpact: {
            gainLoss: gainLoss,
            taxImplications: this.calculateDisposalTaxImpact(disposal)
          }
        }
      };

    } catch (error) {
      console.error('Error processing asset disposal:', error);
      return {
        success: false,
        message: 'Error processing asset disposal',
        error: error.message
      };
    }
  }

  /**
   * Generate asset performance analytics
   */
  async generateAssetAnalytics(filters = {}) {
    try {
      // Mock asset data for analytics
      const assets = this.getMockAssetData(filters);
      
      const analytics = {
        summary: {
          totalAssets: assets.length,
          totalValue: assets.reduce((sum, asset) => sum + asset.purchasePrice, 0),
          totalNetBookValue: assets.reduce((sum, asset) => sum + asset.netBookValue, 0),
          totalDepreciation: assets.reduce((sum, asset) => sum + asset.accumulatedDepreciation, 0),
          averageAge: assets.reduce((sum, asset) => 
            sum + this.getAssetAge(asset.purchaseDate), 0) / assets.length
        },
        
        categoryBreakdown: this.groupAssetsByCategory(assets),
        depreciationTrends: this.calculateDepreciationTrends(assets),
        utilizationMetrics: this.calculateUtilizationMetrics(assets),
        maintenanceMetrics: this.calculateMaintenanceMetrics(assets),
        
        performanceIndicators: {
          assetTurnover: this.calculateAssetTurnover(assets),
          maintenanceEfficiency: this.calculateMaintenanceEfficiency(assets),
          utilizationRate: this.calculateOverallUtilization(assets),
          depreciationRate: this.calculateDepreciationRate(assets)
        },
        
        recommendations: this.generateAssetRecommendations(assets)
      };

      return {
        success: true,
        data: analytics
      };

    } catch (error) {
      console.error('Error generating asset analytics:', error);
      return {
        success: false,
        message: 'Error generating asset analytics',
        error: error.message
      };
    }
  }

  // Helper Methods
  getMonthsDifference(startDate, endDate) {
    return (endDate.getFullYear() - startDate.getFullYear()) * 12 +
           (endDate.getMonth() - startDate.getMonth());
  }

  getAssetAge(purchaseDate) {
    const now = new Date();
    return (now.getFullYear() - purchaseDate.getFullYear()) +
           (now.getMonth() - purchaseDate.getMonth()) / 12;
  }

  generateAssetMetrics(asset) {
    const age = this.getAssetAge(asset.purchaseDate);
    const depreciationRate = (asset.accumulatedDepreciation / asset.purchasePrice) * 100;
    
    return {
      ageInYears: Math.round(age * 10) / 10,
      depreciationRate: Math.round(depreciationRate * 100) / 100,
      remainingValue: asset.netBookValue,
      utilizationEstimate: Math.max(0, 100 - (age / asset.usefulLife) * 100),
      maintenanceRatio: (asset.maintenanceCosts / asset.purchasePrice) * 100
    };
  }

  generateMaintenanceSchedule(asset) {
    const schedule = [];
    const startDate = new Date();
    
    // Generate quarterly maintenance schedule for heavy equipment
    if (asset.assetCategory === 'HEAVY_EQUIPMENT') {
      for (let quarter = 1; quarter <= 4; quarter++) {
        const maintenanceDate = new Date(startDate);
        maintenanceDate.setMonth(startDate.getMonth() + (quarter * 3));
        
        schedule.push({
          quarter: quarter,
          maintenanceDate: maintenanceDate,
          maintenanceType: quarter % 2 === 0 ? 'MAJOR' : 'ROUTINE',
          estimatedCost: quarter % 2 === 0 ? asset.purchasePrice * 0.02 : asset.purchasePrice * 0.005,
          description: `Q${quarter} ${quarter % 2 === 0 ? 'major' : 'routine'} maintenance`
        });
      }
    }
    
    return schedule;
  }

  getMockAssetData(filters) {
    // Return mock asset data for analytics
    return [
      {
        id: 'ASSET-1',
        assetCode: 'EXC-001',
        assetName: 'Excavator CAT 320D',
        assetCategory: 'HEAVY_EQUIPMENT',
        purchasePrice: 2500000000,
        purchaseDate: new Date('2023-01-15'),
        netBookValue: 2000000000,
        accumulatedDepreciation: 500000000,
        maintenanceCosts: 125000000,
        usefulLife: 10
      },
      {
        id: 'ASSET-2',
        assetCode: 'CRN-001',
        assetName: 'Tower Crane Liebherr',
        assetCategory: 'HEAVY_EQUIPMENT',
        purchasePrice: 5000000000,
        purchaseDate: new Date('2022-06-10'),
        netBookValue: 3750000000,
        accumulatedDepreciation: 1250000000,
        maintenanceCosts: 200000000,
        usefulLife: 15
      }
    ];
  }

  groupAssetsByCategory(assets) {
    const grouped = {};
    assets.forEach(asset => {
      if (!grouped[asset.assetCategory]) {
        grouped[asset.assetCategory] = {
          count: 0,
          totalValue: 0,
          totalNetBookValue: 0
        };
      }
      grouped[asset.assetCategory].count++;
      grouped[asset.assetCategory].totalValue += asset.purchasePrice;
      grouped[asset.assetCategory].totalNetBookValue += asset.netBookValue;
    });
    return grouped;
  }

  calculateDepreciationTrends(assets) {
    // Mock trend calculation
    return {
      monthlyDepreciation: 45000000,
      yearlyDepreciation: 540000000,
      depreciationAcceleration: 'NORMAL'
    };
  }

  calculateUtilizationMetrics(assets) {
    return {
      averageUtilization: 85.5,
      highUtilizationAssets: assets.filter(a => a.assetCategory === 'HEAVY_EQUIPMENT').length,
      underutilizedAssets: 0
    };
  }

  calculateMaintenanceMetrics(assets) {
    const totalMaintenance = assets.reduce((sum, asset) => sum + asset.maintenanceCosts, 0);
    const totalValue = assets.reduce((sum, asset) => sum + asset.purchasePrice, 0);
    
    return {
      totalMaintenanceCosts: totalMaintenance,
      maintenancePercentage: (totalMaintenance / totalValue) * 100,
      avgMaintenancePerAsset: totalMaintenance / assets.length
    };
  }

  calculateAssetTurnover(assets) {
    // Mock calculation
    return 1.25;
  }

  calculateMaintenanceEfficiency(assets) {
    return 92.5;
  }

  calculateOverallUtilization(assets) {
    return 85.5;
  }

  calculateDepreciationRate(assets) {
    const totalOriginal = assets.reduce((sum, asset) => sum + asset.purchasePrice, 0);
    const totalDepreciated = assets.reduce((sum, asset) => sum + asset.accumulatedDepreciation, 0);
    return (totalDepreciated / totalOriginal) * 100;
  }

  generateAssetRecommendations(assets) {
    return [
      {
        type: 'MAINTENANCE',
        priority: 'HIGH',
        message: 'Schedule major maintenance for excavator EXC-001',
        assetCode: 'EXC-001'
      },
      {
        type: 'OPTIMIZATION',
        priority: 'MEDIUM',
        message: 'Consider utilization improvement for crane CRN-001',
        assetCode: 'CRN-001'
      }
    ];
  }

  generateDisposalJournalEntries(disposal, finalDepreciation) {
    const entries = [];
    
    // Cash received entry
    if (disposal.disposalPrice > 0) {
      entries.push({
        account: 'Cash',
        debit: disposal.disposalPrice,
        credit: 0,
        description: 'Cash received from asset disposal'
      });
    }
    
    // Accumulated depreciation entry
    entries.push({
      account: 'Accumulated Depreciation',
      debit: finalDepreciation.accumulatedDepreciation,
      credit: 0,
      description: 'Remove accumulated depreciation'
    });
    
    // Asset cost removal
    entries.push({
      account: 'Fixed Assets',
      debit: 0,
      credit: finalDepreciation.accumulatedDepreciation + finalDepreciation.netBookValue,
      description: 'Remove asset cost'
    });
    
    // Gain/Loss on disposal
    if (disposal.gainLossOnDisposal !== 0) {
      entries.push({
        account: disposal.gainLossOnDisposal > 0 ? 'Gain on Disposal' : 'Loss on Disposal',
        debit: disposal.gainLossOnDisposal < 0 ? Math.abs(disposal.gainLossOnDisposal) : 0,
        credit: disposal.gainLossOnDisposal > 0 ? disposal.gainLossOnDisposal : 0,
        description: 'Gain/Loss on asset disposal'
      });
    }
    
    return entries;
  }

  calculateDisposalTaxImpact(disposal) {
    const taxRate = 0.25; // 25% corporate tax rate
    const taxableGainLoss = disposal.gainLossOnDisposal;
    const taxImpact = taxableGainLoss * taxRate;
    
    return {
      taxableAmount: taxableGainLoss,
      taxRate: taxRate,
      taxImpact: taxImpact,
      netAfterTax: disposal.gainLossOnDisposal - taxImpact
    };
  }
}

module.exports = FixedAssetService;
