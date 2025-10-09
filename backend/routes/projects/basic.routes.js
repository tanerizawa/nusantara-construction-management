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
const PurchaseOrder = require("../../models/PurchaseOrder");
const DeliveryReceipt = require("../../models/DeliveryReceipt");
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

    // Calculate budget summary
    const totalBudget = parseFloat(project.budget) || 0;
    const approvedRABAmount = rabItems
      .filter((item) => item.status === "approved")
      .reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    const pendingRABAmount = rabItems
      .filter((item) => item.status === "pending")
      .reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

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

    // Calculate committed amount from real PO data
    const committedAmount = purchaseOrders.reduce(
      (sum, po) =>
        po.status === "approved" || po.status === "received"
          ? sum + (parseFloat(po.totalAmount) || 0)
          : sum,
      0
    );

    // Mock actual spent (can be calculated from actual expense tracking)
    const actualSpent =
      ((totalBudget * (parseFloat(project.progress) || 0)) / 100) * 0.8;

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
        quantity: item.quantity,
        unit: item.unit,
        unitPrice: item.unitPrice,
        amount: item.amount,
        status: item.status,
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
        status: dr.status,
        items: dr.items,
        createdAt: dr.createdAt,
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

    // Create project
    const project = await Project.create({
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
 * @route   PUT /api/projects/:id
 * @desc    Update project
 * @access  Private
 */
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Validate request body
    const { error, value } = projectSchema.validate(req.body);
    if (error) {
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

    await project.update({
      ...value,
      subsidiaryId: value.subsidiary?.id,
      subsidiaryInfo: value.subsidiary,
      updated_by: req.user?.id,
    });

    res.json({
      success: true,
      message: "Project updated successfully",
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

    console.log(`🗑️  Deleting project: ${projectId}`);

    // Delete related data in order
    const rabDeleted = await ProjectRAB.destroy({ where: { projectId } });
    console.log(`   ✓ Deleted ${rabDeleted} RAB items`);

    const milestonesDeleted = await ProjectMilestone.destroy({
      where: { projectId },
    });
    console.log(`   ✓ Deleted ${milestonesDeleted} milestones`);

    const teamDeleted = await ProjectTeamMember.destroy({
      where: { projectId },
    });
    console.log(`   ✓ Deleted ${teamDeleted} team members`);

    const documentsDeleted = await ProjectDocument.destroy({
      where: { projectId },
    });
    console.log(`   ✓ Deleted ${documentsDeleted} documents`);

    const baDeleted = await BeritaAcara.destroy({ where: { projectId } });
    console.log(`   ✓ Deleted ${baDeleted} berita acara`);

    const poDeleted = await PurchaseOrder.destroy({ where: { projectId } });
    console.log(`   ✓ Deleted ${poDeleted} purchase orders`);

    const deliveryReceiptsDeleted = await DeliveryReceipt.destroy({
      where: { projectId },
    });
    console.log(`   ✓ Deleted ${deliveryReceiptsDeleted} delivery receipts`);

    // Delete project
    const projectDeleted = await Project.destroy({ where: { id: projectId } });

    if (!projectDeleted) {
      return res.status(404).json({
        success: false,
        error: "Project not found",
      });
    }

    console.log(`✅ Project ${projectId} deleted successfully`);

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
