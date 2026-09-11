import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Logged in as: {user?.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}