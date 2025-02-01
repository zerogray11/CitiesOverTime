import React from "react";

const PostsFeed = ({ selectedTopic }) => {
  // Example posts data
  const posts = [
    { id: 1, topic: "Technology", content: "This is a post about AI advancements." },
    { id: 2, topic: "Design", content: "Discussing the latest trends in UI/UX design." },
    { id: 3, topic: "Sustainability", content: "How cities are adopting green energy." },
  ];

  // Filter posts by selected topic
  const filteredPosts = selectedTopic
    ? posts.filter((post) => post.topic === selectedTopic)
    : posts;

  return (
    <div>
      {filteredPosts.map((post) => (
        <div
          key={post.id}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30 mb-6"
        >
          <h2 className="text-2xl font-bold text-white mb-4">{post.topic}</h2>
          <p className="text-white/80">{post.content}</p>
        </div>
      ))}
    </div>
  );
};

export default PostsFeed;