/**
 * Milestone Integration Service
 * Handles integration between Milestones and RAB workflow
 */

const { sequelize } = require('../../config/database');

class MilestoneIntegrationService {
  /**
   * Get RAB categories available for milestone linking
   * 
   * IMPROVED LOGIC:
   * 1. First try to get from approved RAB items (ideal case)
   * 2. If no RAB items, extract unique item names from POs as fallback
   * 3. Filter out categories already used in existing milestones
   * 4. This ensures categories are always available for milestone linking
   */
  async getAvailableRABCategories(projectId) {
    try {
      console.log(`\n📊 [GET RAB CATEGORIES] Project: ${projectId}`);
      
      // Get categories already used in milestones
      const usedCategoriesQuery = `
        SELECT DISTINCT
          category_link->>'category_name' as category_name
        FROM project_milestones
        WHERE project_id = $1
          AND category_link IS NOT NULL
          AND category_link->>'category_name' IS NOT NULL
      `;

      const usedCategories = await sequelize.query(usedCategoriesQuery, {
        bind: [projectId],
        type: sequelize.QueryTypes.SELECT
      });

      const usedCategoryNames = usedCategories.map(c => c.category_name);
      console.log(`🚫 Found ${usedCategoryNames.length} categories already used:`, usedCategoryNames);
      
      // STEP 1: Try to get from approved RAB items (ideal)
      const rabQuery = `
        SELECT DISTINCT
          category as name,
          COUNT(*) as item_count,
          SUM(CAST(quantity AS DECIMAL) * CAST(unit_price AS DECIMAL)) as total_value,
          MAX(created_at) as last_updated
        FROM rab_items
        WHERE project_id = $1
          AND approval_status = 'approved'
          AND category IS NOT NULL
          AND category != ''
        GROUP BY category
        ORDER BY category
      `;

      const rabResults = await sequelize.query(rabQuery, {
        bind: [projectId],
        type: sequelize.QueryTypes.SELECT
      });

      console.log(`✅ Found ${rabResults.length} categories from RAB items`);

      if (rabResults.length > 0) {
        // Filter out used categories
        const availableCategories = rabResults
          .filter(cat => !usedCategoryNames.includes(cat.name))
          .map(cat => ({
            name: cat.name,
            itemCount: parseInt(cat.item_count),
            totalValue: parseFloat(cat.total_value),
            lastUpdated: cat.last_updated,
            source: 'rab'
          }));
        
        console.log(`✨ ${availableCategories.length} categories available (${rabResults.length - availableCategories.length} already used)`);
        return availableCategories;
      }

      // STEP 2: Fallback - Extract from PO items
      console.log('⚠️  No RAB categories found, trying PO items...');
      
      const poQuery = `
        WITH po_items AS (
          SELECT 
            po.po_number,
            jsonb_array_elements(po.items) AS item
          FROM purchase_orders po
          WHERE po.project_id = $1
            AND po.status IN ('approved', 'received')
        )
        SELECT 
          item->>'itemName' as item_name,
          COUNT(DISTINCT po_number) as po_count,
          SUM(CAST(item->>'totalPrice' AS DECIMAL)) as total_value
        FROM po_items
        WHERE item->>'itemName' IS NOT NULL
        GROUP BY item->>'itemName'
        ORDER BY item->>'itemName'
      `;

      const poResults = await sequelize.query(poQuery, {
        bind: [projectId],
        type: sequelize.QueryTypes.SELECT
      });

      console.log(`ℹ️  Found ${poResults.length} unique items from POs`);

      if (poResults.length > 0) {
        // Group items into logical categories based on keywords
        const categorizedItems = this.categorizePOItems(poResults);
        
        // Filter out used categories
        const availableCategories = categorizedItems.filter(cat => !usedCategoryNames.includes(cat.name));
        
        console.log(`📂 Grouped into ${categorizedItems.length} categories, ${availableCategories.length} available`);
        return availableCategories;
      }

      // STEP 3: No data at all
      console.log('❌ No categories available from RAB or POs');
      return [];

    } catch (error) {
      console.error('[MilestoneIntegrationService] Error getting RAB categories:', error);
      console.error('Stack:', error.stack);
      throw error;
    }
  }

  /**
   * Helper: Categorize PO items into logical work categories
   */
  categorizePOItems(poItems) {
    const categoryMap = {
      'Pekerjaan Persiapan': ['urugan', 'galian', 'pembersihan', 'pasir', 'tanah'],
      'Pekerjaan Struktur': ['besi', 'beton', 'cor', 'kolom', 'balok', 'plat'],
      'Pekerjaan Dinding': ['bata', 'hebel', 'blok', 'dinding'],
      'Pekerjaan Atap': ['rangka', 'genteng', 'atap', 'spandek'],
      'Pekerjaan Plumbing': ['pipa', 'kran', 'closet', 'wastafel', 'air'],
      'Pekerjaan Listrik': ['kabel', 'saklar', 'lampu', 'mcb', 'listrik'],
      'Pekerjaan Finishing': ['cat', 'keramik', 'plafon', 'pintu', 'jendela', 'finishing']
    };

    const categories = new Map();

    for (const item of poItems) {
      const itemNameLower = item.item_name.toLowerCase();
      let assigned = false;

      // Try to match with predefined categories
      for (const [categoryName, keywords] of Object.entries(categoryMap)) {
        for (const keyword of keywords) {
          if (itemNameLower.includes(keyword)) {
            if (!categories.has(categoryName)) {
              categories.set(categoryName, {
                items: [],
                totalValue: 0,
                poCount: 0
              });
            }
            const cat = categories.get(categoryName);
            cat.items.push(item.item_name);
            cat.totalValue += parseFloat(item.total_value || 0);
            cat.poCount += parseInt(item.po_count || 0);
            assigned = true;
            break;
          }
        }
        if (assigned) break;
      }

      // If not assigned, put in "Material Lainnya"
      if (!assigned) {
        if (!categories.has('Material Lainnya')) {
          categories.set('Material Lainnya', {
            items: [],
            totalValue: 0,
            poCount: 0
          });
        }
        const cat = categories.get('Material Lainnya');
        cat.items.push(item.item_name);
        cat.totalValue += parseFloat(item.total_value || 0);
        cat.poCount += parseInt(item.po_count || 0);
      }
    }

    // Convert to array format
    return Array.from(categories.entries()).map(([name, data]) => ({
      name: name,
      itemCount: data.items.length,
      totalValue: data.totalValue,
      lastUpdated: new Date().toISOString(),
      source: 'po_items',
      items: data.items.slice(0, 5) // Show first 5 items
    }));
  }

  /**
   * Suggest milestones from POs that have delivery receipts
   * 
   * BUSINESS LOGIC:
   * 1. Find POs that have delivery receipts (status = 'received')
   * 2. Extract categories from RAB items in those POs
   * 3. Group by category - multiple POs with same category = one milestone
   * 4. Purpose: Track work progress and material usage per category
   * 
   * RATIONALE:
   * - POs with receipts = materials are on-site = work can start
   * - Category-based tracking allows comprehensive monitoring
   * - Multiple POs per category = better material tracking
   */
  async suggestMilestonesFromRAB(projectId) {
    try {
      console.log(`\n🎯 [MILESTONE SUGGEST] Starting for project: ${projectId}`);
      
      // Step 1: Get POs that have delivery receipts (materials on-site)
      const posWithReceiptsQuery = `
        SELECT DISTINCT
          po.id as po_id,
          po.po_number,
          po.supplier_name,
          po.items,
          po.total_amount,
          po.status,
          dr.receipt_number,
          dr.received_date
        FROM purchase_orders po
        INNER JOIN delivery_receipts dr ON dr.purchase_order_id = po.po_number
        WHERE po.project_id = $1
          AND dr.status = 'received'
          AND po.status IN ('received', 'approved')
        ORDER BY dr.received_date DESC
      `;
      
      const posWithReceipts = await sequelize.query(posWithReceiptsQuery, {
        bind: [projectId],
        type: sequelize.QueryTypes.SELECT
      });
      
      console.log(`📦 Found ${posWithReceipts.length} POs with delivery receipts`);
      
      if (posWithReceipts.length === 0) {
        console.log('⚠️  No POs with delivery receipts found');
        return [];
      }
      
      // Step 2: Extract RAB item IDs from PO items and get their categories
      const rabItemIds = [];
      const poItemsMap = new Map(); // Map rabItemId -> PO details
      
      for (const po of posWithReceipts) {
        const items = po.items || [];
        for (const item of items) {
          if (item.inventoryId) {
            rabItemIds.push(item.inventoryId);
            if (!poItemsMap.has(item.inventoryId)) {
              poItemsMap.set(item.inventoryId, []);
            }
            poItemsMap.get(item.inventoryId).push({
              po_number: po.po_number,
              po_id: po.po_id,
              supplier: po.supplier_name,
              quantity: item.quantity,
              item_name: item.itemName,
              total_price: item.totalPrice,
              receipt_number: po.receipt_number,
              received_date: po.received_date
            });
          }
        }
      }
      
      console.log(`🔍 Extracted ${rabItemIds.length} RAB item IDs from POs`);
      
      if (rabItemIds.length === 0) {
        console.log('⚠️  No RAB items found in POs');
        
        // Alternative: Create suggestions from PO items directly (without RAB linkage)
        const categoryGroups = new Map();
        
        for (const po of posWithReceipts) {
          const items = po.items || [];
          for (const item of items) {
            // Use item name as category if no RAB link
            const category = item.category || 'Material dari PO';
            
            if (!categoryGroups.has(category)) {
              categoryGroups.set(category, {
                category: category,
                rabItems: [],
                poDetails: [],
                totalValue: 0,
                totalQuantity: 0,
                earliestReceived: null
              });
            }
            
            const group = categoryGroups.get(category);
            group.totalValue += parseFloat(item.totalPrice || 0);
            
            // Add PO details
            if (!group.poDetails.find(p => p.po_number === po.po_number)) {
              group.poDetails.push({
                po_number: po.po_number,
                po_id: po.po_id,
                supplier: po.supplier_name,
                quantity: item.quantity,
                item_name: item.itemName,
                total_price: item.totalPrice,
                receipt_number: po.receipt_number,
                received_date: po.received_date
              });
              
              if (!group.earliestReceived || new Date(po.received_date) < new Date(group.earliestReceived)) {
                group.earliestReceived = po.received_date;
              }
            }
            
            // Store item info
            group.rabItems.push({
              description: item.itemName || item.description,
              quantity: item.quantity,
              unit: item.unit || 'unit',
              unit_price: item.unitPrice,
              total_value: item.totalPrice
            });
          }
        }
        
        console.log(`📂 Grouped ${categoryGroups.size} categories from PO items directly`);
        
        // Skip to suggestion generation
        return this.generateSuggestionsFromGroups(projectId, categoryGroups);
      }
      
      // Step 3: Get categories from RAB items
      const rabCategoriesQuery = `
        SELECT 
          id as rab_item_id,
          category,
          description,
          quantity,
          unit,
          unit_price,
          (CAST(quantity AS DECIMAL) * CAST(unit_price AS DECIMAL)) as total_value
        FROM rab_items
        WHERE id = ANY($1::uuid[])
        ORDER BY category, description
      `;
      
      const rabItems = await sequelize.query(rabCategoriesQuery, {
        bind: [rabItemIds],
        type: sequelize.QueryTypes.SELECT
      });
      
      console.log(`📊 Found ${rabItems.length} RAB items with categories`);
      
      // Step 4: Group by category
      const categoryGroups = new Map();
      
      for (const rabItem of rabItems) {
        const category = rabItem.category || 'Uncategorized';
        
        if (!categoryGroups.has(category)) {
          categoryGroups.set(category, {
            category: category,
            rabItems: [],
            poDetails: [],
            totalValue: 0,
            totalQuantity: 0,
            earliestReceived: null
          });
        }
        
        const group = categoryGroups.get(category);
        group.rabItems.push(rabItem);
        group.totalValue += parseFloat(rabItem.total_value || 0);
        
        // Add PO details for this RAB item
        const poDetails = poItemsMap.get(rabItem.rab_item_id) || [];
        for (const po of poDetails) {
          // Avoid duplicates
          if (!group.poDetails.find(p => p.po_number === po.po_number)) {
            group.poDetails.push(po);
            
            // Track earliest received date
            if (!group.earliestReceived || new Date(po.received_date) < new Date(group.earliestReceived)) {
              group.earliestReceived = po.received_date;
            }
          }
        }
      }
      
      console.log(`📂 Grouped into ${categoryGroups.size} categories`);
      
      // Generate suggestions using helper method
      return this.generateSuggestionsFromGroups(projectId, categoryGroups);
    } catch (error) {
      console.error('[MilestoneIntegrationService] Error suggesting milestones:', error);
      console.error('Stack trace:', error.stack);
      throw error;
    }
  }

  /**
   * Helper: Generate milestone suggestions from category groups
   */
  async generateSuggestionsFromGroups(projectId, categoryGroups) {
    // Get existing milestones to avoid duplicates
    const existingQuery = `
      SELECT category_link->>'category_name' as category_name
      FROM project_milestones
      WHERE project_id = $1
        AND category_link IS NOT NULL
        AND category_link->>'enabled' = 'true'
    `;

    const existingMilestones = await sequelize.query(existingQuery, {
      bind: [projectId],
      type: sequelize.QueryTypes.SELECT
    });

    const existingCategories = new Set(
      existingMilestones.map(m => m.category_name).filter(Boolean)
    );
    
    console.log(`✅ Found ${existingCategories.size} existing milestone categories`);
    
    // Create suggestions (filter out existing)
    const suggestions = [];
    let sequenceNumber = 1;
    
    for (const [category, group] of categoryGroups.entries()) {
      if (existingCategories.has(category)) {
        console.log(`⏭️  Skipping existing category: ${category}`);
        continue;
      }
      
      // Calculate estimated duration based on value (1 week per 50M IDR)
      const estimatedWeeks = Math.max(1, Math.ceil(group.totalValue / 50000000));
      const estimatedDays = estimatedWeeks * 7;
      
      // Use earliest received date as potential start
      const startDate = group.earliestReceived 
        ? new Date(group.earliestReceived)
        : new Date();
      
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + estimatedDays);
      
      suggestions.push({
        sequence: sequenceNumber++,
        category: category,
        itemCount: group.rabItems.length,
        poCount: group.poDetails.length,
        totalValue: group.totalValue,
        poNumbers: group.poDetails.map(po => po.po_number),
        materials: group.rabItems.map(item => ({
          name: item.description,
          quantity: parseFloat(item.quantity || 0),
          unit: item.unit
        })),
        suggestedTitle: `${category} - Fase 1`,
        suggestedDescription: `Pelaksanaan ${category}. Material sudah diterima dari ${group.poDetails.length} PO (${group.poDetails.map(po => po.po_number).join(', ')}). Total nilai: Rp ${group.totalValue.toLocaleString('id-ID')}`,
        estimatedDuration: estimatedDays,
        suggestedStartDate: startDate.toISOString().split('T')[0],
        suggestedEndDate: endDate.toISOString().split('T')[0],
        earliestMaterialReceived: group.earliestReceived,
        readyToStart: true, // Materials are on-site
        metadata: {
          po_count: group.poDetails.length,
          material_count: group.rabItems.length,
          total_value: group.totalValue,
          has_delivery_receipt: true,
          source: group.rabItems.length > 0 && group.rabItems[0].rab_item_id ? 'rab_linked' : 'po_direct'
        }
      });
    }
    
    console.log(`✨ Generated ${suggestions.length} milestone suggestions\n`);
    
    return suggestions;
  }

  /**
   * Calculate workflow progress for a milestone
   */
  async calculateWorkflowProgress(milestoneId) {
    try {
      const milestone = await this.getMilestoneWithCategory(milestoneId);
      
      if (!milestone || !milestone.category_link || !milestone.category_link.enabled) {
        return null;
      }

      const categoryName = milestone.category_link.category_name;
      const projectId = milestone.projectId;

      // Stage 1: RAB Approved
      const rabData = await this.getRABData(projectId, categoryName);

      // Stage 2: Purchase Orders
      const poData = await this.getPOData(projectId, categoryName);

      // Stage 3: Tanda Terima (Receipts)
      const receiptData = await this.getReceiptData(projectId, poData.po_ids);

      // Stage 4: Berita Acara
      const baData = await this.getBeritaAcaraData(projectId, milestoneId);

      // Stage 5: Progress Payments
      const paymentData = await this.getPaymentData(projectId, milestoneId);

      const workflowProgress = {
        rab_approved: {
          status: true,
          total_value: rabData.total_value,
          total_items: rabData.total_items,
          approved_date: rabData.approved_date
        },
        purchase_orders: {
          total_count: poData.total_count,
          approved_count: poData.approved_count,
          pending_count: poData.pending_count,
          total_value: poData.total_value,
          items: poData.items
        },
        receipts: {
          received_count: receiptData.received_count,
          expected_count: poData.approved_count,
          received_value: receiptData.received_value,
          pending_value: poData.total_value - receiptData.received_value,
          items: receiptData.items,
          alerts: this.generateReceiptAlerts(poData.items, receiptData.items)
        },
        berita_acara: {
          total_count: baData.total_count,
          completed_percentage: baData.completed_percentage,
          total_value: baData.total_value,
          items: baData.items
        },
        payments: {
          paid_count: paymentData.paid_count,
          paid_value: paymentData.paid_value,
          pending_value: rabData.total_value - paymentData.paid_value,
          payment_percentage: (paymentData.paid_value / rabData.total_value) * 100,
          items: paymentData.items
        }
      };

      // Calculate overall progress
      const overallProgress = this.calculateOverallProgress(workflowProgress);

      // Update milestone
      await this.updateMilestoneProgress(milestoneId, workflowProgress, overallProgress);

      return {
        milestoneId,
        workflow_progress: workflowProgress,
        overall_progress: overallProgress,
        last_synced: new Date()
      };
    } catch (error) {
      console.error('[MilestoneIntegrationService] Error calculating progress:', error);
      throw error;
    }
  }

  /**
   * Get RAB data for category
   */
  async getRABData(projectId, categoryName) {
    const query = `
      SELECT 
        COUNT(*) as total_items,
        SUM(CAST(quantity AS DECIMAL) * CAST(unit_price AS DECIMAL)) as total_value,
        MAX(updated_at) as approved_date
      FROM rab_items
      WHERE project_id = $1
        AND category = $2
        AND approval_status = 'approved'
    `;

    const results = await sequelize.query(query, {
      bind: [projectId, categoryName],
      type: sequelize.QueryTypes.SELECT
    });

    const result = results[0] || {};

    return {
      total_items: parseInt(result.total_items || 0),
      total_value: parseFloat(result.total_value || 0),
      approved_date: result.approved_date
    };
  }

  /**
   * Get Purchase Order data
   */
  async getPOData(projectId, categoryName) {
    // Get RAB item IDs for this category
    const rabQuery = `
      SELECT id 
      FROM rab_items 
      WHERE project_id = $1 AND category = $2
    `;

    const rabItems = await sequelize.query(rabQuery, {
      bind: [projectId, categoryName],
      type: sequelize.QueryTypes.SELECT
    });

    const rabItemIds = rabItems.map(r => r.id);

    if (rabItemIds.length === 0) {
      return {
        total_count: 0,
        approved_count: 0,
        pending_count: 0,
        total_value: 0,
        items: [],
        po_ids: []
      };
    }

    // Get POs related to these RAB items
    const poQuery = `
      SELECT DISTINCT
        po.id,
        po.po_number,
        po.supplier_name,
        po.status,
        po.total_amount,
        po.created_at
      FROM purchase_orders po
      JOIN purchase_order_items poi ON po.id = poi.purchase_order_id
      WHERE po.project_id = $1
        AND poi.rab_item_id = ANY($2::uuid[])
      ORDER BY po.created_at DESC
    `;

    const pos = await sequelize.query(poQuery, {
      bind: [projectId, rabItemIds],
      type: sequelize.QueryTypes.SELECT
    });

    const approvedPOs = pos.filter(po => po.status === 'approved');
    const pendingPOs = pos.filter(po => po.status === 'pending');

    return {
      total_count: pos.length,
      approved_count: approvedPOs.length,
      pending_count: pendingPOs.length,
      total_value: pos.reduce((sum, po) => sum + parseFloat(po.total_amount || 0), 0),
      items: pos.map(po => ({
        po_id: po.id,
        po_number: po.po_number,
        supplier: po.supplier_name,
        value: parseFloat(po.total_amount || 0),
        status: po.status,
        date: po.created_at
      })),
      po_ids: pos.map(po => po.id)
    };
  }

  /**
   * Get Receipt (Tanda Terima) data
   */
  async getReceiptData(projectId, poIds) {
    if (poIds.length === 0) {
      return {
        received_count: 0,
        received_value: 0,
        items: []
      };
    }

    const query = `
      SELECT 
        r.id,
        r.receipt_number,
        r.po_id,
        po.po_number,
        r.received_date,
        r.total_value,
        r.status
      FROM receipts r
      JOIN purchase_orders po ON r.po_id = po.id
      WHERE r.po_id = ANY($1::uuid[])
      ORDER BY r.received_date DESC
    `;

    try {
      const receipts = await sequelize.query(query, {
        bind: [poIds],
        type: sequelize.QueryTypes.SELECT
      });

      return {
        received_count: receipts.length,
        received_value: receipts.reduce((sum, r) => sum + parseFloat(r.total_value || 0), 0),
        items: receipts.map(r => ({
          receipt_id: r.id,
          receipt_number: r.receipt_number,
          po_number: r.po_number,
          received_date: r.received_date,
          value: parseFloat(r.total_value || 0),
          status: r.status
        }))
      };
    } catch (error) {
      // Table might not exist yet
      console.log('[MilestoneIntegrationService] Receipts table not ready:', error.message);
      return {
        received_count: 0,
        received_value: 0,
        items: []
      };
    }
  }

  /**
   * Get Berita Acara data
   */
  async getBeritaAcaraData(projectId, milestoneId) {
    const query = `
      SELECT 
        COUNT(*) as total_count,
        AVG(CAST(progress_percentage AS DECIMAL)) as avg_progress,
        SUM(CAST(total_value AS DECIMAL)) as total_value
      FROM berita_acara
      WHERE project_id = $1
        AND ("milestoneId" = $2 OR "milestoneId" IS NULL)
    `;

    try {
      const results = await sequelize.query(query, {
        bind: [projectId, milestoneId],
        type: sequelize.QueryTypes.SELECT
      });

      const result = results[0] || {};

      return {
        total_count: parseInt(result.total_count || 0),
        completed_percentage: parseFloat(result.avg_progress || 0),
        total_value: parseFloat(result.total_value || 0),
        items: []
      };
    } catch (error) {
      console.log('[MilestoneIntegrationService] BA query error:', error.message);
      return {
        total_count: 0,
        completed_percentage: 0,
        total_value: 0,
        items: []
      };
    }
  }

  /**
   * Get Progress Payment data
   */
  async getPaymentData(projectId, milestoneId) {
    const query = `
      SELECT 
        COUNT(*) as paid_count,
        SUM(CAST(amount_paid AS DECIMAL)) as paid_value
      FROM progress_payments
      WHERE project_id = $1
        AND milestone_id = $2
        AND payment_status = 'paid'
    `;

    try {
      const results = await sequelize.query(query, {
        bind: [projectId, milestoneId],
        type: sequelize.QueryTypes.SELECT
      });

      const result = results[0] || {};

      return {
        paid_count: parseInt(result.paid_count || 0),
        paid_value: parseFloat(result.paid_value || 0),
        items: []
      };
    } catch (error) {
      console.log('[MilestoneIntegrationService] Payment query error:', error.message);
      return {
        paid_count: 0,
        paid_value: 0,
        items: []
      };
    }
  }

  /**
   * Generate alerts for receipt delays
   */
  generateReceiptAlerts(poItems, receiptItems) {
    const alerts = [];
    const now = new Date();
    const receivedPONumbers = new Set(receiptItems.map(r => r.po_number));

    poItems.forEach(po => {
      if (po.status === 'approved' && !receivedPONumbers.has(po.po_number)) {
        const daysSinceApproval = (now - new Date(po.date)) / (1000 * 60 * 60 * 24);
        
        if (daysSinceApproval > 7) {
          alerts.push({
            type: 'delivery_delay',
            severity: daysSinceApproval > 14 ? 'high' : 'medium',
            message: `${po.po_number} approved ${Math.floor(daysSinceApproval)} days ago, no receipt yet`,
            po_id: po.po_id,
            days_waiting: Math.floor(daysSinceApproval)
          });
        }
      }
    });

    return alerts;
  }

  /**
   * Calculate overall progress based on workflow stages
   */
  calculateOverallProgress(workflowProgress) {
    const weights = {
      rab_approved: 10,
      po_created: 20,
      receipts_received: 20,
      ba_completed: 30,
      payment_completed: 20
    };

    let progress = 0;

    // Stage 1: RAB
    if (workflowProgress.rab_approved.status) {
      progress += weights.rab_approved;
    }

    // Stage 2: PO
    if (workflowProgress.purchase_orders.total_count > 0) {
      const poProgress = workflowProgress.purchase_orders.approved_count / 
                        workflowProgress.purchase_orders.total_count;
      progress += weights.po_created * poProgress;
    }

    // Stage 3: Receipts
    if (workflowProgress.receipts.expected_count > 0) {
      const receiptProgress = workflowProgress.receipts.received_count / 
                             workflowProgress.receipts.expected_count;
      progress += weights.receipts_received * receiptProgress;
    }

    // Stage 4: BA
    progress += (weights.ba_completed * workflowProgress.berita_acara.completed_percentage) / 100;

    // Stage 5: Payment
    progress += (weights.payment_completed * workflowProgress.payments.payment_percentage) / 100;

    return Math.round(progress);
  }

  /**
   * Update milestone with progress data
   */
  async updateMilestoneProgress(milestoneId, workflowProgress, overallProgress) {
    const query = `
      UPDATE project_milestones
      SET 
        workflow_progress = $1,
        progress = $2,
        last_synced = $3,
        "updatedAt" = $3
      WHERE id = $4
    `;

    await sequelize.query(query, {
      bind: [
        JSON.stringify(workflowProgress),
        overallProgress,
        new Date(),
        milestoneId
      ],
      type: sequelize.QueryTypes.UPDATE
    });
  }

  /**
   * Helper: Get milestone with category
   */
  async getMilestoneWithCategory(milestoneId) {
    const query = `
      SELECT *
      FROM project_milestones
      WHERE id = $1
    `;

    const results = await sequelize.query(query, {
      bind: [milestoneId],
      type: sequelize.QueryTypes.SELECT
    });

    return results[0] || null;
  }

  /**
   * Helper: Calculate start date
   */
  calculateStartDate(offsetDays) {
    const date = new Date();
    date.setDate(date.getDate() + offsetDays);
    return date.toISOString().split('T')[0];
  }

  /**
   * Helper: Calculate end date
   */
  calculateEndDate(startOffsetDays, durationDays) {
    const date = new Date();
    date.setDate(date.getDate() + startOffsetDays + durationDays);
    return date.toISOString().split('T')[0];
  }
}

module.exports = new MilestoneIntegrationService();
