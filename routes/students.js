var express = require('express');
var router = express.Router();

Class = require('../models/class');
Student = require('../models/student');
User = require('../models/user');



router.get('/classes', function(req, res, next) {
    Student.getStudentByUsername(req.user.username, function(err, student) {
        if (err) throw err;
        res.render('students/classes', { student: student });
    });
});

router.get('/search', function(req, res, next) {
    res.render("Class");

})

router.post('/classes/register', function(req, res) {
    info = [];
    info['student_username'] = req.user.username;
    info['class_title'] = req.body.class_title;

    Student.register(info, function(err, student) {
        if (err) throw err;
        console.log(student);
    });

    req.flash('success_msg', 'You are now registered');
    res.redirect('/students/classes');
});


// SEARCH



module.exports = router;