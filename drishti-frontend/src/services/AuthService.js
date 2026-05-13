const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
const TOKEN_KEY = 'drishti_token';
const USER_KEY = 'drishti_user';
const VIEW_AS_KEY = 'drishti_view_as';

const listeners = new Set();

function notify() {
  for (const fn of listeners) {
    try { fn(getUser()); } catch (e) { /* ignore */ }
  }
}

async function jsonFetch(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
  });
  let body = null;
  try { body = await res.json(); } catch (_) { /* empty body */ }
  if (!res.ok) {
    const msg = (body && (body.error || body.message)) || res.statusText || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return body;
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser() {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch (_) { return null; }
}

export function isAuthenticated() {
  return !!getToken();
}

// Admins can switch their "view-as" role to test student/institution screens.
// For non-admins, this is a no-op — getEffectiveRole always returns their real role.
export function getViewAs() {
  return localStorage.getItem(VIEW_AS_KEY);
}

export function setViewAs(role) {
  if (role && role !== 'ADMIN') {
    localStorage.setItem(VIEW_AS_KEY, role);
  } else {
    localStorage.removeItem(VIEW_AS_KEY);
  }
  notify();
}

export function getEffectiveRole() {
  const user = getUser();
  if (!user) return null;
  if (user.role === 'ADMIN') {
    const override = getViewAs();
    return override || 'ADMIN';
  }
  return user.role;
}

export function onAuthChange(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function persist(token, user) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  notify();
}

export async function register({ email, password, fullName, role }) {
  return jsonFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, fullName, role })
  });
}

export async function login({ email, password }) {
  const data = await jsonFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  persist(data.token, data.user);
  return data;
}

export async function verifyEmail(token) {
  return jsonFetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`);
}

export async function forgotPassword(email) {
  return jsonFetch('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email })
  });
}

export async function resetPassword({ token, newPassword }) {
  return jsonFetch('/api/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, newPassword })
  });
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(VIEW_AS_KEY);
  notify();
}
