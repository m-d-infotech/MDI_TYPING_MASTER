import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Trash2, Edit, X } from 'lucide-react';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('students');
    const [students, setStudents] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [exams, setExams] = useState([]);
    const [reports, setReports] = useState([]);

    // Form states
    const [newStudent, setNewStudent] = useState({ username: '', password: '' });
    
    // Lesson Form
    const [newLesson, setNewLesson] = useState({ title: '', content: '', difficulty: 'beginner' });
    const [editingLessonId, setEditingLessonId] = useState(null);

    // Exam Form
    const [newExam, setNewExam] = useState({ title: '', content: '', duration_seconds: 60, min_wpm: 30, min_accuracy: 90 });
    const [editingExamId, setEditingExamId] = useState(null);

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        try {
            if (activeTab === 'students') {
                const res = await api.get('/auth/users');
                setStudents(res.data.filter(u => u.role === 'student'));
            } else if (activeTab === 'lessons') {
                const res = await api.get('/lessons');
                setLessons(res.data);
            } else if (activeTab === 'exams') {
                const res = await api.get('/exams');
                setExams(res.data);
            } else if (activeTab === 'reports') {
                const res = await api.get('/results'); // Admin route to get all results
                setReports(res.data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateStudent = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', { ...newStudent, role: 'student' });
            setNewStudent({ username: '', password: '' });
            fetchData();
            alert('Student created');
        } catch (err) {
            alert('Error creating student');
        }
    };

    const handleDeleteStudent = async (id) => {
        if (!window.confirm('Are you sure you want to delete this student?')) return;
        try {
            await api.delete(`/auth/${id}`);
            fetchData();
        } catch (err) {
            alert('Error deleting student');
        }
    };

    // Lessons Logic
    const handleSaveLesson = async (e) => {
        e.preventDefault();
        try {
            if (editingLessonId) {
                await api.put(`/lessons/${editingLessonId}`, newLesson);
                alert('Lesson updated');
            } else {
                await api.post('/lessons', newLesson);
                alert('Lesson created');
            }
            setNewLesson({ title: '', content: '', difficulty: 'beginner' });
            setEditingLessonId(null);
            fetchData();
        } catch (err) {
            alert('Error saving lesson');
        }
    };

    const startEditLesson = (lesson) => {
        setNewLesson({ title: lesson.title, content: lesson.content, difficulty: lesson.difficulty });
        setEditingLessonId(lesson.id);
    };

    const cancelEditLesson = () => {
        setNewLesson({ title: '', content: '', difficulty: 'beginner' });
        setEditingLessonId(null);
    };

    const handleDeleteLesson = async (id) => {
        if (!window.confirm('Are you sure you want to delete this lesson?')) return;
        try {
            await api.delete(`/lessons/${id}`);
            fetchData();
        } catch (err) {
            alert('Error deleting lesson');
        }
    };

    // Exams Logic
    const handleSaveExam = async (e) => {
        e.preventDefault();
        try {
            if (editingExamId) {
                await api.put(`/exams/${editingExamId}`, newExam);
                alert('Exam updated');
            } else {
                await api.post('/exams', newExam);
                alert('Exam created');
            }
            setNewExam({ title: '', content: '', duration_seconds: 60, min_wpm: 30, min_accuracy: 90 });
            setEditingExamId(null);
            fetchData();
        } catch (err) {
            alert('Error saving exam');
        }
    };

    const startEditExam = (exam) => {
        setNewExam({
            title: exam.title,
            content: exam.content,
            duration_seconds: exam.duration_seconds,
            min_wpm: exam.min_wpm,
            min_accuracy: exam.min_accuracy
        });
        setEditingExamId(exam.id);
    };

    const cancelEditExam = () => {
        setNewExam({ title: '', content: '', duration_seconds: 60, min_wpm: 30, min_accuracy: 90 });
        setEditingExamId(null);
    };

    const handleDeleteExam = async (id) => {
        if (!window.confirm('Are you sure you want to delete this exam?')) return;
        try {
            await api.delete(`/exams/${id}`);
            fetchData();
        } catch (err) {
            alert('Error deleting exam');
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            
            <div className="flex space-x-4 mb-6 border-b pb-2">
                <button 
                    className={`px-4 py-2 font-medium ${activeTab === 'students' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'}`}
                    onClick={() => setActiveTab('students')}
                >
                    Students
                </button>
                <button 
                    className={`px-4 py-2 font-medium ${activeTab === 'lessons' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'}`}
                    onClick={() => setActiveTab('lessons')}
                >
                    Lessons
                </button>
                <button 
                    className={`px-4 py-2 font-medium ${activeTab === 'exams' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'}`}
                    onClick={() => setActiveTab('exams')}
                >
                    Exams
                </button>
                <button 
                    className={`px-4 py-2 font-medium ${activeTab === 'reports' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'}`}
                    onClick={() => setActiveTab('reports')}
                >
                    Reports
                </button>
            </div>

            {/* Students Tab */}
            {activeTab === 'students' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded shadow">
                        <h3 className="text-xl font-bold mb-4">Add Student</h3>
                        <form onSubmit={handleCreateStudent} className="space-y-4">
                            <input 
                                className="w-full border p-2 rounded" 
                                placeholder="Username" 
                                value={newStudent.username}
                                onChange={e => setNewStudent({...newStudent, username: e.target.value})}
                                required
                            />
                            <input 
                                className="w-full border p-2 rounded" 
                                placeholder="Password" 
                                type="password"
                                value={newStudent.password}
                                onChange={e => setNewStudent({...newStudent, password: e.target.value})}
                                required
                            />
                            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">Create Student</button>
                        </form>
                    </div>
                    <div className="bg-white p-6 rounded shadow">
                        <h3 className="text-xl font-bold mb-4">Existing Students</h3>
                        <div className="max-h-60 overflow-y-auto">
                            {students.map(s => (
                                <div key={s.id} className="border-b p-2 flex justify-between items-center">
                                    <div>
                                        <span>{s.username}</span>
                                        <div className="text-slate-400 text-sm">Joined: {new Date(s.createdAt).toLocaleDateString()}</div>
                                    </div>
                                    <button onClick={() => handleDeleteStudent(s.id)} className="text-red-500 hover:text-red-700">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Lessons Tab */}
            {activeTab === 'lessons' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded shadow">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">{editingLessonId ? 'Edit Lesson' : 'Add Lesson'}</h3>
                            {editingLessonId && (
                                <button onClick={cancelEditLesson} className="text-slate-500 hover:text-slate-700">
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                        <form onSubmit={handleSaveLesson} className="space-y-4">
                            <input 
                                className="w-full border p-2 rounded" 
                                placeholder="Title" 
                                value={newLesson.title}
                                onChange={e => setNewLesson({...newLesson, title: e.target.value})}
                                required
                            />
                            <textarea 
                                className="w-full border p-2 rounded h-32" 
                                placeholder="Content (The text to type)" 
                                value={newLesson.content}
                                onChange={e => setNewLesson({...newLesson, content: e.target.value})}
                                required
                            />
                            <select 
                                className="w-full border p-2 rounded"
                                value={newLesson.difficulty}
                                onChange={e => setNewLesson({...newLesson, difficulty: e.target.value})}
                            >
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                            </select>
                            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">
                                {editingLessonId ? 'Update Lesson' : 'Create Lesson'}
                            </button>
                        </form>
                    </div>
                    <div className="bg-white p-6 rounded shadow">
                        <h3 className="text-xl font-bold mb-4">Existing Lessons</h3>
                        <div className="max-h-60 overflow-y-auto space-y-2">
                            {lessons.map(l => (
                                <div key={l.id} className="border p-2 rounded flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="font-bold">{l.title} <span className="text-xs font-normal text-slate-500">({l.difficulty})</span></div>
                                        <div className="text-xs text-slate-400 truncate">{l.content}</div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button onClick={() => startEditLesson(l)} className="text-blue-500 hover:text-blue-700">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDeleteLesson(l.id)} className="text-red-500 hover:text-red-700">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Exams Tab */}
            {activeTab === 'exams' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded shadow">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">{editingExamId ? 'Edit Exam' : 'Add Exam'}</h3>
                            {editingExamId && (
                                <button onClick={cancelEditExam} className="text-slate-500 hover:text-slate-700">
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                        <form onSubmit={handleSaveExam} className="space-y-4">
                            <input 
                                className="w-full border p-2 rounded" 
                                placeholder="Title" 
                                value={newExam.title}
                                onChange={e => setNewExam({...newExam, title: e.target.value})}
                                required
                            />
                            <textarea 
                                className="w-full border p-2 rounded h-32" 
                                placeholder="Content" 
                                value={newExam.content}
                                onChange={e => setNewExam({...newExam, content: e.target.value})}
                                required
                            />
                            <div className="grid grid-cols-3 gap-2">
                                <input 
                                    className="border p-2 rounded" 
                                    type="number" placeholder="Duration (s)" 
                                    value={newExam.duration_seconds}
                                    onChange={e => setNewExam({...newExam, duration_seconds: parseInt(e.target.value)})}
                                />
                                <input 
                                    className="border p-2 rounded" 
                                    type="number" placeholder="Min WPM" 
                                    value={newExam.min_wpm}
                                    onChange={e => setNewExam({...newExam, min_wpm: parseInt(e.target.value)})}
                                />
                                <input 
                                    className="border p-2 rounded" 
                                    type="number" placeholder="Min Accuracy" 
                                    value={newExam.min_accuracy}
                                    onChange={e => setNewExam({...newExam, min_accuracy: parseFloat(e.target.value)})}
                                />
                            </div>
                            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">
                                {editingExamId ? 'Update Exam' : 'Create Exam'}
                            </button>
                        </form>
                    </div>
                    <div className="bg-white p-6 rounded shadow">
                        <h3 className="text-xl font-bold mb-4">Active Exams</h3>
                        <div className="max-h-60 overflow-y-auto space-y-2">
                            {exams.map(e => (
                                <div key={e.id} className="border p-2 rounded flex justify-between items-start">
                                    <div>
                                        <div className="font-bold">{e.title}</div>
                                        <div className="text-xs text-slate-500">Duration: {e.duration_seconds}s | Pass: {e.min_wpm}wpm</div>
                                        <div className="text-xs text-slate-400 truncate w-40">{e.content}</div>
                                    </div>
                                    <div className="text-xs flex flex-col items-end">
                                        <span className="mb-1 text-green-600">Active</span>
                                        <div className="flex space-x-2">
                                            <button onClick={() => startEditExam(e)} className="text-blue-500 hover:text-blue-700">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDeleteExam(e.id)} className="text-red-500 hover:text-red-700">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
                <div className="bg-white p-6 rounded shadow">
                    <h3 className="text-xl font-bold mb-4">Global Result Reports</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left">
                            <thead>
                                <tr className="bg-slate-50 border-b">
                                    <th className="p-3">User</th>
                                    <th className="p-3">Mode</th>
                                    <th className="p-3">Exam/Lesson</th>
                                    <th className="p-3">WPM</th>
                                    <th className="p-3">Accuracy</th>
                                    <th className="p-3">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reports.map(r => (
                                    <tr key={r.id} className="border-b hover:bg-slate-50">
                                        <td className="p-3 font-medium">{r.User?.username || 'Unknown'}</td>
                                        <td className="p-3 capitalize">{r.mode}</td>
                                        <td className="p-3 text-sm text-slate-500">
                                            {r.mode === 'exam' ? (r.Exam?.title || 'Unknown Exam') : 'Practice'}
                                        </td>
                                        <td className="p-3 font-bold">{r.wpm}</td>
                                        <td className="p-3">{r.accuracy}%</td>
                                        <td className="p-3 text-sm text-slate-500">{new Date(r.createdAt).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {reports.length === 0 && <div className="p-4 text-center text-slate-500">No results found.</div>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
