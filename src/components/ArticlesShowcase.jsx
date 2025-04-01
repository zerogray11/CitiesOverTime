import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Heading from './Heading';
import Section from './Section';
import Arrow from '../assets/svg/Arrow';
import { GradientLight } from './design/Benefits';
import ClipPath from '../assets/svg/ClipPath';
import { benefitIcon1 } from "../assets";

const ArticlesShowcase = () => {
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/articles`);
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }
        const data = await response.json();
        setArticles(data);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message);
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
    <Section className="relative overflow-hidden py-16">
      <div className="container mx-auto">
        <Heading
          className="text-center mb-12"
          title="Featured Articles"
         
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <div 
              key={article.id} 
              className="relative bg-n-8 rounded-2xl p-6 h-full flex flex-col overflow-hidden group cursor-pointer"
              onClick={() => handleArticleClick(article.id)}
            >
              {article.light && (
                <GradientLight className="absolute top-0 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              )}
              
              {article.imageUrl && (
                <div className="mb-6 rounded-xl overflow-hidden h-48">
                  <img 
                    src={article.imageUrl} 
                    alt={article.title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              
              {!article.imageUrl && (
                <div className="mb-6">
                  <div className="w-12 h-12 flex items-center justify-center bg-n-6 rounded-xl">
                    <img src={benefitIcon1} alt="Icon" className="w-6 h-6" />
                  </div>
                </div>
              )}

              <h3 className="text-lg font-bold mb-3 text-white group-hover:text-color-1 transition-colors duration-300">
                {article.title}
              </h3>
              
              <p className="text-n-3 mb-6 flex-grow">
                {article.content.substring(0, 100)}...
              </p>
              
              <div className="flex items-center mt-auto">
                <span className="font-bold mr-2 text-color-1">Explore more</span>
                <Arrow />
              </div>

              <ClipPath />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default ArticlesShowcase;