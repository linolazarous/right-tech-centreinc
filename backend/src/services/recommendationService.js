const User = require('../models/User');

   exports.getRecommendations = async (userId) => {
       const user = await User.findById(userId).populate('coursesEnrolled');
       // Logic to generate recommendations based on user's enrolled courses
       return user.coursesEnrolled;
   };