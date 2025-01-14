const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const Admin  = sequelize.define("Admin",{
    adminId:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
},
{ timestamps: true,tableName: 'admins',  }
)

module.exports = Admin;