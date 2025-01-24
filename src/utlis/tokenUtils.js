import {jwtDecode} from "jwt-decode";

// Function to decode the token and extract user information
export const getUserFromToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    console.log("Decoded user info:", decoded);

    // Save decoded user info in local storage
    localStorage.setItem("userInfo", JSON.stringify(decoded));

    return decoded;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

// Function to get the token from local storage
export const getToken = () => localStorage.getItem("token");

// Function to get the user info from local storage
export const getUserInfo = () => {
  const userInfo = localStorage.getItem("userInfo");
  return userInfo ? JSON.parse(userInfo) : null;
};

export const getUserId = () => {
  const token = getToken();
  if (token) {
    try {
      const decoded = jwtDecode(token);
      return decoded.UserId || null; // Return UserId if it exists, otherwise null
    } catch (error) {
      console.error("Failed to decode token:", error);
      return null;
    }
  }
  return null; // Return null if token is not found
};
