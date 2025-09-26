import ForumPost from '../models/ForumModel.js';
import logger from '../utils/logger.js';
import { validateForumPost } from '../validators/forumValidator.js';
import { moderateContent } from './moderationService.js';

/**
 * Create forum post
 * @param {Object} postData - Post data
 * @returns {Promise<Object>} Created post
 */
export const createPost = async (postData) => {
  try {
    const validation = validateForumPost(postData);
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    // Moderate content before posting
    const moderationResult = await moderateContent(postData.content);
    if (moderationResult.isFlagged) {
      throw new Error('Post contains inappropriate content');
    }

    logger.info('Creating forum post');
    const post = new ForumPost({
      ...postData,
      status: 'published',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await post.save();
    
    logger.info(`Forum post created: ${post._id}`);
    return post.toObject();
  } catch (error) {
    logger.error(`Forum post creation failed: ${error.message}`);
    throw error;
  }
};

/**
 * Get forum posts with pagination
 * @param {Object} options - Pagination and filter options
 * @returns {Promise<Object>} Paginated posts
 */
export const getPosts = async (options = { page: 1, limit: 20 }) => {
  try {
    const { page, limit } = options;
    
    logger.info('Fetching forum posts', { page, limit });
    const posts = await ForumPost.find({ status: 'published' })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select('-__v');

    const total = await ForumPost.countDocuments({ status: 'published' });

    return {
      posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    logger.error(`Error fetching forum posts: ${error.message}`);
    throw error;
  }
};

