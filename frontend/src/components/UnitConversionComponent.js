import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  ArrowLeftRight, 
  Info, 
  Copy, 
  RotateCcw,
  Ruler,
  Package,
  Weight,
  Gauge
} from 'lucide-react';
import { 
  convertUnits, 
  getSupportedUnits, 
  formatUnitDisplay, 
  isConversionValid,
  constructionConverters,
  applyWastage,
  CONSTRUCTION_UNITS,
  MATERIAL_DENSITIES,
  WASTAGE_FACTORS
} from '../utils/constructionUnits';

/**
 * Unit Conversion Component
 * Construction Industry Best Practice Implementation
 * Priority 1 Enhancement - Multi-unit Construction Measurements
 */

const UnitConversionComponent = () => {
  const [activeTab, setActiveTab] = useState('basic');
  const [conversionHistory, setConversionHistory] = useState([]);

  // Basic conversion state
  const [basicConversion, setBasicConversion] = useState({
    value: '',
    fromUnit: 'm',
    toUnit: 'ft',
    category: 'LENGTH',
    result: null
  });

  // Construction calculator state
  const [constructionCalc, setConstructionCalc] = useState({
    type: 'concrete',
    inputs: {
      volume: '',
      diameter: '',
      length: '',
      area: '',
      coats: 2,
      tileSize: 0.4
    },
    results: {}
  });

  // Wastage calculator state
  const [wastageCalc, setWastageCalc] = useState({
    quantity: '',
    materialType: 'concrete',
    customWastage: '',
    result: null,
    wastageFactor: 0.05
  });

  useEffect(() => {
    performBasicConversion();
  }, [basicConversion.value, basicConversion.fromUnit, basicConversion.toUnit, basicConversion.category]);

  useEffect(() => {
    performConstructionCalculation();
  }, [constructionCalc.type, constructionCalc.inputs]);

  useEffect(() => {
    performWastageCalculation();
  }, [wastageCalc.quantity, wastageCalc.materialType, wastageCalc.customWastage]);

  const performBasicConversion = () => {
    if (!basicConversion.value || isNaN(basicConversion.value)) {
      setBasicConversion(prev => ({ ...prev, result: null }));
      return;
    }

    try {
      const result = convertUnits(
        parseFloat(basicConversion.value),
        basicConversion.fromUnit,
        basicConversion.toUnit,
        basicConversion.category
      );

      setBasicConversion(prev => ({ ...prev, result }));

      // Add to history
      addToHistory({
        type: 'basic',
        from: { value: basicConversion.value, unit: basicConversion.fromUnit },
        to: { value: result, unit: basicConversion.toUnit },
        timestamp: new Date()
      });

    } catch (error) {
      console.error('Conversion error:', error);
      setBasicConversion(prev => ({ ...prev, result: null }));
    }
  };

  const performConstructionCalculation = () => {
    const { type, inputs } = constructionCalc;
    let results = {};

    try {
      switch (type) {
        case 'concrete':
          if (inputs.volume && !isNaN(inputs.volume)) {
            results = constructionConverters.concreteComponents(parseFloat(inputs.volume));
          }
          break;
        case 'rebar':
          if (inputs.length && inputs.diameter && !isNaN(inputs.length) && !isNaN(inputs.diameter)) {
            results.weight = constructionConverters.rebarWeightFromLength(
              parseFloat(inputs.length),
              parseFloat(inputs.diameter)
            );
          }
          break;
        case 'paint':
          if (inputs.area && !isNaN(inputs.area)) {
            results.liters = constructionConverters.wallPaintCoverage(
              parseFloat(inputs.area),
              parseInt(inputs.coats) || 2
            );
          }
          break;
        case 'tiles':
          if (inputs.area && !isNaN(inputs.area)) {
            results.quantity = constructionConverters.tileQuantity(
              parseFloat(inputs.area),
              parseFloat(inputs.tileSize) || 0.4
            );
          }
          break;
      }

      setConstructionCalc(prev => ({ ...prev, results }));
    } catch (error) {
      console.error('Construction calculation error:', error);
    }
  };

  const performWastageCalculation = () => {
    if (!wastageCalc.quantity || isNaN(wastageCalc.quantity)) {
      setWastageCalc(prev => ({ ...prev, result: null }));
      return;
    }

    try {
      const customWastage = wastageCalc.customWastage && !isNaN(wastageCalc.customWastage) 
        ? parseFloat(wastageCalc.customWastage) / 100 
        : null;

      const result = applyWastage(
        parseFloat(wastageCalc.quantity),
        wastageCalc.materialType,
        customWastage
      );

      const wastageFactor = customWastage || WASTAGE_FACTORS[wastageCalc.materialType] || WASTAGE_FACTORS.default;

      setWastageCalc(prev => ({ 
        ...prev, 
        result,
        wastageFactor: wastageFactor * 100
      }));

    } catch (error) {
      console.error('Wastage calculation error:', error);
    }
  };

  const addToHistory = (conversion) => {
    setConversionHistory(prev => [conversion, ...prev.slice(0, 9)]); // Keep last 10
  };

  const swapUnits = () => {
    setBasicConversion(prev => ({
      ...prev,
      fromUnit: prev.toUnit,
      toUnit: prev.fromUnit
    }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const renderBasicConverter = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Unit Converter</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Value</label>
            <input
              type="number"
              value={basicConversion.value}
              onChange={(e) => setBasicConversion(prev => ({ ...prev, value: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter value"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={basicConversion.category}
              onChange={(e) => {
                const category = e.target.value;
                const units = getSupportedUnits(category);
                setBasicConversion(prev => ({
                  ...prev,
                  category,
                  fromUnit: units[0]?.key || '',
                  toUnit: units[1]?.key || units[0]?.key || ''
                }));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="LENGTH">Length</option>
              <option value="AREA">Area</option>
              <option value="VOLUME">Volume</option>
              <option value="WEIGHT">Weight</option>
              <option value="CONSTRUCTION">Construction</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From Unit</label>
            <select
              value={basicConversion.fromUnit}
              onChange={(e) => setBasicConversion(prev => ({ ...prev, fromUnit: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {getSupportedUnits(basicConversion.category).map(unit => (
                <option key={unit.key} value={unit.key}>{unit.name} ({unit.symbol})</option>
              ))}
            </select>
          </div>

          <div className="flex justify-center">
            <button
              onClick={swapUnits}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Swap units"
            >
              <ArrowLeftRight className="w-5 h-5" />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To Unit</label>
            <select
              value={basicConversion.toUnit}
              onChange={(e) => setBasicConversion(prev => ({ ...prev, toUnit: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {getSupportedUnits(basicConversion.category).map(unit => (
                <option key={unit.key} value={unit.key}>{unit.name} ({unit.symbol})</option>
              ))}
            </select>
          </div>
        </div>

        {basicConversion.result !== null && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Result:</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatUnitDisplay(basicConversion.result, basicConversion.toUnit)}
                </p>
              </div>
              <button
                onClick={() => copyToClipboard(basicConversion.result.toString())}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Copy result"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Reference */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Construction References</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900">Common Steel</h4>
            <p className="text-sm text-gray-600">1 batang = 12m rebar</p>
            <p className="text-sm text-gray-600">1 lembar wiremesh = 2m²</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900">Cement</h4>
            <p className="text-sm text-gray-600">1 sak = 50kg cement</p>
            <p className="text-sm text-gray-600">1 zak = 40kg cement</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900">Concrete</h4>
            <p className="text-sm text-gray-600">1 truk = 7m³ ready mix</p>
            <p className="text-sm text-gray-600">1 colt = 4m³ aggregate</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderConstructionCalculator = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Construction Calculator</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Calculator Type</label>
          <select
            value={constructionCalc.type}
            onChange={(e) => setConstructionCalc(prev => ({ ...prev, type: e.target.value, results: {} }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="concrete">Concrete Components</option>
            <option value="rebar">Rebar Weight</option>
            <option value="paint">Paint Coverage</option>
            <option value="tiles">Tile Quantity</option>
          </select>
        </div>

        {constructionCalc.type === 'concrete' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Concrete Volume (m³)</label>
              <input
                type="number"
                value={constructionCalc.inputs.volume}
                onChange={(e) => setConstructionCalc(prev => ({
                  ...prev,
                  inputs: { ...prev.inputs, volume: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter volume in m³"
              />
            </div>
            {constructionCalc.results.cement && (
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Material Requirements:</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>Cement: {constructionCalc.results.cement.toFixed(0)} kg</div>
                  <div>Sand: {constructionCalc.results.sand.toFixed(2)} m³</div>
                  <div>Gravel: {constructionCalc.results.gravel.toFixed(2)} m³</div>
                  <div>Water: {constructionCalc.results.water.toFixed(0)} liters</div>
                </div>
              </div>
            )}
          </div>
        )}

        {constructionCalc.type === 'rebar' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Length (m)</label>
                <input
                  type="number"
                  value={constructionCalc.inputs.length}
                  onChange={(e) => setConstructionCalc(prev => ({
                    ...prev,
                    inputs: { ...prev.inputs, length: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter length"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Diameter (mm)</label>
                <input
                  type="number"
                  value={constructionCalc.inputs.diameter}
                  onChange={(e) => setConstructionCalc(prev => ({
                    ...prev,
                    inputs: { ...prev.inputs, diameter: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter diameter"
                />
              </div>
            </div>
            {constructionCalc.results.weight && (
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Rebar Weight:</h4>
                <p className="text-lg font-semibold">{constructionCalc.results.weight.toFixed(2)} kg</p>
              </div>
            )}
          </div>
        )}

        {constructionCalc.type === 'paint' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Wall Area (m²)</label>
                <input
                  type="number"
                  value={constructionCalc.inputs.area}
                  onChange={(e) => setConstructionCalc(prev => ({
                    ...prev,
                    inputs: { ...prev.inputs, area: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter area"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Coats</label>
                <input
                  type="number"
                  value={constructionCalc.inputs.coats}
                  onChange={(e) => setConstructionCalc(prev => ({
                    ...prev,
                    inputs: { ...prev.inputs, coats: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                  max="5"
                />
              </div>
            </div>
            {constructionCalc.results.liters && (
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Paint Required:</h4>
                <p className="text-lg font-semibold">{constructionCalc.results.liters.toFixed(2)} liters</p>
              </div>
            )}
          </div>
        )}

        {constructionCalc.type === 'tiles' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Floor Area (m²)</label>
                <input
                  type="number"
                  value={constructionCalc.inputs.area}
                  onChange={(e) => setConstructionCalc(prev => ({
                    ...prev,
                    inputs: { ...prev.inputs, area: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter area"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tile Size (m)</label>
                <select
                  value={constructionCalc.inputs.tileSize}
                  onChange={(e) => setConstructionCalc(prev => ({
                    ...prev,
                    inputs: { ...prev.inputs, tileSize: parseFloat(e.target.value) }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={0.2}>20x20 cm</option>
                  <option value={0.3}>30x30 cm</option>
                  <option value={0.4}>40x40 cm</option>
                  <option value={0.5}>50x50 cm</option>
                  <option value={0.6}>60x60 cm</option>
                </select>
              </div>
            </div>
            {constructionCalc.results.quantity && (
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Tiles Required (including wastage):</h4>
                <p className="text-lg font-semibold">{Math.ceil(constructionCalc.results.quantity)} pieces</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderWastageCalculator = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Wastage Calculator</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Base Quantity</label>
            <input
              type="number"
              value={wastageCalc.quantity}
              onChange={(e) => setWastageCalc(prev => ({ ...prev, quantity: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter quantity"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Material Type</label>
            <select
              value={wastageCalc.materialType}
              onChange={(e) => setWastageCalc(prev => ({ ...prev, materialType: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="concrete">Concrete (5%)</option>
              <option value="steel_rebar">Steel Rebar (3%)</option>
              <option value="brick">Brick (5%)</option>
              <option value="tiles">Tiles (10%)</option>
              <option value="paint">Paint (5%)</option>
              <option value="cement">Cement (2%)</option>
              <option value="sand">Sand (5%)</option>
              <option value="wood">Wood (10%)</option>
              <option value="wallpaper">Wallpaper (15%)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Custom Wastage (%)</label>
            <input
              type="number"
              value={wastageCalc.customWastage}
              onChange={(e) => setWastageCalc(prev => ({ ...prev, customWastage: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Override default"
              min="0"
              max="50"
              step="0.1"
            />
          </div>
        </div>

        {wastageCalc.result !== null && (
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Base Quantity:</p>
                <p className="text-lg font-semibold text-gray-900">{wastageCalc.quantity}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Wastage Factor:</p>
                <p className="text-lg font-semibold text-yellow-600">{wastageCalc.wastageFactor.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Required:</p>
                <p className="text-lg font-semibold text-yellow-900">{wastageCalc.result.toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
            <div>
              <h4 className="font-medium text-blue-900">Wastage Guidelines</h4>
              <p className="text-sm text-blue-700 mt-1">
                Wastage factors account for material loss during construction. These percentages are 
                industry standards but may vary based on project complexity, weather conditions, 
                and crew experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Construction Unit Converter</h1>
          <p className="text-gray-600">Multi-unit construction measurements and calculations</p>
        </div>
        <button
          onClick={() => setConversionHistory([])}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-150 flex items-center space-x-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Clear History</span>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'basic', label: 'Unit Converter', icon: Calculator },
            { id: 'construction', label: 'Construction Calculator', icon: Ruler },
            { id: 'wastage', label: 'Wastage Calculator', icon: Gauge },
            { id: 'history', label: 'History', icon: Package }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'basic' && renderBasicConverter()}
      {activeTab === 'construction' && renderConstructionCalculator()}
      {activeTab === 'wastage' && renderWastageCalculator()}
      
      {activeTab === 'history' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Conversion History</h3>
          {conversionHistory.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No conversions yet</p>
          ) : (
            <div className="space-y-3">
              {conversionHistory.map((conversion, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">
                      {conversion.from.value} {conversion.from.unit}
                    </span>
                    <ArrowLeftRight className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">
                      {typeof conversion.to.value === 'number' 
                        ? conversion.to.value.toFixed(4) 
                        : conversion.to.value} {conversion.to.unit}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {conversion.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UnitConversionComponent;
