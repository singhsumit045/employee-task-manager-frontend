import { useEffect, useState, useMemo } from 'react';
import {
  Typography,  CircularProgress, Alert, Box,Table,
  TableHead,  TableBody, TableRow,
  TableCell, TableContainer, Chip, Select, MenuItem,
  Paper, Grid,Stack, TextField, InputAdornment,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { taskStatusColor } from '../theme';

const STATUS_OPTIONS = ['todo', 'in_progress', 'done'];     

const STATUS_LABELS = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
};

const PRIORITY_COLOR = {
  high: 'error',
  medium: 'warning',
  low: 'default',
};

// Small summary card for status counts
function StatCard({ label, count, color }) {
  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
      <Stack spacing={0.5}>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="h5">{count}</Typography>
          <Chip label={label} color={color} size="small" sx={{ display: { xs: 'none', sm: 'flex' } }} />
        </Stack>
      </Stack>
    </Paper>
  );
}

export default function TaskList() {
  const { user } = useAuth(); 
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

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

  const counts = useMemo(() => {
    return STATUS_OPTIONS.reduce((acc, status) => {
      acc[status] = tasks.filter((t) => t.status === status).length;
      return acc;
    }, {});
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesSearch = task.title?.toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [tasks, statusFilter, search]);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Typography  variant="h6" gutterBottom>
        {isManagerOrAdmin ? 'All Tasks' : 'My Tasks'}
      </Typography>

      {/* Status summary cards */}
      {isManagerOrAdmin && tasks.length > 0 && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {STATUS_OPTIONS.map((status) => (
            <Grid item xs={12} sm={4} key={status}>
              <StatCard
                label={STATUS_LABELS[status]}
                count={counts[status] || 0}
                color={taskStatusColor[status]}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Search + filter */}
      {tasks.length > 0 && (
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
          <TextField
            placeholder="Search by task title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small"/>   
                </InputAdornment>
              ),
            }}
          /> 

          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="all">All Statuses</MenuItem>
            {STATUS_OPTIONS.map((status) => (
              <MenuItem key={status} value={status}>
                {STATUS_LABELS[status]}
              </MenuItem>
            ))}
          </Select>
        </Stack>
      )}

      {tasks.length === 0 ? (
        <Typography color="text.secondary">No tasks found.</Typography>
      ) : filteredTasks.length === 0 ? (
        <Typography color="text.secondary">No tasks match your search/filter.</Typography>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Due Date</TableCell>
                {isManagerOrAdmin && <TableCell>Assigned To</TableCell>}
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>  
            <TableBody>
              {filteredTasks.map((task) => (
                <TableRow key={task.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {task.title}
                    </Typography>
                    {task.description && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {task.description}
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={task.priority || 'low'}
                      color={PRIORITY_COLOR[task.priority] || 'default'}
                      size="small"
                    />
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })
                        : '—'}
                    </Typography>
                  </TableCell>

                  {isManagerOrAdmin && (
                    <TableCell>
                      <Typography variant="body2">
                        {task.assignedTo?.name || task.assignedTo?.email || '—'}
                      </Typography>
                    </TableCell>
                  )}

                  <TableCell>
                    <Select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      size="small"
                      sx={{ minWidth: 130 }}
                      renderValue={(value) => (
                        <Chip
                          label={STATUS_LABELS[value] || value}
                          color={taskStatusColor[value] || 'default'}
                          size="small"
                        />
                      )}  
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <MenuItem key={status} value={status}>
                          {STATUS_LABELS[status]}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}