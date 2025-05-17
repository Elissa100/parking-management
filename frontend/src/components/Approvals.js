import { useState, useEffect } from 'react';
import api from '../api';

function Approvals() {
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to continue');
          setLoading(false);
          setTimeout(() => window.location.href = '/login', 2000);
          return;
        }
        const response = await api.get('/approvals');
        setVehicles(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching approvals:', err);
        setError(err.response?.data?.error || 'Failed to fetch approvals');
        setLoading(false);
      }
    };
    fetchApprovals();
  }, []);

  const handleApprove = async (vehicleId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to continue');
        setTimeout(() => window.location.href = '/login', 2000);
        return;
      }
      await api.post(`/approvals/${vehicleId}/approve`, { notes: 'Approved' });
      setVehicles(vehicles.filter(v => v.id !== vehicleId));
      alert('Payment approved successfully');
    } catch (err) {
      console.error('Error approving payment:', err);
      setError(err.response?.data?.error || 'Failed to approve payment');
    }
  };

  if (loading) return <div className="alert alert-info">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="approvals-container">
      <h2>Pending Approvals</h2>
      {vehicles.length === 0 ? (
        <p>No pending approvals</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Number Plate</th>
              <th>Type</th>
              <th>Email</th>
              <th>Entry Time</th>
              <th>Exit Time</th>
              <th>Fee</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map(vehicle => (
              <tr key={vehicle.id}>
                <td>{vehicle.numberPlate}</td>
                <td>{vehicle.type}</td>
                <td>{vehicle.User?.email || 'N/A'}</td>
                <td>{new Date(vehicle.entryTime).toLocaleString()}</td>
                <td>{new Date(vehicle.exitTime).toLocaleString()}</td>
                <td>${vehicle.fee}</td>
                <td>
                  <button
                    className="btn btn-success"
                    onClick={() => handleApprove(vehicle.id)}
                  >
                    Approve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Approvals;