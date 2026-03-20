// Project Selector Dialog Component

import React, { memo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Typography,
  Button
} from '@mui/material';
import { Project } from '../types';
import { useI18n } from '../contexts/I18nContext';

interface ProjectSelectorProps {
  open: boolean;
  projects: Project[];
  selectedProjectId: number | null;
  onProjectSelect: (projectId: number) => void;
  onConfirm: () => void;
  onClose: () => void;
}

const ProjectSelector: React.FC<ProjectSelectorProps> = memo(({
  open,
  projects,
  selectedProjectId,
  onProjectSelect,
  onConfirm,
  onClose
}) => {
  const { t } = useI18n();
  
  return (
    <Dialog
      open={open}
      onClose={(_event, reason) => {
        if (reason !== 'backdropClick') {
          onClose();
        }
      }}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>{t('projectSelector.dialogTitle')}</DialogTitle>
      <DialogContent>
        <RadioGroup
          value={selectedProjectId ?? ''}
          onChange={(e) => onProjectSelect(Number(e.target.value))}
        >
          {projects.map((proj,index) => (
            <FormControlLabel
              key={proj.id}
              value={proj.id}
              control={<Radio />}
              label={
                <Box>
                  <Typography fontWeight="bold">{t('projectSelector.projectLabel', { index: String(index + 1) })}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('projectSelector.projectDescription')}
                  </Typography>
                </Box>
              }
              sx={{ mb: 2 }}
              disabled={proj.is_flags_enabled === true}
            />
          ))}
        </RadioGroup>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            variant="contained"
            onClick={onConfirm}
            disabled={selectedProjectId === null}
            aria-label={t('common.confirm')}
          >
            {t('common.confirm')}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
});

ProjectSelector.displayName = 'ProjectSelector';

export default ProjectSelector;
