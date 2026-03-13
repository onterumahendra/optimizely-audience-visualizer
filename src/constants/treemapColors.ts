/**
 * Treemap Color Configuration
 * 
 * This file defines the color scheme for the audience treemap visualization.
 * Feel free to customize these colors to match your brand or preferences.
 * 
 * Color Scheme: Classic "Stoplight" with 6 shades
 * - Higher experiment counts = Red (indicates high usage/attention needed)
 * - Medium experiment counts = Yellow (indicates moderate usage)
 * - Lower experiment counts = Green (indicates low usage)
 * 
 * How it works:
 * - Each color has a threshold (0.0 to 1.0) representing the normalized position
 * - The algorithm finds the first color where the normalized value >= threshold
 * - Colors are checked from top to bottom, so higher thresholds should come first
 */

import { ColorBin } from '../types';

/**
 * Default color bins for the treemap
 * 
 * You can customize this array to use your own colors.
 * Examples of alternative color schemes:
 * 
 * 1. Blue gradient (cool theme):
 *    { color: '#0d47a1', threshold: 0.83 },  // Dark blue
 *    { color: '#1976d2', threshold: 0.67 },  // Blue
 *    { color: '#42a5f5', threshold: 0.50 },  // Light blue
 *    { color: '#64b5f6', threshold: 0.33 },  // Lighter blue
 *    { color: '#90caf9', threshold: 0.17 },  // Very light blue
 *    { color: '#bbdefb', threshold: 0.0 },   // Pale blue
 * 
 * 2. Purple gradient (modern theme):
 *    { color: '#4a148c', threshold: 0.83 },  // Dark purple
 *    { color: '#7b1fa2', threshold: 0.67 },  // Purple
 *    { color: '#9c27b0', threshold: 0.50 },  // Medium purple
 *    { color: '#ab47bc', threshold: 0.33 },  // Light purple
 *    { color: '#ba68c8', threshold: 0.17 },  // Lighter purple
 *    { color: '#ce93d8', threshold: 0.0 },   // Pale purple
 */
export const colorBins: ColorBin[] = [
  { color: '#c23e15', threshold: 0.83 },  // Dark Red - Highest (83-100%)
  { color: '#e24b1a', threshold: 0.67 },  // Red - High (67-83%)
  { color: '#f6bc33', threshold: 0.50 },  // Yellow - Medium-High (50-67%)
  { color: '#d9a52e', threshold: 0.33 },  // Dark Yellow - Medium (33-50%)
  { color: '#6da81e', threshold: 0.17 },  // Green - Low (17-33%)
  { color: '#5a8c19', threshold: 0.0 },   // Dark Green - Lowest (0-17%)
];

/**
 * Utility function to get color based on normalized value
 * 
 * @param val - The actual value (e.g., experiment count)
 * @param min - Minimum value in the dataset
 * @param max - Maximum value in the dataset
 * @returns Hex color string
 */
export function getBinColor(val: number, min: number, max: number): string {
  if (max === min) return colorBins[0].color;
  
  const norm = (val - min) / (max - min);
  
  for (let i = 0; i < colorBins.length; i++) {
    if (norm >= colorBins[i].threshold) {
      return colorBins[i].color;
    }
  }
  
  return colorBins[colorBins.length - 1].color;
}
