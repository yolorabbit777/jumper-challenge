'use client';
import { ThemeProvider, CssBaseline } from '@mui/material';
import darkTheme from '@/theme';
import { AppKitProvider } from './AppKit';
import { JWTContextProvider } from './JWTContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AppKitProvider>
        <JWTContextProvider>
          {children}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            theme="light"
            hideProgressBar={false}
            closeOnClick
            pauseOnHover
          />
        </JWTContextProvider>
      </AppKitProvider>
    </ThemeProvider>
  );
}; 