import { createTheme } from '@mui/material/styles';

// Create a custom theme for Onter
const onterTheme = createTheme({
  palette: {
    primary: {
      main: '#2563EB',
      light: '#60A5FA',
      dark: '#1E40AF',
      contrastText: '#FFFFFF',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

export default onterTheme;
