import React, { useState } from "react";
import PostDialog from "../components/PostDialog";
import Chat from "../components/Chat";
import TopicFilter from "../components/TopicFilter";
import UserSearch from "../components/UserSearch";
import PostsFeed from "../components/PostsFeed"; // New component for displaying posts

const SocialMediaPage = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const handleCreatePost = () => {
    setDialogOpen(true);
  };

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950/20 to-blue-900/20 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-6xl bg-white/10 backdrop-blur-lg rounded-3xl border border-purple-500/30 shadow-2xl overflow-hidden p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">
            City Conversations
          </h1>
          <button
            onClick={handleCreatePost}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
          >
            Create Post
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Topic Filter */}
          <div className="col-span-1">
            <TopicFilter onSelectTopic={handleTopicSelect} />
          </div>
          <div className="col-span-2 space-y-6">
            {/* Example Post */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30">
              <h2 className="text-2xl font-bold text-white mb-4">Share your inner city thoughts!</h2>
              <p className="text-white/80">
               
              </p>
            </div>
          </div>
         
        </div>

        {/* Chat and User Search */}
        <div className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="col-span-1">
              <UserSearch onSelectUser={handleUserSelect} />
            </div>
            <div className="col-span-2">
              <Chat selectedUser={selectedUser} selectedTopic={selectedTopic} />
            </div>
          </div>
        </div>
      </div>

      {/* Dialog for Creating Posts */}
      {isDialogOpen && <PostDialog onClose={() => setDialogOpen(false)} />}
    </div>
  );
};

export default SocialMediaPage;