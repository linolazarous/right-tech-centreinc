import React from 'react';

const ForumPostList = ({ posts }) => {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-start space-x-4">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">{post.title}</h3>
                <span className="text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 mb-4">{post.content}</p>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>By {post.author.name}</span>
                <span>{post.comments} comments</span>
                <span>{post.views} views</span>
                <span>{post.likes} likes</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ForumPostList;
