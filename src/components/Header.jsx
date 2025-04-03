import { useLocation } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { Link } from "react-router-dom";
import { navigation } from "../constants";
import Button from "./Button";
import { useState, useContext, useEffect, useRef } from "react";
import FuturisticSearchBar from "./FuturisticSearchBar";
import { ThemeContext } from "../components/ThemeContext";
import { User, Shield, Sun, Moon, Search, X, Menu } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, role, loading } = useContext(AuthContext);
  const pathname = useLocation();
  const [openNavigation, setOpenNavigation] = useState(false);
  const [isHoveringLogo, setIsHoveringLogo] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef(null);

  const toggleNavigation = () => {
    if (openNavigation) {
      enablePageScroll();
    } else {
      disablePageScroll();
    }
    setOpenNavigation(!openNavigation);
  };

  const closeNavigation = () => {
    enablePageScroll();
    setOpenNavigation(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeNavigation();
      }
    };

    if (openNavigation) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [openNavigation]);

  if (loading) {
    return null;
  }

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'backdrop-blur-lg bg-n-8/80 shadow-lg' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo - Updated to match mobile menu */}
          <Link
            to="/"
            className="flex-shrink-0"
            onMouseEnter={() => setIsHoveringLogo(true)}
            onMouseLeave={() => setIsHoveringLogo(false)}
          >
            <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-color-5 to-color-3 flex items-center justify-center transition-all duration-300 ${isHoveringLogo ? 'ring-2 ring-color-5/50' : ''}`}>
              <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4">
            <FuturisticSearchBar />
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Navigation Links - Desktop */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.id}
                  to={item.url}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    pathname.pathname === item.url
                      ? 'text-color-5 bg-n-7/50'
                      : 'text-n-1/70 hover:text-n-1 hover:bg-n-7/30'
                  }`}
                >
                  {item.title}
                </Link>
              ))}
            </nav>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-n-7/50 hover:bg-n-6/80 transition-colors group"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Moon size={18} className="text-n-1/70 group-hover:text-color-5 transition-colors" />
              ) : (
                <Sun size={18} className="text-n-1/70 group-hover:text-color-5 transition-colors" />
              )}
            </button>

            {/* User/Auth Section */}
            {user ? (
              <Link
                to={role === "admin" ? "/admin-dashboard" : "/user-profile"}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-color-5/20 to-color-3/20 hover:from-color-5/40 hover:to-color-3/40 transition-all duration-300 group"
                aria-label={role === "admin" ? "Admin Dashboard" : "User Profile"}
              >
                {role === "admin" ? (
                  <Shield size={18} className="text-n-1/70 group-hover:text-n-1 transition-colors" />
                ) : (
                  <User size={18} className="text-n-1/70 group-hover:text-n-1 transition-colors" />
                )}
              </Link>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/sign-up-page"
                  className="text-sm font-medium text-n-1/50 hover:text-color-5 transition-colors"
                >
                  Create account
                </Link>
                <Button to="/sign-in-page" className="px-4 py-2 bg-gradient-to-r from-color-5 to-color-3 hover:from-color-5/90 hover:to-color-3/90 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                  Sign in
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleNavigation}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full bg-n-7/50 hover:bg-n-6/80 transition-colors"
            aria-label="Toggle menu"
            aria-expanded={openNavigation}
          >
            {openNavigation ? (
              <X size={20} className="text-n-1" />
            ) : (
              <Menu size={20} className="text-n-1" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div 
        className={`fixed inset-0 z-40 backdrop-blur-md bg-n-8/80 transition-opacity duration-300 lg:hidden ${
          openNavigation ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          ref={menuRef}
          className={`absolute top-0 right-0 w-full max-w-xs h-full bg-gradient-to-b from-n-8 to-n-8/95 shadow-2xl transform transition-transform duration-500 ease-in-out ${
            openNavigation ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full overflow-y-auto">
            {/* Header inside mobile menu */}
            <div className="flex items-center justify-between p-4 border-b border-n-6/50">
              <Link to="/" onClick={closeNavigation} className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-color-5 to-color-3 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                </div>
                <span className="text-lg font-medium bg-gradient-to-r from-color-5 to-color-3 bg-clip-text text-transparent">Navigation</span>
              </Link>
              
              <button
                onClick={closeNavigation}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-n-7/50 hover:bg-n-6/80 transition-colors"
              >
                <X size={18} className="text-n-1" />
              </button>
            </div>

            {/* Navigation links */}
            <div className="py-6 px-4">
              <div className="space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.id}
                    to={item.url}
                    onClick={closeNavigation}
                    className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 ${
                      pathname.pathname === item.url
                        ? 'bg-gradient-to-r from-color-5/20 to-color-3/20 text-color-5'
                        : 'text-n-1/70 hover:bg-n-7/30 hover:text-n-1'
                    }`}
                  >
                    <span className="ml-3 font-medium">{item.title}</span>
                    <div className={`ml-auto w-1 h-5 rounded-full ${pathname.pathname === item.url ? 'bg-color-5' : 'bg-transparent'}`}></div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile actions - at the bottom */}
            <div className="mt-auto p-4 border-t border-n-6/50 space-y-4">
              {user ? (
                <Link
                  to={role === "admin" ? "/admin-dashboard" : "/user-profile"}
                  onClick={closeNavigation}
                  className="flex items-center w-full p-3 rounded-lg bg-gradient-to-r from-color-5/10 to-color-3/10 hover:from-color-5/20 hover:to-color-3/20"
                >
                  <div className="w-8 h-8 rounded-full bg-n-7 flex items-center justify-center">
                    {role === "admin" ? (
                      <Shield size={16} className="text-color-5" />
                    ) : (
                      <User size={16} className="text-color-5" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-n-1">{user.name || "User"}</p>
                    <p className="text-xs text-n-1/50">{role === "admin" ? "Admin Dashboard" : "Your Profile"}</p>
                  </div>
                </Link>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/sign-up-page"
                    onClick={closeNavigation}
                    className="flex items-center justify-center p-3 rounded-lg bg-n-7 text-n-1/70 hover:text-n-1"
                  >
                    Create account
                  </Link>
                  <Link
                    to="/sign-in-page"
                    onClick={closeNavigation}
                    className="flex items-center justify-center p-3 rounded-lg bg-gradient-to-r from-color-5 to-color-3 text-white shadow-md"
                  >
                    Sign in
                  </Link>
                </div>
              )}
              
              <button
                onClick={toggleTheme}
                className="flex items-center w-full p-3 rounded-lg hover:bg-n-7/30 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-n-7 flex items-center justify-center">
                  {theme === "dark" ? (
                    <Moon size={16} className="text-color-5" />
                  ) : (
                    <Sun size={16} className="text-color-5" />
                  )}
                </div>
                <span className="ml-3 text-sm font-medium text-n-1/70">
                  {theme === "dark" ? "Dark Mode" : "Light Mode"}
                </span>
                <div className="ml-auto relative">
                  <div className="w-10 h-5 rounded-full bg-n-7"></div>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-color-5 transition-all duration-300 ${theme === "dark" ? "left-5" : "left-1"}`}></div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;