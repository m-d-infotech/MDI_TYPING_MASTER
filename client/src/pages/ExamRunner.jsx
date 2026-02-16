import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import TypingArea from '../components/TypingArea';
import api from '../utils/api';

const ExamRunner = () => {
    const { examId } = useParams();
    const [exam, setExam] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchExam = async () => {
            try {
                const res = await api.get(`/exams/${examId}`);
                setExam(res.data);
            } catch (err) {
                console.error(err);
                // Mock
                setExam({
                    id: examId,
                    title: 'Mock Exam',
                    content: 'Exam content requires focus and precision. Do not make mistakes.',
                    duration_seconds: 60,
                    min_wpm: 30,
                    min_accuracy: 90
                });
            } finally {
                setLoading(false);
            }
        };
        fetchExam();

        // Enter Fullscreen
        const enterFullscreen = async () => {
            try {
                if (document.documentElement.requestFullscreen) {
                    await document.documentElement.requestFullscreen();
                }
            } catch (e) {
                console.log("Fullscreen optional/failed");
            }
        };
        enterFullscreen();

        // Exit fullscreen on unmount
        return () => {
            if (document.exitFullscreen) {
                document.exitFullscreen().catch(() => {});
            }
        };
    }, [examId]);

    const handleComplete = async (results) => {
        // Additional checks for pass/fail could go here or in Results page
        const passed = results.wpm >= exam.min_wpm && results.accuracy >= exam.min_accuracy;
        
        // Navigate to results
        // For now, simple alert then redirect
        alert(`Exam Finished.\nWPM: ${results.wpm}\nAccuracy: ${results.accuracy}%\nResult: ${passed ? 'PASSED' : 'FAILED'}`);
        navigate('/dashboard/results');
    };

    if (loading) return <div className="p-8">Loading Exam...</div>;
    if (!exam) return <div className="p-8">Exam not found</div>;

    return (
        <div className="p-8 h-screen bg-slate-50">
            <h1 className="text-2xl font-bold mb-4 text-red-600">EXAM MODE: {exam.title}</h1>
            <div className="mb-4 bg-yellow-50 p-3 rounded text-sm text-yellow-800 border border-yellow-200">
                Warning: Do not reload the page or switch tabs. Copy-paste is disabled.
            </div>
            <TypingArea 
                content={exam.content} 
                duration={exam.duration_seconds}
                mode="exam"
                examId={exam.id}
                onComplete={handleComplete}
            />
        </div>
    );
};

export default ExamRunner;
