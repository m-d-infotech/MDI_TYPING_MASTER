require('dotenv').config();
const { Lesson } = require('./models');

const checkLessons = async () => {
    try {
        const lessons = await Lesson.findAll();
        console.log('--- Lessons in DB ---');
        lessons.forEach(l => {
            console.log(`ID: ${l.id} | Title: "${l.title}" | Difficulty: ${l.difficulty} | Order: ${l.order} | Image: "${l.image}"`);
        });
        console.log('---------------------');
    } catch (error) {
        console.error('Error fetching lessons:', error);
    }
};

checkLessons();
