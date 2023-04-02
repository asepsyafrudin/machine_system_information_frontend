import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute(props) {
  const user = localStorage.getItem("user");

  const { children } = props;
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children ? children : <Outlet />;
}

export default ProtectedRoute;
