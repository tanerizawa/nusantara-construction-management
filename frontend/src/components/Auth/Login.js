import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, Lock, User, ArrowLeft } from 'lucide-react';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: 'admin', // Auto-fill dengan user admin
    password: 'admin123'
  });
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Redirect jika sudah login
  useEffect(() => {
    if (user) {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await login(credentials);
      if (result?.success) {
        navigate('/admin');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  // Auto-fill credentials untuk testing - Updated 2025-09-13
  const demoCredentials = [
    { 
      username: 'admin', 
      password: 'admin123', 
      role: 'Super Administrator', 
      info: 'Production User - AKTIF',
      name: 'Administrator'
    },
    { 
      username: 'lisatanasyassnmdes', 
      password: 'admin123', 
      role: 'Manager Operasional', 
      info: 'Production User - AKTIF',
      name: 'Lisa Tanasya'
    },
    { 
      username: 'sintadewisemm', 
      password: 'admin123', 
      role: 'Staff Keuangan', 
      info: 'Production User - AKTIF',
      name: 'Sinta Dewi'
    }
  ];

  const fillDemo = (username, password) => {
    setCredentials({ username, password });
  };

  // Quick auto-login function
  const quickLogin = async (username, password) => {
    setCredentials({ username, password });
    setLoading(true);
    try {
      const result = await login({ username, password });
      if (result?.success) {
        navigate('/admin');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Back to Home Button */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium mb-4"
          >
            <ArrowLeft size={16} className="mr-1" />
            Kembali ke Beranda
          </Link>
        </div>

        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-xl flex items-center justify-center">
            <Building2 size={32} className="text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Portal Admin
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Masuk ke sistem administrasi NUSANTARA GROUP
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="form-label">
                Username atau Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={20} className="text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  className="form-input pl-10"
                  placeholder="Masukkan username atau email"
                  value={credentials.username}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={20} className="text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="form-input pl-10"
                  placeholder="Masukkan password"
                  value={credentials.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full btn-primary ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Sedang Login...' : 'Login'}
            </button>
          </form>

          {/* Quick Login Demo */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-900 mb-1">
                � Credentials Ujicoba - Production Database
              </p>
              <p className="text-xs text-gray-600">
                Updated: 13 Sep 2025 | Default: admin/admin123
              </p>
            </div>
            
            <div className="space-y-3">
              {demoCredentials.map((demo, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {demo.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {demo.role} • {demo.username}
                      </div>
                      <div className="text-xs text-green-600 font-medium">
                        {demo.info}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => fillDemo(demo.username, demo.password)}
                      className="flex-1 text-xs bg-blue-100 text-blue-700 px-3 py-2 rounded hover:bg-blue-200 transition-colors"
                    >
                      📝 Isi Form
                    </button>
                    <button
                      onClick={() => quickLogin(demo.username, demo.password)}
                      disabled={loading}
                      className={`flex-1 text-xs bg-green-100 text-green-700 px-3 py-2 rounded hover:bg-green-200 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      ⚡ Login Langsung
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700 font-medium">
                💡 Tips: Gunakan "Login Langsung" untuk masuk tanpa mengetik!
              </p>
              <p className="text-xs text-blue-600 mt-1">
                � Semua akun menggunakan password: admin123
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          © 2024 NUSANTARA GROUP. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Login;
