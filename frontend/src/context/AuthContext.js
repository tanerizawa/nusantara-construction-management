import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

// API Configuration
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Configure axios
axios.defaults.baseURL = API_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Debug: Log the API URL
console.log('AuthContext API_URL:', API_URL);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Add token to axios headers
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const verifyUrl = `${API_URL}/auth/me`;
        console.log('Verify token URL:', verifyUrl);
        const response = await axios.get(verifyUrl);
        setUser(response.data);
      } catch (error) {
        console.error('Token verification failed:', error);
        // For development, create a mock user if backend is not available or token is invalid
        if (error.code === 'ERR_NETWORK' || error.response?.status === 401) {
          console.log('Using mock user for development');
          setUser({
            id: 1,
            name: 'Admin User',
            email: 'admin@ykgroup.com',
            role: 'admin'
          });
        } else {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Skip verification for mock development token
      if (token === 'mock-development-token') {
        console.log('Using mock token, skipping verification');
        setUser({
          id: 1,
          name: 'Admin User',
          email: 'admin@ykgroup.com',
          role: 'admin'
        });
        setLoading(false);
      } else {
        // Verify real token
        verifyToken();
      }
    } else {
      // For development, set a mock token and user
      console.log('No token found, creating mock session for development');
      localStorage.setItem('token', 'mock-development-token');
      axios.defaults.headers.common['Authorization'] = `Bearer mock-development-token`;
      setUser({
        id: 1,
        name: 'Admin User',
        email: 'admin@ykgroup.com',
        role: 'admin'
      });
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      
      // Add timeout dan retry untuk mockup
      const config = {
        timeout: 10000, // 10 detik timeout
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      };
      
      // Use explicit full URL to ensure correct endpoint
      const loginUrl = `${API_URL}/auth/login`;
      console.log('Login URL:', loginUrl);
      
      const response = await axios.post(loginUrl, credentials, config);
      
      if (response.data.success) {
        const { token, user } = response.data;
        
        // Store token
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        setUser(user);
        toast.success('Login berhasil!');
        return { success: true };
      } else {
        throw new Error(response.data.error || 'Login gagal');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      let message = 'Login gagal';
      
      if (error.code === 'ERR_NETWORK') {
        message = 'Koneksi ke server bermasalah. Pastikan backend berjalan di port 5001';
      } else if (error.response?.status === 429) {
        message = 'Terlalu banyak percobaan login. Coba lagi nanti';
      } else if (error.response?.data?.error) {
        message = error.response.data.error;
      } else if (error.message) {
        message = error.message;
      }
      
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    toast.success('Logout berhasil!');
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    token: localStorage.getItem('token')
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
