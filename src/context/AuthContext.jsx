import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // ✅ Use named import

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role");

    if (storedToken && storedUser && storedRole) {
      try {
        const decodedToken = jwtDecode(storedToken); // Decode the token
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setRole(storedRole);
      } catch (error) {
        console.error("Invalid token:", error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, token, role) => {
    setUser(userData);
    setToken(token);
    setRole(role);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("role", role);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setRole(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    window.location.href = "/"; // Redirect to login page
  };

  // Add the updateUser function
  const updateUser = (updatedUser) => {
    setUser(updatedUser); // Update the user state
    localStorage.setItem("user", JSON.stringify(updatedUser)); // Update user in localStorage
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        login,
        logout,
        updateUser, // Include updateUser in the context value
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};