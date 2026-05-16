import React, { useState } from 'react';
import { sendPhoneOtp, verifyPhoneOtp } from '../services/AuthService';

// Modal shown after registration / first Google sign-in to verify a phone number.
const PhoneVerification = ({ onVerified }) => {
  const [step, setStep] = useState('PHONE'); // PHONE | OTP
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [devOtp, setDevOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await sendPhoneOtp(phone);
      setDevOtp(res?.devOtp || '');
      setStep('OTP');
    } catch (e) {
      setError(e.message || 'Could not send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError('');
    setLoading(true);
    try {
      await verifyPhoneOtp(otp);
      onVerified();
    } catch (e) {
      setError(e.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1500] flex items-center justify-center p-6 bg-[#032b7a]/60 backdrop-blur-sm">
      <div className="bg-[#f8f5ee] w-full max-w-md rounded-[2rem] shadow-2xl p-8">
        <h2 className="text-2xl font-black uppercase tracking-tighter text-[#032b7a] mb-1">
          Verify Your Phone
        </h2>
        <div className="w-12 h-1 bg-[#f4b41a] mb-6 rounded-full" />

        {step === 'PHONE' ? (
          <>
            <p className="text-xs text-gray-500 mb-4">
              Enter your mobile number. We'll send a 6-digit code to confirm it.
            </p>
            <input
              type="tel"
              placeholder="Phone number (e.g. +91 98765 43210)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-white border border-gray-300 px-4 py-3 rounded-xl outline-none focus:border-[#032b7a] mb-4"
            />
            {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
            <button
              onClick={handleSend}
              disabled={loading || phone.trim().length < 7}
              className="w-full bg-[#032b7a] text-white py-3 rounded-xl font-black uppercase tracking-widest text-xs disabled:opacity-50"
            >
              {loading ? 'Sending…' : 'Send Code'}
            </button>
          </>
        ) : (
          <>
            <p className="text-xs text-gray-500 mb-4">
              Enter the 6-digit code sent to <strong>{phone}</strong>.
            </p>
            {devOtp && (
              <p className="text-[11px] bg-yellow-100 text-yellow-800 px-3 py-2 rounded-lg mb-4 font-bold">
                DEV MODE — your code is: {devOtp}
              </p>
            )}
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="w-full bg-white border border-gray-300 px-4 py-3 rounded-xl outline-none focus:border-[#032b7a] mb-4 tracking-[0.5em] text-center font-black text-lg"
            />
            {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
            <button
              onClick={handleVerify}
              disabled={loading || otp.length !== 6}
              className="w-full bg-[#032b7a] text-white py-3 rounded-xl font-black uppercase tracking-widest text-xs disabled:opacity-50"
            >
              {loading ? 'Verifying…' : 'Verify & Continue'}
            </button>
            <button
              onClick={() => { setStep('PHONE'); setOtp(''); setError(''); }}
              className="w-full text-gray-400 mt-3 text-[10px] font-bold uppercase tracking-widest hover:text-[#032b7a]"
            >
              Change number
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PhoneVerification;
