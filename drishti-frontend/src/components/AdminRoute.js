import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../SupabaseClient';

const AdminRoute = ({ children }) => {
  const [status, setStatus] = useState('checking'); // checking | allowed | denied

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { if (!cancelled) setStatus('denied'); return; }

      // TEMPORARY: allow any authenticated user. Tighten back to
      //   profile.role === 'ADMIN'
      // once a real admin profile exists in Supabase.
      if (cancelled) return;
      setStatus('allowed');
    })();
    return () => { cancelled = true; };
  }, []);

  if (status === 'checking') {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-[#facc15] font-black uppercase tracking-widest">
        Verifying access…
      </div>
    );
  }
  if (status === 'denied') return <Navigate to="/login" replace />;
  return children;
};

export default AdminRoute;