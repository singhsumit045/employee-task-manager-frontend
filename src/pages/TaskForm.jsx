import { useEffect, useState } from 'react';
import { Box, TextField, MenuItem, Button, Typography, Paper, Alert, Stack } from '@mui/material';
import api from '../services/api';

export default function TaskForm({ onTaskCreated }) {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    assignedToId: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch (err) {
      setError('Failed to load users');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const payload = { ...form };
      if (!payload.dueDate) delete payload.dueDate;

      const { data } = await api.post('/tasks', payload);
      setSuccess('Task created successfully!');
      setForm({ title: '', description: '', priority: 'medium', dueDate: '', assignedToId: '' });
      if (onTaskCreated) onTaskCreated(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Create New Task
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Task title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
          />
          <Stack direction="row" spacing={2}>
            <TextField
              select
              label="Priority"
              name="priority"
              value={form.priority}
              onChange={handleChange}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </TextField>

            <TextField
              label="Due date"
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
               slotProps={{ inputLabel: { shrink: true } }}
            />
          </Stack>

          <TextField
            select
            label="Assign to"
            name="assignedToId"
            value={form.assignedToId}
            onChange={handleChange}
            required
            fullWidth
          >
            {users.map((u) => (
              <MenuItem key={u.id} value={u.id}>
                {u.name} ({u.role})
              </MenuItem>
            ))}
          </TextField>

          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}

          <Button type="submit" variant="contained">
            Create Task
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}