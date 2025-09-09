import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

// API Configuration - Use Apache Proxy
const getApiUrl = () => {
  const hostname = window.location.hostname;
  
  // Use Apache proxy for all environments
  if (hostname === 'nusantaragroup.co' || hostname.includes('nusantaragroup')) {
    // Use Apache proxy - no port needed
    return '/api';
  }
  
  // For localhost development (direct Docker access)
  return 'http://localhost:5000/api';
};

const API_URL = getApiUrl();

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
        const response = await axios.get(verifyUrl);
        
        // Extract user from response structure like login does
        if (response.data.success && response.data.user) {
          setUser(response.data.user);
        } else {
          throw new Error('Invalid response structure');
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        // Remove token and logout on any error
        logout();
      } finally {
        setLoading(false);
      }
    };

    // Clear any mock tokens first
    const token = localStorage.getItem('token');
    if (token === 'mock-development-token') {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setLoading(false);
      return;
    }

    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Verify real token with backend
      verifyToken();
    } else {
      // No token found, user needs to login
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      
      const loginUrl = `${API_URL}/auth/login`;
      console.log('🔗 Login URL:', loginUrl);
      console.log('🌐 Current hostname:', window.location.hostname);
      
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials),
        credentials: 'include' // Important for CORS with authentication
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        const { token, user } = data;
        
        // Store token
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        setUser(user);
        toast.success('Login berhasil!');
        return { success: true };
      } else {
        throw new Error(data.error || 'Login gagal');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      let message = 'Login gagal';
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        message = 'Koneksi ke server bermasalah. Periksa koneksi jaringan.';
      } else if (error.message.includes('401')) {
        message = 'Username atau password salah';
      } else if (error.message.includes('429')) {
        message = 'Terlalu banyak percobaan login. Coba lagi nanti';
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
