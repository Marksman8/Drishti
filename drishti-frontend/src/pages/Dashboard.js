import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../config/api';
import { getUser, isAuthenticated, getEffectiveRole, onAuthChange } from '../services/AuthService';

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!isAuthenticated()) {
          navigate('/login');
          return;
        }
        const user = getUser();
        if (!user) {
          navigate('/login');
          return;
        }

        const effectiveRole = getEffectiveRole() || 'STUDENT';
        setProfile({
          id: user.id,
          full_name: user.fullName,
          role: effectiveRole,
        });

        setBookedSlots([]);
        setMyBookings([]);

        if (effectiveRole === 'INSTITUTION') {
          const response = await apiFetch(`/api/bookings/user/${user.id}`);
          if (response.ok) {
            setMyBookings(await response.json());
          }
        } else if (effectiveRole === 'STUDENT') {
          const response = await apiFetch(`/api/slots/user/${user.id}`);
          if (response.ok) {
            setBookedSlots(await response.json());
          }
        }
      } catch (err) {
        console.error("Dashboard load failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    const unsubscribe = onAuthChange(() => {
      setLoading(true);
      fetchDashboardData();
    });
    return () => unsubscribe();
  }, [navigate]);

  if (loading) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#facc15]"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-white pt-24 px-8 md:px-16">
      <div className="mb-12 border-b border-white/5 pb-8">
        <h1 className="text-4xl font-black uppercase tracking-tighter">
          {profile?.role === 'INSTITUTION' ? 'Institution' : 'Student'}{" "}
          <span className="text-[#facc15]">Dashboard</span>
        </h1>
        <p className="text-slate-400 mt-2 uppercase text-[10px] tracking-[0.3em] font-bold">
          Welcome back, {profile?.full_name || 'User'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {profile?.role !== 'INSTITUTION' && (
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold uppercase tracking-tight flex items-center gap-2">
              <span className="w-2 h-6 bg-[#facc15] rounded-full"></span>
              My Booked Sessions
            </h2>

            {bookedSlots.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {bookedSlots.map((slot) => (
                  <div key={slot.id} className="bg-white/5 border border-white/10 p-6 rounded-[2rem] hover:border-[#facc15]/50 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-black uppercase text-white group-hover:text-[#facc15] transition-colors">
                          {slot.courseName}
                        </h3>
                        <p className="text-slate-400 text-xs mt-1">
                          {slot.slotDate} • {slot.slotTime}
                        </p>
                      </div>
                      <span className="bg-green-500/20 text-green-400 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                        Confirmed
                      </span>
                    </div>

                    {slot.meetingLink ? (
                      <a
                        href={slot.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-6 flex items-center justify-center gap-2 w-full bg-[#facc15] text-[#0f172a] py-3 rounded-xl font-black uppercase text-[11px] tracking-widest hover:bg-white transition-all shadow-lg shadow-yellow-400/10"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Join Google Meet
                      </a>
                    ) : (
                      <div className="mt-6 w-full bg-white/5 text-slate-500 py-3 rounded-xl font-bold text-center text-[10px] uppercase border border-dashed border-white/10">
                        Link Pending Admin Setup
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white/[0.02] border border-dashed border-white/10 p-12 rounded-[2rem] text-center">
                <p className="text-slate-500 font-bold italic">No personal online slots found. Visit Course page to book.</p>
              </div>
            )}
          </div>
        )}

        <div className={`${profile?.role === 'INSTITUTION' ? 'lg:col-span-2' : 'lg:col-span-1'} space-y-8`}>
          {profile?.role === 'INSTITUTION' && (
            <div className="bg-[#facc15]/5 border border-[#facc15]/20 p-8 rounded-[2.5rem]">
              <h2 className="text-xl font-bold uppercase tracking-tight flex items-center gap-2 mb-6">
                <span className="w-2 h-6 bg-[#facc15] rounded-full"></span>
                Institutional Requests
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {myBookings.length === 0 ? (
                  <p className="text-slate-500 italic text-sm">No campus requests submitted yet.</p>
                ) : (
                  myBookings.map(booking => (
                    <div key={booking.id} className="bg-white/5 p-6 rounded-3xl border border-white/5 hover:border-[#facc15]/30 transition-all">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-lg font-black uppercase tracking-widest text-white">
                            {booking.courseName}
                          </span>
                          <div className="text-[11px] text-slate-400 mt-3 space-y-2">
                            <p><span className="text-[#facc15] font-bold">VENUE:</span> {booking.venueType || 'Visit School'}</p>
                            <p><span className="text-[#facc15] font-bold">STUDENTS:</span> {booking.studentCount}</p>
                            <p><span className="text-[#facc15] font-bold">DATES:</span> {booking.preferredDates}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border ${
                            booking.status === 'PENDING' ? 'text-yellow-500 border-yellow-500/20 bg-yellow-500/5' :
                            booking.status === 'APPROVED' ? 'text-green-400 border-green-400/20 bg-green-400/5' :
                            'text-blue-400 border-blue-400/20 bg-blue-400/5'
                          }`}>
                            {booking.status === 'PENDING' ? 'Awaiting Approval' : booking.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem]">
            <h3 className="text-white font-black uppercase text-sm tracking-widest mb-6">Activity Overview</h3>
            <div className="flex items-center gap-4">
              <div className="text-3xl font-black text-[#facc15]">
                {profile?.role === 'INSTITUTION' ? myBookings.length : bookedSlots.length}
              </div>
              <div className="text-[10px] text-slate-400 uppercase font-bold leading-tight">
                Total {profile?.role === 'INSTITUTION' ? 'Campus Requests' : 'Booked Sessions'}<br/>Tracked
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
