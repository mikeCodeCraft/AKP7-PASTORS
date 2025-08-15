import axios from 'axios';

const BASE_URL = 'https://rccgpas-backend.onrender.com/api/accounts/areas/';

export const getAreas = async (token) => axios.get(BASE_URL, { headers: { Authorization: `Bearer ${token}` } });
export const createArea = async (data, token) => axios.post(BASE_URL, data, { headers: { Authorization: `Bearer ${token}` } });
export const getArea = async (id, token) => axios.get(`${BASE_URL}${id}/`, { headers: { Authorization: `Bearer ${token}` } });
export const updateArea = async (id, data, token) => axios.put(`${BASE_URL}${id}/`, data, { headers: { Authorization: `Bearer ${token}` } });
export const patchArea = async (id, data, token) => axios.patch(`${BASE_URL}${id}/`, data, { headers: { Authorization: `Bearer ${token}` } });
export const deleteArea = async (id, token) => axios.delete(`${BASE_URL}${id}/`, { headers: { Authorization: `Bearer ${token}` } });
