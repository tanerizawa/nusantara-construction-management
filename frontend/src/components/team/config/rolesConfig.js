// Team roles configuration
export const TEAM_ROLES = {
  'Project Manager': { color: 'blue', count: 0 },
  'Civil Engineer': { color: 'green', count: 0 },
  'Electrical Engineer': { color: 'yellow', count: 0 },
  'Safety Officer': { color: 'red', count: 0 },
  'Site Supervisor': { color: 'purple', count: 0 },
  'Quality Controller': { color: 'indigo', count: 0 }
};

export const TEAM_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive'
};

export const STATUS_CONFIG = {
  active: {
    label: 'Aktif',
    className: 'bg-green-100 text-green-800'
  },
  inactive: {
    label: 'Tidak Aktif',
    className: 'bg-gray-100 text-gray-800'
  }
};
