/**
 * User role constants
 */
import { useTranslation } from '../../../i18n';

// Adapting user roles based on i18n roles
export const USER_ROLES = [
  { value: 'admin', label: 'Administrator' },
  { value: 'project_manager', label: 'Manajer Proyek' },
  { value: 'finance_manager', label: 'Manajer Keuangan' },
  { value: 'inventory_manager', label: 'Manajer Inventaris' },
  { value: 'hr_manager', label: 'Manajer SDM' },
  { value: 'supervisor', label: 'Supervisor' }
];

/**
 * User status constants
 */
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  SUSPENDED: 'suspended'
};