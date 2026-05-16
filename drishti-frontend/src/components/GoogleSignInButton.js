import React, { useEffect, useRef } from 'react';

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';
const SCRIPT_SRC = 'https://accounts.google.com/gsi/client';

function loadGsi() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) return resolve();
    let script = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
    if (!script) {
      script = document.createElement('script');
      script.src = SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
    script.addEventListener('load', () => resolve());
    script.addEventListener('error', () => reject(new Error('Failed to load Google script')));
  });
}

// Renders the official "Sign in with Google" button (account chooser popup).
// onCredential receives the Google ID token string.
const GoogleSignInButton = ({ onCredential }) => {
  const divRef = useRef(null);

  useEffect(() => {
    if (!CLIENT_ID) return;
    let cancelled = false;

    loadGsi()
      .then(() => {
        if (cancelled || !window.google?.accounts?.id) return;
        window.google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: (resp) => onCredential(resp.credential),
        });
        if (divRef.current) {
          window.google.accounts.id.renderButton(divRef.current, {
            theme: 'filled_blue',
            size: 'large',
            shape: 'pill',
            width: 260,
            text: 'continue_with',
          });
        }
      })
      .catch(() => {});

    return () => { cancelled = true; };
  }, [onCredential]);

  if (!CLIENT_ID) {
    return (
      <p className="text-[10px] text-gray-400 text-center mt-2">
        Google sign-in not configured (set REACT_APP_GOOGLE_CLIENT_ID)
      </p>
    );
  }

  return <div ref={divRef} className="flex justify-center my-3" />;
};

export default GoogleSignInButton;
