import axios from 'axios';

export const logout = async () => {
  const token = localStorage.getItem('token');
  return axios.post(
    'https://rccgpas-backend.onrender.com/api/accounts/logout/',
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
