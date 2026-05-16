import { apiFetch } from '../config/api';
import { isActivityTrackingAllowed } from './ConsentService';
import { isAuthenticated } from './AuthService';

// Records a user action for the admin activity log.
// No-op unless the user is logged in AND accepted analytics cookies.
export async function logActivity(action, detail = '') {
  if (!isAuthenticated() || !isActivityTrackingAllowed()) return;
  try {
    await apiFetch('/api/activity', {
      method: 'POST',
      body: JSON.stringify({ action, detail: String(detail).slice(0, 500) }),
    });
  } catch (_) {
    // Activity logging must never break the app.
  }
}
