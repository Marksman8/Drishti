import React, { useState } from 'react';
import { getUser } from '../services/AuthService';

const AI_URL = process.env.REACT_APP_AI_URL || 'http://localhost:8000';

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([{ role: 'ai', text: 'Hello! I am DRISHTI AI. Ask me about commerce topics or your account.' }]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const user = getUser();

    try {
      const res = await fetch(`${AI_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.text,
          userName: user?.fullName || null,
          userRole: user?.role || null,
          userEmail: user?.email || null,
        })
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        role: 'ai',
        text: data.reply || data.detail || "Sorry, I couldn't get a response."
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'ai',
        text: "Sorry, I'm having trouble connecting. Is the DRISHTI AI service running on port 8000?"
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999] font-sans">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-[#032b7a] border-2 border-[#f4b41a] rounded-full shadow-2xl flex items-center justify-center text-2xl hover:scale-110 transition-all"
      >
        {isOpen ? '✕' : '✨'}
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 h-96 bg-[#0f172a] border border-white/10 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          <div className="bg-[#032b7a] p-4 border-b border-white/10">
            <h3 className="text-[#f4b41a] font-black uppercase text-xs tracking-widest">Drishti AI</h3>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-xs font-medium whitespace-pre-wrap ${m.role === 'user' ? 'bg-[#f4b41a] text-[#032b7a]' : 'bg-white/5 text-white border border-white/10'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-3 rounded-2xl text-xs font-medium bg-white/5 text-slate-400 border border-white/10">
                  Thinking…
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-white/10 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') sendMessage();
              }}
              placeholder="Ask me anything..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#f4b41a]"
            />
            <button onClick={sendMessage} disabled={loading} className="text-[#f4b41a] font-bold text-xs disabled:opacity-50">Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatAssistant;
