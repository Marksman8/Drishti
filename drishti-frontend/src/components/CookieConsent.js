import React, { useState } from 'react';
import { hasChosen, setConsent } from '../services/ConsentService';

const CookieConsent = () => {
  const [visible, setVisible] = useState(!hasChosen());

  if (!visible) return null;

  const choose = (choice) => {
    setConsent(choice);
    setVisible(false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[2000] p-4 md:p-6">
      <div className="max-w-4xl mx-auto bg-[#0f172a] border border-[#facc15]/30 rounded-2xl shadow-2xl p-6 md:flex md:items-center md:gap-6">
        <div className="flex-1 mb-4 md:mb-0">
          <h3 className="text-[#facc15] font-black uppercase text-sm tracking-widest mb-2">
            Cookie Preferences
          </h3>
          <p className="text-slate-300 text-xs leading-relaxed">
            We use <strong>essential cookies</strong> to keep you signed in. With your
            consent we also record <strong>activity analytics</strong> (the actions you
            take in the portal) so administrators can review usage. You can accept all,
            keep only essentials, or reject optional cookies.
          </p>
        </div>
        <div className="flex flex-col gap-2 md:w-56">
          <button
            onClick={() => choose('all')}
            className="bg-[#facc15] text-[#0f172a] py-2.5 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all"
          >
            Accept All
          </button>
          <button
            onClick={() => choose('essential')}
            className="bg-white/10 text-white py-2.5 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-white/20 transition-all"
          >
            Essential Only
          </button>
          <button
            onClick={() => choose('rejected')}
            className="text-slate-400 py-2 rounded-full font-black uppercase text-[10px] tracking-widest hover:text-white transition-all"
          >
            Reject Optional
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
