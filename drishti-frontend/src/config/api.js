import { supabase } from '../SupabaseClient';

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export async function authHeaders(extra = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  return {
    'Content-Type': 'application/json',
    ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
    ...extra,
  };
}

export async function apiFetch(path, options = {}) {
  const headers = await authHeaders(options.headers || {});
  return fetch(`${API_BASE_URL}${path}`, { ...options, headers });
}