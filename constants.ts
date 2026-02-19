import { FilterConfig } from './types';

// Mapping based on the provided Python dictionary
// 0: FZ, 1: FY, 2: FXL, 3: NIR
// 6: F2, 7: F3, 8: F4, 9: F6
// 12: F1, 13: F7, 14: F8, 15: F5

export const SPECTRAL_FILTERS: FilterConfig[] = [
  { id: 'F1', index: 12, label: 'F1', wavelength: 407, color: '#7600ed', range: [397, 407, 417] },
  { id: 'F2', index: 6, label: 'F2', wavelength: 424, color: '#0028ff', range: [414, 424, 434] },
  { id: 'FZ', index: 0, label: 'FZ', wavelength: 450, color: '#0070ff', range: [440, 450, 460] },
  { id: 'F3', index: 7, label: 'F3', wavelength: 473, color: '#00d5ff', range: [463, 473, 483] },
  { id: 'F4', index: 8, label: 'F4', wavelength: 516, color: '#1fff00', range: [506, 516, 526] },
  { id: 'F5', index: 15, label: 'F5', wavelength: 546, color: '#a3ff00', range: [536, 546, 556] },
  { id: 'FY', index: 1, label: 'FY', wavelength: 560, color: '#ccff00', range: [550, 560, 570] },
  { id: 'FXL', index: 2, label: 'FXL', wavelength: 596, color: '#ffb300', range: [586, 596, 606] },
  { id: 'F6', index: 9, label: 'F6', wavelength: 636, color: '#ff5100', range: [626, 636, 646] },
  { id: 'F7', index: 13, label: 'F7', wavelength: 687, color: '#ff0000', range: [677, 687, 697] },
  { id: 'F8', index: 14, label: 'F8', wavelength: 748, color: '#b30000', range: [738, 748, 758] },
  { id: 'NIR', index: 3, label: 'NIR', wavelength: 855, color: '#520000', range: [845, 855, 865] },
];

// Sort by wavelength for graphing purposes
export const SORTED_FILTERS = [...SPECTRAL_FILTERS].sort((a, b) => a.wavelength - b.wavelength);

// Expected data length from the serial port
export const EXPECTED_DATA_LENGTH = 18;

// Special indices
export const FLICKER_INDEX = 5;

// Threshold for detecting flicker on the monitored channel
export const FLICKER_THRESHOLD = 20000;
