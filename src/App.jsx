import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; 
import Reports from './pages/Reports';
import TaskList from './pages/TaskList';
import UserList from './pages/UserList';
import PageShell from './pages/PageShell';
import theme from './theme'; 

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard /> 
              </ProtectedRoute>
            }
          />
          <Route
            path="/team"
            element={
              <ProtectedRoute allowedRoles={['manager', 'admin']}>
                <PageShell title="Team tasks" subtitle="Track task progress across your team">
                  <TaskList />
                </PageShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasklist"
            element={
              <ProtectedRoute allowedRoles={['manager', 'admin']}>
                <PageShell title="Task list" subtitle="Review and update every task in the workspace">
                  <TaskList />
                </PageShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute allowedRoles={['manager', 'admin']}>
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <PageShell title="Users" subtitle="Manage employee accounts and access">
                  <UserList />
                </PageShell>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;