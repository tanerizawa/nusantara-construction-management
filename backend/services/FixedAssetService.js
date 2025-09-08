/**
 * Fixed Asset Management Service
 * Phase 10: Fixed Asset Management & Depreciation
 * 
 * Handles asset registration, depreciation calculation, maintenance tracking,
 * asset disposal, and integration with accounting systems for construction industry
 */

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
   * Register new fixed asset
   */
  async registerAsset(assetData) {
    try {
      const asset = {
        id: `ASSET-${Date.now()}`,
        assetCode: assetData.asset_code || `AST-${Date.now()}`,
        assetName: assetData.asset_name,
        assetCategory: assetData.asset_category,
        assetType: assetData.asset_type,
        description: assetData.description,
        
        // Financial Information
        purchasePrice: parseFloat(assetData.purchase_price),
        purchaseDate: new Date(assetData.purchase_date),
        supplier: assetData.supplier,
        invoiceNumber: assetData.invoice_number,
        
        // Depreciation Settings
        depreciationMethod: assetData.depreciation_method || 'STRAIGHT_LINE',
        usefulLife: parseInt(assetData.useful_life), // in years
        salvageValue: parseFloat(assetData.salvage_value || 0),
        
        // Location & Assignment
        location: assetData.location,
        department: assetData.department,
        responsiblePerson: assetData.responsible_person,
        costCenter: assetData.cost_center,
        
        // Status & Tracking
        status: 'ACTIVE',
        condition: assetData.condition || 'GOOD',
        serialNumber: assetData.serial_number,
        modelNumber: assetData.model_number,
        manufacturer: assetData.manufacturer,
        
        // Calculated Fields
        depreciationStartDate: assetData.depreciation_start_date ? 
          new Date(assetData.depreciation_start_date) : new Date(assetData.purchase_date),
        accumulatedDepreciation: 0,
        netBookValue: parseFloat(assetData.purchase_price),
        
        // Maintenance
        lastMaintenanceDate: assetData.last_maintenance_date ? 
          new Date(assetData.last_maintenance_date) : null,
        nextMaintenanceDate: assetData.next_maintenance_date ? 
          new Date(assetData.next_maintenance_date) : null,
        maintenanceCosts: 0,
        
        // Metadata
        subsidiaryId: assetData.subsidiary_id,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Calculate initial depreciation if asset is not new
      if (asset.depreciationStartDate < new Date()) {
        const depreciation = this.calculateDepreciation(asset, new Date());
        asset.accumulatedDepreciation = depreciation.accumulatedDepreciation;
        asset.netBookValue = depreciation.netBookValue;
      }

      // Generate asset performance metrics
      const performanceMetrics = this.generateAssetMetrics(asset);

      return {
        success: true,
        message: 'Fixed asset registered successfully',
        data: {
          asset: asset,
          depreciationSchedule: this.generateDepreciationSchedule(asset),
          performanceMetrics: performanceMetrics,
          maintenanceSchedule: this.generateMaintenanceSchedule(asset)
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
