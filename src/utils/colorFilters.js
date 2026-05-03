/**
 * Color Filter Functions
 * Simulates color blindness by applying color transformation matrices
 */

export const colorFilters = {
  deuteranopia: (r, g, b) => {
    return {
      r: 0.367 * r + 0.861 * g - 0.228 * b,
      g: 0.280 * r + 0.673 * g + 0.047 * b,
      b: -0.012 * r + 0.043 * g + 0.969 * b,
    };
  },
  
  protanopia: (r, g, b) => {
    return {
      r: 0.152 * r + 1.053 * g - 0.205 * b,
      g: 0.115 * r + 0.786 * g + 0.099 * b,
      b: -0.004 * r - 0.048 * g + 1.052 * b,
    };
  },
  
  tritanopia: (r, g, b) => {
    return {
      r: 1.256 * r - 0.077 * g - 0.179 * b,
      g: -0.078 * r + 0.931 * g + 0.148 * b,
      b: 0.005 * r + 0.691 * g + 0.304 * b,
    };
  },
  
  monochromacy: (r, g, b) => {
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    return { r: gray, g: gray, b: gray };
  },
  
  deuteranomaly: (r, g, b) => {
    return {
      r: 0.625 * r + 0.375 * g,
      g: 0.700 * r + 0.300 * g,
      b: 0.300 * g + 0.700 * b,
    };
  },
};

/**
 * Apply color filter to ImageData
 * @param {ImageData} imageData - Canvas image data
 * @param {string} filterType - Type of filter to apply
 * @returns {ImageData} Filtered image data
 */
export const applyColorFilter = (imageData, filterType) => {
  const filter = colorFilters[filterType];
  if (!filter) return imageData;

  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const filtered = filter(r, g, b);

    data[i] = Math.max(0, Math.min(255, filtered.r));
    data[i + 1] = Math.max(0, Math.min(255, filtered.g));
    data[i + 2] = Math.max(0, Math.min(255, filtered.b));
  }

  return imageData;
};

/**
 * Convert hex color to RGB and apply color filter
 * @param {string} hexColor - Hex color string (e.g., '#e85d6b')
 * @param {string} filterType - Type of filter to apply
 * @returns {string} Filtered hex color string
 */
export const applyFilterToHexColor = (hexColor, filterType) => {
  if (filterType === 'normal') return hexColor;

  const filter = colorFilters[filterType];
  if (!filter) return hexColor;

  // Convert hex to RGB
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Apply filter
  const filtered = filter(r, g, b);

  // Convert back to hex
  const toHex = (value) => {
    const clamped = Math.max(0, Math.min(255, Math.round(value)));
    return clamped.toString(16).padStart(2, '0');
  };

  return `#${toHex(filtered.r)}${toHex(filtered.g)}${toHex(filtered.b)}`;
};
