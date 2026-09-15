import { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Stack,
  Grid,
  Avatar,
  Chip,
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  Group as GroupIcon,
  AddTask as AddTaskIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import EmployeeForm from './EmployeeForm';
import UserList from './UserList';  


// Reusable section wrapper — MuiPaper already applies border + no shadow globally
function Section({ icon, title, children }) {
  return (
    <Paper
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 3,
        transition: 'box-shadow 0.2s ease',
        '&:hover': {
          boxShadow: (theme) => theme.shadows[3],
        },
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2.5 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            borderRadius: 2,
            bgcolor: 'primary.light',
            color: 'primary.dark',
          }}
        >
          {icon}
        </Box>
        <Typography variant="subtitle1">{title}</Typography>
      </Stack>
      {children}
    </Paper>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  const [employeeRefreshKey, setEmployeeRefreshKey] = useState(0);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const isManagerOrAdmin = user?.role === 'admin' || user?.role === 'manager';
  const isAdmin = user?.role === 'admin';

  const handleTaskCreated = () => {
    setRefreshKey((k) => k + 1);
  };

  const handleEmployeeSuccess = () => {
    setEmployeeRefreshKey((k) => k + 1);
    setEditingEmployee(null);
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingEmployee(null);
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />

      {/* Welcome header — teal gradient matching theme.palette.primary */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0F766E 0%, #0D9488 55%, #2DD4BF 100%)',
          color: '#FFFFFF',
          py: { xs: 4, md: 5 },
          mb: 4,
        }}
      >
        <Container>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              sx={{
                width: 56,
                height: 56,
                bgcolor: 'rgba(255,255,255,0.18)',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: 20,
              }}
            >
              {initials}
            </Avatar>
            <Stack spacing={0.5}>
              <Typography variant="h5" sx={{ color: '#FFFFFF' }}>
                {isManagerOrAdmin ? 'Team overview' : 'My tasks'}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)' }}>
                {isManagerOrAdmin
                  ? 'Create, assign and track tasks across your team'
                  : 'Here are the tasks assigned to you'}
              </Typography>
            </Stack>
            <Chip
              label={user?.role?.toUpperCase() || 'EMPLOYEE'}
              size="small"
              sx={{
                ml: 'auto',
                bgcolor: 'rgba(255,255,255,0.18)',
                color: '#FFFFFF',
                display: { xs: 'none', sm: 'flex' },
              }}
            />
          </Stack>
        </Container>
      </Box>

<Container maxWidth="xl" sx={{ pb: 5 }}>
  <Grid container spacing={3}>
    <Grid item xs={12} md={isManagerOrAdmin ? 5 : 12}>
      {/* Employee creation/edit — only admin */}
      {isAdmin && (
        <Section
          icon={<PersonAddIcon fontSize="small" />}
          title={editingEmployee ? 'Edit employee' : 'Create new employee'}
        >
          <EmployeeForm
            editingEmployee={editingEmployee}
            onSuccess={handleEmployeeSuccess}
            onCancelEdit={handleCancelEdit}
          />
        </Section>
      )}

      {/* Task creation — only managers/admins */}
      {isManagerOrAdmin && (
        <Section icon={<AddTaskIcon fontSize="small" />} title="Create a new task">
          <TaskForm onTaskCreated={handleTaskCreated} />
        </Section>
      )}

      {/* Employee list — only admin */}
      {isAdmin && (
        <Section icon={<GroupIcon fontSize="small" />} title="All employees">
          <UserList refreshKey={employeeRefreshKey} onEdit={handleEditEmployee} />
        </Section>
      )}
    </Grid>
  </Grid>

  {/* Tasks — always full width, own row below the forms */}
  <Box sx={{ mt: 3 }}>
    <Section icon={<AssignmentIcon fontSize="small" />} title="Tasks">
      <TaskList key={refreshKey} />
    </Section>
  </Box>
</Container>
    </Box>
  );
}