import axios from 'axios';
import { API_BASE } from './config';

// Set a base URL (modules often use absolute URLs already; this is a safe default)
axios.defaults.baseURL = API_BASE;

// Helper: decode JWT payload safely
const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

const logoutAndRedirect = () => {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  } catch {}
  if (typeof window !== 'undefined' && window.location && window.location.pathname !== '/auth') {
    // Use hard redirect to reset app state
    window.location.assign('/auth');
  }
};

// Preemptive: if token already expired, logout immediately; else schedule auto-logout at exp
(() => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;
    const payload = parseJwt(token);
    if (payload?.exp) {
      const expiresAt = payload.exp * 1000; // seconds -> ms
      const now = Date.now();
      if (expiresAt <= now) {
        logoutAndRedirect();
      } else {
        const ms = expiresAt - now + 1000; // add slight buffer
        setTimeout(() => {
          // Confirm token hasn't changed to a newer one
          const current = localStorage.getItem('token');
          if (current === token) logoutAndRedirect();
        }, Math.min(ms, 2 ** 31 - 1)); // clamp to max setTimeout
      }
    }
  } catch {}
})();

// Cross-tab sync: if token is removed in another tab, redirect here
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'token' && !e.newValue) {
      logoutAndRedirect();
    }
  });
}

// Attach Authorization header automatically when missing
axios.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('token');
    if (token && !(config.headers && config.headers.Authorization)) {
      config.headers = { ...(config.headers || {}), Authorization: `Bearer ${token}` };
    }
  } catch {}
  return config;
});

// Detect auth errors and force logout
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const data = error?.response?.data;
    const message = typeof data === 'string' ? data : (data?.detail || data?.code || data?.messages?.[0]?.message || '');
    const looksAuthError =
      status === 401 ||
      status === 403 ||
      /token_not_valid|not authenticated|credentials|expired|authorization/i.test(String(message));

    if (looksAuthError) {
      logoutAndRedirect();
    }
    return Promise.reject(error);
  }
);

export {}; // module side-effects only
