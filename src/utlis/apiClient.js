import axios from "axios";

// Create an Axios instance
const apiClient = axios.create({
  withCredentials: true, // If using cookies
  headers: { "Content-Type": "application/json" },
});

// Add a request interceptor to dynamically set the base URL and include the JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("authToken");

    // Set base URL based on the request URL or some condition
    if (config.url.includes("/api/vendor")) {
      config.baseURL =
        "https://rnl2s9ho61.execute-api.ap-south-1.amazonaws.com/Dev";
    } else if (config.url.includes("/api/user/login")) {
      config.baseURL =
        "https://09p1dibo6a.execute-api.ap-south-1.amazonaws.com/dev";
    } 
    
    else if (config.url.includes("/api/tender/")) {
      config.baseURL =
        "https://natapvtqhj.execute-api.ap-south-1.amazonaws.com/Dev";
    } 

    else if (config.url.includes("/api/lineitem/")) {
      config.baseURL =
        "https://natapvtqhj.execute-api.ap-south-1.amazonaws.com/Dev";
    } 
    
    else if (config.url.includes("/api/pdf/")) {
      config.baseURL =
        "https://ie2us8ure5.execute-api.ap-south-1.amazonaws.com/Dev";
    } 
    else if (config.url.includes("/api/remove")) {
      config.baseURL =
        "https://natapvtqhj.execute-api.ap-south-1.amazonaws.com/Dev";
    } 
    else if (config.url.includes("/api/line-item/")) {
      config.baseURL =
        "https://z0qexibhsk.execute-api.ap-south-1.amazonaws.com/Dev";
    } 
    else if (config.url.includes("/api/project/")) {
      config.baseURL =
        "https://z0qexibhsk.execute-api.ap-south-1.amazonaws.com/Dev";
    } else if (config.url.includes("/api/product/")) {
      config.baseURL =
        "https://622xlqs7dh.execute-api.ap-south-1.amazonaws.com/Dev";
    } else if (config.url.includes("/api/receipts")) {
      config.baseURL =
        "https://rnl2s9ho61.execute-api.ap-south-1.amazonaws.com/Dev";
    } 
    else if (config.url.includes("/api/customer")) {
      config.baseURL =
        "https://rnl2s9ho61.execute-api.ap-south-1.amazonaws.com/Dev";
    } 
    else if (config.url.includes("/api/work.order")) {
      config.baseURL =
        "https://q3cyoq1992.execute-api.ap-south-1.amazonaws.com/Dev";
    } 
    else if (config.url.includes("/api/search")) {
      config.baseURL =
        "https://qzafgyqz0i.execute-api.ap-south-1.amazonaws.com/Dev";
    } 
    else if (config.url.includes("/api/in-out-source")) {
      config.baseURL =
        "https://o9w4zvepzh.execute-api.ap-south-1.amazonaws.com/Dev";
    } 
    else if (config.url.includes("/api/tools")) {
      config.baseURL =
        "https://ao3vbpwx0e.execute-api.ap-south-1.amazonaws.com/Dev";
    } 
    else if (config.url.includes("/api/s3-file")) {
      config.baseURL =
        "https://a9ut8qu643.execute-api.ap-south-1.amazonaws.com/Dev";
    } 
    else if (config.url.includes("/api/inventory/")) {
      config.baseURL =
        "https://lmz2xjnhoc.execute-api.ap-south-1.amazonaws.com/Dev";
    } 
    else if (config.url.includes("/api/Dynamic")) {
      config.baseURL =
        "https://9m9ervqfqe.execute-api.ap-south-1.amazonaws.com/Prod";
    } else {
      config.baseURL =
        "https://wkb0n6m2yk.execute-api.ap-south-1.amazonaws.com/Dev";
    }

    // Set Authorization header if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { status } = error.response || {};

    if (status === 401) {
      // Token is expired or invalid; redirect to login page
      sessionStorage.removeItem("authToken"); // Clear expired token
      window.location.href = "/"; // Redirect to login page
    }

    return Promise.reject(error);
  }
);

export default apiClient;