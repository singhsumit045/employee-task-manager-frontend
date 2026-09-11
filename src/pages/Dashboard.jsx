import { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import TaskList from './TaskList';
import TaskForm from './TaskForm';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  const isManagerOrAdmin = user?.role === 'admin' || user?.role === 'manager';

  const handleTaskCreated = () => {
    setRefreshKey((k) => k + 1);
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6">Employee Task Manager</Typography>
          <Box>
            <Typography component="span" sx={{ mr: 2 }}>
              Logged in as: {user?.role}
            </Typography>
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 3 }}>
        {isManagerOrAdmin && <TaskForm onTaskCreated={handleTaskCreated} />}
        <TaskList key={refreshKey} />
      </Container>
    </Box>
  );
}