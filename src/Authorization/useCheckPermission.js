import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export const useCheckPermission = () => {
  const { userData } = useContext(AuthContext);

  // Get permissions from user data
  const permissions = userData?.data?.[0]?.Permissions || [];
  const userRole = userData?.data?.[0]?.Role;

  if (userRole === "admin") {
    return checkPermission;
  }

  const checkPermission = (objectType, action) => {
    if (!Array.isArray(permissions) || !objectType || !action) {
      console.error("Invalid input to checkPermission function");
      return false;
    }

    const permission = permissions.find(
      (perm) => perm.ObjectType === objectType
    );
    return permission ? permission[action] || false : false;
  };

  return checkPermission;
};
