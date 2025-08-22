// Central API base, configurable via env. Fallback to live backend.
export const API_BASE = (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE)
  ? process.env.REACT_APP_API_BASE.replace(/\/$/, '')
  : 'http://127.0.0.1:8000';
// Convenience helper to build absolute URLs
export const apiUrl = (path = '') => `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
