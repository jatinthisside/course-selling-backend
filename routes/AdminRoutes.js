const express = require('express');
const router =  express.Router();
const {Signin,Signup} = require('../controllers/Admin.controller');
const {createCourse,deleteCourse,updateCourse} = require('../controllers/Course.controller');
const {auth} = require('../middleware');

router.post('/Signin',Signin);
router.post('/Signup',Signup);

router.post('/create-course',auth,createCourse);
router.put('/update-course/:id',auth,updateCourse);
router.delete('/delete-course/:id',auth,deleteCourse);

module.exports = router;