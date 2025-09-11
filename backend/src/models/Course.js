const { DataTypes } = require('sequelize');
const { sequelize } = require('../services/database');

const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
  },
  duration: {
    type: DataTypes.INTEGER, // in hours
    defaultValue: 0,
  },
  level: {
    type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
    defaultValue: 'beginner',
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  thumbnail: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'courses',
  timestamps: true,
});

module.exports = Course;
