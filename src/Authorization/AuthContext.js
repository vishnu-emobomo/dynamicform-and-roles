import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode to decode the JWT token

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState({ company: {}, data: [] });
  const [companyData, setCompanyData] = useState(() => {
    // Load initial state from local storage if available
    const savedData = localStorage.getItem("companyData");
    return savedData ? JSON.parse(savedData) : null;
  });

  const [loading, setLoading] = useState(true); // Loading state
  const [token, setToken] = useState(null);

  // Function to initialize authentication based on the token
  const initializeAuth = async (storedToken) => {
    if (storedToken) {
      try {
        const decodedToken = jwtDecode(storedToken);
        console.log("Decoded Token in AuthProvider:", decodedToken);

        if (decodedToken.exp * 1000 > Date.now()) {
          setToken(storedToken);
          setUserData(decodedToken); // Store user data here
        } else {
          console.warn("Token has expired");
          localStorage.removeItem("token");
          sessionStorage.removeItem("authToken");
        }
      } catch (err) {
        console.error("Error decoding token:", err);
      }
    }

    setLoading(false); // Ensure this runs after all checks
  };

  useEffect(() => {
    // Save companyData to local storage whenever it changes
    if (companyData) {
      localStorage.setItem("companyData", JSON.stringify(companyData));
    }
  }, [companyData]);

  useEffect(() => {
    const storedToken =
      localStorage.getItem("token") || sessionStorage.getItem("authToken");

    if (storedToken) {
      initializeAuth(storedToken); // Call initialization if token exists
    } else {
      setLoading(false); // If no token, stop loading
    }
  }, []);

  // Method for login - updates context after successful login
  const login = (token, company) => {
    localStorage.setItem("token", token); // Store token in localStorage
    sessionStorage.setItem("authToken", token); // Store token in sessionStorage for persistence
    setCompanyData(company);
    initializeAuth(token); // Call initializeAuth after login to set context
  };

  return (
    <AuthContext.Provider
      value={{ userData, token, loading, login, companyData }}
    >
      {children}
    </AuthContext.Provider>
  );
};
