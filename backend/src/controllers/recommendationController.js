const RecommendationService = require('../services/recommendationService');

   exports.getRecommendations = async (req, res) => {
       try {
           const recommendations = await RecommendationService.getRecommendations(req.user.id);
           res.status(200).json(recommendations);
       } catch (error) {
           res.status(400).json({ error: error.message });
       }
   };