import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/accounts/zones/';

export const getZones = async (token) => axios.get(BASE_URL, { headers: { Authorization: `Bearer ${token}` } });
export const createZone = async (data, token) => axios.post(BASE_URL, data, { headers: { Authorization: `Bearer ${token}` } });
export const getZone = async (id, token) => axios.get(`${BASE_URL}${id}/`, { headers: { Authorization: `Bearer ${token}` } });
export const updateZone = async (id, data, token) => axios.put(`${BASE_URL}${id}/`, data, { headers: { Authorization: `Bearer ${token}` } });
export const patchZone = async (id, data, token) => axios.patch(`${BASE_URL}${id}/`, data, { headers: { Authorization: `Bearer ${token}` } });
export const deleteZone = async (id, token) => axios.delete(`${BASE_URL}${id}/`, { headers: { Authorization: `Bearer ${token}` } });
