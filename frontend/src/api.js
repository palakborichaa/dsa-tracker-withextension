// src/api.js
import axios from 'axios';

// Create Axios instance pointing to deployed backend
const API = axios.create({
  baseURL: (process.env.REACT_APP_API_URL || 'https://dsa-tracker-b8zw.onrender.com') + '/api', // Backend URL with fallback
});

// Add JWT token to headers if it exists
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token'); // Your JWT token stored in localStorage
  if (token) req.headers.Authorization = `Bearer ${token}`; // Add Bearer token
  return req;
});

// Authentication API calls

// Sign up a new user
export const signup = async (userData) => {
  const res = await API.post('/auth/signup', userData);
  return res.data;
};

// Login user
export const login = async (credentials) => {
  const res = await API.post('/auth/login', credentials);
  return res.data;
};

// Get user profile
export const getProfile = async () => {
  const res = await API.get('/auth/profile');
  return res.data;
};

// DSA Problem API calls

// Create new problem
export const addProblem = async (problemData) => {
  const res = await API.post('/dsa/add', problemData);
  return res.data;
};

// Get all problems for the logged-in user
export const getProblems = async () => {
  const res = await API.get('/dsa');
  return res.data;
};

// Get paginated solved problem history for the logged-in user
export const getSolvedHistory = async (page = 1, limit = 10) => {
  const res = await API.get(`/dsa/history?page=${page}&limit=${limit}`);
  return res.data;
};

// Get analytics summary for the logged-in user
export const getAnalytics = async () => {
  const res = await API.get('/dsa/analytics');
  return res.data;
};

// Update a problem by ID
export const updateProblem = async (id, updatedData) => {
  const res = await API.put(`/dsa/${id}`, updatedData);
  return res.data;
};

// Delete a problem by ID
export const deleteProblem = async (id) => {
  const res = await API.delete(`/dsa/${id}`);
  return res.data;
};

// Export the Axios instance for direct use if needed
export default API;
