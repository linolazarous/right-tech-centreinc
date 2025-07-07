import React, { useState, useEffect } from 'react';
import { getPosts, createPost } from '../services/communityForumService';
import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CommunityForum = ({ userId }) => {
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, [page]);

    const fetchPosts = async () => {
        try {
            setIsLoading(true);
            const data = await getPosts(page);
            setPosts(prev => page === 1 ? data : [...prev, ...data]);
            setHasMore(data.length > 0);
            setError('');
        } catch (err) {
            setError('Failed to load posts');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newPost.trim()) return;
        
        try {
            await createPost({ 
                content: newPost,
                userId 
            });
            setNewPost('');
            setPage(1); // Refresh with first page
            fetchPosts();
        } catch (err) {
            setError('Failed to create post');
            console.error(err);
        }
    };

    return (
        <div className="community-forum">
            <h1>Community Forum</h1>
            
            {userId ? (
                <form onSubmit={handleSubmit} className="post-form">
                    <ReactQuill
                        value={newPost}
                        onChange={setNewPost}
                        placeholder="Share your thoughts..."
                        modules={{
                            toolbar: [
                                ['bold', 'italic', 'underline'],
                                ['link', 'code-block'],
                                [{ 'list': 'ordered'}, { 'list': 'bullet' }]
                            ]
                        }}
                    />
                    <button type="submit" disabled={!newPost.trim()}>
                        Post
                    </button>
                </form>
            ) : (
                <p className="login-prompt">Please login to participate in the forum.</p>
            )}

            {error && <div className="error">{error}</div>}
            
            <div className="posts-list">
                {posts.map((post) => (
                    <div key={post._id} className="post">
                        <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content }} />
                        <div className="post-meta">
                            <span>Posted by {post.user.name}</span>
                            <span>{new Date(post.createdAt).toLocaleString()}</span>
                        </div>
                    </div>
                ))}
            </div>

            {isLoading && <div className="loading">Loading posts...</div>}
            
            {!isLoading && hasMore && (
                <button 
                    onClick={() => setPage(p => p + 1)}
                    className="load-more"
                >
                    Load More
                </button>
            )}
        </div>
    );
};

CommunityForum.propTypes = {
    userId: PropTypes.string
};

export default CommunityForum;
