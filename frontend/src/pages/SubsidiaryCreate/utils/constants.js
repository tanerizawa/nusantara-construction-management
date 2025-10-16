/**
 * Constants for SubsidiaryCreate
 */

// Specialization options
export const SPECIALIZATIONS = [
  { value: 'residential', label: 'Perumahan' },
  { value: 'commercial', label: 'Komersial' },
  { value: 'industrial', label: 'Industri' },
  { value: 'infrastructure', label: 'Infrastruktur' },
  { value: 'renovation', label: 'Renovasi' },
  { value: 'interior', label: 'Interior' },
  { value: 'landscaping', label: 'Lansekap' },
  { value: 'general', label: 'Umum' }
];

// Default form state
export const DEFAULT_FORM_STATE = {
  name: '',
  code: '',
  specialization: '',
  description: '',
  establishedYear: '',
  employeeCount: '',
  registrationNumber: '',
  taxNumber: '',
  status: 'active',
  address: {
    street: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'Indonesia'
  },
  contactInfo: {
    phone: '',
    email: '',
    website: '',
    fax: ''
  },
  legalInfo: {
    directorName: '',
    commissionerName: '',
    notaryName: '',
    notaryNumber: '',
    notaryDate: ''
  },
  financialInfo: {
    paidUpCapital: '',
    authorizedCapital: '',
    bankName: '',
    bankAccount: ''
  }
};