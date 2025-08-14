import axios from 'axios';

export const logout = async () => {
  const token = localStorage.getItem('token');
  return axios.post(
    'http://localhost:8000/api/accounts/logout/',
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
