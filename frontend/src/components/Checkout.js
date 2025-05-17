import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

function Checkout() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to continue');
          setLoading(false);
          setTimeout(() => navigate('/login'), 2000);
          return;
        }
        const response = await api.get(`/vehicles/${id}`);
        if (!response.data) {
          setError('Vehicle not found');
          setLoading(false);
          setTimeout(() => navigate('/vehicles'), 2000);
          return;
        }
        setVehicle(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching vehicle:', err);
        setError(err.response?.data?.error || 'Failed to fetch vehicle. Please try again.');
        setLoading(false);
        setTimeout(() => navigate('/vehicles'), 2000);
      }
    };
    fetchVehicle();
  }, [id, navigate]);

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to continue');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }
      await api.put(`/vehicles/${id}/checkout`);
      alert('Checkout successful! Awaiting staff approval.');
      navigate('/vehicles');
    } catch (err) {
      console.error('Error during checkout:', err);
      setError(err.response?.data?.error || 'Checkout failed. Please try again.');
    }
  };

  if (loading) return <div className="alert alert-info">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!vehicle) return null;

  return (
    <div className="checkout-container">
      <h2>Checkout Vehicle</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="vehicle-details">
        <p><strong>Number Plate:</strong> {vehicle.numberPlate}</p>
        <p><strong>Type:</strong> {vehicle.type}</p>
        <p><strong>Entry Time:</strong> {new Date(vehicle.entryTime).toLocaleString()}</p>
      </div>
      <button className="btn btn-warning" onClick={handleCheckout}>
        Confirm Checkout
      </button>
    </div>
  );
}

export default Checkout;