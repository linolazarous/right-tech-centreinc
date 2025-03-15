const OfflineService = require('../services/offlineService');

    exports.downloadCourse = async (req, res) => {
        try {
            const course = await OfflineService.downloadCourse(req.params.courseId);
            res.status(200).json(course);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    };