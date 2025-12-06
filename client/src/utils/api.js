import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:12000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
};

// Users API
export const usersAPI = {
  getProfile: (username) => api.get(`/users/profile/${username}`),
  updateProfile: (userData) => api.put('/users/profile', userData),
  follow: (userId) => api.post(`/users/follow/${userId}`),
  unfollow: (userId) => api.delete(`/users/unfollow/${userId}`),
  upgradePremium: () => api.post('/users/upgrade-premium'),
};

// Projects API
export const projectsAPI = {
  getProjects: (params) => api.get('/projects', { params }),
  getProject: (id) => api.get(`/projects/${id}`),
  createProject: (projectData) => api.post('/projects', projectData),
  updateProject: (id, projectData) => api.put(`/projects/${id}`, projectData),
  deleteProject: (id) => api.delete(`/projects/${id}`),
  likeProject: (id) => api.post(`/projects/${id}/like`),
  commentProject: (id, comment) => api.post(`/projects/${id}/comment`, comment),
  deleteComment: (projectId, commentId) => api.delete(`/projects/${projectId}/comment/${commentId}`),
};

// Jobs API
export const jobsAPI = {
  getJobs: (params) => api.get('/jobs', { params }),
  getJob: (id) => api.get(`/jobs/${id}`),
  createJob: (jobData) => api.post('/jobs', jobData),
  updateJob: (id, jobData) => api.put(`/jobs/${id}`, jobData),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
  applyToJob: (id, applicationData) => api.post(`/jobs/${id}/apply`, applicationData),
  getJobApplications: (id) => api.get(`/jobs/${id}/applications`),
  updateApplicationStatus: (jobId, applicationId, status) => 
    api.put(`/jobs/${jobId}/applications/${applicationId}`, { status }),
  getMyApplications: () => api.get('/jobs/my/applications'),
};

export default api;