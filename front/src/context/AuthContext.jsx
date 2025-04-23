// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [jwt, setJwt] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedJwt = localStorage.getItem('jwt');
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedJwt && storedUser) {
      setJwt(storedJwt);
      setUser(storedUser);
    }
  }, []);

  const login = async ({ email, password }) => {
    try {
      const response = await axios.post('http://localhost:1337/api/auth/local', {
        identifier: email,
        password,
      });
      if (response.status === 200) {
        const { jwt, user } = response.data;
        const normalizedUser = {
          ...user,
          role: user.role?.name?.toLowerCase() || user.role || 'user',
        };
        setJwt(jwt);
        setUser(normalizedUser);
        localStorage.setItem('jwt', jwt);
        localStorage.setItem('user', JSON.stringify(normalizedUser));
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error?.message || 'Login failed.',
      };
    }
  };

  const logout = () => {
    setJwt(null);
    setUser(null);
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, jwt, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};