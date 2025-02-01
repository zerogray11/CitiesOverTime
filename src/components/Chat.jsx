import React from "react";

const Chat = ({ selectedUser, selectedTopic }) => {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30">
      <h3 className="text-xl font-bold text-white mb-4">
        Chat with {selectedUser || "Select a User"} about {selectedTopic || "a Topic"}
      </h3>
      <div className="h-64 overflow-y-auto mb-4">
        {/* Chat messages go here */}
      </div>
      <input
        type="text"
        placeholder="Type a message..."
        className="w-full bg-transparent text-white placeholder-white/50 border border-purple-500/30 rounded-lg p-2"
      />
    </div>
  );
};

export default Chat;