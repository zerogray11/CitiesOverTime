import React, { useContext } from "react";
import { ThemeContext } from "./ThemeContext";
import { background, curve, robot } from "../assets";
import Button from "./Button";
import Section from "./Section";
import { BackgroundCircles, BottomLine, Gradient } from "./design/Hero";
import { heroIcons } from "../constants";
import { ScrollParallax } from "react-just-parallax";
import { useRef } from "react";
import Generating from "./Generating";
import Notification from "./Notification";
import CompanyLogos from "./CompanyLogos";
import { Link } from "react-router-dom";
import { Map, Building, Compass } from "lucide-react";

const DarkModeBackground = () => (
  <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 1800" className="w-full h-full absolute top-0 left-0 object-cover min-h-screen">
      <defs>
        <linearGradient id="darkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a1a2e" />
          <stop offset="50%" stopColor="#16213e" />
          <stop offset="100%" stopColor="#212f45" />
        </linearGradient>
        <radialGradient id="darkAccent" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="#4a3f75" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#2a2a4a" stopOpacity="0" />
        </radialGradient>
        <filter id="darkGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="20" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      <rect width="100%" height="100%" fill="url(#darkGradient)" />
      <path d="M1440,400 C1200,450 900,300 600,450 C300,600 0,500 0,400 L0,0 L1440,0 Z" 
        fill="url(#darkAccent)" opacity="0.3" />
      <circle cx="700" cy="300" r="300" fill="#4a3f75" opacity="0.2" filter="url(#darkGlow)" />
      <circle cx="1100" cy="200" r="200" fill="#3a506b" opacity="0.15" filter="url(#darkGlow)" />
      <path d="M0,800 C300,750 600,850 900,750 C1200,650 1440,750 1440,800 L1440,1800 L0,1800 Z"
        fill="#2a2a4a" opacity="0.2" />
    </svg>
  </div>
);

const LightModeBackground = () => (
  <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 1800" className="w-full h-full absolute top-0 left-0 object-cover min-h-screen">
      <defs>
        <linearGradient id="lightGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e8ebff" /> {/* Soft metallic blue */}
          <stop offset="50%" stopColor="#e0e3ff" /> {/* Slightly purple tint */}
          <stop offset="100%" stopColor="#d5d9ff" /> {/* Deeper metallic */}
        </linearGradient>
        <radialGradient id="lightAccent" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="#9d97d8" stopOpacity="0.3" /> {/* Metallic purple */}
          <stop offset="100%" stopColor="#d5d9ff" stopOpacity="0" />
        </radialGradient>
        <filter id="lightGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="15" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="textEnhance" x="-20%" y="-20%" width="140%" height="140%">
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" />
        </filter>
      </defs>
      
      <rect width="100%" height="100%" fill="url(#lightGradient)" filter="url(#textEnhance)" />
      <path d="M1440,400 C1200,450 900,300 600,450 C300,600 0,500 0,400 L0,0 L1440,0 Z" 
        fill="url(#lightAccent)" opacity="0.25" />
      <circle cx="700" cy="300" r="300" fill="#b3aae8" opacity="0.15" filter="url(#lightGlow)" />
      <circle cx="1100" cy="200" r="200" fill="#a2aae5" opacity="0.15" filter="url(#lightGlow)" />
      <path d="M0,800 C300,750 600,850 900,750 C1200,650 1440,750 1440,800 L1440,1800 L0,1800 Z"
        fill="#ccd0ff" opacity="0.15" />
    </svg>
  </div>
);

const Hero = () => {
  const parallaxRef = useRef(null);
  const { theme } = useContext(ThemeContext);
  
  return (
    <Section
      className="pt-[12rem] -mt-[5.25rem] min-h-screen relative"
      crosses
      crossesOffset="lg:translate-y-[5.25rem]"
      customPaddings
      id="hero"
    >
      {/* Full-screen background that stays fixed regardless of content or screen size */}
      {theme === "dark" ? <DarkModeBackground /> : <LightModeBackground />}
      
      <div className="container relative z-10" ref={parallaxRef}>
        <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[3.875rem] md:mb-20 lg:mb-[6.25rem]">
          <div className="flex items-center justify-center mb-6">
            <div className="hidden md:block h-[2px] w-16 bg-gradient-to-r from-purple-500 to-transparent"></div>
            <div className="flex items-center mx-4">
              <Building className={`w-6 h-6 mr-2 ${theme === 'dark' ? 'text-purple-500' : 'text-purple-700'}`} />
              <span className={`text-sm uppercase tracking-widest ${theme === 'dark' ? 'text-purple-500' : 'text-purple-700'}`}>
                Urban Explorer
              </span>
            </div>
            <div className="hidden md:block h-[2px] w-16 bg-gradient-to-l from-purple-500 to-transparent"></div>
          </div>
          
          <h1 className={`h1 mb-6 relative ${theme === 'dark' ? 'text-n-1' : 'text-n-9'}`}>
            <span className="block mb-2 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
              Discover Cities
            </span>
            <span className="relative inline-block">
              You Want To 
              <span className="relative font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
                Live in The Future
              </span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 10C50 5 100 2 150 2C200 2 250 5 298 10" stroke="url(#underlineGradient)" strokeWidth="3" fill="none" strokeLinecap="round" />
                <defs>
                  <linearGradient id="underlineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8344AD" />
                    <stop offset="100%" stopColor="#4055A8" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h1>
          
          <p className={`body-1 max-w-3xl mx-auto mb-6 ${theme === 'dark' ? 'text-n-2' : 'text-n-7'} lg:mb-8 flex items-center justify-center`}>
            <Compass className={`w-4 h-4 mr-2 ${theme === 'dark' ? 'text-purple-500' : 'text-purple-700'}`} />
            For The City Nerds Who Explore Beyond Maps
            <Map className={`w-4 h-4 ml-2 ${theme === 'dark' ? 'text-purple-500' : 'text-purple-700'}`} />
          </p>
          
          <Link to="/map-page">
            <Button white className={`${theme === 'dark' ? 
              'bg-gradient-to-r from-blue-700 to-purple-700 hover:from-purple-700 hover:to-blue-700' : 
              'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600'} 
              transition-all duration-300`}>
              <span className="flex items-center">
                <Map className="w-4 h-4 mr-2" />
                Launch Interactive Maps
              </span>
            </Button>
          </Link>
        </div>
        
        <div className="relative max-w-[23rem] mx-auto md:max-w-5xl xl:mb-24">
          <div className="relative z-1 p-0.5 rounded-2xl bg-conic-gradient">
            <div className={`relative ${theme === 'dark' ? 'bg-n-8' : 'bg-n-1'} rounded-[1rem]`}>
              <div className={`h-[1.4rem] ${theme === 'dark' ? 'bg-n-5' : 'bg-n-3'} rounded-t-[0.9rem] flex items-center px-4`}>
                <div className="flex space-x-1.5">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className={`mx-auto text-xs ${theme === 'dark' ? 'text-n-3' : 'text-n-6'}`}>
                  https://citiesovertime.vercel.app/
                </div>
              </div>
              
              <Link to="/article-page">
                <div className="aspect-[33/40] rounded-b-[0.9rem] overflow-hidden md:aspect-[688/490] lg:aspect-[1024/490]">
                  <img
                    src={background}
                    className="w-full h-full object-cover"
                    width={1024}
                    height={490}
                    alt="AI"
                  />
                  
                  <Generating className="absolute left-4 right-4 bottom-5 md:left-1/2 md:right-auto md:bottom-8 md:w-[31rem] md:-translate-x-1/2" />
                  
                  <ScrollParallax isAbsolutelyPositioned>
                    <ul className={`hidden absolute -left-[5.5rem] bottom-[7.5rem] px-1 py-1 ${theme === 'dark' ? 'bg-n-9/40' : 'bg-n-1/80'} backdrop-blur border ${theme === 'dark' ? 'border-n-1/10' : 'border-n-7/20'} rounded-2xl xl:flex`}>
                      {heroIcons.map((icon, index) => (
                        <li className="p-5" key={index}>
                          <img src={icon} width={24} height={25} alt={icon} />
                        </li>
                      ))}
                    </ul>
                  </ScrollParallax>
                  
                  <ScrollParallax isAbsolutelyPositioned>
                    <Notification
                      className="hidden absolute -right-[5.5rem] bottom-[11rem] w-[18rem] xl:flex"
                      title="Urban Analytics"
                    />
                  </ScrollParallax>
                </div>
              </Link>
            </div>
            <Gradient />
          </div>
        </div>
      </div>
      <BottomLine />
    </Section>
  );
};

export default Hero;