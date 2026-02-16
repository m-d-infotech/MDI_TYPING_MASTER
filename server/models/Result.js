const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Lesson = require('./Lesson');
const Exam = require('./Exam');

const Result = sequelize.define('Result', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  wpm: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  raw_wpm: { // Gross WPM
    type: DataTypes.FLOAT,
  },
  accuracy: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  mistakes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  backspaces: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  duration: {
    type: DataTypes.INTEGER, // in seconds
    allowNull: false,
  },
  mode: {
    type: DataTypes.ENUM('practice', 'exam'),
    allowNull: false,
  },
  exam_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  lesson_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  missed_keys: {
    type: DataTypes.JSON,
    allowNull: true,
  },
});

Result.belongsTo(User, { foreignKey: 'user_id' });
Result.belongsTo(Exam, { foreignKey: 'exam_id' });
Result.belongsTo(Lesson, { foreignKey: 'lesson_id' });
User.hasMany(Result, { foreignKey: 'user_id' });

module.exports = Result;
