import axios from 'axios';

const API_BASE_URL = '/api/auth';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  async login(email: string, password: string) {
    const response = await api.post('/login', { email, password });
    return response.data;
  },

  async register(username: string, email: string, password: string) {
    const response = await api.post('/register', { username, email, password });
    return response.data;
  },

  async logout() {
    const response = await api.post('/logout');
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get('/me');
    return response.data;
  },

  getGoogleAuthUrl() {
    return `${window.location.origin}/api/auth/google`;
  }
};