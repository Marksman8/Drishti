import React, { useEffect, useState } from 'react';
import { supabase } from '../SupabaseClient';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      // 1. Get Logged in Uses
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      // 2. Get User Profile (Role & Name)
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setProfile(profileData);

      // 3. Get Slots/Bookings related to this user
      const { data: slotsData } = await supabase
        .from('course_slots')
        .select('*')
        .eq('booked_by', user.id);

      setBookedSlots(slotsData || []);
      setLoading(false);
    };

    fetchDashboardData();
  }, [navigate]);

  if (loading) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#facc15]"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-white pt-24 px-8 md:px-16">
      {/* Header Section */}
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

        {/* Left/Main Column: Active Slots/Bookings */}
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
                        {slot.course_name}
                      </h3>
                      <p className="text-slate-400 text-xs mt-1">
                        {slot.slot_date} • {slot.slot_time}
                      </p>
                    </div>
                    <span className="bg-green-500/20 text-green-400 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                      Confirmed
                    </span>
                  </div>

                  {/* The Google Meet Button */}
                  {slot.meeting_link ? (
                    <a
                      href={slot.meeting_link}
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
                      Link Waiting for Admin
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white/[0.02] border border-dashed border-white/10 p-12 rounded-[2rem] text-center">
              <p className="text-slate-500 font-bold italic">No active slots found. Head to Courses to book one!</p>
            </div>
          )}
        </div>

        {/* Right Column: Status & Announcements */}
        <div className="space-y-8">
          {/* Status for Institution Admins */}
          {profile?.role === 'INSTITUTION' && (
            <div className="bg-[#facc15]/5 border border-[#facc15]/20 p-8 rounded-[2.5rem]">
              <h3 className="text-[#facc15] font-black uppercase text-sm tracking-widest mb-4">Offline Request Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <span className="text-xs text-slate-400">Campus Visit</span>
                  <span className="text-[10px] font-black bg-orange-500/20 text-orange-400 px-2 py-1 rounded">PENDING</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed italic">
                  "Our admin is reviewing your school's request for the May 12th session. Check back tomorrow."
                </p>
              </div>
            </div>
          )}

          {/* Quick Stats Card */}
          <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem]">
            <h3 className="text-white font-black uppercase text-sm tracking-widest mb-6">Learning Progress</h3>
            <div className="flex items-center gap-4">
              <div className="text-3xl font-black text-[#facc15]">{bookedSlots.length}</div>
              <div className="text-[10px] text-slate-400 uppercase font-bold leading-tight">Sessions<br/>Scheduled</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;