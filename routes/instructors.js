var express = require('express');
var router = express.Router();

Class = require('../models/class');
Instructor = require('../models/instructor');
User = require('../models/user');

router.get('/classes', function(req, res, next) {
    Instructor.getInstructorByUsername(req.user.username, function(err, instructor) {
        console.log(req.user.username)
        if (err) throw err;
        res.render('instructors/classes', { instructor: instructor });
    });
});

router.post('/classes/register', function(req, res) {
    info = [];
    info['instructor_username'] = req.user.username;
    info['class_id'] = req.body.class_id;
    info['class_title'] = req.body.class_title;


    Instructor.register(info, function(err, instructor) {
        if (err) throw err;
        console.log(instructor);
    });

    req.flash('success_msg', 'You are now registered to teach this class');
    res.redirect('/instructors/classes');
});

router.get('/classes/:id/lessons/new', function(req, res, next) {
    res.render('instructors/newlesson', { class_id: req.params.id });
});

router.get('/classes/new', function(req, res, next) {
    res.render('instructors/newclass', { class_id: req.params.id });
});


//NEW LESSON
router.post('/classes/:id/lessons/new', function(req, res, next) {
    // Get Values
    var info = [];
    info['class_id'] = req.params.id;
    info['lesson_number'] = req.body.lesson_number;
    info['lesson_title'] = req.body.lesson_title;
    info['lesson_body'] = req.body.lesson_body;

    Class.addLesson(info, function(err, lesson) {
        console.log('Lesson Added..');
    });

    req.flash('success_msg', 'Lesson Added');
    res.redirect('/instructors/classes');
});



//NEW CLASS

router.post('/classes/new', function(req, res, next) {
    // Get Values
    var info = [];
    info['class_id'] = req.params.id;
    info['title'] = req.body.title;
    info['description'] = req.body.description;
    info['instructor'] = req.body.instructor;

    Class.addClass(info, function(err, classes) {
        console.log('Department Added..');
        console.log(classes);
    });

    req.flash('success_msg', 'Department Added');
    res.redirect('/instructors/classes');
});

// Update a message identified by the messageId in the request
router.put('')

module.exports = router;