import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.patch('/auth/me', data),
  saveSubscription: (subscription) => api.post('/auth/subscription', { subscription })
};

// Contests API
export const contestsAPI = {
  getAll: (params) => api.get('/contests', { params }),
  getOne: (id) => api.get(`/contests/${id}`),
  create: (data) => api.post('/contests', data),
  update: (id, data) => api.patch(`/contests/${id}`, data),
  delete: (id) => api.delete(`/contests/${id}`),
  markCompleted: (id) => api.patch(`/contests/${id}/complete`)
};

// Reminders API
export const remindersAPI = {
  getAll: () => api.get('/reminders'),
  create: (data) => api.post('/reminders', data),
  delete: (id) => api.delete(`/reminders/${id}`)
};

export default api;
