import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({ id: decoded.id, role: decoded.role });
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = async (email, password) => {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, { email, password });
    localStorage.setItem('token', response.data.token);
    setUser({ id: response.data.user.id, role: response.data.user.role });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};