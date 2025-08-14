import axios from 'axios';

const API_BASE = 'http://localhost:8000/api/accounts';

export const register = (data) =>
  axios.post(`${API_BASE}/register/`, data);

export const login = (data) =>
  axios.post(`${API_BASE}/login/`, data);
