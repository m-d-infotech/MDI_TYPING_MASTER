import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const Practice = () => {
    const [lessons, setLessons] = useState([]);

    useEffect(() => {
        // Fetch lessons from API
        const fetchLessons = async () => {
            try {
                const res = await api.get('/lessons');
                // Sort by order
                const sorted = res.data.sort((a, b) => (a.order || 0) - (b.order || 0));
                setLessons(sorted);
            } catch (err) {
                console.error(err);
                // Mock data if fetch fails
                setLessons([
                    { 
                        id: 1, 
                        title: 'Home Row Basics', 
                        difficulty: 'Beginner', 
                        content: 'a s d f j k l ; ...',
                        order: 1,
                        image: '/images/lessons/lesson_home.svg'
                    },
                    { 
                        id: 2, 
                        title: 'Top Row Basics', 
                        difficulty: 'Intermediate', 
                        content: 'q w e r t y u i o p ...',
                        order: 2,
                        image: '/images/lessons/lesson_top.svg'
                    },
                    {
                        id: 3,
                        title: 'Bottom Row Basics',
                        difficulty: 'Intermediate',
                        content: 'z x c v b n m ...',
                        order: 3,
                        image: '/images/lessons/lesson_bottom.svg'
                    },
                     {
                        id: 4,
                        title: 'Number Row Basics',
                        difficulty: 'Intermediate',
                        content: '1 2 3 ...',
                        order: 4,
                        image: '/images/lessons/lesson_number.svg'
                    },
                    {
                        id: 5,
                        title: 'Numpad Data Entry',
                        difficulty: 'Intermediate',
                        content: '4 5 6 ...',
                        order: 5,
                        image: '/images/lessons/lesson_numpad.svg'
                    },
                    {
                        id: 6,
                        title: 'Advanced Symbols',
                        difficulty: 'Advanced',
                        content: '! @ # ...',
                        order: 6,
                        image: '/images/lessons/lesson_symbols.svg'
                    },
                    {
                        id: 7,
                        title: 'Master All Keys',
                        difficulty: 'Expert',
                        content: 'The quick brown fox ...',
                        order: 7,
                        image: '/images/lessons/lesson_master.svg'
                    }
                ]);
            }
        };
        fetchLessons();
    }, []);

    const [filter, setFilter] = useState('All');

    const filteredLessons = lessons.filter(lesson => {
        if (filter === 'All') return true;
        return lesson.difficulty === filter;
    });

    const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];

    return (
        <div className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Practice Lessons</h1>
                
                {/* Filter Controls */}
                <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                    {difficulties.map(diff => (
                        <button
                            key={diff}
                            onClick={() => setFilter(diff)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                filter === diff 
                                    ? 'bg-blue-600 text-white shadow-md' 
                                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                            }`}
                        >
                            {diff}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredLessons.map(lesson => (
                    <Link key={lesson.id} to={`/dashboard/practice/${lesson.id}`} className="block group">
                        <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden transform group-hover:-translate-y-1">
                            {/* Image Header */}
                            <div className="h-48 bg-slate-100 overflow-hidden relative">
                                {lesson.image ? (
                                    <img 
                                        src={lesson.image} 
                                        alt={lesson.title} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400">
                                        <span className="text-4xl">⌨️</span>
                                    </div>
                                )}
                                <div className="absolute top-4 right-4">
                                     <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm ${
                                        lesson.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                                        lesson.difficulty === 'Intermediate' ? 'bg-blue-100 text-blue-700' :
                                        lesson.difficulty === 'Advanced' ? 'bg-purple-100 text-purple-700' :
                                        'bg-orange-100 text-orange-700'
                                     }`}>
                                        {lesson.difficulty}
                                     </span>
                                </div>
                            </div>
                            
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                                    {lesson.title}
                                </h3>
                                <p className="text-sm text-slate-500 line-clamp-2">
                                    {lesson.content}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Practice;
