import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NewArticlePage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(''); // Add category state
  const [media, setMedia] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content || !category) { // Ensure category is required
      setError('Title, content, and category are required.');
      return;
    }

    const articleData = {
      title,
      content,
      category, // Include category in the request payload
      // Add other fields like media, authorId, etc., if needed
    };

    try {
      const token = localStorage.getItem('token'); // Retrieve the token from localStorage
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/articles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the token in the request headers
        },
        body: JSON.stringify(articleData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to post article');
      }

      const createdArticle = await response.json(); // Get the created article from the response
      navigate(`/article/${createdArticle.id}`); // Redirect to the new article's page
    } catch (err) {
      setError(err.message || 'Failed to post article');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-2xl mx-auto bg-slate-800/50 rounded-lg p-6 border border-slate-700">
        <h2 className="text-2xl font-bold text-blue-100 mb-6">Create New Article</h2>
        {error && <p className="text-red-400 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-blue-100/80 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-blue-100 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-blue-100/80 mb-2">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-blue-100 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
              rows="6"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-blue-100/80 mb-2">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-blue-100 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-blue-100/80 mb-2">Media (Optional)</label>
            <input
              type="file"
              onChange={(e) => setMedia(e.target.files[0])}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-blue-100 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg transition-all duration-200"
          >
            Post Article
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewArticlePage;