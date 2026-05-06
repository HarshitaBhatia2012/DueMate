import axios from 'axios';

const API_URL = "https://duemate-o7m9.onrender.com";

const api = axios.create({
  baseURL: API_URL,
});

// Configure Axios to automatically attach the Clerk session token
api.interceptors.request.use(
  async (config) => {
    // If Clerk is initialized and user is signed in, fetch the fresh token
    if (window.Clerk && window.Clerk.session) {
      try {
        const token = await window.Clerk.session.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (err) {
        console.error("Failed to get Clerk token:", err);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authService = {
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
