const CourseModel = require('../models/courseModel');

class CourseService {
  static async getCourses() {
    return await CourseModel.find();
  }

  static async addCourse(courseData) {
    const newCourse = new CourseModel(courseData);
    return await newCourse.save();
  }
}

module.exports = CourseService;