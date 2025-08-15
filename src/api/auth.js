import axios from 'axios';
import { API_BASE, apiUrl } from './config';

const ACCOUNTS = `${API_BASE}/api/accounts`;

export const register = (data) =>
  axios.post(`${ACCOUNTS}/register/`, data);

export const login = (data) =>
  axios.post(`${ACCOUNTS}/login/`, data);
