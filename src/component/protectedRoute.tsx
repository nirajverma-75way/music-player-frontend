import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../store/store";

interface ProtectedRouteProps {
  //allowedRoles: string[]; // Specify allowed roles for this route
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
}) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  console.log(isAuthenticated)
  if (!isAuthenticated) {
    // Redirect to login if not authenticated, preserving the intended route
    return <Navigate to="/authenticate" />;
  }

  // Render the children if authentication and role checks pass
  return children;
};

export default ProtectedRoute;