import React, { memo } from 'react';
import { Button, FormHelperText, Grid, TextField, Typography } from '@mui/material';

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
        <Grid size={{ xs: 12, md: 10 }}>

          <TextField
            label="Optimizely API Bearer Token"
            value={token}
            onChange={(e) => onTokenChange(e.target.value)}
            fullWidth
            size="small"
            type="password"
          />
          <FormHelperText
            onClick={onHelpClick}
            sx={{ 
              cursor: 'pointer', 
              textDecoration: 'underline', 
              mt: 0.5,
              color: 'primary.main'
            }}
          >
            How do I generate a bearer token?
          </FormHelperText>

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
