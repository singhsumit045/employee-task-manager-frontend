import { useState } from 'react';
import { Container, Box, Typography, Paper, Stack } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import TaskList from './TaskList';
import TaskForm from './TaskForm'; 

export default function Dashboard() { 
  const { user } = useAuth();  
  const [refreshKey, setRefreshKey] = useState(0);

  const isManagerOrAdmin = user?.role === 'admin' || user?.role === 'manager';

  const handleTaskCreated = () => {
    setRefreshKey((k) => k + 1); 
  };
 
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />
   
      <Container sx={{ py: 4 }}>
        {/* Welcome header */}
        <Stack spacing={0.5} sx={{ mb: 4 }}>
          <Typography variant="h5">
            {isManagerOrAdmin ? 'Team overview' : 'My tasks'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isManagerOrAdmin
              ? 'Create, assign and track tasks across your team'
              : 'Here are the tasks assigned to you'}
          </Typography>
        </Stack>

        {/* Task creation — only managers/admins */}
        {isManagerOrAdmin && (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 4,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 3,
            }}
          >
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Create a new task
            </Typography>
            <TaskForm onTaskCreated={handleTaskCreated} />
          </Paper>
        )}

        {/* Task list */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
          }}
        >
          <TaskList key={refreshKey} />
        </Paper>
      </Container>
    </Box>
  );
}