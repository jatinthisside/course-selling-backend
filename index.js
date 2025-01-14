const express = require('express');
const app = express();
const sequelize = require('./utils/db');
const UserRoutes = require('./routes/UserRoutes');
const AdminRoutes = require('./routes/AdminRoutes');
const cookieParser = require('cookie-parser')
require('dotenv').config();
app.use(express.json());
app.use(cookieParser());

sequelize.sync()
  .then(() =>{
    console.log('Database synced successfully');
    app.use('/api/v1/user',UserRoutes);
    app.use('/api/v1/admin',AdminRoutes);
    app.listen(process.env.PORT,()=>{
        console.log(`Listening on port ${process.env.PORT}`);
    })
  })
  .catch(err => console.error('Error syncing database:', err));