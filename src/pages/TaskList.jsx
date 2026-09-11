import { useEffect, useState } from 'react';
import { Typography, CircularProgress, Alert, Box } from '@mui/material';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';

export default function TaskList() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isManagerOrAdmin = user?.role === 'admin' || user?.role === 'manager';

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const endpoint = isManagerOrAdmin ? '/tasks' : '/tasks/my';
      const { data } = await api.get(endpoint);
      setTasks(data);
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.patch(`/tasks/${taskId}`, { status: newStatus });
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );
    } catch (err) {
      setError('Failed to update status');
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {isManagerOrAdmin ? 'All Tasks' : 'My Tasks'}
      </Typography>
      {tasks.length === 0 ? (
        <Typography>No tasks found.</Typography>
      ) : (
        tasks.map((task) => (
          <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} />
        ))
      )}
    </Box>
  );
}