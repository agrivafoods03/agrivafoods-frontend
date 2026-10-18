import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminApi } from '../services/api';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem('agriva_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('agriva_admin_token') || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If token exists, verify validity
    if (token && !adminUser) {
      adminApi.getMe()
        .then(res => {
          if (res?.data && res.data.role === 'admin') {
            setAdminUser(res.data);
            localStorage.setItem('agriva_admin_user', JSON.stringify(res.data));
          } else {
            logout();
          }
        })
        .catch(() => {
          logout();
        });
    }
  }, [token]);

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminApi.login(email, password);
      const user = res?.data?.user;
      const authToken = res?.data?.token;

      if (!user || user.role !== 'admin') {
        throw new Error('Access denied. Administrator privileges required.');
      }

      setAdminUser(user);
      setToken(authToken);
      localStorage.setItem('agriva_admin_token', authToken);
      localStorage.setItem('agriva_admin_user', JSON.stringify(user));
      return user;
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    try {
      adminApi.logout().catch(() => {});
    } catch {}
    setAdminUser(null);
    setToken('');
    localStorage.removeItem('agriva_admin_token');
    localStorage.removeItem('agriva_admin_user');
  };

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        token,
        isAuthenticated: !!token && adminUser?.role === 'admin',
        isLoading,
        error,
        login,
        logout
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
