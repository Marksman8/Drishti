import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom'; // Added for navigation

const JoinBatch = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [studentName, setStudentName] = useState(""); // Needed for certificate
  const [step, setStep] = useState(1); // 1: Code, 2: Details, 3: Success

  const handleVerifyCode = (e) => {
    e.preventDefault();
    if(code.toUpperCase() === "DRISHTI") {
      setStep(2);
    } else {
      alert("Invalid Code! Please check with your Professor.");
    }
  };

  const handleEnterDetails = (e) => {
    e.preventDefault();
    if(studentName.length > 2) {
      setStep(3);
    } else {
      alert("Please enter your full name for the certificate.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-6">
        {/* STEP 1: ENTER ACCESS CODE */}
        {step === 1 && (
          <div className="bg-white w-full max-w-md p-10 rounded-[3rem] shadow-2xl text-center animate-in fade-in zoom-in">
            <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Enter Batch Code</h1>
            <p className="text-slate-400 text-sm mb-8 font-medium">Provided by your instructor during the session.</p>

            <form onSubmit={handleVerifyCode} className="space-y-6">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. DRISHTI"
                className="w-full text-center text-3xl font-black tracking-[0.5em] py-6 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-3xl outline-none transition-all uppercase"
              />
              <button type="submit" className="w-full bg-blue-700 text-white py-5 rounded-3xl font-black uppercase tracking-widest hover:bg-blue-800 transition-all shadow-xl shadow-blue-200">
                Verify Code
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: ENTER STUDENT DETAILS */}
        {step === 2 && (
          <div className="bg-white w-full max-w-md p-10 rounded-[3rem] shadow-2xl text-center animate-in slide-in-from-right">
            <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Almost There!</h1>
            <p className="text-slate-400 text-sm mb-8 font-medium">Please enter your name as it should appear on your certificate.</p>

            <form onSubmit={handleEnterDetails} className="space-y-6 text-left">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-4 mb-2 block">Full Name</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl outline-none transition-all font-bold"
                />
              </div>
              <button type="submit" className="w-full bg-blue-700 text-white py-5 rounded-3xl font-black uppercase tracking-widest hover:bg-blue-800 transition-all">
                Continue to Session
              </button>
            </form>
          </div>
        )}

        {/* STEP 3: JOINED & WAIT FOR QUIZ */}
        {step === 3 && (
          <div className="bg-white w-full max-w-md p-10 rounded-[3rem] shadow-2xl text-center animate-in zoom-in">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">✓</div>
            <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Welcome, {studentName}!</h1>
            <p className="text-slate-400 text-sm mb-8 font-medium">You are now enrolled in the offline session. Click below to start your assessment.</p>

            <div className="space-y-4">
              <button
                onClick={() => navigate('/quiz', { state: { studentName } })}
                className="w-full bg-blue-700 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-800 transition-all shadow-lg shadow-blue-100"
              >
                Start Final Quiz
              </button>
              <button onClick={() => setStep(1)} className="text-slate-400 text-xs font-bold uppercase hover:text-slate-600">
                Exit Session
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinBatch;