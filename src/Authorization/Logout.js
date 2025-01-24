export const logout = () => {
  sessionStorage.removeItem("authToken"); // Remove the token
  localStorage.removeItem("token");
  localStorage.removeItem("userInfo");
  window.location.href = "/"; // Redirect to login page or home page
};
