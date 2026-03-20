// Loading State Component
// Follows Single Responsibility Principle - displays loading state

import React, { memo } from 'react';
import { Paper, Typography, Skeleton } from '@mui/material';
import { useI18n } from '../contexts/I18nContext';

const LoadingState: React.FC = memo(() => {
  const { t } = useI18n();
  
  return (
    <Paper sx={{ p: 3, mt: 2, borderRadius: '28px' }} elevation={2}>
      <Typography variant="subtitle1" sx={{ mb: 2, textAlign: 'center' }}>
        {t('loadingState.fetchingProjects')}
      </Typography>
      <Skeleton variant="rectangular" width="100%" height={40} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" width="100%" height={120} />
    </Paper>
  );
});

LoadingState.displayName = 'LoadingState';

export default LoadingState;
