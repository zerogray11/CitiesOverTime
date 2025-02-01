// App.js
import { ThemeProvider } from "./components/ThemeContext"; // Import the ThemeProvider
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Benefits from "./components/Benefits";
import ArticlePage from "./components/Articlepage";
import MapPage from "./Pages/MapPage";
import Footer from "./components/Footer";
import ButtonGradient from "./assets/svg/ButtonGradient";
import SignInPage from "./Pages/SignInPage";
import SignIn from "./components/SignIn";
import "mapbox-gl/dist/mapbox-gl.css";
import SignUpPage from "./Pages/SignUpPage";
import Roadmap from "./components/Roadmap";
import SocialMediaPage from "./Pages/SocialMediaPage";

const App = () => {
  return (
    <ThemeProvider>
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Header />
        <Routes>
          <Route
            exact
            path="/"
            element={
              <>
                <Hero />
                <Benefits />
              </>
            }
          />
          <Route path="/article-page" element={<ArticlePage />} />
          <Route path="/map-page" element={<MapPage />} />
          <Route path="/sign-in-page" element={<SignInPage />} />
          <Route path="/sign-up-page" element={<SignUpPage />} />
          <Route path="/social-media-page" element={<SocialMediaPage />} />
        </Routes>
        <Footer />
      </div>
      <ButtonGradient />
    </ThemeProvider>
  );
};

export default App;