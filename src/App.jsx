import { ThemeProvider } from "./components/ThemeContext"; // Import the ThemeProvider
import {AuthProvider} from "./context/AuthContext.jsx"; // Import the AuthProvider

import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Benefits from "./components/Benefits";
import ArticlePage from "./components/ArticlePage"; // Ensure the correct import
import MapPage from "./Pages/MapPage";
import Footer from "./components/Footer";
import ButtonGradient from "./assets/svg/ButtonGradient";
import SignInPage from "./Pages/SignInPage";
import SignUpPage from "./Pages/SignUpPage";
import Roadmap from "./components/Roadmap";
import SocialMediaPage from "./Pages/SocialMediaPage";
import UserProfile from "./components/UserProfile";
import PrivateRoute from "./components/PrivateRoute"; // Import PrivateRoute for protected routes
import AdminDashboard from "./components/AdminDashboard";
import NewArticlePage from "./components/NewArticlePage"; // Import the NewArticlePage
import ArticlesShowcase from "./components/ArticlesShowcase"; // Import the ArticlesShowcase

const App = () => {
  return (
    <AuthProvider> {/* Wrap the entire app with AuthProvider */}
      <ThemeProvider>
        <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
          <Header />
          <Routes>
            {/* Public Routes */}
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
            <Route path="/article/:id" element={<ArticlePage />} /> {/* Dynamic route for articles */}
            <Route path="/map-page" element={<MapPage />} />
            <Route path="/sign-in-page" element={<SignInPage />} />
            <Route path="/sign-up-page" element={<SignUpPage />} />
            <Route path="/social-media-page" element={<SocialMediaPage />} />

           
            <Route
              path="/user-profile"
              element={
               
                  <UserProfile />
               
              }
            />
            <Route
              path="/admin-dashboard"
              element={
                
                  <AdminDashboard />
                
              }
            />
            <Route
              path="/new-article"
              element={
               
                  <NewArticlePage />
               
              }
            />
            <Route
              path="/articles"
              element={
                
                  <ArticlesShowcase />
                
              }
            />
          </Routes>
          <Footer />
        </div>
        <ButtonGradient />
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;