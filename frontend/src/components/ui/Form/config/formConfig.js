// Form Configuration
export const FORM_CONFIG = {
  // Size variants
  sizes: {
    sm: {
      classes: 'px-3 py-2 text-sm',
      iconSize: 16,
      spacing: 'space-y-3'
    },
    md: {
      classes: 'px-4 py-3 text-base',
      iconSize: 20,
      spacing: 'space-y-4'
    },
    lg: {
      classes: 'px-5 py-4 text-lg',
      iconSize: 24,
      spacing: 'space-y-5'
    }
  },

  // Visual variants
  variants: {
    default: {
      classes: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
      bgColor: 'bg-white'
    },
    minimal: {
      classes: 'border-0 border-b-2 border-gray-300 focus:border-blue-500 rounded-none bg-transparent',
      bgColor: 'bg-transparent'
    },
    filled: {
      classes: 'border-transparent bg-gray-100 focus:bg-white focus:border-blue-500 focus:ring-blue-500',
      bgColor: 'bg-gray-100 focus:bg-white'
    },
    outlined: {
      classes: 'border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500',
      bgColor: 'bg-white'
    }
  },

  // State classes
  states: {
    default: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
    error: 'border-red-500 focus:border-red-500 focus:ring-red-500',
    success: 'border-green-500 focus:border-green-500 focus:ring-green-500',
    warning: 'border-yellow-500 focus:border-yellow-500 focus:ring-yellow-500',
    disabled: 'bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200'
  },

  // Animation and transition
  transitions: {
    all: 'transition-all duration-200',
    colors: 'transition-colors duration-200',
    transform: 'transition-transform duration-200'
  },

  // Common classes
  common: {
    focus: 'focus:outline-none focus:ring-2 focus:ring-opacity-20',
    placeholder: 'placeholder:text-gray-400',
    rounded: 'rounded-lg',
    width: 'w-full'
  }
};

// Input type configurations
export const INPUT_TYPES = {
  text: {
    type: 'text',
    autoComplete: 'off',
    spellCheck: false
  },
  email: {
    type: 'email',
    autoComplete: 'email',
    pattern: '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$'
  },
  password: {
    type: 'password',
    autoComplete: 'current-password',
    minLength: 8
  },
  tel: {
    type: 'tel',
    autoComplete: 'tel',
    pattern: '[0-9\\s\\-\\+\\(\\)]+'
  },
  url: {
    type: 'url',
    autoComplete: 'url',
    pattern: 'https?://.*'
  },
  number: {
    type: 'number',
    autoComplete: 'off',
    inputMode: 'numeric'
  },
  search: {
    type: 'search',
    autoComplete: 'off',
    spellCheck: false
  },
  date: {
    type: 'date',
    autoComplete: 'bday'
  },
  time: {
    type: 'time',
    autoComplete: 'off'
  },
  datetime: {
    type: 'datetime-local',
    autoComplete: 'off'
  }
};

// Textarea configurations
export const TEXTAREA_CONFIG = {
  resize: {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize'
  },
  defaultRows: 4,
  maxRows: 20
};

// Select configurations
export const SELECT_CONFIG = {
  placeholder: 'Pilih opsi...',
  noOptionsMessage: 'Tidak ada opsi tersedia',
  loadingMessage: 'Memuat...',
  searchPlaceholder: 'Cari...'
};

// Checkbox and Radio configurations
export const CHOICE_CONFIG = {
  sizes: {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  },
  colors: {
    blue: 'text-blue-600 focus:ring-blue-500',
    green: 'text-green-600 focus:ring-green-500',
    red: 'text-red-600 focus:ring-red-500',
    yellow: 'text-yellow-600 focus:ring-yellow-500',
    purple: 'text-purple-600 focus:ring-purple-500'
  }
};

// File upload configurations
export const FILE_CONFIG = {
  maxSize: 10 * 1024 * 1024, // 10MB
  acceptedTypes: {
    image: 'image/*',
    document: '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx',
    archive: '.zip,.rar,.7z',
    any: '*/*'
  },
  previewTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  messages: {
    dragActive: 'Lepaskan file di sini...',
    dragInactive: 'Drag & drop file atau klik untuk memilih',
    fileTooLarge: 'File terlalu besar',
    invalidType: 'Tipe file tidak didukung',
    uploadSuccess: 'File berhasil diupload',
    uploadError: 'Gagal mengupload file'
  }
};

// Password strength configuration
export const PASSWORD_STRENGTH = {
  minLength: 8,
  rules: {
    minLength: { weight: 1, message: 'Minimal 8 karakter' },
    hasLower: { weight: 1, message: 'Harus ada huruf kecil' },
    hasUpper: { weight: 1, message: 'Harus ada huruf besar' },
    hasNumber: { weight: 1, message: 'Harus ada angka' },
    hasSymbol: { weight: 1, message: 'Harus ada simbol' }
  },
  levels: {
    0: { label: 'Sangat Lemah', color: 'bg-red-500', textColor: 'text-red-600' },
    1: { label: 'Lemah', color: 'bg-red-400', textColor: 'text-red-600' },
    2: { label: 'Cukup', color: 'bg-yellow-400', textColor: 'text-yellow-600' },
    3: { label: 'Baik', color: 'bg-yellow-500', textColor: 'text-yellow-600' },
    4: { label: 'Kuat', color: 'bg-green-400', textColor: 'text-green-600' },
    5: { label: 'Sangat Kuat', color: 'bg-green-500', textColor: 'text-green-600' }
  }
};

// Validation messages
export const VALIDATION_MESSAGES = {
  required: 'Field ini wajib diisi',
  email: 'Format email tidak valid',
  minLength: (min) => `Minimal ${min} karakter`,
  maxLength: (max) => `Maksimal ${max} karakter`,
  pattern: 'Format tidak sesuai',
  min: (min) => `Nilai minimal ${min}`,
  max: (max) => `Nilai maksimal ${max}`,
  url: 'URL tidak valid',
  phone: 'Nomor telepon tidak valid',
  date: 'Tanggal tidak valid',
  time: 'Waktu tidak valid',
  number: 'Harus berupa angka',
  integer: 'Harus berupa bilangan bulat',
  positive: 'Harus berupa angka positif',
  negative: 'Harus berupa angka negatif'
};