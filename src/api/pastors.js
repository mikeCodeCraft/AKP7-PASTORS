import axios from 'axios';
import { API_BASE } from './config';

const BASE_URL = `${API_BASE}/api/accounts/pastors/`;

const authHeader = (token) => ({ Authorization: `Bearer ${token}` });

export const getPastors = async (token, params = {}) =>
  axios.get(BASE_URL, { headers: authHeader(token), params });

export const getPastor = async (id, token) =>
  axios.get(`${BASE_URL}${id}/`, { headers: authHeader(token) });

// Helper to decide if we need multipart (when any File/Blob is present)
const hasFile = (data) => {
  if (!data || typeof data !== 'object') return false;
  if (data instanceof File || data instanceof Blob) return true;
  if (Array.isArray(data)) return data.some(hasFile);
  return Object.values(data).some(hasFile);
};

// Build payload: JSON by default; if files exist, build FormData with JSON strings for nested objects/arrays
export const buildPastorPayload = (data) => {
  if (!hasFile(data)) {
    return { payload: data, headers: { 'Content-Type': 'application/json' } };
  }
  const fd = new FormData();
  const appendField = (key, value) => {
    if (value === undefined || value === null) return;
    // Files
    if (value instanceof File || value instanceof Blob) {
      fd.append(key, value);
      return;
    }
    // Primitive
    if (typeof value !== 'object') {
      fd.append(key, String(value));
      return;
    }
    // Object/Array: stringify
    fd.append(key, JSON.stringify(value));
  };

  // Top-level fields expected by serializer
  const {
    full_name,
    birthdate,
    photograph, // File
    phone,
    email,
    nationality,
    state,
    local_government,
    home_town,
    residential_address,
    family_info,
    professional_info,
    milestones,
    education_training,
    skills_gifts,
    children,
    past_postings,
    planted_parish_links,
    appointments,
    // Allow extra fields pass-through
    ...rest
  } = data || {};

  appendField('full_name', full_name);
  appendField('birthdate', birthdate);
  appendField('photograph', photograph);
  appendField('phone', phone);
  appendField('email', email);
  appendField('nationality', nationality);
  appendField('state', state);
  appendField('local_government', local_government);
  appendField('home_town', home_town);
  appendField('residential_address', residential_address);

  appendField('family_info', family_info);
  appendField('professional_info', professional_info);
  appendField('milestones', milestones);
  appendField('education_training', education_training);
  appendField('skills_gifts', skills_gifts);

  appendField('children', children);
  appendField('past_postings', past_postings);
  appendField('planted_parish_links', planted_parish_links);
  appendField('appointments', appointments);

  // Pass-through extras (safe stringify)
  Object.entries(rest || {}).forEach(([k, v]) => appendField(k, v));

  return { payload: fd, headers: { /* Let browser set multipart boundary */ } };
};

export const createPastor = async (data, token) => {
  const { payload, headers } = buildPastorPayload(data);
  return axios.post(BASE_URL, payload, { headers: { ...authHeader(token), ...headers } });
};

export const updatePastor = async (id, data, token, method = 'put') => {
  const { payload, headers } = buildPastorPayload(data);
  const url = `${BASE_URL}${id}/`;
  if (method === 'patch') {
    return axios.patch(url, payload, { headers: { ...authHeader(token), ...headers } });
  }
  return axios.put(url, payload, { headers: { ...authHeader(token), ...headers } });
};

export const deletePastor = async (id, token) =>
  axios.delete(`${BASE_URL}${id}/`, { headers: authHeader(token) });

export default {
  getPastors,
  getPastor,
  createPastor,
  updatePastor,
  deletePastor,
};
