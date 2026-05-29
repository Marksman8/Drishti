import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import InstitutionBookingModal from '../components/InstitutionBookingModal';
import StudentBookingModal from '../components/StudentBookingModal';
import { apiFetch } from '../config/api';
import { getEffectiveRole, onAuthChange } from '../services/AuthService';

// Returns an embeddable iframe URL for YouTube/Vimeo, or null if it's a direct file/unknown.
function toEmbedUrl(url) {
  if (!url) return null;
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
}

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(getEffectiveRole() || 'STUDENT');
  const [showStudent, setShowStudent] = useState(false);
  const [showInstitution, setShowInstitution] = useState(false);

  useEffect(() => {
    const unsub = onAuthChange(() => setRole(getEffectiveRole() || 'STUDENT'));
    return () => unsub();
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    apiFetch(`/api/courses/${id}`)
      .then(async (res) => {
        if (cancelled) return;
        if (res.ok) setCourse(await res.json());
        else setCourse(null);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-[#facc15] font-black uppercase tracking-widest">
        Loading course…
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#0f172a]">
        <Navbar />
        <div className="max-w-3xl mx-auto pt-32 px-6 text-center text-white">
          <h1 className="text-3xl font-black uppercase mb-4">Course not found</h1>
          <button
            onClick={() => navigate('/course')}
            className="bg-[#facc15] text-[#0f172a] px-8 py-3 rounded-full font-black uppercase tracking-widest text-[11px]"
          >
            Back to courses
          </button>
        </div>
      </div>
    );
  }

  const isInstitution = role === 'INSTITUTION';
  const embedUrl = toEmbedUrl(course.videoUrl);
  const syllabusItems = (course.syllabus || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white pb-24">
      <Navbar />

      <div className="max-w-6xl mx-auto pt-28 px-6">
        <button
          onClick={() => navigate('/course')}
          className="text-[10px] text-slate-400 hover:text-[#facc15] font-bold uppercase tracking-widest mb-6"
        >
          ← All courses
        </button>

        <div className="flex items-start justify-between flex-wrap gap-4 mb-2">
          <h1 className="text-5xl font-black uppercase tracking-tighter leading-tight">
            {course.title}
          </h1>
          <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest ${
            course.type === 'Specialised'
              ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
              : 'bg-yellow-500/10 text-[#facc15] border border-[#facc15]/30'
          }`}>{course.type || 'Course'}</span>
        </div>
        <p className="text-slate-400 text-sm mb-10">
          {course.professor && <>Lead: <span className="text-white font-bold">{course.professor}</span> · </>}
          {course.duration && <>Duration: <span className="text-white font-bold">{course.duration}</span></>}
        </p>

        {/* --- Video player --- */}
        <div className="bg-black border border-white/10 rounded-[2rem] overflow-hidden aspect-video mb-10 shadow-2xl">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={course.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          ) : course.videoUrl ? (
            <video src={course.videoUrl} controls className="w-full h-full" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold uppercase tracking-widest text-xs">
              No video uploaded yet
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- Description + role-specific info --- */}
          <div className="lg:col-span-2 space-y-8">
            {course.description && (
              <section>
                <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2 mb-4">
                  <span className="w-2 h-6 bg-[#facc15] rounded-full" />
                  About this course
                </h2>
                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{course.description}</p>
              </section>
            )}

            <section>
              <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2 mb-4">
                <span className="w-2 h-6 bg-[#facc15] rounded-full" />
                {isInstitution ? 'What your institution gets' : 'What you will learn'}
              </h2>
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                {isInstitution
                  ? (course.institutionInfo || 'Institution-specific details have not been added yet.')
                  : (course.studentInfo || 'Student-specific details have not been added yet.')}
              </p>
            </section>

            {syllabusItems.length > 0 && (
              <section>
                <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2 mb-4">
                  <span className="w-2 h-6 bg-[#facc15] rounded-full" />
                  Syllabus highlights
                </h2>
                <div className="flex flex-wrap gap-2">
                  {syllabusItems.map((topic, i) => (
                    <span key={i} className="text-xs bg-white/5 text-blue-100/80 px-4 py-2 rounded-lg border border-white/5 font-medium">
                      {topic}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* --- CTA panel --- */}
          <aside className="lg:col-span-1">
            <div className="sticky top-28 bg-white/5 border border-white/10 p-8 rounded-[2rem]">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#facc15] mb-2">
                {isInstitution ? 'Institutional intake' : 'Next live intake'}
              </p>
              <p className="text-2xl font-black text-white mb-6">
                {course.duration || 'Enrollment open'}
              </p>

              {isInstitution ? (
                <button
                  onClick={() => setShowInstitution(true)}
                  className="w-full bg-white text-[#0f172a] py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#facc15] transition-all active:scale-95 shadow-xl"
                >
                  Request Institutional Visit
                </button>
              ) : (
                <button
                  onClick={() => setShowStudent(true)}
                  className="w-full bg-[#facc15] text-[#0f172a] py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white transition-all active:scale-95 shadow-xl shadow-yellow-900/20"
                >
                  Book Online Seat
                </button>
              )}

              <p className="text-[10px] text-slate-500 mt-4 font-bold uppercase tracking-widest">
                Viewing as: {role.toLowerCase()}
              </p>
            </div>
          </aside>
        </div>
      </div>

      <InstitutionBookingModal isOpen={showInstitution} onClose={() => setShowInstitution(false)} courseTitle={course.title} />
      <StudentBookingModal isOpen={showStudent} onClose={() => setShowStudent(false)} courseTitle={course.title} />
    </div>
  );
};

export default CourseDetail;
