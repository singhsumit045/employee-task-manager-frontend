import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Button,
  Chip,
  Stack,
} from '@mui/material';
import {
  TaskAlt,
  KeyboardArrowDown,
  LogoutOutlined,
  PersonOutlined,
} from '@mui/icons-material';

import taskflowLogoDark from '../assets/taskflow-logo-dark-text.png';


const NAV_LINKS = {
  employee: [
    { label: 'My tasks', path: '/dashboard' },
  ],
  manager: [
    { label: 'My tasks', path: '/dashboard' },
    { label: 'Team tasks', path: '/team' },
    { label: 'Reports', path: '/reports' },
  ],
  admin: [
    { label: 'My tasks', path: '/dashboard' },
    { label: 'Team tasks', path: '/team' },
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
    <AppBar position="sticky">
      <Toolbar sx={{ gap: 1 }}>
        {/* Brand */}
          <Stack
                        direction="row"
                        spacing={1}
                        sx={{ mb: 1, display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}
                    >
                        <Box
                            component="img"
                            src={taskflowLogoDark}
                            alt="TaskFlow"
                            sx={{ height: 28, width: 'auto' }}
                        />
                    </Stack>

        {/* Nav links */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, flexGrow: 1 }}>
          {links.map((link) => {
            const active = location.pathname === link.path;
            return (
              <Button
                key={link.path}
                onClick={() => navigate(link.path)}
                sx={{
                  color: active ? 'primary.main' : 'text.secondary',
                  bgcolor: active ? 'rgba(13,148,136,0.08)' : 'transparent',
                  fontWeight: active ? 600 : 500,
                  '&:hover': { bgcolor: 'rgba(13,148,136,0.08)' },
                }}
              >
                {link.label}
              </Button>
            );
          })}
        </Box>

        <Box sx={{ flexGrow: { xs: 1, md: 0 } }} />

        {/* Role badge */}
        <Chip
          label={role.charAt(0).toUpperCase() + role.slice(1)}
          size="small"
          sx={{
            bgcolor: 'rgba(13,148,136,0.1)',
            color: 'primary.dark',
            fontWeight: 500,
            display: { xs: 'none', sm: 'flex' },
          }}
        />

        {/* User menu */}
        <IconButton onClick={handleMenuOpen} sx={{ ml: 1, gap: 0.5, borderRadius: 2, px: 1 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main', fontSize: 14 }}>
            {user?.name?.[0]?.toUpperCase() || <PersonOutlined fontSize="small" />}
          </Avatar>
          <KeyboardArrowDown fontSize="small" sx={{ color: 'text.secondary' }} />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {user?.name || 'User'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
          <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
            <LogoutOutlined fontSize="small" sx={{ mr: 1 }} />
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}