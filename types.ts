export interface FilterConfig {
  id: string;
  index: number;
  label: string;
  wavelength: number; // Typical wavelength in nm
  color: string; // Hex color for UI representation
  range: [number, number, number]; // Min, Typ, Max
}

export interface SpectralDataPoint {
  filter: FilterConfig;
  value: number;
}

export interface LogEntry {
  timestamp: string;
  values: number[]; // Array of 18 raw values
  cct: number;
}

export enum ConnectionStatus {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  ERROR = 'ERROR',
}