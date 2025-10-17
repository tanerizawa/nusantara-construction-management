import { ACCOUNT_TYPES, NORMAL_BALANCE_OPTIONS, ACCOUNT_LEVEL_OPTIONS } from './accountTypes';

export const INITIAL_ACCOUNT_FORM = {
  accountCode: '',
  accountName: '',
  accountType: ACCOUNT_TYPES.ASSET,
  accountSubType: '',
  parentAccountId: '',
  subsidiaryId: '', // NEW: Subsidiary assignment
  level: 1,
  normalBalance: 'DEBIT',
  description: '',
  notes: '', // NEW: Added notes field
  constructionSpecific: false,
  projectCostCenter: false,
  vatApplicable: false,
  taxDeductible: false
};

export const ACCOUNT_FORM_FIELDS = [
  {
    name: 'accountCode',
    label: 'Kode Akun',
    type: 'text',
    required: true,
    placeholder: 'e.g., 1103'
  },
  {
    name: 'accountName',
    label: 'Nama Akun',
    type: 'text',
    required: true,
    placeholder: 'e.g., Piutang Lain-lain'
  },
  {
    name: 'accountType',
    label: 'Tipe Akun',
    type: 'select',
    required: true,
    options: [
      { value: ACCOUNT_TYPES.ASSET, label: 'Asset' },
      { value: ACCOUNT_TYPES.LIABILITY, label: 'Kewajiban' },
      { value: ACCOUNT_TYPES.EQUITY, label: 'Ekuitas' },
      { value: ACCOUNT_TYPES.REVENUE, label: 'Pendapatan' },
      { value: ACCOUNT_TYPES.EXPENSE, label: 'Beban' }
    ]
  },
  {
    name: 'accountSubType',
    label: 'Sub Tipe',
    type: 'text',
    required: false,
    placeholder: 'e.g., CURRENT_ASSET'
  },
  {
    name: 'parentAccountId',
    label: 'Parent Account ID',
    type: 'select',
    required: false,
    placeholder: '-- Pilih Parent Account --'
  },
  {
    name: 'subsidiaryId',
    label: 'Subsidiary / Entitas',
    type: 'select',
    required: false,
    placeholder: '-- Pilih Subsidiary (Optional) --',
    description: 'Assign account to specific entity for multi-entity accounting'
  },
  {
    name: 'level',
    label: 'Level',
    type: 'select',
    required: true,
    options: ACCOUNT_LEVEL_OPTIONS
  },
  {
    name: 'normalBalance',
    label: 'Normal Balance',
    type: 'select',
    required: true,
    options: NORMAL_BALANCE_OPTIONS
  },
  {
    name: 'description',
    label: 'Deskripsi',
    type: 'textarea',
    required: false,
    placeholder: 'Jelaskan fungsi akun ini...',
    rows: 3
  },
  {
    name: 'notes',
    label: 'Catatan',
    type: 'textarea',
    required: false,
    placeholder: 'Catatan tambahan (opsional)...',
    rows: 2
  }
];

export const ACCOUNT_FORM_CHECKBOXES = [
  {
    name: 'constructionSpecific',
    label: 'Spesifik Konstruksi'
  },
  {
    name: 'projectCostCenter',
    label: 'Project Cost Center'
  },
  {
    name: 'vatApplicable',
    label: 'VAT Applicable'
  },
  {
    name: 'taxDeductible',
    label: 'Tax Deductible'
  }
];

export const FORM_VALIDATION_RULES = {
  accountCode: {
    required: true,
    minLength: 1,
    maxLength: 20
  },
  accountName: {
    required: true,
    minLength: 1,
    maxLength: 100
  },
  accountType: {
    required: true
  },
  level: {
    required: true,
    min: 1,
    max: 4
  },
  normalBalance: {
    required: true
  }
};