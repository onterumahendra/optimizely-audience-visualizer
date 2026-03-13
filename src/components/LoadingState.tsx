// Loading State Component
// Follows Single Responsibility Principle - displays loading state

import React, { memo } from 'react';
import { Box, Typography, Skeleton } from '@mui/material';

const LoadingState: React.FC = memo(() => {
  return (
    <Box sx={{ p: 3, mt: 2 }} className="styled-box">
      <Typography variant="subtitle1" sx={{ mb: 2, textAlign: 'center' }}>
        Fetching your data. Please wait while we process everything for you.
        <br />
        This may take a moment to ensure accuracy across all endpoints.
      </Typography>
      <Skeleton variant="rectangular" width="100%" height={40} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" width="100%" height={120} />
    </Box>
  );
});

LoadingState.displayName = 'LoadingState';

export default LoadingState;
