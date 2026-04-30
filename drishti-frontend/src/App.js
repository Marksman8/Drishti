import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import CourseSelection from './pages/CourseSelection';
import QuizPage from './pages/QuizPage';
import JoinBatch from './pages/JoinBatch';
import AdminDashboard from './pages/AdminDashboard';
import About from './pages/About';
import Contact from './pages/contact';
import Dashboard from './pages/Dashboard';
import ChatAssistant from './components/ChatAssistant';

const AppContent = () => {
  const location = useLocation();
  const isAdminPath = location.pathname === '/admin';

  return (
    <div className="bg-[#0f172a] min-h-screen">

      {!isAdminPath && <Navbar />}

      {/* Fixed the stray comment tag and added pt-20
          to offset the fixed navbar height (h-20).
      */}
      <div className={!isAdminPath ? "pt-20" : ""}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/course" element={<CourseSelection />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/join" element={<JoinBatch />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>

      <ChatAssistant />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;