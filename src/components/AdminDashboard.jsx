import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Newspaper, 
  Map, 
  Users, 
  Mail, 
  Trash2, 
  Edit3, 
  MessageSquare,
  Settings,
  PlusCircle,
  Search,
  Bell,
  Eye,
  EyeOff,
  User,
  Lock,
  Bookmark
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user, token, logout, updateUser } = useContext(AuthContext); // Include token here
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('articles');
  const [searchQuery, setSearchQuery] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: user?.fullName || '',
    email: user?.email || '',
    username: user?.username || '',
    password: '********',
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch articles from the backend
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/articles`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }
        const data = await response.json();
        setArticles(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [token]);

  // Handle input changes for profile fields
  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle profile update
  const handleUpdateProfile = async () => {
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
          email: profileData.email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const updatedUser = await response.json();
      updateUser(updatedUser); // Update the user in the context
      setSuccessMessage('Profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    }
  };

  // Handle password change
  const handleChangePassword = async () => {
    setError(null);
    setSuccessMessage(null);

    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All password fields are required.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.');
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
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout(); // Clear the token and user data
    navigate('/'); // Redirect to the login page
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <header className="bg-slate-800/50 border-b border-slate-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-blue-100">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-blue-100 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-100/50" size={20} />
              </div>
              <button className="p-2 text-blue-100/70 hover:text-blue-100 relative">
                <Bell size={24} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex space-x-6">
          {/* Sidebar Navigation */}
          <nav className="w-64 space-y-2">
            {[
              { id: 'articles', icon: Newspaper, label: 'Articles' },
              { id: 'maps', icon: Map, label: 'Maps' },
              { id: 'users', icon: Users, label: 'Users' },
              { id: 'messages', icon: MessageSquare, label: 'Messages' },
              { id: 'profile', icon: User, label: 'Profile' },
              { id: 'security', icon: Lock, label: 'Security' },
              { id: 'settings', icon: Settings, label: 'Settings' },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === id
                    ? 'bg-blue-500 text-white'
                    : 'text-blue-100/70 hover:bg-slate-800/50'
                }`}
              >
                <Icon size={20} />
                <span>{label}</span>
              </button>
            ))}
          </nav>

          {/* Main Content Area */}
          <div className="flex-1 bg-slate-800/30 rounded-lg p-6">
            {/* Articles Management */}
            {activeTab === 'articles' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-blue-100">Articles Management</h2>
                  <button
                    onClick={() => navigate('/new-article')}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <PlusCircle size={20} />
                    <span>New Article</span>
                  </button>
                </div>
                <div className="space-y-4">
                  {articles.map(article => (
                    <div 
                      key={article.id} 
                      className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700 hover:bg-slate-900/70 transition-colors cursor-pointer"
                      onClick={() => navigate(`/article/${article.id}`)}
                    >
                      <div>
                        <h3 className="font-medium text-blue-100">{article.title}</h3>
                        <p className="text-sm text-blue-100/60">By {article.author?.username || 'Admin'}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          className="p-2 text-blue-400 hover:bg-blue-400/10 rounded"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent navigation when clicking the edit button
                            navigate(`/edit-article/${article.id}`);
                          }}
                        >
                          <Edit3 size={20} />
                        </button>
                        <button 
                          className="p-2 text-red-400 hover:bg-red-400/10 rounded"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent navigation when clicking the delete button
                            // Add delete functionality here
                          }}
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Profile Tab Content */}
            {activeTab === 'profile' && (
              <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                <h2 className="text-xl font-semibold text-blue-100 mb-6">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-blue-100/80 mb-2">Full Name</label>
                    <input
                      value={profileData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-blue-100 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-100/80 mb-2">Username</label>
                    <input
                      value={profileData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-blue-100 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-blue-100/80 mb-2">Email</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-blue-100 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
                    />
                  </div>
                </div>
                <button
                  onClick={handleUpdateProfile}
                  className="mt-6 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg transition-all duration-200"
                >
                  Save Changes
                </button>
              </div>
            )}

            {/* Security Tab Content */}
            {activeTab === 'security' && (
              <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                <h2 className="text-xl font-semibold text-blue-100 mb-6">Security Settings</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-blue-100/80 mb-2">Current Password</label>
                    <div className="relative">
                      <input
                        type={passwordVisible ? 'text' : 'password'}
                        id="currentPassword"
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-blue-100 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
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
                    <label className="block text-sm font-medium text-blue-100/80 mb-2">New Password</label>
                    <div className="relative">
                      <input
                        type={passwordVisible ? 'text' : 'password'}
                        id="newPassword"
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-blue-100 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
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
                    <label className="block text-sm font-medium text-blue-100/80 mb-2">Confirm Password</label>
                    <div className="relative">
                      <input
                        type={passwordVisible ? 'text' : 'password'}
                        id="confirmPassword"
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-blue-100 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
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
                    className="mt-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg transition-all duration-200"
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
  );
};

export default AdminDashboard;