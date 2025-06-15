const { postToSocialMedia } = require('./socialMediaService');
const { validationResult } = require('express-validator');
const SocialMediaPost = require('../models/SocialMediaPost'); // Assuming you have this model

const socialMediaController = {
  /**
   * Post content to specified social media platform
   */
  createPost: async (req, res) => {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { platform, content, scheduleAt } = req.body;
      const userId = req.user.id; // Assuming you have user authentication

      // Validate supported platforms
      const supportedPlatforms = ['twitter', 'facebook', 'linkedin', 'instagram'];
      if (!supportedPlatforms.includes(platform.toLowerCase())) {
        return res.status(400).json({ error: 'Unsupported social media platform' });
      }

      // Check if content length is appropriate for platform
      if (platform.toLowerCase() === 'twitter' && content.length > 280) {
        return res.status(400).json({ error: 'Twitter posts must be 280 characters or less' });
      }

      // If scheduled post
      if (scheduleAt && new Date(scheduleAt) > new Date()) {
        // Save to database for later processing
        const scheduledPost = await SocialMediaPost.create({
          userId,
          platform,
          content,
          scheduledAt: scheduleAt,
          status: 'scheduled'
        });
        
        return res.status(202).json({
          message: 'Post scheduled successfully',
          postId: scheduledPost._id,
          scheduledAt: scheduleAt
        });
      }

      // Immediate posting
      const postResponse = await postToSocialMedia(platform, content);
      
      // Save record of the post
      const newPost = await SocialMediaPost.create({
        userId,
        platform,
        content,
        status: 'published',
        publishedAt: new Date(),
        platformPostId: postResponse.id,
        metadata: postResponse
      });

      res.status(201).json({
        message: 'Post published successfully',
        post: {
          id: newPost._id,
          platform: newPost.platform,
          content: newPost.content,
          publishedAt: newPost.publishedAt,
          url: postResponse.url || null
        }
      });

    } catch (error) {
      console.error('Social media posting error:', error);
      
      // Handle specific platform API errors
      if (error.response) {
        const { status, data } = error.response;
        return res.status(status).json({ 
          error: 'Social media API error',
          details: data 
        });
      }

      res.status(500).json({ 
        error: 'Failed to process social media post',
        details: error.message 
      });
    }
  },

  /**
   * Get all posts for a user
   */
  getUserPosts: async (req, res) => {
    try {
      const userId = req.user.id;
      const { platform, status } = req.query;
      
      const filter = { userId };
      if (platform) filter.platform = platform;
      if (status) filter.status = status;

      const posts = await SocialMediaPost.find(filter)
        .sort({ createdAt: -1 })
        .select('-__v -metadata');

      res.json(posts);
    } catch (error) {
      console.error('Error fetching social media posts:', error);
      res.status(500).json({ error: 'Failed to fetch posts' });
    }
  },

  /**
   * Delete/Cancel a scheduled or published post
   */
  deletePost: async (req, res) => {
    try {
      const { postId } = req.params;
      const userId = req.user.id;

      const post = await SocialMediaPost.findOne({ 
        _id: postId, 
        userId 
      });

      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      // If post is already published, we might want to delete from platform too
      if (post.status === 'published' && post.platformPostId) {
        // Note: Would need to implement delete functionality in socialMediaService
        // await deleteFromSocialMedia(post.platform, post.platformPostId);
      }

      await post.remove();

      res.json({ message: 'Post deleted successfully' });
    } catch (error) {
      console.error('Error deleting social media post:', error);
      res.status(500).json({ error: 'Failed to delete post' });
    }
  },

  /**
   * Get post analytics
   */
  getPostAnalytics: async (req, res) => {
    try {
      const { postId } = req.params;
      const userId = req.user.id;

      const post = await SocialMediaPost.findOne({ 
        _id: postId, 
        userId 
      });

      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      // Note: Would need to implement analytics fetch in socialMediaService
      // const analytics = await getSocialMediaPostAnalytics(post.platform, post.platformPostId);
      
      // For now, return basic info
      res.json({
        postId: post._id,
        platform: post.platform,
        status: post.status,
        engagement: post.metadata?.engagement || null,
        // analytics would be added here
      });
    } catch (error) {
      console.error('Error fetching post analytics:', error);
      res.status(500).json({ error: 'Failed to fetch analytics' });
    }
  }
};

module.exports = socialMediaController;
