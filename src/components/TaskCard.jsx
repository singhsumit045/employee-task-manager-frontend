import { Card, CardContent, Typography, Chip, MenuItem, TextField, Stack } from '@mui/material';

const statusColor = {
  todo: 'default',
  in_progress: 'warning',
  done: 'success',
};

const priorityColor = {
  low: 'default',
  medium: 'info',
  high: 'error',
};

export default function TaskCard({ task, onStatusChange }) {
  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">{task.title}</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {task.description}
        </Typography>

        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1 }}>
          <Chip label={task.status} color={statusColor[task.status]} size="small" />
          <Chip label={task.priority} color={priorityColor[task.priority]} size="small" />
        </Stack>

        {task.assignedTo && (
          <Typography variant="body2">Assigned to: {task.assignedTo.name}</Typography>
        )}

        {onStatusChange && (
          <TextField
            select
            size="small"
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value)}
            sx={{ mt: 1, minWidth: 160 }}
          >
            <MenuItem value="todo">To Do</MenuItem>
            <MenuItem value="in_progress">In Progress</MenuItem>
            <MenuItem value="done">Done</MenuItem>
          </TextField>
        )}
      </CardContent>
    </Card>
  );
}