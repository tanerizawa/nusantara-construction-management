import React from 'react';
import { formatCurrency, isItemSelected } from '../utils/poUtils';

/**
 * RAB Item Selector Component
 */
const RABItemSelector = ({ 
  rabItems, 
  selectedItems, 
  onItemToggle, 
  onQuantityChange, 
  disabled = false 
}) => {
  return (
    <div className="bg-white border rounded-lg p-6">
      <h3 className="text-lg font-medium mb-4">Pilih Item RAB</h3>
      {rabItems.length === 0 ? (
        <p className="text-gray-500">Tidak ada item RAB yang tersedia untuk proyek ini.</p>
      ) : (
        <div className="space-y-4">
          {rabItems.map((item) => (
            <RABItemCard
              key={item.id}
              item={item}
              selectedItems={selectedItems}
              onToggle={onItemToggle}
              onQuantityChange={onQuantityChange}
              disabled={disabled}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Individual RAB Item Card Component
 */
const RABItemCard = ({ 
  item, 
  selectedItems, 
  onToggle, 
  onQuantityChange, 
  disabled 
}) => {
  const selectedItem = isItemSelected(selectedItems, item.id);
  const isSelected = !!selectedItem;

  return (
    <div
      className={`border rounded-lg p-4 transition-colors ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
      }`}
    >
      <div className="flex items-start space-x-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggle(item)}
          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          disabled={disabled}
        />
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{item.itemName || item.material}</h4>
          <p className="text-sm text-gray-600">
            {item.quantity} {item.unit} @ {formatCurrency(item.unitPrice || 0)}
          </p>
          {isSelected && (
            <div className="mt-3 flex items-center space-x-4">
              <div>
                <label className="block text-sm text-gray-600">Jumlah Pesan</label>
                <input
                  type="number"
                  min="1"
                  max={item.quantity}
                  value={selectedItem.orderQuantity}
                  onChange={(e) => onQuantityChange(item.id, parseInt(e.target.value))}
                  className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
                  disabled={disabled}
                />
              </div>
              <div>
                <span className="text-sm text-gray-600">Total: </span>
                <span className="font-medium">
                  {formatCurrency(selectedItem.orderQuantity * (item.unitPrice || 0))}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RABItemSelector;