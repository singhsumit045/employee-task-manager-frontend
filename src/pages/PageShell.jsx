import { Box, Typography } from '@mui/material';
import Navbar, { SIDEBAR_WIDTH } from '../components/Navbar';

const COLORS = {
  charcoalDark: '#111827',
  bg: '#F8FAFC',
  surface: '#FFFFFF',
  border: '#E5E7EB',
  textMuted: '#6B7280',
};

// Reusable shell for any protected page: sidebar + title bar + content slot.
// Keeps Team/Reports/Users (and future pages) visually consistent with Dashboard.
export default function PageShell({ title, subtitle, children }) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: COLORS.bg }}>
      <Navbar />
      <Box sx={{ ml: { xs: 0, md: `${SIDEBAR_WIDTH}px` }, pt: { xs: 8, md: 0 } }}>
        <Box
          sx={{
            px: { xs: 2, md: 4 },
            py: 2.5,
            borderBottom: `1px solid ${COLORS.border}`,
            bgcolor: COLORS.surface,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, color: COLORS.charcoalDark }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" sx={{ color: COLORS.textMuted }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box sx={{ p: { xs: 2, md: 4 } }}>{children}</Box>
      </Box>
    </Box>
  );
}
