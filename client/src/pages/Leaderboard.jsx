import { useEffect, useState } from 'react';
import { Trophy, Medal, Crown } from 'lucide-react';
import api from '../utils/api';

const Leaderboard = () => {
    const [leaders, setLeaders] = useState([]);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await api.get('/results/leaderboard/top');
                setLeaders(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchLeaderboard();
    }, []);

    const getRankIcon = (index) => {
        if (index === 0) return <Crown className="w-6 h-6 text-yellow-500" />;
        if (index === 1) return <Medal className="w-6 h-6 text-slate-400" />;
        if (index === 2) return <Medal className="w-6 h-6 text-amber-600" />;
        return <span className="font-bold text-slate-500 w-6 text-center">{index + 1}</span>;
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-8 gap-3">
                <Trophy className="w-10 h-10 text-yellow-500" />
                <h1 className="text-4xl font-bold text-slate-800">Global Leaderboard</h1>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="p-4 font-semibold text-slate-600">Rank</th>
                            <th className="p-4 font-semibold text-slate-600">User</th>
                            <th className="p-4 font-semibold text-slate-600">WPM</th>
                            <th className="p-4 font-semibold text-slate-600">Accuracy</th>
                            <th className="p-4 font-semibold text-slate-600">Activity</th>
                            <th className="p-4 font-semibold text-slate-600">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {leaders.map((entry, index) => (
                            <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4 flex items-center justify-center">
                                    {getRankIcon(index)}
                                </td>
                                <td className="p-4 font-medium text-slate-800">
                                    {entry.User?.username || 'Unknown'}
                                </td>
                                <td className="p-4 font-bold text-blue-600 text-lg">
                                    {entry.wpm}
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${entry.accuracy >= 98 ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                                        {entry.accuracy}%
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-slate-700">{entry.Exam?.title || entry.Lesson?.title || 'Typing Task'}</span>
                                        <span className="text-xs text-slate-400 capitalize">{entry.mode}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-slate-400">
                                    {new Date(entry.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                        {leaders.length === 0 && (
                            <tr>
                                <td colSpan="6" className="p-8 text-center text-slate-500">
                                    No records found yet. Be the first to take an exam!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Leaderboard;
