import React, { useState } from "react";

const UserSearch = ({ onSelectUser }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const users = ["Farhat", "Taina", "Eva", "Britney"];

  const filteredUsers = users.filter((user) =>
    user.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30">
      <h3 className="text-xl font-bold text-white mb-4">Search Users</h3>
      <input
        type="text"
        placeholder="Search for a user..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full bg-transparent text-white placeholder-white/50 border border-purple-500/30 rounded-lg p-2 mb-4"
      />
      <div className="space-y-2">
        {filteredUsers.map((user) => (
          <button
            key={user}
            onClick={() => onSelectUser(user)}
            className="w-full text-left px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/80 transition-all"
          >
            {user}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserSearch;