const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');
const Admin = require('./Admin');

const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
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
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  adminId: { // Foreign key for Admin
    type: DataTypes.INTEGER,
    allowNull: true, // Admin association is optional
    references: {
      model: Admin,
      key: 'adminId',
    },
  },
}, {
  tableName: 'courses',
  timestamps: true,
});

Admin.hasMany(Course, { foreignKey: 'adminId' });
Course.belongsTo(Admin, { foreignKey: 'adminId' });

module.exports = Course;
