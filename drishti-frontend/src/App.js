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
import VerifyEmail from './pages/VerifyEmail';
import ResetPassword from './pages/ResetPassword';
import AdminLogin from './pages/AdminLogin';
import ChatAssistant from './components/ChatAssistant';
import AdminRoute from './components/AdminRoute';

const AppContent = () => {
  const location = useLocation();
  const isAdminPath = location.pathname === '/admin' || location.pathname === '/admin-login';
  const isQuizPath = location.pathname === '/quiz';

  return (
    <div className="bg-[#0f172a] min-h-screen">
      {!isAdminPath && <Navbar />}

      <div className={!isAdminPath ? "pt-20" : ""}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/course" element={<CourseSelection />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/join" element={<JoinBatch />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/admin-login" element={<AdminLogin />} />
        </Routes>
      </div>

      {!isAdminPath && !isQuizPath && <ChatAssistant />}
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