import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Vehicles from './components/Vehicles';
import Checkout from './components/Checkout';
import Approvals from './components/Approvals';
import Users from './components/Users';

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/vehicles" element={user ? <Vehicles /> : <Navigate to="/login" />} />
          <Route path="/vehicles/:id/checkout" element={user?.role === 'user' ? <Checkout /> : <Navigate to="/dashboard" />} />
          <Route path="/approvals" element={user?.role === 'staff' ? <Approvals /> : <Navigate to="/dashboard" />} />
          <Route path="/users" element={user?.role === 'admin' ? <Users /> : <Navigate to="/dashboard" />} />
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;