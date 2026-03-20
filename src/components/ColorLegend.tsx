// Color Legend Component
// Follows Single Responsibility Principle - displays color scale legend

import React, { memo } from 'react';
import { Box } from '@mui/material';
import { ColorBin } from '../types';

interface ColorLegendProps {
  colorBins: ColorBin[];
  min: number;
  max: number;
}

const ColorLegend: React.FC<ColorLegendProps> = memo(({ colorBins, min, max }) => {
  const rangeLabels = colorBins.map(b => Math.round(min + b.threshold * (max - min)));

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, paddingInlineEnd: '50px' }}>
      <Box sx={{ display: 'flex' }}>
        {rangeLabels.map((label, idx) => (
          <Box
            key={idx}
            component="span"
            sx={{
              flex: 1,
              fontSize: 12,
              color: 'text.primary',
              textAlign: 'end',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {label}
          </Box>
        ))}
      </Box>
      <Box sx={{ display: 'flex' }}>
        {colorBins.map((bin) => (
          <Box
            key={bin.color}
            sx={{
              flex: 1,
              background: bin.color,
              height: 10
            }}
          />
        ))}
      </Box>
    </Box>
  );
});

ColorLegend.displayName = 'ColorLegend';

export default ColorLegend;
