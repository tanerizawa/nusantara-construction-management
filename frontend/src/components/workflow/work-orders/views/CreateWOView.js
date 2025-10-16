import React, { useState, useMemo } from 'react';
import { FileText, Building, Calendar, DollarSign } from 'lucide-react';
import { formatCurrency } from '../../../../utils/formatters';

/**
 * CreateWOView - Form for creating new Work Order
 * Similar to CreatePOView but for services, labor, and equipment
 */
const CreateWOView = ({
  selectedRABItems,
  rabItems,
  contractorInfo,
  setContractorInfo,
  onSubmit,
  onBack,
  projectId
}) => {
  // Debug logging
  console.log('🔍 [CreateWOView] selectedRABItems:', selectedRABItems);
  console.log('🔍 [CreateWOView] rabItems:', rabItems);
  console.log('🔍 [CreateWOView] rabItems count:', rabItems?.length);
  
  const [itemQuantities, setItemQuantities] = useState(() => {
    const quantities = {};
    selectedRABItems.forEach(item => {
      // Handle both array of objects or array of IDs
      const itemId = typeof item === 'object' ? item.id : item;
      const rabItem = rabItems.find(r => r.id === itemId);
      console.log(`🔍 [CreateWOView] Finding item ${itemId}:`, rabItem);
      if (rabItem) {
        quantities[itemId] = rabItem.availableQuantity || rabItem.available_quantity || 0;
      }
    });
    console.log('🔍 [CreateWOView] Initial itemQuantities:', quantities);
    return quantities;
  });

  // Calculate totals
  const totals = useMemo(() => {
    let totalAmount = 0;
    let totalItems = 0;

    selectedRABItems.forEach(item => {
      // Handle both array of objects or array of IDs
      const itemId = typeof item === 'object' ? item.id : item;
      const rabItem = rabItems.find(r => r.id === itemId);
      const qty = parseFloat(itemQuantities[itemId]) || 0;
      
      if (rabItem && qty > 0) {
        const unitPrice = parseFloat(rabItem.unitPrice || rabItem.unit_price) || 0;
        totalAmount += qty * unitPrice;
        totalItems++;
      }
    });

    return { totalAmount, totalItems };
  }, [selectedRABItems, rabItems, itemQuantities]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate contractor info
    if (!contractorInfo.name?.trim()) {
      alert('Nama kontraktor harus diisi');
      return;
    }

    if (!contractorInfo.contact?.trim()) {
      alert('Kontak kontraktor harus diisi');
      return;
    }

    if (!contractorInfo.startDate) {
      alert('Tanggal mulai harus diisi');
      return;
    }

    if (!contractorInfo.endDate) {
      alert('Tanggal selesai harus diisi');
      return;
    }

    // Validate quantities
    const invalidItems = selectedRABItems.filter(item => {
      const itemId = typeof item === 'object' ? item.id : item;
      const qty = parseFloat(itemQuantities[itemId]) || 0;
      return qty <= 0;
    });

    if (invalidItems.length > 0) {
      alert('Semua item harus memiliki volume > 0');
      return;
    }

    // Build WO data
    const woData = {
      contractorName: contractorInfo.name.trim(),
      contractorContact: contractorInfo.contact.trim(),
      contractorAddress: contractorInfo.address?.trim() || '',
      startDate: contractorInfo.startDate,
      endDate: contractorInfo.endDate,
      items: selectedRABItems.map(item => {
        const itemId = typeof item === 'object' ? item.id : item;
        const rabItem = rabItems.find(r => r.id === itemId);
        const qty = parseFloat(itemQuantities[itemId]) || 0;
        
        return {
          rabItemId: rabItem.id,
          itemName: rabItem.description || rabItem.item_name,
          itemType: rabItem.item_type || rabItem.itemType || 'service',
          quantity: qty,
          unit: rabItem.unit,
          unitPrice: parseFloat(rabItem.unitPrice || rabItem.unit_price) || 0
        };
      }),
      totalAmount: totals.totalAmount,
      status: 'pending'
    };

    console.log('[CreateWOView] Submitting WO:', woData);
    onSubmit(woData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Contractor Information */}
      <div 
        style={{
          backgroundColor: '#1C1C1E',
          border: '1px solid #38383A'
        }}
        className="rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Building className="h-5 w-5 mr-2 text-[#AF52DE]" />
          Informasi Kontraktor
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#98989D] mb-2">
              Nama Kontraktor *
            </label>
            <input
              type="text"
              value={contractorInfo.name}
              onChange={(e) => setContractorInfo({ ...contractorInfo, name: e.target.value })}
              style={{
                backgroundColor: '#2C2C2E',
                border: '1px solid #38383A',
                color: 'white'
              }}
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:border-[#AF52DE]"
              placeholder="Masukkan nama kontraktor"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#98989D] mb-2">
              Kontak *
            </label>
            <input
              type="text"
              value={contractorInfo.contact}
              onChange={(e) => setContractorInfo({ ...contractorInfo, contact: e.target.value })}
              style={{
                backgroundColor: '#2C2C2E',
                border: '1px solid #38383A',
                color: 'white'
              }}
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:border-[#AF52DE]"
              placeholder="No. telepon atau email"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[#98989D] mb-2">
              Alamat
            </label>
            <textarea
              value={contractorInfo.address}
              onChange={(e) => setContractorInfo({ ...contractorInfo, address: e.target.value })}
              style={{
                backgroundColor: '#2C2C2E',
                border: '1px solid #38383A',
                color: 'white'
              }}
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:border-[#AF52DE]"
              placeholder="Alamat lengkap kontraktor"
              rows="2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#98989D] mb-2">
              Tanggal Mulai *
            </label>
            <input
              type="date"
              value={contractorInfo.startDate}
              onChange={(e) => setContractorInfo({ ...contractorInfo, startDate: e.target.value })}
              style={{
                backgroundColor: '#2C2C2E',
                border: '1px solid #38383A',
                color: 'white'
              }}
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:border-[#AF52DE]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#98989D] mb-2">
              Tanggal Selesai *
            </label>
            <input
              type="date"
              value={contractorInfo.endDate}
              onChange={(e) => setContractorInfo({ ...contractorInfo, endDate: e.target.value })}
              style={{
                backgroundColor: '#2C2C2E',
                border: '1px solid #38383A',
                color: 'white'
              }}
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:border-[#AF52DE]"
              required
            />
          </div>
        </div>
      </div>

      {/* Items List */}
      <div 
        style={{
          backgroundColor: '#1C1C1E',
          border: '1px solid #38383A'
        }}
        className="rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <FileText className="h-5 w-5 mr-2 text-[#AF52DE]" />
          Daftar Pekerjaan ({totals.totalItems} items)
        </h3>

        <div className="space-y-3">
          {selectedRABItems.map(item => {
            // Handle both array of objects or array of IDs
            const itemId = typeof item === 'object' ? item.id : item;
            const rabItem = rabItems.find(r => r.id === itemId);
            if (!rabItem) return null;

            const maxQty = rabItem.availableQuantity || rabItem.available_quantity || 0;
            const currentQty = parseFloat(itemQuantities[itemId]) || 0;
            const unitPrice = parseFloat(rabItem.unitPrice || rabItem.unit_price) || 0;
            const subtotal = currentQty * unitPrice;

            const itemType = rabItem.item_type || rabItem.itemType || 'service';
            const typeIcon = itemType === 'labor' ? '👷' : 
                           itemType === 'equipment' ? '🚛' : '🔨';

            return (
              <div
                key={itemId}
                style={{
                  backgroundColor: '#2C2C2E',
                  border: '1px solid #38383A'
                }}
                className="rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{typeIcon}</span>
                      <h4 className="text-white font-medium">
                        {rabItem.description || rabItem.item_name}
                      </h4>
                    </div>
                    <p className="text-sm text-[#8E8E93]">
                      {rabItem.category || rabItem.kategori}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-[#8E8E93]">Harga Satuan</div>
                    <div className="text-white font-semibold">{formatCurrency(unitPrice)}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[#98989D] mb-1">
                      Volume (Max: {Math.floor(maxQty)} {rabItem.unit})
                    </label>
                    <input
                      type="number"
                      value={itemQuantities[itemId] || ''}
                      onChange={(e) => {
                        const newQty = Math.min(parseFloat(e.target.value) || 0, maxQty);
                        setItemQuantities({ ...itemQuantities, [itemId]: newQty });
                      }}
                      max={maxQty}
                      min="0"
                      step="0.01"
                      style={{
                        backgroundColor: '#1C1C1E',
                        border: '1px solid #48484A',
                        color: 'white'
                      }}
                      className="w-full px-3 py-2 rounded-lg focus:outline-none focus:border-[#AF52DE]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#98989D] mb-1">Subtotal</label>
                    <div 
                      style={{
                        backgroundColor: 'rgba(175, 82, 222, 0.1)',
                        border: '1px solid rgba(175, 82, 222, 0.3)'
                      }}
                      className="px-3 py-2 rounded-lg text-[#AF52DE] font-bold text-right"
                    >
                      {formatCurrency(subtotal)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Total Summary */}
      <div 
        style={{
          backgroundColor: 'rgba(175, 82, 222, 0.1)',
          border: '2px solid rgba(175, 82, 222, 0.3)'
        }}
        className="rounded-lg p-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <DollarSign className="h-6 w-6 text-[#AF52DE] mr-2" />
            <span className="text-lg font-semibold text-white">Total Nilai Work Order:</span>
          </div>
          <span className="text-3xl font-bold text-[#AF52DE]">
            {formatCurrency(totals.totalAmount)}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={onBack}
          style={{
            backgroundColor: '#2C2C2E',
            border: '1px solid #38383A'
          }}
          className="flex-1 py-3 rounded-lg text-white font-semibold hover:bg-[#3A3A3C] transition-colors"
        >
          ← Kembali
        </button>
        <button
          type="submit"
          className="flex-1 py-3 rounded-lg bg-[#AF52DE] hover:bg-[#AF52DE]/90 text-white font-semibold transition-colors"
        >
          Buat Work Order
        </button>
      </div>
    </form>
  );
};

export default CreateWOView;
