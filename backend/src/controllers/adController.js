// src/controllers/adController.js
import Ad from '../models/AdModel.js';
import { generateAdContent } from '../services/adService.js';
import { postToSocialMedia } from '../services/socialMediaService.js';
import { getUserPreferences } from '../services/userService.js';
import { logger } from '../utils/logger.js';
import { isValidObjectId } from '../utils/helpers.js';

const SOCIAL_PLATFORMS = ['facebook', 'twitter', 'instagram', 'linkedin', 'youtube'];

export const generateAndPostAd = async (req, res) => {
  const { userId } = req.body;

  try {
    if (!userId || !isValidObjectId(userId)) {
      logger.warn(`Invalid userId: ${userId}`);
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }

    const userPreferences = await getUserPreferences(userId);
    const adContent = await generateAdContent(userPreferences);

    // Post in parallel to external platforms but cap concurrency if needed in prod
    const results = await Promise.allSettled(
      SOCIAL_PLATFORMS.map((platform) => postToSocialMedia(platform, adContent))
    );

    // Save ad record (do not store secrets)
    const ad = await Ad.create({
      userId,
      content: adContent,
      postedPlatforms: SOCIAL_PLATFORMS.filter((_, i) => results[i].status === 'fulfilled'),
      failedPlatforms: SOCIAL_PLATFORMS.filter((_, i) => results[i].status === 'rejected'),
      createdAt: new Date()
    });

    // Build compact postingResults for response (no internal error stacks)
    const postingResults = results.map((r, i) => ({
      platform: SOCIAL_PLATFORMS[i],
      status: r.status,
      error: r.status === 'rejected' ? String(r.reason?.message || r.reason) : undefined
    }));

    logger.info(`Ad created by user ${userId}`, { adId: ad._id });
    return res.status(201).json({ success: true, ad, postingResults });
  } catch (err) {
    logger.error('Error generating/posting ad', { message: err.message, stack: err.stack });
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export default { generateAndPostAd };
