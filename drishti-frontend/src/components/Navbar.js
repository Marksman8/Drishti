import React, { useEffect, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../SupabaseClient';
import drishtiLogo from './drishtilogo.png';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Check for an existing session on load
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    checkUser();

    // 2. Listen for Auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 w-full h-20 flex justify-between items-center px-12 bg-[#0f172a] border-b border-[#facc15]/20 z-[1000] shadow-xl">
      {/* Brand Section */}
      <Link to="/" className="flex items-center gap-3 group">
        <img
          src={drishtiLogo}
          alt="DRISHTI Logo"
          className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
        />
        <span className="text-2xl font-black tracking-tighter text-[#facc15] uppercase">
          DRISHTI
        </span>
      </Link>

      {/* Navigation Links */}
      <div className="hidden md:flex space-x-10 font-bold items-center uppercase text-[11px] tracking-widest">
        {[
          { name: 'Home', path: '/' },
          { name: 'Course', path: '/course' },
          { name: 'About', path: '/about' },
          { name: 'Contact', path: '/contact' }
        ].map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `transition-all duration-300 py-1 ${
                isActive
                ? "text-[#facc15] border-b-2 border-[#facc15]"
                : "text-slate-400 hover:text-[#facc15]"
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </div>

      {/* Action Area - Dynamic Greeting & Buttons */}
      <div className="flex items-center gap-6">
        {user ? (
          <div className="flex items-center gap-6">
            {/* Greeting Section */}
            <div className="text-right hidden sm:block">
              <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em]">Logged in as</p>
              <p className="text-sm font-bold text-white tracking-tight">
                {user.user_metadata?.full_name || 'User'}
              </p>
            </div>

            {/* Dashboard Button (Same style as your Login button) */}
            <Link
              to="/dashboard"
              className="bg-[#facc15] text-[#0f172a] px-6 py-2.5 rounded-full font-black hover:bg-white transition-all shadow-lg active:scale-95 text-[11px] uppercase tracking-widest"
            >
              Dashboard
            </Link>

            {/* Subtle Logout Link */}
            <button
              onClick={handleLogout}
              className="text-slate-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest"
            >
              Logout
            </button>
          </div>
        ) : (
          /* Original Login Button */
          <Link
            to="/login"
            className="bg-[#facc15] text-[#0f172a] px-8 py-2.5 rounded-full font-black hover:bg-white transition-all shadow-lg active:scale-95 text-[11px] uppercase tracking-widest"
          >
            Login / Register
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;