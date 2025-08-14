import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/accounts/parishes/';

export const getParishes = async (token) => axios.get(BASE_URL, { headers: { Authorization: `Bearer ${token}` } });
export const createParish = async (data, token) => axios.post(BASE_URL, data, { headers: { Authorization: `Bearer ${token}` } });
export const getParish = async (id, token) => axios.get(`${BASE_URL}${id}/`, { headers: { Authorization: `Bearer ${token}` } });
export const updateParish = async (id, data, token) => axios.put(`${BASE_URL}${id}/`, data, { headers: { Authorization: `Bearer ${token}` } });
export const patchParish = async (id, data, token) => axios.patch(`${BASE_URL}${id}/`, data, { headers: { Authorization: `Bearer ${token}` } });
export const deleteParish = async (id, token) => axios.delete(`${BASE_URL}${id}/`, { headers: { Authorization: `Bearer ${token}` } });
