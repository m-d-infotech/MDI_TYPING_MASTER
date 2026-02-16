const sequelize = require('../config/database');
const User = require('./User');
const Lesson = require('./Lesson');
const Exam = require('./Exam');
const Result = require('./Result');
const Certificate = require('./Certificate');

const initDB = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('Database synced successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
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
