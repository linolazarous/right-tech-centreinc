import Ad from '../models/AdModel.js';
import { generateAdContent } from "../services/adService.js";
import { postToSocialMedia } from "../services/socialMediaService.js";
import logger from '../utils/logger.js';
import { getUserPreferences } from '../services/userService.js';

const socialMediaPlatforms = ['facebook', 'twitter', 'instagram', 'linkedin', 'youtube'];

/**
 * Generate and post ad to multiple platforms
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const generateAndPostAd = async (req, res) => {
  const { userId } = req.body;
  
  try {
    // Input validation
    if (!userId || typeof userId !== 'string') {
      logger.warn(`Invalid userId format: ${userId}`);
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    const userPreferences = await getUserPreferences(userId);
    const adContent = await generateAdContent(userPreferences);

    // Post to social media platforms in parallel
    const postingResults = await Promise.allSettled(
      socialMediaPlatforms.map(platform => 
        postToSocialMedia(platform, adContent)
      )
    );

    // Log posting results
    postingResults.forEach((result, index) => {
      if (result.status === 'rejected') {
        logger.error(`Failed to post to ${socialMediaPlatforms[index]}: ${result.reason.message}`);
      }
    });

    // Save ad to database
    const ad = await Ad.create({ 
      userId, 
      content: adContent,
      postedPlatforms: socialMediaPlatforms
    });

    logger.info(`Ad successfully created and posted for userId: ${userId}`);
    res.status(201).json({
      ad,
      postingResults: postingResults.map((result, index) => ({
        platform: socialMediaPlatforms[index],
        status: result.status,
        error: result.status === 'rejected' ? result.reason.message : undefined
      }))
    });
  } catch (err) {
    logger.error(`Error in generateAndPostAd: ${err.message}`, { stack: err.stack });
    res.status(500).json({ 
      error: 'Internal server error',
      message: err.message 
    });
  }
};

export default { 
  generateAndPostAd 
};
