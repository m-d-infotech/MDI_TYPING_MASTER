import { useEffect, useState } from 'react';
import api from '../utils/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Download } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StatsOverview = ({ user }) => {
    const [results, setResults] = useState([]);
    const [certificates, setCertificates] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            try {
                const resResults = await api.get(`/results/user/${user.userId}`);
                setResults(resResults.data);

                const resCerts = await api.get(`/results/certificates/${user.userId}`);
                setCertificates(resCerts.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [user]);

    const downloadCertificate = async (certId) => {
        try {
            const response = await api.get(`/results/certificate/${certId}/download`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Certificate-${certId}.pdf`);
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            console.error(err);
        }
    };

    // Chart Data
    const chartData = {
        labels: results.slice().reverse().map(r => new Date(r.createdAt).toLocaleDateString()),
        datasets: [
            {
                label: 'WPM',
                data: results.slice().reverse().map(r => r.wpm),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
            {
                label: 'Accuracy %',
                data: results.slice().reverse().map(r => r.accuracy),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
            },
        ],
    };

    return (
        <div className="space-y-8">
            {/* Chart */}
            <div className="bg-white p-6 rounded-lg shadow h-80">
                <h3 className="text-lg font-bold mb-4 text-slate-700">Performance Trend</h3>
                <Bar options={{ maintainAspectRatio: false }} data={chartData} />
            </div>

            {/* Certificates */}
            {certificates.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Certificates</h2>
                    <div className="space-y-2">
                        {certificates.map(cert => (
                            <div key={cert.id} className="flex justify-between items-center p-3 border rounded">
                                <div>
                                    <div className="font-bold">{cert.Exam?.title || 'Typing Test'}</div>
                                    <div className="text-sm text-slate-500">{new Date(cert.issue_date).toLocaleDateString()}</div>
                                </div>
                                <button 
                                    onClick={() => downloadCertificate(cert.id)}
                                    className="flex items-center text-blue-600 hover:text-blue-800"
                                >
                                    <Download className="w-4 h-4 mr-1" /> Download PDF
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recent History Table */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b">
                                <th className="p-3">Date</th>
                                <th className="p-3">Mode</th>
                                <th className="p-3">WPM</th>
                                <th className="p-3">Accuracy</th>
                                <th className="p-3">Mistakes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map(r => (
                                <tr key={r.id} className="border-b hover:bg-slate-50">
                                    <td className="p-3">{new Date(r.createdAt).toLocaleString()}</td>
                                    <td className="p-3 capitalize">{r.mode}</td>
                                    <td className="p-3 font-bold">{r.wpm}</td>
                                    <td className="p-3">{r.accuracy}%</td>
                                    <td className="p-3">{r.mistakes}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StatsOverview;
