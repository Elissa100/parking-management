import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../AuthContext';

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({ numberPlate: '', type: '' });
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await api.get('/vehicles');
      setVehicles(response.data);
    } catch (err) {
      setError('Failed to fetch vehicles');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/vehicles', formData);
      setFormData({ numberPlate: '', type: '' });
      fetchVehicles();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add vehicle');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h2>Vehicles</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {user.role === 'user' && (
        <>
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="row">
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control mb-2"
                  name="numberPlate"
                  placeholder="Number Plate"
                  value={formData.numberPlate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control mb-2"
                  name="type"
                  placeholder="Vehicle Type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <button type="submit" className="btn btn-primary">Add Vehicle</button>
              </div>
            </div>
          </form>
          <div className="alert alert-info">
            After checking out, wait for staff approval. you pay 5 dollars per hour and you should not exceed 10 hours in the parking, Once approved, pay at the exit gate and leave.
          </div>
        </>
      )}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Number Plate</th>
            <th>Type</th>
            <th>Entry Time</th>
            <th>Exit Time</th>
            <th>Fee</th>
            <th>Status</th>
            {user.role === 'user' && <th>Action</th>}
            {user.role === 'admin' && <th>User</th>}
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle) => (
            <tr key={vehicle.id}>
              <td>{vehicle.numberPlate}</td>
              <td>{vehicle.type}</td>
              <td>{new Date(vehicle.entryTime).toLocaleString()}</td>
              <td>{vehicle.exitTime ? new Date(vehicle.exitTime).toLocaleString() : '-'}</td>
              <td>${vehicle.fee}</td>
              <td>
                {vehicle.exitTime && !vehicle.isPaid
                  ? 'Pending Approval'
                  : vehicle.isPaid
                  ? 'Paid - Exit Allowed'
                  : 'Parked'}
              </td>
              {user.role === 'user' && !vehicle.exitTime && (
                <td>
                  <Link to={`/vehicles/${vehicle.id}/checkout`} className="btn btn-sm btn-warning">Checkout</Link>
                </td>
              )}
              {user.role === 'admin' && (
                <td>{vehicle.User?.email || '-'}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Vehicles;
// This component fetches and displays vehicles from the API. Users can add new vehicles, and admins can see all vehicles with user information.
// The component uses the AuthContext to determine the user's role and conditionally renders elements based on that role.
// It also handles form submission for adding vehicles and displays error messages when necessary.