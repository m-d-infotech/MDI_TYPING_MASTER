const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Exam = sequelize.define('Exam', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  duration_seconds: {
    type: DataTypes.INTEGER,
    defaultValue: 60,
  },
  min_wpm: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  min_accuracy: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  }
});

module.exports = Exam;
