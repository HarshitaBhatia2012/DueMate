import axios from 'axios';

const API_URL = 'https://duemate-o7m9.onrender.com';

const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to include the JWT token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('duemate_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authService = {
  signup: async (userData) => {
    const response = await api.post('/signup', userData);
    return response.data;
  },
  login: async (username, password) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    const response = await api.post('/token', formData);
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },
  updateCurrentUser: async (userData) => {
    const response = await api.put('/users/me', userData);
    return response.data;
  }
};

export const assignmentService = {
  getAssignments: async () => {
    const response = await api.get('/assignments/');
    return response.data;
  },
  createAssignment: async (assignmentData) => {
    const response = await api.post('/assignments/', assignmentData);
    return response.data;
  },
  updateAssignment: async (id, assignmentData) => {
    const response = await api.put(`/assignments/${id}`, assignmentData);
    return response.data;
  },
  deleteAssignment: async (id) => {
    const response = await api.delete(`/assignments/${id}`);
    return response.data;
  }
};

export default api;
