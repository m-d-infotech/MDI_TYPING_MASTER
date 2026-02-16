import { Outlet, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Home, Keyboard, FileText, Settings, Award } from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout } = useAuth();

  if (!user) return <Navigate to="/login" />;

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 text-xl font-bold text-center border-b border-slate-700 bg-slate-950 flex flex-col items-center">
          <img src="/logo.png" alt="MD Infotech" className="h-12 w-auto mb-2 object-contain" />
          <span className="text-white">MD Infotech</span>
          <div className="text-xs font-normal text-slate-400 mt-1">{user.role === 'admin' ? 'Admin Panel' : 'Student Panel'}</div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/dashboard" className="flex items-center p-3 rounded hover:bg-slate-800 transition">
            <Home className="w-5 h-5 mr-3" /> Dashboard
          </Link>
          <Link to="/dashboard/practice" className="flex items-center p-3 rounded hover:bg-slate-800 transition">
            <Keyboard className="w-5 h-5 mr-3" /> Practice
          </Link>
          <Link to="/dashboard/exam" className="flex items-center p-3 rounded hover:bg-slate-800 transition">
            <FileText className="w-5 h-5 mr-3" /> Exams
          </Link>
          <Link to="/dashboard/results" className="flex items-center p-3 rounded hover:bg-slate-800 transition">
            <Award className="w-5 h-5 mr-3" /> Results
          </Link>
          {user.role === 'admin' && (
            <Link to="/dashboard/admin" className="flex items-center p-3 rounded hover:bg-slate-800 transition text-yellow-400">
              <Settings className="w-5 h-5 mr-3" /> Admin
            </Link>
          )}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">{user.username}</div>
            <button onClick={logout} className="p-2 text-red-400 hover:text-red-300">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
