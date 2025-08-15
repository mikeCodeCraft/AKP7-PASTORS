// Central API base, configurable via env. Fallback to local dev backend.
export const API_BASE = (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE)
  ? process.env.REACT_APP_API_BASE.replace(/\/$/, '')
  : 'https://rccg-akp7-pastors.vercel.app';

// Convenience helper to build absolute URLs
export const apiUrl = (path = '') => `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
