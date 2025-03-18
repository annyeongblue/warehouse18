// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:1337/api',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('Token in interceptor:', token); // Debug: Check if token is retrieved
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;