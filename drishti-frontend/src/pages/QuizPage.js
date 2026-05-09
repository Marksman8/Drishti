import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';

const QuizPage = () => {
  const location = useLocation();
  const studentName = location.state?.studentName || 'Student';

  const [currentStep, setCurrentStep] = useState('START');
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);

  const dummyQuestions = [
    { q: "What is the primary purpose of a Balance Sheet?", options: ["Track Daily Sales", "Show Financial Position", "List Employee Names"], correct: 1 },
    { q: "Which of these is a Liability?", options: ["Cash", "Machinery", "Bank Loan"], correct: 2 },
    { q: "GST stands for...", options: ["Goods and Services Tax", "General Sales Tariff", "Government State Tax"], correct: 0 }
  ];

  const handleSelect = (qIdx, optIdx) => {
    setAnswers(a => ({ ...a, [qIdx]: optIdx }));
  };

  const handleFinishQuiz = () => {
    let correct = 0;
    dummyQuestions.forEach((q, idx) => {
      if (answers[idx] === q.correct) correct += 1;
    });
    const pct = Math.round((correct / dummyQuestions.length) * 100);
    setScore(pct);
    setCurrentStep('RESULT');
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-4xl mx-auto py-20 px-6">
        {currentStep === 'START' && (
          <div className="text-center space-y-8 animate-in fade-in zoom-in">
            <div className="inline-block p-4 bg-blue-50 rounded-3xl text-blue-700 text-5xl mb-4">📝</div>
            <h1 className="text-5xl font-black text-slate-900">Ready for the Quiz?</h1>
            <p className="text-slate-500 text-lg max-w-md mx-auto">This assessment tests your knowledge from today's session. You need 40% to qualify for the certificate.</p>
            <button
              onClick={() => setCurrentStep('QUIZ')}
              className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
            >
              Start Assessment
            </button>
          </div>
        )}

        {currentStep === 'QUIZ' && (
          <div className="space-y-12">
            <div className="flex justify-between items-end border-b pb-6">
              <h2 className="text-2xl font-black">Financial Literacy 101</h2>
              <p className="text-blue-600 font-bold uppercase tracking-widest text-xs">{dummyQuestions.length} Questions</p>
            </div>

            {dummyQuestions.map((item, index) => (
              <div key={index} className="space-y-6">
                <p className="text-xl font-bold text-slate-800">{index + 1}. {item.q}</p>
                <div className="grid grid-cols-1 gap-3">
                  {item.options.map((opt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelect(index, i)}
                      className={`text-left p-5 rounded-2xl border-2 transition-all font-medium ${
                        answers[index] === i
                          ? "border-blue-600 bg-blue-50 text-blue-900"
                          : "border-slate-100 hover:border-blue-600 hover:bg-blue-50 text-slate-700"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <button
              onClick={handleFinishQuiz}
              disabled={Object.keys(answers).length < dummyQuestions.length}
              className="w-full bg-blue-700 text-white py-5 rounded-2xl font-black uppercase tracking-widest disabled:opacity-50"
            >
              Submit My Answers
            </button>
          </div>
        )}

        {currentStep === 'RESULT' && (
          <div className="text-center space-y-10 animate-in slide-in-from-bottom duration-700">
            {score >= 40 ? (
              <>
                <div className="inline-block p-6 bg-green-50 rounded-full text-green-600 text-5xl mb-4">🏆</div>
                <h1 className="text-5xl font-black text-slate-900">Congratulations!</h1>
                <p className="text-slate-500">You scored <span className="text-green-600 font-black">{score}%</span>. Your certificate is ready.</p>

                <div className="border-[12px] border-slate-100 p-10 rounded-[2rem] bg-white shadow-2xl relative overflow-hidden max-w-2xl mx-auto">
                  <div className="absolute top-0 right-0 p-8 opacity-10 text-8xl font-black">DRISHTI</div>
                  <h3 className="text-3xl font-serif mb-4 uppercase tracking-tighter">Certificate of Achievement</h3>
                  <p className="italic text-slate-400 mb-8 font-serif italic text-lg text-center mx-auto max-w-xs leading-tight">This is to certify that you have successfully completed the course assessment.</p>
                  <p className="text-2xl font-black uppercase tracking-widest border-b-2 border-slate-900 inline-block px-4 pb-2">{studentName}</p>
                  <div className="mt-12 flex justify-between items-end px-10">
                    <div className="text-left"><p className="text-[10px] font-bold uppercase text-slate-400">Date Issued</p><p className="font-bold">{new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</p></div>
                    <div className="text-right"><p className="text-[10px] font-bold uppercase text-slate-400">Authorized by</p><p className="font-bold font-serif">Director, DRISHTI</p></div>
                  </div>
                </div>

                <button className="bg-blue-700 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-transform">
                  Download PDF Certificate
                </button>
              </>
            ) : (
              <>
                <div className="inline-block p-6 bg-red-50 rounded-full text-red-600 text-5xl mb-4">💫</div>
                <h1 className="text-5xl font-black text-slate-900">Keep Practicing!</h1>
                <p className="text-slate-500">You scored <span className="text-red-600 font-black">{score}%</span>. You need 40% to pass. Review the course materials and try again!</p>
                <button
                  onClick={() => { setAnswers({}); setCurrentStep('START'); }}
                  className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest"
                >
                  Try Again
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPage;