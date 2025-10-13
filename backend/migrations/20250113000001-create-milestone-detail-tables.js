/**
 * Migration: Create Milestone Detail Tables
 * 
 * Creates tables for:
 * - milestone_photos: Photo documentation with timeline
 * - milestone_costs: Cost tracking and budget management
 * - milestone_activities: Activity log and timeline
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Milestone Photos Table
    await queryInterface.createTable('milestone_photos', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      milestone_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'project_milestones',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      photo_url: {
        type: Sequelize.STRING(500),
        allowNull: false
      },
      photo_type: {
        type: Sequelize.ENUM('progress', 'issue', 'inspection', 'quality', 'before', 'after', 'general'),
        defaultValue: 'progress'
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      taken_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      uploaded_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      location_lat: {
        type: Sequelize.DECIMAL(10, 8),
        allowNull: true
      },
      location_lng: {
        type: Sequelize.DECIMAL(11, 8),
        allowNull: true
      },
      weather_condition: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      metadata: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: {}
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // 2. Milestone Costs Table
    await queryInterface.createTable('milestone_costs', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      milestone_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'project_milestones',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      cost_category: {
        type: Sequelize.ENUM('materials', 'labor', 'equipment', 'subcontractor', 'contingency', 'indirect', 'other'),
        allowNull: false
      },
      cost_type: {
        type: Sequelize.ENUM('planned', 'actual', 'change_order', 'unforeseen'),
        defaultValue: 'actual'
      },
      amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      reference_number: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'PO number, invoice number, etc.'
      },
      recorded_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      recorded_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      approved_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      approved_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      metadata: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: {}
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // 3. Milestone Activities Table
    await queryInterface.createTable('milestone_activities', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      milestone_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'project_milestones',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      activity_type: {
        type: Sequelize.ENUM(
          'created',
          'updated',
          'status_change',
          'progress_update',
          'photo_upload',
          'cost_added',
          'cost_updated',
          'issue_reported',
          'issue_resolved',
          'approved',
          'rejected',
          'comment',
          'other'
        ),
        allowNull: false
      },
      activity_title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      activity_description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      performed_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      performed_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      metadata: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: {},
        comment: 'Store old/new values, photo IDs, cost IDs, etc.'
      },
      related_photo_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'milestone_photos',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      related_cost_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'milestone_costs',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add indexes for better performance
    await queryInterface.addIndex('milestone_photos', ['milestone_id']);
    await queryInterface.addIndex('milestone_photos', ['photo_type']);
    await queryInterface.addIndex('milestone_photos', ['taken_at']);
    await queryInterface.addIndex('milestone_photos', ['uploaded_by']);

    await queryInterface.addIndex('milestone_costs', ['milestone_id']);
    await queryInterface.addIndex('milestone_costs', ['cost_category']);
    await queryInterface.addIndex('milestone_costs', ['cost_type']);
    await queryInterface.addIndex('milestone_costs', ['recorded_at']);

    await queryInterface.addIndex('milestone_activities', ['milestone_id']);
    await queryInterface.addIndex('milestone_activities', ['activity_type']);
    await queryInterface.addIndex('milestone_activities', ['performed_at']);
    await queryInterface.addIndex('milestone_activities', ['performed_by']);
  },

  down: async (queryInterface, Sequelize) => {
    // Drop tables in reverse order (due to foreign keys)
    await queryInterface.dropTable('milestone_activities');
    await queryInterface.dropTable('milestone_costs');
    await queryInterface.dropTable('milestone_photos');

    // Drop ENUM types
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_milestone_photos_photo_type"');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_milestone_costs_cost_category"');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_milestone_costs_cost_type"');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_milestone_activities_activity_type"');
  }
};
