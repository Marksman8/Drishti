// Consent is intentionally NOT persisted: it lives only in memory for the
// current page load, so the banner is shown again on every refresh / startup.
let consent = null; // 'all' | 'essential' | 'rejected' | null
const listeners = new Set();

export function getConsent() {
  return consent;
}

export function hasChosen() {
  return consent !== null;
}

// Activity analytics are allowed ONLY when the user accepted all cookies.
export function isActivityTrackingAllowed() {
  return consent === 'all';
}

export function setConsent(choice) {
  consent = choice;
  listeners.forEach((fn) => {
    try { fn(choice); } catch (_) { /* ignore */ }
  });
}

export function onConsentChange(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
