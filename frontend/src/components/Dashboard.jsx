import { useContext } from 'react';
import { AuthContext } from '../AuthContext';

function Dashboard() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <h2>Welcome to the Dashboard</h2>
      <p>Role: {user.role}</p>
      {user.role === 'user' && (
        <p>Use the Vehicles tab to add or checkout your vehicles.</p>
      )}
      {user.role === 'staff' && (
        <p>Use the Approvals tab to review pending payments.</p>
      )}
      {user.role === 'admin' && (
        <p>Use the Users tab to manage users or Vehicles tab to view all vehicles.</p>
      )}
    </div>
  );
}

export default Dashboard;