import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../Authorization/AuthContext";

const ProtectedRoute = ({ element: Component, requiredPermissions = [] }) => {
  const location = useLocation();
  // const token = localStorage.getItem("token");
  const { userData, token, loading } = useContext(AuthContext);

  // Show a loading indicator while user data is being fetched
  if (loading) {
    return <p>Loading...</p>;
  }

  // Redirect to login if no token
  if (!token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Check if user data and permissions exist
  const userPermissions = userData?.data?.[0]?.Permissions || [];
  const userRole = userData?.data?.[0]?.Role;

  // If the role is 'admin', allow access without checking permissions
  if (userRole === "admin") {
    return Component;
  }

  // Check if the user has the required permissions
  const hasRequiredPermissions = requiredPermissions.every(
    ({ objectType, permission }) =>
      userPermissions.some(
        (perm) => perm.ObjectType === objectType && perm[permission] === true
      )
  );

  // Redirect if any required permission is missing
  if (!hasRequiredPermissions) {
    return <Navigate to="/NoPermission" state={{ from: location }} replace />;
  }

  // Render the protected component if all checks pass
  return Component;
};

export default ProtectedRoute;
