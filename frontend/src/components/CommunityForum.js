import React, { useEffect, useState } from 'react';
import { getPosts, createPost } from '../services/communityForumService';

const CommunityForum = () => {
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState('');

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        const data = await getPosts();
        setPosts(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createPost({ content: newPost });
        setNewPost('');
        fetchPosts();
    };

    return (
        <div>
            <h1>Community Forum</h1>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="Write your post..."
                />
                <button type="submit">Post</button>
            </form>
            <div>
                {posts.map((post) => (
                    <div key={post._id}>
                        <p>{post.content}</p>
                        <small>Posted by {post.user.name}</small>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommunityForum;