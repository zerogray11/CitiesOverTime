import React, { useState } from 'react';
import { User, Lock, Bookmark, Settings } from 'lucide-react';

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    username: 'johndoe',
    password: '********'
  });

  const [favoriteArticles] = useState([
    { id: 1, title: 'Future of Urban Planning', category: 'Urban Development' },
    { id: 2, title: 'Smart Cities Initiative', category: 'Technology' },
    { id: 3, title: 'Sustainable Architecture', category: 'Environment' }
  ]);

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
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
                  { id: 'settings', icon: Settings }
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
                  <button className="mt-6 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg transition-all duration-200">
                    Save Changes
                  </button>
                </div>
              )}

              {/* Security Tab Content */}
              {activeTab === 'security' && (
                <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                  <h2 className="text-xl font-semibold text-blue-100 mb-6">Security Settings</h2>
                  <div className="space-y-6">
                    {['Current Password', 'New Password', 'Confirm Password'].map((label) => (
                      <div key={label}>
                        <label className="block text-sm font-medium text-blue-100/80 mb-2">{label}</label>
                        <input
                          type="password"
                          className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-blue-100 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
                        />
                      </div>
                    ))}
                    <button className="mt-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg transition-all duration-200">
                      Update Password
                    </button>
                  </div>
                </div>
              )}

              {/* Articles Tab Content */}
              {activeTab === 'articles' && (
                <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                  <h2 className="text-xl font-semibold text-blue-100 mb-6">Favorite Articles</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {favoriteArticles.map(article => (
                      <div
                        key={article.id}
                        className="p-4 rounded-lg border border-slate-700 bg-slate-900/30 hover:bg-slate-900/50 transition-colors"
                      >
                        <h3 className="font-medium text-blue-100">{article.title}</h3>
                        <p className="text-sm text-blue-100/60 mt-1">{article.category}</p>
                        <button className="mt-3 px-4 py-1 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded transition-colors">
                          Read Article
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Settings Tab Content */}
              {activeTab === 'settings' && (
                <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                  <h2 className="text-xl font-semibold text-blue-100 mb-6">Account Settings</h2>
                  <div className="space-y-4">
                    {[
                      {
                        title: 'Email Notifications',
                        description: 'Receive updates about new articles'
                      },
                      {
                        title: 'Privacy Settings',
                        description: 'Manage your profile visibility'
                      }
                    ].map((setting) => (
                      <div
                        key={setting.title}
                        className="flex items-center justify-between p-4 border border-slate-700 rounded-lg bg-slate-900/30 hover:bg-slate-900/50 transition-colors"
                      >
                        <div>
                          <h3 className="font-medium text-blue-100">{setting.title}</h3>
                          <p className="text-sm text-blue-100/60">{setting.description}</p>
                        </div>
                        <button className="px-4 py-2 border border-blue-400/30 text-blue-400 rounded-lg hover:bg-blue-400/10 transition-colors">
                          Configure
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;