import React, { useEffect, useState } from 'react';
import ForumPost from '../components/ForumPost';
import { fetchForumPosts } from '../services/api';

const Forum = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetchForumPosts().then((data) => setPosts(data));
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Community Forum</h1>
            <div className="space-y-4">
                {posts.map((post) => (
                    <ForumPost key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
};

export default Forum;