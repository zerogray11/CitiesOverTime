import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Heart, ThumbsUp, ThumbsDown, Send, MessageSquare, Trash2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext'; // Adjust the path as needed

const ArticlePage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [voteStatus, setVoteStatus] = useState(null); // null, 'upvote', or 'downvote'
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [commentLoading, setCommentLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  // Access AuthContext
  const { user, token, setUser } = useContext(AuthContext);

  // Debugging: Log user and token changes
  useEffect(() => {
    console.log("User or token updated - User:", user, "Token:", token);
  }, [user, token]);

  // Fetch user data if token is available but user is not
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        if (!response.ok) {
          const errorText = await response.text(); // Get the response as text
          console.error("Failed to fetch user data. Response:", errorText);
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const userData = await response.json(); // Parse the response as JSON
        console.log("User data fetched:", userData);
        setUser(userData); // Update user in context
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    if (token && !user?.id) {
      console.log("Fetching user data...");
      fetchUserData();
    }
  }, [token, user?.id, setUser]);


  // Fetch article, comments, and vote count on component mount or when ID/token changes
  useEffect(() => {
    if (!token) {
      console.error("Token is missing");
      return;
    }

    const fetchData = async () => {
      try {
        console.log("Fetching article, comments, and vote count...");
        await Promise.all([fetchArticle(), fetchComments(), fetchVoteCount()]);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      }
    };

    fetchData();
  }, [id, token]);

  // Fetch favorite status when user ID or token changes
  useEffect(() => {
    if (token && user?.id) {
      console.log("Fetching favorite status for user:", user.id);
      fetchFavoriteStatus();
    } else {
      console.log("User ID or token missing - cannot fetch favorite status");
      setIsFavorite(false); // Default to not favorited if user is not authenticated
    }
  }, [id, token, user?.id]);

  // Fetch article data
  const fetchArticle = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/articles/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch article');
      }

      const data = await response.json();
      setArticle(data);
      console.log("Article data fetched:", data);
    } catch (err) {
      console.error('Error fetching article:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch vote count
  const fetchVoteCount = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/articles/${id}/vote`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUpvotes(data.upvotes);
        setDownvotes(data.downvotes);
        setVoteStatus(data.userVote); // Set user's vote status
        console.log("Vote count fetched:", data);
      }
    } catch (err) {
      console.error('Failed to fetch vote count:', err);
    }
  };

  // Fetch favorite status
  const fetchFavoriteStatus = async () => {
    if (!user?.id || !token) {
      console.log("User ID or token missing - cannot fetch favorite status");
      setIsFavorite(false); // Default to not favorited if user is not authenticated
      return;
    }

    try {
      console.log("Fetching favorite status for article:", id, "and user:", user.id);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/favorites/isFavorited?articleId=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Favorite status response:", data);
        setIsFavorite(data); // Update the favorite state based on the response
      } else {
        console.error('Failed to fetch favorite status:', response.statusText);
        setIsFavorite(false); // Default to not favorited if there's an error
      }
    } catch (err) {
      console.error('Failed to fetch favorite status:', err);
      setIsFavorite(false); // Default to not favorited if there's an error
    }
  };

  // Fetch comments
  const fetchComments = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/comments/article/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setComments(data || []);
        console.log("Comments fetched:", data);
      }
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    }
  };

  // Handle voting
  const handleVote = async (type) => {
    try {
      const voteType = type === 'upvote' ? 'upvote' : 'downvote';

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/articles/${id}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ voteType }),
      });

      if (response.ok) {
        fetchVoteCount(); // Refresh the vote count after voting
      }
    } catch (err) {
      console.error('Failed to vote:', err);
      setError('Failed to vote. Please try again.');
    }
  };

  // Handle favorite
  const handleFavorite = async () => {
    if (favoriteLoading) return;

    setFavoriteLoading(true);
    setError(null);

    try {
      if (isFavorite) {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/favorites?articleId=${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setIsFavorite(false);
        } else {
          throw new Error('Failed to remove favorite');
        }
      } else {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/favorites`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ articleId: id }),
        });

        if (response.ok) {
          setIsFavorite(true);
        } else {
          throw new Error('Failed to add favorite');
        }
      }
    } catch (err) {
      console.error('Failed to update favorite status:', err);
      setError('Failed to update favorite status. Please try again.');
    } finally {
      setFavoriteLoading(false);
    }
  };

  // Handle comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      setError('Comment cannot be empty');
      return;
    }

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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit comment');
      }

      setNewComment('');
      fetchComments(); // Refresh comments after posting
    } catch (err) {
      console.error('Failed to submit comment:', err);
      setError(err.message);
    } finally {
      setCommentLoading(false);
    }
  };

  // Handle comment deletion
  const handleDeleteComment = async (commentId) => {
    setDeleteLoading(commentId);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete comment');
      }

      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (err) {
      console.error('Failed to delete comment:', err);
      setError(err.message);
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-purple-950/20 to-blue-900/20 flex items-center justify-center">
      <div className="text-white text-xl">Loading...</div>
    </div>;
  }

  if (error) {
    return <div className="min-h-screen bg-gradient-to-br from-purple-950/20 to-blue-900/20 flex items-center justify-center">
      <div className="text-red-500 text-xl">Error: {error}</div>
    </div>;
  }

  if (!article) {
    return <div className="min-h-screen bg-gradient-to-br from-purple-950/20 to-blue-900/20 flex items-center justify-center">
      <div className="text-white text-xl">Article not found</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950/20 to-blue-900/20 p-8">
      <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg rounded-3xl border border-purple-500/30 shadow-2xl overflow-hidden">
        <div className="p-12">
          {/* Article Header */}
          <h1 className="text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500 animate-gradient-x leading-tight tracking-tight">
            {article.title}
          </h1>

          {/* Article Content */}
          <div className="space-y-6 text-white/90">
            <p className="text-xl leading-relaxed border-l-4 border-blue-500 pl-4">
              {article.content}
            </p>
          </div>

          {/* Interactions Section */}
          <div className="mt-10 flex flex-wrap items-center gap-8 border-t border-purple-500/30 pt-6">
            {/* Voting with counts */}
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <button 
                  onClick={() => handleVote('upvote')}
                  className={`p-2 rounded-full transition-all ${voteStatus === 'upvote' ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
                >
                  <ThumbsUp size={20} />
                </button>
                <span className="ml-1 text-white/90">{upvotes}</span>
              </div>

              <div className="flex items-center">
                <button 
                  onClick={() => handleVote('downvote')}
                  className={`p-2 rounded-full transition-all ${voteStatus === 'downvote' ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
                >
                  <ThumbsDown size={20} />
                </button>
                <span className="ml-1 text-white/90">{downvotes}</span>
              </div>
            </div>

            {/* Favorite */}
            <button 
              onClick={handleFavorite}
              disabled={favoriteLoading}
              className={`flex items-center gap-2 py-2 px-4 rounded-full transition-all ${
                favoriteLoading 
                  ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed' 
                  : isFavorite 
                    ? 'bg-pink-500/20 text-pink-400' 
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
              <span>
                {favoriteLoading ? 'Processing...' : isFavorite ? 'Favorited' : 'Favorite'}
              </span>
            </button>

            {/* Comment count */}
            <div className="flex items-center gap-2 text-white/70 ml-auto">
              <MessageSquare size={20} />
              <span>{comments.length} comments</span>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-10 border-t border-purple-500/30 pt-6">
            <h2 className="text-2xl font-bold text-white/90 mb-6">Comments</h2>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="mb-8">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-grow bg-white/10 text-white/90 border border-purple-500/30 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
                <button 
                  type="submit"
                  disabled={commentLoading || !newComment.trim()}
                  className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-4 py-2 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send size={18} />
                  Post
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-6">
              {comments.length === 0 ? (
                <p className="text-white/70 italic">No comments yet. Be the first to comment!</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="bg-white/5 rounded-xl p-4 border border-purple-500/20">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className="font-medium text-purple-400">
                          {comment.user?.username || (comment.user ? comment.user : "User")}
                        </div>
                        <div className="text-white/90">{comment.content}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-sm text-white/50">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </div>
                        {user && comment.user && comment.user.id === user.id && (
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            disabled={deleteLoading === comment.id}
                            className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-500/10 transition-all"
                            title="Delete comment"
                          >
                            <Trash2 size={16} />
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