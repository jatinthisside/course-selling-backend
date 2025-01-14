const express = require('express');
const router =  express.Router();
const {Signin,Signup} = require('../controllers/User.controller');
const {getAllCourses,getPurchasedCourses} = require('../controllers/Course.controller');
const {auth} = require('../middleware');

// Signin & Signup
router.post('/signin',Signin);
router.post('/signup',Signup);

// Course related routes
router.get('/fetchAll',getAllCourses);
router.get('/fetch-purchased',auth,getPurchasedCourses);

module.exports = router;