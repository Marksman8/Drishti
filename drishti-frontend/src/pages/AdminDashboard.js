import React, { useState, useEffect } from 'react';
import { supabase } from '../SupabaseClient';

const AdminDashboard = () => {
  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState("REQUESTS");
  const [loading, setLoading] = useState(false);

  // --- DATABASE DATA STATES ---
  const [pendingRequests, setPendingRequests] = useState([]);
  const [existingCourses, setExistingCourses] = useState([]);

  // --- FORM STATES (Slots & Courses) ---
  const [slotData, setSlotData] = useState({ courseName: '', date: '', time: '', meetLink: '' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentTopic, setCurrentTopic] = useState("");
  const [newCourse, setNewCourse] = useState({ title: '', professor: '', type: 'General', description: '', videoUrl: '', topics: [] });

  // --- UI STATES ---
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [chosenDate, setChosenDate] = useState("");
  const [adminMessage, setAdminMessage] = useState("");

  // --- FETCH DATA FROM SUPABASE ON LOAD ---
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);

    // 1. Fetch School Requests
    const { data: reqs } = await supabase.from('institution_requests').select('*').eq('status', 'Pending');
    if (reqs) setPendingRequests(reqs);

    // 2. Fetch Existing Courses (to populate dropdowns)
    const { data: crs } = await supabase.from('courses').select('*');
    if (crs) setExistingCourses(crs);

    setLoading(false);
  };

  // --- HANDLERS ---

  // 1. Create Online Slot (G-Meet)
  const handleAddSlot = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('course_slots').insert([{
      course_name: slotData.courseName,
      slot_date: slotData.date,
      slot_time: slotData.time,
      meeting_link: slotData.meetLink,
      is_booked: false
    }]);
    if (!error) {
      alert("Online Slot Published!");
      setSlotData({ courseName: '', date: '', time: '', meetLink: '' });
    }
    setLoading(false);
  };

  // 2. Approve Institutional Request
  const handleApprove = async (schoolName) => {
    if (!chosenDate) return alert("Please select a date first!");
    const { error } = await supabase
      .from('institution_requests')
      .update({ status: 'Approved', approved_date: chosenDate, admin_comment: adminMessage })
      .eq('id', selectedRequestId);

    if (!error) {
      alert(`APPROVED: ${schoolName} confirmed for ${chosenDate}.`);
      setPendingRequests(pendingRequests.filter(r => r.id !== selectedRequestId));
      setSelectedRequestId(null);
      setChosenDate("");
    }
  };

  // 3. Add New Course to Catalog
  const addTopic = () => {
    if (currentTopic.trim()) {
      setNewCourse({ ...newCourse, topics: [...newCourse.topics, currentTopic] });
      setCurrentTopic("");
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">

      {/* --- SIDEBAR --- */}
      <aside className="w-72 bg-slate-900 flex flex-col p-8 shadow-2xl z-50">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xl">D</div>
          <div>
            <span className="text-xl font-black text-white uppercase tracking-tighter block leading-none">Drishti</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Management</span>
          </div>
        </div>

        <nav className="flex-1 space-y-3">
          <TabButton active={activeTab === "REQUESTS"} onClick={() => setActiveTab("REQUESTS")} icon="📅" label="School Requests" />
          <TabButton active={activeTab === "SLOTS"} onClick={() => setActiveTab("SLOTS")} icon="⚡" label="Online Slots" />
          <TabButton active={activeTab === "COURSES"} onClick={() => setActiveTab("COURSES")} icon="🎓" label="Manage Courses" />
        </nav>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 overflow-y-auto p-12">

        {/* TAB 1: INSTITUTIONAL REQUESTS */}
        {activeTab === "REQUESTS" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-4xl font-black text-slate-900 uppercase mb-10 tracking-tight">Institutional Stream</h1>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
              <div className="lg:col-span-1 space-y-6">
                <StatCard label="Total Certificates" value="1,284" />
                {selectedRequestId && (
                  <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white animate-in zoom-in">
                    <p className="text-[10px] font-black uppercase text-blue-400 mb-2">Reviewing</p>
                    <h4 className="font-bold text-lg mb-6 leading-tight">{pendingRequests.find(r => r.id === selectedRequestId)?.school_name}</h4>
                    <button onClick={() => handleApprove(pendingRequests.find(r => r.id === selectedRequestId).school_name)} className="w-full bg-blue-600 py-4 rounded-2xl font-black uppercase text-xs">Confirm & Approve</button>
                  </div>
                )}
              </div>
              <div className="lg:col-span-3 overflow-hidden bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 font-black text-[10px] uppercase text-slate-400">
                    <tr><th className="p-6">Institution</th><th className="p-6">Preferred Dates</th><th className="p-6">Message</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-sm">
                    {pendingRequests.map(req => (
                      <tr key={req.id} className={selectedRequestId === req.id ? "bg-blue-50/40" : ""}>
                        <td className="p-6 font-bold">{req.school_name}<br/><span className="text-blue-600 text-[10px] uppercase">{req.course_name}</span></td>
                        <td className="p-6">
                          <div className="flex flex-wrap gap-2">
                            {req.preferred_dates?.map(d => (
                              <button key={d} onClick={() => {setSelectedRequestId(req.id); setChosenDate(d);}} className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold ${chosenDate === d ? "bg-blue-600 text-white" : "bg-white text-slate-400"}`}>{d}</button>
                            ))}
                          </div>
                        </td>
                        <td className="p-6"><input className="bg-slate-50 p-2 rounded-lg w-full" placeholder="Reply..." onChange={e => setAdminMessage(e.target.value)} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CREATE ONLINE SLOTS */}
        {activeTab === "SLOTS" && (
          <div className="animate-in fade-in duration-500 max-w-2xl">
            <h1 className="text-4xl font-black text-slate-900 uppercase mb-10">Create Online Slot</h1>
            <form onSubmit={handleAddSlot} className="bg-white p-10 rounded-[3rem] shadow-xl space-y-6">
              <Select label="Select Course" options={existingCourses} onChange={val => setSlotData({...slotData, courseName: val})} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Date" type="date" onChange={val => setSlotData({...slotData, date: val})} />
                <Input label="Time" type="time" onChange={val => setSlotData({...slotData, time: val})} />
              </div>
              <Input label="Google Meet Link" placeholder="https://meet.google.com/..." onChange={val => setSlotData({...slotData, meetLink: val})} />
              <button disabled={loading} className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black uppercase hover:bg-blue-600 transition-all">
                {loading ? "Publishing..." : "Publish Slot to Students"}
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: COURSE CATALOG */}
        {activeTab === "COURSES" && (
          <div className="animate-in slide-in-from-right-8 duration-500">
            <div className="flex justify-between items-center mb-12">
              <h1 className="text-4xl font-black text-slate-900 uppercase">Course Catalog</h1>
              <button onClick={() => setShowAddModal(true)} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs">+ Create New Course</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {existingCourses.map(course => (
                 <div key={course.id} className="bg-white p-8 rounded-[2rem] border border-slate-100 flex justify-between items-center shadow-sm">
                    <div><p className="font-black text-slate-900 text-lg">{course.title}</p><p className="text-xs text-slate-400 font-bold uppercase mt-1">Lead: {course.professor}</p></div>
                    <span className="text-[10px] font-black px-4 py-1.5 rounded-full uppercase bg-blue-100 text-blue-700">{course.type}</span>
                 </div>
               ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// --- HELPER COMPONENTS ---
const TabButton = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-sm transition-all ${active ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:bg-slate-800"}`}>
    <span>{icon}</span> {label}
  </button>
);

const StatCard = ({ label, value }) => (
  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{label}</p>
    <h3 className="text-4xl font-black text-blue-700">{value}</h3>
  </div>
);

const Input = ({ label, type = "text", placeholder, onChange }) => (
  <div>
    <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest ml-2">{label}</label>
    <input type={type} placeholder={placeholder} className="w-full bg-slate-50 p-4 rounded-2xl outline-none font-bold" onChange={e => onChange(e.target.value)} />
  </div>
);

const Select = ({ label, options, onChange }) => (
  <div>
    <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest ml-2">{label}</label>
    <select className="w-full bg-slate-50 p-4 rounded-2xl outline-none font-bold" onChange={e => onChange(e.target.value)}>
      <option value="">Select a Course...</option>
      {options.map(opt => <option key={opt.id} value={opt.title}>{opt.title}</option>)}
    </select>
  </div>
);

export default AdminDashboard;