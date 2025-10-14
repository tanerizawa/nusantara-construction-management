/**
 * Projects Module - Basic CRUD Routes
 * Handles: List, Get, Create, Update, Delete projects
 * Lines: ~300 (extracted from 3,031 line monolith)
 */

const express = require("express");
const Joi = require("joi");
const { Op } = require("sequelize");
const Project = require("../../models/Project");
const ProjectRAB = require("../../models/ProjectRAB");
const ProjectTeamMember = require("../../models/ProjectTeamMember");
const ProjectDocument = require("../../models/ProjectDocument");
const ProjectMilestone = require("../../models/ProjectMilestone");
const User = require("../../models/User");
const Subsidiary = require("../../models/Subsidiary");
const PurchaseOrder = require("../../models/PurchaseOrder");
const DeliveryReceipt = require("../../models/DeliveryReceipt");
const BeritaAcara = require("../../models/BeritaAcara");
const { verifyToken } = require("../../middleware/auth");

const router = express.Router();

// Validation schema for project creation/update
const projectSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(""),
  clientName: Joi.string().required(),
  clientContact: Joi.object().optional(),
  location: Joi.object().optional(),
  budget: Joi.number().min(0).optional(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  status: Joi.string()
    .valid("planning", "active", "on_hold", "completed", "cancelled")
    .default("planning"),
  status_notes: Joi.string().allow("").optional(), // For quick status update notes
  priority: Joi.string()
    .valid("low", "medium", "high", "urgent")
    .default("medium"),
  progress: Joi.number().min(0).max(100).default(0),
  subsidiary: Joi.object({
    id: Joi.string().required(),
    code: Joi.string().optional(),
    name: Joi.string().optional(),
  }).optional(),
});

// Validation schema for quick status update (only status and notes)
const statusUpdateSchema = Joi.object({
  status: Joi.string()
    .valid("planning", "active", "on_hold", "completed", "cancelled")
    .required(),
  status_notes: Joi.string().allow("").optional(), // Frontend sends status_notes
  notes: Joi.string().allow("").optional(), // Database uses notes column
});

/**
 * @route   GET /api/projects
 * @desc    Get all projects with filters and pagination
 * @access  Private
 */
router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      search,
      status,
      priority,
      subsidiaryId,
      sortBy = "createdAt",
      sortOrder = "DESC",
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    // Apply filters
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { id: { [Op.iLike]: `%${search}%` } },
        { clientName: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (priority) {
      where.priority = priority;
    }

    if (subsidiaryId) {
      where.subsidiaryId = subsidiaryId;
    }

    // Fetch projects with related data
    const { count, rows: projects } = await Project.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortBy, sortOrder]],
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "username", "email", "profile"],
          required: false,
        },
        {
          model: ProjectRAB,
          as: "rabItemsList",
          required: false,
          attributes: ["id", "status"],
        },
        {
          model: Subsidiary,
          as: "subsidiary",
          attributes: ["id", "name", "code"],
          required: false,
        },
      ],
    });

    // Calculate statistics
    const projectsWithStats = projects.map((project) => {
      const rabCount = project.rabItemsList?.length || 0;
      const approvedRAB =
        project.rabItemsList?.filter((r) => r.status === "approved").length ||
        0;

      return {
        ...project.toJSON(),
        stats: {
          rabCount,
          approvedRAB,
          rabCompletionRate:
            rabCount > 0 ? ((approvedRAB / rabCount) * 100).toFixed(1) : 0,
        },
      };
    });

    res.json({
      success: true,
      data: projectsWithStats,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch projects",
      details: error.message,
    });
  }
});

/**
 * @route   GET /api/projects/preview-code/:subsidiaryCode
 * @desc    Preview next project code for a subsidiary
 * @access  Private
 */
router.get("/preview-code/:subsidiaryCode", async (req, res) => {
  try {
    const { subsidiaryCode } = req.params;

    // Validate subsidiary code (should be 3 characters)
    if (!subsidiaryCode || subsidiaryCode.length !== 3) {
      return res.status(400).json({
        success: false,
        error: "Invalid subsidiary code. Must be 3 characters.",
      });
    }

    // Generate next project code
    const year = new Date().getFullYear();
    
    // Get count of existing projects for this year and subsidiary
    const { count } = await Project.findAndCountAll({
      where: {
        id: {
          [Op.like]: `${year}${subsidiaryCode}%`
        }
      }
    });
    
    const sequence = String(count + 1).padStart(3, '0');
    const nextProjectCode = `${year}${subsidiaryCode}${sequence}`;

    res.json({
      success: true,
      data: {
        nextProjectCode,
        year,
        subsidiaryCode,
        sequence: count + 1,
      },
    });
  } catch (error) {
    console.error("Error generating code preview:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate code preview",
      details: error.message,
    });
  }
});

/**
 * @route   GET /api/projects/:id
 * @desc    Get single project by ID with full details
 * @access  Private
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findByPk(id, {
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "username", "email", "role", "profile"],
          required: false,
        },
        {
          model: User,
          as: "updater",
          attributes: ["id", "username", "email", "role", "profile"],
          required: false,
        },
        {
          model: ProjectRAB,
          as: "rabItemsList",
          required: false,
        },
        {
          model: ProjectTeamMember,
          as: "teamMembersList",
          required: false,
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "username", "email", "profile"],
              required: false,
            },
          ],
        },
        {
          model: ProjectDocument,
          as: "documentsList",
          required: false,
        },
        {
          model: ProjectMilestone,
          as: "milestonesList",
          required: false,
        },
      ],
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        error: "Project not found",
      });
    }

    // Calculate statistics
    const rabItems = project.rabItemsList || [];
    const teamMembers = project.teamMembersList || [];
    const documents = project.documentsList || [];
    const milestones = project.milestonesList || []; // Add milestones

    // Calculate budget summary
    const totalBudget = parseFloat(project.budget) || 0;
    
    // FIX: Use totalPrice instead of amount, and check both status AND isApproved
    const approvedRABAmount = rabItems
      .filter((item) => item.status === "approved" || item.isApproved === true)
      .reduce((sum, item) => sum + (parseFloat(item.totalPrice) || 0), 0);
    const pendingRABAmount = rabItems
      .filter((item) => item.status === "pending")
      .reduce((sum, item) => sum + (parseFloat(item.totalPrice) || 0), 0);

    // Fetch real Purchase Orders from database
    const purchaseOrders = await PurchaseOrder.findAll({
      where: { projectId: id },
      order: [["createdAt", "DESC"]],
      limit: 50,
    });

    // Fetch real Delivery Receipts from database
    const deliveryReceipts = await DeliveryReceipt.findAll({
      where: { projectId: id },
      order: [["receivedDate", "DESC"]],
      limit: 50,
    });

    // Fetch real Berita Acara from database
    const beritaAcara = await BeritaAcara.findAll({
      where: { projectId: id },
      order: [["createdAt", "DESC"]],
      limit: 50,
    });

    // Calculate committed amount from real PO data
    const committedAmount = purchaseOrders.reduce(
      (sum, po) =>
        po.status === "approved" || po.status === "received"
          ? sum + (parseFloat(po.totalAmount) || 0)
          : sum,
      0
    );

    // Calculate actual spent from delivery receipts that have been received
    // When materials are received, they count as actual expenditure
    const actualSpent = deliveryReceipts
      .filter((dr) => dr.status === "received" || dr.status === "completed")
      .reduce((sum, dr) => {
        // Get PO to find the amount
        const relatedPO = purchaseOrders.find(po => po.id === dr.purchaseOrderId);
        if (relatedPO) {
          return sum + (parseFloat(relatedPO.totalAmount) || 0);
        }
        return sum;
      }, 0);

    // Transform data for API response
    const transformedProject = {
      id: project.id,
      name: project.name,
      description: project.description,
      clientName: project.clientName,
      clientContact: project.clientContact || {},
      location: project.location,
      budget: totalBudget,
      totalBudget: totalBudget,
      status: project.status,
      priority: project.priority,
      progress: project.progress,
      startDate: project.startDate,
      endDate: project.endDate,
      subsidiaryId: project.subsidiaryId,
      subsidiaryInfo: project.subsidiaryInfo,

      // Enhanced data
      rabItems: rabItems.map((item) => ({
        id: item.id,
        description: item.description,
        category: item.category,
        quantity: item.quantity,
        unit: item.unit,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        amount: item.totalPrice, // Backward compatibility: map totalPrice to amount
        status: item.status,
        isApproved: item.isApproved,
        approvedBy: item.approvedBy,
        approvedAt: item.approvedAt,
        createdAt: item.createdAt,
      })),

      teamMembers: teamMembers.map((member) => ({
        id: member.id,
        userId: member.userId,
        role: member.role,
        position: member.position,
        user: member.user
          ? {
              id: member.user.id,
              username: member.user.username,
              email: member.user.email,
              fullName: member.user.profile?.fullName || member.user.username,
            }
          : null,
        joinDate: member.createdAt,
      })),

      documents: documents.map((doc) => ({
        id: doc.id,
        title: doc.title,
        filename: doc.filename,
        type: doc.type,
        size: doc.size,
        uploadDate: doc.createdAt,
      })),

      // Budget summary
      budgetSummary: {
        totalBudget: totalBudget,
        approvedAmount: approvedRABAmount,
        committedAmount: committedAmount,
        actualSpent: actualSpent,
        remainingBudget: totalBudget - actualSpent,
      },

      // Workflow statistics
      approvalStatus: {
        pending: rabItems.filter((item) => item.status === "pending").length,
        approved: rabItems.filter((item) => item.status === "approved").length,
        rejected: rabItems.filter((item) => item.status === "rejected").length,
      },

      // Real Purchase Orders
      purchaseOrders: purchaseOrders.map((po) => ({
        id: po.id,
        poNumber: po.poNumber,
        supplierName: po.supplierName,
        totalAmount: po.totalAmount,
        status: po.status,
        orderDate: po.orderDate,
        createdAt: po.createdAt,
      })),

      // Real Delivery Receipts
      deliveryReceipts: deliveryReceipts.map((dr) => ({
        id: dr.id,
        receiptNumber: dr.receiptNumber,
        poNumber: dr.purchaseOrderId,
        receivedDate: dr.receivedDate,
        supplier: dr.supplier,
        status: dr.status,
        items: dr.items,
        createdAt: dr.createdAt,
      })),

      // Real Berita Acara
      beritaAcara: beritaAcara.map((ba) => ({
        id: ba.id,
        title: ba.title,
        description: ba.description,
        status: ba.status,
        createdAt: ba.createdAt,
      })),

      // Milestones - Add to response
      milestonesList: milestones.map((milestone) => ({
        id: milestone.id,
        title: milestone.title,
        description: milestone.description,
        status: milestone.status,
        progress: milestone.progress,
        budget: milestone.budget,
        actualCost: milestone.actualCost,
        targetDate: milestone.targetDate,
        completedDate: milestone.completedDate,
        priority: milestone.priority,
        createdAt: milestone.createdAt,
        updatedAt: milestone.updatedAt,
      })),

      metadata: project.metadata || {},
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      createdBy: project.created_by,
      updatedBy: project.updated_by,
      createdByUser: project.creator
        ? {
            id: project.creator.id,
            username: project.creator.username,
            email: project.creator.email,
            fullName:
              project.creator.profile?.fullName || project.creator.username,
          }
        : null,
      updatedByUser: project.updater
        ? {
            id: project.updater.id,
            username: project.updater.username,
            email: project.updater.email,
            fullName:
              project.updater.profile?.fullName || project.updater.username,
          }
        : null,
    };

    res.json({
      success: true,
      data: transformedProject,
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch project",
      details: error.message,
    });
  }
});

/**
 * @route   POST /api/projects
 * @desc    Create new project
 * @access  Private
 */
router.post("/", verifyToken, async (req, res) => {
  try {
    // Validate request body
    const { error, value } = projectSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: "Validation error",
        details: error.details.map((d) => d.message),
      });
    }

    // Generate project ID
    const year = new Date().getFullYear();
    const subsidiaryCode = value.subsidiary?.code || 'GEN'; // Default to 'GEN' if no subsidiary
    
    // Get count of existing projects for this year and subsidiary
    const { count } = await Project.findAndCountAll({
      where: {
        id: {
          [Op.like]: `${year}${subsidiaryCode}%`
        }
      }
    });
    
    const sequence = String(count + 1).padStart(3, '0');
    const projectId = `${year}${subsidiaryCode}${sequence}`;

    // Create project
    const project = await Project.create({
      id: projectId,
      ...value,
      subsidiaryId: value.subsidiary?.id,
      subsidiaryInfo: value.subsidiary,
      created_by: req.user?.id,
      updated_by: req.user?.id,
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create project",
      details: error.message,
    });
  }
});

/**
 * @route   PATCH /api/projects/:id/status
 * @desc    Quick status update (dedicated endpoint)
 * @access  Private
 */
router.patch("/:id/status", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('[PATCH /projects/:id/status] Request body:', req.body);

    // Validate request body
    const { error, value } = statusUpdateSchema.validate(req.body);
    
    if (error) {
      console.error('[PATCH /projects/:id/status] Validation error:', error.details);
      return res.status(400).json({
        success: false,
        error: "Validation error",
        details: error.details.map((d) => d.message),
      });
    }

    // Find project
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: "Project not found",
      });
    }

    // Prepare update data - map status_notes to notes
    const updateData = {
      status: value.status,
      updated_by: req.user?.id,
    };

    // Map status_notes to notes column if provided
    if (value.status_notes !== undefined) {
      updateData.notes = value.status_notes;
    } else if (value.notes !== undefined) {
      updateData.notes = value.notes;
    }

    console.log('[PATCH /projects/:id/status] Updating project:', id, 'Data:', updateData);

    await project.update(updateData);

    res.json({
      success: true,
      message: "Status updated successfully",
      data: project,
    });
  } catch (error) {
    console.error("[PATCH /projects/:id/status] Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update status",
      details: error.message,
    });
  }
});

/**
 * @route   PUT /api/projects/:id
 * @desc    Update project (full update or quick status update)
 * @access  Private
 */
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if this is a quick status update (only status and/or status_notes)
    const isQuickStatusUpdate = Object.keys(req.body).every(key => 
      ['status', 'status_notes', 'notes'].includes(key)
    );

    // Use appropriate validation schema
    const schema = isQuickStatusUpdate ? statusUpdateSchema : projectSchema;
    const { error, value } = schema.validate(req.body);
    
    if (error) {
      console.error('[PUT /projects/:id] Validation error:', error.details);
      return res.status(400).json({
        success: false,
        error: "Validation error",
        details: error.details.map((d) => d.message),
      });
    }

    // Find and update project
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: "Project not found",
      });
    }

    // Prepare update data
    const updateData = {
      ...value,
      updated_by: req.user?.id,
    };

    // Map status_notes to notes column if provided (for quick status update)
    if (isQuickStatusUpdate && value.status_notes !== undefined) {
      updateData.notes = value.status_notes;
      delete updateData.status_notes; // Remove status_notes as it doesn't exist in DB
    }

    // For full update, include subsidiary info
    if (!isQuickStatusUpdate && value.subsidiary) {
      updateData.subsidiaryId = value.subsidiary.id;
      updateData.subsidiaryInfo = value.subsidiary;
    }

    console.log('[PUT /projects/:id] Updating project:', id, 'Data:', updateData, 'Quick update:', isQuickStatusUpdate);

    await project.update(updateData);

    res.json({
      success: true,
      message: isQuickStatusUpdate ? "Status updated successfully" : "Project updated successfully",
      data: project,
    });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update project",
      details: error.message,
    });
  }
});

/**
 * @route   DELETE /api/projects/:id
 * @desc    Delete project and all related data
 * @access  Private
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id: projectId } = req.params;

    // Delete related data in correct order (respect foreign key constraints)
    // 1. Delete child records first (delivery receipts reference purchase orders)
    const deliveryReceiptsDeleted = await DeliveryReceipt.destroy({
      where: { projectId },
    });

    // 2. Now safe to delete purchase orders
    const poDeleted = await PurchaseOrder.destroy({ where: { projectId } });

    // 3. Delete berita acara
    const baDeleted = await BeritaAcara.destroy({ where: { projectId } });

    // 4. Delete other project data
    const rabDeleted = await ProjectRAB.destroy({ where: { projectId } });

    const milestonesDeleted = await ProjectMilestone.destroy({
      where: { projectId },
    });

    const teamDeleted = await ProjectTeamMember.destroy({
      where: { projectId },
    });

    const documentsDeleted = await ProjectDocument.destroy({
      where: { projectId },
    });

    // Delete project
    const projectDeleted = await Project.destroy({ where: { id: projectId } });

    if (!projectDeleted) {
      return res.status(404).json({
        success: false,
        error: "Project not found",
      });
    }

    res.json({
      success: true,
      message: "Project and all related data deleted successfully",
      deletedCounts: {
        project: projectDeleted,
        rab: rabDeleted,
        milestones: milestonesDeleted,
        team: teamDeleted,
        documents: documentsDeleted,
        beritaAcara: baDeleted,
        purchaseOrders: poDeleted,
        deliveryReceipts: deliveryReceiptsDeleted,
      },
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete project",
      details: error.message,
    });
  }
});

module.exports = router;
