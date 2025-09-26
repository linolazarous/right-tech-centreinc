import ForumPost from '../models/ForumModel.js';
import logger from '../utils/logger.js';
import { isValidObjectId } from '../utils/helpers.js';
import { validateForumPost } from '../validators/forumValidator.js';

export const createPost = async (req, res) => {
    try {
        const postData = req.body;
        
        // Validate input
        const validation = validateForumPost(postData);
        if (!validation.valid) {
            return res.status(400).json({ error: validation.message });
        }

        if (!isValidObjectId(postData.author)) {
            return res.status(400).json({ error: 'Invalid author ID format' });
        }

        logger.info('Creating forum post', { author: postData.author });
        const post = new ForumPost(postData);
        await post.save();

        logger.info(`Forum post created: ${post._id}`);
        res.status(201).json({
            postId: post._id,
            title: post.title,
            author: post.author,
            tags: post.tags,
            createdAt: post.createdAt
        });
    } catch (error) {
        logger.error(`Error creating forum post: ${error.message}`, { stack: error.stack });
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        
        res.status(500).json({ 
            error: 'Failed to create forum post',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export default {
    createPost
};

