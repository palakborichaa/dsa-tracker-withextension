// src/config.js
// Central API host configuration for the frontend.
// This allows switching the backend URL in one place.

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://dsa-tracker-backend-57l2.onrender.com';
export const API_PATH = `${API_BASE_URL}/api`;
