import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import ReviewCard from '../components/ReviewCard';
import HomeAuthForm from '../components/HomeAuthForm';

const LandingPage = () => {
  // Intersection Observer for the smooth reveal animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('animate-active');
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const dummyReviews = [
    {
      id: 1,
      name: "Abhijith S. Nair",
      role: "Principal, St. Mary's School",
      rating: 5,
      comment: "The offline session conducted at our premises was excellent. Our students gained real insights into the management world."
    },
    {
      id: 2,
      name: "Meera Krishnan",
      role: "12th Commerce Student",
      rating: 4,
      comment: "I joined the Saturday online batch. The certificate I received helped me during my college interview!"
    },
    {
      id: 3,
      name: "George Kutty",
      role: "School Administrator",
      rating: 5,
      comment: "Seamless booking process. We selected our preferred dates and the college coordinated perfectly for the campus visit."
    }
  ];

  return (
    <div className="min-h-screen bg-[#032b7a] font-sans text-white selection:bg-[#f4b41a] selection:text-[#032b7a]">
      <Navbar />

              <div className="bg-shape shape1 opacity-20"></div>
              <div className="bg-shape shape2 opacity-10"></div>
              <div className="bg-shape shape3 opacity-20"></div>
              <div className="gold-line gold-line1 opacity-30"></div>
              <div className="gold-line gold-line2 opacity-30"></div>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-32 pb-20 relative">
        {/* Decorative Background Glow */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />
        </div>

        {/* Left Side: Text & Search */}
        <div className="space-y-10 animate-on-scroll slide-up relative z-10">
          <h1 className="text-7xl font-black text-white leading-[1.1] uppercase tracking-tighter">
            You learn <br /> today & <span className="text-[#f4b41a]">earn</span> <br /> tomorrow.
          </h1>

          <div className="relative max-w-md group">
            <span className="absolute inset-y-0 left-4 flex items-center text-blue-200/50 group-focus-within:text-[#f4b41a]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search your course"
              className="w-full py-5 pl-14 pr-6 bg-white/5 border-2 border-white/10 rounded-2xl focus:bg-white/10 focus:border-[#f4b41a] outline-none transition-all text-white placeholder:text-blue-200/30"
            />
          </div>

          <p className="text-blue-100/60 text-lg font-medium">
            Browse 100+ commerce courses. <span className="text-[#f4b41a] font-bold">Sign in on the right</span> to begin.
          </p>
        </div>

        {/* Right Side: Login / Register form */}
        <div className="animate-on-scroll slide-up relative z-10" style={{ transitionDelay: '200ms' }}>
          <HomeAuthForm />
        </div>
      </main>

      {/* Review Section */}
      <section className="bg-[#021b4d] py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-12 relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 items-start">

            {/* Left: Dummy Reviews Grid */}
            <div className="w-full lg:w-2/3">
              <div className="mb-12 animate-on-scroll">
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter">
                  What Our <span className="text-[#f4b41a]">Community</span> Says
                </h2>
                <div className="w-20 h-1.5 bg-[#f4b41a] mt-4 rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dummyReviews.map((rev, index) => (
                  <div key={rev.id} className="animate-on-scroll slide-up" style={{ transitionDelay: `${index * 100}ms` }}>
                    <div className="bg-white/[0.03] border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-md hover:bg-white/[0.07] transition-all">
                      <ReviewCard {...rev} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Write Review Form */}
            <div className="w-full lg:w-1/3 animate-on-scroll slide-up" style={{ transitionDelay: '300ms' }}>
              <div className="bg-white/[0.03] border border-white/10 p-10 rounded-[3rem] backdrop-blur-xl shadow-2xl relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#f4b41a]/10 rounded-full blur-[60px]" />

                <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Post a <span className="text-[#f4b41a]">Review</span></h3>
                <p className="text-[10px] text-blue-200/60 font-black uppercase tracking-[0.2em] mb-8">Tell us about your session</p>

                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <input type="text" placeholder="Your Name" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm outline-none focus:border-[#f4b41a] transition-all" />
                  <select className="w-full bg-[#032b7a] border border-white/10 rounded-2xl px-6 py-4 text-sm text-blue-100 outline-none focus:border-[#f4b41a] cursor-pointer">
                    <option>Student</option>
                    <option>Institution</option>
                  </select>
                  <textarea rows="4" placeholder="How was your experience?" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm outline-none focus:border-[#f4b41a] transition-all resize-none"></textarea>
                  <button className="w-full bg-[#f4b41a] text-[#032b7a] py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white transition-all active:scale-95 shadow-lg shadow-yellow-900/20">
                    Submit Review
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <footer className="max-w-7xl mx-auto px-12 py-16 flex flex-wrap justify-between items-center border-t border-white/10 gap-8 animate-on-scroll">
        <StatItem icon="👥" title="150+ from the world's" sub="best areas" />
        <StatItem icon="📺" title="20+ master lessons" sub="avg per class" />
        <StatItem icon="🕒" title="10 Minutes average" sub="per lesson" />
      </footer>
    </div>
  );
};

const StatItem = ({ icon, title, sub }) => (
  <div className="flex items-center space-x-4">
    <div className="text-3xl filter brightness-200">{icon}</div>
    <div>
      <p className="font-black text-white uppercase text-sm tracking-tight">{title}</p>
      <p className="text-xs font-bold text-blue-200/40 uppercase tracking-widest">{sub}</p>
    </div>
  </div>
);

export default LandingPage;