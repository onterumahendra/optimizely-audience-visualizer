// Token Input Component
// Follows Single Responsibility Principle - handles token input UI

import React, { memo } from 'react';
import { Grid, TextField, Button, Typography, Tooltip } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

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
  return (
    <>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 10 }} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextField
            label="Optimizely API Bearer Token"
            value={token}
            onChange={(e) => onTokenChange(e.target.value)}
            fullWidth
            size="small"
            type="password"
          />
          <Tooltip title="How to generate Token">
            <Button onClick={onHelpClick}>
              <HelpOutlineIcon />
            </Button>
          </Tooltip>
        </Grid>

        <Grid size={{ xs: 12, md: 2 }}>
          <Button
            variant="contained"
            onClick={onContinue}
            disabled={loading || !token}
            fullWidth
          >
            Continue
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
