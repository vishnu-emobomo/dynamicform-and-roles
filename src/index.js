import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import App from './App';
import { AuthProvider } from './Authorization/AuthContext';

// Create a theme
const theme = createTheme({
  spacing: 8, // default spacing multiplier (optional, as it's 8 by default)
  // Add other theme customizations here if needed
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 
  <AuthProvider>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </AuthProvider>
);

