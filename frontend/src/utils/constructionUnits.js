/**
 * Construction Unit Conversion Utilities
 * Construction Industry Best Practice Implementation
 * Priority 1 Enhancement - Multi-unit Construction Measurements
 */

// Construction-specific unit definitions
export const CONSTRUCTION_UNITS = {
  // Length Units
  LENGTH: {
    mm: { name: 'Millimeter', symbol: 'mm', factor: 0.001 },
    cm: { name: 'Centimeter', symbol: 'cm', factor: 0.01 },
    m: { name: 'Meter', symbol: 'm', factor: 1 },
    km: { name: 'Kilometer', symbol: 'km', factor: 1000 },
    inch: { name: 'Inch', symbol: 'in', factor: 0.0254 },
    ft: { name: 'Feet', symbol: 'ft', factor: 0.3048 },
    yard: { name: 'Yard', symbol: 'yd', factor: 0.9144 }
  },

  // Area Units
  AREA: {
    mm2: { name: 'Square Millimeter', symbol: 'mm²', factor: 0.000001 },
    cm2: { name: 'Square Centimeter', symbol: 'cm²', factor: 0.0001 },
    m2: { name: 'Square Meter', symbol: 'm²', factor: 1 },
    hectare: { name: 'Hectare', symbol: 'ha', factor: 10000 },
    km2: { name: 'Square Kilometer', symbol: 'km²', factor: 1000000 },
    inch2: { name: 'Square Inch', symbol: 'in²', factor: 0.00064516 },
    ft2: { name: 'Square Feet', symbol: 'ft²', factor: 0.092903 },
    yard2: { name: 'Square Yard', symbol: 'yd²', factor: 0.836127 }
  },

  // Volume Units
  VOLUME: {
    mm3: { name: 'Cubic Millimeter', symbol: 'mm³', factor: 0.000000001 },
    cm3: { name: 'Cubic Centimeter', symbol: 'cm³', factor: 0.000001 },
    m3: { name: 'Cubic Meter', symbol: 'm³', factor: 1 },
    liter: { name: 'Liter', symbol: 'L', factor: 0.001 },
    gallon: { name: 'Gallon', symbol: 'gal', factor: 0.00378541 },
    inch3: { name: 'Cubic Inch', symbol: 'in³', factor: 0.000016387 },
    ft3: { name: 'Cubic Feet', symbol: 'ft³', factor: 0.0283168 },
    yard3: { name: 'Cubic Yard', symbol: 'yd³', factor: 0.764555 }
  },

  // Weight/Mass Units
  WEIGHT: {
    mg: { name: 'Milligram', symbol: 'mg', factor: 0.000001 },
    g: { name: 'Gram', symbol: 'g', factor: 0.001 },
    kg: { name: 'Kilogram', symbol: 'kg', factor: 1 },
    ton: { name: 'Metric Ton', symbol: 't', factor: 1000 },
    lb: { name: 'Pound', symbol: 'lb', factor: 0.453592 },
    oz: { name: 'Ounce', symbol: 'oz', factor: 0.0283495 },
    kip: { name: 'Kip', symbol: 'kip', factor: 453.592 }
  },

  // Construction-Specific Units
  CONSTRUCTION: {
    // Rebar/Steel
    batang: { name: 'Batang (12m rebar)', symbol: 'batang', baseUnit: 'm', factor: 12, category: 'steel' },
    lembar: { name: 'Lembar (Wire mesh 2x1m)', symbol: 'lembar', baseUnit: 'm2', factor: 2, category: 'steel' },
    
    // Cement/Powder
    sak: { name: 'Sak (50kg cement bag)', symbol: 'sak', baseUnit: 'kg', factor: 50, category: 'cement' },
    zak: { name: 'Zak (40kg cement bag)', symbol: 'zak', baseUnit: 'kg', factor: 40, category: 'cement' },
    
    // Tiles/Finishing
    box: { name: 'Box (1.44m² ceramic)', symbol: 'box', baseUnit: 'm2', factor: 1.44, category: 'tiles' },
    roll: { name: 'Roll (wallpaper/membrane)', symbol: 'roll', baseUnit: 'm2', factor: 10, category: 'finishing' },
    
    // Liquid/Paint
    kaleng: { name: 'Kaleng (25L paint can)', symbol: 'kaleng', baseUnit: 'liter', factor: 25, category: 'paint' },
    drum: { name: 'Drum (200L)', symbol: 'drum', baseUnit: 'liter', factor: 200, category: 'liquid' },
    
    // Aggregate
    truk: { name: 'Truk (7m³ ready mix)', symbol: 'truk', baseUnit: 'm3', factor: 7, category: 'concrete' },
    colt: { name: 'Colt (4m³ aggregate)', symbol: 'colt', baseUnit: 'm3', factor: 4, category: 'aggregate' },
    
    // Wood/Lumber
    keping: { name: 'Keping (plywood sheet)', symbol: 'keping', baseUnit: 'm2', factor: 2.88, category: 'wood' },
    kubik: { name: 'Kubik (1m³ timber)', symbol: 'kubik', baseUnit: 'm3', factor: 1, category: 'wood' }
  }
};

// Construction material density constants (kg/m³)
export const MATERIAL_DENSITIES = {
  concrete: 2400,
  steel: 7850,
  cement: 1440,
  sand: 1600,
  gravel: 1520,
  brick: 1800,
  wood_hardwood: 800,
  wood_softwood: 500,
  water: 1000,
  asphalt: 2300,
  gypsum: 1300,
  glass: 2500
};

// Construction wastage factors by material type
export const WASTAGE_FACTORS = {
  concrete: 0.05,      // 5%
  steel_rebar: 0.03,   // 3%
  brick: 0.05,         // 5%
  tiles: 0.10,         // 10%
  paint: 0.05,         // 5%
  cement: 0.02,        // 2%
  sand: 0.05,          // 5%
  gravel: 0.05,        // 5%
  wood: 0.10,          // 10%
  wallpaper: 0.15,     // 15%
  default: 0.05        // 5%
};

/**
 * Convert between construction units
 * @param {number} value - The value to convert
 * @param {string} fromUnit - Source unit
 * @param {string} toUnit - Target unit
 * @param {string} category - Unit category (LENGTH, AREA, VOLUME, WEIGHT, CONSTRUCTION)
 * @returns {number} Converted value
 */
export const convertUnits = (value, fromUnit, toUnit, category = null) => {
  if (!value || fromUnit === toUnit) return value;

  // Auto-detect category if not provided
  if (!category) {
    category = detectUnitCategory(fromUnit) || detectUnitCategory(toUnit);
  }

  if (!category) {
    throw new Error(`Unable to detect unit category for ${fromUnit} -> ${toUnit}`);
  }

  const units = CONSTRUCTION_UNITS[category];
  if (!units) {
    throw new Error(`Unknown unit category: ${category}`);
  }

  // Handle construction-specific units
  if (category === 'CONSTRUCTION') {
    return convertConstructionUnits(value, fromUnit, toUnit);
  }

  // Standard unit conversion
  const fromFactor = units[fromUnit]?.factor;
  const toFactor = units[toUnit]?.factor;

  if (fromFactor === undefined || toFactor === undefined) {
    throw new Error(`Unknown units: ${fromUnit} or ${toUnit} in category ${category}`);
  }

  return (value * fromFactor) / toFactor;
};

/**
 * Convert construction-specific units
 */
const convertConstructionUnits = (value, fromUnit, toUnit) => {
  const fromDef = CONSTRUCTION_UNITS.CONSTRUCTION[fromUnit];
  const toDef = CONSTRUCTION_UNITS.CONSTRUCTION[toUnit];

  if (!fromDef || !toDef) {
    throw new Error(`Unknown construction units: ${fromUnit} or ${toUnit}`);
  }

  // Convert from construction unit to base unit
  const baseValue = value * fromDef.factor;
  
  // Convert from base unit to target construction unit
  return baseValue / toDef.factor;
};

/**
 * Detect unit category based on unit symbol
 */
const detectUnitCategory = (unit) => {
  for (const [category, units] of Object.entries(CONSTRUCTION_UNITS)) {
    if (units[unit]) {
      return category;
    }
  }
  return null;
};

/**
 * Calculate material weight from volume and density
 * @param {number} volume - Volume in cubic meters
 * @param {string} materialType - Material type for density lookup
 * @returns {number} Weight in kilograms
 */
export const calculateWeight = (volume, materialType) => {
  const density = MATERIAL_DENSITIES[materialType.toLowerCase()];
  if (!density) {
    throw new Error(`Unknown material density for: ${materialType}`);
  }
  return volume * density;
};

/**
 * Calculate material volume from weight and density
 * @param {number} weight - Weight in kilograms
 * @param {string} materialType - Material type for density lookup
 * @returns {number} Volume in cubic meters
 */
export const calculateVolume = (weight, materialType) => {
  const density = MATERIAL_DENSITIES[materialType.toLowerCase()];
  if (!density) {
    throw new Error(`Unknown material density for: ${materialType}`);
  }
  return weight / density;
};

/**
 * Apply wastage factor to quantity
 * @param {number} quantity - Base quantity needed
 * @param {string} materialType - Material type for wastage lookup
 * @param {number} customWastage - Custom wastage factor (optional)
 * @returns {number} Quantity including wastage
 */
export const applyWastage = (quantity, materialType, customWastage = null) => {
  const wastage = customWastage || WASTAGE_FACTORS[materialType.toLowerCase()] || WASTAGE_FACTORS.default;
  return quantity * (1 + wastage);
};

/**
 * Format unit display with proper symbols
 * @param {number} value - Numeric value
 * @param {string} unit - Unit symbol
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted string
 */
export const formatUnitDisplay = (value, unit, decimals = 2) => {
  if (value === null || value === undefined) return '-';
  
  const formattedValue = typeof value === 'number' ? value.toFixed(decimals) : value;
  
  // Get unit symbol from definitions
  const unitDef = findUnitDefinition(unit);
  const symbol = unitDef?.symbol || unit;
  
  return `${formattedValue} ${symbol}`;
};

/**
 * Find unit definition across all categories
 */
const findUnitDefinition = (unit) => {
  for (const units of Object.values(CONSTRUCTION_UNITS)) {
    if (units[unit]) {
      return units[unit];
    }
  }
  return null;
};

/**
 * Get supported units for a category
 * @param {string} category - Unit category
 * @returns {Array} Array of unit objects
 */
export const getSupportedUnits = (category) => {
  const units = CONSTRUCTION_UNITS[category];
  if (!units) return [];
  
  return Object.entries(units).map(([key, value]) => ({
    key,
    name: value.name,
    symbol: value.symbol
  }));
};

/**
 * Convert common construction measurements
 */
export const constructionConverters = {
  // Rebar calculations
  rebarWeightFromLength: (length, diameter) => {
    // Weight = π × (d/2)² × length × density
    const radius = diameter / 2000; // Convert mm to m
    const area = Math.PI * radius * radius;
    return area * length * MATERIAL_DENSITIES.steel;
  },

  // Concrete calculations
  concreteComponents: (volume) => ({
    cement: volume * 320, // kg per m³
    sand: volume * 0.5,   // m³ per m³
    gravel: volume * 0.7, // m³ per m³
    water: volume * 160   // liters per m³
  }),

  // Area calculations
  wallPaintCoverage: (area, coats = 2) => {
    const coveragePerLiter = 12; // m² per liter
    return (area * coats) / coveragePerLiter;
  },

  // Tile calculations
  tileQuantity: (area, tileSize = 0.4) => {
    const tileArea = tileSize * tileSize;
    const baseTiles = area / tileArea;
    return applyWastage(baseTiles, 'tiles');
  }
};

/**
 * Validate unit conversion compatibility
 * @param {string} fromUnit - Source unit
 * @param {string} toUnit - Target unit
 * @returns {boolean} Whether conversion is possible
 */
export const isConversionValid = (fromUnit, toUnit) => {
  const fromCategory = detectUnitCategory(fromUnit);
  const toCategory = detectUnitCategory(toUnit);
  
  if (!fromCategory || !toCategory) return false;
  
  // Same category conversions are always valid
  if (fromCategory === toCategory) return true;
  
  // Special cases for construction units
  if (fromCategory === 'CONSTRUCTION' || toCategory === 'CONSTRUCTION') {
    const fromDef = CONSTRUCTION_UNITS.CONSTRUCTION[fromUnit];
    const toDef = CONSTRUCTION_UNITS.CONSTRUCTION[toUnit];
    
    if (fromDef && toDef) {
      return fromDef.baseUnit === toDef.baseUnit;
    }
  }
  
  return false;
};

export default {
  CONSTRUCTION_UNITS,
  MATERIAL_DENSITIES,
  WASTAGE_FACTORS,
  convertUnits,
  calculateWeight,
  calculateVolume,
  applyWastage,
  formatUnitDisplay,
  getSupportedUnits,
  constructionConverters,
  isConversionValid
};
