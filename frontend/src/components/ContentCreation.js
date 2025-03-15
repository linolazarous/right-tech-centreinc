import React, { useState } from 'react';

const ContentCreation = () => {
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle content creation logic here
    console.log('Content:', content);
  };

  return (
    <div className="content-creation">
      <h1>Content Creation</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Write your content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit">Publish</button>
      </form>
    </div>
  );
};

export default ContentCreation;