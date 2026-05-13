import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, logout } from '../services/AuthService';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await login({ email, password });
      if (result?.user?.role !== 'ADMIN') {
        logout();
        setError('This account is not an admin.');
        return;
      }
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-6">
      <div className="bg-white/5 border border-white/10 p-10 rounded-[2rem] max-w-md w-full">
        <div className="text-center mb-8">
          <p className="text-[10px] font-black uppercase text-[#facc15] tracking-[0.3em]">
            Restricted Access
          </p>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-white mt-2">
            Admin Portal
          </h1>
          <div className="w-12 h-1 bg-[#facc15] mx-auto mt-4 rounded-full" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-white outline-none focus:border-[#facc15]"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-white outline-none focus:border-[#facc15]"
          />
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#facc15] text-[#0f172a] py-3 rounded-full font-black uppercase tracking-widest text-[11px] disabled:opacity-50"
          >
            {loading ? 'Authenticating…' : 'Enter Admin Console'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
