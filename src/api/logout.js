import axios from 'axios';
import { API_BASE } from './config';

export const logout = async () => {
  const token = localStorage.getItem('token');
  return axios.post(
    `${API_BASE}/api/accounts/logout/`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
