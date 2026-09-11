import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0D9488',
      light: '#2DD4BF',
      dark: '#0F766E',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#1F2937',
      light: '#374151',
      dark: '#111827',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F5F7FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1F2937',
      secondary: '#6B7280',
      disabled: '#9CA3AF',
    },
    divider: '#E5E7EB',
    success: { main: '#16A34A', light: '#DCFCE7', dark: '#15803D' },
    warning: { main: '#D97706', light: '#FEF3C7', dark: '#B45309' },
    error: { main: '#DC2626', light: '#FEE2E2', dark: '#B91C1C' },
    info: { main: '#2563EB', light: '#DBEAFE', dark: '#1D4ED8' },
    grey: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
  },

  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 600, letterSpacing: '-0.02em' },
    h5: { fontWeight: 600, letterSpacing: '-0.015em' },
    h6: { fontWeight: 600, letterSpacing: '-0.01em' },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 500, color: '#6B7280' },
    body2: { color: '#4B5563' },
    button: { fontWeight: 500, textTransform: 'none' },
    caption: { color: '#9CA3AF' },
  },

  shape: {
    borderRadius: 8,
  },

  spacing: 8,

  shadows: [
    'none',
    '0px 1px 2px rgba(16, 24, 40, 0.06)',
    '0px 1px 3px rgba(16, 24, 40, 0.08)',
    '0px 2px 4px rgba(16, 24, 40, 0.08)',
    ...Array(21).fill('0px 4px 12px rgba(16, 24, 40, 0.10)'),
  ],

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#F5F7FA',
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          boxShadow: 'none',
          border: `1px solid ${theme.palette.divider}`,
          backgroundImage: 'none',
        }),
      },
    },

    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          boxShadow: 'none',
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 10,
        }),
      },
    },

    MuiCardHeader: {
      styleOverrides: {
        title: { fontSize: '1rem', fontWeight: 600 },
        subheader: { fontSize: '0.8125rem' },
      },
    },

    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 8,
          paddingInline: 16,
        },
        containedPrimary: ({ theme }) => ({
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
          },
        }),
        outlined: ({ theme }) => ({
          borderColor: theme.palette.divider,
        }),
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          fontSize: '0.75rem',
          borderRadius: 6,
        },
        colorSuccess: { backgroundColor: '#DCFCE7', color: '#15803D' },
        colorWarning: { backgroundColor: '#FEF3C7', color: '#B45309' },
        colorError: { backgroundColor: '#FEE2E2', color: '#B91C1C' },
        colorInfo: { backgroundColor: '#DBEAFE', color: '#1D4ED8' },
        colorDefault: { backgroundColor: '#F3F4F6', color: '#374151' },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderColor: theme.palette.divider,
        }),
        head: {
          fontWeight: 600,
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.03em',
          color: '#6B7280',
          backgroundColor: '#F9FAFB',
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        size: 'small',
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 8,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.divider,
          },
        }),
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: '1px solid #E5E7EB',
          backgroundColor: '#FFFFFF',
          color: '#1F2937',
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          border: 'none',
          borderRight: '1px solid #E5E7EB',
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#1F2937',
          fontSize: '0.75rem',
        },
      },
    },
  },
});

// Task status -> Chip color mapping, ready to import wherever you render status chips
export const taskStatusColor = {
  overdue: 'error',
  inProgress: 'warning',
  pending: 'default',
  done: 'success',
  review: 'info',
};

export default theme;