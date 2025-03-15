const zoom = require('zoomus');

   exports.scheduleMeeting = async (data) => {
       const meeting = await zoom.meeting.create(data);
       return meeting;
   };