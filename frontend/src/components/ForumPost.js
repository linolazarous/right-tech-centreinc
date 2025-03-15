import React from 'react';

const ForumPost = ({ post }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold">{post.title}</h2>
            <p className="text-gray-600">{post.content}</p>
            <div className="mt-2 text-sm text-gray-500">
                Posted by {post.user.name} on {new Date(post.createdAt).toLocaleDateString()}
            </div>
        </div>
    );
};

export default ForumPost;