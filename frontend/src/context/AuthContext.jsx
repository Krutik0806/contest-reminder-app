import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const loadUser = async () => {
    try {
      const response = await authAPI.getMe();
      setUser(response.data.user);
    } catch (error) {
      console.error('Failed to load user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const { user, token } = response.data;
      
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      
      return { success: true };
    } catch (error) {
      const errorData = error.response?.data;
      
      // Check if needs verification
      if (errorData?.needsVerification) {
        return {
          success: false,
          needsVerification: true,
          userId: errorData.userId,
          email: errorData.email,
          error: errorData.error
        };
      }
      
      return {
        success: false,
        error: errorData?.error || 'Login failed'
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await authAPI.register({ name, email, password });
      console.log('Registration response:', response.data);
      
      // New registration returns userId and message instead of token
      if (response.data.userId) {
        return {
          success: true,
          userId: response.data.userId,
          email: response.data.email
        };
      }
      
      // Fallback for old response format (should not happen with OTP)
      console.warn('Old registration format detected, user should verify email');
      const { user, token } = response.data;
      
      // Don't auto-login if not verified
      if (user && !user.isVerified) {
        return {
          success: true,
          userId: user._id,
          email: user.email,
          needsVerification: true
        };
      }
      
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error.response?.data);
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      updateUser,
      setUser,
      setToken,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
