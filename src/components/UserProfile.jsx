import React, { useState, useContext, useEffect } from 'react';
import { User, Lock, Bookmark, Settings, Eye, EyeOff, Edit, Trash, Plus } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const { user, token, logout, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: user?.fullName || '',
    email: user?.email || '', // Ensure email is used
    username: user?.username || '',
    password: '********',
  });

  const [favoriteArticles, setFavoriteArticles] = useState([]);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch favorite articles
  useEffect(() => {
    const fetchFavoriteArticles = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/favorites/user`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch favorite articles');
        }

        const data = await response.json();
        setFavoriteArticles(data);
      } catch (err) {
        console.error('Error fetching favorite articles:', err);
        setError('Failed to load your favorite articles. Please try again later.');
        setFavoriteArticles([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchFavoriteArticles();
    }
  }, [user, token]);

  // Handle input changes for profile fields
  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle profile update
  const handleUpdateProfile = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: profileData.name,
          username: profileData.username,
          email: profileData.email, // Send email instead of username
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const updatedUser = await response.json();
      updateUser(updatedUser);
      setSuccessMessage('Profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password change
  const handleChangePassword = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All password fields are required.');
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to change password');
      }

      setSuccessMessage('Password changed successfully');
      document.getElementById('currentPassword').value = '';
      document.getElementById('newPassword').value = '';
      document.getElementById('confirmPassword').value = '';
    } catch (error) {
      console.error('Error changing password:', error);
      setError(error.message || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle removing a favorite article
  const handleRemoveFavorite = async (articleId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/favorites?articleId=${articleId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to remove article from favorites');
      }

      setFavoriteArticles(favoriteArticles.filter((article) => article.article.id !== articleId));
      setSuccessMessage('Article removed from favorites');
    } catch (err) {
      setError(err.message || 'Failed to remove from favorites');
    }
  };

  // Handle browsing articles
  const handleBrowseArticles = () => {
    navigate('/article');
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            User Profile
          </h1>
          <p className="text-lg text-blue-100/80">Manage your account and preferences</p>
        </div>

        {(error || successMessage) && (
          <div className={`max-w-[62rem] mx-auto mb-6 p-4 rounded-lg ${error ? 'bg-red-500/20 border border-red-500/50' : 'bg-green-500/20 border border-green-500/50'}`}>
            <p className={`text-center ${error ? 'text-red-100' : 'text-green-100'}`}>
              {error || successMessage}
            </p>
          </div>
        )}

        <div className="relative max-w-[62rem] mx-auto">
          <div className="relative p-[1px] rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/40 to-purple-500/40 animate-pulse" />
            <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-[1rem] p-6">
              {/* Tabs */}
              <div className="flex space-x-4 mb-8 bg-slate-800/50 p-1 rounded-lg">
                {[
                  { id: 'profile', icon: User },
                  { id: 'security', icon: Lock },
                  { id: 'articles', icon: Bookmark },
                  { id: 'settings', icon: Settings },
                ].map(({ id, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      activeTab === id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                        : 'text-blue-100/70 hover:bg-slate-700/50'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="capitalize">{id}</span>
                  </button>
                ))}
              </div>

              {/* Profile Tab Content */}
              {activeTab === 'profile' && (
                <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                  <h2 className="text-xl font-semibold text-blue-100 mb-6">Profile Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-blue-100/80 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full p-2 bg-slate-700/50 border border-slate-600 rounded-lg text-blue-100 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-blue-100/80 mb-1">Username</label>
                      <input
                        type="text"
                        value={profileData.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        className="w-full p-2 bg-slate-700/50 border border-slate-600 rounded-lg text-blue-100 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-blue-100/80 mb-1">Email</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full p-2 bg-slate-700/50 border border-slate-600 rounded-lg text-blue-100 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <button
                      onClick={handleUpdateProfile}
                      className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 rounded-lg text-blue-100 transition-colors"
                    >
                      Update Profile
                    </button>
                  </div>
                </div>
              )}

              {/* Articles Tab Content */}
              {activeTab === 'articles' && (
                <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-blue-100">Favorite Articles</h2>
                    <button
                      onClick={handleBrowseArticles}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 rounded-lg text-blue-100 transition-colors"
                    >
                      <Plus size={16} />
                      <span>Browse Articles</span>
                    </button>
                  </div>

                  {isLoading ? (
                    <div className="flex justify-center p-8">
                      <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {favoriteArticles.length > 0 ? (
                        favoriteArticles.map((favorite) => (
                          <div
                            key={favorite.article.id}
                            className="p-4 rounded-lg border border-slate-700 bg-slate-900/30 hover:bg-slate-900/50 transition-colors cursor-pointer"
                            onClick={() => navigate(`/article/${favorite.article.id}`)} // Navigate to article page
                          >
                            <h3 className="font-medium text-blue-100">{favorite.article.title}</h3>
                            <p className="text-sm text-blue-100/60 mt-1">{favorite.article.category}</p>
                            <div className="flex justify-between mt-3">
                              <a
                                href={`/article/${favorite.article.id}`}
                                className="px-4 py-1 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded transition-colors"
                              >
                                Read Article
                              </a>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent navigation when clicking the delete button
                                  handleRemoveFavorite(favorite.article.id);
                                }}
                                className="p-1 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-full transition-colors"
                              >
                                <Trash size={16} />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="md:col-span-2 p-6 text-center text-blue-100/60 border border-dashed border-slate-700 rounded-lg">
                          <p>You don't have any favorite articles yet.</p>
                          <button
                            onClick={handleBrowseArticles}
                            className="mt-4 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 rounded-lg text-blue-100 transition-colors"
                          >
                            Browse Articles
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Security Tab Content */}
              {activeTab === 'security' && (
                <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                  <h2 className="text-xl font-semibold text-blue-100 mb-6">Security Settings</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-blue-100/80 mb-1">Current Password</label>
                      <div className="relative">
                        <input
                          type={passwordVisible ? 'text' : 'password'}
                          id="currentPassword"
                          className="w-full p-2 bg-slate-700/50 border border-slate-600 rounded-lg text-blue-100 focus:outline-none focus:border-blue-500"
                        />
                        <button
                          onClick={() => setPasswordVisible(!passwordVisible)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-100/70 hover:text-blue-100"
                        >
                          {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-blue-100/80 mb-1">New Password</label>
                      <div className="relative">
                        <input
                          type={passwordVisible ? 'text' : 'password'}
                          id="newPassword"
                          className="w-full p-2 bg-slate-700/50 border border-slate-600 rounded-lg text-blue-100 focus:outline-none focus:border-blue-500"
                        />
                        <button
                          onClick={() => setPasswordVisible(!passwordVisible)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-100/70 hover:text-blue-100"
                        >
                          {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-blue-100/80 mb-1">Confirm Password</label>
                      <div className="relative">
                        <input
                          type={passwordVisible ? 'text' : 'password'}
                          id="confirmPassword"
                          className="w-full p-2 bg-slate-700/50 border border-slate-600 rounded-lg text-blue-100 focus:outline-none focus:border-blue-500"
                        />
                        <button
                          onClick={() => setPasswordVisible(!passwordVisible)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-100/70 hover:text-blue-100"
                        >
                          {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={handleChangePassword}
                      className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 rounded-lg text-blue-100 transition-colors"
                    >
                      Update Password
                    </button>
                  </div>
                </div>
              )}

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="mt-6 px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-lg transition-all duration-200"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;