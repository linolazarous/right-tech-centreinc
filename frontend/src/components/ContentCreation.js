import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { createContent } from '../services/contentService';
import PropTypes from 'prop-types';

const ContentCreation = ({ userId }) => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || !title.trim()) {
      setError('Title and content are required');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      await createContent({
        userId,
        title,
        content,
        attachments: files
      });
      setSuccess(true);
      setContent('');
      setTitle('');
      setFiles([]);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to publish content');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  return (
    <div className="content-creation">
      <h1>Create New Content</h1>
      {success && <div className="success">Content published successfully!</div>}
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Content</label>
          <ReactQuill
            value={content}
            onChange={setContent}
            modules={{
              toolbar: [
                ['bold', 'italic', 'underline'],
                [{'list': 'ordered'}, {'list': 'bullet'}],
                ['link', 'image'],
                ['clean']
              ]
            }}
            placeholder="Write your content here..."
          />
        </div>
        
        <div className="form-group">
          <label>Attachments</label>
          <input 
            type="file" 
            multiple 
            onChange={handleFileChange}
            className="file-input"
          />
          {files.length > 0 && (
            <div className="file-preview">
              <p>Selected files: {files.map(f => f.name).join(', ')}</p>
            </div>
          )}
        </div>
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Publishing...' : 'Publish Content'}
        </button>
      </form>
    </div>
  );
};

ContentCreation.propTypes = {
  userId: PropTypes.string.isRequired
};

export default ContentCreation;
