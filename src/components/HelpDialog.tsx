import React, { memo } from 'react';
import { Dialog, DialogTitle, DialogContent, Box, Button } from '@mui/material';
import { useI18n } from '../contexts/I18nContext';

interface HelpDialogProps {
  open: boolean;
  onClose: () => void;
}

const HelpDialog: React.FC<HelpDialogProps> = memo(({ open, onClose }) => {
  const { t } = useI18n();
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('helpDialog.title')}</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <ol style={{ paddingInlineStart: 20, lineHeight: 2 }}>
            <li>
              {t('helpDialog.step1')} {' '}
              <a href="https://app.optimizely.com" target="_blank" rel="noopener noreferrer">
                app.optimizely.com
              </a>.
            </li>
            <li>{t('helpDialog.step2')}</li>
            <li>{t('helpDialog.step3')}</li>
            <li>{t('helpDialog.step4')}</li>
          </ol>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={onClose} variant="contained" aria-label={t('common.close')}>
            {t('common.close')}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
});

HelpDialog.displayName = 'HelpDialog';

export default HelpDialog;
