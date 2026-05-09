import React, { useState, useEffect } from 'react';
import { supabase } from '../SupabaseClient';
import Navbar from '../components/Navbar';
import CourseCard from '../components/CourseCard';
import BookingModal from '../components/InstitutionBookingModal';
import StudentBookingModal from '../components/StudentBookingModal';

const CourseSelection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [userRole, setUserRole] = useState(null); // Starts as null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const { data } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .maybeSingle();

          // Prefer profiles.role; fall back to user_metadata.role (set at signup).
          const resolved = data?.role || user.user_metadata?.role || 'STUDENT';
          setUserRole(resolved);
        } else {
          setUserRole('STUDENT'); // Fallback for guests
        }
      } catch (err) {
        setUserRole('STUDENT');
      } finally {
        setLoading(false); // Stop the loading spinner
      }
    };

    fetchUserRole();
  }, []);

  const handleOpenModal = (title) => {
    setSelectedCourse(title);
    setIsModalOpen(true);
  };

  const handleOpenStudentModal = (title) => {
    setSelectedCourse(title);
    setIsStudentModalOpen(true);
  };

  // --- DATA ---
  const generalCourses = [
    { title: "Introduction to Commerce", professor: "Dr. Rajesh Kumar", topics: ["Trade & Aids", "Business Org", "E-Commerce"], type: "General" },
    { title: "Business Studies", professor: "Prof. Anil P.", topics: ["Management", "Planning", "Marketing"], type: "General" }
  ];

  const specialisedCourses = [
    { title: "Advanced Accounting & Tally", professor: "Prof. Sarah Thomas", topics: ["GST Filing", "Voucher Entry", "Audit Prep"], type: "Specialised" },
    { title: "Stock Market Essentials", professor: "Dr. Lakshmi S.", topics: ["Trading", "IPO", "Risk Management"], type: "Specialised" }
  ];

  if (loading) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-[#facc15] font-black uppercase tracking-widest">
       Loading Drishti Portal...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] pb-24 text-white font-sans relative">
      <Navbar />

      <div className="max-w-7xl mx-auto pt-32 px-6 relative z-10">

        {/* --- GENERAL COURSES --- */}
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter">
              General <span className="text-[#facc15]">Modules</span>
            </h2>
            <div className="h-1 flex-1 bg-[#facc15]/20 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {generalCourses.map((course, index) => (
              <div key={index} className="group relative bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-2 hover:border-[#facc15]/40 transition-all shadow-2xl">
                <CourseCard
                  course={course}
                  userRole={userRole} // <--- Dynamic role passed here
                  onBookClick={() => handleOpenModal(course.title)}
                  onEnrollClick={() => handleOpenStudentModal(course.title)}
                />
              </div>
            ))}
          </div>
        </section>

        {/* --- SPECIALISED COURSES --- */}
        <section>
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter">
              Specialised <span className="text-pink-400">Tracks</span>
            </h2>
            <div className="h-1 flex-1 bg-pink-500/20 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {specialisedCourses.map((course, index) => (
              <div key={index} className="group relative bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-2 hover:border-pink-500/40 transition-all shadow-2xl">
                <CourseCard
                  course={course}
                  userRole={userRole} // <--- Dynamic role passed here
                  onBookClick={() => handleOpenModal(course.title)}
                  onEnrollClick={() => handleOpenStudentModal(course.title)}
                />
              </div>
            ))}
          </div>
        </section>
      </div>

      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} courseTitle={selectedCourse} />
      <StudentBookingModal isOpen={isStudentModalOpen} onClose={() => setIsStudentModalOpen(false)} courseTitle={selectedCourse} />
    </div>
  );
};

export default CourseSelection;