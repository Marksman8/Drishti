import React, { useState } from 'react';
import { supabase } from '../SupabaseClient';

const BookingModal = ({ isOpen, onClose, courseTitle }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    venueType: 'Their Premises (Visit School)',
    studentCount: '',
    preferredDate1: '',
    preferredDate2: '',
    preferredDate3: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBooking = async () => {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("Please log in first!");
        setIsSubmitting(false);
        return;
      }
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

      const bookingData = {
        orgId: user.id,
        schoolName: profile?.full_name || 'Unknown School',
        courseName: courseTitle,
        venueType: formData.venueType,
        studentCount: formData.studentCount,
        preferredDates: [
          formData.preferredDate1,
          formData.preferredDate2,
          formData.preferredDate3
        ].filter(date => date).join(','),
        status: 'PENDING'
      };

      const response = await fetch('http://localhost:8080/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          onClose();
        }, 3000);
      } else {
        alert("Something went wrong");
      }
    } catch(err) {
      console.error(err);
      alert("Failed to submit request");
    }
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-[#032b7a]/40">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">

        {/* Header */}
        <div className="bg-[#032b7a] p-8 text-white relative">
          <h2 className="text-2xl font-black uppercase tracking-tighter">Institutional Request</h2>
          <p className="text-[#f4b41a] text-sm font-bold uppercase tracking-widest mt-1">Course: {courseTitle}</p>
          <button
            onClick={onClose}
            className="absolute top-8 right-8 text-white/60 hover:text-[#f4b41a] text-2xl hover:scale-110 transition"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <div className="p-10 space-y-8">

          {/* Venue Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 ml-2 tracking-widest">Venue Type</label>
              <select
                name="venueType"
                value={formData.venueType}
                onChange={handleInputChange}
                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:ring-2 ring-[#032b7a]/10 focus:border-[#032b7a] transition-all text-slate-900 font-medium cursor-pointer"
              >
                <option value="Their Premises (Visit School)">Their Premises (Visit School)</option>
                <option value="Our Premises (Visit College)">Our Premises (Visit College)</option>
                <option value="Exclusive Online Session">Exclusive Online Session</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 ml-2 tracking-widest">Approx Student Count</label>
              <input
                name="studentCount"
                type="number"
                placeholder="e.g. 50"
                value={formData.studentCount}
                onChange={handleInputChange}
                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:ring-2 ring-[#032b7a]/10 focus:border-[#032b7a] transition-all text-slate-900"
              />
            </div>
          </div>

          {/* Date Options */}
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-slate-500 ml-2 tracking-widest">Provide 3 Preferred Dates</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                name="preferredDate1"
                type="date"
                value={formData.preferredDate1}
                onChange={handleInputChange}
                className="bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none text-sm focus:border-[#032b7a] transition-all text-slate-900"
              />
              <input
                name="preferredDate2"
                type="date"
                value={formData.preferredDate2}
                onChange={handleInputChange}
                className="bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none text-sm focus:border-[#032b7a] transition-all text-slate-900"
              />
              <input
                name="preferredDate3"
                type="date"
                value={formData.preferredDate3}
                onChange={handleInputChange}
                className="bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none text-sm focus:border-[#032b7a] transition-all text-slate-900"
              />
            </div>
          </div>

          <button
            onClick={handleBooking}
            disabled={isSubmitting}
            className="w-full bg-[#032b7a] py-5 rounded-2xl text-white font-black uppercase tracking-widest hover:bg-[#f4b41a] hover:text-[#032b7a] hover:shadow-xl hover:shadow-yellow-500/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit Booking Request"}
          </button>
        </div>

        {/* Success Popup */}
        {showSuccess && (
          <div className="absolute inset-0 bg-[#032b7a]/95 flex items-center justify-center animate-in fade-in duration-300">
            <div className="text-center text-white">
              <div className="text-6xl mb-4">✓</div>
              <h3 className="text-2xl font-black uppercase mb-2">Submission Successful!</h3>
              <p className="text-[#f4b41a] font-bold text-sm">Check your dashboard for prior confirmation</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;