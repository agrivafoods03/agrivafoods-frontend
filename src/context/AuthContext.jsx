import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const login = async (email, password) => {
    setLoading(true);
    try {
      const loggedInUser = await authService.login(email, password);
      setUser(loggedInUser);
      showToast(`Welcome back, ${loggedInUser.name}!`, 'success');
      return loggedInUser;
    } catch (err) {
      showToast(err.message || 'Login failed', 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const newUser = await authService.register(userData);
      setUser(newUser);
      showToast(`Welcome to AgrivaFoods, ${newUser.name}!`, 'success');
      return newUser;
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    showToast('You have been logged out.', 'info');
  };

  const updateProfile = async (updates) => {
    try {
      const updated = await authService.updateProfile(updates);
      setUser(updated);
      showToast('Profile updated successfully!', 'success');
      return updated;
    } catch (err) {
      showToast(err.message || 'Failed to update profile', 'error');
      throw err;
    }
  };

  const addAddress = async (newAddress) => {
    if (!user) return;
    const addressWithId = {
      id: 'addr_' + Date.now(),
      ...newAddress
    };
    const updatedAddresses = [...(user.addresses || []), addressWithId];
    await updateProfile({ addresses: updatedAddresses });
  };

  const deleteAddress = async (addressId) => {
    if (!user) return;
    const updatedAddresses = (user.addresses || []).filter((a) => a.id !== addressId);
    await updateProfile({ addresses: updatedAddresses });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        addAddress,
        deleteAddress
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
