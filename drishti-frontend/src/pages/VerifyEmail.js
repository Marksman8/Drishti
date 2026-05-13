import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { verifyEmail } from '../services/AuthService';

const VerifyEmail = () => {
  const [params] = useSearchParams();
  const token = params.get('token');
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Missing verification token.');
      return;
    }
    verifyEmail(token)
      .then((res) => {
        setStatus('success');
        setMessage(res?.message || 'Email verified. You can now log in.');
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.message || 'Verification failed.');
      });
  }, [token]);

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-6">
      <div className="bg-white/5 border border-white/10 p-10 rounded-[2rem] max-w-md w-full text-center">
        <h1 className="text-2xl font-black uppercase tracking-tighter text-[#facc15] mb-4">
          {status === 'verifying' ? 'Verifying…' : status === 'success' ? 'Verified' : 'Verification Failed'}
        </h1>
        <p className="text-slate-300 mb-8">{message}</p>
        <Link
          to="/login"
          className="inline-block bg-[#facc15] text-[#0f172a] px-8 py-3 rounded-full font-black uppercase tracking-widest text-[11px]"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default VerifyEmail;
