import { useLocation } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { Link } from "react-router-dom";
import { brainwave } from "../assets";
import { navigation } from "../constants";
import Button from "./Button";
import MenuSvg from "../assets/svg/MenuSvg";
import { HamburgerMenu } from "./design/Header";
import { useState, useContext } from "react"; // Import useContext
import FuturisticSearchBar from "./FuturisticSearchBar"; // Import the search bar component
import { ThemeContext } from "../components/ThemeContext"; // Import ThemeContext

const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext); // Access theme and toggle function
  const pathname = useLocation();
  const [openNavigation, setOpenNavigation] = useState(false);

  const toggleNavigation = () => {
    if (openNavigation) {
      setOpenNavigation(false);
      enablePageScroll();
    } else {
      setOpenNavigation(true);
      disablePageScroll();
    }
  };

  const handleClick = () => {
    if (!openNavigation) return;

    enablePageScroll();
    setOpenNavigation(false);
  };

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 border-b border-n-6 lg:bg-n-8/90 lg:backdrop-blur-sm ${
        openNavigation ? "bg-n-8" : "bg-n-8/90 backdrop-blur-sm"
      }`}
    >
      <div className="flex items-center px-5 lg:px-7.5 xl:px-10 max-lg:py-4">
        <Link className="flex items-center w-auto xl:mr-8" to="/">
          <img
            className="rounded-full"
            src="../public/citiesovertime.jpeg"
            width={40}
            height={40}
            alt="CitiesOverTime"
          />
          <span className="ml-3 text-white text-lg font-semibold">
            CitiesOverTime
          </span>
        </Link>

        {/* Place the FuturisticSearchBar here */}
        <div className="flex-1 flex justify-center mx-4">
          <FuturisticSearchBar />
        </div>

        <nav
          className={`${
            openNavigation ? "flex" : "hidden"
          } fixed top-[5rem] left-0 right-0 bottom-0 bg-n-8 lg:static lg:flex lg:mx-auto lg:bg-transparent`}
        >
          <div className="relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row">
            {navigation.map((item) => (
              <a
                key={item.id}
                href={item.url}
                onClick={handleClick}
                className={`block relative font-code text-2xl uppercase text-n-1 transition-colors hover:text-color-5 ${
                  item.onlyMobile ? "lg:hidden" : ""
                } px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-xs lg:font-semibold ${
                  item.url === pathname.hash
                    ? "z-2 lg:text-n-1"
                    : "lg:text-n-1/50"
                } lg:leading-5 lg:hover:text-n-1 xl:px-12`}
              >
                {item.title}
              </a>
            ))}
          </div>

          <HamburgerMenu />
        </nav>

        {/* Theme Toggle Button */}
        <button
  onClick={toggleTheme}
  className="flex items-center justify-center mr-12 p-2 bg-n-7 text-n-1 rounded-lg hover:bg-n-6 transition-all lg:hidden mx-auto" // Center on small/medium screens
>
  {theme === "dark" ? "🌙" : "☀️"}
</button>

<button
  onClick={toggleTheme}
  className="hidden lg:flex items-center justify-center mr-8 p-2 bg-n-7 text-n-1 rounded-lg hover:bg-n-6 transition-all" // Visible only on large screens
>
  {theme === "dark" ? "🌙" : "☀️"}
</button>

        <a
          href="/sign-up-page"
          className="button hidden mr-8 text-n-1/50 transition-colors hover:text-n-1 lg:block"
        >
          New account
        </a>

        <Button className="hidden lg:flex" href="/sign-in-page">
          Sign in
        </Button>

        <Button
          className="ml-auto lg:hidden"
          px="px-3"
          onClick={toggleNavigation}
        >
          <MenuSvg openNavigation={openNavigation} />
        </Button>
      </div>
    </div>
  );
};

export default Header;