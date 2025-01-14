const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');
const User = require('./User');
const Course = require('./Course');

const UserCourse = sequelize.define('UserCourse', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  enrollmentDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
    tableName: 'usercourses',
    timestamps: false,       
});

User.belongsToMany(Course, { through: UserCourse });
Course.belongsToMany(User, { through: UserCourse });

module.exports = UserCourse;