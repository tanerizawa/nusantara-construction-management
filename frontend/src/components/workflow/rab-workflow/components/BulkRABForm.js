import React, { useState, useRef } from 'react';
import { Plus, Trash2, Save, FileText, X, Info, Upload, Download, AlertTriangle } from 'lucide-react';
import * as XLSX from 'xlsx';
import { RAB_CATEGORIES, RAB_ITEM_TYPES, getItemTypeConfig } from '../config/rabCategories';
import { formatCurrency } from '../../../../utils/formatters';
import { validateRABForm, isFormValid } from '../utils/rabValidation';

/**
 * BulkRABForm Component
 * Enhanced form for adding multiple RAP items with Excel import/export functionality
 */
const BulkRABForm = ({ 
  onSubmit, 
  onSaveDraft,
  onCancel,
  draftItems = []
}) => {
  const [items, setItems] = useState(draftItems.length > 0 ? draftItems : [createEmptyItem()]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [errors, setErrors] = useState({});
  const [importError, setImportError] = useState('');
  const fileInputRef = useRef(null);

  function createEmptyItem() {
    return {
      id: Date.now() + Math.random(),
      category: '',
      description: '',
      unit: '',
      quantity: 0,
      unitPrice: 0,
      specifications: '',
      itemType: 'material',
      supplier: '',
      laborCategory: '',
      serviceScope: ''
    };
  }

  const getTemplateData = () => {
    return [
      // PEKERJAAN PERSIAPAN
      {
        'Tipe': 'labor',
        'Kategori': 'Pekerjaan Persiapan',
        'Deskripsi': 'Pembersihan Lahan',
        'Unit': 'm²',
        'Qty': 200,
        'Harga Unit': 15000
      },
      {
        'Tipe': 'material',
        'Kategori': 'Pekerjaan Persiapan',
        'Deskripsi': 'Papan Kayu untuk Bouwplank',
        'Unit': 'm³',
        'Qty': 0.5,
        'Harga Unit': 3500000
      },
      {
        'Tipe': 'labor',
        'Kategori': 'Pekerjaan Persiapan',
        'Deskripsi': 'Pemasangan Bouwplank',
        'Unit': 'm',
        'Qty': 50,
        'Harga Unit': 25000
      },
      
      // PEKERJAAN TANAH
      {
        'Tipe': 'labor',
        'Kategori': 'Pekerjaan Tanah',
        'Deskripsi': 'Galian Tanah Pondasi',
        'Unit': 'm³',
        'Qty': 30,
        'Harga Unit': 85000
      },
      {
        'Tipe': 'labor',
        'Kategori': 'Pekerjaan Tanah',
        'Deskripsi': 'Urugan Tanah Kembali',
        'Unit': 'm³',
        'Qty': 15,
        'Harga Unit': 75000
      },
      
      // PEKERJAAN PONDASI
      {
        'Tipe': 'material',
        'Kategori': 'Pekerjaan Pondasi',
        'Deskripsi': 'Pasir Beton',
        'Unit': 'm³',
        'Qty': 10,
        'Harga Unit': 350000
      },
      {
        'Tipe': 'material',
        'Kategori': 'Pekerjaan Pondasi',
        'Deskripsi': 'Batu Kali/Gunung',
        'Unit': 'm³',
        'Qty': 20,
        'Harga Unit': 450000
      },
      {
        'Tipe': 'material',
        'Kategori': 'Pekerjaan Pondasi',
        'Deskripsi': 'Semen Portland PC 40kg',
        'Unit': 'sak',
        'Qty': 150,
        'Harga Unit': 65000
      },
      {
        'Tipe': 'labor',
        'Kategori': 'Pekerjaan Pondasi',
        'Deskripsi': 'Pasang Pondasi Batu Kali',
        'Unit': 'm³',
        'Qty': 20,
        'Harga Unit': 450000
      },
      
      // PEKERJAAN STRUKTUR
      {
        'Tipe': 'material',
        'Kategori': 'Pekerjaan Struktur',
        'Deskripsi': 'Besi Beton Polos 8mm',
        'Unit': 'kg',
        'Qty': 500,
        'Harga Unit': 14000
      },
      {
        'Tipe': 'material',
        'Kategori': 'Pekerjaan Struktur',
        'Deskripsi': 'Besi Beton Ulir 12mm',
        'Unit': 'kg',
        'Qty': 800,
        'Harga Unit': 14500
      },
      {
        'Tipe': 'material',
        'Kategori': 'Pekerjaan Struktur',
        'Deskripsi': 'Kawat Beton',
        'Unit': 'kg',
        'Qty': 25,
        'Harga Unit': 22000
      },
      {
        'Tipe': 'material',
        'Kategori': 'Pekerjaan Struktur',
        'Deskripsi': 'Multiplek 9mm',
        'Unit': 'lembar',
        'Qty': 40,
        'Harga Unit': 185000
      },
      {
        'Tipe': 'labor',
        'Kategori': 'Pekerjaan Struktur',
        'Deskripsi': 'Bekisting Kolom',
        'Unit': 'm²',
        'Qty': 60,
        'Harga Unit': 125000
      },
      {
        'Tipe': 'labor',
        'Kategori': 'Pekerjaan Struktur',
        'Deskripsi': 'Pengecoran Beton K-225',
        'Unit': 'm³',
        'Qty': 25,
        'Harga Unit': 950000
      },
      
      // PEKERJAAN DINDING
      {
        'Tipe': 'material',
        'Kategori': 'Pekerjaan Dinding',
        'Deskripsi': 'Bata Merah Press',
        'Unit': 'bh',
        'Qty': 8000,
        'Harga Unit': 800
      },
      {
        'Tipe': 'labor',
        'Kategori': 'Pekerjaan Dinding',
        'Deskripsi': 'Pasang Dinding Bata 1/2 Batu',
        'Unit': 'm²',
        'Qty': 150,
        'Harga Unit': 85000
      },
      {
        'Tipe': 'service',
        'Kategori': 'Pekerjaan Dinding',
        'Deskripsi': 'Plester + Acian Dinding',
        'Unit': 'm²',
        'Qty': 300,
        'Harga Unit': 45000
      },
      
      // PEKERJAAN ATAP
      {
        'Tipe': 'material',
        'Kategori': 'Pekerjaan Atap',
        'Deskripsi': 'Rangka Atap Baja Ringan',
        'Unit': 'm²',
        'Qty': 120,
        'Harga Unit': 125000
      },
      {
        'Tipe': 'material',
        'Kategori': 'Pekerjaan Atap',
        'Deskripsi': 'Genteng Metal Pasir',
        'Unit': 'm²',
        'Qty': 125,
        'Harga Unit': 95000
      },
      {
        'Tipe': 'labor',
        'Kategori': 'Pekerjaan Atap',
        'Deskripsi': 'Pemasangan Rangka + Genteng',
        'Unit': 'm²',
        'Qty': 120,
        'Harga Unit': 75000
      },
      
      // PEKERJAAN PLAFON
      {
        'Tipe': 'material',
        'Kategori': 'Pekerjaan Plafon',
        'Deskripsi': 'Gypsum Board 9mm',
        'Unit': 'lembar',
        'Qty': 80,
        'Harga Unit': 45000
      },
      {
        'Tipe': 'material',
        'Kategori': 'Pekerjaan Plafon',
        'Deskripsi': 'Rangka Hollow Galvanis',
        'Unit': 'batang',
        'Qty': 60,
        'Harga Unit': 35000
      },
      {
        'Tipe': 'labor',
        'Kategori': 'Pekerjaan Plafon',
        'Deskripsi': 'Pasang Plafon Gypsum',
        'Unit': 'm²',
        'Qty': 100,
        'Harga Unit': 65000
      },
      
      // PEKERJAAN LANTAI
      {
        'Tipe': 'material',
        'Kategori': 'Pekerjaan Lantai',
        'Deskripsi': 'Keramik 40x40 cm',
        'Unit': 'm²',
        'Qty': 100,
        'Harga Unit': 85000
      },
      {
        'Tipe': 'material',
        'Kategori': 'Pekerjaan Lantai',
        'Deskripsi': 'Semen Instan untuk Nat',
        'Unit': 'sak',
        'Qty': 10,
        'Harga Unit': 45000
      },
      {
        'Tipe': 'labor',
        'Kategori': 'Pekerjaan Lantai',
        'Deskripsi': 'Pasang Keramik Lantai',
        'Unit': 'm²',
        'Qty': 100,
        'Harga Unit': 75000
      },
      
      // PEKERJAAN FINISHING
      {
        'Tipe': 'material',
        'Kategori': 'Pekerjaan Finishing',
        'Deskripsi': 'Cat Tembok Interior Avian',
        'Unit': 'kg',
        'Qty': 60,
        'Harga Unit': 85000
      },
      {
        'Tipe': 'material',
        'Kategori': 'Pekerjaan Finishing',
        'Deskripsi': 'Cat Tembok Eksterior Weathershield',
        'Unit': 'kg',
        'Qty': 40,
        'Harga Unit': 125000
      },
      {
        'Tipe': 'service',
        'Kategori': 'Pekerjaan Finishing',
        'Deskripsi': 'Jasa Pengecatan Dinding',
        'Unit': 'm²',
        'Qty': 300,
        'Harga Unit': 25000
      },
      
      // PEKERJAAN SANITASI
      {
        'Tipe': 'material',
        'Kategori': 'Pekerjaan Sanitasi',
        'Deskripsi': 'Kloset Duduk + Tangki',
        'Unit': 'set',
        'Qty': 2,
        'Harga Unit': 1250000
      },
      {
        'Tipe': 'material',
        'Kategori': 'Pekerjaan Sanitasi',
        'Deskripsi': 'Wastafel + Kran',
        'Unit': 'set',
        'Qty': 2,
        'Harga Unit': 750000
      },
      {
        'Tipe': 'material',
        'Kategori': 'Pekerjaan Sanitasi',
        'Deskripsi': 'Pipa PVC 3 inch',
        'Unit': 'batang',
        'Qty': 20,
        'Harga Unit': 45000
      },
      {
        'Tipe': 'labor',
        'Kategori': 'Pekerjaan Sanitasi',
        'Deskripsi': 'Instalasi Plambing',
        'Unit': 'titik',
        'Qty': 8,
        'Harga Unit': 350000
      },
      
      // PEKERJAAN PINTU & JENDELA
      {
        'Tipe': 'material',
        'Kategori': 'Pekerjaan Pintu & Jendela',
        'Deskripsi': 'Pintu Panel Kayu + Kusen',
        'Unit': 'unit',
        'Qty': 6,
        'Harga Unit': 1850000
      },
      {
        'Tipe': 'material',
        'Kategori': 'Pekerjaan Pintu & Jendela',
        'Deskripsi': 'Jendela Aluminium + Kaca',
        'Unit': 'unit',
        'Qty': 8,
        'Harga Unit': 950000
      },
      {
        'Tipe': 'labor',
        'Kategori': 'Pekerjaan Pintu & Jendela',
        'Deskripsi': 'Pasang Pintu & Jendela',
        'Unit': 'unit',
        'Qty': 14,
        'Harga Unit': 150000
      },
      
      // PEKERJAAN LISTRIK
      {
        'Tipe': 'material',
        'Kategori': 'Pekerjaan Listrik',
        'Deskripsi': 'Kabel NYM 2x2.5mm',
        'Unit': 'meter',
        'Qty': 200,
        'Harga Unit': 8500
      },
      {
        'Tipe': 'material',
        'Kategori': 'Pekerjaan Listrik',
        'Deskripsi': 'MCB 2 Ampere',
        'Unit': 'unit',
        'Qty': 6,
        'Harga Unit': 45000
      },
      {
        'Tipe': 'labor',
        'Kategori': 'Pekerjaan Listrik',
        'Deskripsi': 'Instalasi Listrik + Titik Lampu',
        'Unit': 'titik',
        'Qty': 20,
        'Harga Unit': 250000
      }
    ];
  };

  const downloadTemplateExcel = () => {
    // Download template from public endpoint (no auth required)
    const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    const templateUrl = `${backendUrl}/download/rab-template`;
    
    // Use window.open to trigger download
    window.open(templateUrl, '_blank');
  };

  const downloadTemplateCSV = () => {
    const templateData = getTemplateData();
    
    // Create CSV content
    const headers = Object.keys(templateData[0]);
    const csvRows = [
      headers.join(','),
      ...templateData.map(row => 
        headers.map(header => {
          const value = row[header];
          // Wrap in quotes if contains comma or is string
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ];
    
    const csvContent = csvRows.join('\n');
    
    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'template-rap-import.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const convertToCSV = (data) => {
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(',')).join('\n');
    return headers + '\n' + rows;
  };

  const handleFileImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImportError('');
    
    const fileName = file.name.toLowerCase();
    const isExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xls');
    const isCSV = fileName.endsWith('.csv');
    
    if (!isExcel && !isCSV) {
      setImportError('Format file tidak didukung. Gunakan .xlsx, .xls, atau .csv');
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        let parsedItems;
        
        if (isExcel) {
          // Parse Excel file
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet);
          parsedItems = parseImportedData(jsonData);
        } else {
          // Parse CSV file
          const text = e.target.result;
          parsedItems = parseCSV(text);
        }
        
        if (parsedItems.length === 0) {
          setImportError('File kosong atau format tidak valid');
          return;
        }

        setItems(parsedItems);
        setErrors({});
      } catch (error) {
        setImportError('Error parsing file: ' + error.message);
      }
    };
    
    // Read file based on type
    if (isExcel) {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
    
    // Reset file input
    event.target.value = '';
  };

  const parseImportedData = (jsonData) => {
    const items = [];
    const validItemTypes = RAB_ITEM_TYPES.map(t => t.value);
    const validCategories = RAB_CATEGORIES.map(c => c.value);
    
    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i];
      const rowNum = i + 2; // Excel row number (header is row 1)
      
      // Validate Tipe
      const itemType = normalizeItemType(row['Tipe']);
      if (!validItemTypes.includes(itemType)) {
        throw new Error(`Baris ${rowNum}: Tipe "${row['Tipe']}" tidak valid. Pilih: ${validItemTypes.join(', ')}`);
      }
      
      // Kategori is free text, no validation needed
      const category = row['Kategori'] || '';
      
      // Validate required fields
      if (!row['Deskripsi'] || !row['Deskripsi'].trim()) {
        throw new Error(`Baris ${rowNum}: Deskripsi wajib diisi`);
      }
      
      if (!row['Unit'] || !row['Unit'].trim()) {
        throw new Error(`Baris ${rowNum}: Unit wajib diisi`);
      }
      
      // Validate numbers
      const qty = parseFloat(row['Qty']);
      if (isNaN(qty) || qty <= 0) {
        throw new Error(`Baris ${rowNum}: Qty harus berupa angka lebih dari 0`);
      }
      
      const unitPrice = parseFloat(row['Harga Unit']);
      if (isNaN(unitPrice) || unitPrice < 0) {
        throw new Error(`Baris ${rowNum}: Harga Unit harus berupa angka (minimal 0)`);
      }
      
      // Map Excel columns to item fields
      const item = {
        id: Date.now() + Math.random() + i,
        itemType: itemType,
        category: category,
        description: row['Deskripsi'].trim(),
        unit: row['Unit'].trim(),
        quantity: qty,
        unitPrice: unitPrice,
        specifications: '',
        supplier: '',
        laborCategory: '',
        serviceScope: ''
      };
      
      items.push(item);
    }
    
    return items;
  };
  
  const normalizeItemType = (type) => {
    if (!type) return 'material';
    const normalized = type.toLowerCase().trim();
    const validTypes = ['material', 'service', 'labor', 'equipment', 'overhead', 'tax'];
    return validTypes.includes(normalized) ? normalized : 'material';
  };

  const parseCSV = (text) => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('File CSV harus memiliki header dan minimal 1 baris data');
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/['"]/g, ''));
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const values = line.split(',').map(v => v.trim().replace(/['"]/g, ''));
      const rowData = {};
      
      headers.forEach((header, index) => {
        rowData[header] = values[index] || '';
      });
      
      rows.push(rowData);
    }

    return parseImportedData(rows);
  };

  const addNewRow = () => {
    setItems([...items, createEmptyItem()]);
  };

  const removeRow = (itemId) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== itemId));
      // Remove errors for this item
      const newErrors = { ...errors };
      delete newErrors[itemId];
      setErrors(newErrors);
    }
  };

  const updateItem = (itemId, field, value) => {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, [field]: value } : item
    ));
    
    // Clear error for this field
    if (errors[itemId]?.[field]) {
      setErrors(prev => ({
        ...prev,
        [itemId]: {
          ...prev[itemId],
          [field]: undefined
        }
      }));
    }
  };

  const validateAllItems = () => {
    const newErrors = {};
    let hasErrors = false;

    items.forEach(item => {
      const itemErrors = validateRABForm(item);
      if (!isFormValid(itemErrors)) {
        newErrors[item.id] = itemErrors;
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    return !hasErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateAllItems()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('📤 BulkRABForm: Submitting items:', items);
      const result = await onSubmit(items);
      console.log('📤 BulkRABForm: Submit result:', result);
      
      if (result.success) {
        setItems([createEmptyItem()]);
        setErrors({});
        console.log('✅ BulkRABForm: Submit successful, form cleared');
      } else {
        console.error('❌ BulkRABForm: Submit failed:', result.error);
      }
    } catch (error) {
      console.error('❌ BulkRABForm: Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsSavingDraft(true);
    
    try {
      await onSaveDraft(items);
    } catch (error) {
      console.error('Save draft error:', error);
    } finally {
      setIsSavingDraft(false);
    }
  };

  const getTotalAmount = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  const getWorkflowInfo = (itemType) => {
    const config = getItemTypeConfig(itemType);
    if (itemType === 'material') {
      return { label: 'Material → Purchase Order', color: 'text-blue-300', bg: 'bg-blue-500/20' };
    } else if (itemType === 'service') {
      return { label: 'Jasa → Perintah Kerja', color: 'text-green-300', bg: 'bg-green-500/20' };
    }
    return { label: config?.label || 'Unknown', color: 'text-gray-300', bg: 'bg-gray-500/20' };
  };

  return (
    <div className="bg-[#2C2C2E] rounded-xl border border-[#38383A] overflow-hidden">
      {/* Header */}
      <div className="bg-[#1C1C1E] px-6 py-4 border-b border-[#38383A]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">Kelola RAP Project</h3>
            <p className="text-sm text-[#8E8E93] mt-1">
              Input, edit, dan kelola item RAP secara efisien
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-[#8E8E93] hover:text-white hover:bg-[#38383A] rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-[#1C1C1E] px-6 py-3 border-b border-[#38383A]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Import/Export Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={downloadTemplateExcel}
              className="flex items-center px-3 py-2 bg-[#34C759] text-white rounded-lg hover:bg-[#34C759]/90 transition-colors text-sm"
              title="Download template dalam format Excel (.xlsx)"
            >
              <Download className="h-4 w-4 mr-2" />
              Template Excel
            </button>
            
            <button
              onClick={downloadTemplateCSV}
              className="flex items-center px-3 py-2 bg-[#5856D6] text-white rounded-lg hover:bg-[#5856D6]/90 transition-colors text-sm"
              title="Download template dalam format CSV (.csv)"
            >
              <Download className="h-4 w-4 mr-2" />
              Template CSV
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileImport}
              className="hidden"
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center px-3 py-2 bg-[#FF9F0A] text-white rounded-lg hover:bg-[#FF9F0A]/90 transition-colors text-sm"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import Excel/CSV
            </button>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center space-x-4 text-sm">
            <div className="bg-[#2C2C2E] px-3 py-1 rounded">
              <span className="text-[#8E8E93]">Total:</span>
              <span className="text-white ml-1 font-semibold">{items.length}</span>
            </div>
            <div className="bg-[#2C2C2E] px-3 py-1 rounded">
              <span className="text-[#8E8E93]">Estimasi:</span>
              <span className="text-[#0A84FF] ml-1 font-semibold">{formatCurrency(getTotalAmount())}</span>
            </div>
          </div>
        </div>

        {/* Import Error */}
        {importError && (
          <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start">
            <AlertTriangle className="h-4 w-4 text-red-400 mr-2 mt-0.5" />
            <div className="text-sm text-red-400">{importError}</div>
          </div>
        )}
      </div>

      {/* Table Container */}
      <div className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="overflow-x-auto bg-[#1C1C1E] rounded-lg border border-[#38383A]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#38383A]">
                  <th className="text-left py-3 px-3 text-xs font-semibold text-[#98989D] uppercase tracking-wider w-28">
                    Tipe
                  </th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-[#98989D] uppercase tracking-wider w-36">
                    Kategori
                  </th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-[#98989D] uppercase tracking-wider">
                    Deskripsi
                  </th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-[#98989D] uppercase tracking-wider w-20">
                    Unit
                  </th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-[#98989D] uppercase tracking-wider w-24">
                    Qty
                  </th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-[#98989D] uppercase tracking-wider w-32">
                    Harga Unit
                  </th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-[#98989D] uppercase tracking-wider w-32">
                    Subtotal
                  </th>
                  <th className="text-center py-3 px-3 text-xs font-semibold text-[#98989D] uppercase tracking-wider w-16">
                    
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#38383A]">
                {items.map((item, index) => {
                  const itemErrors = errors[item.id] || {};
                  const workflowInfo = getWorkflowInfo(item.itemType);
                  
                  return (
                    <tr key={item.id} className="hover:bg-[#2C2C2E] transition-colors">
                      {/* Item Type */}
                      <td className="py-2 px-3">
                        <select
                          value={item.itemType}
                          onChange={(e) => updateItem(item.id, 'itemType', e.target.value)}
                          className="w-full px-2 py-1.5 text-xs bg-[#2C2C2E] border border-[#38383A] rounded text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="material">Material</option>
                          <option value="service">Jasa</option>
                          <option value="labor">Tenaga</option>
                          <option value="equipment">Alat</option>
                          <option value="overhead">Overhead</option>
                          <option value="tax">Pajak</option>
                        </select>
                        {itemErrors.itemType && (
                          <p className="text-[#FF3B30] text-xs mt-1">{itemErrors.itemType}</p>
                        )}
                      </td>

                      {/* Category */}
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={item.category}
                          onChange={(e) => updateItem(item.id, 'category', e.target.value)}
                          placeholder="Kategori..."
                          className="w-full px-2 py-1.5 text-xs bg-[#2C2C2E] border border-[#38383A] rounded text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        {itemErrors.category && (
                          <p className="text-[#FF3B30] text-xs mt-1">{itemErrors.category}</p>
                        )}
                      </td>

                      {/* Description */}
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                          placeholder="Deskripsi item..."
                          className="w-full px-2 py-1.5 text-xs bg-[#2C2C2E] border border-[#38383A] rounded text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        {itemErrors.description && (
                          <p className="text-[#FF3B30] text-xs mt-1">{itemErrors.description}</p>
                        )}
                      </td>

                      {/* Unit */}
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={item.unit}
                          onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                          placeholder="Unit"
                          className="w-full px-2 py-1.5 text-xs bg-[#2C2C2E] border border-[#38383A] rounded text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        {itemErrors.unit && (
                          <p className="text-[#FF3B30] text-xs mt-1">{itemErrors.unit}</p>
                        )}
                      </td>

                      {/* Quantity */}
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                          placeholder="0"
                          min="0"
                          step="0.01"
                          className="w-full px-2 py-1.5 text-xs bg-[#2C2C2E] border border-[#38383A] rounded text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        {itemErrors.quantity && (
                          <p className="text-[#FF3B30] text-xs mt-1">{itemErrors.quantity}</p>
                        )}
                      </td>

                      {/* Unit Price */}
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                          placeholder="0"
                          min="0"
                          step="0.01"
                          className="w-full px-2 py-1.5 text-xs bg-[#2C2C2E] border border-[#38383A] rounded text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        {itemErrors.unitPrice && (
                          <p className="text-[#FF3B30] text-xs mt-1">{itemErrors.unitPrice}</p>
                        )}
                      </td>

                      {/* Subtotal */}
                      <td className="py-2 px-3 text-right">
                        <span className="text-sm font-semibold text-white">
                          {formatCurrency(item.quantity * item.unitPrice)}
                        </span>
                      </td>

                      {/* Remove button */}
                      <td className="py-2 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => removeRow(item.id)}
                          disabled={items.length === 1}
                          className="p-1.5 text-[#FF3B30] hover:text-[#FF3B30]/80 hover:bg-[#FF3B30]/10 rounded disabled:text-[#8E8E93] disabled:cursor-not-allowed transition-colors"
                          title="Hapus baris"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Add Row Button */}
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={addNewRow}
              className="flex items-center px-4 py-2 bg-[#38383A] border border-[#48484A] rounded-lg text-white hover:bg-[#48484A] transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Baris
            </button>
          </div>

          {/* Summary Bar */}
          <div className="mt-6 bg-[#1C1C1E] rounded-lg p-4 border border-[#38383A]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Summary Stats */}
              <div className="flex items-center space-x-6">
                <div>
                  <span className="text-sm text-[#8E8E93]">Total Items:</span>
                  <span className="text-lg font-bold text-white ml-2">{items.length}</span>
                </div>
                <div>
                  <span className="text-sm text-[#8E8E93]">Material:</span>
                  <span className="text-sm font-semibold text-blue-300 ml-2">
                    {items.filter(i => i.itemType === 'material').length}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-[#8E8E93]">Jasa:</span>
                  <span className="text-sm font-semibold text-green-300 ml-2">
                    {items.filter(i => i.itemType === 'service').length}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-[#8E8E93]">Total Estimasi:</span>
                  <span className="text-xl font-bold text-[#0A84FF] ml-2">
                    {formatCurrency(getTotalAmount())}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={isSavingDraft}
                  className="flex items-center px-4 py-2 bg-[#FF9F0A] text-white rounded-lg hover:bg-[#FF9F0A]/90 disabled:opacity-50 transition-colors"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {isSavingDraft ? 'Menyimpan...' : 'Simpan Draft'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || items.length === 0}
                  className="flex items-center px-6 py-2 bg-[#30D158] text-white rounded-lg hover:bg-[#30D158]/90 disabled:opacity-50 transition-colors font-semibold"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Menyimpan...' : `Simpan ${items.length} Item`}
                </button>
              </div>
            </div>

            {/* Workflow Info */}
            <div className="mt-4 text-xs text-[#8E8E93] bg-[#2C2C2E] p-3 rounded border border-[#38383A]">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                  Material → Purchase Order
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                  Jasa → Perintah Kerja
                </span>
              </div>
            </div>

            {/* Template Guide */}
            <div className="mt-4 bg-[#1C1C1E] border border-[#38383A] rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Info className="h-5 w-5 text-[#0A84FF] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-white mb-2">Panduan Format Template</h4>
                  <div className="space-y-2 text-xs text-[#8E8E93]">
                    <div>
                      <p className="font-semibold text-[#98989D] mb-1">6 Kolom yang diperlukan:</p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>
                          <span className="text-white">Tipe</span> - Pilihan: 
                          <span className="text-[#0A84FF] ml-1">
                            {RAB_ITEM_TYPES.map(t => t.value).join(', ')}
                          </span>
                        </li>
                        <li>
                          <span className="text-white">Kategori</span> - Text bebas (manual input, opsional)
                        </li>
                        <li><span className="text-white">Deskripsi</span> - Nama/deskripsi lengkap item (wajib)</li>
                        <li><span className="text-white">Unit</span> - satuan: sak, m², m³, hari, kg, ton, dll (wajib)</li>
                        <li><span className="text-white">Qty</span> - Jumlah dalam angka (wajib, harus &gt; 0)</li>
                        <li><span className="text-white">Harga Unit</span> - Harga per unit dalam angka (wajib, minimal 0)</li>
                      </ul>
                    </div>
                    <div className="pt-2 border-t border-[#38383A]">
                      <p className="text-[#34C759]">
                        ✅ Template Excel sudah memiliki dropdown list untuk kolom Tipe saja
                      </p>
                      <p className="text-[#FF9F0A] mt-1">
                        💡 Download template untuk melihat contoh format yang benar
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BulkRABForm;
