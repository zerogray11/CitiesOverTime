import { useLocation } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { Link } from "react-router-dom";
import { navigation } from "../constants";
import Button from "./Button";
import MenuSvg from "../assets/svg/MenuSvg";
import { useState, useContext, useEffect, useRef } from "react";
import FuturisticSearchBar from "./FuturisticSearchBar";
import { ThemeContext } from "../components/ThemeContext";
import { User, Shield } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, role, loading } = useContext(AuthContext);
  const pathname = useLocation();
  const [openNavigation, setOpenNavigation] = useState(false);
  const [isHoveringLogo, setIsHoveringLogo] = useState(false);
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
    <header className="fixed top-0 left-0 w-full z-50 border-b border-n-6 bg-n-8/90 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex-shrink-0 relative"
            onMouseEnter={() => setIsHoveringLogo(true)}
            onMouseLeave={() => setIsHoveringLogo(false)}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-color-5 to-color-3 flex items-center justify-center overflow-hidden">
              <div className={`absolute inset-0 rounded-full border-2 border-n-1 transition-all duration-500 ${
                isHoveringLogo ? "scale-90 opacity-80" : "scale-100 opacity-100"
              }`}></div>
              <div className={`w-2 h-2 rounded-full bg-n-1 transition-all duration-300 ${
                isHoveringLogo ? "scale-150" : "scale-100"
              }`}></div>
              <div className={`absolute inset-0 rounded-full bg-color-5 opacity-0 ${
                isHoveringLogo ? "animate-ping opacity-20" : ""
              }`}></div>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4">
            <FuturisticSearchBar />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <nav className="flex space-x-6">
              {navigation.map((item) => (
                <Link
                  key={item.id}
                  to={item.url}
                  className={`font-code text-sm uppercase transition-colors hover:text-color-5 ${
                    pathname.pathname === item.url ? "text-n-1" : "text-n-1/50"
                  }`}
                >
                  {item.title}
                </Link>
              ))}
            </nav>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-n-7 hover:bg-n-6 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? "🌙" : "☀️"}
            </button>

            {/* User/Auth Section */}
            {user ? (
              <Link
                to={role === "admin" ? "/admin-dashboard" : "/user-profile"}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-n-7 hover:bg-n-6 transition-colors"
                aria-label={role === "admin" ? "Admin Dashboard" : "User Profile"}
              >
                {role === "admin" ? (
                  <Shield size={20} className="text-n-1" />
                ) : (
                  <User size={20} className="text-n-1" />
                )}
              </Link>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/sign-up-page"
                  className="text-sm uppercase font-code text-n-1/50 hover:text-n-1 transition-colors"
                >
                  New account
                </Link>
                <Button to="/sign-in-page" className="px-4 py-2">
                  Sign in
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleNavigation}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full bg-n-7 hover:bg-n-6 transition-colors"
            aria-label="Toggle menu"
            aria-expanded={openNavigation}
          >
            <MenuSvg openNavigation={openNavigation} />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {openNavigation && (
        <div className="fixed inset-0 z-40 bg-n-8/95 backdrop-blur-md lg:hidden">
          <div 
            ref={menuRef}
            className="absolute top-0 right-0 w-full sm:w-80 h-full bg-n-8 border-l border-n-6 shadow-2xl transform transition-transform duration-300 ease-in-out"
            style={{ maxWidth: "100%" }}
          >
            <div className="p-6">
              {/* Close button (same as hamburger icon) */}
              <div className="flex justify-end">
                <button
                  onClick={closeNavigation}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-n-7 hover:bg-n-6 transition-colors"
                  aria-label="Close menu"
                >
                  <MenuSvg openNavigation={true} />
                </button>
              </div>

              <div className="mt-8 flex flex-col space-y-6">
                {navigation.map((item) => (
                  <Link
                    key={item.id}
                    to={item.url}
                    onClick={closeNavigation}
                    className={`font-code text-lg uppercase py-3 px-4 rounded-lg transition-colors ${
                      pathname.pathname === item.url 
                        ? "bg-n-7 text-n-1" 
                        : "text-n-1/50 hover:bg-n-7 hover:text-n-1"
                    }`}
                  >
                    {item.title}
                  </Link>
                ))}

                <button
                  onClick={() => {
                    toggleTheme();
                    closeNavigation();
                  }}
                  className="font-code text-lg uppercase py-3 px-4 rounded-lg bg-n-7 text-n-1 hover:bg-n-6 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>{theme === "dark" ? "🌙" : "☀️"}</span>
                  <span>Theme</span>
                </button>

                {user ? (
                  <Link
                    to={role === "admin" ? "/admin-dashboard" : "/user-profile"}
                    onClick={closeNavigation}
                    className="font-code text-lg uppercase py-3 px-4 rounded-lg bg-n-7 text-n-1 hover:bg-n-6 transition-colors flex items-center justify-center space-x-2"
                  >
                    {role === "admin" ? (
                      <>
                        <Shield size={20} />
                        <span>Dashboard</span>
                      </>
                    ) : (
                      <>
                        <User size={20} />
                        <span>Profile</span>
                      </>
                    )}
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/sign-up-page"
                      onClick={closeNavigation}
                      className="font-code text-lg uppercase py-3 px-4 rounded-lg text-n-1/50 hover:bg-n-7 hover:text-n-1 transition-colors text-center"
                    >
                      New Account
                    </Link>
                    <Button
                      to="/sign-in-page"
                      onClick={closeNavigation}
                      className="w-full py-3 text-center"
                    >
                      Sign In
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;