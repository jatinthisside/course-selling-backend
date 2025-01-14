const { Sequelize } = require('sequelize');
require('dotenv').config();

console.log("Username : ",typeof(process.env.DB_USERNAME))

const sequelize = new Sequelize('coursedb', process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
    // logging: console.log,
  });

  sequelize.authenticate().then(() => console.log('Database connected successfully!'))
  .catch(err => console.error('Unable to connect to the database:', err));
  
  module.exports = sequelize;
  
  