import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  DollarSign,
  TrendingDown,
  Users,
  TrendingUp,
  ShoppingCart,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import {
  generateAccountCode,
  smartCreateAccount,
  getAvailableParents
} from '../services/accountService';

/**
 * Account Type Icons
 */
const ACCOUNT_TYPE_ICONS = {
  ASSET: DollarSign,
  LIABILITY: TrendingDown,
  EQUITY: Users,
  REVENUE: TrendingUp,
  EXPENSE: ShoppingCart
};

/**
 * Account Type Descriptions
 */
const ACCOUNT_TYPE_INFO = {
  ASSET: {
    label: 'Aset',
    description: 'Harta yang dimiliki perusahaan (Kas, Bank, Piutang, Persediaan, dll)',
    prefix: '1xxx',
    color: '#30D158'
  },
  LIABILITY: {
    label: 'Kewajiban',
    description: 'Hutang dan kewajiban perusahaan (Hutang Usaha, Hutang Bank, dll)',
    prefix: '2xxx',
    color: '#FF453A'
  },
  EQUITY: {
    label: 'Ekuitas',
    description: 'Modal dan laba ditahan perusahaan',
    prefix: '3xxx',
    color: '#BF5AF2'
  },
  REVENUE: {
    label: 'Pendapatan',
    description: 'Pendapatan dari penjualan jasa konstruksi dan lainnya',
    prefix: '4xxx',
    color: '#0A84FF'
  },
  EXPENSE: {
    label: 'Biaya',
    description: 'Biaya operasional dan biaya langsung proyek',
    prefix: '5xxx',
    color: '#FF9F0A'
  }
};

/**
 * Account Categories by Type
 */
const ACCOUNT_CATEGORIES = {
  ASSET: [
    { code: '11', label: 'Aset Lancar', description: 'Kas, Bank, Piutang, Persediaan' },
    { code: '12', label: 'Aset Tetap', description: 'Tanah, Bangunan, Kendaraan, Peralatan' },
    { code: '13', label: 'Aset Lainnya', description: 'Investasi, Aset Takberwujud' }
  ],
  LIABILITY: [
    { code: '21', label: 'Kewajiban Lancar', description: 'Hutang Usaha, Hutang Gaji, Hutang Pajak' },
    { code: '22', label: 'Kewajiban Jangka Panjang', description: 'Hutang Bank, Obligasi' }
  ],
  EQUITY: [
    { code: '31', label: 'Modal', description: 'Modal Saham, Modal Disetor' },
    { code: '32', label: 'Laba Ditahan', description: 'Laba yang belum dibagikan' }
  ],
  REVENUE: [
    { code: '41', label: 'Pendapatan Usaha', description: 'Pendapatan Konstruksi, Konsultasi' },
    { code: '42', label: 'Pendapatan Lainnya', description: 'Bunga, Keuntungan Penjualan Aset' }
  ],
  EXPENSE: [
    { code: '51', label: 'Biaya Langsung Proyek', description: 'Bahan, Tenaga Kerja, Subkontraktor' },
    { code: '52', label: 'Biaya Operasional', description: 'Gaji, Sewa, Listrik, Telepon' },
    { code: '53', label: 'Biaya Lainnya', description: 'Bunga, Kerugian' }
  ]
};

/**
 * AccountWizard Component
 * 3-Step wizard for creating accounts semi-automatically
 */
const AccountWizard = ({ onComplete, onCancel, subsidiaryId }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Wizard data
  const [wizardData, setWizardData] = useState({
    // Step 1: Account Type
    accountType: null,
    
    // Step 2: Category
    category: null,
    parentAccount: null,
    level: 3, // Default to level 3 (postable)
    
    // Step 3: Details
    accountName: '',
    description: '',
    openingBalance: 0
  });

  // Available parent accounts
  const [availableParents, setAvailableParents] = useState([]);
  const [generatedCode, setGeneratedCode] = useState(null);

  /**
   * Load available parent accounts when type and level are selected
   */
  useEffect(() => {
    if (wizardData.accountType && wizardData.level > 1 && currentStep === 2) {
      loadAvailableParents();
    }
  }, [wizardData.accountType, wizardData.level, currentStep]);

  /**
   * Generate code preview when category is selected
   */
  useEffect(() => {
    if (wizardData.category && wizardData.parentAccount && currentStep === 3) {
      previewAccountCode();
    }
  }, [wizardData.category, wizardData.parentAccount, currentStep]);

  /**
   * Load available parent accounts
   */
  const loadAvailableParents = async () => {
    try {
      const result = await getAvailableParents(
        wizardData.accountType,
        wizardData.level
      );
      
      if (result.success) {
        setAvailableParents(result.data);
      }
    } catch (err) {
      console.error('Error loading parents:', err);
    }
  };

  /**
   * Preview account code
   */
  const previewAccountCode = async () => {
    try {
      const result = await generateAccountCode({
        accountType: wizardData.accountType,
        parentId: wizardData.parentAccount,
        level: wizardData.level
      });
      
      if (result.success) {
        setGeneratedCode(result.data);
      }
    } catch (err) {
      console.error('Error generating code:', err);
    }
  };

  /**
   * Handle account type selection
   */
  const handleTypeSelect = (type) => {
    setWizardData({
      ...wizardData,
      accountType: type,
      category: null,
      parentAccount: null
    });
    setError(null);
  };

  /**
   * Handle category selection
   */
  const handleCategorySelect = (category) => {
    setWizardData({
      ...wizardData,
      category: category.code,
      parentAccount: null
    });
    setError(null);
  };

  /**
   * Handle parent account selection
   */
  const handleParentSelect = (parentId) => {
    setWizardData({
      ...wizardData,
      parentAccount: parentId
    });
    setError(null);
  };

  /**
   * Handle next step
   */
  const handleNext = () => {
    // Validation
    if (currentStep === 1 && !wizardData.accountType) {
      setError('Pilih jenis akun terlebih dahulu');
      return;
    }
    
    if (currentStep === 2 && !wizardData.category) {
      setError('Pilih kategori akun terlebih dahulu');
      return;
    }
    
    if (currentStep === 2 && wizardData.level > 1 && !wizardData.parentAccount) {
      setError('Pilih akun induk terlebih dahulu');
      return;
    }

    setError(null);
    setCurrentStep(currentStep + 1);
  };

  /**
   * Handle previous step
   */
  const handlePrevious = () => {
    setError(null);
    setCurrentStep(currentStep - 1);
  };

  /**
   * Handle form submit
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!wizardData.accountName.trim()) {
      setError('Nama akun harus diisi');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await smartCreateAccount({
        accountName: wizardData.accountName.trim(),
        accountType: wizardData.accountType,
        parentId: wizardData.parentAccount,
        level: wizardData.level,
        openingBalance: parseFloat(wizardData.openingBalance) || 0,
        subsidiaryId: subsidiaryId,
        description: wizardData.description.trim() || null
      });

      if (result.success) {
        onComplete(result.data);
      } else {
        setError(result.error || 'Gagal membuat akun');
      }
    } catch (err) {
      console.error('Error creating account:', err);
      setError('Terjadi kesalahan saat membuat akun');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Render Step 1: Account Type Selection
   */
  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2" style={{ color: '#FFFFFF' }}>
          Pilih Jenis Akun
        </h3>
        <p className="text-sm" style={{ color: '#98989D' }}>
          Pilih jenis akun yang akan dibuat sesuai standar PSAK
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(ACCOUNT_TYPE_INFO).map(([type, info]) => {
          const Icon = ACCOUNT_TYPE_ICONS[type];
          const isSelected = wizardData.accountType === type;
          
          return (
            <button
              key={type}
              onClick={() => handleTypeSelect(type)}
              className="p-4 rounded-lg border-2 transition-all text-left"
              style={{
                backgroundColor: isSelected ? `${info.color}20` : '#2C2C2E',
                borderColor: isSelected ? info.color : '#38383A',
                cursor: 'pointer'
              }}
            >
              <div className="flex items-start space-x-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${info.color}30` }}
                >
                  <Icon className="w-6 h-6" style={{ color: info.color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold" style={{ color: '#FFFFFF' }}>
                      {info.label}
                    </h4>
                    <span
                      className="text-xs px-2 py-1 rounded"
                      style={{
                        backgroundColor: `${info.color}20`,
                        color: info.color
                      }}
                    >
                      {info.prefix}
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: '#98989D' }}>
                    {info.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  /**
   * Render Step 2: Category Selection
   */
  const renderStep2 = () => {
    const categories = ACCOUNT_CATEGORIES[wizardData.accountType] || [];
    const typeInfo = ACCOUNT_TYPE_INFO[wizardData.accountType];

    return (
      <div className="space-y-4">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold mb-2" style={{ color: '#FFFFFF' }}>
            Pilih Kategori {typeInfo.label}
          </h3>
          <p className="text-sm" style={{ color: '#98989D' }}>
            Pilih kategori spesifik untuk akun {typeInfo.label.toLowerCase()}
          </p>
        </div>

        <div className="space-y-3">
          {categories.map((category) => {
            const isSelected = wizardData.category === category.code;
            
            return (
              <button
                key={category.code}
                onClick={() => handleCategorySelect(category)}
                className="w-full p-4 rounded-lg border-2 transition-all text-left"
                style={{
                  backgroundColor: isSelected ? `${typeInfo.color}20` : '#2C2C2E',
                  borderColor: isSelected ? typeInfo.color : '#38383A',
                  cursor: 'pointer'
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold" style={{ color: '#FFFFFF' }}>
                    {category.label}
                  </h4>
                  <span
                    className="text-xs px-2 py-1 rounded font-mono"
                    style={{
                      backgroundColor: `${typeInfo.color}20`,
                      color: typeInfo.color
                    }}
                  >
                    {category.code}xx
                  </span>
                </div>
                <p className="text-sm" style={{ color: '#98989D' }}>
                  {category.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Parent Account Selection (if level > 1) */}
        {wizardData.category && wizardData.level > 1 && (
          <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#1C1C1E' }}>
            <label className="block text-sm font-medium mb-2" style={{ color: '#FFFFFF' }}>
              Pilih Akun Induk
            </label>
            <select
              value={wizardData.parentAccount || ''}
              onChange={(e) => handleParentSelect(e.target.value)}
              className="w-full px-3 py-2 rounded-lg"
              style={{
                backgroundColor: '#2C2C2E',
                color: '#FFFFFF',
                border: '1px solid #38383A'
              }}
            >
              <option value="">-- Pilih Akun Induk --</option>
              {availableParents.map((parent) => (
                <option key={parent.id} value={parent.id}>
                  {parent.accountCode} - {parent.accountName}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    );
  };

  /**
   * Render Step 3: Account Details
   */
  const renderStep3 = () => {
    const typeInfo = ACCOUNT_TYPE_INFO[wizardData.accountType];

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold mb-2" style={{ color: '#FFFFFF' }}>
            Detail Akun
          </h3>
          <p className="text-sm" style={{ color: '#98989D' }}>
            Lengkapi informasi akun yang akan dibuat
          </p>
        </div>

        {/* Code Preview */}
        {generatedCode && (
          <div className="p-4 rounded-lg flex items-center space-x-3" style={{ backgroundColor: `${typeInfo.color}20` }}>
            <Sparkles className="w-5 h-5" style={{ color: typeInfo.color }} />
            <div>
              <p className="text-xs font-medium" style={{ color: '#98989D' }}>
                Kode Akun Otomatis
              </p>
              <p className="text-lg font-mono font-bold" style={{ color: typeInfo.color }}>
                {generatedCode.suggestedCode}
              </p>
            </div>
          </div>
        )}

        {/* Account Name */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#FFFFFF' }}>
            Nama Akun <span style={{ color: '#FF453A' }}>*</span>
          </label>
          <input
            type="text"
            value={wizardData.accountName}
            onChange={(e) => setWizardData({ ...wizardData, accountName: e.target.value })}
            placeholder="Contoh: Kas Kecil Proyek"
            className="w-full px-3 py-2 rounded-lg"
            style={{
              backgroundColor: '#2C2C2E',
              color: '#FFFFFF',
              border: '1px solid #38383A'
            }}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#FFFFFF' }}>
            Deskripsi (Opsional)
          </label>
          <textarea
            value={wizardData.description}
            onChange={(e) => setWizardData({ ...wizardData, description: e.target.value })}
            placeholder="Deskripsi tambahan untuk akun ini"
            rows={3}
            className="w-full px-3 py-2 rounded-lg"
            style={{
              backgroundColor: '#2C2C2E',
              color: '#FFFFFF',
              border: '1px solid #38383A'
            }}
          />
        </div>

        {/* Opening Balance */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#FFFFFF' }}>
            Saldo Awal
          </label>
          <input
            type="number"
            value={wizardData.openingBalance}
            onChange={(e) => setWizardData({ ...wizardData, openingBalance: e.target.value })}
            placeholder="0"
            step="0.01"
            className="w-full px-3 py-2 rounded-lg"
            style={{
              backgroundColor: '#2C2C2E',
              color: '#FFFFFF',
              border: '1px solid #38383A'
            }}
          />
        </div>

        {/* Summary */}
        <div className="p-4 rounded-lg" style={{ backgroundColor: '#1C1C1E' }}>
          <h4 className="text-sm font-semibold mb-2" style={{ color: '#FFFFFF' }}>
            Ringkasan
          </h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span style={{ color: '#98989D' }}>Jenis:</span>
              <span style={{ color: '#FFFFFF' }}>{typeInfo.label}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: '#98989D' }}>Kategori:</span>
              <span style={{ color: '#FFFFFF' }}>
                {ACCOUNT_CATEGORIES[wizardData.accountType]?.find(c => c.code === wizardData.category)?.label}
              </span>
            </div>
            {generatedCode && (
              <>
                <div className="flex justify-between">
                  <span style={{ color: '#98989D' }}>Saldo Normal:</span>
                  <span style={{ color: '#FFFFFF' }}>
                    {generatedCode.suggestedProperties?.normalBalance}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#98989D' }}>Level:</span>
                  <span style={{ color: '#FFFFFF' }}>{wizardData.level}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </form>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
    >
      <div
        className="w-full max-w-3xl rounded-lg shadow-xl overflow-hidden"
        style={{ backgroundColor: '#1C1C1E' }}
      >
        {/* Header */}
        <div className="p-6 border-b" style={{ borderColor: '#38383A' }}>
          <h2 className="text-2xl font-bold" style={{ color: '#FFFFFF' }}>
            Buat Akun Baru
          </h2>
          
          {/* Step Indicator */}
          <div className="flex items-center justify-between mt-4">
            {[1, 2, 3].map((step) => (
              <React.Fragment key={step}>
                <div className="flex items-center">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
                    style={{
                      backgroundColor: currentStep >= step ? '#0A84FF' : '#2C2C2E',
                      color: currentStep >= step ? '#FFFFFF' : '#98989D'
                    }}
                  >
                    {currentStep > step ? <Check className="w-5 h-5" /> : step}
                  </div>
                  <span
                    className="ml-2 text-sm font-medium hidden md:block"
                    style={{ color: currentStep >= step ? '#FFFFFF' : '#98989D' }}
                  >
                    {step === 1 ? 'Jenis' : step === 2 ? 'Kategori' : 'Detail'}
                  </span>
                </div>
                {step < 3 && (
                  <div
                    className="flex-1 h-1 mx-2"
                    style={{
                      backgroundColor: currentStep > step ? '#0A84FF' : '#2C2C2E'
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {error && (
            <div
              className="mb-4 p-3 rounded-lg flex items-center space-x-2"
              style={{ backgroundColor: '#FF453A20', border: '1px solid #FF453A' }}
            >
              <AlertCircle className="w-5 h-5" style={{ color: '#FF453A' }} />
              <span className="text-sm" style={{ color: '#FF453A' }}>
                {error}
              </span>
            </div>
          )}

          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>

        {/* Footer */}
        <div
          className="p-6 border-t flex justify-between"
          style={{ borderColor: '#38383A' }}
        >
          <button
            onClick={currentStep === 1 ? onCancel : handlePrevious}
            className="px-4 py-2 rounded-lg flex items-center space-x-2"
            style={{
              backgroundColor: '#2C2C2E',
              color: '#FFFFFF'
            }}
            disabled={loading}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{currentStep === 1 ? 'Batal' : 'Kembali'}</span>
          </button>

          <button
            onClick={currentStep === 3 ? handleSubmit : handleNext}
            className="px-4 py-2 rounded-lg flex items-center space-x-2"
            style={{
              background: 'linear-gradient(135deg, #0A84FF 0%, #0066CC 100%)',
              color: '#FFFFFF'
            }}
            disabled={loading}
          >
            <span>{currentStep === 3 ? (loading ? 'Membuat...' : 'Buat Akun') : 'Lanjut'}</span>
            {currentStep < 3 && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountWizard;
