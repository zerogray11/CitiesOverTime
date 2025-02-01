import React from "react";

const PostDialog = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-8">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/30 w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-white mb-6">Create a New Post</h2>
        <textarea
          className="w-full bg-transparent text-white placeholder-white/50 border border-purple-500/30 rounded-lg p-4 mb-6"
          rows="5"
          placeholder="What's on your mind?"
        />
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
          >
            Cancel
          </button>
          <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all">
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostDialog;