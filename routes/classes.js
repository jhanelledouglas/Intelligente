var express = require('express');
var router = express.Router();
var Class = require('../views/students/classes.handlebars');
var Class = require('../models/class');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;

//Test
router.get('/test/:id', function(req, res) {
    console.log('test' + req.params.id);
    res.status(200);
    res.send('ok');

});



//Classes Page
router.get('/', function(req, res, next) {
    Class.getClasses(function(err, classes) {
        if (err) throw err;
        res.render('classes/index', { classes: classes });
    });
});

// Class Details
router.get('/:id/details', function(req, res, next) {
    Class.getClassById([req.params.id], function(err, classname) {
        if (err) throw err;
        res.render('classes/details', { class: classname });
    });
});

router.get('/:id/classes', function(req, res, next) {
    Class.getClassById([req.params.id], function(err, classname) {
        if (err) throw err;
        res.render('classes/lessons', { class: classname });
    });
});

// Get Courses
router.get('/:id/lessons', async function(req, res) {
    // Class.getClassById([req.params.id], function(err, classname) {
    //     console.log(req.params.id);
    //     if (err) throw err;
    //     res.status(200);
    //     res.render('classes/lessons', { class: classname });
    // });
    const class_id = req.params.id

    Class.findOne({ _id: class_id })

    .then((result) => {
        console.log(result)

        res.status(200)
        res.render('classes/lessons', { class: result });
    }).catch(err => {
        console.log(err)
    })
});





// Get Information on Courses
router.get('/:id/lessons/:lesson_id', function(req, res, next) {

    const class_id = req.params.id
    Class.findOne({ _id: class_id })
    console.log(_id)
        .then((result) => {
            // const lesson = res
            console.log(result._id)

            const lesson = result.lessons.find(element => element.lesson_number == req.params.lesson_id);
            // res.send(lesson)
            const obj = {
                lesson,
                result
            }
            res.render('classes/lesson', { class: obj });
            // console.log(lesson)
            // res.status(200)
            // console.log(lesson);

        }).catch(err => {
            console.log(err)
        })
        // Class.getClassById([req.params.id], function(err, classname) {
        //     console.log(classname)
        //     var lesson;
        //     if (err) throw err;
        //     for (i = 0; i < classname.lessons.length; i++) {
        //         if (classname.lessons[i].lesson_number == req.params.lesson_id) {
        //             lesson = classname.lessons[i];
        //         }
        //     }
        //     res.render('classes/lesson', { class: classname, lesson: lesson });
        // });
});

// SEARCH FOR lessons
router.post('/classes/search', (req, res, next) => {
    let { term } = req.query;
    Class.findAll({
            where: {
                lesson_title: {
                    [Op.like]: '%' + term + '%'
                }
            }
        })
        .then(lessons => res.render('classes/lesson', { class: classname, lesson: lesson }))
        .catch(err => console.log(err));
});




module.exports = router;