// ============================================
// Domain Models
// Core business entities used throughout the application
// ============================================

export type Project = {
  id: number;
  name: string;
  description: string;
  account_id: number;
  is_flags_enabled: boolean;
};

export type Experiment = {
  id: number;
  name: string;
  status: string;
  last_modified: string;
  variations: any[];  // Complex structure from Optimizely API
  audience_conditions: any;  // Nested conditions from Optimizely API
};

export type Variation = {
  name: string;
  weight: number;
};

export type AudienceExperiment = {
  id: number;
  name: string;
  last_modified: string;
  variations: Variation[];
};

export type AudienceModel = {
  name: string;
  audId: number;
  projectId: number;
  experiments: AudienceExperiment[];
};

// ============================================
// UI Configuration Types
// ============================================

/**
 * Color bin configuration for treemap visualization
 * Used to define color gradients based on value thresholds
 */
export interface ColorBin {
  color: string;      // Hex color code
  threshold: number;  // Threshold value (0.0 to 1.0)
}

/**
 * Treemap cell data
 * Represents a single audience block in the treemap
 */
export interface TreemapCellData {
  name: string;
  value: number;
  audId: number;
  experiments: AudienceExperiment[];
  [key: string]: any;  // Additional props from Recharts
}
