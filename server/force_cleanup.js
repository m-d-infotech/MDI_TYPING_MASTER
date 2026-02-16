require('dotenv').config();
const { Lesson, Result } = require('./models');

const forceCleanup = async () => {
    try {
        console.log('Starting Force Cleanup...');
        
        // Fetch all lessons
        const lessons = await Lesson.findAll();
        console.log(`Found ${lessons.length} lessons to delete.`);
        
        for (const l of lessons) {
            console.log(`Processing lesson: "${l.title}" (ID: ${l.id})`);
            
            // Delete associated results to prevent ForeignKeyConstraintError
            const resultsDeleted = await Result.destroy({ where: { lesson_id: l.id } });
            console.log(`  - Deleted ${resultsDeleted} associated results.`);
            
            // Delete the lesson
            await l.destroy();
            console.log(`  - Deleted lesson.`);
        }
        
        console.log('Cleanup complete. Database is ready for seeding.');
        process.exit(0);
    } catch (error) {
        console.error('Cleanup failed:', error);
        process.exit(1);
    }
};

forceCleanup();
