import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUnauthorizedCallback } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children, onUnauthenticated }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function hydrate() {
      try {
        const [storedUser, storedToken] = await AsyncStorage.multiGet(['user', 'token']);
        const u = storedUser[1] ? JSON.parse(storedUser[1]) : null;
        const t = storedToken[1] || null;
        setUser(u);
        setToken(t);
      } catch {
      } finally {
        setLoading(false);
      }
    }
    hydrate();
  }, []);

  useEffect(() => {
    setUnauthorizedCallback(async () => {
      await AsyncStorage.multiRemove(['token', 'user']);
      setUser(null);
      setToken(null);
      if (onUnauthenticated) onUnauthenticated();
    });
  }, [onUnauthenticated]);

  const login = async (userData, jwtToken) => {
    await AsyncStorage.setItem('user', JSON.stringify(userData));
    await AsyncStorage.setItem('token', jwtToken);
    setUser(userData);
    setToken(jwtToken);
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(['token', 'user']);
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!user && !!token,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
