import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { benefits as staticBenefits } from '../constants';
import Heading from './Heading';
import Section from './Section';
import Arrow from '../assets/svg/Arrow';
import { GradientLight } from './design/Benefits';
import ClipPath from '../assets/svg/ClipPath';
import { benefitIcon1 } from "../assets"; // Import benefitIcon1

const Benefits = () => {
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/articles`);
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }
        const data = await response.json();
        console.log(data); // Log the fetched articles
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
              className="block relative p-0.5 bg-no-repeat bg-[length:100%_100%] md:max-w-[24rem]"
              style={{
                backgroundImage: `url(${article.backgroundUrl || './src/assets/benefits/card-1.svg'})`,
              }}
              key={article.id}
              onClick={() => navigate(`/article/${article.id}`)} // Add onClick handler
            >
              <div className="relative z-2 flex flex-col min-h-[22rem] p-[2.4rem] pointer-events-none">
                <h5 className="h5 mb-5">{article.title}</h5>
                <p className="body-2 mb-6 text-n-3">{article.content.substring(0, 100)}...</p>
                <div className="flex items-center mt-auto">
                  <img
                    src={article.iconUrl || benefitIcon1}
                    width={48}
                    height={48}
                    alt={article.title}
                  />
                  <p className="ml-auto font-code text-xs font-bold text-n-1 uppercase tracking-wider">
                    Explore more
                  </p>
                  <Arrow />
                </div>
              </div>

              {article.light && <GradientLight />}

              <div
                className="absolute inset-0.5 bg-n-8"
                style={{ clipPath: 'url(#benefits)' }}
              >
                <div className="absolute inset-0 opacity-0 transition-opacity hover:opacity-10">
                  {article.imageUrl && (
                    <img
                      src={article.imageUrl}
                      width={380}
                      height={362}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>

              <ClipPath />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default Benefits;