import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Heading from './Heading';
import Section from './Section';
import ClipPath from '../assets/svg/ClipPath';
import { ArrowUpRight, ChevronRight, MapPin } from 'lucide-react';

const Benefits = () => {
  const [articles, setArticles] = useState([]);
  const [hoveredArticle, setHoveredArticle] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/articles`);
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }
        const data = await response.json();
        console.log(data);
        setArticles(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchArticles();
  }, []);

  return (
    <Section id="features">
      <div className="container relative z-2">
        <Heading />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
          {articles.map((article) => (
            <div
              className="relative group overflow-hidden rounded-lg transition-all duration-300 cursor-pointer"
              key={article.id}
              onClick={() => navigate(`/article/${article.id}`)}
              onMouseEnter={() => setHoveredArticle(article.id)}
              onMouseLeave={() => setHoveredArticle(null)}
            >
              {/* City Grid Backdrop */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-purple-900 opacity-90">
                <svg className="w-full h-full opacity-20" viewBox="0 0 100 100">
                  <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
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
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-700"
                  />
                )}
              </div>

              {/* Glowing Border Effect */}
              <div className={`absolute inset-0 border-2 border-transparent transition-colors duration-300 ${hoveredArticle === article.id ? 'border-indigo-400' : ''}`}>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700/20 to-purple-700/20"></div>
              </div>

              {/* Content Container */}
              <div className="relative z-10 flex flex-col min-h-[22rem] p-6">
                {/* Location Indicator - Top Right */}
                <div className="self-end flex items-center mb-2">
                  <MapPin size={16} className="text-indigo-300 mr-1" />
                  <span className="text-xs text-indigo-300 font-mono uppercase tracking-wider">
                    {article.location || 'Urban Studies'}
                  </span>
                </div>

                {/* Title with Growing Line Underneath */}
                <div className="mt-auto">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors duration-300">
                    {article.title}
                  </h3>
                  <div className="h-0.5 w-16 bg-purple-500 group-hover:w-full transition-all duration-500 mb-4"></div>
                  
                  {/* Excerpt - Appears on Hover */}
                  <div className="overflow-hidden h-0 group-hover:h-16 transition-all duration-500">
                    <p className="text-sm text-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                      {article.content.substring(0, 100)}...
                    </p>
                  </div>
                  
                  {/* Read More Row */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center">
                      <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider mr-2">Explore</span>
                      <ArrowUpRight size={16} className="text-indigo-300 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                    </div>
                    
                    <div className="h-8 w-8 rounded-full bg-indigo-700/50 flex items-center justify-center transform translate-x-2 group-hover:translate-x-0 transition-transform duration-300">
                      <ChevronRight size={16} className="text-white" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative Element - Bottom Left Corner */}
              <div className="absolute bottom-0 left-0 w-12 h-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="0" cy="100" r="40" fill="rgba(79, 70, 229, 0.2)" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default Benefits;