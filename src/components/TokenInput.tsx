// Token Input Component
// Follows Single Responsibility Principle - handles token input UI

import React, { memo } from 'react';
import { Grid, TextField, Button, Typography, FormHelperText } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useI18n } from '../contexts/I18nContext';

interface TokenInputProps {
  token: string;
  onTokenChange: (token: string) => void;
  onContinue: () => void;
  onHelpClick: () => void;
  loading: boolean;
  error: string | null;
}

const TokenInput: React.FC<TokenInputProps> = memo(({
  token,
  onTokenChange,
  onContinue,
  onHelpClick,
  loading,
  error
}) => {
  const { t } = useI18n();
  const theme = useTheme();

  return (
    <>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 10 }}>
          <TextField
            label={t('tokenInput.label')}
            value={token}
            onChange={(e) => onTokenChange(e.target.value)}
            fullWidth
            size="small"
            type="password"
            aria-label={t('tokenInput.ariaLabel')}
            placeholder={t('tokenInput.placeholder')}
          />
          <FormHelperText
            onClick={onHelpClick}
            sx={{
              cursor: 'pointer',
              textDecoration: 'underline',
              mt: 1,
              color: 'primary.main',
              width: '100%',
              textAlign: theme.direction === 'rtl' ? 'right' : 'left'
            }}
          >
            {t('tokenInput.helpTooltip')}
          </FormHelperText>
        </Grid>

        <Grid size={{ xs: 12, md: 2 }}>
          <Button
            variant="contained"
            onClick={onContinue}
            disabled={loading || !token}
            fullWidth
            aria-label={t('common.continue')}
          >
            {t('common.continue')}
          </Button>
        </Grid>
      </Grid>

      {error && (
        <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
          {error}
        </Typography>
      )}
    </>
  );
});

TokenInput.displayName = 'TokenInput';

export default TokenInput;
