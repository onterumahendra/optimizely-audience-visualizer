import React, { memo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Grid,
  FormControlLabel,
  Checkbox,
  TextField,
  Divider,
  Typography,
  Button,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface AudienceFilterDialogProps {
  open: boolean;
  allAudienceNames: string[];
  selectedNames: string[];
  filterText: string;
  onFilterChange: (text: string) => void;
  onSelectionChange: (names: string[]) => void;
  onClose: () => void;
  onApply: () => void;
}

const AudienceFilterDialog: React.FC<AudienceFilterDialogProps> = memo(({
  open,
  allAudienceNames,
  selectedNames,
  filterText,
  onFilterChange,
  onSelectionChange,
  onClose,
  onApply
}) => {
  const filteredNames = allAudienceNames.filter(name =>
    name.toLowerCase().includes(filterText.toLowerCase())
  );

  const allSelected = selectedNames.length === filteredNames.length && filteredNames.length > 0;
  const isIndeterminate = selectedNames.length > 0 && selectedNames.length < filteredNames.length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(filteredNames);
    } else {
      onSelectionChange([]);
    }
  };

  const handleToggle = (name: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedNames, name]);
    } else {
      onSelectionChange(selectedNames.filter(n => n !== name));
    }
  };

  return (
    <Dialog
      open={open}
      onClose={(_event, reason) => {
        if (reason !== 'backdropClick') {
          onClose();
        }
      }}
      maxWidth="xl"
      fullWidth
      PaperProps={{
        style: {
          height: '90vh',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column'
        }
      }}
    >
      <DialogTitle>
        Filter Audiences
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
          size="large"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        <Box display="flex" flexDirection="column" gap={2}>
          <Grid container alignItems="center" spacing={2}>
            <Grid size={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={allSelected}
                    indeterminate={isIndeterminate}
                    onChange={(_, checked) => handleSelectAll(checked)}
                  />
                }
                label="Select All"
              />
            </Grid>
            <Grid size={6}>
              <TextField
                size="small"
                placeholder="Filter audiences"
                value={filterText}
                onChange={(e) => onFilterChange(e.target.value)}
                fullWidth
              />
            </Grid>
          </Grid>
          
          <Divider />
          
          <Box display="flex" flexDirection="column" maxHeight="90%" overflow="auto" gap={0}>
            {filteredNames.length === 0 ? (
              <Typography variant="body2">No audiences found.</Typography>
            ) : (
              <Grid container spacing={2}>
                {filteredNames.map(name => (
                  <Grid
                    key={name}
                    size={{ xs: 12, sm: 4, md: 3 }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedNames.includes(name)}
                          onChange={(_, checked) => handleToggle(name, checked)}
                        />
                      }
                      label={name}
                      title={name}
                      sx={{
                        width: '100%',
                        '& .MuiFormControlLabel-label': {
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Box>
      </DialogContent>
      
      <Box display="flex" justifyContent="flex-end" gap={2} p={2}>
        <Button onClick={onClose} variant="text">
          Cancel
        </Button>
        <Button
          onClick={onApply}
          variant="contained"
          disabled={selectedNames.length === 0}
        >
          Apply
        </Button>
      </Box>
    </Dialog>
  );
});

AudienceFilterDialog.displayName = 'AudienceFilterDialog';

export default AudienceFilterDialog;
