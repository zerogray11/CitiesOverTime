import React, { useState } from "react";
import { Layers, MessageCircle, Users, Filter, Search, Plus, TrendingUp, MapPin } from "lucide-react";

const SocialMediaPage = () => {
  const [activeTab, setActiveTab] = useState("feed");
  const [isCreatePostOpen, setCreatePostOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Sample data for demonstration
  const topics = [
    "Public Transit", "Green Spaces", "Housing", "Infrastructure", 
    "Urban Planning", "Street Design", "Community Spaces", "Sustainability"
  ];

  const samplePosts = [
    {
      id: 1,
      author: "Jane Urbanist",
      avatar: "/api/placeholder/40/40",
      topic: "Public Transit",
      title: "Reimagining Bus Rapid Transit Systems",
      content: "After studying various BRT implementations around the world, I've found that dedicated lanes with physical separation yield 30% faster travel times compared to paint-only lanes. Here's my proposal for our city's main corridors...",
      likes: 128,
      comments: 45,
      location: "Portland, OR",
      timeAgo: "2 hours ago"
    },
    {
      id: 2,
      author: "Michael Cityplanner",
      avatar: "/api/placeholder/40/40",
      topic: "Green Spaces",
      title: "Pocket Parks: Maximum Impact in Minimal Space",
      content: "Even 500 sq ft can transform a neighborhood! I've mapped 12 potential locations in our downtown core where underutilized spaces could become vibrant community pocket parks with minimal investment...",
      likes: 94,
      comments: 32,
      location: "Barcelona, Spain",
      timeAgo: "5 hours ago"
    },
    {
      id: 3,
      author: "Sarah Architect",
      avatar: "/api/placeholder/40/40",
      topic: "Housing",
      title: "Missing Middle Housing: Bridging the Urban Density Gap",
      content: "Recent zoning reforms in Minneapolis show promising results for increasing housing supply without dramatically changing neighborhood character. Duplexes and fourplexes that match existing aesthetic guidelines have seen 80% approval rates from community boards...",
      likes: 156,
      comments: 67,
      location: "Minneapolis, MN",
      timeAgo: "Yesterday"
    }
  ];

  const sampleUsers = [
    { id: 1, name: "Jane Urbanist", role: "Urban Planner", avatar: "/api/placeholder/48/48", status: "online" },
    { id: 2, name: "Michael Cityplanner", role: "Architect", avatar: "/api/placeholder/48/48", status: "offline" },
    { id: 3, name: "Sarah Architect", role: "Public Transit Advocate", avatar: "/api/placeholder/48/48", status: "online" },
    { id: 4, name: "Alex Engineer", role: "Civil Engineer", avatar: "/api/placeholder/48/48", status: "away" }
  ];

  const filteredPosts = samplePosts.filter(post => 
    (selectedTopic === "All" || post.topic === selectedTopic) &&
    (post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
     post.author.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const Post = ({ post }) => (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/50 transition-all">
      <div className="flex items-center mb-4">
        <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full mr-3" />
        <div>
          <h3 className="font-medium text-white">{post.author}</h3>
          <div className="flex items-center text-purple-300 text-sm">
            <MapPin size={12} className="mr-1" />
            <span>{post.location} • {post.timeAgo}</span>
          </div>
        </div>
        <span className="ml-auto px-3 py-1 bg-purple-900/40 text-purple-300 text-xs rounded-full">
          {post.topic}
        </span>
      </div>
      <h2 className="text-xl font-bold text-white mb-2">{post.title}</h2>
      <p className="text-white/80 mb-4">{post.content}</p>
      <div className="flex items-center justify-between text-purple-300 text-sm">
        <div className="flex space-x-4">
          <button className="flex items-center hover:text-purple-100 transition-colors">
            <TrendingUp size={16} className="mr-1" />
            <span>{post.likes} upvotes</span>
          </button>
          <button className="flex items-center hover:text-purple-100 transition-colors">
            <MessageCircle size={16} className="mr-1" />
            <span>{post.comments} comments</span>
          </button>
        </div>
        <button className="text-purple-400 hover:text-purple-200 transition-colors">
          Share
        </button>
      </div>
    </div>
  );

  const CreatePostForm = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-purple-950 to-blue-900 rounded-2xl p-6 w-full max-w-2xl border border-purple-500/30">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Share Your Urban Vision</h2>
          <button 
            onClick={() => setCreatePostOpen(false)}
            className="text-purple-300 hover:text-white"
          >
            Close
          </button>
        </div>
        
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            className="w-full p-3 bg-purple-900/40 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          
          <select className="w-full p-3 bg-purple-900/40 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500">
            <option value="">Select a Topic</option>
            {topics.map(topic => (
              <option key={topic} value={topic}>{topic}</option>
            ))}
          </select>
          
          <textarea
            placeholder="Share your ideas for better cities..."
            rows={6}
            className="w-full p-3 bg-purple-900/40 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          
          <div className="flex items-center space-x-2">
            <MapPin size={16} className="text-purple-300" />
            <input
              type="text"
              placeholder="Add location (optional)"
              className="w-full p-2 bg-purple-900/40 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg hover:from-purple-700 hover:to-blue-600 transition-all"
            >
              Publish Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const ChatInterface = () => (
    <div className="bg-white/5 backdrop-blur-md rounded-xl border border-purple-500/20 overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b border-purple-500/20 flex justify-between items-center">
        <div className="flex items-center">
          <img src="/api/placeholder/40/40" alt="Chat User" className="w-10 h-10 rounded-full mr-3" />
          <div>
            <h3 className="font-medium text-white">Urban Design Group</h3>
            <p className="text-purple-300 text-sm">8 members, 3 online</p>
          </div>
        </div>
        <button className="text-purple-300 hover:text-white">
          <Users size={20} />
        </button>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {/* Sample messages */}
        <div className="flex items-start">
          <img src="/api/placeholder/32/32" alt="User" className="w-8 h-8 rounded-full mr-2" />
          <div className="bg-purple-900/40 rounded-lg rounded-tl-none p-3 max-w-xs">
            <p className="text-sm text-purple-200">Jane Urbanist</p>
            <p className="text-white">Has anyone implemented woonerf street designs in their city? Looking for case studies.</p>
            <span className="text-xs text-purple-300">10:42 AM</span>
          </div>
        </div>
        
        <div className="flex items-start justify-end">
          <div className="bg-blue-900/40 rounded-lg rounded-tr-none p-3 max-w-xs">
            <p className="text-white">Yes! We did this in our neighborhood in Rotterdam. I can share some before/after metrics.</p>
            <span className="text-xs text-blue-300">10:45 AM</span>
          </div>
          <img src="/api/placeholder/32/32" alt="User" className="w-8 h-8 rounded-full ml-2" />
        </div>
      </div>
      
      <div className="p-4 border-t border-purple-500/20">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 p-3 bg-white/5 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button className="ml-2 p-3 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg text-white">
            <MessageCircle size={20} />
          </button>
        </div>
      </div>
    </div>
  );

  const CommunityDirectory = () => (
    <div className="bg-white/5 backdrop-blur-md rounded-xl border border-purple-500/20 overflow-hidden h-full">
      <div className="p-4 border-b border-purple-500/20">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-3 text-purple-300" />
          <input
            type="text"
            placeholder="Find urban enthusiasts..."
            className="w-full pl-10 p-2 bg-white/5 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>
      
      <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
        {sampleUsers.map(user => (
          <div key={user.id} className="flex items-center p-2 hover:bg-white/5 rounded-lg cursor-pointer">
            <div className="relative">
              <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full" />
              <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${
                user.status === 'online' ? 'bg-green-500' : 
                user.status === 'away' ? 'bg-yellow-500' : 'bg-gray-500'
              } border-2 border-purple-950`}></span>
            </div>
            <div className="ml-3">
              <h3 className="font-medium text-white">{user.name}</h3>
              <p className="text-sm text-purple-300">{user.role}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-purple-500/20">
        <h3 className="font-medium text-white mb-2">Popular Groups</h3>
        <div className="space-y-2">
          <div className="flex items-center p-2 hover:bg-white/5 rounded-lg cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center text-white font-bold text-xs">
              UD
            </div>
            <span className="ml-2 text-white">Urban Designers</span>
            <span className="ml-auto text-xs text-purple-300">358 members</span>
          </div>
          <div className="flex items-center p-2 hover:bg-white/5 rounded-lg cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
              TP
            </div>
            <span className="ml-2 text-white">Transit Planners</span>
            <span className="ml-auto text-xs text-purple-300">217 members</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 to-blue-900 flex flex-col">
      {/* Header */}
      <header className="border-b border-purple-500/30 backdrop-blur-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Layers size={28} className="text-purple-400 mr-2" />
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              CityVision
            </h1>
          </div>
          
          <div className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-3 text-purple-300" />
              <input
                type="text"
                placeholder="Search ideas, topics, or people..."
                className="w-full pl-10 p-2 bg-white/5 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <nav>
            <button
              onClick={() => setCreatePostOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg hover:from-purple-700 hover:to-blue-600 transition-all flex items-center"
            >
              <Plus size={18} className="mr-1" />
              <span>New Post</span>
            </button>
          </nav>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab("feed")}
            className={`px-4 py-2 rounded-lg flex items-center ${
              activeTab === "feed" 
                ? "bg-white/10 text-white" 
                : "text-purple-300 hover:bg-white/5"
            }`}
          >
            <Layers size={18} className="mr-1" />
            <span>Ideas Feed</span>
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={`px-4 py-2 rounded-lg flex items-center ${
              activeTab === "chat" 
                ? "bg-white/10 text-white" 
                : "text-purple-300 hover:bg-white/5"
            }`}
          >
            <MessageCircle size={18} className="mr-1" />
            <span>Chat</span>
          </button>
          <button
            onClick={() => setActiveTab("people")}
            className={`px-4 py-2 rounded-lg flex items-center ${
              activeTab === "people" 
                ? "bg-white/10 text-white" 
                : "text-purple-300 hover:bg-white/5"
            }`}
          >
            <Users size={18} className="mr-1" />
            <span>Community</span>
          </button>
        </div>
        
        {activeTab === "feed" && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white/5 backdrop-blur-md rounded-xl border border-purple-500/20 p-4">
                <h2 className="text-lg font-medium text-white mb-4 flex items-center">
                  <Filter size={18} className="mr-2 text-purple-400" />
                  Topics
                </h2>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedTopic("All")}
                    className={`w-full text-left px-3 py-2 rounded-lg ${
                      selectedTopic === "All" 
                        ? "bg-purple-600/40 text-white" 
                        : "text-purple-300 hover:bg-white/5"
                    }`}
                  >
                    All Topics
                  </button>
                  {topics.map(topic => (
                    <button
                      key={topic}
                      onClick={() => setSelectedTopic(topic)}
                      className={`w-full text-left px-3 py-2 rounded-lg ${
                        selectedTopic === topic 
                          ? "bg-purple-600/40 text-white" 
                          : "text-purple-300 hover:bg-white/5"
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-3 space-y-6">
              {filteredPosts.length > 0 ? (
                filteredPosts.map(post => (
                  <Post key={post.id} post={post} />
                ))
              ) : (
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-purple-500/20 text-center">
                  <h3 className="text-xl font-bold text-white mb-2">No posts found</h3>
                  <p className="text-purple-300">Try different search terms or topics</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {activeTab === "chat" && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <CommunityDirectory />
            </div>
            <div className="lg:col-span-3">
              <ChatInterface />
            </div>
          </div>
        )}
        
        {activeTab === "people" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleUsers.map(user => (
              <div key={user.id} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-purple-500/20">
                <div className="flex items-center">
                  <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full mr-4" />
                  <div>
                    <h3 className="text-xl font-bold text-white">{user.name}</h3>
                    <p className="text-purple-300">{user.role}</p>
                  </div>
                </div>
                <div className="mt-4 flex">
                  <button className="flex-1 mr-2 px-3 py-2 bg-purple-600/40 text-white rounded-lg hover:bg-purple-600/60 transition-all">
                    Follow
                  </button>
                  <button className="flex-1 px-3 py-2 bg-white/5 text-purple-300 rounded-lg hover:bg-white/10 transition-all">
                    Message
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      
      {isCreatePostOpen && <CreatePostForm />}
    </div>
  );
};

export default SocialMediaPage;