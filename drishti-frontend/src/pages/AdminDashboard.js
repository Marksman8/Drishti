import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../config/api';
import { getViewAs, setViewAs } from '../services/AuthService';
import { logActivity } from '../services/Activity';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("REQUESTS");
  const [loading, setLoading] = useState(false);
  const [viewAs, setViewAsState] = useState(getViewAs() || 'ADMIN');

  const openAs = (role, path) => {
    setViewAs(role === 'ADMIN' ? null : role);
    setViewAsState(role);
    navigate(path);
  };

  const [pendingRequests, setPendingRequests] = useState([]);
  const [existingCourses, setExistingCourses] = useState([]);

  const [slotData, setSlotData] = useState({ courseName: '', date: '', time: '', meetLink: '' });

  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [adminMessage, setAdminMessage] = useState("");
  const [activity, setActivity] = useState([]);

  const emptyCourse = {
    id: null, title: '', type: 'General', professor: '', duration: '',
    videoUrl: '', syllabus: '', description: '', studentInfo: '', institutionInfo: ''
  };
  const [courseDraft, setCourseDraft] = useState(emptyCourse);
  const [savingCourse, setSavingCourse] = useState(false);

  const setDraftField = (field, value) => setCourseDraft(d => ({ ...d, [field]: value }));

  const refreshCourses = async () => {
    try {
      const resp = await apiFetch('/api/courses');
      if (resp.ok) setExistingCourses(await resp.json());
    } catch (err) {
      console.error('Failed to refresh courses', err);
    }
  };

  const saveCourse = async (e) => {
    e.preventDefault();
    if (!courseDraft.title.trim()) {
      alert('Title is required.');
      return;
    }
    setSavingCourse(true);
    try {
      const isEdit = !!courseDraft.id;
      const resp = await apiFetch(
        isEdit ? `/api/courses/${courseDraft.id}` : '/api/courses',
        { method: isEdit ? 'PUT' : 'POST', body: JSON.stringify(courseDraft) }
      );
      if (!resp.ok) {
        const body = await resp.text();
        alert(`Save failed (${resp.status}): ${body}`);
        return;
      }
      logActivity(isEdit ? 'COURSE_UPDATED' : 'COURSE_CREATED', courseDraft.title);
      setCourseDraft(emptyCourse);
      await refreshCourses();
    } catch (err) {
      console.error(err);
      alert('Save failed: ' + err.message);
    } finally {
      setSavingCourse(false);
    }
  };

  const editCourse = (c) => {
    setCourseDraft({
      id: c.id,
      title: c.title || '',
      type: c.type || 'General',
      professor: c.professor || '',
      duration: c.duration || '',
      videoUrl: c.videoUrl || '',
      syllabus: c.syllabus || '',
      description: c.description || '',
      studentInfo: c.studentInfo || '',
      institutionInfo: c.institutionInfo || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteCourse = async (id) => {
    const target = existingCourses.find(c => c.id === id);
    if (!window.confirm(`Delete "${target?.title}"? This cannot be undone.`)) return;
    const resp = await apiFetch(`/api/courses/${id}`, { method: 'DELETE' });
    if (resp.ok) {
      logActivity('COURSE_DELETED', target?.title || `#${id}`);
      if (courseDraft.id === id) setCourseDraft(emptyCourse);
      await refreshCourses();
    } else {
      alert('Delete failed');
    }
  };

  const fetchActivity = async () => {
    try {
      const resp = await apiFetch('/api/activity?limit=200');
      if (resp.ok) setActivity(await resp.json());
    } catch (err) {
      console.error("Failed to fetch activity log", err);
    }
  };

  useEffect(() => {
    if (activeTab === 'ACTIVITY') fetchActivity();
  }, [activeTab]);

  useEffect(() => {
    fetchInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const resp = await apiFetch('/api/bookings/pending');
      if (resp.ok) setPendingRequests(await resp.json());
    } catch (err) {
      console.error("Failed to fetch pending requests", err);
    }

    try {
      const resp = await apiFetch('/api/courses');
      if (resp.ok) setExistingCourses(await resp.json());
    } catch (err) {
      console.error("Failed to fetch courses", err);
    }

    setLoading(false);
  };

  const fetchPendingRequests = async () => {
    try {
      const resp = await apiFetch('/api/bookings/pending');
      if (resp.ok) setPendingRequests(await resp.json());
    } catch (err) {
      console.error("Failed to refresh pending requests", err);
    }
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const resp = await apiFetch('/api/slots', {
        method: 'POST',
        body: JSON.stringify({
          courseName: slotData.courseName,
          slotDate: slotData.date,
          slotTime: slotData.time,
          meetingLink: slotData.meetLink,
          isBooked: false
        })
      });
      if (resp.ok) {
        alert("Online Slot Published!");
        setSlotData({ courseName: '', date: '', time: '', meetLink: '' });
      } else {
        alert('Failed to publish slot.');
      }
    } catch (err) {
      console.error('Failed to publish slot', err);
      alert('Failed to publish slot.');
    }
    setLoading(false);
  };

  const approveRequest = async (id, gMeetLink) => {
    const response = await apiFetch(`/api/bookings/approve/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ meetingLink: gMeetLink })
    });
    if (response.ok) {
      alert("Request Approved!");
      logActivity('BOOKING_APPROVED', `Booking #${id}`);
      fetchPendingRequests();
      setSelectedRequestId(null);
      setAdminMessage("");
    }
  };

  const rejectRequest = async (id) => {
    if (!window.confirm("Are you sure you want to reject this request?")) return;
    const response = await apiFetch(`/api/bookings/reject/${id}`, { method: 'PATCH' });
    if (response.ok) {
      alert("Request Rejected!");
      logActivity('BOOKING_REJECTED', `Booking #${id}`);
      fetchPendingRequests();
      setSelectedRequestId(null);
    }
  };

  const setProcessing = async (id) => {
    const response = await apiFetch(`/api/bookings/status/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'PROCESSING' })
    });
    if (response.ok) {
      alert("Request set to Processing!");
      logActivity('BOOKING_PROCESSING', `Booking #${id}`);
      fetchPendingRequests();
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">

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
          <TabButton active={activeTab === "ACTIVITY"} onClick={() => setActiveTab("ACTIVITY")} icon="📊" label="Activity Log" />
        </nav>

        {/* View As switcher - admin-only tool for previewing the app */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <p className="text-[9px] font-black uppercase text-blue-400 tracking-[0.3em] mb-3">Preview Mode</p>
          <p className="text-[10px] text-slate-500 mb-4 leading-relaxed">
            Open the public-facing app as a student or institution to test bookings.
          </p>
          <div className="space-y-2">
            <button
              onClick={() => openAs('STUDENT', '/course')}
              className="w-full bg-[#facc15] text-[#0f172a] px-4 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all active:scale-95"
            >
              Open as Student →
            </button>
            <button
              onClick={() => openAs('INSTITUTION', '/course')}
              className="w-full bg-white text-[#0f172a] px-4 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-50 transition-all active:scale-95"
            >
              Open as Institution →
            </button>
            <button
              onClick={() => openAs('STUDENT', '/dashboard')}
              className="w-full bg-slate-800 text-slate-300 px-4 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-700 transition-all"
            >
              Student Dashboard →
            </button>
            <button
              onClick={() => openAs('INSTITUTION', '/dashboard')}
              className="w-full bg-slate-800 text-slate-300 px-4 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-700 transition-all"
            >
              Institution Dashboard →
            </button>
          </div>
          {viewAs && viewAs !== 'ADMIN' && (
            <p className="text-[9px] text-yellow-500 mt-4 font-bold uppercase tracking-widest">
              Currently previewing as: {viewAs}
            </p>
          )}
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-12">

        {activeTab === "REQUESTS" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-4xl font-black text-slate-900 uppercase mb-10 tracking-tight">Institutional Stream</h1>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
              <div className="lg:col-span-1 space-y-6">
                <StatCard label="Total Certificates" value="1,284" />
                {selectedRequestId && (
                  <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white animate-in zoom-in">
                    <p className="text-[10px] font-black uppercase text-blue-400 mb-2">Reviewing</p>
                    <h4 className="font-bold text-lg mb-4 leading-tight">{pendingRequests.find(r => r.id === selectedRequestId)?.schoolName}</h4>
                    <input
                      className="w-full bg-slate-800 p-3 rounded-xl mb-4 text-sm"
                      placeholder="Google Meet Link..."
                      value={adminMessage}
                      onChange={e => setAdminMessage(e.target.value)}
                    />
                    <button onClick={() => approveRequest(selectedRequestId, adminMessage)} className="w-full bg-blue-600 py-4 rounded-2xl font-black uppercase text-xs">Confirm & Approve</button>
                  </div>
                )}
              </div>
              <div className="lg:col-span-3 overflow-hidden bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 font-black text-[10px] uppercase text-slate-400">
                    <tr><th className="p-6">Institution</th><th className="p-6">Details</th><th className="p-6">Actions</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-sm">
                    {pendingRequests.map(req => (
                      <tr key={req.id} onClick={() => setSelectedRequestId(req.id)} className={`cursor-pointer ${selectedRequestId === req.id ? "bg-blue-50/40" : ""}`}>
                        <td className="p-6 font-bold">{req.schoolName}<br/><span className="text-blue-600 text-[10px] uppercase">{req.courseName}</span></td>
                        <td className="p-6">
                          <div className="space-y-1 text-xs text-slate-500">
                            <p><span className="font-bold text-slate-700">Venue:</span> {req.venueType || 'Not specified'}</p>
                            <p><span className="font-bold text-slate-700">Students:</span> {req.studentCount ?? 'Not specified'}</p>
                            <p><span className="font-bold text-slate-700">Dates:</span> {req.preferredDates || 'Not specified'}</p>
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="flex gap-2 flex-wrap">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const link = window.prompt("Google Meet link for this booking:", "");
                                if (link && link.trim()) approveRequest(req.id, link.trim());
                              }}
                              className="px-3 py-2 bg-green-100 text-green-700 rounded-lg font-bold text-xs uppercase hover:bg-green-200 transition-all"
                            >
                              Approve
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); setProcessing(req.id); }}
                              className="px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg font-bold text-xs uppercase hover:bg-yellow-200 transition-all"
                            >
                              Processing
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); rejectRequest(req.id); }}
                              className="px-3 py-2 bg-red-100 text-red-700 rounded-lg font-bold text-xs uppercase hover:bg-red-200 transition-all"
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "SLOTS" && (
          <div className="animate-in fade-in duration-500 max-w-2xl">
            <h1 className="text-4xl font-black text-slate-900 uppercase mb-10">Create Online Slot</h1>
            <form onSubmit={handleAddSlot} className="bg-white p-10 rounded-[3rem] shadow-xl space-y-6">
              <Select label="Select Course" options={existingCourses} onChange={val => setSlotData(s => ({...s, courseName: val}))} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Date" type="date" onChange={val => setSlotData(s => ({...s, date: val}))} />
                <Input label="Time" type="time" onChange={val => setSlotData(s => ({...s, time: val}))} />
              </div>
              <Input label="Google Meet Link" placeholder="https://meet.google.com/..." onChange={val => setSlotData(s => ({...s, meetLink: val}))} />
              <button disabled={loading} className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black uppercase hover:bg-blue-600 transition-all">
                {loading ? "Publishing..." : "Publish Slot to Students"}
              </button>
            </form>
          </div>
        )}

        {activeTab === "COURSES" && (
          <div>
            <div className="flex justify-between items-center mb-10">
              <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tight">Course Catalog</h1>
              {courseDraft.id && (
                <button
                  onClick={() => setCourseDraft(emptyCourse)}
                  className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900"
                >
                  + New course (clear form)
                </button>
              )}
            </div>

            <form onSubmit={saveCourse} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 mb-12 space-y-5">
              <h2 className="text-lg font-black uppercase tracking-tight text-slate-900 mb-2">
                {courseDraft.id ? `Editing: ${courseDraft.title || 'Untitled'}` : 'Create a new course'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Title *" value={courseDraft.title} onChange={v => setDraftField('title', v)} />
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest ml-2">Type</label>
                  <select
                    value={courseDraft.type}
                    onChange={e => setDraftField('type', e.target.value)}
                    className="w-full bg-slate-50 p-4 rounded-2xl outline-none font-bold"
                  >
                    <option value="General">General</option>
                    <option value="Specialised">Specialised</option>
                  </select>
                </div>
                <Field label="Lead Instructor" value={courseDraft.professor} onChange={v => setDraftField('professor', v)} />
                <Field label="Duration" placeholder="e.g. 8 weeks / 2nd & 4th Sat" value={courseDraft.duration} onChange={v => setDraftField('duration', v)} />
                <div className="md:col-span-2">
                  <Field
                    label="Video URL (YouTube, Vimeo, or .mp4)"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={courseDraft.videoUrl}
                    onChange={v => setDraftField('videoUrl', v)}
                  />
                </div>
                <div className="md:col-span-2">
                  <Field
                    label="Syllabus highlights (comma-separated)"
                    placeholder="GST Filing, Tally, Audit Prep"
                    value={courseDraft.syllabus}
                    onChange={v => setDraftField('syllabus', v)}
                  />
                </div>
              </div>

              <TextArea
                label="Course description"
                value={courseDraft.description}
                onChange={v => setDraftField('description', v)}
                rows={3}
                placeholder="Overview of what this course covers."
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <TextArea
                  label="What students will do / learn"
                  value={courseDraft.studentInfo}
                  onChange={v => setDraftField('studentInfo', v)}
                  rows={5}
                  placeholder="Shown on the course page for student users."
                />
                <TextArea
                  label="What institutions will do / get"
                  value={courseDraft.institutionInfo}
                  onChange={v => setDraftField('institutionInfo', v)}
                  rows={5}
                  placeholder="Shown on the course page for institution users."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={savingCourse}
                  className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                  {savingCourse ? 'Saving…' : (courseDraft.id ? 'Save Changes' : 'Create Course')}
                </button>
                {courseDraft.id && (
                  <button
                    type="button"
                    onClick={() => setCourseDraft(emptyCourse)}
                    className="bg-slate-100 text-slate-700 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <h2 className="text-xl font-black uppercase tracking-tight text-slate-700 mb-5">
              Existing courses ({existingCourses.length})
            </h2>
            {existingCourses.length === 0 ? (
              <div className="bg-white/60 border border-dashed border-slate-200 p-12 rounded-[2rem] text-center text-slate-400 italic">
                No courses yet. Use the form above to publish your first one.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {existingCourses.map(course => (
                  <div key={course.id} className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-start gap-3 mb-3">
                      <div>
                        <p className="font-black text-slate-900 text-lg">{course.title}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">
                          Lead: {course.professor || '—'} · {course.duration || 'No duration'}
                        </p>
                      </div>
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                        (course.type || '').toLowerCase() === 'specialised'
                          ? 'bg-pink-100 text-pink-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>{course.type || 'General'}</span>
                    </div>
                    {course.description && (
                      <p className="text-xs text-slate-500 line-clamp-2 mb-4">{course.description}</p>
                    )}
                    <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${course.videoUrl ? 'text-green-600' : 'text-slate-400'}`}>
                        {course.videoUrl ? '✓ Video uploaded' : 'No video'}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => editCourse(course)}
                          className="px-4 py-2 bg-slate-900 text-white rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteCourse(course.id)}
                          className="px-4 py-2 bg-red-50 text-red-700 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-red-100 transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "ACTIVITY" && (
          <div className="animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-10">
              <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tight">User Activity Log</h1>
              <button
                onClick={fetchActivity}
                className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 transition-all"
              >
                Refresh
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-6 font-bold uppercase tracking-widest">
              Only users who accepted analytics cookies are tracked.
            </p>
            <div className="overflow-hidden bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-50 font-black text-[10px] uppercase text-slate-400">
                  <tr>
                    <th className="p-5">When</th>
                    <th className="p-5">User</th>
                    <th className="p-5">Role</th>
                    <th className="p-5">Action</th>
                    <th className="p-5">Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm">
                  {activity.length === 0 ? (
                    <tr><td colSpan={5} className="p-8 text-center text-slate-400 italic">No activity recorded yet.</td></tr>
                  ) : (
                    activity.map(a => (
                      <tr key={a.id}>
                        <td className="p-5 text-xs text-slate-500 whitespace-nowrap">
                          {a.createdAt ? new Date(a.createdAt).toLocaleString() : '-'}
                        </td>
                        <td className="p-5 text-xs font-bold text-slate-700">{a.userEmail || '-'}</td>
                        <td className="p-5">
                          <span className="text-[9px] font-black px-2 py-1 rounded-full uppercase bg-blue-100 text-blue-700">
                            {a.userRole || '-'}
                          </span>
                        </td>
                        <td className="p-5 text-xs font-black text-slate-900 uppercase">{a.action}</td>
                        <td className="p-5 text-xs text-slate-500">{a.detail || '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

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

const Field = ({ label, value, onChange, placeholder, type = 'text' }) => (
  <div>
    <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest ml-2">{label}</label>
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      className="w-full bg-slate-50 p-4 rounded-2xl outline-none font-bold"
    />
  </div>
);

const TextArea = ({ label, value, onChange, placeholder, rows = 3 }) => (
  <div>
    <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest ml-2">{label}</label>
    <textarea
      value={value}
      placeholder={placeholder}
      rows={rows}
      onChange={e => onChange(e.target.value)}
      className="w-full bg-slate-50 p-4 rounded-2xl outline-none font-medium resize-y"
    />
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
