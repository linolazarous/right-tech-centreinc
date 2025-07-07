import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { formatDistanceToNow } from 'date-fns';
import CommentSection from './CommentSection';

const ForumPost = ({ post, currentUserId }) => {
  const [showComments, setShowComments] = useState(false);
  const [likes, setLikes] = useState(post.likes || []);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      // API call to like post
      const newLikes = likes.includes(currentUserId)
        ? likes.filter(id => id !== currentUserId)
        : [...likes, currentUserId];
      setLikes(newLikes);
    } catch (error) {
      console.error('Error updating like:', error);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="forum-post">
      <div className="post-header">
        <img 
          src={post.user.avatar || '/default-avatar.png'} 
          alt={post.user.name}
          className="user-avatar"
        />
        <div className="user-info">
          <h3 className="user-name">{post.user.name}</h3>
          <span className="post-time">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </span>
        </div>
      </div>
      
      <div className="post-content">
        <h2 className="post-title">{post.title}</h2>
        <p className="post-text">{post.content}</p>
        {post.image && (
          <img src={post.image} alt="Post visual" className="post-image" />
        )}
      </div>
      
      <div className="post-actions">
        <button 
          className={`like-button ${likes.includes(currentUserId) ? 'liked' : ''}`}
          onClick={handleLike}
          disabled={isLiking}
        >
          {likes.length} {likes.length === 1 ? 'Like' : 'Likes'}
        </button>
        <button 
          className="comment-button"
          onClick={() => setShowComments(!showComments)}
        >
          {showComments ? 'Hide Comments' : 'Show Comments'}
        </button>
      </div>
      
      {showComments && (
        <CommentSection 
          postId={post._id} 
          initialComments={post.comments} 
          currentUserId={currentUserId}
        />
      )}
    </div>
  );
};

ForumPost.propTypes = {
  post: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    user: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      avatar: PropTypes.string
    }).isRequired,
    createdAt: PropTypes.string.isRequired,
    likes: PropTypes.arrayOf(PropTypes.string),
    comments: PropTypes.array,
    image: PropTypes.string
  }).isRequired,
  currentUserId: PropTypes.string.isRequired
};

export default ForumPost;
