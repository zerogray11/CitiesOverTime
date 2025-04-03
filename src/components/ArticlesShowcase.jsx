import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Heading from './Heading';
import Section from './Section';
import { ArrowUpRight, ChevronRight, MapPin } from 'lucide-react';
import { ThemeContext } from './ThemeContext';
import { useContext } from 'react';

const ArticlesShowcase = ({ requireAuth = false }) => {
  const [articles, setArticles] = useState([]);
  const [hoveredArticle, setHoveredArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/articles`);
        if (!response.ok) throw new Error('Failed to fetch articles');
        const data = await response.json();
        setArticles(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleArticleClick = (articleId) => {
    navigate(`/article/${articleId}`);
  };

  if (isLoading) {
    return (
      <Section className="py-16">
        <div className="container mx-auto text-center">
          <p>Loading articles...</p>
        </div>
      </Section>
    );
  }

  if (error) {
    return (
      <Section className="py-16">
        <div className="container mx-auto text-center">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </Section>
    );
  }

  return (
    <Section id="articles" className="relative z-2">
      <div className="container">
        <Heading 
          className="text-center mb-12" 
          title="Featured Articles"
          text="Explore our latest urban insights and research"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
          {articles.map((article) => (
            <div
              className={`relative group overflow-hidden rounded-xl transition-all duration-300 cursor-pointer ${
                theme === 'dark' ? 'shadow-lg' : 'shadow-md'
              }`}
              key={article.id}
              onClick={() => handleArticleClick(article.id)}
              onMouseEnter={() => setHoveredArticle(article.id)}
              onMouseLeave={() => setHoveredArticle(null)}
            >
              {/* Dynamic Background */}
              <div className={`absolute inset-0 ${
                theme === 'dark' 
                  ? 'bg-gradient-to-br from-indigo-900 to-purple-900' 
                  : 'bg-gradient-to-br from-blue-50 to-purple-50'
              } opacity-90`}>
                <svg className="w-full h-full opacity-20" viewBox="0 0 100 100">
                  <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path 
                      d="M 10 0 L 0 0 0 10" 
                      fill="none" 
                      stroke={theme === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(79, 70, 229, 0.2)'} 
                      strokeWidth="0.5" 
                    />
                  </pattern>
                  <rect width="100" height="100" fill="url(#grid)" />
                </svg>
              </div>

              {/* Article Image */}
              <div className="absolute inset-0 transition-transform duration-700 ease-in-out group-hover:scale-110">
                {article.imageUrl && (
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className={`w-full h-full object-cover ${
                      theme === 'dark' 
                        ? 'opacity-60 group-hover:opacity-40' 
                        : 'opacity-40 group-hover:opacity-30'
                    } transition-opacity duration-700`}
                  />
                )}
              </div>

              {/* Glowing Border Effect */}
              <div className={`absolute inset-0 border-2 border-transparent transition-all duration-300 ${
                hoveredArticle === article.id 
                  ? theme === 'dark' 
                    ? 'border-indigo-400' 
                    : 'border-purple-400'
                  : ''
              }`}>
                <div className={`absolute inset-0 ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-r from-blue-700/20 to-purple-700/20' 
                    : 'bg-gradient-to-r from-blue-200/20 to-purple-200/20'
                }`}></div>
              </div>

              {/* Content Container */}
              <div className="relative z-10 flex flex-col min-h-[22rem] p-6">
                {/* Location Indicator - Top Right */}
                <div className="self-end flex items-center mb-2">
                  <MapPin size={16} className={theme === 'dark' ? 'text-indigo-300' : 'text-purple-600'} />
                  <span className={`text-xs ${
                    theme === 'dark' ? 'text-indigo-300' : 'text-purple-700'
                  } font-mono uppercase tracking-wider`}>
                    {article.location || 'Urban Studies'}
                  </span>
                </div>

                {/* Title with Growing Line Underneath */}
                <div className="mt-auto">
                  <h3 className={`text-xl md:text-2xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-n-9'
                  } mb-3 group-hover:${
                    theme === 'dark' ? 'text-indigo-300' : 'text-purple-600'
                  } transition-colors duration-300`}>
                    {article.title}
                  </h3>
                  <div className={`h-0.5 w-16 ${
                    theme === 'dark' ? 'bg-purple-500' : 'bg-purple-400'
                  } group-hover:w-full transition-all duration-500 mb-4`}></div>
                  
                  {/* Excerpt - Appears on Hover */}
                  <div className="overflow-hidden h-0 group-hover:h-16 transition-all duration-500">
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-indigo-100' : 'text-n-7'
                    } opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200`}>
                      {article.content.substring(0, 100)}...
                    </p>
                  </div>
                  
                  {/* Read More Row */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center">
                      <span className={`text-xs font-bold ${
                        theme === 'dark' ? 'text-indigo-300' : 'text-purple-600'
                      } uppercase tracking-wider mr-2`}>
                        Explore
                      </span>
                      <ArrowUpRight size={16} className={theme === 'dark' ? 'text-indigo-300' : 'text-purple-600'} />
                    </div>
                    
                    <div className={`h-8 w-8 rounded-full ${
                      theme === 'dark' ? 'bg-indigo-700/50' : 'bg-purple-200'
                    } flex items-center justify-center transform translate-x-2 group-hover:translate-x-0 transition-transform duration-300`}>
                      <ChevronRight size={16} className={theme === 'dark' ? 'text-white' : 'text-purple-700'} />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative Element - Bottom Left Corner */}
              <div className="absolute bottom-0 left-0 w-12 h-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle 
                    cx="0" 
                    cy="100" 
                    r="40" 
                    fill={theme === 'dark' ? 'rgba(79, 70, 229, 0.2)' : 'rgba(167, 139, 250, 0.2)'} 
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default ArticlesShowcase;