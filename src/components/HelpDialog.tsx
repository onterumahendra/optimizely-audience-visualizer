import React, { memo } from 'react';
import { Dialog, DialogTitle, DialogContent, Box, Button } from '@mui/material';

interface HelpDialogProps {
  open: boolean;
  onClose: () => void;
}

const HelpDialog: React.FC<HelpDialogProps> = memo(({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>How to Generate Optimizely API Token</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <ol style={{ paddingLeft: 20, lineHeight: 2 }}>
            <li>
              Log in to your Optimizely account at{' '}
              <a href="https://app.optimizely.com" target="_blank" rel="noopener noreferrer">
                app.optimizely.com
              </a>.
            </li>
            <li>
              Click on <strong>Profile</strong> in the bottom left-hand corner of the navigation sidebar.
            </li>
            <li>
              Select the <strong>API Access</strong> tab.
            </li>
            <li>
              Click <strong>Generate New Token</strong>.
            </li>
            <li>
              Enter a name for your token and click <strong>Create</strong>.
            </li>
            <li>
              Copy the token immediately. For security, it will not be displayed again once you leave the page.
            </li>
          </ol>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={onClose} variant="contained">
            Close
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
});

HelpDialog.displayName = 'HelpDialog';

export default HelpDialog;
