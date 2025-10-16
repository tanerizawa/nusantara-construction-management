/**
 * Constants and initial values for Manpower module
 */

// Departments list
export const DEPARTMENTS = [
  'Construction', 'Engineering', 'Project Management', 'Finance',
  'Human Resources', 'Safety & HSE', 'Quality Control', 'Administration'
];

// Positions list
export const POSITIONS = [
  'Project Manager', 'Site Manager', 'Civil Engineer', 'Mechanical Engineer',
  'Electrical Engineer', 'Architect', 'Quantity Surveyor', 'Safety Officer',
  'Foreman', 'Site Supervisor', 'Admin Staff', 'HR Staff'
];

// Initial form data
export const INITIAL_FORM_DATA = {
  employeeId: '',
  name: '',
  position: '',
  department: '',
  email: '',
  phone: '',
  joinDate: new Date().toISOString().split('T')[0],
  birthDate: '',
  employmentType: 'permanent',
  status: 'active',
  salary: ''
};