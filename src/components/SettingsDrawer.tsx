// Settings Drawer Component
// Follows Single Responsibility Principle - handles settings UI in a drawer
// Generic and reusable settings panel

import React, { memo } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  SelectChangeEvent,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import { useI18n } from '../contexts/I18nContext';
import { useTheme } from '../contexts/ThemeContext';
import { supportedLanguages, SupportedLanguage } from '../locales';

interface SettingsDrawerProps {
  open: boolean;
  onClose: () => void;
}

const SettingsDrawer: React.FC<SettingsDrawerProps> = memo(({ open, onClose }) => {
  const { language, setLanguage, t } = useI18n();
  const { mode, setMode } = useTheme();

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    const newLang = event.target.value as SupportedLanguage;
    setLanguage(newLang);
  };

  const handleThemeChange = (_event: React.MouseEvent<HTMLElement>, newMode: string | null) => {
    if (newMode !== null) {
      setMode(newMode as 'light' | 'dark' | 'auto');
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: { xs: '100%', sm: 360 } }
      }}
    >
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" component="h2">
            {t('common.settings')}
          </Typography>
          <IconButton onClick={onClose} edge="end" aria-label={t('common.close')}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />

        {/* Theme Settings */}
        <Box>
          <Typography variant="subtitle2" sx={{ mt: 2, mb:1, fontWeight: 600 }}>
            {t('theme.modeLabel')}
          </Typography>
          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={handleThemeChange}
            aria-label={t('theme.toggleTheme')}
            fullWidth
            size="small"
          >
            <ToggleButton value="light" aria-label={t('theme.light')}>
              <LightModeIcon sx={{ mr: 1 }} fontSize="small" />
              {t('theme.light')}
            </ToggleButton>
            <ToggleButton value="auto" aria-label={t('theme.system')}>
              <SettingsBrightnessIcon sx={{ mr: 1 }} fontSize="small" />
              {t('theme.system')}
            </ToggleButton>
            <ToggleButton value="dark" aria-label={t('theme.dark')}>
              <DarkModeIcon sx={{ mr: 1 }} fontSize="small" />
              {t('theme.dark')}
            </ToggleButton>
          </ToggleButtonGroup>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            {t('theme.systemDescription')}
          </Typography>
        </Box>

        {/* Language Settings */}
        <Box >
          <Typography variant="subtitle2" sx={{ mt: 2, mb:1, fontWeight: 600 }}>
            {t('language.title')}
          </Typography>
          <FormControl fullWidth size="small">
            <InputLabel id="settings-language-label">{t('language.title')}</InputLabel>
            <Select
              labelId="settings-language-label"
              value={language}
              onChange={handleLanguageChange}
              label={t('language.title')}
              aria-label={t('language.title')}
            >
              {Object.entries(supportedLanguages).map(([code, name]) => (
                <MenuItem key={code} value={code}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>


        {/* Additional Info */}
        <Box sx={{ mt: 2}}>
          <Typography variant="caption" color="text.secondary">
            {t('common.settingsSaved')}
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
});

SettingsDrawer.displayName = 'SettingsDrawer';

export default SettingsDrawer;
