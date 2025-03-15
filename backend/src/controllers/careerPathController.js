const CareerPathService = require('../services/careerPathService');

class CareerPathController {
  static async getCareerPaths(req, res) {
    try {
      const careerPaths = await CareerPathService.getCareerPaths();
      res.status(200).json(careerPaths);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async addCareerPath(req, res) {
    try {
      const careerPathData = req.body;
      const newCareerPath = await CareerPathService.addCareerPath(careerPathData);
      res.status(201).json(newCareerPath);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = CareerPathController;