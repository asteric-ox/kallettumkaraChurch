import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';

interface AuthContextType {
  isAdmin: boolean;
  username: string | null;
  login: (token: string, username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAdmin: false,
  username: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('church_admin_token');
    const user = localStorage.getItem('church_admin_user');
    if (token && user) {
      setIsAdmin(true);
      setUsername(user);
    }
  }, []);

  const login = (token: string, user: string) => {
    localStorage.setItem('church_admin_token', token);
    localStorage.setItem('church_admin_user', user);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setIsAdmin(true);
    setUsername(user);
  };

  const logout = () => {
    localStorage.removeItem('church_admin_token');
    localStorage.removeItem('church_admin_user');
    delete api.defaults.headers.common['Authorization'];
    setIsAdmin(false);
    setUsername(null);
  };

  return <AuthContext.Provider value={{ isAdmin, username, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
