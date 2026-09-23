import { Paper, Typography } from '@mui/material';
import PageShell from './PageShell';

export default function Reports() {
  return (
    <PageShell title="Reports" subtitle="Task and team performance at a glance">
      <Paper
        elevation={0}
        sx={{ p: 4, borderRadius: 1, border: '1px solid #E5E7EB', textAlign: 'center' }}
      >
        <Typography variant="body1" sx={{ color: '#6B7280' }}>
          Reports are coming soon.
        </Typography>
      </Paper>
    </PageShell>
  );
}
