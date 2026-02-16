import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import Practice from './pages/Practice';
import Exams from './pages/Exams';
import Results from './pages/Results';
import ExamRunner from './pages/ExamRunner';
import PracticeRunner from './pages/PracticeRunner';
import AdminDashboard from './pages/AdminDashboard';
import Leaderboard from './pages/Leaderboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="practice" element={<Practice />} />
            <Route path="practice/:lessonId" element={<PracticeRunner />} />
            <Route path="exam" element={<Exams />} />
            <Route path="exam/:examId" element={<ExamRunner />} />
            <Route path="results" element={<Results />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="admin" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
