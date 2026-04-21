import React from 'react';

const CourseCard = ({ course, userRole, onBookClick, onEnrollClick }) => {
  return (
    <div className="bg-transparent overflow-hidden max-w-sm transition-all duration-300">

      {/* Top Image Section */}
      <div className="relative h-44 bg-slate-900/50 flex items-center justify-center m-2 rounded-[1.5rem] overflow-hidden border border-white/5">
        <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=500')] bg-cover bg-center group-hover:scale-110 transition-transform duration-700"></div>
        <button className="relative z-10 bg-white/10 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/20 text-white text-[11px] font-black uppercase tracking-widest hover:bg-[#facc15] hover:text-[#0f172a] transition-all duration-300">
          ▶ View Sample Video
        </button>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-black text-white leading-tight tracking-tight uppercase group-hover:text-[#facc15] transition-colors">
            {course.title}
          </h3>
          <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${
            course.type === 'Specialised'
              ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
              : 'bg-yellow-500/10 text-[#facc15] border border-[#facc15]/30'
          }`}>
            {course.type}
          </span>
        </div>

        {/* Professor Info */}
        <div className="flex items-center gap-3 my-5">
          <div className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-lg">🎓</div>
          <div>
            <p className="text-sm font-bold text-white/90">{course.professor}</p>
            <p className="text-[9px] text-slate-400 uppercase font-black tracking-[0.2em]">Lead Instructor</p>
          </div>
        </div>

        {/* Topics Section */}
        <div className="mb-6">
          <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-3">Syllabus Highlights</p>
          <div className="flex flex-wrap gap-2">
            {course.topics.map((topic, i) => (
              <span key={i} className="text-[10px] bg-white/5 text-blue-100/80 px-3 py-1.5 rounded-lg border border-white/5 font-medium">
                {topic}
              </span>
            ))}
          </div>
        </div>

        {/* Session Alert - Theme matching Slate & Gold */}
        <div className="bg-white/5 border border-white/10 p-4 rounded-[1.5rem] mb-6 backdrop-blur-sm">
          <p className="text-[9px] font-black text-[#facc15] uppercase tracking-widest">Next Live Intake</p>
          <p className="text-sm font-black text-white">{course.nextDate || "Enrollment Open"}</p>
        </div>

        {/* --- ROLE BASED ACTION BUTTONS --- */}
        {userRole === "INSTITUTION" ? (
          <button
            onClick={() => onBookClick(course.title)}
            className="w-full bg-white text-[#0f172a] py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-[#facc15] transition-all shadow-xl active:scale-95 text-xs border-b-4 border-slate-300 hover:border-[#facc15]"
          >
            Request Institutional Visit
          </button>
        ) : (
          <button
            onClick={() => onEnrollClick(course.title)}
            className="w-full bg-[#facc15] text-[#0f172a] py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-yellow-900/20 active:scale-95 text-xs border-b-4 border-yellow-600 hover:border-slate-200"
          >
            Book Online Seat
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseCard;