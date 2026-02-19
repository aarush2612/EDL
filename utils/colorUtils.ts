import { FilterConfig } from '../types';

/**
 * Approximates CCT using McCamy's formula.
 * This is a simplified estimation. A rigorous calculation would require
 * precise Color Matching Functions (CMF) integration for the specific sensor sensitivity curves.
 * 
 * We approximate XYZ tristimulus values by weighting the spectral bands against standard observer curves.
 */
export const calculateCCT = (spectralData: { filter: FilterConfig; value: number }[]): number => {
  let X = 0;
  let Y = 0;
  let Z = 0;

  // Simple integration approximation
  // Real implementation would use 3x12 matrix derived from sensor calibration
  spectralData.forEach(({ filter, value }) => {
    // These weights are rough approximations of the CIE 1931 color matching functions
    // tuned to the specific peak wavelengths of the sensor.
    const wl = filter.wavelength;
    
    // Weight for Z (Blue)
    if (wl < 500) {
      Z += value * (1.0 - (wl - 400) / 100); 
    } else if (wl < 550) {
      Z += value * 0.1;
    }

    // Weight for Y (Green/Luminance)
    if (wl > 450 && wl < 650) {
        // Gaussian-ish peak around 555nm
        const dist = Math.abs(wl - 555);
        const weight = Math.exp(-(dist * dist) / (2 * 50 * 50));
        Y += value * weight;
    }

    // Weight for X (Red + small blue bump)
    if (wl < 500) {
        X += value * 0.1; // Small blue lobe
    }
    if (wl > 500) {
        // Red lobe peaking around 600
        const dist = Math.abs(wl - 600);
        const weight = Math.exp(-(dist * dist) / (2 * 60 * 60));
        X += value * weight;
    }
  });

  // Prevent division by zero
  const sum = X + Y + Z;
  if (sum === 0) return 0;

  const x = X / sum;
  const y = Y / sum;

  // McCamy's Formula
  const n = (x - 0.3320) / (0.1858 - y);
  const cct = 449.0 * Math.pow(n, 3) + 3525.0 * Math.pow(n, 2) + 6823.3 * n + 5520.33;

  return Math.max(0, Math.round(cct));
};
