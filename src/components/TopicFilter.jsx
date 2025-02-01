import React from "react";

const TopicFilter = ({ onSelectTopic }) => {
  const topics = ["Technology", "Design", "Sustainability", "AI", "Urban Planning"];

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30">
      <h3 className="text-xl font-bold text-white mb-4">Filter by Topic</h3>
      <div className="space-y-2">
        {topics.map((topic) => (
          <button
            key={topic}
            onClick={() => onSelectTopic(topic)}
            className="w-full text-left px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/80 transition-all"
          >
            {topic}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TopicFilter;