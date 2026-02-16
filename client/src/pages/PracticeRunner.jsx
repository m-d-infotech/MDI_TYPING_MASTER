import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import TypingArea from '../components/TypingArea';
import api from '../utils/api';

const PracticeRunner = () => {
    const { lessonId } = useParams();
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLesson = async () => {
            try {
                const res = await api.get(`/lessons/${lessonId}`);
                setLesson(res.data);
            } catch (err) {
                console.error(err);
                // Mock
                setLesson({
                    id: lessonId,
                    title: 'Mock Lesson',
                    content: 'The quick brown fox jumps over the lazy dog. Typing is a skill that requires practice and patience.',
                    difficulty: 'beginner'
                });
            } finally {
                setLoading(false);
            }
        };
        fetchLesson();
    }, [lessonId]);

    const handleComplete = (results) => {
        // Could navigate to result summary
        // navigate('/dashboard/results');
        alert(`Finished! WPM: ${results.wpm}, Accuracy: ${results.accuracy}%`);
    };

    if (loading) return <div className="p-8">Loading...</div>;
    if (!lesson) return <div className="p-8">Lesson not found</div>;

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Practice: {lesson.title}</h1>
            <TypingArea 
                content={lesson.content} 
                duration={300} // 5 mins default for practice
                mode="practice"
                lessonId={lesson.id}
                title={lesson.title}
                onComplete={handleComplete}
            />
        </div>
    );
};

export default PracticeRunner;
