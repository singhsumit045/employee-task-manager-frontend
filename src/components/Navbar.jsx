import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Chip,
  Stack,
  List,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { LogoutOutlined, PersonOutlined } from '@mui/icons-material';

import taskflowLogoDark from '../assets/taskflow-logo-dark-text.png';

const SIDEBAR_WIDTH = 240;

const COLORS = {
  charcoal: '#1F2937',
  teal: '#0D9488',
};

const NAV_LINKS = {
  employee: [{ label: 'My tasks', path: '/dashboard' }],
  manager: [
    { label: 'My tasks', path: '/dashboard' },
    { label: 'Team tasks', path: '/team' },
    { label: 'Reports', path: '/reports' },
  ],
  admin: [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'TaskList', path: '/tasklist' },
    { label: 'Reports', path: '/reports' },
    { label: 'Users', path: '/users' },
  ],
};

export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const role = user?.role || 'employee';
  const links = NAV_LINKS[role] || NAV_LINKS.employee;    

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };

  return (
    <Box
      component="nav"
      sx={{
        width: { xs: '100%', md: SIDEBAR_WIDTH },
        flexShrink: 0,
        position: 'fixed',
        top: 0,
        left: 0,
        height: { xs: 64, md: '100vh' },
        zIndex: 1200,
        bgcolor: COLORS.charcoal,
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: { xs: 'row', md: 'column' },
        overflow: 'hidden',
      }}
    >
      {/* Brand */}
      <Box sx={{ px: { xs: 2, md: 3 }, py: { xs: 2, md: 3 }, flexShrink: 0 }}>
        <Box
          component="img"
          src={taskflowLogoDark}
          alt="TaskFlow"
          sx={{ height: 26, width: 'auto', filter: 'brightness(0) invert(1)' }}
        />
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', display: { xs: 'none', md: 'block' } }} />

      {/* Nav links */}
      <List
        sx={{
          px: { xs: 0.5, md: 1.5 },
          py: { xs: 1, md: 2 },
          flexGrow: 1,
          display: { xs: 'flex', md: 'block' },
          alignItems: 'center',
          overflowX: 'auto',
        }}
      >
        {links.map((link) => {
          const active = location.pathname === link.path;
          return (
            <ListItemButton
              key={link.path}
              selected={active}
              onClick={() => navigate(link.path)}
              sx={{
                borderRadius: 1,
                mb: { xs: 0, md: 0.5 },
                whiteSpace: 'nowrap',
                color: active ? '#FFFFFF' : 'rgba(255,255,255,0.65)',
                '&.Mui-selected': {
                  bgcolor: 'rgba(13,148,136,0.25)',
                  borderLeft: `3px solid ${COLORS.teal}`,
                  pl: '13px',
                },
                '&:hover': { bgcolor: 'rgba(255,255,255,0.06)' },
              }}
            >
              <ListItemText
                primaryTypographyProps={{ fontSize: 14, fontWeight: active ? 600 : 500 }}
              >
                {link.label}
              </ListItemText>
            </ListItemButton>
          );
        })}
      </List>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', display: { xs: 'none', md: 'block' } }} />

      {/* Role badge */}
      <Box sx={{ px: 2, pt: 2, display: { xs: 'none', md: 'block' } }}>
        <Chip
          label={role.charAt(0).toUpperCase() + role.slice(1)}
          size="small"
          sx={{
            bgcolor: 'rgba(13,148,136,0.2)',
            color: COLORS.teal,
            fontWeight: 500,
          }}
        />
      </Box>

      {/* User menu */}
      <Box sx={{ p: { xs: 1, md: 2 }, flexShrink: 0 }}>
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          onClick={handleMenuOpen}
          sx={{ cursor: 'pointer', borderRadius: 1, p: 0.5, '&:hover': { bgcolor: 'rgba(255,255,255,0.06)' } }}
        >
          <Avatar sx={{ width: 34, height: 34, bgcolor: COLORS.teal, fontSize: 14 }}>
            {user?.name?.[0]?.toUpperCase() || <PersonOutlined fontSize="small" />}
          </Avatar>
          <Box sx={{ minWidth: 0, flexGrow: 1, display: { xs: 'none', md: 'block' } }}>
            <Typography variant="body2" noWrap sx={{ fontWeight: 500 }}>
              {user?.name || 'User'}
            </Typography>
            <Typography variant="caption" noWrap sx={{ color: 'rgba(255,255,255,0.55)', display: 'block' }}>
              {user?.email}
            </Typography>
          </Box>
        </Stack>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
          <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
            <LogoutOutlined fontSize="small" sx={{ mr: 1 }} />
            Logout
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}

export { SIDEBAR_WIDTH };