'use client';

import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2196f3',
      light: '#4dabf5',
      dark: '#1976d2',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#e0e0e0',
      secondary: '#a0a0a0',
    },
    divider: '#333333',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#121212',
          minHeight: '100vh'
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1e1e',
          borderBottom: '1px solid #333333',
          boxShadow: 'none',
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        outlined: {
          borderColor: '#2196f3',
          color: '#fff',
          '&:hover': {
            borderColor: '#4dabf5',
            borderWidth: 2,
          }
        }
      }
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1e1e',
          borderRadius: 8,
        }
      }
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableRow-root': {
            backgroundColor: '#1976d2',
            '& .MuiTableCell-root': {
              color: '#fff',
              fontWeight: 600
            }
          }
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: '#333333',
          color: '#e0e0e0'
        }
      }
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)'
          }
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: '#1976d2',
          color: '#fff'
        }
      }
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    button: {
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
});

export default darkTheme;