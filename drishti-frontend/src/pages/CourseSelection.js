import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../config/api';
import { getEffectiveRole, onAuthChange } from '../services/AuthService';
import Navbar from '../components/Navbar';

const CourseSelection = () => {
  const [userRole, setUserRole] = useState(getEffectiveRole() || 'STUDENT');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthChange(() => setUserRole(getEffectiveRole() || 'STUDENT'));
    return () => unsub();
  }, []);

  useEffect(() => {
    let cancelled = false;
    apiFetch('/api/courses')
      .then(async (res) => {
        if (cancelled) return;
        if (res.ok) setCourses(await res.json());
      })
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, []);

  const general = courses.filter(c => (c.type || '').toLowerCase() !== 'specialised');
  const specialised = courses.filter(c => (c.type || '').toLowerCase() === 'specialised');

  if (loading) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-[#facc15] font-black uppercase tracking-widest">
       Loading Drishti Portal...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] pb-24 text-white font-sans relative">
      <Navbar />

      <div className="max-w-7xl mx-auto pt-32 px-6 relative z-10">
        {courses.length === 0 && (
          <div className="bg-white/[0.03] border border-dashed border-white/10 p-16 rounded-[2.5rem] text-center">
            <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-300 mb-2">
              No courses yet
            </h2>
            <p className="text-slate-500 text-sm">
              The admin hasn't published any courses. Check back soon.
            </p>
          </div>
        )}

        {general.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-10">
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter">
                General <span className="text-[#facc15]">Modules</span>
              </h2>
              <div className="h-1 flex-1 bg-[#facc15]/20 rounded-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {general.map(course => (
                <CourseTile key={course.id} course={course} userRole={userRole} />
              ))}
            </div>
          </section>
        )}

        {specialised.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-10">
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter">
                Specialised <span className="text-pink-400">Tracks</span>
              </h2>
              <div className="h-1 flex-1 bg-pink-500/20 rounded-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {specialised.map(course => (
                <CourseTile key={course.id} course={course} userRole={userRole} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

const CourseTile = ({ course, userRole }) => {
  const isInstitution = userRole === 'INSTITUTION';
  const isSpecialised = (course.type || '').toLowerCase() === 'specialised';
  const accent = isSpecialised ? 'text-pink-400 border-pink-500/30 bg-pink-500/20' : 'text-[#facc15] border-[#facc15]/30 bg-[#facc15]/10';

  return (
    <Link
      to={`/course/${course.id}`}
      className="group block bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-7 hover:border-[#facc15]/40 transition-all shadow-2xl"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-[#facc15] transition-colors">
          {course.title}
        </h3>
        <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter border ${accent}`}>
          {course.type || 'Course'}
        </span>
      </div>
      {course.professor && (
        <p className="text-xs text-slate-400 mb-4">
          <span className="text-[#facc15]/70 font-bold">Lead:</span> {course.professor}
        </p>
      )}
      {course.description && (
        <p className="text-sm text-slate-300/80 leading-relaxed mb-6 line-clamp-3">
          {course.description}
        </p>
      )}
      <div className="flex items-center justify-between border-t border-white/5 pt-4">
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
          {course.duration || 'Enrollment open'}
        </span>
        <span className="text-[10px] text-[#facc15] font-black uppercase tracking-widest group-hover:translate-x-1 transition-transform">
          {isInstitution ? 'View & request →' : 'View & enroll →'}
        </span>
      </div>
    </Link>
  );
};

export default CourseSelection;
