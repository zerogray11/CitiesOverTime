import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ThumbsUp, ThumbsDown, Send, MessageSquare, Trash2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const ArticlePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [voteStatus, setVoteStatus] = useState(null);
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [commentLoading, setCommentLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const { user, token } = useContext(AuthContext);

  // Fetch article data (no token required)
  const fetchArticle = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/articles/${id}`);
      if (!response.ok) throw new Error('Failed to fetch article');
      const data = await response.json();
      setArticle(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch comments (no token required)
  const fetchComments = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/comments/article/${id}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data || []);
      }
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    }
  };

  // Fetch vote count (no token required)
  const fetchVoteCount = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/articles/${id}/vote`);
      if (response.ok) {
        const data = await response.json();
        setUpvotes(data.upvotes);
        setDownvotes(data.downvotes);
        setVoteStatus(data.userVote); // Will be null if not logged in
      }
    } catch (err) {
      console.error('Failed to fetch vote count:', err);
    }
  };

  // Fetch favorite status (requires token)
  const fetchFavoriteStatus = async () => {
    if (!token) {
      setIsFavorite(false);
      return;
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/favorites/isFavorited?articleId=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) setIsFavorite(await response.json());
    } catch (err) {
      console.error('Failed to fetch favorite status:', err);
    }
  };

  // Handle voting (requires login)
  const handleVote = async (type) => {
    if (!token) {
      navigate('/sign-in');
      return;
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/articles/${id}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ voteType: type === 'upvote' ? 'upvote' : 'downvote' }),
      });
      if (response.ok) fetchVoteCount();
    } catch (err) {
      console.error('Failed to vote:', err);
    }
  };

  // Handle favorite (requires login)
  const handleFavorite = async () => {
    if (!token) {
      navigate('/sign-in');
      return;
    }
    setFavoriteLoading(true);
    try {
      if (isFavorite) {
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/favorites?articleId=${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsFavorite(false);
      } else {
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/favorites`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ articleId: id }),
        });
        setIsFavorite(true);
      }
    } catch (err) {
      console.error('Failed to update favorite status:', err);
    } finally {
      setFavoriteLoading(false);
    }
  };

  // Handle comment submission (requires login)
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      navigate('/sign-in');
      return;
    }
    if (!newComment.trim()) return;

    setCommentLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/comments/article/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newComment }),
      });
      if (!response.ok) throw new Error('Failed to submit comment');
      setNewComment('');
      fetchComments();
    } catch (err) {
      console.error('Failed to submit comment:', err);
    } finally {
      setCommentLoading(false);
    }
  };

  // Handle comment deletion (requires login)
  const handleDeleteComment = async (commentId) => {
    if (!token) return;
    setDeleteLoading(commentId);
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/comments/${commentId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (err) {
      console.error('Failed to delete comment:', err);
    } finally {
      setDeleteLoading(null);
    }
  };

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([fetchArticle(), fetchComments(), fetchVoteCount()]);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
  }, [id]);

  // Fetch favorite status when token changes
  useEffect(() => {
    fetchFavoriteStatus();
  }, [id, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950/20 to-blue-900/20 flex items-center justify-center p-4">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950/20 to-blue-900/20 flex items-center justify-center p-4">
        <div className="text-red-500 text-xl">Error: {error}</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950/20 to-blue-900/20 flex items-center justify-center p-4">
        <div className="text-white text-xl">Article not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950/20 to-blue-900/20 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl border border-purple-500/30 shadow-lg sm:shadow-2xl overflow-hidden">
        <div className="p-4 sm:p-6 md:p-8 lg:p-12">
          {/* Article Header */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500 leading-tight tracking-tight">
            {article.title}
          </h1>

          {/* Article Content */}
          <div className="space-y-4 sm:space-y-6 text-white/90">
            <p className="text-base sm:text-lg md:text-xl leading-relaxed border-l-2 sm:border-l-4 border-blue-500 pl-3 sm:pl-4">
              {article.content}
            </p>
          </div>

          {/* Interactions Section */}
          <div className="mt-6 sm:mt-8 md:mt-10 flex flex-wrap items-center gap-4 sm:gap-6 border-t border-purple-500/30 pt-4 sm:pt-6">
            {/* Voting */}
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center">
                <button 
                  onClick={() => handleVote('upvote')}
                  className={`p-1 sm:p-2 rounded-full transition-all ${
                    !token ? 'cursor-not-allowed opacity-50' : 
                    voteStatus === 'upvote' ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                  title={!token ? "Sign in to vote" : ""}
                >
                  <ThumbsUp size={18} className="sm:w-5 sm:h-5" />
                </button>
                <span className="ml-1 text-sm sm:text-base text-white/90">{upvotes}</span>
              </div>

              <div className="flex items-center">
                <button 
                  onClick={() => handleVote('downvote')}
                  className={`p-1 sm:p-2 rounded-full transition-all ${
                    !token ? 'cursor-not-allowed opacity-50' : 
                    voteStatus === 'downvote' ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                  title={!token ? "Sign in to vote" : ""}
                >
                  <ThumbsDown size={18} className="sm:w-5 sm:h-5" />
                </button>
                <span className="ml-1 text-sm sm:text-base text-white/90">{downvotes}</span>
              </div>
            </div>

            {/* Favorite */}
            <button 
              onClick={handleFavorite}
              disabled={favoriteLoading || !token}
              className={`flex items-center gap-1 sm:gap-2 py-1 px-2 sm:py-2 sm:px-4 rounded-full transition-all text-sm sm:text-base ${
                !token ? 'cursor-not-allowed opacity-50' :
                favoriteLoading ? 'bg-gray-500/20 text-gray-400' : 
                isFavorite ? 'bg-pink-500/20 text-pink-400' : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
              title={!token ? "Sign in to favorite" : ""}
            >
              <Heart size={18} className="sm:w-5 sm:h-5" fill={isFavorite ? "currentColor" : "none"} />
              <span className="hidden sm:inline">
                {favoriteLoading ? 'Processing...' : isFavorite ? 'Favorited' : 'Favorite'}
              </span>
            </button>

            {/* Comment count */}
            <div className="flex items-center gap-1 sm:gap-2 text-white/70 ml-auto text-sm sm:text-base">
              <MessageSquare size={18} className="sm:w-5 sm:h-5" />
              <span>{comments.length} {comments.length === 1 ? 'comment' : 'comments'}</span>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-6 sm:mt-8 md:mt-10 border-t border-purple-500/30 pt-4 sm:pt-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white/90 mb-4 sm:mb-6">Comments</h2>

            {/* Comment Form */}
            {token ? (
              <form onSubmit={handleCommentSubmit} className="mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-grow bg-white/10 text-white/90 border border-purple-500/30 rounded-lg px-3 py-2 sm:px-4 sm:py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm sm:text-base"
                  />
                  <button 
                    type="submit"
                    disabled={commentLoading || !newComment.trim()}
                    className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-3 py-2 sm:px-4 sm:py-2 flex items-center justify-center gap-1 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm sm:text-base"
                  >
                    <Send size={16} className="sm:w-4 sm:h-4" />
                    <span>Post</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-white/5 rounded-lg text-center">
                <button 
                  onClick={() => navigate('/sign-in')}
                  className="text-purple-400 hover:text-purple-300 underline text-sm sm:text-base"
                >
                  Sign in to post a comment
                </button>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-4 sm:space-y-6">
              {comments.length === 0 ? (
                <p className="text-white/70 italic text-sm sm:text-base">No comments yet.</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="bg-white/5 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-purple-500/20">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0 mb-1 sm:mb-2">
                      <div className="flex items-start gap-2">
                        <div className="font-medium text-purple-400 text-sm sm:text-base">
                          {comment.user?.username || (comment.user ? comment.user : "User")}
                        </div>
                        <div className="text-white/90 text-sm sm:text-base">{comment.content}</div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="text-xs sm:text-sm text-white/50">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </div>
                        {token && user && comment.user && comment.user.id === user.id && (
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            disabled={deleteLoading === comment.id}
                            className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-500/10 transition-all"
                            title="Delete comment"
                          >
                            <Trash2 size={14} className="sm:w-4 sm:h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;