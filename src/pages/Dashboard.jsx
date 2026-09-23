import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Grid,
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  Group as GroupIcon,
  AddTask as AddTaskIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import Navbar, { SIDEBAR_WIDTH } from '../components/Navbar';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import EmployeeForm from './EmployeeForm';
import UserList from './UserList';

// ---- design tokens ----
const COLORS = {
  charcoal: '#1F2937',
  charcoalDark: '#111827',
  teal: '#0D9488',
  tealLight: '#2DD4BF',
  bg: '#F8FAFC',
  surface: '#FFFFFF',
  border: '#E5E7EB',
  textMuted: '#6B7280',
};

// Flat panel — hairline border, no shadow. `accent` puts a 3px teal
// left-edge on the panel that's the primary action for this role.
function Panel({ icon, title, accent = false, children }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 1,
        border: `1px solid ${COLORS.border}`,
        borderLeft: accent ? `3px solid ${COLORS.teal}` : `1px solid ${COLORS.border}`,
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2.5 }}>
        <Box sx={{ display: 'flex', color: COLORS.teal }}>{icon}</Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: COLORS.charcoalDark }}>
          {title}
        </Typography>
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

  const handleTaskCreated = () => setRefreshKey((k) => k + 1);
  const handleEmployeeSuccess = () => {
    setEmployeeRefreshKey((k) => k + 1);
    setEditingEmployee(null);
  };
  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleCancelEdit = () => setEditingEmployee(null);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: COLORS.bg }}>
      <Navbar />

      <Box sx={{ ml: { xs: 0, md: `${SIDEBAR_WIDTH}px` }, pt: { xs: 8, md: 0 } }}>
        {/* Top bar — page title, no gradient hero */}
        <Box
          sx={{
            px: { xs: 2, md: 4 },
            py: 2.5,
            borderBottom: `1px solid ${COLORS.border}`,
            bgcolor: COLORS.surface,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, color: COLORS.charcoalDark }}>
            {isManagerOrAdmin ? 'Team overview' : 'My tasks'}
          </Typography>
          <Typography variant="body2" sx={{ color: COLORS.textMuted }}>
            {isManagerOrAdmin
              ? 'Create, assign and track tasks across your team'
              : 'Here are the tasks assigned to you'}
          </Typography>
        </Box>

        <Box sx={{ p: { xs: 2, md: 4 } }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={isManagerOrAdmin ? 5 : 12}>
              {isAdmin && (
                <Panel
                  icon={<PersonAddIcon fontSize="small" />}
                  title={editingEmployee ? 'Edit employee' : 'Create new employee'}
                  accent
                >
                  <EmployeeForm
                    editingEmployee={editingEmployee}
                    onSuccess={handleEmployeeSuccess}
                    onCancelEdit={handleCancelEdit}
                  />
                </Panel>
              )}

              {isManagerOrAdmin && (
                <Panel icon={<AddTaskIcon fontSize="small" />} title="Create a new task" accent>
                  <TaskForm onTaskCreated={handleTaskCreated} />
                </Panel>
              )}

              {isAdmin && (
                <Panel icon={<GroupIcon fontSize="small" />} title="All employees">
                  <UserList refreshKey={employeeRefreshKey} onEdit={handleEditEmployee} />
                </Panel>
              )}
            </Grid>
          </Grid>

          <Box sx={{ mt: 1 }}>
            <Panel icon={<AssignmentIcon fontSize="small" />} title="Tasks">
              <TaskList key={refreshKey} />
            </Panel>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}