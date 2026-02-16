import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import StatsOverview from '../components/StatsOverview';

const DashboardHome = () => {
    const { user } = useAuth();

    return (
        <div className="p-8 space-y-8">
            <h1 className="text-3xl font-bold text-slate-800">Welcome back, {user?.username}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link to="/dashboard/practice" className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-lg transition border border-slate-100 group">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">Start Practice</h3>
                    <p className="text-slate-500">Practice your typing skills with curated lessons.</p>
                </Link>
                <Link to="/dashboard/exam" className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-lg transition border border-slate-100 group">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">Take Exam</h3>
                    <p className="text-slate-500">Test your speed and accuracy in exam mode.</p>
                </Link>
                <Link to="/dashboard/leaderboard" className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-lg transition border border-slate-100 group">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">Leaderboard</h3>
                    <p className="text-slate-500">See top performers and rankings.</p>
                </Link>
            </div>

            <div className="pt-4 border-t border-slate-200">
                <h2 className="text-2xl font-bold mb-6 text-slate-800">Your Performance Overview</h2>
                <StatsOverview user={user} />
            </div>
        </div>
    );
};

export default DashboardHome;
