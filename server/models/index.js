const sequelize = require('../config/database');
const User = require('./User');
const Lesson = require('./Lesson');
const Exam = require('./Exam');
const initDB = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('Database synced successfully.');

        // Seed Admin User if not exists
        const bcrypt = require('bcryptjs'); // Lazy load
        const adminExists = await User.findOne({ where: { role: 'admin' } });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await User.create({
                username: 'admin',
                password: hashedPassword,
                role: 'admin'
            });
            console.log('Admin account created: admin / admin123');
        }
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        throw error; // Rethrow to ensure Vercel function fails or handles it
    }
};

module.exports = {
    sequelize,
    User,
    Lesson,
    Exam,
    Result,
    Certificate,
    initDB
};
