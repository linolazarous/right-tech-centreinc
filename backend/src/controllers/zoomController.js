const zoom = require('../services/zoomService');

   exports.scheduleMeeting = async (req, res) => {
       try {
           const meeting = await zoom.scheduleMeeting(req.body);
           res.status(201).json(meeting);
       } catch (error) {
           res.status(400).json({ error: error.message });
       }
   };