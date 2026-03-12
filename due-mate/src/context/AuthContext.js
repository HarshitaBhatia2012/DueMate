import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('duemate_token');
      if (token) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Failed to fetch user', error);
          localStorage.removeItem('duemate_token');
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const data = await authService.login(username, password);
      localStorage.setItem('duemate_token', data.access_token);
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Login failed');
    }
  };

  const register = async (userData) => {
    try {
      await authService.signup(userData);
      return true;
    } catch (error) {
      console.error('Registration error details:', error.response?.data);
      const detail = error.response?.data?.detail;
      let errorMessage = 'Registration failed';
      
      if (typeof detail === 'string') {
        errorMessage = detail;
      } else if (Array.isArray(detail)) {
        errorMessage = detail[0]?.msg || 'Invalid data provided';
      }
      
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('duemate_token');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, setUser, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
