import { createTheme } from '@mui/material/styles';
import { arEG } from '@mui/material/locale';
import { create } from 'jss';
import rtl from 'jss-rtl';
import { StylesProvider, jssPreset } from '@mui/styles';

const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

export const RTLProvider = ({ children }) => (
  <StylesProvider jss={jss}>{children}</StylesProvider>
);

export const lightTheme = createTheme(
  {
    direction: 'rtl',
    palette: {
      mode: 'light',
      primary: {
        main: '#1976d2',
        light: '#42a5f5',
        dark: '#1565c0',
      },
      secondary: {
        main: '#dc004e',
        light: '#ff5983',
        dark: '#9a0036',
      },
      background: {
        default: '#f5f5f5',
        paper: '#ffffff',
      },
    },
    typography: {
      fontFamily: '"Cairo", "Arial", sans-serif',
    },
  },
  arEG
);

export const darkTheme = createTheme(
  {
    direction: 'rtl',
    palette: {
      mode: 'dark',
      primary: {
        main: '#90caf9',
        light: '#e3f2fd',
        dark: '#42a5f5',
      },
      secondary: {
        main: '#f48fb1',
        light: '#fce4ec',
        dark: '#ad1457',
      },
      background: {
        default: '#121212',
        paper: '#1e1e1e',
      },
    },
    typography: {
      fontFamily: '"Cairo", "Arial", sans-serif',
    },
  },
  arEG
);
