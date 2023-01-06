import React from 'react';
import ReactDOM from 'react-dom/client';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './index.css';
import App from './App';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3c8cec',
    },
    secondary: {
      main: '#ebebec',
    },
    warning: {
      main: '#F18F01',
      contrastText: '#ffffff',
    }
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);