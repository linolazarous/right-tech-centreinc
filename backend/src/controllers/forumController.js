import ForumPost from '../models/forumModel.js';
import logger from '../utils/logger.js';

export const createPost = async (req, res) => {
  try {
    const postData = { ...req.body, author: req.user.id };
    const post = await ForumPost.create(postData);
    await post.populate('author', 'name avatar');

    logger.info(`Forum post created by user ${req.user.id}`);
    res.status(201).json({ success: true, data: post });
  } catch (error) {
    logger.error(`Error creating forum post: ${error.message}`);
    res.status(500).json({ success: false, error: 'Failed to create forum post.' });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await ForumPost.find()
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ success: true, count: posts.length, data: posts });
  } catch (error) {
    logger.error(`Error fetching forum posts: ${error.message}`);
    res.status(500).json({ success: false, error: 'Failed to fetch posts.' });
  }
};
