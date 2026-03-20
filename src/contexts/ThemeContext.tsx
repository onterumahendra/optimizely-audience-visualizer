// Theme Context - Provides theme switching functionality with auto-detection and RTL support
// Follows Single Responsibility Principle - handles only theme state and switching

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useMemo } from 'react';
import { createTheme, Theme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';

export type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  actualMode: PaletteMode; // The actual applied mode (light or dark, never auto)
  toggleTheme: () => void;
  direction: 'ltr' | 'rtl';
  setDirection: (dir: 'ltr' | 'rtl') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'optimizely_theme';

// Centralized color palette
const colors = {
  primary: {
    main: '#2563EB',
    light: '#60A5FA',
    dark: '#1E40AF',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#8B5CF6',
    light: '#A78BFA',
    dark: '#7C3AED',
    contrastText: '#FFFFFF',
  },
  error: {
    main: '#EF4444',
    light: '#F87171',
    dark: '#DC2626',
    contrastText: '#FFFFFF',
  },
  warning: {
    main: '#F59E0B',
    light: '#FCD34D',
    dark: '#D97706',
    contrastText: '#FFFFFF',
  },
  info: {
    main: '#3B82F6',
    light: '#93C5FD',
    dark: '#2563EB',
    contrastText: '#FFFFFF',
  },
  success: {
    main: '#10B981',
    light: '#6EE7B7',
    dark: '#059669',
    contrastText: '#FFFFFF',
  },
  light: {
    background: {
      default: '#F9FAFB',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#111827',
      secondary: '#6B7280',
      disabled: '#9CA3AF',
    },
  },
  dark: {
    background: {
      default: '#0F172A',
      paper: '#1E293B',
    },
    text: {
      primary: '#F1F5F9',
      secondary: '#CBD5E1',
      disabled: '#64748B',
    },
  },
} as const;

// Determine theme based on time of day (6 AM - 6 PM = light, otherwise dark)
function getAutoTheme(): PaletteMode {
  const hour = new Date().getHours();
  return (hour >= 6 && hour < 18) ? 'light' : 'dark';
}

// Create theme configuration with RTL support
function createAppTheme(mode: PaletteMode, direction: 'ltr' | 'rtl'): Theme {
  const isLight = mode === 'light';
  
  return createTheme({
    direction,
    palette: {
      mode,
      primary: colors.primary,
      secondary: colors.secondary,
      error: colors.error,
      warning: colors.warning,
      info: colors.info,
      success: colors.success,
      background: isLight ? colors.light.background : colors.dark.background,
      text: isLight ? colors.light.text : colors.dark.text,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: '8px',
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            textTransform: 'none',
          },
        },
      },
      MuiToggleButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: '16px',
          },
        },
      },
    },
    typography: {
      fontFamily: direction === 'rtl' 
        ? 'Roboto, "Helvetica Neue", Arabic, sans-serif'
        : '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
  });
}

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored && (stored === 'light' || stored === 'dark' || stored === 'auto')) {
        return stored as ThemeMode;
      }
    } catch (error) {
      console.error('Failed to read theme from localStorage:', error);
    }
    return 'auto';
  });

  const [actualMode, setActualMode] = useState<PaletteMode>(() => {
    return mode === 'auto' ? getAutoTheme() : mode;
  });

  const [direction, setDirection] = useState<'ltr' | 'rtl'>(() => {
    // Direction is set by I18nContext based on language
    return (document.documentElement.dir as 'ltr' | 'rtl') || 'ltr';
  });

  const setMode = useCallback((newMode: ThemeMode) => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newMode);
      setModeState(newMode);
    } catch (error) {
      console.error('Failed to save theme to localStorage:', error);
      setModeState(newMode);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const currentActual = mode === 'auto' ? getAutoTheme() : mode;
    const newMode = currentActual === 'light' ? 'dark' : 'light';
    setMode(newMode);
  }, [mode, setMode]);

  // Update actual mode when mode changes or time changes (for auto mode)
  useEffect(() => {
    if (mode === 'auto') {
      const updateTheme = () => {
        setActualMode(getAutoTheme());
      };
      
      updateTheme();
      
      // Check every minute for time changes
      const interval = setInterval(updateTheme, 60000);
      
      return () => clearInterval(interval);
    } else {
      setActualMode(mode);
    }
  }, [mode]);

  // Listen for direction changes from language selection
  useEffect(() => {
    const handleDirectionChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.direction) {
        setDirection(customEvent.detail.direction);
      }
    };

    window.addEventListener('languageDirectionChange', handleDirectionChange);
    
    return () => {
      window.removeEventListener('languageDirectionChange', handleDirectionChange);
    };
  }, []);

  const theme = useMemo(() => createAppTheme(actualMode, direction), [actualMode, direction]);

  return (
    <ThemeContext.Provider value={{ mode, setMode, actualMode, toggleTheme, direction, setDirection }}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Export centralized colors for use in non-MUI components
export { colors };
