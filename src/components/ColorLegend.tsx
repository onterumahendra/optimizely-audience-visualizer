// Color Legend Component
// Follows Single Responsibility Principle - displays color scale legend

import React, { memo } from 'react';
import { ColorBin } from '../types';

interface ColorLegendProps {
  colorBins: ColorBin[];
  min: number;
  max: number;
}

const ColorLegend: React.FC<ColorLegendProps> = memo(({ colorBins, min, max }) => {
  const rangeLabels = colorBins.map(b => Math.round(min + b.threshold * (max - min)));

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, paddingRight: '50px' }}>
      <div style={{ display: 'flex' }}>
        {rangeLabels.map((label, idx) => (
          <span
            key={idx}
            style={{
              flex: 1,
              fontSize: 12,
              color: '#000',
              textAlign: 'right',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {label}
          </span>
        ))}
      </div>
      <div style={{ display: 'flex' }}>
        {colorBins.map((bin) => (
          <div
            key={bin.color}
            style={{
              flex: 1,
              background: bin.color,
              height: 10
            }}
          />
        ))}
      </div>
    </div>
  );
});

ColorLegend.displayName = 'ColorLegend';

export default ColorLegend;
