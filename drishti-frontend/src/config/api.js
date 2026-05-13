import { getToken, logout } from '../services/AuthService';

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export function authHeaders(extra = {}) {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

export async function apiFetch(path, options = {}) {
  const headers = authHeaders(options.headers || {});
  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  if (response.status === 401) {
    logout();
  }
  return response;
}
