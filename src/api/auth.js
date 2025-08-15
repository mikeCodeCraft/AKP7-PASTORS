import axios from 'axios';

const API_BASE = 'https://rccgpas-backend.onrender.com/api/accounts';

export const register = (data) =>
  axios.post(`${API_BASE}/register/`, data);

export const login = (data) =>
  axios.post(`${API_BASE}/login/`, data);
