import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { PlayCircle } from 'lucide-react';

const Exams = () => {
    const [exams, setExams] = useState([]);

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const res = await api.get('/exams');
                setExams(res.data.filter(e => e.is_active));
            } catch (err) {
                console.error(err);
                // Mock
                setExams([
                    { id: 1, title: 'Speed Test Level 1', duration_seconds: 60, min_wpm: 30, min_accuracy: 90 },
                    { id: 2, title: 'Certification Exam', duration_seconds: 300, min_wpm: 40, min_accuracy: 95 },
                ]);
            }
        };
        fetchExams();
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Available Exams</h1>
            <div className="space-y-4">
                {exams.map(exam => (
                    <div key={exam.id} className="bg-white p-6 rounded-lg shadow border border-slate-100 flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-bold text-slate-800">{exam.title}</h3>
                            <div className="text-sm text-slate-500 mt-1">
                                Duration: {exam.duration_seconds / 60} mins | Min WPM: {exam.min_wpm} | Min Accuracy: {exam.min_accuracy}%
                            </div>
                        </div>
                        <Link 
                            to={`/dashboard/exam/${exam.id}`}
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition flex items-center"
                        >
                            <PlayCircle className="w-5 h-5 mr-2" /> Start Exam
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Exams;
