const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Exam = require('./Exam');

const Certificate = sequelize.define('Certificate', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  exam_id: { // Nullable if certificate is manually awarded or generic
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  issue_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  wpm_recorded: {
    type: DataTypes.FLOAT,
  },
  accuracy_recorded: {
    type: DataTypes.FLOAT,
  },
  certificate_code: {
    type: DataTypes.STRING,
    unique: true,
  }
});

Certificate.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Certificate, { foreignKey: 'user_id' });

module.exports = Certificate;
