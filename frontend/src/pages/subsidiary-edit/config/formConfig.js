// Configuration for subsidiary edit form
export const formConfig = {
  tabs: [
    { id: 'basic', label: 'Informasi Dasar', icon: 'Building' },
    { id: 'legal', label: 'Informasi Legal', icon: 'Shield' },
    { id: 'financial', label: 'Informasi Keuangan', icon: 'DollarSign' },
    { id: 'governance', label: 'Tata Kelola', icon: 'Users' }
  ],
  
  specializations: [
    { value: 'general', label: 'General Construction' },
    { value: 'residential', label: 'Residential' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'infrastructure', label: 'Infrastructure' },
    { value: 'industrial', label: 'Industrial' }
  ],
  
  statuses: [
    { value: 'active', label: 'Aktif' },
    { value: 'inactive', label: 'Tidak Aktif' },
    { value: 'suspended', label: 'Ditangguhkan' }
  ],
  
  currencies: [
    { value: 'IDR', label: 'Indonesian Rupiah (IDR)' },
    { value: 'USD', label: 'US Dollar (USD)' },
    { value: 'EUR', label: 'Euro (EUR)' }
  ],
  
  companySizes: [
    { value: 'small', label: 'Small (1-50 employees)' },
    { value: 'medium', label: 'Medium (51-250 employees)' },
    { value: 'large', label: 'Large (251+ employees)' }
  ],
  
  countries: [
    { value: 'Indonesia', label: 'Indonesia' },
    { value: 'Malaysia', label: 'Malaysia' },
    { value: 'Singapore', label: 'Singapore' },
    { value: 'Thailand', label: 'Thailand' }
  ]
};

export const getInitialFormData = () => ({
  name: '',
  code: '',
  description: '',
  specialization: 'general',
  status: 'active',
  parentCompany: 'PT Nusantara Construction Group',
  establishedYear: '',
  employeeCount: '',
  contactInfo: {
    phone: '',
    email: ''
  },
  address: {
    street: '',
    city: '',
    country: 'Indonesia'
  },
  certification: [],
  boardOfDirectors: [],
  legalInfo: {
    companyRegistrationNumber: '',
    taxIdentificationNumber: '',
    businessLicenseNumber: '',
    articlesOfIncorporation: '',
    vatRegistrationNumber: ''
  },
  permits: [],
  financialInfo: {
    authorizedCapital: '',
    paidUpCapital: '',
    currency: 'IDR',
    fiscalYearEnd: ''
  },
  profileInfo: {
    website: '',
    socialMedia: {},
    companySize: '',
    industryClassification: '',
    businessDescription: ''
  },
  attachments: []
});

export const getInitialDirector = () => ({
  name: '',
  position: '',
  email: '',
  phone: '',
  appointmentDate: '',
  isActive: true
});

export const getInitialPermit = () => ({
  name: '',
  number: '',
  issuedBy: '',
  issuedDate: '',
  expiryDate: '',
  status: 'active'
});