const Course = require('../models/Course');

   exports.createCourse = async (req, res) => {
       try {
           const course = new Course(req.body);
           await course.save();
           res.status(201).json(course);
       } catch (error) {
           res.status(400).json({ error: error.message });
       }
   };

   exports.getCourses = async (req, res) => {
       try {
           const courses = await Course.find();
           res.status(200).json(courses);
       } catch (error) {
           res.status(400).json({ error: error.message });
       }
   };